const { coinService: { importCoin, updateCoins, getCoins, getAllCoins, coinConverter, Target, advancePriceSearch, getCoinListForBestBuyAndSell, saveExhangeList } } = require('../services');

exports.importCoin = async (req, res) => {
    try {
        const data = await importCoin(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        throw error
    }
}

exports.updateCoins = async (req, res) => {
    try {
        const data = await updateCoins(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        throw error;
    };
};

exports.getCoins = async (req, res) => {
    try {
        const data = await getCoins(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        throw error
    }
}


exports.getCoinListForBestBuyAndSell = async (req, res) => {
    try {
        const data = await getCoinListForBestBuyAndSell(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.getAllCoins = async (req, res) => {
    try {
        const data = await getAllCoins(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};
exports.coinConverter = async (req, res) => {
    try {
        const data = await coinConverter(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.Target = async (req, res) => {
    try {
        const data = await Target(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};
exports.advancePriceSearch = async (req, res) => {
    try {
        const data = await advancePriceSearch(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};
/*
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
}; */
