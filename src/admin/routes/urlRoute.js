const express = require("express");
const router = express.Router();
const upload = require("../../middleware/csvMulter")
const Auth = require("../../middleware/adminAuth")

const { urlController: { urlUpdate } } = require('../controller');
const { exchangeList } = require("../controller/userController");

router.get("/urlUpdate",Auth, upload.single("file"), urlUpdate)

module.exports = router;

