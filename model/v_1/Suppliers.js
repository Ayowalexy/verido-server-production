const mongoose = require('mongoose')


const supplierSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    businessName: String,
    address1: String,
    address2: String,
    postCode: String,
    region: String,
    town: String,
    safeDelete: String,
    tableId: String

})


module.exports = mongoose.model('Suppliers', supplierSchema)