const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/apiResponse");

const generateToken = require("../utils/generateToken");

// ==========================================
// REGISTER USER
// @route POST /api/auth/register
// ==========================================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // CHECK USER
  const userExists = await User.findOne({
    email,
  });

  if (userExists) {
    res.status(400);

    throw new Error("User already exists with this email");
  }

  // CREATE USER
  const user = await User.create({
    name,

    email,

    password,

    phone,
  });

  // GENERATE TOKEN
  const token = generateToken(user._id);

  // COOKIE
  res.cookie("token", token, {
    httpOnly: true,

    secure: false,

    sameSite: "lax",

    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // RESPONSE
  successResponse(res, 201, "User registered successfully", {
    _id: user._id,

    name: user.name,

    email: user.email,

    phone: user.phone,

    role: user.role,
  });
});

// ==========================================
// LOGIN USER
// @route POST /api/auth/login
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

  // CHECK ACTIVE
  if (!user.isActive) {
    res.status(403);

    throw new Error("Your account is inactive");
  }

  // MATCH PASSWORD
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);

    throw new Error("Invalid email or password");
  }

  // GENERATE TOKEN
  const token = generateToken(user._id);

  // SET COOKIE
  res.cookie("token", token, {
    httpOnly: true,

    secure: false,

    sameSite: "lax",

    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

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
// @route POST /api/auth/logout
// ==========================================
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,

    expires: new Date(0),
  });

  successResponse(res, 200, "Logout successful");
});

// ==========================================
// GET PROFILE
// @route GET /api/auth/profile
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
// @route PUT /api/auth/profile
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
// @route PUT /api/auth/change-password
// ==========================================
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // VALIDATION
  if (!currentPassword || !newPassword) {
    res.status(400);

    throw new Error("Current password and new password are required");
  }

  if (newPassword.length < 6) {
    res.status(400);

    throw new Error("New password must be at least 6 characters");
  }

  // FIND USER
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  // MATCH CURRENT PASSWORD
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(400);

    throw new Error("Current password is incorrect");
  }

  // UPDATE PASSWORD
  user.password = newPassword;

  await user.save();

  successResponse(res, 200, "Password changed successfully");
});

// ==========================================
// MAKE ADMIN
// @route PUT /api/auth/make-admin/:email
// ==========================================
const makeAdmin = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: req.params.email,
  });

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  // UPDATE ROLE
  user.role = "admin";

  await user.save();

  successResponse(res, 200, "User role updated to admin", user);
});

module.exports = {
  registerUser,

  loginUser,

  logoutUser,

  getProfile,

  updateProfile,

  changePassword,

  makeAdmin,
};
