const multer = require("multer"); // For uploading avatar image file
const path = require("path");
const imageAvatarPath = path.join(__dirname, "../public/images/avatar");

const storage = multer.diskStorage({
  destination: imageAvatarPath,
  filename: (req, file, cb) => {
    const uniqueSuffix = "-" + Date.now() + path.extname(file.originalname);
    cb(null, `${file.originalname}${uniqueSuffix}`);
  },
});

const imageUpload = multer({
  storage: storage,
}).single("avatar");

module.exports = imageUpload;