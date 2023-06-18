const { portfolioModel } = require('../../model/');
const mongoose = require('mongoose');

exports.addAndEditPortfolio = async (req) => {
  try {

    const { coins, exchange, quantity, investmentValue, portfolioId } = req.body;

    if (portfolioId) {

      let chkPortF = await portfolioModel.findOne({ _id: portfolioId, userId: req.user._id });

      if (chkPortF == null) {
        return {
          success: false,
          message: "Portfolio not found",

        };
      }

      let updateData = await portfolioModel.findOneAndUpdate({ _id: portfolioId, userId: req.user._id }, req.body, { new: true });


      return {
        success: true,
        message: "Portfolio updated successfully",
        data: updateData

      };

    } else {

      req.body.userId = req.user._id
      console.log("here--->")

      let addData = await portfolioModel.create(req.body);

      return {
        success: true,
        message: "Portfolio created successfully",
        data: addData

      };

    }


  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}




exports.deleteUserPortfolio = async (req) => {
  try {
    let portfolioId = req.body.portfolioId;
    let chkPortF = await portfolioModel.findOneAndUpdate({ _id: portfolioId, userId: req.user._id }, { isdeleted: true }, { new: true });

    return {
      success: true,
      message: "Portfolio deleted successfully",
      data: chkPortF
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error.message
    };
  }
}

// getAllPortfolio old code 
/* 

exports.getAllPortfolio = async (req) => {
  try {


    let agePipe = [];

    let targetName = req.query.targetName;
    let loggedInId = req.user._id;

    agePipe.push({
      $match: {
        $and: [{
          'userId': new mongoose.Types.ObjectId(loggedInId)
        }, { 'isdeleted': false }]
      }
    })

    agePipe.push({
      $lookup: {
        let: {
          exchangeId: "$exchange",
          coinId: "$coins",
          target: "$target",
        },
        from: "exchange_tickers",
        localField: "exchange",
        foreignField: "exchangeId",
        pipeline: [
          {
            $unwind: {
              path: "$tickers",
            },
          },
          {
            $match: {
              $and: [
                {
                  $expr: {
                    $eq: [
                      "$tickers.coin_id",
                      "$$coinId",
                    ],
                  },
                },
                {
                  $expr: {
                    $eq: [
                      "$tickers.target",
                      "$$target",
                    ],
                  },
                },
              ],
            },
          },
        ],
        as: "exchange",
      }
    })

    agePipe.push({
      $unwind: {
        path: "$exchange"
      }
    })



    agePipe.push({
      $unwind: {
        path: "$exchange.tickers"
      }
    })

    agePipe.push({

      $addFields:
      {
        tickersdata:
        {
          $cond: { if: { $and: [{ $eq: ["$coins", "$exchange.tickers.coin_id"] }, { $eq: ["$exchange.tickers.target", "$target"] }] }, then: "$exchange.tickers.last", else: 0 }
        }

      }
    })
    //check exchange  active / onhold
    agePipe.push({
      $lookup: {
        from: "exchanges",
        localField: "exchange.exchangeId",
        foreignField: "_id",
        pipeline: [
          {
            $match: {
              actStatus: "active",
            },
          },
        ],
        as: "exchangeStatus",
      },
    },
      {
        $addFields: {
          exchangeStatus: {
            $cond: {
              if: {
                $and: [
                  {
                    $isArray: "$exchangeStatus",
                  },
                  {
                    $gt: [
                      {
                        $size: "$exchangeStatus",
                      },
                      0,
                    ],
                  },
                ],
              },
              then: "active",
              else: "onhold",
            },
          },
        },
      })

    agePipe.push({
      $match: {

        $expr: { $ne: ['$tickersdata', 0] }

      }
    })

    //restructuring
    agePipe.push({
      $addFields: {
        singleValue: { $divide: ["$investmentValue", "$quantity"] },
        gainLoss: { $cmp: ["$tickersdata", { $divide: ["$investmentValue", "$quantity"] }] },
        valueDifference: {
          $cond: { if: { $eq: ["$gainLoss", 1] }, then: { $subtract: [{ $divide: ["$investmentValue", "$quantity"] }, "$tickersdata"] }, else: { $subtract: ["$tickersdata", { $divide: ["$investmentValue", "$quantity"] }] } }
        }
      }
    })



    agePipe.push({
      $addFields: {
        percentageGainLoss: { $multiply: [{ $divide: ["$valueDifference", "$singleValue"] }, 100] }
      }
    })





    agePipe.push({
      $project: {

        exchange: 1,
        coins: 1,
        quantity: 1,
        investmentValue: 1,
        exchangeStatus: 1,
        currentValue: "$tickersdata",
        gainLoss: 1,
        valueDifference: {
          $divide: [
            { $round: [{ $multiply: ["$valueDifference", 100] }] },
            100
          ]
        },
        percentageGainLoss: {
          $divide: [
            { $round: [{ $multiply: ["$percentageGainLoss", 100] }] },
            100
          ]
        },
      }
    });


    agePipe.push({
      $group: {
        _id: "$coins",
        totalCurrentValue: { $sum: "$currentValue" },
        totalInvestmentValue: { $sum: "$investmentValue" },
        totalQuantity: { $sum: "$quantity" },
        count: { $count: {} },
        percentageSum: { $sum: "$percentageGainLoss" },
        //avaragePercentage:{$divide:["$percentageSum","$count"]},
        netGainLoss: { $sum: "$valueDifference" },
        exchangeStatus: {
          $first: "$exchangeStatus"
        }
        // exchange:"$exchange"
      }
    })


    agePipe.push({
      $project: {
        _id: 1,
        totalCurrentValue: 1,
        totalInvestmentValue: 1,
        totalQuantity: 1,
        count: 1,
        // percentageSum:1,
        avaragePercentage: { $divide: ["$percentageSum", "$count"] },
        netGainLoss: 1,
        exchangeStatus: 1
        // exchange:"$exchange"

      }
    })


    agePipe.push({
      $lookup: {
        from: "coins",
        localField: "_id",
        foreignField: "id",
        as: "coindata"
      }
    })

    // for coin status
    agePipe.push({
      $addFields: {
        coinStatus: {
          $cond: {
            if: {
              $isArray: "$coindata",
            },
            then: {
              $arrayElemAt: [
                "$coindata.actStatus",
                0,
              ],
            },
            else: null,
          },
        },
      },
    })

    let data = await portfolioModel.aggregate(agePipe);

    let numberOfAssets = data.length;
    let sumOfAllCurrentVal = 0;
    let netGainLoss = 0;
    let percentageSum = 0;

    for (let i = 0; i <= data.length - 1; i++) {

      sumOfAllCurrentVal = sumOfAllCurrentVal + data[i].totalCurrentValue;
      netGainLoss = netGainLoss + data[i].netGainLoss;
      percentageSum = percentageSum + data[i].avaragePercentage;
    }

    let avgOfCurrentVal = sumOfAllCurrentVal / numberOfAssets;

    let avgPercentageGL = percentageSum / numberOfAssets;




    let topFields = {
      currentValue: avgOfCurrentVal.toFixed(2),
      numberOfAssets: numberOfAssets,
      avgGainLoss: netGainLoss.toFixed(2),
      avgPercentageGL: avgPercentageGL.toFixed(2)
    }

    return {
      success: true,
      message: "Portfolio data fetched successfully",
      data: { topFields: topFields, portfolioList: data }

    };


  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error.message
    };
  }
}

*/

exports.getAllPortfolio = async (req) => {
  try {
    let condition = []

    condition.push(
      {
        '$match': {
          'userId': req.user._id,
          'isdeleted': false,
          'target': req.user.target
        }
      }, {
      '$lookup': {
        'let': {
          'exchangeId': '$exchange',
          'coinId': '$coins',
          'target': '$target'
        },
        'from': 'exchange_tickers',
        'localField': 'exchange',
        'foreignField': 'exchangeId',
        'pipeline': [
          {
            '$unwind': {
              'path': '$tickers'
            }
          }, {
            '$match': {
              '$and': [
                {
                  '$expr': {
                    '$eq': [
                      '$tickers.coin_id', '$$coinId'
                    ]
                  }
                }, {
                  '$expr': {
                    '$eq': [
                      '$tickers.target', '$$target'
                    ]
                  }
                }
              ]
            }
          }
        ],
        'as': 'exchange'
      }
    }, {
      '$unwind': {
        'path': '$exchange'
      }
    }, {
      '$addFields': {
        'tickersdata': '$exchange.tickers.last',
        'coinLastPrice': '$exchange.tickers.last',
        'exchangeName': '$exchange.name'
      }
    }, {
      '$lookup': {
        'from': 'exchanges',
        'localField': 'exchange.exchangeId',
        'foreignField': '_id',
        'as': 'exchangeData'
      }
    }, {
      '$addFields': {
        'exchangeStatus': '$exchangeData.actStatus'
      }
    }, {
      '$unwind': {
        'path': '$exchangeStatus'
      }
    }, {
      '$addFields': {
        'singleValue': {
          '$cond': {
            'if': {
              '$eq': [
                '$exchangeStatus', 'active'
              ]
            },
            'then': {
              '$divide': [
                '$investmentValue', '$quantity'
              ]
            },
            'else': '-'
          }
        },
        'gainLoss': {
          '$cond': {
            'if': {
              '$eq': [
                '$exchangeStatus', 'active'
              ]
            },
            'then': {
              '$cmp': [
                '$tickersdata', {
                  '$divide': [
                    '$investmentValue', '$quantity'
                  ]
                }
              ]
            },
            'else': '-'
          }
        },
        'valueDifference': {
          '$cond': {
            'if': {
              '$eq': [
                '$exchangeStatus', 'active'
              ]
            },
            'then': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$gainLoss', 1
                  ]
                },
                'then': {
                  '$subtract': [
                    {
                      '$divide': [
                        '$investmentValue', '$quantity'
                      ]
                    }, '$tickersdata'
                  ]
                },
                'else': {
                  '$subtract': [
                    '$tickersdata', {
                      '$divide': [
                        '$investmentValue', '$quantity'
                      ]
                    }
                  ]
                }
              }
            },
            'else': '-'
          }
        }
      }
    }, {
      '$addFields': {
        'percentageGainLoss': {
          '$cond': {
            'if': {
              '$eq': [
                '$exchangeStatus', 'active'
              ]
            },
            'then': {
              '$multiply': [
                {
                  '$divide': [
                    '$valueDifference', '$singleValue'
                  ]
                }, 100
              ]
            },
            'else': '-'
          }
        }
      }
    }, {
      '$project': {
        'exchange': 1,
        'coins': 1,
        'quantity': 1,
        'investmentValue': 1,
        'exchangeStatus': 1,
        'singleValue': 1,
        'currentValue': '$tickersdata',
        'gainLoss': 1,
        'valueDifference': {
          '$cond': {
            'if': {
              '$eq': [
                '$exchangeStatus', 'active'
              ]
            },
            'then': {
              '$divide': [
                {
                  '$round': [
                    {
                      '$multiply': [
                        '$valueDifference', 100
                      ]
                    }
                  ]
                }, 100
              ]
            },
            'else': '-'
          }
        },
        'percentageGainLoss': {
          '$cond': {
            'if': {
              '$eq': [
                '$exchangeStatus', 'active'
              ]
            },
            'then': {
              '$divide': [
                {
                  '$round': [
                    {
                      '$multiply': [
                        '$percentageGainLoss', 100
                      ]
                    }
                  ]
                }, 100
              ]
            },
            'else': '-'
          }
        }
      }
    }, {
      '$group': {
        '_id': {
          'id': '$coins',
          'exchangeId': '$exchange._id'
        },
        'totalCurrentValue': {
          '$sum': '$currentValue'
        },
        'totalInvestmentValue': {
          '$sum': '$investmentValue'
        },
        'avaragePercentage': {
          '$avg': {
            '$divide': [
              "$avaragePercentage",
              "$totalQuantity",
            ],
          },
        },
        'totalQuantity': {
          '$sum': '$quantity'
        },
        'count': {
          '$count': {}
        },
        'percentageSum': {
          '$sum': '$percentageGainLoss'
        },
        'netGainLoss': {
          '$sum': '$valueDifference'
        },
        'exchangeStatus': {
          '$first': '$exchangeStatus'
        }
      }
    }, {
      '$project': {
        '_id': 1,
        'totalCurrentValue': 1,
        'totalInvestmentValue': 1,
        'totalQuantity': 1,
        'count': 1,
        'avaragePercentage': {
          '$divide': [
            '$percentageSum', '$count'
          ]
        },
        'netGainLoss': 1,
        'exchangeStatus': 1
      }
    }, {
      '$lookup': {
        'from': 'coins',
        'localField': '_id.id',
        'foreignField': 'id',
        'as': 'coindata'
      }
    }, {
      '$addFields': {
        'coinStatus': {
          '$cond': {
            'if': {
              '$isArray': '$coindata'
            },
            'then': {
              '$arrayElemAt': [
                '$coindata.actStatus', 0
              ]
            },
            'else': 'Coin data Not Found'
          }
        },
        'totalInvestmentValuePerCoin': {
          '$avg': {
            '$divide': [
              '$totalInvestmentValue', '$totalQuantity'
            ]
          }
        }
      }
    }, {
      '$group': {
        '_id': '$_id.id',
        'totalQuantity': {
          '$sum': '$totalQuantity'
        },
        'count': {
          '$sum': '$count'
        },
        'netGainLoss': {
          '$sum': '$netGainLoss'
        },
        'totalCurrentValue': {
          '$avg': {
            '$divide': [
              '$totalCurrentValue', '$count'
            ]
          }
        },
        'totalInvestmentValuePerCoin': {
          '$avg': {
            '$divide': [
              '$totalInvestmentValue', '$totalQuantity'
            ]
          }
        },
        'avaragePercentage': {
          '$avg': {
            '$divide': [
              '$avaragePercentage', '$totalQuantity'
            ]
          }
        },
        'totalInvestmentValue': {
          '$sum': '$totalInvestmentValue'
        },
        'CoinData': {
          '$push': {
            'id': '$_id.id',
            'totalCurrentValue': '$totalCurrentValue',
            'totalInvestmentValue': '$totalInvestmentValue',
            'totalQuantity': '$totalQuantity',
            'count': '$count',
            'netGainLoss': '$netGainLoss',
            'exchangeStatus': '$exchangeStatus',
            'avaragePercentage': '$avaragePercentage',
            'coindata': '$coindata',
            'coinStatus': '$coinStatus',
            'totalInvestmentValuePerCoin': '$totalInvestmentValuePerCoin'
          }
        }
      }
    });

    let data = await portfolioModel.aggregate(condition);

    let numberOfAssets = data.length;
    let sumOfAllCurrentVal = 0;
    let netGainLoss = 0;
    let percentageSum = 0;


    for (let i = 0; i <= data.length - 1; i++) {

      sumOfAllCurrentVal = sumOfAllCurrentVal + data[i].totalCurrentValue;
      netGainLoss = netGainLoss + data[i].netGainLoss;
      percentageSum = percentageSum + data[i].avaragePercentage;

    }

    let avgOfCurrentVal = sumOfAllCurrentVal / numberOfAssets;
    let avgPercentageGL = percentageSum / numberOfAssets;

    let topFields = {
      currentValue: avgOfCurrentVal.toFixed(2),
      numberOfAssets: numberOfAssets,
      avgGainLoss: netGainLoss.toFixed(2),
      avgPercentageGL: avgPercentageGL.toFixed(2)
    };

    return {
      success: true,
      message: "Portfolio data fetched successfully",
      data: { topFields: topFields, portfolioList: data }
    };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error.message
    };
  };
};

