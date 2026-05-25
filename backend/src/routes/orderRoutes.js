const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE ORDER
// ==========================================
router.post("/", protect, createOrder);

// ==========================================
// USER OWN ORDERS
// ONLY LOGGED USER ORDERS
// ==========================================
router.get("/my-orders", protect, getMyOrders);

// ==========================================
// ADMIN ALL ORDERS
// ==========================================
router.get("/", protect, authorize("admin"), getOrders);

// ==========================================
// SINGLE ORDER
// ==========================================
router.get("/:id", protect, getOrderById);

// ==========================================
// UPDATE ORDER STATUS (ADMIN)
// ==========================================
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

// ==========================================
// UPDATE PAYMENT STATUS (ADMIN)
// ==========================================
router.put("/:id/payment", protect, authorize("admin"), updatePaymentStatus);

// ==========================================
// CANCEL ORDER
// ==========================================
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
