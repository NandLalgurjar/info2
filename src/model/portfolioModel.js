const { Schema, model, mongoose } = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const portfolioSchema = Schema({
    coins: {
        type: String
    },
    exchange: {
        type: ObjectId,
        ref: 'exchange'
    },
    userId: {
        type: ObjectId,
        ref: 'user'
    },
    quantity: {
        type: Number
    },
    investmentValue: {
        type: Number
    },
    target: {
        type: String
    },
    isdeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false });

module.exports = model('portfolio', portfolioSchema);
