const Business = require('../model/User');
const Consultants = require('../model/Consultant');
const jwt = require('jsonwebtoken');
const Business_ = require('../model/Business')
const User = require('../model/User')
const Admin = require('../model/Admin')
const Subscription = require('../model/Subcription')
const STRIPE_LIVE_KEY = process.env.STRIPE_LIVE_KEY
const stripe = require('stripe')(STRIPE_LIVE_KEY);
const mongoose = require('mongoose')
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const Consultant = require('../model/Consultant');
const asyncHandler = require('express-async-handler');
const Video = require('../model/Videos')
const { videoSchema } = require('../utils/JoiSchema')

module.exports.AddVidoe = asyncHandler(async (req, res) => {
    const { error, value } = videoSchema.validate(req.body)

    if (error) {
        console.log(error)
        return res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: error.message
                    }
                })
    }


    const video = new Video({...value});
    console.log(video)
    await video.save();
    const videos = await Video.find();

    res
        .status(200)
        .json(
            {
                data: videos,
                status: "success",
                meta: {}
            })
})

module.exports.getAllVidoes = asyncHandler( async ( req, res) => {
    const vidoes = await Video.find();
    res
        .status(200)
        .json(
            {
                data: vidoes,
                status: "success",
                meta: {}
            })
})



module.exports.Analytics = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            // 

            const no_of_business = await User.count();
            const last_5_business = await User
                .find()
                .populate('subscription_status')
                .populate('consultant')
                .populate({
                    path: 'consultant',
                    populate: 'partner'
                })
                .limit(5)
            const no_of_consultants = await Consultants.count();
            const no_of_trials = await Subscription.find({ type: 'trial' }).count();
            const no_of_subscribed = await Subscription.find({ type: 'Subscribed' }).count();
            const no_of_expired = await Subscription.find({ type: 'expired' }).count();
            const paymentIntents = await stripe.paymentIntents.list();

            const total_subscription_amount = paymentIntents.data.reduce(
                (previousValue, currentValue) => previousValue + currentValue.amount
                , 0
            )
            console.log('Last 5 business', last_5_business.length)

            const allBusiness = await Business.find()
                .populate('assetItems')
                .populate('consultant')
                .populate('business')
                .populate('product')
                .populate('Assets')
                .populate('Customers')
                .populate('DirectLabour')
                .populate('DirectMaterials')
                .populate('Installments')
                .populate('Labours')
                .populate('Materials')
                .populate('OtherItems')
                .populate('OtherMoneyIns')
                .populate('OtherMoneyOut')
                .populate('OverheadItem_Transactions')
                .populate('OverheadItems')
                .populate('Overheads')
                .populate('Products')
                .populate('RefundGiven')
                .populate('RefundReceived')
                .populate('Reminders')
                .populate('Sales')
                .populate('Suppliers')

            const allConsultants = await Consultants.find();


            const allStats = allBusiness.map(element => {
                const DirectMaterials = element?.DirectMaterials.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const DirectLabour = element?.DirectLabour.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const OtherMoneyOut = element?.OtherMoneyOut.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const RefundGiven = element?.RefundGiven.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amount)
                    , 0
                )



                //Money In

                const OtherMoneyIns = element?.OtherMoneyIns.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const Sales = element?.Sales.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const RefundReceived = element?.RefundReceived.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amount)
                    , 0
                )


                // Overheads 
                const Overheads = element?.Overheads.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const OverheadItems = element?.OverheadItems.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.price)
                    , 0
                )

                const OverheadItem_Transactions = element?.OverheadItem_Transactions.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                return {
                    DirectMaterials,
                    DirectLabour,
                    OtherMoneyOut,
                    RefundGiven,
                    OtherMoneyIns,
                    Sales,
                    RefundReceived,
                    Overheads,
                    OverheadItems,
                    OverheadItem_Transactions,
                }
            })


            const DirectMaterials = allStats?.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.DirectMaterials)
                , 0
            )

            const DirectLabour = allStats?.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.DirectLabour)
                , 0
            )

            const OtherMoneyOut = allStats.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.OtherMoneyOut)
                , 0
            )

            const RefundGiven = allStats.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.RefundGiven)
                , 0
            )

            const OtherMoneyIns = allStats.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.OtherMoneyIns)
                , 0
            )

            const Sales = allStats.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.Sales)
                , 0
            )

            const RefundReceived = allStats.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.RefundReceived)
                , 0
            )

            const Overheads = allStats.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.Overheads)
                , 0
            )

            const OverheadItems = allStats.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.OverheadItems)
                , 0
            )

            const OverheadItem_Transactions = allStats.reduce(
                (previousValue, currentValue) => Number(previousValue) + Number(currentValue.OverheadItem_Transactions)
                , 0
            )




            const totalMoneyIn = DirectMaterials + DirectLabour + OtherMoneyOut + RefundGiven;
            const totalMoneyOut = OtherMoneyIns + Sales + RefundReceived;
            const totalOverhead = Overheads + OverheadItems + OverheadItem_Transactions;
            const topBusiness = Math.max(totalMoneyIn, totalMoneyOut, totalOverhead)
            const allTotal = totalMoneyIn + totalMoneyOut + totalOverhead;


            const alldata = {
                money_in: {
                    DirectMaterials,
                    DirectLabour,
                    OtherMoneyOut,
                    RefundGiven,
                    totalMoneyIn,
                    percent: Math.floor((totalMoneyIn / allTotal) * 100)
                },
                money_out: {
                    OtherMoneyIns,
                    Sales,
                    RefundReceived,
                    totalMoneyOut,
                    percent: Math.floor((totalMoneyOut / allTotal) * 100)

                },
                overhead: {
                    Overheads,
                    OverheadItems,
                    OverheadItem_Transactions,
                    totalOverhead,
                    percent: Math.floor((totalOverhead / allTotal) * 100)

                },
                topBusiness,
                businessOwners: allBusiness.splice(0, 5),
                consultant: allConsultants.slice(0, 5),
                topConsultants: 0,
                allTotal

            }

            const totalNum = no_of_trials + no_of_subscribed + no_of_expired

            res.status(200).json({
                message: 'success',
                status: 200,
                data: {
                    no_of_business,
                    no_of_consultants,
                    no_of_subscribers: {
                        no_of_trials,
                        no_of_subscribed,
                        no_of_expired,
                        percent_of_trials: Math.floor((no_of_trials / totalNum) * 100),
                        percent_of_subscribed: Math.floor((no_of_subscribed / totalNum) * 100),
                        percent_of_expired: Math.floor((no_of_expired / totalNum) * 100),

                    },
                    amount_subscribed: total_subscription_amount,
                    recent_subscription: last_5_business,
                    alldata
                },


                meta: {}
            })
            return


        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.AllBusiness = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }
            const allBusiness = await Business.find()
                .populate('business')
                .populate('subscription_status')
                .populate('consultant')
                .populate({
                    path: 'consultant',
                    populate: 'partner'
                })
            res.status(200).json({ message: 'success', status: 200, data: allBusiness, meta: {} })
        })


    } catch (e) {
        console.log(e)
    }
}


