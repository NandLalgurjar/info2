const { string } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: Number,
        default: null
    },
    gender: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: "user"
    },
    dateOfBirth: {
        type: Date,
        default: ""
    },
    password: {
        type: String
    },
    image: {
        type: String,
        default: ""
    },
    verify: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    userWallet: {
        balance: {
            type: Number,
            default: 0
        },
        point: {
            type: Number,
            default: 0
        },
        useBalance: {
            type: Number,
            default: 0
        }
    },
    referalDetails: {
        referalAmount: {
            type: Number
        },
        referaType: {
            type: String
        }
    },
    location: {
        aria: {
            type: String,
            default: ""
        },
        pincode: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
    },
    auth: {
        type: String,
        default: ""
    },
    referCode: {
        type: String,
        default: ""
    },
    referId: {
        type: mongoose.Types.ObjectId,
        default: null
    }
}, { timestamps: true });






module.exports = mongoose.model("user", userSchema);



/* const { Schema, model } = require('mongoose');

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

module.exports = model('user', userSchema); */
