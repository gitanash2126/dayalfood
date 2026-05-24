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

// ==========================================
// ALL CART ROUTES PROTECTED
// ==========================================
router.use(protect);

// ==========================================
// GET USER CART
// GET /api/cart
// ==========================================
router.get("/", getCart);

// ==========================================
// ADD TO CART
// POST /api/cart
// ==========================================
router.post("/", addToCart);

// ==========================================
// UPDATE CART ITEM QUANTITY
// PUT /api/cart/:productId
// ==========================================
router.put("/:productId", updateCartItem);

// ==========================================
// REMOVE SINGLE ITEM
// DELETE /api/cart/:productId
// ==========================================
router.delete("/:productId", removeFromCart);

// ==========================================
// CLEAR ENTIRE CART
// DELETE /api/cart
// ==========================================
router.delete("/", clearCart);

module.exports = router;
