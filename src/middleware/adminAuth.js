const jwt = require("jsonwebtoken");
const userModel = require('../api/user/model');

module.exports = async (req, res, next) => {
    try {
        if (req.cookies?.accessToken && req.cookies?.accessToken != "") {
            const { _id } = jwt.verify(req.cookies.accessToken, process.env.accessToken);
            req.user = await userModel.findOneAndUpdate({ _id }, { auth: req.cookies.accessToken, isDeleted: false }, { new: true });
            if (req.user) {
                next();
            } else {
                res.redirect("/");
            };
        } else {
            res.redirect("/");
        };
    } catch (error) {
        console.log(error);
        res.redirect("/");
    };
};