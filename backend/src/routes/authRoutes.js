const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  makeAdmin,
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validationMiddleware");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", validateRegister, registerUser);

router.post("/login", validateLogin, loginUser);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.put("/change-password", protect, changePassword);

// Temporary route for admin setup
router.put("/make-admin/:email", makeAdmin);

module.exports = router;
