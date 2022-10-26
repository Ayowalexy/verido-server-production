const mongoose = require('mongoose')

const overheadItemsTransactionsSchema = new mongoose.Schema({
    withDiscount: String,
    description: String,
    supplierID: String,
    amountDue: String,
    amountPaid: String,
    date: String,
    time: String,
    reduction: String,
    paymentOption: String,
    overheadID: String,
    quantity: String,
    discount: String,
    tableId: String
})

module.exports = mongoose.model('OverHeadItem_Transactions', overheadItemsTransactionsSchema)