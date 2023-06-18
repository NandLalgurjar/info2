const { exhangeService: { saveExhangeList, getExchangeTicker, getExchange, compareExchange } } = require('../services');

exports.saveEchange = async (req, res) => {
    try {
        const data = await saveExhangeList(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.exchangeTicker = async (req, res) => {
    try {
        const data = await getExchangeTicker(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getExchange = async (req, res) => {
    try {
        const data = await getExchange(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.compareExchange = async (req, res) => {
    try {
        const data = await compareExchange(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};