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
// REGISTER USER
// ==========================================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error("Name, email, phone, and password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user already exists
  const userExists = await User.findOne({ $or: [{ phone }, { email }] });

  if (userExists) {
    if (userExists.email === email) {
      res.status(400);
      throw new Error("Email already registered. Please login.");
    }
    res.status(400);
    throw new Error("Phone number already registered. Please login.");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: "user",
    isActive: true,
  });

  if (user) {
    // Generate token
    const token = generateToken(user._id);

    // Set Cookie
    res.cookie("token", token, cookieOptions);

    successResponse(res, 201, "Registration successful", {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// ==========================================
// LOGIN USER (PHONE & PASSWORD)
// ==========================================
const loginUserWithPhone = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    res.status(400);
    throw new Error("Phone number and password are required");
  }

  const user = await User.findOne({ phone }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Phone number not registered. Please sign up.");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid password. Please try again.");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account is inactive");
  }

  // Generate Token
  const token = generateToken(user._id);

  // Set Cookie
  res.cookie("token", token, cookieOptions);

  successResponse(res, 200, "Login successful", {
    _id: user._id,
    name: user.name,
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
// DIRECT RESET PASSWORD (FORGOT PASSWORD)
// ==========================================
const resetPasswordDirect = asyncHandler(async (req, res) => {
  const { name, phone, newPassword } = req.body;

  if (!name || !phone || !newPassword) {
    res.status(400);
    throw new Error("Name, mobile number, and new password are required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  // Find user by phone
  const user = await User.findOne({ phone }).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found with this mobile number");
  }

  // Verify name (case-insensitive and trimmed)
  if (user.name.trim().toLowerCase() !== name.trim().toLowerCase()) {
    res.status(400);
    throw new Error("Registered name does not match the mobile number");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  successResponse(res, 200, "Password reset successfully. You can now login.");
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
  registerUser,
  loginUserWithPhone,
  loginUser,

  logoutUser,

  getProfile,

  updateProfile,

  changePassword,
  
  resetPasswordDirect,

  makeAdmin,
};
