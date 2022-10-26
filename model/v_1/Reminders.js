const mongoose = require('mongoose')


const reminderSchema = new mongoose.Schema({
    ttype_: String,
    message: String,
    day: String,
    tableId: String

})


module.exports = mongoose.model('Reminders', reminderSchema)