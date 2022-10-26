
const User = require('../model/User');
const bcrypt = require('bcrypt')
const STRIPE_LIVE_KEY = process.env.STRIPE_LIVE_KEY
const stripe = require('stripe')(STRIPE_LIVE_KEY);
const Institution = require('../model/Institution');
const Subscription = require('../model/Subcription');
const Business = require('../model/Business');
const Consultants = require('../model/Consultant')
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');



const AssetItems_ = require('../model/AssetItem')
const Asset_ = require('../model/assets')
const Customer_ = require('../model/v_1/Customers')
const DirectLabour_ = require('../model/v_1/Direct-Labour')
const DirectMaterials_ = require('../model/v_1/Direct-Materials')
const Installments_ = require('../model/v_1/Installments')
const Labours_ = require('../model/v_1/Labour')
const Materials_ = require('../model/v_1/Materials')
const OtherItems_ = require('../model/v_1/OtherItems')
const OtherMoneyIns_ = require('../model/v_1/OtherMoneyIns')
const OtherMoneyOuts_ = require('../model/v_1/OtherMoneyOut')
const OverheadItem_Transactions_ = require('../model/v_1/OverheadItemTransactions')
const OverheadItems_ = require('../model/v_1/OverheadItems')
const Overheads_ = require('../model/v_1/Overheads')
const Products_ = require('../model/v_1/Products');
const RefundGiven_ = require('../model/v_1/RefundGiven')
const RefundReceived_ = require('../model/v_1/RefundReceived')
const Reminder_ = require('../model/v_1/Reminders')
const Sales_ = require('../model/v_1/Sales')
const Suppliers_ = require('../model/v_1/Suppliers')


module.exports.register = catchAsync(async (req, res, next) => {

    try {

        const { path } = req.file || ''
        let token;
        bcrypt.hash(1234, 12, function (err, hash) {
            token = hash;
        })
        const {
            full_name = null,
            email = null,
            username,
            consultantID,
            password,
            organization_id = null,
            business_name = null,
            business_sector = null,
            business_type = null,

        } = req.body;

        let emailUser;
        // let org_id;
        let exits;
        if (!(Object.is(email, null))) {
            emailUser = await User.findOne({ email: email })
        }
        if (username !== null) {
            exits = await User.findOne({ username: username })
        }


        console.log('email user', emailUser)

        if (emailUser) {
            return res.status(401).json({ "code": 401, "status": "Duplicate", "message": `${emailUser.email} is already registered` })
        }
        if (exits) {
            return res.status(401).json({ "code": 401, "status": "Duplicate", "message": `${exits.username} is already registered` })
        }


        const dateJoined = new Date();
        let date = new Date()
        date.setDate(date.getDate() + 7)

        const newInstitution = new Institution({
            name: null,
            email: null,
            institutionShouldAccessData: null,
            institutionShouldExportData: null
        })




        const newSubcription = new Subscription({
            type: 'trial',
            status: true,
            started: dateJoined.toLocaleDateString(),// dateJoined.toDateString(),
            expires: date.toLocaleDateString()//date.toDateString()
        })


        const newBusiness = new Business({
            name: business_name,
            sector: business_sector,
            type: business_type,
            currency: 'US Dollar',
            currencySymbol: '$'
        })


        await newInstitution.save()

        await newBusiness.save()

        await newSubcription.save()



        const customer = await stripe.customers.create({
            email: email ? email : null,
            phone: username,
            name: full_name
        });
        const user = new User(
            {
                full_name,
                username,
                email,
                stripeCustomerID: customer.id,
                organization_id,
                database: null,
                phoneVerified: false,
                photoUrl: path ? path : null,
                dateJoined: dateJoined.toDateString(),
                token: null,
                //   consultant: consultantID

            })
        user.subscription_status = newSubcription;
        user.business = newBusiness
        user.insitution.push(newInstitution)
        // const newUser = await User.register(user, password)

        await bcrypt.hash(password, 12).then(function (hash) {
            user.password = hash
        })



        const consultant = await Consultants.findOne({
            consultant_id: consultantID
        })

        if (consultant) {
            consultant.business.push(user)
            user.consultant.push(consultant)
            await consultant.save()
        }

        await user.save()

        res.json({ "code": 200, "status": "success", "message": `Successfully registered ${username}`, "response": user })

    } catch (e) {
        return next(e)
    }

})


