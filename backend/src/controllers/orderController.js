const Order = require("../models/Order");

const Product = require("../models/Product");

const Cart = require("../models/Cart");

const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/apiResponse");

const sendEmail = require("../utils/sendEmail");

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
    discountPrice,
    couponCodeUsed,
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
    
    discountPrice: discountPrice || 0,
    
    couponCodeUsed: couponCodeUsed || "",

    totalPrice,
  });



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
  // EMAIL NOTIFICATION
  // ==========================================
  try {
    console.log("EMAIL NOTIFICATION STARTED");

    const productsHtml = validatedItems
      .map((item) => `<li><strong>${item.name}</strong> (Qty: ${item.quantity}) - ₹${item.price * item.quantity}</li>`)
      .join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #f97316; padding: 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">🛒 New Order Received!</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
              <div style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #f3f4f6;">
                  <h3 style="margin-top: 0; color: #374151;">👤 Customer Details</h3>
                  <p style="margin: 5px 0;"><strong>Name:</strong> ${shippingAddress.fullName}</p>
                  <p style="margin: 5px 0;"><strong>Phone:</strong> ${shippingAddress.phone}</p>
                  <p style="margin: 5px 0;"><strong>Address:</strong> ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}</p>
              </div>
              
              <div style="margin-bottom: 25px;">
                  <h3 style="color: #374151;">📦 Ordered Products</h3>
                  <ul style="list-style-type: none; padding-left: 0;">
                      ${productsHtml}
                  </ul>
              </div>
              
              <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316;">
                  <h2 style="margin: 0; color: #9a3412;">💰 Total Amount: ₹${totalPrice}</h2>
                  <p style="margin: 10px 0 0 0; color: #c2410c;"><strong>💳 Payment Method:</strong> ${paymentMethod}</p>
              </div>
          </div>
          <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Log in to the Admin Dashboard to manage this order.</p>
          </div>
      </div>
    `;

    const ownerEmail = process.env.EMAIL_USER;

    if (ownerEmail) {
        // Run asynchronously without awaiting so it doesn't slow down the Place Order button
        sendEmail({
            to: ownerEmail,
            subject: `🚀 New Order: ₹${totalPrice} by ${shippingAddress.fullName}`,
            html: emailHtml
        }).then((response) => {
            if (response.success) {
                console.log("Email notification sent successfully to Owner");
            } else {
                console.error("Email notification failed:", response.error);
            }
        }).catch((err) => console.log("Email send error", err));
    } else {
        console.log("No EMAIL_USER defined. Skipping notification.");
    }
  } catch (error) {
    console.log("Email Error:", error.message);
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
