const express = require('express')
const router = express.Router();
const Admin = require('../controllers/admin');
const verifyToken = require('../utils/authenticate')
const Analytics = require('../controllers/analytics')
const Partner = require('../controllers/partner')
const Consultant = require('../controllers/consultant');

router.get('/business', verifyToken, Admin.AllBusiness)

router.get('/business/:id', verifyToken, Admin.GetOneBusiness)

router.delete('/business/:id', verifyToken, Admin.deleteOneBusiness)

router.post('/create-business', verifyToken, Admin.createNewBusiness)

router.post('/subscription/:id', verifyToken, Admin.oneSubscription)

router.post('/add-consultant/:id', verifyToken, Admin.addConsultant)

router.post('/business/:id', verifyToken, Admin.addNewBusiness)

router.patch('/business/:id', verifyToken, Admin.suspendBusiness)

router.get('/consultant', verifyToken, Admin.AllConsultants)

router.get('/consultant/:id', verifyToken, Admin.GetOneConsultant)

router.delete('/consultant/:id', verifyToken, Admin.deleteConsultant)

router.post('/create-consultant/:id', verifyToken, Admin.createConsultant)

router.patch('/consultant/:id', verifyToken, Admin.suspendConsultant)

router.get('/analytics', verifyToken, Admin.Analytics);

router.get('/partners', verifyToken, Admin.allPartners)

router.get('/admin/:id', verifyToken, Admin.getOneAdmin);

router.get('/partner-analytics/:id', verifyToken, Analytics.partnerAnalytics)

router.get('/partner-business/:id', verifyToken, Partner.getPartnerBusiness)

router.get('/partner-consultant/:id', verifyToken, Partner.getPartnerConsultants)

router.get('/all-user', verifyToken, Admin.AllUsers);

router.get('/consultant-analytics/:id', verifyToken, Consultant.ConsultantAnalytics)

router.get('/consultant-business/:id', verifyToken, Consultant.ConsultantBusiness)

router.get('/assign-partner/:id/:admin', verifyToken, Consultant.assignPartner)



// create new business
router.post('/create-business/:id', verifyToken, Admin.addBusiness);

module.exports = router