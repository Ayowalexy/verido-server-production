const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    account_type: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Admin', adminSchema)