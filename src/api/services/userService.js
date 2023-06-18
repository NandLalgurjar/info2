const userModel = require('../../model/userModel');
const FavoriteModel = require('../../model/favoriteModel');
const exchangeModel = require('../../model/exchangeModel');
const targetCurrencyModel = require('../../model/targetCurrencyModel');
const exchangeTickerModel = require('../../model/exchangeTickerModel');
const { sendMail } = require('../../helpers/sendMail');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { generateOtp } = require('../../helpers/generateOtp');
const { dates } = require('../../helpers/generateOtp');
const { sendOTP } = require('../../helpers/sms');
const { sendResetPasswordMail } = require('../../helpers/sendMail')
const { AddMinutesToDate } = require('../../helpers/sendMail');



exports.sendCode = async (req) => {
    try {
        const { loginType, email, phoneNumber } = req.body;
        let otp = await generateOtp();

        let userData;
        if (loginType === 'email') {
            userData = await userModel.findOne({ email });
        } else if (loginType === 'phoneNumber') {
            userData = await userModel.findOne({ phoneNumber });
        };

        let subject = "BitInfy Verfication";
        let body = `your verification email otp are ${otp}`;
        if (!userData) {
            if (loginType === 'email') await sendMail(email, subject, body);
            else if (loginType === 'phoneNumber') {
                let chkSend = await sendOTP(phoneNumber, otp);
                if (!chkSend) otp = '1234';
            };
            let obj = {}
            obj.verificationCode = otp;
            if (req.body.email) {
                obj.email = req.body.email;
            }
            if (req.body.phoneNumber) {
                obj.phoneNumber = req.body.phoneNumber || '';
            }
            var user = await userModel.create(obj);

        } else {
            if (loginType === 'email') await sendMail(email, subject, body);
            else otp = '1234';
            var user = await userModel.findOneAndUpdate({ $or: [{ email }, { phoneNumber }] }, {
                verificationCode: otp,
                // email: req.body.email || '',
                // phoneNumber: req.body.phoneNumber || '',
            }, { new: true });
        }
        return {
            success: true,
            message: "Verifcation Code Sent",
            data: user
        };
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.userSignUp = async (req) => {
    try {
        const { fullName, phoneNumber, verificationCode, password, refferalCode, email, userId } = req.body;
        let chkUser;
        if (email) {
            chkUser = await userModel.findOne({ email, isEmailVerified: true });
        } else if (phoneNumber) {
            chkUser = await userModel.findOne({ phoneNumber, isPhoneVerified: true });
        };

        if (!chkUser) {

            const hashPassword = bcrypt.hashSync(password, saltRounds);
            const userData = await userModel.findOne({ _id: userId });
            if (userData.verificationCode === verificationCode) {

                const token = jwt.sign({ user_id: userData._id, email }, process.env.TOKEN_KEY, { expiresIn: "2h", });
                let refer = await this.refferalCodeGenerate();

                userData.fullName = fullName;
                userData.refferalCode = refer || "";
                userData.verificationCode = "";
                userData.isEmailVerified = userData.email ? true : false;
                userData.isPhoneVerified = userData.phoneNumber ? true : false;
                userData.email = req.body.email || userData.email;
                userData.phoneNumber = req.body.phoneNumber || userData.phoneNumber;
                userData.password = hashPassword;
                userData.token = token;
                await userData.save();
            } else {
                return {
                    success: false,
                    message: "Verification Code Not Matched!",
                    data: {}
                };
            };

            return {
                success: true,
                message: "User Registered!",
                data: userData
            };
        } else {
            return {
                success: false,
                message: "User Already Exists!",
                data: {}
            };
        };
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.refferalCodeGenerate = async () => {
    try {
        return `BITINFY${Math.floor(1000 + Math.random() * 9000)}`;
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.userLoggin = async (req, res) => {
    try {
        const { email, password, phoneNumber } = req.body;
        let chkUser;
        if (email) {
            chkUser = await userModel.findOne({ email, isEmailVerified: true });
        } else if (phoneNumber) {
            chkUser = await userModel.findOne({ phoneNumber, isPhoneVerified: true });
        };
        if (!chkUser) {
            return {
                success: false,
                message: "User not found!",
                data: {}
            };
        }
        if (chkUser && (bcrypt.compareSync(password, chkUser.password))) {
            // Create token
            const token = jwt.sign({ user_id: chkUser._id, email }, process.env.TOKEN_KEY, { expiresIn: "100h", });

            chkUser.token = token;
            await chkUser.save();
            return {
                success: true,
                message: "User LoggedIn Successfully",
                data: chkUser
            };
        } else {
            return {
                success: false,
                message: "Password mismatch. Please enter correct password!",
                data: {}
            };
        };
    } catch (err) {
        console.log(err);
        throw err;
    };
};

exports.userForgotPassword = async (req, res) => {
    try {

        if (req.body.email) {

            const email = req.body.email;
            const findEmail = await userModel.findOne({ email: email });

            if (findEmail == null) {
                return {
                    success: false,
                    message: "Email not found"
                }
            } else {

                const otp = await generateOtp();
                console.log(otp)


                const now = new Date();
                const expiration_time = AddMinutesToDate(now, 1);

                let data = await userModel.findOneAndUpdate(
                    { email: email },
                    { $set: { passwordEmailOtp: otp, emailOtpExpTime: expiration_time } }
                );

                let subject = "Otp to reset the password";
                sendResetPasswordMail(data.fullname, data.email, otp, subject);

                return {
                    success: true,
                    message: "We have sent you an otp to reset the password Please check your mail inbox and reset your password"
                }

            }
        } else if (req.body.phoneNumber) {
            const phoneNumber = req.body.phoneNumber;

            const findPhone = await userModel.findOne({ phoneNumber: phoneNumber })

            if (findPhone == null) {

                return {
                    success: false,
                    message: "Phone Number not found"
                }

            } else {
                const otp = await generateOtp();
                const now = new Date();
                const expiration_time = AddMinutesToDate(now, 1);

                let data = await userModel.findOneAndUpdate(
                    { phoneNumber: phoneNumber },
                    { $set: { passwordPhoneOtp: otp, phoneOtpExpTime: expiration_time } }
                );



                await sendOTP(process.env.apikey, process.env.sender, phoneNumber, otp)
            }

        }


    } catch (error) {

        throw error;
    }
}


exports.verifyotp = async (req, res) => {
    try {
        var currentdate = new Date();
        const { loginType, email, phoneNumber, otp, password } = req.body;

        if (loginType == "phoneNumber") {

            var data1 = await userModel.findOne({ phoneNumber: phoneNumber });

            if (!data1) {
                return ({
                    success: false,
                    message: "You entered wrong phone number..please enter registered phone number"

                });
            }


            var data = await userModel.findOne({ phoneNumber: phoneNumber, passwordPhoneOtp: otp }); //checking otp is present for user or not


            if (!data) {
                return ({
                    success: false,
                    message: "Entered otp is wrong"

                });
            } else {

                var data = await userModel.findOne({ phoneNumber: phoneNumber, passwordPhoneOtp: otp });
                if (dates.compare(data.phoneOtpExpTime, currentdate) == 1) {

                    const hashPassword = bcrypt.hashSync(password, saltRounds);
                    const updatePassword = await userModel.findOneAndUpdate({ phoneNumber: phoneNumber }, { password: hashPassword }, { new: true });
                    return ({
                        success: true,
                        message: "Password changed successfully"
                    });

                } else {
                    return ({
                        success: false,
                        message: "This otp has been expired"

                    });
                }



            }




        } else {
            var data1 = await userModel.findOne({ email: email });
            if (!data1) {
                return ({
                    success: false,
                    message: "You entered wrong email..please enter registered email",
                    bodyData: req.body,
                });
            }

            var data = await userModel.findOne({ email: email, passwordEmailOtp: otp }); //checking otp is present for user or not


            if (!data) {
                return ({
                    success: false,
                    message: "Entered otp is wrong",
                    bodyData: req.body,
                });
            } else {
                var data = await userModel.findOne({ email: email, passwordEmailOtp: otp });
                if (dates.compare(data.emailOtpExpTime, currentdate) == 1) {

                    const hashPassword = bcrypt.hashSync(password, saltRounds);
                    const updatePassword = await userModel.findOneAndUpdate({ email: email }, { password: hashPassword }, { new: true });
                    return ({
                        success: true,
                        message: "Password changed successfully",
                        bodyData: req.body,
                    });

                } else {
                    return ({
                        success: false,
                        message: "This otp has been expired",

                    });
                }
            }

        }



    } catch (error) {

        throw error;
    }
}

exports.Verification = async (req) => {
    try {
        const { phoneNumber, verificationCode, email, userId } = req.body;
        let chkUser;
        if (email) {
            chkUser = await userModel.findOne({ email, isEmailVerified: false });
        } else if (phoneNumber) {
            chkUser = await userModel.findOne({ phoneNumber, isPhoneVerified: false });
        };

        if (!chkUser) {
            return {
                success: false,
                message: "User Already Verified !",
                data: {}
            };
        };

        const userData = await userModel.findOne({ _id: userId });

        if (userData.verificationCode === verificationCode) {
            if (email) {
                userData.isEmailVerified = true;
            } else if (phoneNumber) {
                userData.isPhoneVerified = true;
            };
            userData.verificationCode = ""
            await userData.save();
            return {
                success: false,
                message: "Verified !",
                data: userData
            };
        } else {
            return {
                success: false,
                message: "Verification Code Not Matched!",
                data: {}
            };
        };
    } catch (error) {
        console.log(error.message)
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.logoutUser = async (req) => {
    try {
        let updateLoginStatus = await userModel.findOneAndUpdate({ _id: req.user._id }, { loginStatus: false, token: "" }, { new: true });

        return {
            status: 200,
            message: "Logged out successfully!",
            data: updateLoginStatus
        };

    } catch (err) {
        console.log(err);
        throw err;
    }
}

exports.addToFavorite = async (req) => {
    try {
        if (req.body.exchange && req.body.type.includes("exchange")) {
            const findData = await FavoriteModel.findOne({ userId: req.user._id, exchange: req.body.exchange });
            if (findData) {
                return {
                    status: 400,
                    message: "exchange All Ready Add in FavoriteList !",
                };
            };
            const data = await FavoriteModel.findOneAndUpdate({ userId: req.user._id }, { $set: { exchange: req.body.exchange } }, { new: true, upsert: true });
            if (data) {
                return {
                    status: 200,
                    message: "exchange Add successfully !",
                    data
                };
            };
        } else if (req.body.coin && req.body.type.includes("coin")) {
            const findData = await FavoriteModel.findOne({ userId: req.user._id, coin: req.body.coin });
            if (findData) {
                return {
                    status: 400,
                    message: "coin All Ready Add in FavoriteList !",
                };
            };

            const data = await FavoriteModel.findOneAndUpdate({ userId: req.user._id }, { $set: { coin: req.body.coin } }, { new: true, upsert: true });
            if (data) {
                return {
                    status: 200,
                    message: "exchange Add successfully !",
                    data
                };
            };
        } else {
            return {
                status: 400,
                message: "Please Enter valid input !",
            };
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        };
    };
};