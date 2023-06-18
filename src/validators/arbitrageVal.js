const { Joi } = require('express-validation');

exports.advancedArbitrageVal = Joi.object({
    coins: Joi.array().optional(),
    buyFromExchangeId: Joi.string().optional(),
    sellFromExchangeId: Joi.string().optional(),
    target: Joi.string().valid("BIDR", "BTC", "BUSD", "DAI", "ETH", "EUR", "GBP", "RUB", "TRY", "TUSD", "USD", "USDC", "USDT").optional(),
    estProfitPresentage: Joi.number().optional(),
    // minValume: Joi.string().optional(),
    // time: Joi.string().optional(),
    // trustScore: Joi.string().optional(),
})