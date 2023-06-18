const { Schema, model,mongoose } = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const requestSchema = Schema({
    userId: {
        type: ObjectId,
        ref:'user'
    },
    type: {
        type: String
    },
    Description: {
        type: String
    },
    attachments: {
        type: String
    }
}, { timestamps: true, versionKey: false });

module.exports = model('request', requestSchema);
