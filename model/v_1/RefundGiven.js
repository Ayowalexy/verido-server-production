const mongoose = require('mongoose')


const refundSchema = new mongoose.Schema({
    trxID: String,
    description: String,
    customerID: String,
    amount: String,
    date: String,
    time: String,
    paymentOption: String,
    tableId: String

})


module.exports = mongoose.model('RefundGiven', refundSchema)