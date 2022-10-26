const express = require('express')
const auth = require('../controllers/admin_auth')

const router = express.Router();

router.post('/register', auth.Register)

router.post('/login', auth.Login)

router.post('/reset', auth.ResetPassword)

router.post('/socials', auth.SocialLogin)

module.exports = router