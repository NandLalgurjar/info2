const axios = require('axios');
const { coinModel } = require('../../model/');
const exchange_tickersModel = require("../../model/exchangeTickerModel");
const targetCurrencyModel = require("../../model/targetCurrencyModel");
const mongoose = require('mongoose');

exports.importCoin = async (req) => {
    try {
        const response = await axios({
            url: "https://api.coingecko.com/api/v3/coins/list",
            method: "get",
        });
        console.log("response.data", response.data.length)
        let newArr = [];
        process.env.SORT_LENGTH ? response.data.length = 10 : null;
        let j = 0;
        for (let i of response.data) {
            j++;
            let chkData = await coinModel.findOne({ id: i.id });
            if (chkData) {
                chkData.id = i.id;
                chkData.symbol = i.symbol;
                chkData.name = i.name;
                chkData.actStatus = "onhold"
                await chkData.save();
                newArr.push(chkData)

            } else {
                let dd = await coinModel.create(i);
                newArr.push(dd)
            }
            if (j == response.data.length) {
                return newArr;
            }
        }
        if (newArr.length > 0) return newArr;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.updateCoins = async (req) => {
    try {
        const findCoins = await coinModel.distinct("id");
        let Arr = [];
        for (const doc of findCoins) {
            const response = await axios({
                url: `https://api.coingecko.com/api/v3/coins/${doc}`,
                method: "get",
            });
            const updateData = await coinModel.findOneAndUpdate({ id: response.data.id }, response.data, { new: true });
            Arr.push(updateData);
        };
        return Arr;
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getCoins = async (req) => {
    try {
        const data = await coinModel.aggregate([
            {
                '$lookup': {
                    'from': 'favorites',
                    'localField': 'id',
                    'foreignField': 'coin',
                    'pipeline': [
                        {
                            '$match': {
                                'userId': req.user._id
                            }
                        }
                    ],
                    'as': 'isfavoriate'
                }
            }, {
                '$project': {
                    'id': 1,
                    'symbol': 1,
                    'name': 1,
                    'image': 1,
                    'isfavoriate': {
                        '$cond': {
                            'if': {
                                '$and': [
                                    {
                                        '$isArray': '$isfavoriate'
                                    }, {
                                        '$gt': [
                                            {
                                                '$size': '$isfavoriate'
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
                    'isfavoriate': -1
                }
            }
        ]);
        return {
            success: true,
            message: "Data Fetch Successfully !",
            data
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

/* OLD code of getCoinListForBestBuyAndSell
exports.getCoinListForBestBuyAndSell = async (req) => {
    try {
        let condition = [];
        condition.push({
            '$unwind': {
                'path': '$tickers'
            }
        });

        if (req.query.target != undefined && req.query.target != "") {
            condition.push({
                '$match': {
                    'tickers.target': req.query.target
                }
            });
        };

        condition.push({
            '$group': {
                '_id': '$tickers.coin_id',
                'fieldN': {
                    '$push': {
                        '_id': '$_id',
                        'name': '$name',
                        'exchangeId': '$exchangeId',
                        'tickers': '$tickers'
                    }
                }
            }
        });

        condition.push({
            '$project': {
                'coin': {
                    '$reduce': {
                        'input': '$fieldN',
                        'initialValue': null,
                        'in': {
                            '$cond': {
                                'if': {
                                    '$gt': [
                                        '$$this.tickers.last', '$$value.tickers.last'
                                    ]
                                },
                                'then': '$$this',
                                'else': '$$value'
                            }
                        }
                    }
                }
            }
        });

        condition.push({
            '$replaceRoot': {
                'newRoot': '$coin'
            }
        });

        if (req.query.trade != undefined && req.query.trade == "sell") {
            condition.push({
                '$sort': {
                    'tickers.last': -1
                }
            });
        } else if (req.query.trade != undefined && req.query.trade == "buy") {
            condition.push({
                '$sort': {
                    'tickers.last': 1
                }
            });
        } else {
            return {
                success: false,
                message: "trade is require !",
            };
        };



        

        condition.push({
            '$limit': 10
        });

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
                data
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
}; */
exports.getCoinListForBestBuyAndSell = async (req) => {
    try {
        let condition = [];
        condition.push({
            '$unwind': {
                'path': '$tickers'
            }
        })
        condition.push({
            '$match': {
                'tickers.target': 'USDT'
            }
        })
        condition.push({
            '$group': {
                '_id': '$tickers.coin_id',
                'fieldN': {
                    '$push': {
                        'ExName': '$name',
                        'last': '$tickers.last',
                        'base': '$tickers.base',
                        'target': '$tickers.target',
                        'market': '$tickers.market',
                        'volume': '$tickers.volume',
                        'trust_score': '$tickers.trust_score',
                        'trade_url': '$tickers.trade_url',
                        'coin_id': '$tickers.coin_id',
                        'target_coin_id': '$tickers.target_coin_id'
                    }
                }
            }
        })
        condition.push({
            '$addFields': {
                'MAX': {
                    '$max': {
                        '$filter': {
                            'input': '$fieldN',
                            'as': 'value',
                            'cond': {
                                '$ne': [
                                    '$$value.last', null
                                ]
                            }
                        }
                    }
                },
                'MIN': {
                    '$filter': {
                        'input': '$fieldN',
                        'as': 'item',
                        'cond': {
                            '$eq': [
                                '$$item.last', {
                                    '$min': '$fieldN.last'
                                }
                            ]
                        }
                    }
                }
            }
        })
        condition.push({
            '$project': {
                '_id': '$_id',
                'target': '$_id.target',
                'MAX': 1,
                'MIN': {
                    '$arrayElemAt': [
                        '$MIN', 0
                    ]
                },
                'data': {
                    '$size': '$fieldN'
                },
                'data2': '$fieldN'
            }
        })
        condition.push({
            '$lookup': {
                'from': 'favorites',
                'localField': '_id',
                'foreignField': 'coin',
                'pipeline': [
                    {
                        '$match': {
                            'userId': req.user._id
                        }
                    }
                ],
                'as': 'isfavorites'
            }
        })
        condition.push({
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
        })

        if (req.query.trade != undefined && req.query.trade == "sell") {
            condition.push({
                '$project': {
                    '_id': 1,
                    'data': '$MAX',
                    'isfavorites': 1
                }
            })
        } else if (req.query.trade != undefined && req.query.trade == "buy") {
            condition.push({
                '$project': {
                    '_id': 1,
                    'data': '$MIN',
                    'isfavorites': 1
                }
            })
        } else {
            return {
                success: false,
                message: "trade is require !",
            };
        };
        condition.push({
            '$lookup': {
                'from': 'coins',
                'localField': '_id',
                'foreignField': 'id',
                'pipeline': [
                    {
                        '$project': {
                            '_id': 0,
                            'image': 1
                        }
                    }, {
                        '$replaceRoot': {
                            'newRoot': '$image'
                        }
                    }
                ],
                'as': 'img'
            }
        })
        condition.push({
            '$sort': {
                'isfavorites': -1
            }
        });
        if (req.query.limit === "true") {
            condition.push({
                '$limit': 10
            });
        }

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

exports.getAllCoins = async (req) => {
    try {
        let condition = [];
        const { exchangeId, coin_id } = req.query;

        if (exchangeId) {
            condition.push({
                '$match': {
                    'exchangeId': new mongoose.Types.ObjectId(exchangeId)
                }
            });
        };

        condition.push({
            '$unwind': {
                'path': '$tickers'
            }
        });

        condition.push({
            '$group': {
                '_id': '$tickers.coin_id',
                'fieldN': {
                    '$first': {
                        '_id': '$_id',
                        'name': '$name',
                        'exchangeId': '$exchangeId',
                        'coin': '$tickers'
                    }
                }
            }
        });

        condition.push({
            '$replaceRoot': {
                'newRoot': '$fieldN'
            }
        });
        condition.push({
            '$lookup': {
                'from': 'favorites',
                'localField': 'coin.coin_id',
                'foreignField': 'coin',
                'pipeline': [
                    {
                        '$match': {
                            'userId': req.user._id
                        }
                    }
                ],
                'as': 'isfavorites'
            }
        })
        condition.push({
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
        })
        if (coin_id) {
            condition.push({
                '$match': {
                    'coin.coin_id': { '$regex': coin_id, '$options': 'i' },
                }
            });
        };
        condition.push({
            '$sort': {
                'isfavorites': -1
            }
        });

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
                message: "Data Not Found",
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
exports.coinConverter = async (req) => {
    try {
        let arr = [];
        let obj = {};
        let condition = [];
        let numberOfcoin1 = req.body.Quantity ? Number(req.body.Quantity) : 1;

        condition.push({
            '$match': {
                'exchangeId': new mongoose.Types.ObjectId(req.body.exchangeId)
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
                    '$in': [req.body.coin_id1, req.body.coin_id2]
                },
                'tickers.target': 'USD'
            }
        });

        condition.push({
            '$project': {
                'name': '$name',
                'target': '$tickers.target',
                'coin_id': '$tickers.coin_id',
                'price': '$tickers.last'
            }
        });

        condition.push({
            '$group': {
                '_id': '$name',
                'data': {
                    '$push': {
                        'name': '$name',
                        'target': '$target',
                        'price': '$price',
                        'coin_id': '$coin_id'
                    }
                },
            }
        });

        const data = await exchange_tickersModel.aggregate(condition);

        if (Array.isArray(data) && data[0]?.data.length != 2) {
            return {
                success: false,
                message: "Data Not Found",
            };
        };

        for (const item of data[0].data) {
            if (req.body.coin_id1 == item.coin_id) { data[0]["coin_id1Price"] = item.price * numberOfcoin1 } else { data[0]["coin_id2Price"] = item.price };
        };

        obj.Exchange = data[0]["_id"];
        obj[req.body.coin_id1] = numberOfcoin1;
        obj[req.body.coin_id2] = data[0]["coin_id1Price"] / data[0]["coin_id2Price"];
        arr.push(obj);

        if (arr.length > 0) {
            return {
                success: true,
                message: "Coin Convert Successfully !",
                arr
            };
        } else {
            return {
                success: false,
                message: "Data Not Found",
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

exports.Target = async (req) => {
    try {
        //const data = await exchange_tickersModel.distinct("tickers.target");

        const data = await targetCurrencyModel.find({ actStatus: "active" });
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

exports.advancePriceSearch = async (req) => {
    try {
        let exchange = [];
        let condition = [];
        for (const item of req.body.exchange) {
            exchange.push(new mongoose.Types.ObjectId(item));
        };

        condition.push({
            '$match': {
                'exchangeId': {
                    '$in': exchange
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
                    '$in': req.body.coins
                },
                'tickers.target': req.body.target
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
        if (req.body.action == "buy") {
            condition.push({
                '$project': {
                    'details': {
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
                    }
                }
            });
        } else if (req.body.action == "sell") {
            condition.push({
                '$project': {
                    'details': {
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
            });
        } else {
            return {
                success: false,
                message: "Enter Valid action !",
            };
        };
        const data = await exchange_tickersModel.aggregate(condition)
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

/* 
exports.arbitrage = async (req) => {
    try {
        let condition = [];
        condition.push({
            '$unwind': {
                'path': '$tickers'
            }
        });

        if (req.query.target) {
            condition.push({
                '$match': {
                    'tickers.target': req.query.target
                }
            });
        } else {
            return {
                success: false,
                message: "target is require !",
            };
        };

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
                'percentageDifference': {
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

        condition.push({
            '$match': {
                'percentageDifference': {
                    '$gt': 0
                }
            }
        });

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
}; */
