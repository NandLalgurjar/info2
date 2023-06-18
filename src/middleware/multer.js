const multer = require('multer');
const path = require("path")
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
var upload = multer({
    storage: storage, fileFilter: (req, file, callback) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf" ) {
            callback(null, true);
        } else {
            callback(null, false);
            return callback(new Error('Only .png, .jpg .pdf and .jpeg format allowed!'));
        }
    },
});

module.exports = upload;
