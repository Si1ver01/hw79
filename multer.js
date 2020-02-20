const multer = require("multer");
const nanoid = require("nanoid");
const path = require("path");
const { uploadPath } = require("./config");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename(req, file, callback) {
        callback(null, nanoid() + path.extname(file.originalname));
    }
});

module.exports = multer({ storage });