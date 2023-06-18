const multer = require('multer');
const path = require("path")
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../../public/uploads/csv'));
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype == "text/csv") {
            callback(null, true);
        } else {
            callback(null, false);
            return callback(new Error('Only .csv format allowed!'));
        }
    },
});

module.exports = upload;
