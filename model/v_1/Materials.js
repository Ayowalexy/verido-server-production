const mongoose = require('mongoose')

const materialSchema = new mongoose.Schema({
    name: String,
    unit: String,
    unitPrice: String,
    image: String,
    safeDelete: String,
    tableId: String
})

module.exports = mongoose.model('Material', materialSchema)