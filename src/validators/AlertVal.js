const { Joi } = require('express-validation');

exports.createPriceAlertVal = Joi.object({
    exchange: Joi.string().optional(),
    currency: Joi.string().valid("BIDR", "BTC", "BUSD", "DAI", "ETH", "EUR", "GBP", "RUB", "TRY", "TUSD", "USD", "USDC", "USDT").optional(),
    coins: Joi.string().optional(),
    alertPrice: Joi.string().optional(),
    note: Joi.string().optional(),
    modeOfAlert: Joi.string().optional(),
    alertId: Joi.string().optional(),
}).unknown(true)

exports.deletePriceAlertVal = Joi.object({
    alertId: Joi.string().required(),
}).unknown(true)