const Admin = require('../model/Admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailgun = require("mailgun-js");
const Consultants = require('../model/Consultant');
const shortid = require('shortid');
const mailjet = require('node-mailjet') //.connect('49599486008060077ddaa42b8a68a081', '1a610c75885828334ffe2955da1745e5')


module.exports.Register = async (req, res) => {
    try {
        const exits = await Admin.findOne({email: req.body.email});
        const exits2 = await Consultants.findOne({ email: req.body.email })
        if(exits || exits2){
            return res.status(403).json({ message: 'error', status: 403, meta: { response: 'email already exits' } })

        }
        await bcrypt.hash(req.body.password, 12).then(async function (hash) {
            
            if(req.body.account_type === 'Consultant'){
                const newConsultant = new Consultants({
                    ...req.body,
                    username: req.body.full_name,
                    password: hash,
                    mobile_number: req.body.phone_number,
                    user_id: shortid.generate(),
                    
                })

                await newConsultant.save();
            } else {
                const data = {
                    ...req.body,
                    password: hash,
                    user_id: shortid.generate()
                }
                const admin = new Admin(data)
                await admin.save();
            }
            
            res.status(200).json({ message: 'success', status: 201, meta: {} })

        })
    } catch (e) {
        console.log(e)
    }
}

module.exports.Login = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email })
        const consultant = await Consultants.findOne({ email: req.body.email })

        const user = admin || consultant;
        if (user) {
            bcrypt.compare(req?.body?.password, user.password).then(async (result) => {
                switch (result) {
                    case true:
                        const token = jwt.sign({email: user.email, type: user?.account_type || 'Consultant'}, process.env.SECRET)
                        res.status(200).json({ 
                            message: 'success', 
                            status: 200, 
                            token, 
                            role: user?.account_type || 'Consultant', 
                            user: user , 
                            meta: {} })
                        break
                    default:
                        res.status(403).json({ message: 'error', status: 403, meta: { response: 'email or password is incorrect' } })
                        break
                }
            })
        } else {
            res.status(403).json({ message: 'error', status: 403, meta: { response: 'email or password is does not exits' } })
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports.SendEmail = async (req, res) => {


    try {

        const request = mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "seinde4@gmail.com",
                            "Name": "Olaseinde"
                        },
                        "To": [
                            {
                                "Email": "seinde4@gmail.com",
                                "Name": "Olaseinde"
                            }
                        ],
                        "Subject": "Greetings from Mailjet.",
                        "TextPart": "My first Mailjet email",
                        "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            })
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })

    } catch (e) {
        console.log(e)
    }
}


module.exports.ResetPassword = async (req, res) => {
    try {
        const admin = await Admin.findOne({email: req.body.email})
        if(admin){
            bcrypt.hash(req.body.password, 12).then(async (hash) => {
                await Admin.findOneAndUpdate({email: req.body.email}, {password: hash})
                res.status(201).json({message: 'success', status: 201, meta: {}})
            })
        } else {
            res.status(403).json({message: 'error', status: 403, meta: { response: 'email or password does not exits'}})
        }
    } catch(e){
        console.log(e)
    }
}


module.exports.SocialLogin = async (req, res) => {
    try {
        const admin = await Admin.findOne({email: req.body.email})
        if(admin){
            jwt.sign({ email: admin.email }, process.env.SECRET, (err, token) => {
                res.status(200).json({ message: 'success', status: 200, meta: {} })
            })

            res.status(200).json({message: 'success', status: 200, meta: {}})
        } else {
            const newAdmin = new Admin({...req.body})
            await newAdmin.save();
            res.status(201).json({message: 'success', status: 201, meta: {response: 'account created successfully'}})

        }
    } catch(e){
        console.log(e)
    }
}