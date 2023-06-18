const { Schema, model, mongoose } = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const favoriteSchema = Schema({
    userId: {
        type: ObjectId,
        ref: 'user'
    },
    exchange: {
        type: [ObjectId],
        ref: 'exchange'
    },
    coin: {
        type: [String],
    },
    target: {
        type: [String],
    },
}, { timestamps: true, versionKey: false });

module.exports = model('favorite', favoriteSchema);
