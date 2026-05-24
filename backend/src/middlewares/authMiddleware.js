const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // ==========================================
  // COOKIE TOKEN
  // ==========================================
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // ==========================================
  // HEADER TOKEN
  // ==========================================
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ==========================================
  // NO TOKEN
  // ==========================================
  if (!token) {
    res.status(401);

    return next(new Error("Not authorized, token missing"));
  }

  try {
    // VERIFY
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // USER
    req.user = await User.findById(decoded.id).select("-password");

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
// ROLE AUTH
// ==========================================
const authorize = (...roles) => {
  return (req, res, next) => {
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
