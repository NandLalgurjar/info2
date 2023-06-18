const {handleResponse} = require("./helpers/response");

module.exports = (schema) => (req, res, next) => {
    const ragVal = schema.validate(Object.keys(req.body).length !== 0 ? req.body : req.query)
    if (ragVal.error) {
        const message = ragVal.error.message
        let result = {}
        result.message = message
        result.success = false 
        handleResponse(res, 400, result)
    }
    else {
        next();
    }
}