require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/Product");

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.updateMany(
      { name: { $regex: "Mangrail", $options: "i" } },
      { $set: { hindiName: "मंगरेल" } }
    );
    console.log("Mangrail updated");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
