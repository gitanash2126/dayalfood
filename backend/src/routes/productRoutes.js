const express = require("express");

const {
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
} = require("../controllers/productController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get("/", getProducts);

router.get("/featured/list", getFeaturedProducts);

router.get("/category/:category", getProductsByCategory);

// ==========================================
// REVIEWS
// ==========================================
router
  .route("/:id/reviews")
  .get(getProductReviews)
  .post(protect, addProductReview);

router.delete("/:id/reviews/:reviewId", protect, deleteProductReview);

// ==========================================
// CREATE PRODUCT
// ==========================================
router.post(
  "/",
  protect,
  authorize("admin", "shopkeeper"),
  upload.single("image"),
  createProduct,
);

// ==========================================
// PRODUCT DETAILS / UPDATE / DELETE
// ==========================================
router
  .route("/:id")
  .get(getProductById)

  // ✅ IMAGE UPDATE FIX
  .put(
    protect,
    authorize("admin", "shopkeeper"),
    upload.single("image"),
    updateProduct,
  )

  .delete(protect, authorize("admin", "shopkeeper"), deleteProduct);

// ==========================================
// TOGGLE PRODUCT STATUS
// ==========================================
router.put(
  "/:id/toggle-status",
  protect,
  authorize("admin", "shopkeeper"),
  toggleProductStatus,
);

// ==========================================
// UPDATE STOCK
// ==========================================
router.put(
  "/:id/stock",
  protect,
  authorize("admin", "shopkeeper"),
  updateProductStock,
);

module.exports = router;
