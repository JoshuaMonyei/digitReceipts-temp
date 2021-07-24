const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/auth');
const { formParser } = require('../middlewares/receiptFormParser')

//import receiptController
const receiptController = require('../controllers/receiptControllers')

// create receipt
router.post('/receipt', isLoggedIn, formParser, receiptController.createReceipt);

// delete receipt
router.get('/receipt/delete/:receiptId', isLoggedIn, receiptController.deleteReceipt)

// get receipt form 2
router.get('/receipt-red', isLoggedIn, (req, res) => {
    const user = req.user
    res.render("receipt2-form", {
        layout: false,
        user})
});


//get receipt form 1
router.get('/receipt-blue', isLoggedIn, (req, res) => {
    const user = req.user
    res.render("receipt1-form", {
        layout: false,
        user})
});

// get receipt form 3
router.get('/receipt-black', isLoggedIn, (req, res) => {
    const user = req.user
    res.render("receipt3-form", {
        layout: false,
        user})
});

// get receipt options page
router.get('/receipt-options', isLoggedIn, (req, res) => {
    const user = req.user
    const receipt = req.cookies.receipt
    res.render("receipts-options", {
        layout: false,
        user,
        receipt})
});

// route displaying view to email receipts
router.get('/receipt-mailForm', isLoggedIn, (req, res) => {
    const user = req.user
    res.render("email-receipts", {
        layout: false,
        user})
});

// post route to send pdf receipts to customer email 
router.post('/receipt-mailForm', isLoggedIn, receiptController.emailReceipt);

// route displaying view to download email receipts
router.get('/receipt-download', isLoggedIn, (req, res) => {
    const user = req.user
    res.render("receiptDownload", {
        layout: false,
        user})
});


//fetch all receipts for history route
// router.get('/allreceipts', receiptController.allReceipts)

//show specific receipts

module.exports = router;
