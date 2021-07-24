const Receipt = require('../models/Receipts');
const User = require('../models/Users');
const ejs = require('ejs');
const {validationResult} = require('express-validator');
const nodemailer = require('nodemailer');
const { generatePdf } = require('../helper/generatePdf');
const { uploadFile, getFileLink, uploadLogo, getLogoLink } = require('../helper/uploadFile.js');
const http = require('https');


// create receipt
exports.createReceipt = async (req, res) => {
    try {
        // destructure items from req.body
        const { tempItems, subTotal, salesTax, total } = req.body
        // create new receipt instance
        const newReceipt = new Receipt(req.body)
        // get user that created receipt 
        const foundUser = await User.findById(req.user.id)
        newReceipt.user = foundUser
        
        var logoLink 
        // if user provides logo image
        if (req.files) {
            const logo = req.files.logo
            // upload logo image
            await uploadLogo(logo.data, logo.mimetype.split('/')[1], req.user.id)
            // get logo image if it's the first time for a user uploading an image
            logoLink = await getLogoLink(logo.mimetype.split('/')[1], req.user.id, newReceipt._id)
            // set logoLink value to foundUser.logoLink value if the user had previously uploaded before
            // or set to link of new uploads
            // uploads from a user overwrite previous upload
            // hence the link is the same as previous upload
            logoLink = foundUser.logoLink || logoLink.split('?')[0]+"?raw=1" 
        }
        // set logo link
        newReceipt.companyLogo = logoLink
        // set foundUser.logoLink to logo link if new
        foundUser.logoLink = foundUser.logoLink || logoLink
        // loop through items bought and push to Receipt.items
        tempItems.forEach( ele => {
            newReceipt.items.push(ele)
        })

        newReceipt.subTotal = Number(subTotal)
        newReceipt.salesTax = Number(salesTax)
        newReceipt.total = Number(total)

        // render page 
        const pageContent = await ejs.renderFile(`${__dirname}/../views/receiptTemplates/template${req.body.formId}.ejs`, {
            layout: false,
            receipt: newReceipt
        })
        // generate pdf
        const pdf = await generatePdf(pageContent)
        // upload pdf
        await uploadFile(pdf, foundUser._id, newReceipt._id)
        // get pdf link
        const link = await getFileLink(foundUser._id, newReceipt._id)
        // replace last character in the link to enable automatic download
        // var fileLink = link.replace(/.$/,"1")
        // set receipt.pdfLink to pdf link and receipt.companyLogo to logo link
        newReceipt.pdfLink = link.split('?')[0]+"?raw=1"
        await newReceipt.save()
        // push created receipt to User.receipts
        foundUser.receipts.push(newReceipt)
        await foundUser.save()
        res.cookie('receipt', newReceipt, { httpOnly: true })
        res.redirect('/receipt-options')
      
    } catch(err) { console.log(err) }
}

// delete receipt
exports.deleteReceipt = async (req, res) => {
    try{
        // destructure receipt id from url query
        const { receiptId } = req.params
        // find receipt creator
        const foundReceipt = await Receipt.findById(receiptId)
        const foundUser = await User.findById(foundReceipt.user)
        // delete receipt from creators receipts array
        console.log(`removing ${receiptId} from ${foundUser._id}`)
        foundUser.receipts.pull(receiptId)
        await foundUser.save()
        console.log(`successfully removed ${receiptId} from ${foundUser._id}`)
        // find and delete receipt
        await Receipt.findOneAndDelete({_id: receiptId})
        console.log(`successfully remove receipt ${receiptId}`)
        res.redirect('/user/history')
    } catch(err) { console.log(err) }
}

// mail receipt
exports.emailReceipt = async (req, res) => {
    const {name, email} = req.body;
    const receipt = req.cookies.receipt
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
        subject: `${receipt.companyName} Receipt`,
        text: `
        Hello, ${name}
        We've receieved payment for your requested items. Thanks for your patronage and we'd like to see you soon.
        Find attached a link below to download your receipt
        ${receipt.pdfLink}`,
        html: `
        <h1>Hello ${name},</h1>
        <p>We've receieved payment for your requested items. Thanks for your patronage and we expect to see you soon</p>
        <P>Find attached a link below to download your receipt</p>
        ${receipt.pdfLink}`
    }
    // Send confirmation mail to user after successful registration
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            return res.redirect('/receipt-mailForm')
        }
        return res.redirect('/dashboard')
    })
}

exports.downloadReceipt = function (req, res) {
    const receipt = req.cookies.receipt
    res.status(301).redirect(`${receipt.pdfLink}`)
}
