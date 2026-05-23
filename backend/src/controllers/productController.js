const Product = require("../models/Product");

const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/apiResponse");

// @desc    Create product
// @route   POST /api/products
// @access  Admin/Shopkeeper
const createProduct = asyncHandler(async (req, res) => {
  // IMAGE
  const image = req.file ? `/uploads/${req.file.filename}` : "";

  // CREATE PRODUCT
  const product = await Product.create({
    name: req.body.name,

    description: req.body.description,

    price: req.body.price,

    mrp: req.body.mrp,

    category: req.body.category,

    brand: req.body.brand,

    stock: req.body.stock,

    unit: req.body.unit,

    weight: req.body.weight,

    image,

    isFeatured: req.body.isFeatured || false,

    isActive: req.body.isActive !== false,

    createdBy: req.user._id,
  });

  successResponse(res, 201, "Product created successfully", product);
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // SEARCH
  const keyword = req.query.keyword
    ? {
        $or: [
          {
            name: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },

          {
            description: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },

          {
            brand: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },

          {
            category: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
        ],
      }
    : {};

  // CATEGORY FILTER
  const categoryFilter = req.query.category
    ? {
        category: {
          $regex: req.query.category,
          $options: "i",
        },
      }
    : {};

  // PRICE FILTER
  const priceFilter = {};

  if (req.query.minPrice) {
    priceFilter.price = {
      ...priceFilter.price,
      $gte: Number(req.query.minPrice),
    };
  }

  if (req.query.maxPrice) {
    priceFilter.price = {
      ...priceFilter.price,
      $lte: Number(req.query.maxPrice),
    };
  }

  // SORTING
  let sortOption = {
    createdAt: -1,
  };

  if (req.query.sort === "price-low") {
    sortOption = {
      price: 1,
    };
  } else if (req.query.sort === "price-high") {
    sortOption = {
      price: -1,
    };
  } else if (req.query.sort === "rating") {
    sortOption = {
      rating: -1,
    };
  } else if (req.query.sort === "discount") {
    sortOption = {
      discount: -1,
    };
  }

  // FILTER
  const filter = {
    isActive: true,

    ...keyword,

    ...categoryFilter,

    ...priceFilter,
  };

  // FETCH ALL PRODUCTS
  const products = await Product.find(filter).sort(sortOption);

  // TOTAL
  const total = await Product.countDocuments(filter);

  successResponse(res, 200, "Products fetched successfully", {
    products,

    total,
  });
});

// @desc    Get product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    res.status(404);

    throw new Error("Product not found");
  }

  successResponse(res, 200, "Product fetched successfully", product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin/Shopkeeper
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  // IMAGE
  if (req.file) {
    product.image = `/uploads/${req.file.filename}`;
  }

  // UPDATE FIELDS
  product.name = req.body.name || product.name;

  product.description = req.body.description || product.description;

  product.price = req.body.price || product.price;

  product.mrp = req.body.mrp || product.mrp;

  product.category = req.body.category || product.category;

  product.brand = req.body.brand || product.brand;

  product.stock = req.body.stock || product.stock;

  product.unit = req.body.unit || product.unit;

  product.weight = req.body.weight || product.weight;

  // FEATURED
  if (req.body.isFeatured !== undefined) {
    product.isFeatured = req.body.isFeatured;
  }

  // ACTIVE
  if (req.body.isActive !== undefined) {
    product.isActive = req.body.isActive;
  }

  // SAVE
  const updatedProduct = await product.save();

  successResponse(res, 200, "Product updated successfully", updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin/Shopkeeper
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  await product.deleteOne();

  successResponse(res, 200, "Product deleted successfully", {
    _id: req.params.id,
  });
});

// @desc    Toggle product active/inactive
// @route   PUT /api/products/:id/toggle-status
// @access  Admin/Shopkeeper
const toggleProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  product.isActive = !product.isActive;

  await product.save();

  successResponse(res, 200, "Product status updated successfully", product);
});

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Admin/Shopkeeper
const updateProductStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;

  if (stock === undefined || Number(stock) < 0) {
    res.status(400);

    throw new Error("Valid stock value is required");
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  product.stock = Number(stock);

  await product.save();

  successResponse(res, 200, "Product stock updated successfully", product);
});

// @desc    Get featured products
// @route   GET /api/products/featured/list
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isFeatured: true,

    isActive: true,
  }).sort({
    createdAt: -1,
  });

  successResponse(res, 200, "Featured products fetched successfully", products);
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({
    category: {
      $regex: req.params.category,

      $options: "i",
    },

    isActive: true,
  }).sort({
    createdAt: -1,
  });

  successResponse(res, 200, "Category products fetched successfully", products);
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    res.status(400);

    throw new Error("Rating must be between 1 and 5");
  }

  if (!comment || comment.trim().length < 2) {
    res.status(400);

    throw new Error("Comment is required");
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString(),
  );

  if (alreadyReviewed) {
    res.status(400);

    throw new Error("Product already reviewed");
  }

  const review = {
    user: req.user._id,

    name: req.user.name,

    rating: Number(rating),

    comment: comment.trim(),
  };

  product.reviews.push(review);

  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  successResponse(res, 201, "Review added successfully", product);
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).select(
    "reviews rating numReviews",
  );

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  successResponse(res, 200, "Reviews fetched successfully", {
    rating: product.rating,

    numReviews: product.numReviews,

    reviews: product.reviews,
  });
});

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private owner/admin
const deleteProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);

    throw new Error("Product not found");
  }

  const review = product.reviews.id(req.params.reviewId);

  if (!review) {
    res.status(404);

    throw new Error("Review not found");
  }

  const isOwner = review.user.toString() === req.user._id.toString();

  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    res.status(403);

    throw new Error("Not authorized to delete this review");
  }

  product.reviews = product.reviews.filter(
    (item) => item._id.toString() !== req.params.reviewId,
  );

  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

  await product.save();

  successResponse(res, 200, "Review deleted successfully", {
    rating: product.rating,

    numReviews: product.numReviews,

    reviews: product.reviews,
  });
});

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
