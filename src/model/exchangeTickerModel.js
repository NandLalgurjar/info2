const { Schema, model, default: mongoose } = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const exchangeSchema = Schema({
    id: {
        type: String
    },
    exchangeId: {

        type: ObjectId,
        ref: 'exchanges'
    },
    name: {
        type: String
    },
    tickers: {
        type: Array
    }

}, { timestamps: true, versionKey: false });

module.exports = model('exchange_ticker', exchangeSchema);
