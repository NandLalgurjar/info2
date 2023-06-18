const prefix = "/admin/"

module.exports = (app) => {
    app.use(`${prefix}`, require('./admin1/route'));
    app.use(`${prefix}`, require('./add_saloon/routes'));
    app.use(`${prefix}`, require('./add_service/routes'));
    app.use(`${prefix}`, require('./add_frequent/routes'));
    app.use(`${prefix}`, require('./order/route'));
    app.use(`${prefix}`, require('./blog/routes'));
    app.use(`${prefix}`, require('./Coupon/route'));
    app.use(`${prefix}`, require('./payment/route'));
    app.use(`${prefix}`, require('./category/routes'));
    app.use(`${prefix}`, require('./users/route'));
    app.use(`${prefix}`, require('./Artists/routes'));
    app.use(`${prefix}`, require('./Vacancy/routes'));
    // app.use(`${prefix}`, require('./Refer-And-point'));
    // app.use(`${prefix}`, require('./Contact-us'));
    app.use(`${prefix}`, require('./servicePackage/route'));
    app.use(`${prefix}`, require('./newLetter/routes'));
};