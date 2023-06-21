const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const userModel = require("../../model/userModel");
// const { findByIdAndUpdate } = require('./model');
const path = require("path")
// const saloon = require("../../model/userModel")

const service = require("./service")

exports.admin = async (req, res) => {
    try {
        console.log(req.cookies, 123)
        if (req.cookies?.accessToken) {
            const { _id } = jwt.verify(req.cookies.accessToken, process.env.accessToken)
            const user = await userModel.findOne({ _id })
            if (user) {
                req.user = user
                let data;
                res.render("users/dashboard", { user, data })
            } else {
                res.render("users/login")
            }
        } else {
            res.render("users/login")
        }
    } catch (error) {
        console.log(error);
    }
}

exports.register = async (req, res) => {
    try {
        res.locals.message = req.flash();
        res.render("users/register");
    } catch (error) {
        console.log(error);
    };
};

exports.adminRegisterData = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const { name, phone, email, password } = req.body;
        let user;
        if (email) {
            const data = await userModel.findOne({ email });
            if (data) user = data;
        }
        if (user) {
            req.flash("error", "user already exist");
            res.redirect("/register");
        } else {
            req.body.password = bcrypt.hashSync(password, 10);
            req.body.type = "admin";
            const user = await userModel(req.body);
            const result = await user.save();
            if (result) {
                req.flash("success", "registration successful");
                res.redirect("/");
            }
        }
    } catch (error) {
        console.log(error);
    };
};


exports.login = async (req, res) => {
    try {
        res.locals.message = req.flash();
        res.render("users/login");
    } catch (error) {
        console.log(error);
    };
};

exports.loginData = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email) {
            const user = await userModel.findOne({ email: req.body.email });
            console.log(user, "user")
            if (user) {
                if (typeof user.password === 'undefined') {
                    return res.redirect("/admin");
                };
                if (user.type != "admin" && user.type != "super-admin") {
                    return res.redirect("/admin");
                };
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const accessToken = jwt.sign({ _id: user._id }, process.env.accessToken);
                    res.cookie("accessToken", accessToken, {
                        expires: new Date(Date.now() + 10000 * 60 * 60),
                        httpOnly: true,
                        overwrite: true
                    })
                    return res.redirect("/admin");
                } else {
                    return res.redirect("/admin");
                };
            } else {
                return res.redirect("/admin");
            };
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};
exports.forgetPassword = async (req, res) => {
    try {
        res.render("users/Forget-Password", { user: req.user })
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
}

exports.ForgetPassword = async ({ body, user }, res) => {
    try {
        if (body.Cpassword === body.password) {
            const match = await bcrypt.compare(body.OldPassword, user.password);
            if (match) {
                const pp = await bcrypt.hash(body.password, 10);
                const result = await userModel.findByIdAndUpdate({ _id: user._id }, { password: pp });
                if (result) {
                    res.redirect("/");
                }
            } else {
                res.redirect("/forget-password");
            }

        } else {
            res.redirect("/forget-password");
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};

exports.usersProfile = async (req, res) => {
    try {
        const user = req.user;
        res.render("users/usersProfile", { user });
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};
exports.add_profile_data = async (req, res) => {
    try {
        req.body.image = req.file.filename
        const updatedata = await userModel.findByIdAndUpdate({ _id: req.query.id }, req.body, { new: true });
        if (updatedata) {
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: error.message,
        };
    };
};


exports.AdminlogOut = async (req, res) => {
    try {
        res.clearCookie("accessToken", 'token', { expires: new Date(0) })
            .redirect("/admin");
    } catch (error) {
        console.log(error);
    }
}

// const payment = require("../../api/payment/model")
exports.paymentRevenues = async (req, res) => {
    try {
        let obj = {};
        let data;
        if (req.user.type == "admin") {
            let condition = [];
            condition.push({
                '$match': {
                    'userId': req.user._id
                }
            }, {
                '$lookup': {
                    'from': 'orders',
                    'localField': '_id',
                    'foreignField': 'saloonId',
                    'pipeline': [
                        {
                            '$project': {
                                'PaymentId': 1
                            }
                        }
                    ],
                    'as': 'order'
                }
            }, {
                '$unwind': {
                    'path': '$order'
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$order'
                }
            }, {
                '$lookup': {
                    'from': 'payments',
                    'localField': 'PaymentId',
                    'foreignField': '_id',
                    'pipeline': [
                        {
                            '$match': {
                                'payment': 'Payment successfull'
                            }
                        }
                    ],
                    'as': 'payment'
                }
            }, {
                '$unwind': {
                    'path': '$payment'
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$payment'
                }
            })
            data = await saloon.aggregate(condition);
        } else {
            data = await payment.find({ payment: "Payment successfull" }, { "orderData.amount": 1 });
        }
        if (data) {
            arr = []
            for (const item of data) {
                arr.push(item.orderData.amount / 100)
            }
            const sum = arr.reduce((acc, ele) => acc + ele, 0);
            obj.payment = sum
            obj.paymentCount = data.length
        };
        res.send(obj);
    } catch (error) {
        console.log(error);
    };
};
