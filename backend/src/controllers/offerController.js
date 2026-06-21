const Offer = require("../models/Offer");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// @desc    Create a new offer
// @route   POST /api/offers
// @access  Private/Admin
const createOffer = asyncHandler(async (req, res) => {
  const { 
    title, description, discountText, 
    couponCode, discountType, discountValue,
    startDate, endDate, isActive 
  } = req.body;

  if (!title || !discountText || !couponCode || !discountType || discountValue === undefined || !startDate || !endDate) {
    return errorResponse(res, 400, "Please provide all required fields including coupon details");
  }

  const image = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : "";

  const offer = await Offer.create({
    title,
    description,
    discountText,
    couponCode: couponCode.toUpperCase(),
    discountType,
    discountValue,
    image,
    startDate,
    endDate,
    isActive: isActive !== undefined ? isActive : true,
  });

  successResponse(res, 201, "Offer created successfully", offer);
});

// @desc    Get all offers (for admin)
// @route   GET /api/offers
// @access  Private/Admin
const getOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find().sort({ createdAt: -1 });
  successResponse(res, 200, "Offers fetched successfully", offers);
});

// @desc    Get active offer (for public home page)
// @route   GET /api/offers/active
// @access  Public
const getActiveOffer = asyncHandler(async (req, res) => {
  // Use local server time boundaries for forgiving timezone checks
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Find an offer where isActive is true and it overlaps with today
  const offer = await Offer.findOne({
    isActive: true,
    startDate: { $lte: endOfToday },
    endDate: { $gte: startOfToday }
  }).sort({ createdAt: -1 }); // Get the most recent one if multiple

  successResponse(res, 200, "Active offer fetched successfully", offer);
});

// @desc    Update an offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
const updateOffer = asyncHandler(async (req, res) => {
  let offer = await Offer.findById(req.params.id);

  if (!offer) {
    return errorResponse(res, 404, "Offer not found");
  }

  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  offer = await Offer.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  successResponse(res, 200, "Offer updated successfully", offer);
});

// @desc    Delete an offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    return errorResponse(res, 404, "Offer not found");
  }

  await offer.deleteOne();

  successResponse(res, 200, "Offer deleted successfully");
});

// @desc    Validate a coupon code
// @route   POST /api/offers/validate-coupon
// @access  Public
const validateCoupon = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;

  if (!couponCode) {
    return errorResponse(res, 400, "Please provide a coupon code");
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const offer = await Offer.findOne({
    couponCode: couponCode.toUpperCase(),
    isActive: true,
    startDate: { $lte: endOfToday },
    endDate: { $gte: startOfToday }
  });

  if (!offer) {
    return errorResponse(res, 400, "Invalid or expired coupon code");
  }

  successResponse(res, 200, "Coupon applied successfully", {
    couponCode: offer.couponCode,
    discountType: offer.discountType,
    discountValue: offer.discountValue,
    discountText: offer.discountText
  });
});

module.exports = {
  createOffer,
  getOffers,
  getActiveOffer,
  updateOffer,
  deleteOffer,
  validateCoupon,
};
