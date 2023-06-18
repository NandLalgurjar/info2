const { Schema, model } = require('mongoose');

const exchangeSchema = Schema({
    id: {
        type: String
    },
    year_established: {
        type: String
    },
    country: {
        type: String
    }, description: {
        type: String
    }, url: {
        type: String
    }, image: {
        type: String
    }, has_trading_incentive: {
        type: Boolean
    },
    trust_score: {
        type: String
    }, trust_score_rank: {
        type: String
    }, trade_volume_24h_btc: {
        type: String
    }, trade_volume_24h_btc_normalized: {
        type: String
    },
    actStatus: {
        type: String,     //onHold active deactive
        default: "onHold"
    }
}, { timestamps: true, versionKey: false });

module.exports = model('exchange', exchangeSchema);
