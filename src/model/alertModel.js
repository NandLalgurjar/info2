const { Schema, ObjectId, model, default: mongoose } = require('mongoose');

const portfolioSchema = Schema({
    userId: {
        type: ObjectId
    },
    exchangeId: {
        type: ObjectId
    },
    coin_id: {
        type: String
    },
    alertPrice: {
        type: String
    },
    target: {
        type: String
    },
    nots: {
        type: String
    },
    status: {
        type: String,
        default: "pending"
    }
}, { timestamps: true, versionKey: false });

module.exports = model('alert', portfolioSchema);
