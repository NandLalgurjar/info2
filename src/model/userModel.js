const { Schema, model } = require('mongoose');

const userSchema = Schema({
    fullName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String
    },
    verificationCode: {
        type: String
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    refferalCode: {
        type: String
    },
    isEnable: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    target: {
        type: String
    },
    passwordEmailOtp: {
        type: Number
    },
    phoneOtpExpTime: {
        type: Date
    },
    passwordPhoneOtp: {
        type: Number
    },
    emailOtpExpTime: {
        type: Date
    },
    loginStatus: {
        type: Boolean
    },
    isMaintainance: {
        type: Boolean,
        default: false
    },
    mainatainanceTiming: {
        type: String
    },
    maintainanceMsg: {
        type: String
    },
    priceAlertCount: {
        type: Number
    },
    arbitrageAlertCount: {
        type: Number
    }


}, { timestamps: true, versionKey: false });

module.exports = model('user', userSchema);
