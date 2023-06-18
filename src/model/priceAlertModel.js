const { Schema, model, mongoose } = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const alertSchema = Schema({
    coins: {
        type: String
    },
    currency: {
        type: String
    },
    exchange: {
        type: ObjectId,
        ref: 'exchange'
    },
    allExchanges: {
        type: Boolean,
        default: false
    },
    userId: {
        type: ObjectId,
        ref: 'user'
    },
    alertPrice: {
        type: Number
    },
    note: {
        type: String
    },
    modeOfAlert: {
        type: String
    },
    isTriggered: {
        type: Boolean,
        default: false
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false });

module.exports = model('alert', alertSchema);
