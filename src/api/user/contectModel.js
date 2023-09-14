const { string } = require("joi");
const mongoose = require("mongoose");

const userContactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    GroupMembership: {
        type: String,
        default: ""
    },
    PhoneType: {
        type: String,
        default: ""
    },
    PhoneValue: {
        type: String,
        default: ""
    },
    OrganizationType: {
        type: String,
        default: ""
    },
    OrganizationName: {
        type: String,
        default: ""
    }

}, { timestamps: true });

module.exports = mongoose.model("userContact", userContactSchema);