const express = require('express')
const router = express.Router();
const Admin = require('../controllers/admin');
const verifyToken = require('../utils/authenticate')

router.get('/business', verifyToken, Admin.AllBusiness)

router.get('/business/:id', verifyToken, Admin.GetOneBusiness)

router.delete('/business/:id', verifyToken, Admin.deleteOneBusiness)

router.post('/subscription/:id', verifyToken, Admin.oneSubscription)

router.post('/add-consultant/:id', verifyToken, Admin.addConsultant)

router.post('/business/:id', verifyToken, Admin.addNewBusiness)

router.patch('/business/:id', verifyToken, Admin.suspendBusiness)

router.get('/consultant', verifyToken, Admin.AllConsultants)

router.get('/consultant/:id', verifyToken, Admin.GetOneConsultant)

router.delete('/consultant/:id', verifyToken, Admin.deleteConsultant)

router.post('/create-consultant', verifyToken, Admin.createConsultant)

router.patch('/consultant/:id', verifyToken, Admin.suspendConsultant)

router.get('/analytics', verifyToken, Admin.Analytics)


// create new business
router.post('/create-business/:id', verifyToken, Admin.addBusiness);

module.exports = router