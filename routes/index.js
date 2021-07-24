const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares/auth');

// root route
router.get('/', function(req, res) {
    res.render("landing")
});

//dashboard view
router.get('/dashboard', isLoggedIn, (req, res) => {
    const user = req.user
    res.render("dashboard", {
        layout: false,
        user})
});

router.get('/terms', isLoggedIn, (req, res) => {
    const user = req.user
    res.render("terms", {
        layout: false,
        user})
});


 module.exports = router;
