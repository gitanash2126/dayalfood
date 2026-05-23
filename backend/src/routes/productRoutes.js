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

router.get("/", getProducts);
router.get("/featured/list", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);

router
  .route("/:id/reviews")
  .get(getProductReviews)
  .post(protect, addProductReview);

router.delete("/:id/reviews/:reviewId", protect, deleteProductReview);

router.post(
  "/",
  protect,
  authorize("admin", "shopkeeper"),
  upload.single("image"),
  createProduct,
);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, authorize("admin", "shopkeeper"), updateProduct)
  .delete(protect, authorize("admin", "shopkeeper"), deleteProduct);

router.put(
  "/:id/toggle-status",
  protect,
  authorize("admin", "shopkeeper"),
  toggleProductStatus,
);

router.put(
  "/:id/stock",
  protect,
  authorize("admin", "shopkeeper"),
  updateProductStock,
);

module.exports = router;