module.exports.getOneAdmin = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const user = await Admin.findById({ _id: req.params.id }).populate('consultants')
            if (user) {
                res.status(200).json({
                    message: "success",
                    status: 200,
                    data: user
                })
            } else {
                res.status(403).json({ message: 'error' })
            }

        })
    } catch (e) {
        return e
    }
}


module.exports.oneSubscription = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }
            // console.log(req.params.id, req.body)
            const oneSub = await Subscription.findByIdAndUpdate({ _id: req.params.id }, { ...req.body });
            res.status(200).json({ message: 'success', status: 200, data: oneSub, meta: {} })

        })
    } catch (e) {
        console.log(e)
    }
}


module.exports.addConsultant = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const oneBusiness = await Business.findById({ _id: req.params.id });

            const oneConsultant = await Consultants.findByIdAndUpdate(
                { _id: req.body.id },
                {
                    $push:
                        { business: oneBusiness }
                }
            )

            await Business.findByIdAndUpdate(
                { _id: req.params.id },
                { userConsultant: oneConsultant }
            )

            res.status(200).json({ message: 'success', status: 200, data: oneConsultant, meta: {} })


        })
    } catch (e) {
        console.log(e)
    }
}



module.exports.GetOneBusiness = asyncHandler(async (req, res) => {

    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const oneBusiness = await Business.findById({ _id: req.params.id })
                .populate('consultant')
                .populate('subscription_status')
                .populate('Sales')
                .populate('DirectMaterials')
                .populate('DirectLabour')
                .populate('OtherMoneyOut')
                .populate('RefundGiven')
                .populate('OtherMoneyIns')
                .populate('RefundReceived')
                .populate('Overheads')
                .populate('OverheadItems')
                .populate('OverheadItem_Transactions')
                .populate('business')
                .populate('userConsultant')

            if (oneBusiness) {


                const DirectMaterials = oneBusiness?.DirectMaterials?.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const DirectLabour = oneBusiness?.DirectLabour?.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const OtherMoneyOut = oneBusiness?.OtherMoneyOut?.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const RefundGiven = oneBusiness?.RefundGiven?.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amount)
                    , 0
                )

                const OtherMoneyIns = oneBusiness?.OtherMoneyIns?.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const Sales = oneBusiness?.Sales?.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const RefundReceived = oneBusiness?.RefundReceived?.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amount)
                    , 0
                )

                const Overheads = oneBusiness?.Overheads?.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )

                const OverheadItems = oneBusiness?.OverheadItems?.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.price)
                    , 0
                )

                const OverheadItem_Transactions = oneBusiness?.OverheadItem_Transactions?.reduce(
                    (previousValue, currentValue) => Number(previousValue) + Number(currentValue.amountPaid)
                    , 0
                )


                const totalMoneyIn = DirectMaterials + DirectLabour + OtherMoneyOut + RefundGiven;
                const totalMoneyOut = OtherMoneyIns + Sales + RefundReceived;
                const totalOverhead = Overheads + OverheadItems + OverheadItem_Transactions;
                const allTotal = totalMoneyIn + totalMoneyOut + totalOverhead;

                console.log('total', DirectMaterials, DirectLabour, OtherMoneyOut, RefundGiven)

                const alldata = {
                    money_in: {
                        DirectMaterials,
                        DirectLabour,
                        OtherMoneyOut,
                        RefundGiven,
                        totalMoneyIn,
                        percent: Math.floor((totalMoneyIn / allTotal) * 100)
                    },
                    money_out: {
                        OtherMoneyIns,
                        Sales,
                        RefundReceived,
                        totalMoneyOut,
                        percent: Math.floor((totalMoneyOut / allTotal) * 100)

                    },
                    overhead: {
                        Overheads,
                        OverheadItems,
                        OverheadItem_Transactions,
                        totalOverhead,
                        percent: Math.floor((totalOverhead / allTotal) * 100)

                    },


                }

                res.status(200).json({ message: 'success', status: 200, data: { alldata, oneBusiness }, meta: {} })
            } else {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Not found' } })

            }
        })
    } catch (e) {
        console.log(e)
    }
})


