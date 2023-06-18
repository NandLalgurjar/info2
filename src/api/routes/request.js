const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const validate = require('../../validate');
const upload = require("../../middleware/multer");

const { requestVal: { addRequestVal } } = require('../../validators/');
const { requestController: { addRequest } } = require('../controller');

router.post('/Request', auth, upload.single("file"), addRequest);

module.exports = router;


