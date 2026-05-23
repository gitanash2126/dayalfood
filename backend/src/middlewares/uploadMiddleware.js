const multer = require("multer");

const path = require("path");

// STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// FILTER
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;

  const extname = allowed.test(path.extname(file.originalname).toLowerCase());

  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only"));
  }
};

const upload = multer({
  storage,

  fileFilter,
});

module.exports = upload;
