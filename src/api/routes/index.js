const prefix = "/api/"

module.exports = (app) => {
    app.use(`${prefix}`, require('./userRoute'));
    app.use(`${prefix}`, require('./coinRoute'));
    app.use(`${prefix}`, require('./exhangeRoute'));
    app.use(`${prefix}`, require('./request'));
    app.use(`${prefix}`, require('./portfolioRoute'));
    app.use(`${prefix}`, require('./priceAlertRoute'));
    app.use(`${prefix}`, require('./arbitrageRoute'));
};
