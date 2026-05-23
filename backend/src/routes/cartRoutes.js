const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/", protect, clearCart);

router.put("/:productId", protect, updateCartItem);
router.delete("/:productId", protect, removeFromCart);

module.exports = router;
