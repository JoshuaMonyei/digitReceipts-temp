const User = require('../models/Users');
const {validationResult} = require('express-validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto')
const  bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;
const expiry = 84600;

// user signup
exports.signup = async (req, res) => {
    // destructuring user details from req body
    const {name, email, password} = req.body;
    let errors = [];
    // check required fields
    if (!name || !email || !password) {
        errors.push({msg: "Please fill all required fields"})
    }
    if(password.length < 6) {
        errors.push({msg: "Password should be at least 6 characters"});
    }
    if (errors.length > 0) {
        res.render('register', {
            layout: false,
            errors,
            name,
            email,
            password
        });
    } else {
        User.findOne({email}, (err, existingUser) => {
            if(existingUser) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    layout: false,
                  errors,
                  name,
                  email,
                  password
                }); 
            } else {
                var user = new User({
                    name,
                    email,  
                    password,
                    emailToken: crypto.randomBytes(64).toString("hex"),
                    isVerified: false,
                });
                // SMTP transporter for nodemailer 
                const transporter = nodemailer.createTransport({
                    service: "hotmail",
                    // created this outlook acct for project
                    auth: {
                        user: process.env.MAIL,
                        pass: process.env.MAILPASSWORD
                    },
                })
                // Mail structure and contents.
                const mailOptions = {
                    from: 'flashreceipts@outlook.com',
                    to: email,
                    subject: "Flash Reciepts - verify your email",
                    text: `
                    Hello, thanks for registering on our site.
                    Please copy and paste the address below to verify your account.
                    http://${req.headers.host}/verify-email?token=${user.emailToken}`,
                    html: `
                    <h1>Hello,</h1>
                    <p>Thanks for registering on our site.</p>
                    <P>Please click the link below to verify your account</p>
                    <a href= "http://${req.headers.host}/verify-email?token=${user.emailToken}">Verify your account</a>`
                }
                // Send confirmation mail to user after successful registration
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        errors.push({ msg: 'Error with mail verification please contact us for assistance' });
                        res.render('register', {
                            layouts: false,
                          errors,
                          name,
                          email,
                          password
                        });
                    }
                // hash users password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) throw err;
                        // set password to hash
                        user.password = hash
                        user.save()
                        req.flash('success_msg', "Thanks for registering. please check your email to activate your account.")
                        return res.redirect('/login');
                    })
                })
                
                    
                })
            }
            
        })
    }
    
    
}


exports.verifyEmail = async (req, res, next) => {
    try{
        const user = await User.findOne({emailToken: req.query.token});
        if(!user) {
            req.flash('error_msg', "Token is invalid. Please contact us for assistance")
            return res.redirect('/');
        }
        // deleting verified user emailToken in the DB
        user.emailToken = null;
        // change user .isVerified value to true
        user.isVerified = true;
        await user.save();
        req.flash("success_msg", `Hello ${user.name}, you've successfully confirmed your email`)
        return res.redirect('/login');
    } catch(error) {
        req.flash('error_msg', "Something went wrong. Please contact us for assistance.");
        res.redirect('/');
    }
}

exports.login = async (req, res, next) => {
    // check for errors in email input
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        req.flash('error_msg', "Invalid input");
        return res.redirect('/login')
    }
    // else
    try {
        User.findOne({email: req.body.email}, (err, confirmedUser) => {
            if (!confirmedUser){
                req.flash('error_msg', "Invalid email, You're yet to be registered")
                return res.redirect('/login');
            }
            // check if registered has verified emailToken
            if (!confirmedUser.isVerified){
                req.flash('error_msg', "Please verify your email to login")
                return res.redirect('/login');
            }
             //check password is correct
            let isMatch = bcrypt.compareSync(req.body.password, confirmedUser.password)
            if (!isMatch){
                req.flash('error_msg', "Email and password do not match")
                return res.redirect('/login')
            }
            jwt.sign({
                id: confirmedUser.id,
                name: confirmedUser.name,
            }, secret, {
                expiresIn: expiry
            }, (err, token) => {
                res.cookie('token', token, {
                    expires: new Date(Date.now() + 43200000),
                    secure: false, // set to true if your using https
                    httpOnly: true,
                  });
                req.flash('success_msg', "Logged in successfully")
                return res.redirect('/dashboard')
            })
        })
    } catch (error) {
        req.flash('error_msg', error)
        return res.redirect('/login');
    }
    
}

exports.logout =(req, res) => {
    res.cookie('token', '', {
        expires: new Date(Date.now() + 1)
    });
    req.flash('success_msg', "Logged out")
    return res.redirect('/')
}


