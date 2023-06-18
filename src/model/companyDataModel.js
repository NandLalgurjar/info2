const { Schema, model } = require('mongoose');
let { ObjectId } = require('mongoose');

const companyDataSchema = Schema({
    aboutCompany: {
        type: String
    },
    contactInformation:{
        type:String
    },
    termsOfUse: {
        type: String
    },
    privacyPolicy: {
        type: String
    }
}, { timestamps: true, versionKey: false });

module.exports = model('companydata', companyDataSchema);