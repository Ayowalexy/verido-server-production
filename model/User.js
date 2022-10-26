
const mongoose = require('mongoose')
const Institution = require('./Institution')
const Video = require('./Videos')
const UserID = require('./UserID')
const autoPopulate = require('mongoose-autopopulate');
const AllAssetItems = require('./AssetItem')

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        // required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    stripeCustomerID: String,
    token: String,
    photoUrl: String,
    dateJoined: {
        type: String,
    },
    numbers: String,
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages'
    }],
    consultant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'consultants',
        autoPopulate: true

    }],
    userConsultant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'consultants',
        autoPopulate: true
    },
    suspended: {
        type: Boolean,
        default: false
    },
    phoneVerified: Boolean,
    idVerified: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserID,
        autoPopulate: true

    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Video,
        autoPopulate: true


    }],
    insitution: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Institution,
        autoPopulate: true

    }],
    database: String,
    username: {
        type: String,
        // required: [true, 'Phone number is required']
    },
    password: {
        type: String,
        // required: true
    },
    loginToken: {
        type: String,
        autoPopulate: true
    },
    organization_id: {
        type: String
    },
    subscription_status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscription',
        autoPopulate: true

    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
        autoPopulate: true
    },
   
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        autoPopulate: true
    }],
   
    assetItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AllAssetItems",
        autoPopulate: true

        
    }],
    Assets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'assetItems',
        autoPopulate: true

    }],
    Customers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        autoPopulate: true

    }],
    DirectLabour: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'direct_labour',
        autoPopulate: true

    }],
    DirectMaterials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'direct_materials',
        autoPopulate: true

    }],
    Installments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Installments',
        autoPopulate: true

    }],
    Labours: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Labour',
        autoPopulate: true

    }],
    Materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
        autoPopulate: true

    }],
    OtherItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OtherItems',
        autoPopulate: true

    }],
    OtherMoneyIns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OtherMoneyIn',
        autoPopulate: true

    }],
    OtherMoneyOut: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OtherMoneyOut',
        autoPopulate: true

    }],
    OverheadItem_Transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OverHeadItem_Transactions',
        autoPopulate: true

    }],
    OverheadItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OverheadItems',
        autoPopulate: true

    }],
    Overheads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Overhead',
        autoPopulate: true
    }],
    Products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        autoPopulate: true
    }],
    RefundGiven: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RefundGiven',
        autoPopulate: true
    }],
    RefundReceived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RefundReceived',
        autoPopulate: true

    }],
    Reminders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reminders',
        autoPopulate: true
    }],
    Sales: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sales',
        autoPopulate: true
    }],
    Suppliers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suppliers',
        autoPopulate: true

    }],

})

userSchema.plugin(autoPopulate);


module.exports = mongoose.model('Users', userSchema)