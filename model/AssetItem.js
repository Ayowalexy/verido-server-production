const mongoose = require('mongoose');

const assetSchema = mongoose.Schema(
    {
        title: String,
        price: String,
        lifeCount: String,
        lifePeriod: String,
        description: String,
        safeDelete: String,
        tableId: String
    }
)

module.exports = mongoose.model('AllAssetItems', assetSchema)