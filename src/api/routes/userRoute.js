const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require('../../validate');


const { userVal: { userRegisterVal, generateCodeVal, logInVal, verificationVal, forgotPasswordVal, verifyOtpVal, addToFavoriteVal } } = require('../../validators/')
const { userController: { registerUser, generateCode, userLogin, Verification, forgotPassword, otpVerification, userLogout, addToFavorite } } = require('../controller');

router.get('/index', (req, res) => {
    console.log('❤️🚶Api routes are working fine');
});

router.post('/registerUser', validate(userRegisterVal), registerUser);
router.post('/generateCode', validate(generateCodeVal), generateCode);

router.put('/forgotPassword', validate(forgotPasswordVal), forgotPassword);
router.put('/otpVerification/resetPassword', validate(verifyOtpVal), otpVerification)
router.post('/login', validate(logInVal), userLogin);
router.post('/Verification', auth, validate(verificationVal), Verification);
router.put('/logoutUser', auth, userLogout);
router.post('/addToFavorite', validate(addToFavoriteVal), auth, addToFavorite);

module.exports = router;


