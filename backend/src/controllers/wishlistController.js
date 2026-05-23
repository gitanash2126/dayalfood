const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products",
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [],
    });
  }

  successResponse(res, 200, "Wishlist fetched successfully", wishlist);
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product || !product.isActive) {
    res.status(404);
    throw new Error("Product not found");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [],
    });
  }

  const exists = wishlist.products.some(
    (id) => id.toString() === req.params.productId,
  );

  if (exists) {
    res.status(400);
    throw new Error("Product already in wishlist");
  }

  wishlist.products.push(req.params.productId);
  await wishlist.save();

  wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products",
  );

  successResponse(res, 200, "Product added to wishlist", wishlist);
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== req.params.productId,
  );

  await wishlist.save();

  const updatedWishlist = await Wishlist.findOne({
    user: req.user._id,
  }).populate("products");

  successResponse(res, 200, "Product removed from wishlist", updatedWishlist);
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
