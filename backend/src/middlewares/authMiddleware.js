const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ==========================================
// PROTECT ROUTES
// ==========================================
const protect = async (req, res, next) => {
  try {
    // TOKEN FROM COOKIE
    const token = req.cookies.token;

    // CHECK TOKEN
    if (!token) {
      res.status(401);

      return next(new Error("Not authorized, token missing"));
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIND USER
    req.user = await User.findById(decoded.id).select("-password");

    // CHECK USER
    if (!req.user) {
      res.status(401);

      return next(new Error("User not found"));
    }

    next();
  } catch (error) {
    console.log(error);

    res.status(401);

    next(new Error("Not authorized, token failed"));
  }
};

// ==========================================
// AUTHORIZE ROLES
// ==========================================
const authorize = (...roles) => {
  return (req, res, next) => {
    // CHECK ROLE
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);

      return next(new Error("You are not allowed to access this route"));
    }

    next();
  };
};

module.exports = {
  protect,

  authorize,
};
