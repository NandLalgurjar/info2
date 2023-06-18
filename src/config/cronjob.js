const { CronJob } = require('cron');
const { priceAlertController: { sendPriceAlert } } = require('../../src/api/controller/');

const { arbitrageController: { arbitrageSentNotification } } = require("../../src/api/controller")
let i = 1

exports.sendPriceAlert = new CronJob('* * * * * *', async function (req, res) {
    try {
        const data = await sendPriceAlert(req)
        console.log("data", data, "==", i)
        i++
    } catch (e) {
        console.log(e)
        throw e
    };
});

exports.arbitrageSentNotification = new CronJob('* * * * * *', async function (req, res) {
    try {
        console.log("start");
        await arbitrageSentNotification(req)
        console.log("End");
    } catch (e) {
        console.log(e)
        throw e
    };
});
