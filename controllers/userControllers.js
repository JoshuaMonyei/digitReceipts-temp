const User = require('../models/Users');
const nodemailer = require('nodemailer');
const crypto = require('crypto')
const  bcrypt = require('bcrypt');
const {SECRET} = process.env;
const expiry = 84600;

// user signup
exports.signup = async (req, res) => {
    // destructuring user details from req body
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        req.flash('error', "Please fill in all required fields");
        return res.redirect("/signup");
    }
    User.findOne({email: email}, (err, existingUser) => {
        if(existingUser) {
            req.flash('error', "User with this email already exists.");
            return res.redirect("/signup");
        }
        var user = new User({
            name,
            email,  
            password,
            emailtoken: crypto.randomBytes(64).toString("hex"),
            isVerified: false,
        });
        // SMTP transporter for nodemailer 
        const transporter = nodemailer.createTransport({
            service: "hotmail",
            // created this outlook acct for project
            auth: {
                user: "flashreceipts@outlook.com",
                pass: "zuri1234"
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


        // hash users password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect("/signup");
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    req.flash('error', err.message);
                    return res.redirect("/signup"); 
                }
                user.password = hash
                user.save()
            })
        })
        // Send confirmation mail to user after successful registration
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                req.flash("error", "Something went wrong, Please contact us for assistance.")
                return res.redirect('/');
            }
            req.flash("success", "Thanks for registering. please check your email to activate your account.")
            return res.redirect('/login');
        })

    })
}


exports.verifyEmail = async (req, res, next) => {
    try{
        const user = await User.findOne({emailToken: req.query.token});
        if(!user) {
            req.flash('error', "Token is invalid. Please contact us for assistance")
            return res.redirect('/');
        }
        // deleting verified user emailToken in the DB
        user.emailToken = null;
        // change user .isVerified value to true
        user.isVerified = true;
        await user.save();
        req.flash("success", `Hello ${user.name}, welcome to Flash Receipts`)
        return res.redirect('/login');
    } catch(error) {
        req.flash('error', "Something went wrong. Please contact us for assistance.");
        res.redirect('/');
    }
}