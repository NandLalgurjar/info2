const { userService: { registration, adminLogin, getAdminProfile, editAdminProfile, resetPassword, getAllUsers, blockUser, unBlockUser, getRequests, replyToRequests, setCronTime, getUserPortfolioList, actDeactExchange, getExchangeList, editExchange, activateCoin, updateTargetCurrency,
    getTargetCurrency, activateCurrency, getCompanyDetails, editCompanyInfo, getAdminUserList, updateUser, sendMaintainanceNoti, addUserData, deleteUser, priceArbitrageAlertTime, cronTimings, adminLogOut } } = require('../services/');

exports.createAdmin = async (req, res) => {
    try {
        const data = await registration(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.loginAdmin = async (req, res) => {
    try {
        const data = await adminLogin(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getAdminProfile = async (req, res) => {
    try {
        const data = await getAdminProfile(req);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        throw err;
    };
};


exports.editAdminProfile = async (req, res) => {
    try {
        const data = await editAdminProfile(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const data = await resetPassword(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.getAllUsers = async (req, res) => {
    try {
        const data = await getAllUsers(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.blockUser = async (req, res) => {
    try {
        const data = await blockUser(req);
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.unBlockUser = async (req, res) => {
    try {
        const data = await unBlockUser(req);
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.getRequests = async (req, res) => {
    try {
        const data = await getRequests(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.setCronTime = async (req, res) => {
    try {
        const data = await setCronTime(req);
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}


exports.getUserPortfolioList = async (req, res) => {
    try {
        const data = await getUserPortfolioList(req);
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}


exports.replyToRequests = async (req, res) => {
    try {
        const data = await replyToRequests(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}


exports.activateDeactivateExchange = async (req, res) => {
    try {
        const data = await actDeactExchange(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.exchangeList = async (req, res) => {
    try {
        const data = await getExchangeList(req);
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.editExchangeData = async (req, res) => {
    try {
        const data = await editExchange(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.activateCoinStatus = async (req, res) => {
    try {
        const data = await activateCoin(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.updateTargetCurrency = async (req, res) => {
    try {
        const data = await updateTargetCurrency(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.getTargetCurrency = async (req, res) => {
    try {
        const data = await getTargetCurrency(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.activateCurrency = async (req, res) => {
    try {
        const data = await activateCurrency(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.getCompanyDetails = async (req, res) => {
    try {
        const data = await getCompanyDetails(req);
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.editCompanyDetails = async (req, res) => {
    try {
        const data = await editCompanyInfo(req);
        res.status(200).json(data);
    } catch (err) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.getAdminUserList = async (req, res) => {
    try {
        const data = await getAdminUserList(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.updateUser = async (req, res) => {
    try {
        const data = await updateUser(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.sendMaintainanceNotification = async (req, res) => {
    try {
        const data = await sendMaintainanceNoti(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.addUser = async (req, res) => {
    try {
        const data = await addUserData(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.deleteUserData = async (req, res) => {
    try {
        const data = await deleteUser(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.priceAndArbitrageAlertTime = async (req, res) => {
    try {
        const data = await priceArbitrageAlertTime(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.cronTimingSet = async (req, res) => {
    try {
        const data = await cronTimings(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.adminLogOut = async (req, res) => {
    try {
        const data = await adminLogOut(req);
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    }
}