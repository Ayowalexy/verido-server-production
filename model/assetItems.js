const mongoose = require('mongoose');

const assetItemsSchema = mongoose.Schema(
    {
        AssetItems: [{
            title: String,
            price: String,
            lifeCount: String,
            lifePeriod: String,
            description: String,
            safeDelete: String,
            tableId: String
        }],
        Assets: [{
            title: String,
            withDiscount: Boolean,
            description: String,
            supplierID: String,
            price: String,
            amountDue: String,
            amountPaid: String,
            date: String,
            time: String,
            selectedDay: String,
            payCount: String,
            paymentOption: String,
            discount: String,
            reduction: String,
            isIntallment: String,
            frequency: String,
            payDays: String,
            lifeCount: String,
            lifeRate: String,
            tableId: String

        }],
        Customers: [{
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

        }],
        DirectLabour: [{
            withDiscount: String,
            description: String,
            customerID: String,
            amountDue: String,
            amountPaid: String,
            date: String,
            time: String,
            selectedDay: String,
            payCount: String,
            paymentOption: String,
            discount: String,
            reduction: String,
            isIntallment: String,
            frequency: String,
            cart: String,
            payDays: String,
            tableId: String

        }],
        DirectMaterials: [{
            withDiscount: String,
            description: String,
            customerID: String,
            amountDue: String,
            amountPaid: String,
            date: String,
            time: String,
            selectedDay: String,
            payCount: String,
            paymentOption: String,
            discount: String,
            reduction: String,
            isIntallment: String,
            frequency: String,
            cart: String,
            payDays: String,
            tableId: String

        }],
        Installments: [{
            transactionID: String,
            isMaterial: Number, 
            isOther: Number,
            isMoneyIn: Number,
            isOverhead: Number,
            isAssest: Number,
            amountPaid: String,
            date: String,
            time: String,
            paymentOption: String,
            description: String,
            tableId: String
        }],
        Labours: [{
            title: String,
            rate: String,
            unitPrice: String,
            labourType: String,
            description: String,
            safeDelete: Number,
            tableId: String

        }],
        Materials: [{
            name: String,
            unit: String,
            unitPrice: String,
            image: String,
            safeDelete: String,
            tableId: String
        }],
        OtherItems: [{
            title: String,
            type_: String,
            unitPrice: String,
            tableId: String
        }],
        OtherMoneyIns: [{
            withDiscount: String,
            description: String,
            customerID: String,
            amountDue: String,
            amountPaid: String,
            date: String,
            time: String,
            selectedDay: String,
            payCount: String,
            paymentOption: String,
            discount: String,
            isIntallment: String,
            frequency: String,
            payDays: String,
            cart: String,
            tableId: String
        }],
        OtherMoneyOut: [{
            withDiscount: String,
            description: String,
            customerID: String,
            amountDue: String,
            amountPaid: String,
            date: String,
            time: String,
            selectedDay: String,
            payCount: String,
            paymentOption: String,
            discount: String,
            isIntallment: String,
            frequency: String,
            payDays: String,
            cart: String,
            tableId: String
        }],
        OverheadItem_Transactions: [{
            withDiscount: String,
            description: String,
            supplierID: String,
            amountDue: String,
            amountPaid: String,
            date: String,
            time: String,
            reduction: String,
            paymentOption: String,
            overheadID: String,
            quantity: String,
            discount: String,
            tableId: String
        }],
        OverheadItems: [{
            title: String,
            price: String,
            shouldRemind: String,
            frequency: String,
            type_: String,
            reminderID: String,
            safeDelete: String,
            tableId: String
        }],
        Overheads: [{
            withDiscount: String,
            description: String,
            supplierID: String,
            amountDue: String,
            amountPaid: String,
            date: String,
            time: String,
            selectedDay: String,
            payCount: String,
            isIntallment: String,
            frequency: String,
            payDays: String,
            cart: String,
            reduction: String,
            paymentOption: String,
            overheadID: String,
            quantity: String,
            discount: String,
            tableId: String

        }],
        Products: [{
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
        }],
        RefundGiven: [{
            trxID: String,
            description: String,
            customerID: String,
            amount: String,
            date: String,
            time: String,
            paymentOption: String,
            tableId: String

        }],
        RefundReceived: [{
            trxID: String,
            isMaterial: String,
            description: String,
            supplierID: String,
            amount: String,
            date: String,
            time: String,
            paymentOption: String,
            tableId: String

        }],
        Reminders: [{
            type_: String,
            message: String,
            day: String,
            tableId: String

        }],
        Sales: [{
            withDiscount: String,
            description: String,
            customerID: String,
            amountDue: String,
            amountPaid: String,
            date: String,
            time: String,
            selectedDay: String,
            payCount: String,
            paymentOption: String,
            discount: String,
            reduction: String,
            isIntallment: String,
            frequency: String,
            payDays: String,
            cart: String,
            tableId: String

        }],
        Suppliers: [{
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

        }]

    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('assetItemsAll', assetItemsSchema)