module.exports.login = async (req, res, next) => {
    try {


        const { username, password } = req.body;
        const user = await User.findOne({ username })
            .populate('token')
            .populate('business')
            .populate('subscription_status')
            .populate('database')
            .populate('token')
            .populate('videos')
            .populate('insitution')
            .populate('consultant')


        if (user !== null) {
            await bcrypt.compare(password, user.password).then(function (result) {
                switch (result) {
                    case true:
                        if (!user?.verified) {
                            jwt.sign({ user: user.username }, 'secretkey', (err, token) => {
                                user.token = token;
                                user.save();
                                return res.status(200).json({ "code": 200, "status": "Ok", "message": "Welcome", "response": user })
                            })
                        } else {
                            return res.status(403).json({ status: "falied", message: "failed login", meta: { message: "user is not verified" } })
                        }
                        break;
                    case false:
                        return res.status(200).json({ "code": 403, "status": "Failed", "message": "Username or password is incorrect" })

                    default:
                        return res.status(200).json({ "code": 403, "status": "Failed", "message": "Username or password is incorrect" })
                }
            })
        }


    } catch (e) {
        return next(e)
    }

}


module.exports.sendVerification = catchAsync(async (req, res, next) => {


    try {
        // const { salt } = req.params;


        // phoneNumber.push({phone: req.body.phoneNumber, salt: salt});

        jwt.sign({ user: req.body.phoneNumber }, 'secretkey', async (err, token) => {
            if (err) {
                res.json({ "code": 403, "message": "Auth Failed" })
            } else {
                const user = await User.findOne({ username: req.body.phoneNumber })
                console.log(user)
                if (user == null) {
                    return res.status(403).json({ "code": 403, "status": "Authorised", "message": `User with ${req.body.phoneNumber} is not registered` })
                }

                twilio.verify.services(process.env.VERIFICATION_SID)
                    .verifications
                    .create({ to: req.body.phoneNumber, channel: 'sms' })
                    .then(async verification => {
                        await User.findOneAndUpdate({ username: req.body.phoneNumber }, { verified: true })
                        res.status(200).json({ "code": 200, "verification token": token, "status": "Ok", "message": `${verification?.status}` })
                    })
                    .catch(e => {
                        next(e)
                        res.status(500).send(e);
                    });
            }
        })





    } catch (e) {
        next(e)
    }
});

module.exports.verifyOTP = catchAsync(async (req, res, next) => {

    try {

        jwt.verify(req.token, 'secretkey', async (err, data) => {
            if (err) {
                res.json({ "code": 403, "message": "Auth Failed" })
            } else {
                const { otp } = req.body;
                let returnUser;
                // const { salt } = req.params
                console.log(data)


                const check = await twilio.verify.services(process.env.VERIFICATION_SID)
                    .verificationChecks
                    // .create({to: number.phone, code: otp})
                    .create({ to: data.user, code: otp })
                    .then(async (verification) => {
                        if (verification.status === 'approved') {
                            returnUser = await User.findOne({ username: data.user })
                                .populate('token')
                                .populate('business')
                                .populate('subscription_status')
                                .populate('database')
                                .populate('token')
                                .populate('videos')
                                .populate('insitution')
                                .populate('consultant')

                            returnUser.phoneVerified = true;
                            returnUser.full_name = returnUser.full_name;
                            await returnUser.save()
                        }
                        // res.status(200).json({"code": 200, "status": "Ok", "message": `${verification?.status}`, "user": returnUser})
                    })




                    .then(verification => {
                        console.log(verification)
                        res.status(200).json({ "code": 200, "status": "Ok", "message": `verified` })
                    }
                    )

                    .catch(e => {
                        next(e)
                        // res.status(500).send(e);
                    });

                // res.status(200).send(check);
            }
        })

    } catch (e) {
        next(e)
    }
});


