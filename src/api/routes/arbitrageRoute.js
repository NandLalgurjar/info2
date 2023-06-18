const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require('../../validate');

const { arbitrageVal: { advancedArbitrageVal } } = require('../../validators/')
const { arbitrageController: { arbitrage, advancedArbitrage, arbitrageSentNotification } } = require('../controller');

//get coin accounding to arbitrage 
router.get("/arbitrage", auth, arbitrage)
router.post("/advancedArbitrage", validate(advancedArbitrageVal), auth, advancedArbitrage)

router.get("/arbitrage-sent-notification", arbitrageSentNotification)

module.exports = router;

