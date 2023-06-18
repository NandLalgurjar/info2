const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require('../../validate');

const { AlertVal: { createPriceAlertVal } } = require('../../validators/')
const { alertController: { createPriceAlert, getAlert, sendPriceAlert } } = require('../controller');

router.post('/CreatePriceAlert', validate(createPriceAlertVal), auth, createPriceAlert);
router.get('/getAlert', auth, getAlert);

router.get("/cron", auth, sendPriceAlert)

module.exports = router;


