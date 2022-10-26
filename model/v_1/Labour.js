const mongoose = require('mongoose')

const labourSchema = new mongoose.Schema({
    title: String,
    rate: String,
    unitPrice: String,
    labourType: String,
    description: String,
    safeDelete: Number,
    tableId: String

})



module.exports = mongoose.model('Labour', labourSchema)