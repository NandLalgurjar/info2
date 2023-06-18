const { Schema, model } = require('mongoose');

const adminSchema = Schema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    isdeleted: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    loginStatus: {
        type: Boolean
    },
    role: {
        type: String,
        default: "notAssigned"
    },
    cronTime: {
        type: String
    },


}, { timestamps: true, versionKey: false });

module.exports = model('admin', adminSchema);
