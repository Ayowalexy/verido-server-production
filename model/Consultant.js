const mongoose = require('mongoose')


const consultantSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        token: String,
        email: String,
        user_id: String,
        mobile_number: String,
        suspended: {
            type: Boolean,
            default: false
        },
        rating: {
            type: Number,
            default: 0
        },
        ratedBy: {
            type: Number,
            default: 0
        },
        business: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }],
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Messages'
        }],
        partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        }
    },
    {
        timestamps: true
    }
)
// console.log()

module.exports = mongoose.model('consultants', consultantSchema)