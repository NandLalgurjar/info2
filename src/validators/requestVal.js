const { Joi } = require('express-validation');

exports.addRequestVal = Joi.object({
    type: Joi.string().required(),
    Description: Joi.string().required()
    // userId:Joi.string().required(),
    // password:Joi.string().required(),
    // refferalCode:Joi.string().optional(),
    // phoneNumber:Joi.string().optional(),
    // email:Joi.string().optional()
})