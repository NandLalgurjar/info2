const { priceAlertService: { addAndEditAlert, deleteAlertRecord, getCurrentValByExchCoinCurr, priceCompare, getTriggeredPriceAlerts, sendAlert } } = require('../services');
const { getActivePriceAlerts } = require('../services/priceAlertService');


exports.createAndEditAlert = async (req, res) => {
    try {
        const data = await addAndEditAlert(req);
        res.status(200).json(data);
    } catch (err) {
        return {
            status: 500,
            message: err.message,
        };
    }
}



exports.getCurrentValue = async (req, res) => {
    try {
        const data = await getCurrentValByExchCoinCurr(req);
        res.status(200).json(data);
    } catch (err) {
        return {
            status: 500,
            message: err.message,
        };
    };
};

exports.deleteAlert = async (req, res) => {
    try {
        const data = await deleteAlertRecord(req);
        res.status(200).json(data);
    } catch (err) {
        return {
            status: 500,
            message: err.message,
        };
    };
};

exports.getActivePriceAlertList = async (req, res) => {
    try {
        const data = await getActivePriceAlerts(req);
        res.status(200).json(data);
    } catch (err) {
        return {
            status: 500,
            message: err.message,
        };
    };
};
exports.getTriggeredPriceAlertList = async (req, res) => {
    try {
        const data = await getTriggeredPriceAlerts(req);
        res.status(200).json(data);
    } catch (err) {
        return {
            status: 500,
            message: err.message,
        };
    };
};
exports.priceCompare = async (req, res) => {
    try {
        const data = await priceCompare(req);
        res.status(200).json(data);
    } catch (err) {
        return {
            status: 500,
            message: err.message,
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