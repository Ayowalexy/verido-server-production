const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    },
    user_id: String,
    consultants: [{
        type: Schema.Types.ObjectId,
        ref: 'consultants'
    }],
    business: [{
        type: Schema.Types.ObjectId,
        ref: "Users"
    }]
}, { timestamps: true })

module.exports = mongoose.model('Admin', adminSchema)