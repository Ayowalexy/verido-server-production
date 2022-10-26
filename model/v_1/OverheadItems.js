const mongoose = require('mongoose')

const overheadItemsSchema = new mongoose.Schema({
    title: String,
    price: String,
    shouldRemind: String,
    frequency: String,
    type_: String,
    reminderID: String,
    safeDelete: String,
    tableId: String
})

module.exports = mongoose.model('OverheadItems', overheadItemsSchema)