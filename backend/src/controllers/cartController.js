const Cart = require("../models/Cart");

const Product = require("../models/Product");

const asyncHandler = require("../utils/asyncHandler");

// ==========================================
// GET USER CART
// GET /api/cart
// ==========================================
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  // CREATE EMPTY CART
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,

      items: [],
    });
  }

  res.status(200).json({
    success: true,

    data: cart,
  });
});

// ==========================================
// ADD TO CART
// POST /api/cart
// ==========================================
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // VALIDATION
  if (!productId) {
    res.status(400);

    throw new Error("Product ID is required");
  }

  const qty = Number(quantity) || 1;

  if (qty < 1) {
    res.status(400);

    throw new Error("Quantity must be at least 1");
  }

  // PRODUCT
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    res.status(404);

    throw new Error("Product not found");
  }

  // STOCK CHECK
  if (product.stock < qty) {
    res.status(400);

    throw new Error(`Only ${product.stock} items available in stock`);
  }

  // FIND CART
  let cart = await Cart.findOne({
    user: req.user._id,
  });

  // CREATE CART
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,

      items: [],
    });
  }

  // CHECK EXISTING
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  // UPDATE QTY
  if (existingItem) {
    const newQty = existingItem.quantity + qty;

    if (product.stock < newQty) {
      res.status(400);

      throw new Error(`Only ${product.stock} items available in stock`);
    }

    existingItem.quantity = newQty;
  } else {
    // NEW ITEM
    cart.items.push({
      product: productId,

      quantity: qty,
    });
  }

  await cart.save();

  // POPULATE
  const updatedCart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  res.status(200).json({
    success: true,

    message: "Product added to cart",

    data: updatedCart,
  });
});

// ==========================================
// UPDATE CART ITEM
// PUT /api/cart/:productId
// ==========================================
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const { productId } = req.params;

  // VALIDATION
  if (quantity === undefined) {
    res.status(400);

    throw new Error("Quantity is required");
  }

  const qty = Number(quantity);

  if (qty < 0) {
    res.status(400);

    throw new Error("Quantity cannot be negative");
  }

  // FIND CART
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    res.status(404);

    throw new Error("Cart not found");
  }

  // FIND ITEM
  const item = cart.items.find(
    (cartItem) => cartItem.product.toString() === productId,
  );

  if (!item) {
    res.status(404);

    throw new Error("Product not found in cart");
  }

  // REMOVE IF 0
  if (qty === 0) {
    cart.items = cart.items.filter(
      (cartItem) => cartItem.product.toString() !== productId,
    );
  } else {
    // PRODUCT
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      res.status(404);

      throw new Error("Product not found");
    }

    // STOCK CHECK
    if (product.stock < qty) {
      res.status(400);

      throw new Error(`Only ${product.stock} items available in stock`);
    }

    item.quantity = qty;
  }

  await cart.save();

  // UPDATED CART
  const updatedCart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  res.status(200).json({
    success: true,

    message: "Cart updated",

    data: updatedCart,
  });
});

// ==========================================
// REMOVE FROM CART
// DELETE /api/cart/:productId
// ==========================================
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // FIND CART
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    res.status(404);

    throw new Error("Cart not found");
  }

  // REMOVE ITEM
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  // UPDATED CART
  const updatedCart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  res.status(200).json({
    success: true,

    message: "Item removed from cart",

    data: updatedCart,
  });
});

// ==========================================
// CLEAR CART
// DELETE /api/cart
// ==========================================
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  // EMPTY RESPONSE
  if (!cart) {
    return res.status(200).json({
      success: true,

      data: {
        user: req.user._id,

        items: [],
      },
    });
  }

  // CLEAR
  cart.items = [];

  await cart.save();

  res.status(200).json({
    success: true,

    message: "Cart cleared",

    data: cart,
  });
});

module.exports = {
  getCart,

  addToCart,

  updateCartItem,

  removeFromCart,

  clearCart,
};
