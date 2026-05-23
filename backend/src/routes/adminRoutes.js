const express = require("express");

const {
  getDashboardStats,

  getRecentOrders,

  getLowStockProducts,

  getAllUsers,

  updateUserRole,

  updateUserStatus,

  getSalesAnalytics,
} = require("../controllers/adminController");

const {
  protect,

  authorize,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// =========================
// ADMIN PROTECTION
// =========================
router.use(protect);

router.use(authorize("admin"));

// =========================
// DASHBOARD
// =========================

// DASHBOARD STATS
router.get("/stats", getDashboardStats);

// SALES ANALYTICS
router.get("/analytics", getSalesAnalytics);

// RECENT ORDERS
router.get("/recent-orders", getRecentOrders);

// LOW STOCK PRODUCTS
router.get("/low-stock-products", getLowStockProducts);

// =========================
// USERS
// =========================

// GET ALL USERS
router.get("/users", getAllUsers);

// UPDATE USER ROLE
router.put("/users/:id/role", updateUserRole);

// UPDATE USER STATUS
router.put("/users/:id/status", updateUserStatus);

module.exports = router;
