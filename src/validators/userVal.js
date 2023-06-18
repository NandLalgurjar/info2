const { Joi } = require('express-validation');

exports.userRegisterVal = Joi.object({
    fullName: Joi.string().required(),
    verificationCode: Joi.string().required(),
    userId: Joi.string().required(),
    password: Joi.string().required(),
    refferalCode: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    email: Joi.string().optional()
})


exports.logInVal = Joi.object({
    phoneNumber: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().required(),
});

exports.generateCodeVal = Joi.object({
    loginType: Joi.string().required(),
    email: Joi.string().optional(),
    phoneNumber: Joi.string().optional()
});

exports.signUpVal = Joi.object({
    phoneNumber: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().required(),
});

exports.forgotPasswordVal = Joi.object({
    phoneNumber: Joi.string(),
    email: Joi.string(),
    loginType: Joi.string().required()
});

exports.verifyOtpVal = Joi.object({
    phoneNumber: Joi.string(),
    email: Joi.string(),
    loginType: Joi.string().required(),
    otp: Joi.number().required(),
    password: Joi.string().required()
})
exports.verificationVal = Joi.object({
    phoneNumber: Joi.string().optional(),
    email: Joi.string().optional(),
    verificationCode: Joi.string().required(),
}).unknown(true);

exports.adminVal = Joi.object({
    fullName: Joi.string().required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().required()
})

exports.addToFavoriteVal = Joi.object({
    exchange: Joi.array().items(Joi.string().required()).unique().optional(),
    coin: Joi.array().items(Joi.string().required()).unique().optional(),
    type: Joi.string().required().valid("exchange", "coin")
})
