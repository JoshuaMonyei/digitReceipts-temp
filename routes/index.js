const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares/loggedIn');

// root route
router.get('/', function(req, res) {
    res.render("landing")
});

//dashboard view
router.get('/dashboard',isLoggedIn, (req, res) => {
    res.render("dashboard");
})

 module.exports = router;