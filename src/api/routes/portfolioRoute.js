const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require('../../validate');

const { portfolioVal: { portfolioProfileVal } } = require('../../validators/')
const { portfolioController: { createAndEditPortfolio, deletePortfolio, getPortfolioList, getPortfolioSubList } } = require('../controller');

router.post('/addPortfolio', auth, createAndEditPortfolio);
router.put('/deletePortfolio', auth, deletePortfolio);
router.get('/getPortfolioData', auth, getPortfolioList);
router.get('/getPortfolioSubList', auth, getPortfolioSubList);

module.exports = router
