const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require('../../validate');


// const {userVal:{ userRegisterVal, generateCodeVal, signUpVal }} = require('../../validators/')
const { exchangeController: { saveEchange, exchangeTicker, getExchange, compareExchange } } = require('../controller');

router.get('/exchanges', auth, saveEchange);
router.get('/exchangesTickers', auth, exchangeTicker);
router.get('/getExchange', auth, getExchange);
router.get('/compareExchange', auth, compareExchange);


module.exports = router;


