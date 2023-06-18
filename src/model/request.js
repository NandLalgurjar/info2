const { Schema, model } = require('mongoose');
let { ObjectId } = require('mongoose');

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
