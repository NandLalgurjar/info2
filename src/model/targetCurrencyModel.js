const { Schema, model } = require('mongoose');
let { ObjectId } = require('mongoose');

const targetCurrencySchema = Schema({
    currency: {
        type: String
    },
    actStatus: {
        type: String
    }
   
}, { timestamps: true, versionKey: false });

module.exports = model('targetCurrency', targetCurrencySchema);