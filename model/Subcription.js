const mongoose = require('mongoose');
const moment = require('moment');

const subscriptionStatus = new mongoose.Schema({
    type : {
        type: String,
        default: 'trial'
    },
    status : {
            type: Boolean,
            default: true
    },
    started : {
        type: String,
        default: moment().add(0, 'days').calendar()
    },
    expires : {
        type: String,
        default: moment().add(7, 'days').calendar()
    }
})

module.exports = mongoose.model('subscription', subscriptionStatus)