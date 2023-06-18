const { arbitrageService: { arbitrage, advancedArbitrage, SentNotification } } = require('../services');

exports.arbitrage = async (req, res) => {
    try {
        const data = await arbitrage(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.advancedArbitrage = async (req, res) => {
    try {
        const data = await advancedArbitrage(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.arbitrageSentNotification = async (req, res) => {
    try {
        const data = await SentNotification(req);
        if (data.success == true) {
            res.status(200).json(data);
        } else {
            res.status(400).json(data);
        }
    } catch (error) {
        console.log(error.message);
        return {
            success: false,
            message: error.message,
        };
    };
};
