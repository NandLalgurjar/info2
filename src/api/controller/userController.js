const { userService: { userSignUp, sendCode, userLoggin, userForgotPassword, verifyotp, logoutUser, addToFavorite, Verification } } = require('../services/');


exports.generateCode = async (req, res) => {
    try {
        const data = await sendCode(req);
        res.status(200).json(data);
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.registerUser = async (req, res) => {
    try {
        const data = await userSignUp(req);
        res.status(200).json(data);
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.userLogin = async (req, res) => {
    try {
        const data = await userLoggin(req);
        // console.log(data, "------>")
        res.status(200).json(data);
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.Verification = async (req, res) => {
    try {
        const data = await Verification(req);
        res.status(200).json(data);
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.forgotPassword = async (req, res) => {
    try {
        let data = await userForgotPassword(req);
        res.status(200).json(data)
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.otpVerification = async (req, res) => {
    try {
        let data = await verifyotp(req);
        res.status(200).json(data)
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}

exports.userLogout = async (req, res) => {
    try {

        let data = await logoutUser(req);
        res.status(200).json(data)

    } catch (error) {
        return {
            status: 500,
            message: error.message,
        };
    }
}

exports.addToFavorite = async (req, res) => {
    try {
        let data = await addToFavorite(req);
        res.status(200).json(data)
    } catch (error) {
        return {
            status: 500,
            message: error.message,
        };
    };
};