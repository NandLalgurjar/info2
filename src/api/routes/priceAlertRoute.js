const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require('../../validate');


const { AlertVal: { createPriceAlertVal, deletePriceAlertVal } } = require('../../validators/')
const { priceAlertController: { createAndEditAlert, deleteAlert, getCurrentValue, priceCompare, getActivePriceAlertList, getTriggeredPriceAlertList } } = require('../controller');
const { getTriggeredPriceAlerts } = require('../services/priceAlertService');


router.post('/addPriceAlert', auth, validate(createPriceAlertVal), createAndEditAlert);
router.put('/deletePriceAlert', auth, validate(deletePriceAlertVal), deleteAlert);
router.get('/getCurrentValue', auth, getCurrentValue);
router.get('/getActivePriceAlerts', auth, getActivePriceAlertList);
router.get('/getTriggeredPriceAlerts', auth, getTriggeredPriceAlertList);
router.get('/priceCompareForBuySell', auth, priceCompare);








module.exports = router;