module.exports.setStats = catchAsync(async (req, res, next) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, data) => {
            if (err) {
                return res.status(403).json({ status: "error", message: "invalid token", meta: { error: "token is invalid or expired" } })
            }


            // const { error, value } = Schema.assetItemsSchema.validate(req.body);
            // if(error){
            //     console.log('Error', error.message)
            //     return res.status(401).json({status: "error", message: "invalid request", meta: { error: error.message}})
            // }
            console.log(data)
            const user = await User.findOne({ username: data.user });

            const body = req.body;

            const {
                AssetItems = {},
                Assets = {},
                Customers = {},
                OtherMoneyIns = {},
                DirectLabour = {},
                Installments = {},
                Labours = {},
                OtherMoneyOut = {},
                DirectMaterials = {},
                Materials = {},
                OtherItems = {},
                OverheadItem_Transactions = {},
                OverheadItems = {},
                Overheads = {},
                Products = {},
                RefundGiven = {},
                RefundReceived = {},
                Reminders = {},
                Sales = {},
                Suppliers = {}

            } = body;


            const asset_arr = []

            AssetItems.map(async data => {
                const newData = new AssetItems_(data);
                await newData.save();

                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { assetItems: newData }
                    }
                )

                // user.assetItems.push(newData);
            })



            Assets.map(async data => {
                const newData = new Asset_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { Assets: newData }
                    }
                )

                // user.Assets.push(newData);
            })

            Customers.map(async data => {
                const newData = new Customer_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { Customers: newData }
                    }
                )                // user.Customers = newData;
            })

            DirectLabour.map(async data => {
                const newData = new DirectLabour_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { DirectLabour: newData }
                    }
                )      
                // user.DirectLabour.push(newData);
            })

            OtherMoneyIns.map(async data => {
                const newData = new OtherMoneyIns_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { OtherMoneyIns: newData }
                    }
                ) 
                // user.OtherMoneyIns.push(newData);
            })

            Installments.map(async data => {
                const newData = new Installments_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { Installments: newData }
                    }
                ) 
                // user.Installments.push(newData);
            })

            Labours.map(async data => {
                const newData = new Labours_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { Labours: newData }
                    }
                ) 
                // user.Labours.push(newData);
            })

            OtherMoneyOut.map(async data => {
                const newData = new OtherMoneyOuts_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { OtherMoneyOut: newData }
                    }
                ) 
                // user.OtherMoneyOut.push(newData);
            })

            Materials.map(async data => {
                const newData = new Materials_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { Materials: newData }
                    }
                ) 
                // user.Materials.push(newData);
            })

            DirectMaterials.map(async data => {
                const newData = new DirectMaterials_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { DirectMaterials: newData }
                    }
                )
                // user.DirectMaterials.push(newData);
            })

            OtherItems.map(async data => {
                const newData = new OtherItems_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { OtherItems: newData }
                    }
                )
                // user.OtherItems.push(newData);
            })

            OverheadItem_Transactions.map(async data => {
                const newData = new OverheadItem_Transactions_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { OverheadItem_Transactions: newData }
                    }
                )
                // user.OverheadItem_Transactions.push(newData);
            })

            OverheadItems.map(async data => {
                const newData = new OverheadItems_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { OverheadItems: newData }
                    }
                )
                // user.OverheadItems.push(newData);
            })

            Overheads.map(async data => {
                const newData = new Overheads_(data);
                await newData.save();
                 await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { Overheads: newData }
                    }
                )
                // user.Overheads.push(newData);
            })

            Products.map(async data => {
                const newData = new Products_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { Products: newData }
                    }
                )
                // user.Products.push(newData);
            })

            RefundGiven.map(async data => {
                const newData = new RefundGiven_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { RefundGiven: newData }
                    }
                )
                // user.RefundGiven.push(newData);
            })

            RefundReceived.map(async data => {
                const newData = new RefundReceived_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { RefundReceived: newData }
                    }
                )
                // user.RefundReceived.push(newData);
            })

            Reminders.map(async data => {
                const newData = new Reminder_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { Reminders: newData }
                    }
                )
                // user.Reminders.push(newData);
            })

            Sales.map(async data => {
                const newData = new Sales_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { Sales: newData }
                    }
                )
                // user.Sales.push(newData);
            })

            Suppliers.map(async data => {
                const newData = new Suppliers_(data);
                await newData.save();
                await User.update(
                    { _id: user.id },
                    {
                        $push:
                            { Suppliers: newData }
                    }
                )
                // user.Suppliers.push(newData);
            })

            await user.save();
            console.log('user', user)
            res.status(201).json({ status: "success", message: "asset items created scuccessfully", data: user, meta: {} })

        })
    } catch (error) {
        return next(error)
    }
})
