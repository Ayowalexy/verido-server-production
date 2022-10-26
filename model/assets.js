const mongoose = require('mongoose');

const assetSchema = mongoose.Schema({
    title: String,
    withDiscount: Boolean,
    description: String,
    supplierID: String,
    price: String,
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
    payDays: String,
    lifeCount: String,
    lifeRate: String,
    tableId: String
})

module.exports = mongoose.model('assetItems', assetSchema)