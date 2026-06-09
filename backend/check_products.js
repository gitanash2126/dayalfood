require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/Product");

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB");

    const products = await Product.find({}, "name variants price image isFeatured");
    products.forEach(p => {
      console.log(`Product: ${p.name} | Variants: ${p.variants.length > 0 ? JSON.stringify(p.variants.map(v => ({w: v.weight, p: v.price}))) : p.price}`);
    });

    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection Error:", err);
    process.exit(1);
  });
