const { Schema, ObjectId, model, default: mongoose } = require('mongoose');

const arbitrageSchema = Schema({
    userId: {
        type: ObjectId
    },
    coins: {
        type: [String],
        default: ""
    },
    buyFromExchangeId: {
        type: ObjectId,
        default: ""
    },
    sellFromExchangeId: {
        type: ObjectId,
        default: ""
    },
    estProfitPresentage: {
        type: Number,
        // default: ""
    },
    status: {
        type: String,
        default: "pending"
    },
    target: {
        type: String,
    }
}, { timestamps: true, versionKey: false });

module.exports = model('arbitrage', arbitrageSchema);
