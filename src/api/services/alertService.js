const axios = require('axios');
const mongoose = require('mongoose');
const { alertModel } = require('../../model/');
const exchange_tickersModel = require("../../model/exchangeTickerModel");
const { sendNotification } = require("../../helpers/fcmNotification")
const userModel = require("../../model/userModel")

exports.createPriceAlert = async (req) => {
    try {
        req.body.userId = req.user._id
        let { id, ...body } = req.body
        let data;
        if (id) {
            data = await alertModel.findOneAndUpdate({ _id: id }, body, { new: true, upsert: true })
        } else {
            const FindData = await alertModel.findOne(body)
            if (FindData) {
                return {
                    success: false,
                    message: "Data Allready Exit",
                };
            };
            data = await alertModel.create(body);
        };
        return {
            success: true,
            message: "Data Added Successfully !",
            data
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getAlert = async (req) => {
    try {
        let filter = {};
        if (req.query.id) {
            filter._id = req.query.id;
        };
        filter.userId = req.user._id;

        const data = await alertModel.find(filter);
        if (Array.isArray(data) && data.length > 0) {
            return {
                success: true,
                message: "Data Fetch Successfully !",
                data
            };
        } else {
            return {
                success: true,
                message: "Data Not Found !",
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.sendAlert = async (req) => {
    try {
        let filter = {};
        // if (req.query.id) {
        //     filter._id = req.query.id;
        // };
        // filter.userId = req.user._id;
        filter.status = "pending";
        const data = await alertModel.find(filter);
        console.log(data.length, ";;;;-->data")
        let i = 0;
        for (const alert of data) {

            const FindCoin = await exchange_tickersModel.aggregate([{
                '$match': {
                    'exchangeId': alert.exchangeId,
                    'tickers.coin_id': alert.coin_id
                }
            }, {
                '$unwind': {
                    'path': '$tickers'
                }
            }, {
                '$match': {
                    'tickers.coin_id': alert.coin_id,
                    'tickers.target': alert.target,
                    'tickers.last': Number(alert.alertPrice)
                }
            }]);
            const user = await userModel.findOne({ _id: alert.userId })
            //console.log(FindCoin.length, ";;;;;---->FindCoin")
            if (Array.isArray(FindCoin) && FindCoin.length > 0) {
                let obj = {}
                obj.title = "alert triggered"
                obj.body = `this time yahi ${alert.coin_id} etne per hai ${alert.alertPrice} ${alert.nots} thank you `
                obj.appkey = user.appkey
                const send = sendNotification(obj)
                if (send?.success == true) {
                    await alertModel.findByIdAndUpdate({ _id: alert._id }, { status: "success" }, { new: true })
                    i++
                };
            };
        };
        return {
            success: true,
            message: `${i} Alert Send Successfully !`,
        };
    } catch (error) {
        console.log(error.message);
        // throw error
        return {
            success: false,
            message: error.message,
        };
    };
};
