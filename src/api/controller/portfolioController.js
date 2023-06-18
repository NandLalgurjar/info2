const { portfolioService: { addAndEditPortfolio, deleteUserPortfolio, getAllPortfolio, getSubListPortfolio } } = require('../services/');

exports.createAndEditPortfolio = async (req, res) => {

    try {

        const data = await addAndEditPortfolio(req);
        res.status(200).json(data);

    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}


exports.deletePortfolio = async (req, res) => {
    try {

        const data = await deleteUserPortfolio(req);

        res.status(200).json(data);


    } catch (err) {

        return {
            success: false,
            message: err.message,
        };

    }
}



exports.getPortfolioList = async (req, res) => {
    try {

        const data = await getAllPortfolio(req);

        res.status(200).json(data);


    } catch (err) {

        return {
            success: false,
            message: err.message,
        };

    }
}

exports.getPortfolioSubList = async (req, res) => {
    try {

        const data = await getSubListPortfolio(req);

        res.status(200).json(data);


    } catch (err) {

        return {
            success: false,
            message: err.message,
        };

    }
}



