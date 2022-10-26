const mongoose = require('mongoose')

const otherItemSchema = new mongoose.Schema({
    title: String,
    type_: String,
    unitPrice: String,
    tableId: String
})

module.exports = mongoose.model('OtherItems', otherItemSchema)