const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    businessName: String,
    address1: String,
    address2: String,
    postCode: String,
    region: String,
    safeDelete: String,
    tableId: String

})


module.exports = mongoose.model('Customer', customerSchema)