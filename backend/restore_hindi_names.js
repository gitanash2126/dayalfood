require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/Product");

const hindiNames = {
  "Jeera": "जीरा",
  "Haldi": "हल्दी",
  "Dhaniya": "धनिया पाउडर", // Map Dhaniya to Dhaniya Powder as requested
  "Dhania": "धनिया पाउडर", // Both spellings
  "Lal Mirch": "लाल मिर्च पाउडर",
  "Mirch Powder": "लाल मिर्च पाउडर", // Fix for Mirch Powder
  "Kali Mirch": "काली मिर्च",
  "Garam Masala": "गरम मसाला",
  "Methi": "मेथी",
  "Ajwain": "अजवायन",
  "Saunf": "सौंफ",
  "Rai": "राई",
  "Magrail": "कलौंजी",
  "Mangrail": "कलौंजी",
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
  "Safed Gol Mirch": "सफेद गोल मिर्च",
  "Safed Mirch Powder": "सफेद मिर्च पाउडर",
  "Mishrit Khada Masala": "मिश्रित खड़ा मसाला",
  "Pachfodan": "पचफोड़न",
  "Pach Fodan": "पचफोड़न"
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    const products = await Product.find({});
    
    for (let p of products) {
      let matched = false;
      let newHindiName = "";
      
      // Order keys by length descending to match longest first (e.g. "Kali Mirch" before "Mirch")
      const sortedKeys = Object.keys(hindiNames).sort((a, b) => b.length - a.length);

      for (let key of sortedKeys) {
        if (p.name.toLowerCase().includes(key.toLowerCase())) {
          newHindiName = hindiNames[key];
          matched = true;
          break;
        }
      }
      
      if (matched) {
        p.hindiName = newHindiName;
      } else {
        p.hindiName = ""; // Clear incorrect data
      }
      
      await p.save();
    }

    console.log("All products updated with correct Hindi names.");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
