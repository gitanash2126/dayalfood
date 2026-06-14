const express = require("express");

const {
  sendOtp,
  verifyOtp,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  makeAdmin,
} = require("../controllers/authController");

const {
  validateLogin,
} = require("../middlewares/validationMiddleware");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/login", validateLogin, loginUser);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.put("/change-password", protect, changePassword);

// Temporary route for admin setup
router.put("/make-admin/:email", makeAdmin);

module.exports = router;
