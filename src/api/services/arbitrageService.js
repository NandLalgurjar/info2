const axios = require('axios');
const mongoose = require('mongoose');
const { coinModel } = require('../../model/');
const exchange_tickersModel = require("../../model/exchangeTickerModel");
const { sendNotificationForArbitrage } = require("../../helpers/fcmNotification");
const { query } = require('express');

const arbitrageModel = require("../../model/arbitrageAlertModel");


exports.arbitrage = async (req) => {
    try {
        let condition = [];
        let obj = {};
        let exchange = [];
        if (req.body.exchangeId) {
            for (const item of req.body.exchangeId) {
                exchange.push(new mongoose.Types.ObjectId(item))
            };
        };

        if (exchange.length > 0) {
            condition.push({
                '$match': {
                    'exchangeId': { $in: exchange }
                }
            });
        };

        if (req.body.target) {
            obj['tickers.target'] = req.body.target
        } else {
            return {
                success: false,
                message: "target is require !",
            };
        };

        if (req.body.volume) {
            obj['tickers.volume'] = { $gte: Number(req.body.volume) }
        };

        if (req.body.coin_id) {
            obj['tickers.coin_id'] = { $in: req.body.coin_id, }
        };

        if (req.body.trust_score) {
            obj['tickers.trust_score'] = req.body.trust_score
        };

        condition.push({
            '$unwind': {
                'path': '$tickers'
            }
        });
        condition.push({
            '$match': obj
        });

        condition.push({
            '$group': {
                '_id': '$tickers.coin_id',
                'fieldN': {
                    '$push': {
                        '_id': '$_id',
                        'name': '$name',
                        'exchangeId': '$exchangeId',
                        'coin': '$tickers'
                    }
                }
            }
        });

        condition.push({
            '$project': {
                'max': {
                    '$reduce': {
                        'input': '$fieldN',
                        'initialValue': null,
                        'in': {
                            '$cond': {
                                'if': {
                                    '$gt': [
                                        '$$this.coin.last', '$$value.coin.last'
                                    ]
                                },
                                'then': '$$this',
                                'else': '$$value'
                            }
                        }
                    }
                },
                'min': {
                    '$min': {
                        '$filter': {
                            'input': '$fieldN',
                            'as': 'value',
                            'cond': {
                                '$ne': [
                                    '$$value.coin.last', null
                                ]
                            }
                        }
                    }
                },

            }
        });

        condition.push({
            '$addFields': {
                'estProfitPresentage': {
                    '$multiply': [
                        {
                            '$divide': [
                                {
                                    '$subtract': [
                                        '$max.coin.last', '$min.coin.last'
                                    ]
                                }, {
                                    '$abs': {
                                        '$ifNull': [
                                            '$max.coin.last', 1
                                        ]
                                    }
                                }
                            ]
                        }, 100
                    ]
                }
            }
        });
        if (req.body.estProfitPresentage) {
            condition.push({
                '$match': {
                    'estProfitPresentage': {
                        '$gt': Number(req.body.estProfitPresentage)
                    }
                }
            });
        } else {
            condition.push({
                '$match': {
                    'estProfitPresentage': {
                        '$gt': 0
                    }
                }
            });
        };

        const data = await exchange_tickersModel.aggregate(condition);
        if (Array.isArray(data) && data.length > 0) {
            return {
                success: true,
                message: "Data Fetch Successfully !",
                data
            };
        } else {
            return {
                success: false,
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

exports.advancedArbitrage = async (req) => {
    try {
        let data;
        if (req.query.id) {
            data = await arbitrageModel.findByIdAndUpdate({ _id: req.query.id }, req.body, { new: true })
        } else {
            req.body.userId = req.user._id;
            const findData = await arbitrageModel.findOne(req.body);
            if (findData) {
                return {
                    success: false,
                    message: "Data AllReady Exit !",
                };
            };
            const Data = new arbitrageModel(req.body);
            data = await Data.save();
        };

        if (data) {
            return {
                success: true,
                message: "Data Created Successfully !",
                data
            };
        } else {
            return {
                success: false,
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

exports.SentNotification = async (req) => {
    try {
        let condition = [];
        const findData = await arbitrageModel.aggregate([{
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'user'
            }
        }]);
        let i = 0;

        for (const item of findData) {

            condition.push({
                '$match': {
                    'exchangeId': {
                        '$in': [item.sellFromExchangeId, item.buyFromExchangeId,]
                    }
                }
            });

            condition.push({
                '$unwind': {
                    'path': '$tickers'
                }
            });
            condition.push({
                '$match': {
                    'tickers.coin_id': {
                        '$in': item.coins
                    },
                    'tickers.target': item.target
                }
            });
            condition.push({
                '$group': {
                    '_id': '$tickers.coin_id',
                    'coins': {
                        '$push': {
                            'exchangeId': '$exchangeId',
                            'base': '$tickers.base',
                            'coin_id': '$tickers.coin_id',
                            'last': '$tickers.last',
                            'target': '$tickers.target',
                            'exname': '$name',
                            'market': '$tickers.market',
                            'volume': '$tickers.volume'
                        }
                    }
                }
            });
            condition.push({
                '$project': {
                    'min': {
                        '$min': {
                            '$filter': {
                                'input': '$coins',
                                'as': 'value',
                                'cond': {
                                    '$ne': [
                                        '$$value.last', null
                                    ]
                                }
                            }
                        }
                    },
                    'max': {
                        '$max': {
                            '$filter': {
                                'input': '$coins',
                                'as': 'value',
                                'cond': {
                                    '$ne': [
                                        '$$value.last', null
                                    ]
                                }
                            }
                        }
                    }
                }
            }, {
                '$project': {
                    'minPrice': '$min.last',
                    'maxPrice': '$max.last',
                    'Buy': '$min',
                    'sell': '$max',
                    'profit': {
                        '$subtract': [
                            '$max.last', '$min.last'
                        ]
                    },
                    'profitP': {
                        '$multiply': [
                            {
                                '$divide': ["$min.last", 100],
                            },
                            item.estProfitPresentage,
                        ],
                    },
                }
            });
            condition.push({
                '$match': {
                    'profitP': {
                        '$gte': '$profit'
                    },
                }
            });
            const data = await exchange_tickersModel.aggregate(condition);
            if (Array.isArray(data) && data.length > 0) {
                for (const doc of data) {
                    doc.appkey = item.user[0].appkey
                    const Sendnoti = await sendNotificationForArbitrage(doc)
                    if (Sendnoti?.success) {
                        i++
                        await arbitrageModel.findByIdAndUpdate({ _id: item._id }, { status: "success" }, { new: true })
                    };
                };
            } else {
                console.log("data not found not send notification")
            };
        };

        return {
            success: true,
            message: `${i} notification Sent Successfully !`,
        };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};