const Product = require("../models/Product");

const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/apiResponse");

// ==========================================
// CREATE PRODUCT
// ==========================================
const createProduct = asyncHandler(async (req, res) => {
  const { name, category, brand, description } = req.body;
  
  let price = Number(req.body.price) || 0;
  let stock = Number(req.body.stock) || 0;
  let weight = req.body.weight || "";
  let variants = [];

  if (req.body.variants) {
    try {
      variants = JSON.parse(req.body.variants);
      if (variants.length > 0) {
        price = Number(variants[0].price);
        weight = variants[0].weight;
        stock = variants.reduce((sum, v) => sum + Number(v.stock), 0);
      }
    } catch (error) {
      console.log("Failed to parse variants", error);
    }
  }

  // ==========================================
  // IMAGE URL
  // ==========================================
  const image = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : "";

  // ==========================================
  // CREATE PRODUCT
  // ==========================================
  const product = await Product.create({
    name,
    price,
    category,
    brand,
    weight,
    description,
    stock,
    variants,
    image,
    createdBy: req.user._id,
  });

  successResponse(res, 201, "Product created successfully", product);
});

// ==========================================
// GET ALL PRODUCTS
// ==========================================
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isActive: true,
  }).sort({
    createdAt: -1,
  });

  successResponse(res, 200, "Products fetched successfully", {
    products,
  });
});

// ==========================================
// GET PRODUCT BY ID
// ==========================================
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  successResponse(res, 200, "Product fetched successfully", product);
});

// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  // ==========================================
  // UPDATE IMAGE
  // ==========================================
  if (req.file) {
    product.image = `${req.protocol}://${req.get(
      "host",
    )}/uploads/${req.file.filename}`;
  }

  // ==========================================
  // UPDATE FIELDS
  // ==========================================
  product.name = req.body.name || product.name;
  product.category = req.body.category || product.category;
  product.brand = req.body.brand || product.brand;
  product.description = req.body.description || product.description;

  if (req.body.variants) {
    try {
      const parsedVariants = JSON.parse(req.body.variants);
      product.variants = parsedVariants;
      if (parsedVariants.length > 0) {
        product.price = Number(parsedVariants[0].price);
        product.weight = parsedVariants[0].weight;
        product.stock = parsedVariants.reduce((sum, v) => sum + Number(v.stock), 0);
      }
    } catch (error) {
      console.log("Failed to parse variants", error);
    }
  } else {
    // Fallback if no variants provided
    product.price = req.body.price ? Number(req.body.price) : product.price;
    product.weight = req.body.weight || product.weight;
    product.stock = req.body.stock ? Number(req.body.stock) : product.stock;
  }

  // ==========================================
  // SAVE
  // ==========================================
  const updatedProduct = await product.save();

  successResponse(res, 200, "Product updated successfully", updatedProduct);
});

// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  await product.deleteOne();

  successResponse(res, 200, "Product deleted successfully");
});

// ==========================================
// TOGGLE PRODUCT STATUS
// ==========================================
const toggleProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  product.isActive = !product.isActive;

  await product.save();

  successResponse(res, 200, "Product status updated", product);
});

// ==========================================
// UPDATE STOCK
// ==========================================
const updateProductStock = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  product.stock = req.body.stock;

  await product.save();

  successResponse(res, 200, "Stock updated successfully", product);
});

// ==========================================
// FEATURED PRODUCTS
// ==========================================
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isFeatured: true,

    isActive: true,
  }).limit(8);

  successResponse(res, 200, "Featured products fetched", products);
});

// ==========================================
// PRODUCTS BY CATEGORY
// ==========================================
const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({
    category: req.params.category,

    isActive: true,
  });

  successResponse(res, 200, "Category products fetched", products);
});

// ==========================================
// ADD REVIEW
// ==========================================
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString(),
  );

  if (alreadyReviewed) {
    res.status(400);

    throw new Error("Product already reviewed");
  }

  const review = {
    user: req.user._id,

    name: req.user.name,

    rating: Number(rating),

    comment,
  };

  product.reviews.push(review);

  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  successResponse(res, 201, "Review added successfully");
});

// ==========================================
// GET REVIEWS
// ==========================================
const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  successResponse(res, 200, "Reviews fetched successfully", product.reviews);
});

// ==========================================
// DELETE REVIEW
// ==========================================
const deleteProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  product.reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.params.reviewId,
  );

  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length
      : 0;

  await product.save();

  successResponse(res, 200, "Review deleted successfully");
});

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  createProduct,

  getProducts,

  getProductById,

  updateProduct,

  deleteProduct,

  toggleProductStatus,

  updateProductStock,

  getFeaturedProducts,

  getProductsByCategory,

  addProductReview,

  getProductReviews,

  deleteProductReview,
};
