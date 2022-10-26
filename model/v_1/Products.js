const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    name: String,
    unit: String,
    costPrice: String,
    margin: String,
    sellingPrice: String,
    forcast: String,
    rate: String,
    image: String,
    usedMaterials: String,
    usedLabours: String,
    safeDelete: String,
    tableId: String
})

module.exports = mongoose.model('Products', productsSchema)