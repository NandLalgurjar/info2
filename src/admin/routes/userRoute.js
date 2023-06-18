const express = require("express");
const router = express.Router();
const auth = require("../../middleware/adminAuth");
const validate = require('../../validate');

const { userVal: { adminVal, logInVal } } = require('../../validators/')
const { userController: { createAdmin, loginAdmin, getAdminProfile, editAdminProfile, resetPassword, getAllUsers, blockUser, unBlockUser, getRequests, setCronTime, getUserPortfolioList, replyToRequests, activateDeactivateExchange,
    exchangeList, editExchangeData, activateCoinStatus, updateTargetCurrency, getTargetCurrency, activateCurrency, getCompanyDetails, editCompanyDetails, getAdminUserList, updateUser, sendMaintainanceNotification, addUser, deleteUserData, cronTimingSet, adminLogOut } } = require('../controller');


router.get("/test", async (req, res) => {
    res.send('admin routes are working fine');
});

router.post('/registration', validate(adminVal), createAdmin);
router.post('/login', validate(logInVal), loginAdmin);
router.get('/getProfile', auth, getAdminProfile);
router.put('/editProfile', auth, editAdminProfile);
router.put('/resetPassword', auth, resetPassword);

router.get('/getUserList', auth, getAllUsers);

router.put('/blockUser', auth, blockUser);
router.put('/unBlockUser', auth, unBlockUser);
router.get('/getUserSupportReq', auth, getRequests);
//cron time chang by admin
router.put('/timeChange', auth, setCronTime);

router.get('/portfolioList', auth, getUserPortfolioList);
router.post('/replyToSuppQuestions', auth, replyToRequests);
//disable
router.put('/activateDeactivateExchange', auth, activateDeactivateExchange);

router.get('/exchangeList', auth, exchangeList);
router.put('/editExchangeData', auth, editExchangeData);
//disable
router.put('/activateCoinStatus', auth, activateCoinStatus);

router.post('/updateTargetCurrency', auth, updateTargetCurrency);
router.get('/getTargetCurrency', auth, getTargetCurrency);
//disable
router.put('/activateCurrency', auth, activateCurrency);

//company detail create api 
router.get('/getcompanyDetails', auth, getCompanyDetails);
router.put('/editCompanyDetails', auth, editCompanyDetails);

router.get('/getAdminUserList', auth, getAdminUserList);
router.put('/updateUser', auth, updateUser);
router.post('/addUserData', auth, addUser);
router.put('/deleteUser', auth, deleteUserData);

router.put('/sendMaintainanceNotification', auth, sendMaintainanceNotification);

router.put('/cronTimingSet', auth, cronTimingSet)

router.put('/logout', auth, adminLogOut);


module.exports = router;

