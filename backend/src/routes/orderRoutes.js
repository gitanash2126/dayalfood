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

router.post("/", protect, createOrder);

router.get("/myorders", protect, getMyOrders);

router.get("/", protect, authorize("admin"), getOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

router.put("/:id/payment", protect, authorize("admin"), updatePaymentStatus);

router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
