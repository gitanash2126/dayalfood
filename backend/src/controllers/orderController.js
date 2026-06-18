const Order = require("../models/Order");

const Product = require("../models/Product");

const Cart = require("../models/Cart");

const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/apiResponse");

const twilio = require("twilio");

// ==========================================
// TWILIO CLIENT
// ==========================================
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// ==========================================
// CREATE ORDER
// POST /api/orders
// ==========================================
const createOrder = asyncHandler(async (req, res) => {
  console.log("CREATE ORDER API HIT");

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    transactionId,
    paymentScreenshot,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // ==========================================
  // VALIDATION
  // ==========================================
  if (!orderItems || orderItems.length === 0) {
    res.status(400);

    throw new Error("No order items");
  }

  // ==========================================
  // VERIFY PRODUCTS & STOCK
  // ==========================================
  const validatedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      res.status(404);

      throw new Error("Product not found");
    }

    if (product.stock < item.quantity) {
      res.status(400);

      throw new Error(
        `${product.name} has only ${product.stock} items left in stock`,
      );
    }

    validatedItems.push({
      product: product._id,

      name: product.name,

      hindiName: product.hindiName || "",

      imageUrl: product.image,

      price: product.price,

      quantity: item.quantity,
    });
  }

  // ==========================================
  // CREATE ORDER
  // ==========================================
  const order = await Order.create({
    user: req.user._id,

    orderItems: validatedItems,

    shippingAddress,

    paymentMethod,
    transactionId: transactionId || "",
    paymentScreenshot: paymentScreenshot || "",

    itemsPrice,

    taxPrice,

    shippingPrice,

    totalPrice,
  });

  // ==========================================
  // AUTO UPDATE USER PROFILE
  // ==========================================
  const dbUser = await User.findById(req.user._id);
  if (dbUser) {
    if (dbUser.name === "User" || !dbUser.name) {
      dbUser.name = shippingAddress.fullName;
    }
    
    // Auto-update address list if empty or just overwrite default
    dbUser.addresses = [
      {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        isDefault: true,
      }
    ];
    await dbUser.save({ validateBeforeSave: false });
  }

  // ==========================================
  // UPDATE STOCK
  // ==========================================
  for (const item of validatedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  // ==========================================
  // WHATSAPP NOTIFICATION
  // ==========================================
  try {
    console.log("WHATSAPP FUNCTION STARTED");

    console.log("TWILIO SID:", process.env.TWILIO_ACCOUNT_SID);

    console.log("TWILIO NUMBER:", process.env.TWILIO_WHATSAPP_NUMBER);

    console.log("OWNER NUMBER:", process.env.OWNER_WHATSAPP_NUMBER);

    const productsText = validatedItems
      .map((item) => `• ${item.name} x ${item.quantity}`)
      .join("\n");

    const message = `
🛒 NEW ORDER RECEIVED

👤 Customer:
${shippingAddress.fullName}

📞 Phone:
${shippingAddress.phone}

📍 Address:
${shippingAddress.address},
${shippingAddress.city},
${shippingAddress.state}

📦 Products:
${productsText}

💰 Total:
₹${totalPrice}

💳 Payment:
${paymentMethod}
`;

    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,

      to: process.env.OWNER_WHATSAPP_NUMBER,

      body: message,
    });

    console.log("WhatsApp notification sent successfully");

    console.log("Message SID:", response.sid);
  } catch (error) {
    console.log("WhatsApp Error:", error.message);

    console.log("Full Error:", error);
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
  );

  // ==========================================
  // RESPONSE
  // ==========================================
  successResponse(res, 201, "Order created successfully", order);
});

// ==========================================
// GET MY ORDERS
// GET /api/orders/myorders
// ==========================================
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  }).populate("orderItems.product").sort({
    createdAt: -1,
  });

  successResponse(res, 200, "My orders fetched successfully", orders);
});

// ==========================================
// GET ORDER BY ID
// GET /api/orders/:id
// ==========================================
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product");

  if (!order) {
    res.status(404);

    throw new Error("Order not found");
  }

  // SECURITY CHECK
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);

    throw new Error("Not authorized");
  }

  successResponse(res, 200, "Order fetched successfully", order);
});

// ==========================================
// GET ALL ORDERS (ADMIN)
// GET /api/orders
// ==========================================
const getOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.status) {
    filter.orderStatus = req.query.status;
  }

  if (req.query.paymentStatus === "paid") {
    filter.isPaid = true;
  }

  if (req.query.paymentStatus === "unpaid") {
    filter.isPaid = false;
  }

  if (req.query.search) {
    const users = await User.find({
      name: {
        $regex: req.query.search,
        $options: "i",
      },
    }).select("_id");

    filter.user = {
      $in: users.map((u) => u._id),
    };
  }

  const total = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .populate("user", "name email")
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  successResponse(res, 200, "Orders fetched successfully", {
    orders,

    page,

    pages: Math.ceil(total / limit),

    total,
  });
});

// ==========================================
// UPDATE ORDER STATUS
// ==========================================
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);

    throw new Error("Order not found");
  }

  order.orderStatus = status;

  if (status === "Delivered") {
    order.isDelivered = true;

    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  successResponse(res, 200, "Order status updated successfully", updatedOrder);
});

// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, paymentResult } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);

    throw new Error("Order not found");
  }

  if (paymentStatus === "paid") {
    order.isPaid = true;

    order.paidAt = Date.now();

    order.paymentResult = paymentResult || {};
  }

  const updatedOrder = await order.save();

  successResponse(
    res,
    200,
    "Payment status updated successfully",
    updatedOrder,
  );
});

// ==========================================
// CANCEL ORDER
// ==========================================
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);

    throw new Error("Order not found");
  }

  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);

    throw new Error("Not authorized");
  }

  if (order.orderStatus === "Delivered") {
    res.status(400);

    throw new Error("Delivered orders cannot be cancelled");
  }

  order.orderStatus = "Cancelled";

  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: item.quantity,
      },
    });
  }

  const updatedOrder = await order.save();

  successResponse(res, 200, "Order cancelled successfully", updatedOrder);
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
