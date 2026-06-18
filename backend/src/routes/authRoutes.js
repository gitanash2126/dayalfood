const express = require("express");

const {
  registerUser,
  loginUserWithPhone,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  resetPasswordDirect,
  makeAdmin,
} = require("../controllers/authController");

const {
  validateLogin,
} = require("../middlewares/validationMiddleware");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login-phone", loginUserWithPhone);

router.post("/login", validateLogin, loginUser);

router.post("/reset-password-direct", resetPasswordDirect);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.put("/change-password", protect, changePassword);

// Temporary route for admin setup
router.put("/make-admin/:email", makeAdmin);

module.exports = router;
