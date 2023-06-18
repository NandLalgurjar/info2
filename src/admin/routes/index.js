const prefix = "/admin/"

module.exports = (app) => {
    app.use(`${prefix}`, require('./userRoute'));
    app.use(`${prefix}`, require('./urlRoute'));

};