const mongoose = require('mongoose');
require('dotenv').config();

const {MONGO_URI} = process.env;

// Create database connection
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('Database Connected...');

    } catch (error) {
        console.log("DB connection error");
        process.exit();
    }
  
}

module.exports = connectDB;