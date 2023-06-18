const express = require("express");
const app = express();
const { CronJob } = require('cron');
require('dotenv').config();
// coustimize the default console.log function 
console.logCopy = console.log.bind(console);
console.log = function (...data) {
    const currentDate = '[' + new Date().toString() + ']';
    this.logCopy(`${currentDate}-->`, ...data);
}
//dbConnection
require("./src/datasource/dbConnection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { sendPriceAlert, arbitrageSentNotification } = require('./src/config/cronjob');

sendPriceAlert.start();
arbitrageSentNotification.start()

const port = process.env.CRON_PORT
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});