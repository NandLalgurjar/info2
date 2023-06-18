const { alertService: { createPriceAlert, getAlert, sendAlert } } = require('../services');

exports.createPriceAlert = async (req, res) => {
    try {
        const data = await createPriceAlert(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getAlert = async (req, res) => {
    try {
        const data = await getAlert(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.sendPriceAlert = async (req, res) => {
    try {
        const data = await sendAlert(req);
        if (req.user) {
            return res.status(200).json(data);
        }
        return {
            status: 200,
            data
        }
    } catch (error) {
        console.log(error);
        // throw error
        return {
            success: false,
            message: error.message,
        };
    };
};
