const axios = require('axios');
const exchange_tickersModel = require("../../model/exchangeTickerModel");
const { coinModel, exchangeModel, exchangeTickerModel } = require('../../model/');
const { default: mongoose } = require('mongoose');


/* exports.saveExhangeList = async (req) => {
    try {
        const response = await axios({
            url: "https://api.coingecko.com/api/v3/exchanges",
            method: "get",
        });
        const shortArray = response.data.slice(0, 10);
        const data = await exchangeModel.insertMany(shortArray);
        if (data) return data;
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            message: error.message,
        };
    };
}; */


exports.saveExhangeList = async (req) => {
    try {
        const response = await axios({
            url: "https://api.coingecko.com/api/v3/exchanges",
            method: "get",
        });
        const shortArray = response.data.slice(0, 10);
        let arr = []
        for (const item of shortArray) {
            const data = await exchangeModel.findOneAndUpdate({ id: item.id }, item, { new: true, upsert: true });
            arr.push(data)
        };
        if (arr.length > 0) {
            return {
                success: true,
                message: "Data Insert Successfully !",
                data: arr
            };
        } else {
            return {
                success: true,
                message: "Same Thing Wrong  !",
            };
        };
    } catch (error) {
        console.log(error.message);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getExchangeTicker = async (req) => {
    try {
        const { exchangeId } = req.query;
        const chkData = await exchangeModel.findOne({ _id: exchangeId });
        const response = await axios({
            url: `https://api.coingecko.com/api/v3/exchanges/${chkData.id}/tickers`,
            method: "get",
        });

        const saveData = await exchangeTickerModel.findOneAndUpdate({ exchangeId: chkData._id }, {
            id: chkData.id,
            name: response.data.name,
            tickers: response.data.tickers
        }, { new: true, upsert: true })
        if (saveData) return saveData;
    } catch (error) {
        console.log(error.message);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getExchange = async (req) => {
    try {
        const { id, name } = req.query;
        let condition = {};
        if (id) {
            condition._id = new mongoose.Types.ObjectId(id);
        };
        if (name) {
            condition.name = { '$regex': name, '$options': 'i' };
        };

        const data = await exchangeModel.aggregate([
            {
                '$match': condition
            }, {
                '$lookup': {
                    'from': 'favorites',
                    'localField': '_id',
                    'foreignField': 'exchange',
                    'pipeline': [
                        {
                            '$match': {
                                'userId': req.user._id
                            },
                        },
                    ],
                    'as': 'isfavorites'
                }
            }, {
                '$addFields': {
                    'isfavorites': {
                        '$cond': {
                            'if': {
                                '$and': [
                                    {
                                        '$isArray': '$isfavorites'
                                    }, {
                                        '$gt': [
                                            {
                                                '$size': '$isfavorites'
                                            }, 0
                                        ]
                                    }
                                ]
                            },
                            'then': true,
                            'else': false
                        }
                    }
                }
            }, {
                '$sort': {
                    'isfavorites': -1
                }
            }
        ]);

        if (Array.isArray(data) && data.length > 0) {
            return {
                success: true,
                message: "Data Fetch Successfully !",
                data
            };
        } else {
            return {
                success: false,
                message: "Data Not Found",
            };
        };
    } catch (error) {
        console.log(error.message);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.compareExchange = async (req) => {
    try {
        const { id } = req.query;
        let condition = {};
        let obj = {};
        obj['$in'] = id;
        if (id) {
            condition._id = obj;
        };
        const data = await exchangeModel.find(condition);

        if (Array.isArray(data) && data.length > 0) {
            return {
                success: true,
                message: "Data Fetch Successfully !",
                data
            };
        } else {
            return {
                success: false,
                message: "Data Not Found",
            };
        };
    } catch (error) {
        console.log(error.message);
        return {
            success: false,
            message: error.message,
        };
    };
};
