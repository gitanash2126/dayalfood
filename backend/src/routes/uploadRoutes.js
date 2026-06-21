const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { successResponse } = require("../utils/apiResponse");
const { protect } = require("../middlewares/authMiddleware");

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private
router.post("/", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image file");
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  
  successResponse(res, 200, "Image uploaded successfully", { url: imageUrl });
});

module.exports = router;
