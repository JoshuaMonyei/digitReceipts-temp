const mongoose = require('mongoose')

// Receipt schema
const ReceiptSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  dateIssued: {
    type: String,
    default: Date(Date.now()).toString().slice(0,15)
  },
  
  //user information
  // store link/path to logo if user chooses to upload img
  companyLogo: {
    type: String
  },
  companyName: {
    type: String,
    required: true
  },
  companyAddress: {
    type: String,
  },
  companyPhoneNumber: {
    type: String,
    required: true
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
    required: true
  },
  // items purchased will be stored as an array of objects
  // [{item: [quantity, price, subtotal]}]
  // subtotal = price * quantity
  // eg [{ "book": [2, 2000, 4000]}, {"fish": [3, 1500, 4500]}]
  items: {
    type: [],
    required: true
  },
  // sum of subtotal in array
  total: {
    type: Number,
    required: true
  },
  //holds link/path to pdf
  receiptPDFLink: {
    type: String,
    //required: true
  },
}, {timestamps: true})


module.exports = mongoose.model("Receipt", ReceiptSchema)
