const express = require('express');
const router = express.Router();
const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })
const dbUpload = multer({dest: 'uploads/'});
const Auth = require('../controllers/auth');
const verifyToken = require('../utils/authenticate')


router.post('/register', upload.single('image'), Auth.register);

router.post('/login', Auth.login);

router.post('/send-verification', Auth.sendVerification)

router.post('/verify-otp', verifyToken, Auth.verifyOTP)

router.post('/stats', verifyToken, Auth.setStats);



module.exports = router