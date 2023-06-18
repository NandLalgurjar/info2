const { Joi } = require('express-validation');

exports.coinConverterVal = Joi.object({
    exchangeId: Joi.string().required(),
    coin_id1: Joi.string().required(),
    Quantity: Joi.string().optional(),
    coin_id2: Joi.string().required(),
}).unknown(true)

exports.advancePriceSearchVal = Joi.object({
    coins: Joi.array().items(Joi.string()).required(),
    exchange: Joi.array().items(Joi.string()).required(),
    target: Joi.string().valid("BIDR", "BTC", "BUSD", "DAI", "ETH", "EUR", "GBP", "RUB", "TRY", "TUSD", "USD", "USDC", "USDT").required(),
    action: Joi.string().valid("sell", "buy",).required(),
})