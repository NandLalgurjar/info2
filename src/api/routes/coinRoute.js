const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require('../../validate');

const { coinController: { importCoin, updateCoins, getCoins, getAllCoins, getCoinListForBestBuyAndSell, coinConverter, Target, advancePriceSearch } } = require('../controller');
const { coinVal: { coinConverterVal, advancePriceSearchVal } } = require('../../validators/')
router.get('/importCoin', importCoin);
router.get("/updateCoins", updateCoins);
router.get("/getCoins", auth, getCoins);

//get-all-coins  for Market Management form-All exchange-tickers
router.get("/getAllCoins", auth, getAllCoins);
router.get('/getCoinListForBestBuyAndSell', auth, getCoinListForBestBuyAndSell);
router.post('/coinConverter', validate(coinConverterVal), auth, coinConverter);
router.get("/target", auth, Target);
router.post("/advancePriceSearch", validate(advancePriceSearchVal), auth, advancePriceSearch)

module.exports = router;


