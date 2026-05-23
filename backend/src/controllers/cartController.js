const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  res.status(200).json(cart);
});

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  const qty = Number(quantity) || 1;

  if (qty < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }

  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < qty) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + qty;

    if (product.stock < newQuantity) {
      res.status(400);
      throw new Error(`Only ${product.stock} items available in stock`);
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity: qty,
    });
  }

  await cart.save();

  const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  res.status(200).json(updatedCart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity === undefined) {
    res.status(400);
    throw new Error("Quantity is required");
  }

  const qty = Number(quantity);

  if (qty < 0) {
    res.status(400);
    throw new Error("Quantity cannot be negative");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (cartItem) => cartItem.product.toString() === productId,
  );

  if (!item) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  if (qty === 0) {
    cart.items = cart.items.filter(
      (cartItem) => cartItem.product.toString() !== productId,
    );
  } else {
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (product.stock < qty) {
      res.status(400);
      throw new Error(`Only ${product.stock} items available in stock`);
    }

    item.quantity = qty;
  }

  await cart.save();

  const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  res.status(200).json(updatedCart);
});

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  res.status(200).json(updatedCart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(200).json({
      user: req.user._id,
      items: [],
    });
  }

  cart.items = [];
  await cart.save();

  const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  res.status(200).json(updatedCart);
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
