const User = require("../models/User");

const Product = require("../models/Product");

const Order = require("../models/Order");

const asyncHandler = require("../utils/asyncHandler");

const { successResponse } = require("../utils/apiResponse");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // TOTAL COUNTS
  const totalUsers = await User.countDocuments();

  const totalProducts = await Product.countDocuments();

  const totalOrders = await Order.countDocuments();

  // TOTAL REVENUE
  const revenueData = await Order.aggregate([
    {
      $match: {
        orderStatus: {
          $ne: "Cancelled",
        },
      },
    },

    {
      $group: {
        _id: null,

        totalRevenue: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  // ORDER STATUS COUNTS
  const pendingOrders = await Order.countDocuments({
    orderStatus: "Pending",
  });

  const deliveredOrders = await Order.countDocuments({
    orderStatus: "Delivered",
  });

  const cancelledOrders = await Order.countDocuments({
    orderStatus: "Cancelled",
  });

  // LOW STOCK
  const lowStockProducts = await Product.countDocuments({
    stock: {
      $lte: 5,
    },

    isActive: true,
  });

  // RECENT USERS
  const recentUsers = await User.find({})
    .select("-password")
    .sort({
      createdAt: -1,
    })
    .limit(5);

  // RECENT PRODUCTS
  const recentProducts = await Product.find({})
    .sort({
      createdAt: -1,
    })
    .limit(5);

  successResponse(res, 200, "Dashboard stats fetched successfully", {
    totalUsers,

    totalProducts,

    totalOrders,

    totalRevenue: revenueData[0]?.totalRevenue || 0,

    pendingOrders,

    deliveredOrders,

    cancelledOrders,

    lowStockProducts,

    recentUsers,

    recentProducts,
  });
});

// @desc    Get recent orders
// @route   GET /api/admin/recent-orders
// @access  Admin
const getRecentOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email phone")
    .sort({
      createdAt: -1,
    })
    .limit(10);

  successResponse(res, 200, "Recent orders fetched successfully", orders);
});

// @desc    Get low stock products
// @route   GET /api/admin/low-stock-products
// @access  Admin
const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    stock: {
      $lte: 5,
    },

    isActive: true,
  }).sort({
    stock: 1,
  });

  successResponse(
    res,
    200,
    "Low stock products fetched successfully",
    products,
  );
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({
    createdAt: -1,
  });

  successResponse(res, 200, "Users fetched successfully", users);
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const allowedRoles = ["user", "admin", "shopkeeper"];

  // INVALID ROLE
  if (!allowedRoles.includes(role)) {
    res.status(400);

    throw new Error("Invalid role");
  }

  // FIND USER
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  // UPDATE ROLE
  user.role = role;

  await user.save();

  successResponse(res, 200, "User role updated successfully", {
    _id: user._id,

    name: user.name,

    email: user.email,

    role: user.role,
  });
});

// @desc    Update user active status
// @route   PUT /api/admin/users/:id/status
// @access  Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  // FIND USER
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);

    throw new Error("User not found");
  }

  // UPDATE STATUS
  user.isActive = Boolean(isActive);

  await user.save();

  successResponse(res, 200, "User status updated successfully", {
    _id: user._id,

    name: user.name,

    email: user.email,

    isActive: user.isActive,
  });
});

// @desc    Get sales analytics
// @route   GET /api/admin/analytics
// @access  Admin
const getSalesAnalytics = asyncHandler(async (req, res) => {
  // MONTHLY SALES
  const monthlySales = await Order.aggregate([
    {
      $match: {
        orderStatus: {
          $ne: "Cancelled",
        },
      },
    },

    {
      $group: {
        _id: {
          month: {
            $month: "$createdAt",
          },
        },

        totalSales: {
          $sum: "$totalPrice",
        },

        totalOrders: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);

  // TOP PRODUCTS
  const topProducts = await Product.find({})
    .sort({
      sold: -1,
    })
    .limit(5);

  // RECENT ORDERS
  const recentOrders = await Order.find({})
    .populate("user", "name email")
    .sort({
      createdAt: -1,
    })
    .limit(5);

  successResponse(res, 200, "Analytics fetched successfully", {
    monthlySales,

    topProducts,

    recentOrders,
  });
});

module.exports = {
  getDashboardStats,

  getRecentOrders,

  getLowStockProducts,

  getAllUsers,

  updateUserRole,

  updateUserStatus,

  getSalesAnalytics,
};
