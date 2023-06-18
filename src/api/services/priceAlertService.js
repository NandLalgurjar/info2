const { alertModel, exchangeTickerModel, priceAlertModel } = require('../../model');
const mongoose = require('mongoose');
const { sendNotification } = require("../../helpers/fcmNotification")


exports.addAndEditAlert = async (req) => {
    try {
        const { exchange, alertId } = req.body;
        if (!exchange) {
            req.body.allExchanges = true;
        };
        if (alertId) {
            let chkAlert = await priceAlertModel.findOne({ _id: alertId, userId: req.user._id });
            if (chkAlert == null) {
                return {
                    status: 404,
                    message: "Alert not found",
                };
            };

            // if(!req.body.exchange){
            //   req.body.exchange=chkAlert.exchange;  
            // }

            let updateData = await priceAlertModel.findOneAndUpdate({ _id: alertId, userId: req.user._id }, req.body, { new: true });
            return {
                status: 200,
                message: "Alert updated successfully",
                data: {
                    createdData: updateData,
                }
            };
        } else {
            const fondData = await priceAlertModel.findOne(req.body);
            if (fondData) {
                return {
                    status: 400,
                    message: "data allready added",
                };
            };
            req.body.userId = req.user._id;
            let data = await priceAlertModel.create(req.body);
            return {
                status: 200,
                message: "Alert created successfully",
                data
            };
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getCurrentValByExchCoinCurr = async (req) => {
    try {
        const { coins, currency, exchange } = req.query;
        if (!coins) {
            return {
                status: 400,
                message: "coins is require",
            };
        };
        if (!currency) {
            return {
                status: 400,
                message: "currency is require",
            };
        };
        if (!exchange) {
            return {
                status: 400,
                message: "exchange is require",
            };
        };

        let agePipe = []
        agePipe.push({
            '$match': {
                'exchangeId': new mongoose.Types.ObjectId(exchange)
            }
        });

        agePipe.push({
            '$unwind': {
                'path': '$tickers'
            }
        });

        agePipe.push({
            $addFields: {
                tickersdata: {
                    $cond: { if: { $and: [{ $eq: [coins, "$tickers.coin_id"] }, { $eq: ["$tickers.target", currency] }] }, then: "$tickers.last", else: 0 }
                }
            }
        })

        agePipe.push({
            $match: {
                $expr: { $ne: ['$tickersdata', 0] }
            }
        })

        let currentValue = await exchangeTickerModel.aggregate(agePipe)
        return {
            status: 200,
            message: "Current value is here",
            data: { currentValue: currentValue[0].tickersdata }
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.deleteAlertRecord = async (req) => {
    try {
        let alertId = req.body.alertId;
        let chkAlert = await priceAlertModel.findOne({ _id: alertId });
        console.log(chkAlert)
        if (chkAlert) {
            let updateAlert = await priceAlertModel.findOneAndUpdate({ _id: alertId, userId: req.user._id, isdeleted: false }, { isdeleted: true }, { new: true });
            return {
                status: 200,
                message: "Alert deleted successfully",
                data: updateAlert
            };
        } else {
            return {
                status: 200,
                message: "data not  found",
            };
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getActivePriceAlerts = async (req) => {
    try {
        let condition = [];
        const fondData = await priceAlertModel.find({ userId: req.user._id, isTriggered: false });
        if (fondData.length == 0) {
            return {
                status: 400,
                message: "Alert Not Found",
            };
        };
        condition.push({
            '$match': {
                'userId': req.user._id,
                'isTriggered': false
            }
        });
        condition.push({
            '$lookup': {
                'from': 'exchange_tickers',
                'let': {
                    'coin': '$coins',
                    'target': '$currency'
                },
                'localField': 'coins',
                'foreignField': 'tickers.coin_id',
                'pipeline': [
                    {
                        '$unwind': {
                            'path': '$tickers'
                        }
                    }, {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$tickers.coin_id', '$$coin'
                                        ]
                                    }, {
                                        '$eq': [
                                            '$tickers.target', '$$target'
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                'as': 'result'
            }
        });
        condition.push({
            '$project': {
                'coins': 1,
                'currency': 1,
                'allExchanges': 1,
                'userId': 1,
                'alertPrice': 1,
                'note': 1,
                'modeOfAlert': 1,
                'isTriggered': 1,
                'isdeleted': 1,
                'details': {
                    '$cond': {
                        'if': {
                            '$eq': [
                                '$modeOfAlert', 'Sell'
                            ]
                        }, 'then': {
                            '$max': {
                                '$filter': {
                                    'input': '$result',
                                    'as': 'item',
                                    'cond': {
                                        '$eq': [
                                            '$$item.tickers.last', {
                                                '$max': '$result.tickers.last'
                                            }
                                        ]
                                    }
                                }
                            }
                        }, 'else': {
                            '$min': {
                                '$filter': {
                                    'input': '$result',
                                    'as': 'item',
                                    'cond': {
                                        '$eq': [
                                            '$$item.tickers.last', {
                                                '$min': '$result.tickers.last'
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const data = await priceAlertModel.aggregate(condition)
        if (data.length > 0) {
            return {
                status: 200,
                message: "Active price alerts are here",
                data
            };
        } else {
            return {
                status: 400,
                message: "Data Not Found",
            };
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getTriggeredPriceAlerts = async (req) => {
    try {
        let agePipe = [];
        let loggedInId = req.user._id
        let findData = await priceAlertModel.find({ 'userId': new mongoose.Types.ObjectId(req.user._id), 'isTriggered': true });
        if (findData.length == 0) {
            return {
                status: 400,
                message: "Data Not Found",
            };
        };
        agePipe.push({
            '$match': {
                'userId': new mongoose.Types.ObjectId(loggedInId),
                'isTriggered': true
            }
        });

        agePipe.push({
            '$lookup': {
                'from': 'exchange_tickers',
                'let': {
                    'coin': '$coins',
                    'target': '$currency'
                },
                'localField': 'coins',
                'foreignField': 'tickers.coin_id',
                'pipeline': [
                    {
                        '$unwind': {
                            'path': '$tickers'
                        }
                    }, {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$tickers.coin_id', '$$coin'
                                        ]
                                    }, {
                                        '$eq': [
                                            '$tickers.target', '$$target'
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                'as': 'result'
            }
        });
        agePipe.push({
            '$project': {
                'coins': 1,
                'currency': 1,
                'allExchanges': 1,
                'userId': 1,
                'alertPrice': 1,
                'note': 1,
                'modeOfAlert': 1,
                'isTriggered': 1,
                'isdeleted': 1,
                'details': {
                    '$cond': {
                        'if': {
                            '$eq': [
                                '$modeOfAlert', 'Sell'
                            ]
                        }, 'then': {
                            '$max': {
                                '$filter': {
                                    'input': '$result',
                                    'as': 'item',
                                    'cond': {
                                        '$eq': [
                                            '$$item.tickers.last', {
                                                '$max': '$result.tickers.last'
                                            }
                                        ]
                                    }
                                }
                            }
                        }, 'else': {
                            '$min': {
                                '$filter': {
                                    'input': '$result',
                                    'as': 'item',
                                    'cond': {
                                        '$eq': [
                                            '$$item.tickers.last', {
                                                '$min': '$result.tickers.last'
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // agePipe.push({
        //     '$lookup': {
        //         'from': 'exchange_tickers',
        //         'localField': 'exchange',
        //         'foreignField': 'exchangeId',
        //         'as': 'exchange'
        //     }
        // });

        // agePipe.push({
        //     '$unwind': {
        //         'path': '$exchange'
        //     }
        // });

        // agePipe.push({
        //     '$unwind': {
        //         'path': '$exchange.tickers'
        //     }
        // });

        // agePipe.push({
        //     '$addFields': {
        //         'tickersdata': {
        //             '$cond': {
        //                 'if': {
        //                     '$and': [
        //                         {
        //                             '$eq': [
        //                                 '$coins', '$exchange.tickers.coin_id'
        //                             ]
        //                         }, {
        //                             '$eq': [
        //                                 '$exchange.tickers.target', '$currency'
        //                             ]
        //                         }
        //                     ]
        //                 },
        //                 'then': '$exchange.tickers.last',
        //                 'else': 0
        //             }
        //         }
        //     }
        // });

        // agePipe.push({
        //     '$match': {
        //         '$expr': {
        //             '$ne': [
        //                 '$tickersdata', 0
        //             ]
        //         }
        //     }
        // });

        let data = await priceAlertModel.aggregate(agePipe);
        if (data.length == 0) {
            return {
                status: 200,
                message: "There are no triggered alerts yet"
            };
        }
        return {
            status: 200,
            message: "Triggered alerts are here",
            data
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.priceCompare = async (req) => {
    try {
        let condition = [];
        let dataObj = {};
        let match = {};
        let Sort = req.query.currentPriceSort ? Number(req.query.currentPriceSort) : 1;

        if (!req.query.coin_id || !req.query.exchangeId || !req.query.target) {
            return {
                status: 400,
                message: "Please Enter valid input - coin_id / exchangeId / target !",
            };
        };

        condition.push({
            '$unwind': {
                'path': '$tickers'
            }
        });

        match['tickers.coin_id'] = req.query.coin_id;
        match['tickers.target'] = req.query.target;
        condition.push({
            '$match': match
        });

        condition.push({
            '$project': {
                'name': 1,
                'coin_id': '$tickers.coin_id',
                'exchangeId': 1,
                'price': '$tickers.last',
                'trade_url': '$tickers.trade_url'
            }
        }, {
            '$lookup': {
                'from': "exchanges",
                'localField': "exchangeId",
                'foreignField': "_id",
                'pipeline': [
                    {
                        '$project': {
                            '_id': 0,
                            'image': 1,
                        },
                    },
                ],
                'as': "exchangesImage",
            },
        }, {
            '$sort': {
                'price': Sort
            }
        });
        if (req.query.sortByExchangeName) {
            condition.push({
                '$sort': {
                    'name': Number(req.query.sortByExchangeName)//-1
                }
            })
        }
        const Alldata = await exchangeTickerModel.aggregate(condition);
        match['exchangeId'] = new mongoose.Types.ObjectId(req.query.exchangeId);
        const data = await exchangeTickerModel.aggregate(condition);

        dataObj.connDetails = data
        dataObj.allExchanges = Alldata

        if (dataObj) {
            return {
                status: 200,
                message: "Data Fetch Successfully !",
                data: dataObj
            };
        } else {
            return {
                status: 400,
                message: "Data Not Found",
            };
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        };
    }
}

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

            const FindCoin = await exchangeTickerModel.aggregate([{
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
