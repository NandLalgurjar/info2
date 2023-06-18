const { requestService: { addRequest } } = require('../services/');


exports.addRequest = async (req, res) => {
    try {
        const data = await addRequest(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        // throw error;
    };
};
