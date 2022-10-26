const mongoose = require('mongoose')

const overheadsSchema = new mongoose.Schema({
    withDiscount: String,
    description: String,
    supplierID: String,
    amountDue: String,
    amountPaid: String,
    date: String,
    time: String,
    selectedDay: String,
    payCount: String,
    isIntallment: String,
    frequency: String,
    payDays: String,
    cart: String,
    reduction: String,
    paymentOption: String,
    overheadID: String,
    quantity: String,
    discount: String,
    tableId: String
})

module.exports = mongoose.model('Overhead', overheadsSchema)