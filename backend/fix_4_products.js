require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/Product");

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // 1. Mirch Powder -> Lal Mirch Powder
    await Product.updateMany(
      { name: { $regex: "Mirch Powder", $options: "i" }, name: { $not: { $regex: "Safed|Kali", $options: "i" } } },
      { $set: { hindiName: "लाल मिर्च पाउडर" } }
    );
    console.log("Updated Mirch Powder");

    // 2. Dhania Whole -> Dhaniya Powder
    await Product.updateMany(
      { name: { $regex: "Dhania Whole", $options: "i" } },
      { $set: { hindiName: "धनिया पाउडर" } }
    );
    console.log("Updated Dhania Whole");

    // 3. Pachfodan -> Pachfodan
    await Product.updateMany(
      { name: { $regex: "Pachfodan", $options: "i" } },
      { $set: { hindiName: "पचफोड़न" } }
    );
    console.log("Updated Pachfodan");

    // 4. Safed Gol Mirch
    await Product.updateMany(
      { name: { $regex: "Safed Gol Mirch", $options: "i" } },
      { $set: { hindiName: "सफेद गोल मिर्च" } }
    );
    console.log("Updated Safed Gol Mirch");

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
