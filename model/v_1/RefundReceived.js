const mongoose = require('mongoose')


const refundSchema = new mongoose.Schema({
    trxID: String,
    isMaterial: String,
    description: String,
    supplierID: String,
    amount: String,
    date: String,
    time: String,
    paymentOption: String,
    tableId: String

})


module.exports = mongoose.model('RefundReceived', refundSchema)