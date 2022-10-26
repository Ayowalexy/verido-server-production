const mongoose = require('mongoose')

const directLabourSchema = new mongoose.Schema({
    withDiscount: String,
    description: String,
    customerID: String,
    amountDue: String,
    amountPaid: String,
    date: String,
    time: String,
    selectedDay: String,
    payCount: String,
    paymentOption: String,
    discount: String,
    reduction: String,
    isIntallment: String,
    frequency: String,
    cart: String,
    payDays: String,
    tableId: String
})

module.exports = mongoose.model('direct_labour', directLabourSchema)