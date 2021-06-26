const express = require('express')
const router = express.Router()

//import receiptController
const receiptController = require('../controllers/receiptControllers')

//show all receipts
router.get('/allreceipts', receiptController.allReceipts)
//show specific receipts