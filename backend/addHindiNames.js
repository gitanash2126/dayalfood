const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Mongoose schema (minimal just to update hindiName)
const productSchema = new mongoose.Schema({
  name: String,
  hindiName: String
}, { strict: false });

const Product = mongoose.model('Product', productSchema, 'products');

const hindiNames = {
  "Jeera": "जीरा",
  "Haldi": "हल्दी",
  "Dhaniya": "धनिया",
  "Lal Mirch": "लाल मिर्च",
  "Kali Mirch": "काली मिर्च",
  "Garam Masala": "गरम मसाला",
  "Methi": "मेथी",
  "Ajwain": "अजवायन",
  "Saunf": "सौंफ",
  "Rai": "राई",
  "Magrail": "कलौंजी",
  "Sabzi Masala": "सब्जी मसाला",
  "Meat Masala": "मीट मसाला",
  "Chat Masala": "चाट मसाला",
  "Khada Masala": "खड़ा मसाला",
  "Kalaungi Masala": "कलौंजी मसाला",
  "Hing": "हींग",
  "Posto Dana": "खसखस",
  "Tej Patta": "तेजपत्ता",
  "Bay Leaf": "तेजपत्ता",
  "Dalchini": "दालचीनी",
  "Elaichi": "इलायची",
  "Badi Ilaichi": "बड़ी इलायची",
  "Choti Ilaichi": "छोटी इलायची",
  "Laung": "लौंग",
  "Clove": "लौंग",
  "Javitri": "जावित्री",
  "Jaifal": "जायफल",
  "Shah Jeera": "शाह जीरा",
  "Kabab Chini": "कबाब चीनी",
  "Star Phool": "चक्र फूल",
  "Kachori Atta": "कचौरी आटा",
  "Black Mustard": "काली सरसों",
  "Yellow Mustard": "पीली सरसों",
  "Safed Gol Mirchi": "सफेद गोल मिर्च",
  "Safed Mirch Powder": "सफेद मिर्च पाउडर",
  "Mishrit Khada Masala": "मिश्रित खड़ा मसाला"
};

async function updateHindiNames() {
  try {
    // Connect to the correct DB used by the app!
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB!");

    const products = await Product.find({});
    let updateCount = 0;

    for (let p of products) {
      let matched = false;
      for (let key in hindiNames) {
        if (p.name.toLowerCase().includes(key.toLowerCase())) {
          p.hindiName = hindiNames[key];
          await p.save();
          console.log(`Updated ${p.name} -> ${p.hindiName}`);
          matched = true;
          updateCount++;
          break; // Stop checking other keywords if we found a match
        }
      }
      if (!matched) {
        console.log(`No match for ${p.name}`);
      }
    }

    console.log(`Successfully updated ${updateCount} products with Hindi names.`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating products:", error);
    process.exit(1);
  }
}

updateHindiNames();
