const express = require('express');
const connectDB = require('./db/connectDB');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Initialize express
const app = express();

//  Passport config
require('./config/passport')(passport);

// Connect to the database
connectDB();

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash 
app.use(flash());

// Global Vars for flash
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Initialize Express middleware
app.use(express.json({extended: false}));

const port = process.env.PORT || 9001

// Listen to connections
app.listen(port, () => console.log(`Server up and running on port ${port}`));