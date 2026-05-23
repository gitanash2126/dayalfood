const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("addresses");

  successResponse(res, 200, "Addresses fetched successfully", user.addresses);
});

// @desc    Add user address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    address,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = req.body;

  if (!fullName || !phone || !address || !city || !state || !postalCode) {
    res.status(400);
    throw new Error("All required address fields must be provided");
  }

  const user = await User.findById(req.user._id);

  if (isDefault || user.addresses.length === 0) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  user.addresses.push({
    fullName,
    phone,
    address,
    city,
    state,
    postalCode,
    country: country || "India",
    isDefault: isDefault || user.addresses.length === 0,
  });

  await user.save();

  successResponse(res, 201, "Address added successfully", user.addresses);
});

// @desc    Update user address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  const fields = [
    "fullName",
    "phone",
    "address",
    "city",
    "state",
    "postalCode",
    "country",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      address[field] = req.body[field];
    }
  });

  await user.save();

  successResponse(res, 200, "Address updated successfully", user.addresses);
});

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  const wasDefault = address.isDefault;

  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.addressId,
  );

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  successResponse(res, 200, "Address deleted successfully", user.addresses);
});

// @desc    Set default address
// @route   PUT /api/users/addresses/:addressId/default
// @access  Private
const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  user.addresses.forEach((addr) => {
    addr.isDefault = addr._id.toString() === req.params.addressId;
  });

  await user.save();

  successResponse(
    res,
    200,
    "Default address updated successfully",
    user.addresses,
  );
});

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
