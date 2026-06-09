require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/Product");

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB");

    // 1. Kali Mirch Powder
    const kaliMirch = await Product.findOne({ name: { $regex: /kali mirch powder/i } });
    if (kaliMirch) {
      kaliMirch.variants = [
        { weight: "100g", price: 185, stock: 100 },
        { weight: "200g", price: 360, stock: 100 },
        { weight: "500g", price: 840, stock: 100 }
      ];
      await kaliMirch.save();
      console.log("Updated Kali Mirch Powder");
    } else {
      console.log("Kali Mirch Powder not found");
    }

    // 2. Hing Premium Box
    const hing = await Product.findOne({ name: { $regex: /^hing$/i } });
    if (hing) {
      hing.name = "Hing Premium Box";
      await hing.save();
      console.log("Updated Hing to Hing Premium Box");
    } else {
      const hingPremium = await Product.findOne({ name: { $regex: /hing premium/i } });
      if (hingPremium) console.log("Hing Premium Box already exists");
      else console.log("Hing not found");
    }

    // Hing Pouch -> Compunding Hing
    const hingPouch = await Product.findOne({ name: { $regex: /hing pouch/i } });
    if (hingPouch) {
      hingPouch.name = "Compunding Hing";
      await hingPouch.save();
      console.log("Updated Hing Pouch to Compunding Hing");
    } else {
      console.log("Hing Pouch not found");
    }

    // 3. Bhuna Jeera
    const bhunaJeera = await Product.findOne({ name: { $regex: /bhuna jeera/i } });
    if (bhunaJeera) {
      bhunaJeera.variants = [
        { weight: "100g", price: 85, stock: 100 },
        { weight: "500g", price: 590, stock: 100 }
      ];
      await bhunaJeera.save();
      console.log("Updated Bhuna Jeera");
    } else {
      console.log("Bhuna Jeera not found");
    }

    // 4. Chat Masala
    const chatMasala = await Product.findOne({ name: { $regex: /chat masala/i } });
    if (chatMasala) {
      chatMasala.variants = [
        { weight: "50g", price: 38, stock: 100 },
        { weight: "200g", price: 155, stock: 100 },
        { weight: "500g", price: 330, stock: 100 }
      ];
      await chatMasala.save();
      console.log("Updated Chat Masala");
    } else {
      console.log("Chat Masala not found");
    }

    // 5. Sabzi Masala
    const sabziMasala = await Product.findOne({ name: { $regex: /sabzi masala/i } });
    if (sabziMasala) {
      sabziMasala.variants = [
        { weight: "100g", price: 77, stock: 100 },
        { weight: "500g", price: 380, stock: 100 }
      ];
      await sabziMasala.save();
      console.log("Updated Sabzi Masala");
    } else {
      console.log("Sabzi Masala not found");
    }

    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection Error:", err);
    process.exit(1);
  });
