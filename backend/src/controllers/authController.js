const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/apiResponse");

const generateToken = require("../utils/generateToken");

// ==========================================
// COOKIE OPTIONS
// ==========================================
const cookieOptions = {
  httpOnly: true,

  secure: true,

  sameSite: "none",

  maxAge: 7 * 24 * 60 * 60 * 1000,

  path: "/",
};

// ==========================================
// SEND OTP (MOBILE LOGIN)
// ==========================================
const sendOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(400);
    throw new Error("Phone number is required");
  }

  // Generate a dynamic 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Find or create user
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      phone,
      email: `${phone}@dayalfood.com`, // Add dummy email to prevent E11000 duplicate null email error
      otp,
      otpExpires,
      role: "user",
      isActive: true
    });
  } else {
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  }

  // We are NOT calling any external SMS API to guarantee 100% free operation for now.
  successResponse(res, 200, "OTP sent successfully", { testOtp: otp });
});

// ==========================================
// VERIFY OTP (MOBILE LOGIN)
// ==========================================
const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    res.status(400);
    throw new Error("Phone number and OTP are required");
  }

  const user = await User.findOne({ phone });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  // Clear OTP
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  // ACTIVE CHECK
  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account is inactive");
  }

  // TOKEN
  const token = generateToken(user._id);

  // COOKIE
  res.cookie("token", token, cookieOptions);

  // RESPONSE
  successResponse(res, 200, "Login successful", {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  });
});

// ==========================================
// LOGIN ADMIN (EMAIL & PASSWORD)
// ==========================================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // FIND USER
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    res.status(401);

    throw new Error("Invalid email or password");
  }

  // ACTIVE CHECK
  if (!user.isActive) {
    res.status(403);

    throw new Error("Your account is inactive");
  }

  // PASSWORD MATCH
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);

    throw new Error("Invalid email or password");
  }

  // TOKEN
  const token = generateToken(user._id);

  // COOKIE
  res.cookie("token", token, cookieOptions);

  // RESPONSE
  successResponse(res, 200, "Login successful", {
    _id: user._id,

    name: user.name,

    email: user.email,

    phone: user.phone,

    role: user.role,
  });
});

// ==========================================
// LOGOUT USER
// ==========================================
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,

    secure: true,

    sameSite: "none",

    expires: new Date(0),

    path: "/",
  });

  successResponse(res, 200, "Logout successful");
});

// ==========================================
// GET PROFILE
// ==========================================
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  successResponse(res, 200, "Profile fetched successfully", user);
});

// ==========================================
// UPDATE PROFILE
// ==========================================
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  // UPDATE
  if (name !== undefined) {
    user.name = name;
  }

  if (phone !== undefined) {
    user.phone = phone;
  }

  await user.save();

  successResponse(res, 200, "Profile updated successfully", {
    _id: user._id,

    name: user.name,

    email: user.email,

    phone: user.phone,

    role: user.role,
  });
});

// ==========================================
// CHANGE PASSWORD
// ==========================================
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);

    throw new Error("Current password and new password are required");
  }

  if (newPassword.length < 6) {
    res.status(400);

    throw new Error("New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(400);

    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;

  await user.save();

  successResponse(res, 200, "Password changed successfully");
});

// ==========================================
// MAKE ADMIN
// ==========================================
const makeAdmin = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: req.params.email,
  });

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  user.role = "admin";

  await user.save();

  successResponse(res, 200, "User role updated to admin", user);
});

module.exports = {
  sendOtp,
  verifyOtp,
  loginUser,

  logoutUser,

  getProfile,

  updateProfile,

  changePassword,

  makeAdmin,
};
