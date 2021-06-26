const Receipt = require('../models/Receipts')

//fetch all receipts
exports.allReceipts = async (req, res) => {
    Receipt.find({}, (err, receipts) => {
        if (err) {
            return res.status(500).json({ message: err })
        }
        else {
            return res.status(200).json({ receipts })
        }
    })
}
