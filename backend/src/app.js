const compression = require("compression");

const express = require("express");

const cors = require("cors");

const helmet = require("helmet");

const rateLimit = require("express-rate-limit");

const session = require("express-session");

const cookieParser = require("cookie-parser");

const path = require("path");

// ==========================================
// MIDDLEWARES
// ==========================================
const errorHandler = require("./middlewares/errorHandler");

const notFound = require("./middlewares/notFound");

// ==========================================
// ROUTES
// ==========================================
const authRoutes = require("./routes/authRoutes");

const productRoutes = require("./routes/productRoutes");

const cartRoutes = require("./routes/cartRoutes");

const orderRoutes = require("./routes/orderRoutes");

const adminRoutes = require("./routes/adminRoutes");

const wishlistRoutes = require("./routes/wishlistRoutes");

const userRoutes = require("./routes/userRoutes");

const app = express();

// ==========================================
// COMPRESSION
// ==========================================
app.use(compression());

// ==========================================
// BODY PARSER
// ==========================================
app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// ==========================================
// COOKIE PARSER
// ==========================================
app.use(cookieParser());

// ==========================================
// SECURITY
// ==========================================
app.use(helmet());

// ==========================================
// CORS FIX
// ==========================================
app.use(
  cors({
    origin: true,

    credentials: true,
  }),
);

// ==========================================
// STATIC IMAGE FOLDER
// ==========================================
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ==========================================
// RATE LIMIT
// ==========================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 200,

  message: {
    success: false,

    message: "Too many requests, please try again later",
  },
});

app.use("/api", limiter);

// ==========================================
// SESSION
// ==========================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_session_secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure: process.env.NODE_ENV === "production",

      httpOnly: true,

      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

// ==========================================
// HEALTH ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    message: "Grocery Shop API is running 🚀",
  });
});

// ==========================================
// API ROUTES
// ==========================================
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/users", userRoutes);

// ==========================================
// NOT FOUND
// ==========================================
app.use(notFound);

// ==========================================
// ERROR HANDLER
// ==========================================
app.use(errorHandler);

module.exports = app;