module.exports.deleteOneBusiness = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const deleteOneBusiness = await Business.findByIdAndDelete({ _id: req.params.id })
            if (deleteOneBusiness) {
                res.status(200).json({ message: 'success', status: 200, data: 'Deleted successfully', meta: {} })
            } else {
            }
        })
    } catch (e) {
        console.log(e)
        res.status(403).json({ message: 'error', status: 403, meta: { response: "invalid id" } })

    }
}


module.exports.createNewBusiness = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const { consultant_id } = req.body;

            const consultant = await Consultants.findById({ _id: consultant_id });

            if (consultant) {
                const { email, username, full_name } = req.body;
                const newBusiness = await new Business({ ...req.body });
                const newSubcription = new Subscription({
                    type: 'trial',
                    status: true,
                })


                const newBusiness_ = new Business_({
                    currency: 'US Dollar',
                    currencySymbol: '$'
                })



                await newBusiness_.save()

                await newSubcription.save()

                newBusiness.subscription_status = newSubcription;
                newBusiness.business = newBusiness_;

                await bcrypt.hash(req.body.password, 12).then(function (hash) {
                    newBusiness.password = hash
                });

                const customer = await stripe.customers.create({
                    email: email ? email : null,
                    phone: username,
                    name: full_name
                });

                newBusiness.stripeCustomerID = customer.id;

                await newBusiness.save();

                const oneConsultant = await Consultants.findByIdAndUpdate(
                    { _id: consultant_id },
                    {
                        $push:
                            { business: newBusiness }
                    }
                )

                await Business.findByIdAndUpdate(
                    { _id: newBusiness._id },
                    { userConsultant: oneConsultant }
                )

                res.status(200).json({ message: 'success', status: 200, data: 'created successfully', meta: {} })


            } else {
                return res.status(403).json({
                    message: 'error',
                    status: 403,
                    meta: { response: 'invalid consultant id' }
                })
            }
        })
    } catch (e) {
        console.log(e)
        res.status(403).json({ message: 'error', status: 403, meta: { response: "invalid id" } })
    }
}


