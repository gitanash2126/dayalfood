const Order = require("../models/Order");

const Product = require("../models/Product");

const Cart = require("../models/Cart");

const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/apiResponse");

// ==========================================
// CREATE ORDER
// POST /api/orders
// ==========================================
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,

    shippingAddress,

    addressId,

    paymentMethod,
  } = req.body;

  // VALIDATION
  if (!orderItems || orderItems.length === 0) {
    res.status(400);

    throw new Error("No order items");
  }

  let finalShippingAddress = shippingAddress;

  // ==========================================
  // SAVED ADDRESS
  // ==========================================
  if (addressId) {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);

      throw new Error("User not found");
    }

    const savedAddress = user.addresses.id(addressId);

    if (!savedAddress) {
      res.status(404);

      throw new Error("Saved address not found");
    }

    finalShippingAddress = {
      fullName: savedAddress.fullName,

      phone: savedAddress.phone,

      address: savedAddress.address,

      city: savedAddress.city,

      state: savedAddress.state,

      postalCode: savedAddress.postalCode,

      country: savedAddress.country,
    };
  }

  // ==========================================
  // ADDRESS VALIDATION
  // ==========================================
  if (
    !finalShippingAddress ||
    !finalShippingAddress.fullName ||
    !finalShippingAddress.phone ||
    !finalShippingAddress.address ||
    !finalShippingAddress.city ||
    !finalShippingAddress.state ||
    !finalShippingAddress.postalCode
  ) {
    res.status(400);

    throw new Error("Shipping address is required");
  }

  // ==========================================
  // VALIDATE PRODUCTS
  // ==========================================
  const itemsFromDB = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product || !product.isActive) {
      res.status(404);

      throw new Error(`Product not found: ${item.product}`);
    }

    // STOCK CHECK
    if (product.stock < item.quantity) {
      res.status(400);

      throw new Error(
        `Only ${product.stock} items available for ${product.name}`,
      );
    }

    itemsFromDB.push({
      product: product._id,

      name: product.name,

      imageUrl: product.image,

      price: product.price,

      quantity: item.quantity,
    });
  }

  // ==========================================
  // CALCULATIONS
  // ==========================================
  const itemsPrice = itemsFromDB.reduce(
    (acc, item) => acc + item.price * item.quantity,

    0,
  );

  const shippingPrice = itemsPrice >= 500 ? 0 : 40;

  const taxPrice = 0;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // ==========================================
  // CREATE ORDER
  // ==========================================
  const order = await Order.create({
    user: req.user._id,

    orderItems: itemsFromDB,

    shippingAddress: finalShippingAddress,

    paymentMethod: paymentMethod || "COD",

    itemsPrice,

    shippingPrice,

    taxPrice,

    totalPrice,
  });

  // ==========================================
  // REDUCE STOCK
  // ==========================================
  for (const item of itemsFromDB) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  // ==========================================
  // CLEAR CART
  // ==========================================
  await Cart.findOneAndUpdate(
    {
      user: req.user._id,
    },

    {
      items: [],
    },

    {
      new: true,
    },
  );

  successResponse(res, 201, "Order created successfully", order);
});

// ==========================================
// GET MY ORDERS
// ONLY LOGGED USER ORDERS
// GET /api/orders/my-orders
// ==========================================
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  })
    .sort({
      createdAt: -1,
    })
    .populate("user", "name email");

  successResponse(res, 200, "My orders fetched successfully", orders);
});

// ==========================================
// GET ORDER BY ID
// GET /api/orders/:id
// ==========================================
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email phone",
  );

  if (!order) {
    res.status(404);

    throw new Error("Order not found");
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();

  const isAdmin = req.user.role === "admin";

  // ONLY OWNER OR ADMIN
  if (!isOwner && !isAdmin) {
    res.status(403);

    throw new Error("Not authorized to view this order");
  }

  successResponse(res, 200, "Order fetched successfully", order);
});

// ==========================================
// GET ALL ORDERS
// ADMIN ONLY
// GET /api/orders
// ==========================================
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email phone")
    .sort({
      createdAt: -1,
    });

  successResponse(res, 200, "Orders fetched successfully", orders);
});

// ==========================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// ==========================================
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const allowedStatus = [
    "Pending",

    "Confirmed",

    "Processing",

    "Shipped",

    "Delivered",

    "Cancelled",
  ];

  // VALIDATION
  if (!allowedStatus.includes(orderStatus)) {
    res.status(400);

    throw new Error("Invalid order status");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);

    throw new Error("Order not found");
  }

  order.orderStatus = orderStatus;

  // DELIVERED
  if (orderStatus === "Delivered") {
    order.deliveredAt = Date.now();

    order.paymentStatus = "Paid";

    if (!order.paidAt) {
      order.paidAt = Date.now();
    }
  }

  await order.save();

  successResponse(res, 200, "Order status updated successfully", order);
});

// ==========================================
// UPDATE PAYMENT STATUS
// PUT /api/orders/:id/payment
// ==========================================
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;

  const allowedStatus = ["Pending", "Paid", "Failed", "Refunded"];

  // VALIDATION
  if (!allowedStatus.includes(paymentStatus)) {
    res.status(400);

    throw new Error("Invalid payment status");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);

    throw new Error("Order not found");
  }

  order.paymentStatus = paymentStatus;

  // PAID
  if (paymentStatus === "Paid" && !order.paidAt) {
    order.paidAt = Date.now();
  }

  await order.save();

  successResponse(res, 200, "Payment status updated successfully", order);
});

// ==========================================
// CANCEL ORDER
// PUT /api/orders/:id/cancel
// ==========================================
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);

    throw new Error("Order not found");
  }

  const isOwner = order.user.toString() === req.user._id.toString();

  const isAdmin = req.user.role === "admin";

  // ACCESS CHECK
  if (!isOwner && !isAdmin) {
    res.status(403);

    throw new Error("Not authorized to cancel this order");
  }

  // BLOCK CANCEL
  if (order.orderStatus === "Delivered" || order.orderStatus === "Shipped") {
    res.status(400);

    throw new Error("Order cannot be cancelled now");
  }

  // ALREADY CANCELLED
  if (order.orderStatus === "Cancelled") {
    res.status(400);

    throw new Error("Order already cancelled");
  }

  // CANCEL
  order.orderStatus = "Cancelled";

  // RESTORE STOCK
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: item.quantity,
      },
    });
  }

  await order.save();

  successResponse(res, 200, "Order cancelled successfully", order);
});

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  createOrder,

  getMyOrders,

  getOrderById,

  getOrders,

  updateOrderStatus,

  updatePaymentStatus,

  cancelOrder,
};
