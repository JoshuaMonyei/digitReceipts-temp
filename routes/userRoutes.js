const express = require('express');
const User = require('../models/Users');
const Receipt = require('../models/Receipts');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/auth');

// import user controller
const userController = require("../controllers/userControllers");

// show register form
router.get('/register', function(req, res) {
    res.render("register", {layout: false})
});

// handle signup logic
router.post('/register', userController.signup);

// route for email confirmation
router.get('/verify-email', userController.verifyEmail);

// show login form
router.get('/login', function(req, res) {
    res.render("login", {layout: false})
});

// handles login logic
router.post('/login', userController.login);


// Logout Handler
router.get('/logout', userController.logout)


// user settings route
router.get('/user/settings', isLoggedIn, function(req, res) {
    const user = req.user
    res.render("settings", {
        layout: false,
        user})
});

router.get('/user/history', isLoggedIn, async (req, res) => {
    const user = req.user
    const foundUser = await User.findById({_id: req.user.id}).populate({path: "receipts", model: Receipt});
    const receipts = foundUser.receipts.reverse()
    res.render("history", {
        layout: false,
        user,
        receipts,
        })
});

// user settings route
router.get('/user/notification', isLoggedIn, function(req, res) {
    const user = req.user
    res.render("notification", {
        layout: false,
        user})
});

router.get('/user/paper-settings', isLoggedIn, function(req, res) {
    const user = req.user
    res.render("paper", {
        layout: false,
        user})
});

module.exports = router;