module.exports.addNewBusiness = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const business = new Business_({ ...req.body });
            await business.save();
            await Business.findByIdAndUpdate(
                { _id: req.params.id },
                { business: business }
            )
            res.status(200).json({ message: 'success', status: 200, data: business, meta: {} })

        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.suspendBusiness = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const business = await Business.findById({ _id: req.params.id })
            if (business.suspended) {
                await Business.findOneAndUpdate({ _id: req.params.id }, { suspended: false, password: business.password.slice(0, business.password.indexOf('suspended')) })
            } else {
                await Business.findOneAndUpdate({ _id: req.params.id }, { suspended: true, password: business.password.concat('suspended') })
            }

            res.status(200).json({ message: 'success', status: 200, data: 'Status updated successfully', meta: {} })


        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.suspendConsultant = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const consultant = await Consultants.findById({ _id: req.params.id })
            if (consultant.suspended) {
                await Consultants.findOneAndUpdate({ _id: req.params.id }, { suspended: false, password: consultant.password.slice(0, consultant.password.indexOf('suspended')) })
            } else {
                await Consultants.findOneAndUpdate({ _id: req.params.id }, { suspended: true, password: consultant.password.concat('suspended') })
            }

            res.status(200).json({ message: 'success', status: 200, data: 'Status updated successfully', meta: {} })


        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.deleteConsultant = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }
            const deleteOneConsultant = await Consultants.findByIdAndDelete({ _id: req.params.id })
            if (deleteOneConsultant) {
                res.status(200).json({ message: 'success', status: 200, data: 'Deleted successfully', meta: {} })
            }

        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.createConsultant = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const admin = await Admin.findById({ _id: req.params.id });
            if (admin) {
                const consultantId = shortid.generate();
                const newConsultant = new Consultants({ ...req.body, user_id: consultantId });

                const type = admin.account_type;

                if (type === 'Partner') {
                    const newPartnerConsultant = await Admin.findByIdAndUpdate(
                        { _id: req.params.id },
                        {
                            $push:
                                { consultants: newConsultant }
                        }
                    )
                }

                await newConsultant.save();
                return res.status(200).json({ message: 'success', status: 200, data: 'consultant created successfully', meta: {} })
            } else {
                res.status(403).json({
                    message: 'error',
                    status: 403,
                    meta: { response: "user not found" }
                })
            }



        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.AllConsultants = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const allConsultants = await Consultants.find().populate('partner')
            res.status(200).json({ message: 'success', status: 200, data: allConsultants, meta: {} })
        })
    } catch (e) {
        console.log(e)
    }
}


module.exports.GetOneConsultant = asyncHandler(async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const oneConsultant = await Consultants.findById({ _id: req.params.id })
                .populate({
                    path: 'business',
                    populate: { path: "subscription_status" }
                })
                .populate({
                    path: 'business',
                    populate: { path: 'business' }
                })
                .populate('partner')
            res.status(200).json({ message: 'success', status: 200, data: oneConsultant, meta: {} })


        })
    } catch (e) {
        console.log(e)
    }
}
)
module.exports.addBusiness = async (req, res, next) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const newBusiness = new Business({ ...req.body });
            await newBusiness.save();
            const user = await User.findByIdAndUpdate({ _id: req.params.id }, { business: newBusiness });

            res.status(200).json({ message: 'success', status: 200, data: user, meta: {} })


        })
    } catch (e) {
        console.log(e)
    }
}


module.exports.allPartners = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const partner = await Admin.find({ account_type: 'Partner' })
            res.status(200).json({ message: 'success', status: 200, data: partner, meta: {} })
        })

    } catch (e) {
        console.log(e)
    }
}



module.exports.AllUsers = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const users = await Business.find();
            const partner = await Admin.find({ account_type: "Partner" })
            const consultants = await Consultants.find();

            const allData = [...users, ...partner, ...consultants];

            res.status(200).json({ message: 'success', status: 200, data: allData, meta: {} })
        })
    } catch (e) {
        return e
    }
}