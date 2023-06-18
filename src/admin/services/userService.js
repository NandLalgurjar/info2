const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const adminModel = require('../../model/adminDataModel');
const userModel = require('../../model/userModel');
const requestModel = require('../../model/requestModel');
const portfolioModel = require('../../model/portfolioModel');
const { sendMail } = require('../../helpers/sendMail');
const { request } = require('express');
const { exchangeModel, coinModel, targetCurrencyModel, exchangeTickerModel } = require('../../model');
const companyDataModel = require('../../model/companyDataModel');
const cronTimingsModel = require('../../model/cronTimingsModel');

exports.registration = async (req) => {
    try {
        const { password, email } = req.body;
        const findData = await adminModel.findOne({ email });
        if (findData) {
            return {
                status: 400,
                message: "Admin Allready Registered!",
            };
        };
        req.body.password = bcrypt.hashSync(password, saltRounds);

        let data = await adminModel.create(req.body);
        const token = jwt.sign({ user_id: data._id, email }, process.env.TOKEN_KEY, { expiresIn: "2h", });

        data.token = token;
        data.loginStatus = true;
        await data.save();

        return {
            status: 200,
            message: "User Registered!",
            data: data
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.adminLogin = async (req) => {
    try {
        const { email, password, phoneNumber } = req.body;
        let chkUser;
        if (email) {
            chkUser = await adminModel.findOne({ email });
        } else if (phoneNumber) {
            chkUser = await adminModel.findOne({ phoneNumber });
        };
        if (!chkUser) {
            return {
                status: 404,
                message: "User not found!"
            };
        };

        if (chkUser && (bcrypt.compareSync(password, chkUser.password))) {
            // Create token
            const token = jwt.sign({ user_id: chkUser._id, email }, process.env.TOKEN_KEY, { expiresIn: "2h", });

            chkUser.token = token;
            chkUser.loginStatus = true;
            await chkUser.save();
            return {
                status: 200,
                message: "User LoggedIn Successfully",
                data: chkUser
            };
        } else {
            return {
                status: 400,
                message: "Password mismatch. Please enter correct password!",
                data: {}
            };
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getAdminProfile = async (req) => {
    try {
        let data = await adminModel.findOne({ fullName: "Bitinfy Admin" });
        return {
            status: 200,
            message: "User profile is here",
            data: data
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.replyToRequests = async (req) => {
    try {
        const { questionId, message } = req.body;
        let questionData = await requestModel.findOne({ _id: questionId }).populate('userId');
        const subject = "Reply from Bitinfy";
        await sendMail(questionData.userId.email, subject, message);

        return {
            status: 200,
            message: "Response sent successfully"
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

// exports.sendMails =  (email,message) => {
//     try {

//         const subject = "Reply from Bitinfy";
//         let sendMailToUser = sendMail(email, subject, message);
//     } catch (error){
//         console.log(error);
//           return {
// success: false,
//     message: error.message,
//         };
//     };
// }

exports.editAdminProfile = async (req) => {
    try {
        let reqData = req.body;

        let chkUser = await adminModel.findOne({ _id: req.user._id });

        if (chkUser) {

            let updateData = await adminModel.findOneAndUpdate({ _id: req.user._id }, reqData, { new: true });
            return {
                status: 200,
                message: "User data updated successfully!",
                data: updateData
            };

        } else {
            return {
                status: 404,
                message: "User not found!"
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.resetPassword = async (req) => {
    try {
        const hashPassword = bcrypt.hashSync(req.body.newPassword, saltRounds);
        let updatePassword = await adminModel.findOneAndUpdate({ _id: req.user._id }, { password: hashPassword }, { new: true });

        if (updatePassword) {
            return {
                status: 200,
                message: "User data updated successfully!",
                data: updatePassword
            };
        } else {
            return {
                status: 400,
                message: "something is wrong !",
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.getAllUsers = async (req) => {
    try {
        const { email, fullName, phoneNumber } = req.query;
        let condition = {};
        if (email) {
            condition.email = { '$regex': email, '$options': 'i' };
        };
        if (fullName) {
            condition.fullName = { '$regex': fullName, '$options': 'i' };
        };
        if (phoneNumber) {
            condition.phoneNumber = { '$regex': phoneNumber };
        };

        const data = await userModel.find(condition);
        if (Array.isArray(data) && data.length > 0) {
            return {
                status: 200,
                message: "Data fetched successfully!",
                data: data
            };
        } else {
            return {
                status: 400,
                message: "No Data fetched !",
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.blockUser = async (req) => {
    try {
        let updateData = await userModel.findOneAndUpdate({ _id: req.body.userId }, { isBlocked: true }, { new: true });

        let subject = "Account blocked by Bitinfy";
        let message = "Your account has been blocked due to Suspicious Activities observed.Please contact <abc@xyz.com> to get it re-activated.";    //change message content
        await sendMail(updateData.email, subject, message);
        return {
            status: 200,
            message: "User Blocked successfully!",
            data: updateData
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.unBlockUser = async (req) => {
    try {
        let data = await userModel.findOneAndUpdate({ _id: req.body.userId }, { isBlocked: false }, { new: true });
        return {
            status: 200,
            message: "User Unblocked successfully!",
            data
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getRequests = async (req) => {
    try {
        let data = await requestModel.find().sort({ updatedAt: -1 });
        return {
            status: 200,
            message: "Support requests from users are here",
            data
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.setCronTime = async (req) => {
    try {
        let timing = req.body.timing;
        let updateData = await adminModel.findOneAndUpdate({ _id: req.user._id }, { cronTime: timing }, { new: true });
        return {
            status: 200,
            message: "Time updated successfully",
            data: updateData
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.getUserPortfolioList = async (req) => {
    try {
        let userId = req.query.userId;
        let data = await portfolioModel.find({ userId, isdeleted: false });
        return {
            status: 200,
            message: "Portfolio data is here",
            data: data
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.actDeactExchange = async (req) => {
    try {
        const { exchangeId, actStatus } = req.body;
        let updateStatus = await exchangeModel.findOneAndUpdate({ _id: exchangeId }, { actStatus: actStatus }, { new: true });
        return {
            status: 200,
            message: "Status updated successfully",
            data: updateStatus
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getExchangeList = async (req) => {
    try {
        let exchangeList = await exchangeModel.find();
        return {
            status: 200,
            message: "List of exchanges are here",
            data: exchangeList
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.editExchange = async (req) => {
    try {
        const findData = await exchangeModel.findOne({ _id: req.body.exchangeId })
        if (!findData) {
            return {
                status: 400,
                message: "data not Found",
            };
        };
        let data = await exchangeModel.findOneAndUpdate({ _id: req.body.exchangeId }, req.body, { new: true });
        return {
            status: 200,
            message: "Exchange details updated successfully",
            data
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.activateCoin = async (req) => {
    try {
        const { coinId, actStatus } = req.body;
        let updateStatus = await coinModel.findOneAndUpdate({ id: coinId }, { actStatus: actStatus }, { new: true });

        return {
            status: 200,
            message: "Coin status updated successfully",
            data: updateStatus
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}


exports.updateTargetCurrency = async (req) => {
    try {
        const data = await exchangeTickerModel.distinct("tickers.target");

        // add db query here to store all target values with actStatus key

        for (let i = 0; i <= data.length - 1; i++) {
            let dataObj = {
                currency: data[i],
                actStatus: "onHold"
            }
            await targetCurrencyModel.updateOne({ currency: dataObj.currency }, dataObj, { new: true, upsert: true });
        }

        return {
            status: 200,
            message: "Data updated successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.getTargetCurrency = async (req) => {
    try {
        const data = await targetCurrencyModel.find();
        if (Array.isArray(data) && data.length > 0) {
            return {
                status: 200,
                message: "Data Fetch Successfully !",
                data: data
            };
        } else {
            return {
                status: 200,
                message: "Data Not Found !",
            };
        };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.activateCurrency = async (req) => {
    try {
        const { currencyId, actStatus } = req.body;
        let data = await targetCurrencyModel.findOneAndUpdate({ _id: currencyId }, { actStatus: actStatus }, { new: true });

        if (data) {
            return {
                status: 200,
                message: "Currency status updated successfully",
                data
            };
        } else {
            return {
                status: 400,
                message: "Something is Wrong",
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.getCompanyDetails = async (req) => {
    try {
        let data = await companyDataModel.find();
        if (Array.isArray(data) && data.length > 0) {
            return {
                status: 200,
                message: "Company data is here",
                data
            };
        } else {
            return {
                status: 400,
                message: "Data Not Found",
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.editCompanyInfo = async (req) => {
    try {
        let data = await companyDataModel.findOneAndUpdate({ _id: req.body.infoId }, req.body, { new: true });
        if (data) {
            return {
                status: 200,
                message: "Company data updated successfully",
                data: data
            };
        } else {
            return {
                status: 400,
                message: "Data Not Found ",
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getAdminUserList = async (req) => {
    try {
        let data = await adminModel.find({ role: { $ne: "superAdmin" } });
        if (data) {
            return {
                status: 200,
                message: "All users are here",
                data
            };
        } else {
            return {
                status: 400,
                message: "Data Not Found",
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.updateUser = async (req) => {
    try {
        let { userId, ...body } = req.body;
        let data = await adminModel.findOneAndUpdate({ _id: userId }, body, { new: true });

        if (data) {
            return {
                status: 200,
                message: "Role assigned successfully",
                data: data
            };
        } else {
            return {
                status: 400,
                message: "something is wrong",
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}


exports.sendMaintainanceNoti = async (req) => {
    try {
        const { message, isMaintainance, timing, } = req.body;
        //isMaintainance timing and mainatainance message key in userModel 
        let updateData = await userModel.updateMany({}, { isMaintainance: isMaintainance, mainatainanceTiming: timing, maintainanceMsg: message })
        return {
            status: 200,
            message: "Updated maintainance data for all users",
            data: updateData
        };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.addUserData = async (req) => {
    try {
        let data = await adminModel.create(req.body);
        if (data) {
            return {
                status: 200,
                message: "User added successfully",
                data: data
            };
        } else {
            return {
                status: 400,
                message: "something is wrong",
            };
        };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.deleteUser = async (req) => {
    try {
        let userId = req.body.userId;
        let updateData = await adminModel.findOneAndUpdate({ _id: userId }, { isdeleted: true }, { new: true });
        if (updateData) {
            return {
                status: 200,
                message: "User deleted successfully",
                data: updateData
            };
        } else {
            return {
                status: 400,
                message: "Data Not Update",
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.priceArbitrageAlertTime = async (req) => {
    try {

        let updateAlertCount = await userModel.findOneAndUpdate({ _id: req.body.userId }, req.body, { new: true });
        return {
            status: 200,
            message: "Alert Count Updated successfully",
            data: updateAlertCount
        };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.cronTimings = async (req) => {
    try {
        let timeUpdate = await cronTimingsModel.findOneAndUpdate({ _id: "64830d87c2406f625da1aed2" }, req.body, { new: true });
        return {
            status: 200,
            message: "Time updated successfully ",
            data: timeUpdate
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.adminLogOut = async (req) => {
    try {
        let data = await adminModel.findOneAndUpdate({ _id: req.user._id }, { loginStatus: false, token: "" }, { new: true });
        if (data) {
            return {
                status: 200,
                message: "Logged out successfully!",
                data
            };
        } else {
            return {
                status: 400,
                message: "Logged out failed !",
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};