exports.getSubListPortfolio = async (req) => {
  try {

    let agePipe = [];
    let loggedInId = req.user._id;
    let targetName = req.query.targetName;
    let coin = req.query.coin;


    agePipe.push({
      $match: {
        $and: [
          { 'userId': new mongoose.Types.ObjectId(loggedInId) }, { 'coins': coin }, { 'isdeleted': false }
        ]
      }
    })

    agePipe.push({
      $lookup: {
        from: "exchange_tickers",
        localField: "exchange",
        foreignField: "exchangeId",
        as: "exchange"
      }
    })

    agePipe.push({
      $unwind: {
        path: "$exchange"
      }
    })

    agePipe.push({
      $unwind: {
        path: "$exchange.tickers"
      }
    })

    agePipe.push({

      $addFields:
      {
        tickersdata:
        {
          $cond: { if: { $and: [{ $eq: ["$coins", "$exchange.tickers.coin_id"] }, { $eq: ["$exchange.tickers.target", targetName] }] }, then: "$exchange.tickers.last", else: 0 }
        }

      }
    })

    agePipe.push({
      $match: {

        $expr: { $ne: ['$tickersdata', 0] }

      }
    })
    agePipe.push({
      $addFields: {
        singleValue: { $divide: ["$investmentValue", "$quantity"] },
        gainLoss: { $cmp: ["$tickersdata", { $divide: ["$investmentValue", "$quantity"] }] },
        valueDifference: {
          $cond: { if: { $eq: ["$gainLoss", 1] }, then: { $subtract: [{ $divide: ["$investmentValue", "$quantity"] }, "$tickersdata"] }, else: { $subtract: ["$tickersdata", { $divide: ["$investmentValue", "$quantity"] }] } }
        }
      }
    })
    agePipe.push({
      $addFields: {
        percentageGainLoss: { $multiply: [{ $divide: ["$valueDifference", "$singleValue"] }, 100] }
      }
    })



    agePipe.push({
      $project: {

        exchange: 1,
        coins: 1,
        quantity: 1,
        investmentValue: 1,

        currentValue: "$tickersdata",
        gainLoss: 1,
        valueDifference: {
          $divide: [
            { $round: [{ $multiply: ["$valueDifference", 100] }] },
            100
          ]
        },
        percentageGainLoss: {
          $divide: [
            { $round: [{ $multiply: ["$percentageGainLoss", 100] }] },
            100
          ]
        },
      }
    });

    let data = await portfolioModel.aggregate(agePipe);

    return {
      status: 200,
      message: "Portfolio sub List data fetched successfully",
      data: { portfolioList: data }

    };


  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error.message
    };
  }
}
