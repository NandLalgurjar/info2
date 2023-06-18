const { Joi } = require('express-validation');

exports.createPortfolioVal = Joi.object({
    exchangeId: Joi.string().required(),
    coin_id: Joi.string().required(),
    Quantity: Joi.string().required(),
    investment: Joi.string().required(),
    target: Joi.string().valid("BIDR", "BTC", "BUSD", "DAI", "ETH", "EUR", "GBP", "RUB", "TRY", "TUSD", "USD", "USDC", "USDT").required(),
});

exports.editPortfolioVal = Joi.object({
    id: Joi.string().required(),
    Quantity: Joi.string().optional(),
    investment: Joi.string().optional(),
    // target: Joi.string().valid('USD', 'USDT', "BUSD").required(),
});
