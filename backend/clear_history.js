require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Order = require("./src/models/Order");
const Cart = require("./src/models/Cart");

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // 1. Delete all Orders
    const orderRes = await Order.deleteMany({});
    console.log(`Deleted ${orderRes.deletedCount} orders`);

    // 2. Delete all Carts
    const cartRes = await Cart.deleteMany({});
    console.log(`Deleted ${cartRes.deletedCount} carts`);

    // 3. Delete non-admin Users
    const userRes = await User.deleteMany({ role: { $ne: "admin" } });
    console.log(`Deleted ${userRes.deletedCount} non-admin users`);

    console.log("History cleared successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Failed to connect or clear:", err);
    process.exit(1);
  });
