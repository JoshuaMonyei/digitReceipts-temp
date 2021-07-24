const express = require('express');
const connectDB = require('./db/connectDB');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload')
const userRoutes = require('./routes/userRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const Routes = require('./routes/index');

require('dotenv').config();

// Initialize express
const app = express();

// use static files
app.use(express.static('./public'));

// enable files upload
app.use(fileUpload({
    createParentPath: true
}))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Connect flash 
app.use(flash());

// Global Vars for flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Initialize Express middleware
app.use(express.json({extended: false}));
app.use(cookieParser());
app.use(Routes, userRoutes, receiptRoutes);

const port = process.env.PORT || 9001

// Listen to connections
app.listen(port, () => console.log(`Server up and running on port ${port}`));

