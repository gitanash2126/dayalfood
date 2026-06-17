require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/Product");

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Fix Kali Mirch Powder
    await Product.updateMany(
      { name: { $regex: "Kali Mirch Powder", $options: "i" } },
      { $set: { hindiName: "काली मिर्च पाउडर" } }
    );
    console.log("Fixed Kali Mirch Powder");

    // Fix Kali Mirch Whole
    await Product.updateMany(
      { name: { $regex: "Kali Mirch Whole", $options: "i" } },
      { $set: { hindiName: "काली मिर्च" } }
    );
    console.log("Fixed Kali Mirch Whole");

    // Fix Bhuna Jeera Powder
    await Product.updateMany(
      { name: { $regex: "Bhuna Jeera Powder", $options: "i" } },
      { $set: { hindiName: "भुना जीरा पाउडर" } }
    );
    console.log("Fixed Bhuna Jeera Powder");

    // Fix Saunf Mahin
    await Product.updateMany(
      { name: { $regex: "Saunf Mahin", $options: "i" } },
      { $set: { hindiName: "सौंफ महीन" } }
    );
    console.log("Fixed Saunf Mahin");

    // Fix Clove
    await Product.updateMany(
      { name: { $regex: "Clove", $options: "i" } },
      { $set: { hindiName: "लौंग" } }
    );

    console.log("Fixed all remaining issues.");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
