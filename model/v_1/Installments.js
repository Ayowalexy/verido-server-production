const mongoose = require('mongoose')

const installmentSchema = new mongoose.Schema({
    transactionID: String,
    isMaterial: Number, 
    isOther: Number,
    isMoneyIn: Number,
    isOverhead: Number,
    isAssest: Number,
    amountPaid: String,
    date: String,
    time: String,
    paymentOption: String,
    description: String,
    tableId: String
})



module.exports = mongoose.model('Installments', installmentSchema)