const mongoose = require('mongoose')

// Receipt schema
const ReceiptSchema = new mongoose.Schema({
    receiptId: {
        type: String,
        default: mongoose.Types.ObjectId().toString().slice(0, 6) 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dateIssued: {
        type: String,
        default: Date(Date.now()).toString().slice(4,15)
    },
    //user information
    // store link/path to logo if user chooses to upload img
    companyLogo: {
        type: String
    },
    companyName: {
        type: String,
    //  required: true
    },
    companyAddress: {
        type: String,
    },
    companyPhoneNumber: {
        type: String,
        //required: true
    },
    companyEmail: {
        type: String
    },
    // client information
    clientName: {
        type: String
    },
    clientPhoneNumber: {
        type: String
    },
    clientEmail: {
        type: String,
    //    required: true
    },
    clientAddress: {
        type: String
    },
    // if template has two clients (bill, deliver)
    client1Name: {
        type: String
    },
    client1PhoneNumber: {
        type: String
    },
    client1Email: {
        type: String,
    //    required: true
    },
    client1Address: {
        type: String
    },
    // items purchased will be stored as an array
    // [item, quantity, price, subtotal]
    // subtotal = quantity * price
    // eg [["book", 2, 2000, 4000], ["fish" 3, 1500, 4500]]
    items: {
        type: [],
    //    required: true
    },
    subTotal: {
        type: Number
    },
    salesTax: {
        type: Number
    },
    // sum of subtotal in array
    total: {
        type: Number,
    //    required: true
    },
    //holds link/path to pdf
    pdfLink: {
        type: String,
        //required: true
    },
    formId: {
      type: String
    },
}, {timestamps: true})


module.exports = mongoose.model("Receipt", ReceiptSchema)
