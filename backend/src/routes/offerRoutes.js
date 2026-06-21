const express = require("express");
const router = express.Router();

const {
  createOffer,
  getOffers,
  getActiveOffer,
  updateOffer,
  deleteOffer,
  validateCoupon,
} = require("../controllers/offerController");

const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public route for home page banner
router.get("/active", getActiveOffer);

// Public route to validate coupon at checkout
router.post("/validate-coupon", validateCoupon);

// Admin only routes
router.use(protect, authorize("admin"));

router.route("/")
  .post(upload.single("image"), createOffer)
  .get(getOffers);

router.route("/:id")
  .put(upload.single("image"), updateOffer)
  .delete(deleteOffer);

module.exports = router;
