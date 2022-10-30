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


module.exports.ConsultantAnalytics = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const consultant = await Consultants.findById({ _id: req.params.id })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'subscription_status',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'business',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'Sales',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'DirectMaterials',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'OtherMoneyOut',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'RefundGiven',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'OtherMoneyIns',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'RefundReceived',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'Overheads',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'OverheadItems',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'OverheadItem_Transactions',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'userConsultant',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'Suppliers',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'Reminders',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'RefundReceived',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'userConsultant',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'Products',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'OtherItems',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'Materials',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'Labours',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'Installments',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'DirectLabour',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'Customers',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'Assets',
                    }
                })
                .populate({
                    path: 'business',
                    populate: {
                        path: 'assetItems',
                    }
                })
        
               

            if (consultant) {
                let consultantBusiness = consultant.business

                

                const no_of_business = consultantBusiness.length;
                const last_5_business = consultantBusiness;
                const no_of_trials = consultantBusiness.filter(ele => ele?.subscription_status?.type === 'trial').length;
                const no_of_subscribed = consultantBusiness.filter(ele => ele?.subscription_status?.type === 'Subscribed').length;
                const no_of_expired = consultantBusiness.filter(ele => ele?.subscription_status?.type === 'expired').length;
                const paymentIntents = await stripe.paymentIntents.list();

                const total_subscription_amount = paymentIntents.data.reduce(
                    (previousValue, currentValue) => previousValue + currentValue.amount
                    , 0
                )

                const allStats = consultantBusiness.map(element => {
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


                const totalMoneyIn = Math.abs(DirectMaterials + DirectLabour + OtherMoneyOut + RefundGiven) || 0;
                const totalMoneyOut = Math.abs(OtherMoneyIns + Sales + RefundReceived) || 0;
                const totalOverhead = Math.abs(Overheads + OverheadItems + OverheadItem_Transactions) || 0;
                const topBusiness = Math.max(totalMoneyIn, totalMoneyOut, totalOverhead) || 0
                const allTotal = Math.abs((totalMoneyIn + totalMoneyOut + totalOverhead)) || 0;

                const alldata = {
                    money_in: {
                        DirectMaterials: DirectMaterials || 0,
                        DirectLabour: DirectLabour || 0,
                        OtherMoneyOut: OtherMoneyOut || 0,
                        RefundGiven: RefundGiven || 0,
                        totalMoneyIn: totalMoneyIn || 0,
                        percent: Math.floor((totalMoneyIn / allTotal) * 100) || 0
                    },
                    money_out: {
                        OtherMoneyIns: OtherMoneyIns || 0,
                        Sales: Sales || 0,
                        RefundReceived: RefundReceived || 0,
                        totalMoneyOut: totalMoneyOut || 0,
                        percent: Math.floor((totalMoneyOut / allTotal) * 100) || 0

                    },
                    overhead: {
                        Overheads: Overheads || 0,
                        OverheadItems: OverheadItems || 0,
                        OverheadItem_Transactions: OverheadItem_Transactions || 0,
                        totalOverhead: totalOverhead || 0,
                        percent: Math.floor((totalOverhead / allTotal) * 100) || 0

                    },
                    topBusiness,
                    businessOwners: consultantBusiness.splice(0, 5),
                    allTotal

                }

                const totalNum = no_of_trials + no_of_subscribed + no_of_expired

                res.status(200).json({
                    message: 'success',
                    status: 200,
                    data: {
                        no_of_business,
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

            } else {
                res.json({ message: 'not found' })
            }

        })
    } catch (e) {
        return e
    }
}


module.exports.ConsultantBusiness = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const consultant = await Consultants.findById({ _id: req.params.id })
                                        .populate({
                                            path: 'business',
                                            populate: {
                                                path: 'business'
                                            }
                                        })
                                        .populate({
                                            path: 'business',
                                            populate: {
                                                path: 'subscription_status'
                                            }
                                        })
            if(consultant){
                const consultantBusiness = consultant.business;
                res.status(200).json({ message: 'success', status: 200, data: consultantBusiness, meta: {} })


            } else {
                res.json({
                    message: 'consultant not found'
                })
            }
        })
    } catch (e){
        return e
    }
}