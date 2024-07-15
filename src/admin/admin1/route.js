// const auth = require("../../middleware/adminauth");
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { admin, register, adminRegisterData, loginData, login,
    usersProfile, AdminlogOut, forgetPassword, ForgetPassword,
    add_profile_data, paymentRevenues } = require('./controller');
const Auth = require("../../middleware/adminAuth")
app.get("/", admin)

app.get("/pages-register", register);
app.post("/register-admin-data", adminRegisterData);

app.get("/login", login);
app.post("/login-admin-data", loginData);

app.get("/forget-password", Auth, forgetPassword)
app.post("/Forget-password", Auth, ForgetPassword)
app.get("/users-profile", Auth, usersProfile);
app.post("/add_profile_data", Auth, Upload.single("image"), add_profile_data)

app.get("/Admin-log-out", Auth, AdminlogOut)

// ajex
app.get("/payment-Revenues", Auth, paymentRevenues)

module.exports = app