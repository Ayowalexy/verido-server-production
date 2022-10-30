const jwt = require('jsonwebtoken');
const User = require('../model/User')
const Admin = require('../model/Admin')


module.exports.getPartnerConsultants = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const partner = await Admin.findById({_id: req.params.id}).populate('consultants');

            if(partner){
                const partnerConsultant = partner.consultants;
                res.status(200).json({message: 'success', status: 200, data: partnerConsultant, meta: {}})
            } else {
                res.status(403).json({message: 'error'})
            }
        })
    } catch(e){
        return e
    }
}


module.exports.getPartnerBusiness = async (req, res) => {
    try {
        jwt.verify(req.token, process.env.SECRET, async (err, data) => {
            if (err) {
                res.status(403).json({ message: 'error', status: 403, meta: { response: 'Token is invalid or expired' } })
                return
            }

            const partner = await Admin.findById({_id: req.params.id})
                .populate({
                    path: 'consultants',
                    populate: 'business'
                });

            if(partner){
                const partnerConsultant = partner.consultants
                let partnerBusiness = [];

                for(let el of partnerConsultant){
                    let elBusiness = el.business;
                    partnerBusiness = [...elBusiness]
                }

                res.status(200).json({message: 'success', status: 200, data: partnerBusiness, meta: {}})
            } else {
                res.status(403).json({message: 'error'})
            }
        })
    } catch(e){
        return e
    }
}