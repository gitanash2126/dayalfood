import ajwain from "../assets/products/ajwain.jpeg";
import badiilaichi from "../assets/products/badiilaichi.jpeg";
import bayleaf from "../assets/products/bayleaf.jpeg";
import blackmustard from "../assets/products/blackmustard.jpeg";
import chotiilaichi from "../assets/products/chotiilaichi.jpeg";
import clove from "../assets/products/clove.jpeg";
import dhaniya from "../assets/products/dhaniya.jpeg";
import garammasala from "../assets/products/garammasala.jpeg";
import haldi from "../assets/products/haldi.jpeg";
import jaifal from "../assets/products/jaifal.jpeg";
import javitri from "../assets/products/javitri.jpeg";
import jeera from "../assets/products/jeera.jpeg";
import jeera2 from "../assets/products/jeera2.jpeg";
import kababchini from "../assets/products/kababchini.jpeg";
import kalimirchi from "../assets/products/kalimirchi.jpeg";
import kalimirchipowder from "../assets/products/kalimirchipowder.jpeg";
import khadamasala from "../assets/products/khadamasala.jpeg";
import magrail from "../assets/products/magrail.jpeg";
import methi from "../assets/products/methi.jpg";
import mirchipowder from "../assets/products/mirchi powder.jpeg";
import mishritkhadamasala from "../assets/products/mishritkhadamasala.jpeg";
import pachfodan from "../assets/products/pachfodan.jpeg";
import rai from "../assets/products/Rai.jpg";
import safedgolmirchi from "../assets/products/safed gol mirchi.jpeg";
import safedmirchpowder from "../assets/products/safed mirch powder.jpeg";
import saunf from "../assets/products/saunf.jpeg";
import saunfmahin from "../assets/products/saunf mahin.jpeg";
import shahjeera from "../assets/products/shahjeera.jpeg";
import starfool from "../assets/products/starfool.jpeg";
import yellowmustard from "../assets/products/yellowmustard.jpeg";

import bhunaJeeraPowder from "../assets/products/Bhuna Jeera Powder.JPG";
import chatMasala from "../assets/products/Chat Masala.JPG";
import dhaniyaWhole from "../assets/products/Dhania whole.JPG";
import dhaniyaPowderJpg from "../assets/products/dhaniya powder.jpg";
import haldiJpg from "../assets/products/Haldi.JPG";
import haldiPowderJpeg from "../assets/products/Haldi powder.jpeg";
import hingPremium from "../assets/products/Hing Premium Box.JPG";
import compoundingHing from "../assets/products/Compunding Hing.jpg";
import kachoriAtta from "../assets/products/Kachori Atta.JPG";
import kalaungiMasala from "../assets/products/Kalaungi Masala.JPG";
import kaliMirchPowderJpg from "../assets/products/Kali Mirch Powder.JPG";
import kaliMirchWhole from "../assets/products/Kali Mirch whole.JPG";
import khadaMasalaJpg from "../assets/products/Khada Masala.JPG";
import lalMirchPowder from "../assets/products/Lal Mirch Powder.JPG";
import mirchiPowder2 from "../assets/products/mirchi powder 2.jpg";
import sabziMasala from "../assets/products/Sabzi Masala.JPG";
import postodana from "../assets/products/posto dana.jpg";

export const productImages = {
  ajwain: ajwain,
  "badi ilaichi": badiilaichi,
  "bay leaf": bayleaf,
  "black mustard": blackmustard,
  "choti ilaichi": chotiilaichi,
  clove: clove,
  dhaniya: dhaniya,
  "dhaniya powder": dhaniya,
  "dhaniya whole": dhaniyaPowderJpg,
  "dhania whole": dhaniyaPowderJpg, // alias

  "garam masala": garammasala,
  haldi: haldiPowderJpeg,
  
  "hing premium box": hingPremium,
  "hing premium": hingPremium,
  "compunding hing": compoundingHing,
  "compounding hing": compoundingHing,

  jaifal: jaifal,
  javitri: javitri,
  jeera: jeera,
  "jeera 2": jeera2,
  "kabab chini": kababchini,
  
  "kali mirchi": kalimirchi,
  "kali mirch whole": kaliMirchWhole,
  "kali mirch": kaliMirchWhole, // alias
  
  "kali mirchi powder": kaliMirchPowderJpg,
  "kali mirch powder": kaliMirchPowderJpg, // alias
  
  "kalaungi masala": kalaungiMasala,
  "kalongi masala": kalaungiMasala, // alias
  
  "khada masala": khadaMasalaJpg,
  
  magrail: magrail,
  mangrail: magrail, // IMPORTANT for mapping DB
  
  methi: methi,
  
  "mirchi powder": mirchiPowder2, // User requested powder image first
  "mirch powder": mirchiPowder2,
  "lal mirch powder": mirchiPowder2,
  "lal mirch": mirchiPowder2,

  "mishrit khada masala": mishritkhadamasala,
  
  "pach fodan": pachfodan,
  "pachfodan": pachfodan, // alias
  
  rai: rai,
  
  "sabzi masala": sabziMasala,
  "sabji masala": sabziMasala, // alias
  
  "safed gol mirch": safedgolmirchi,
  "safed gol mirchi": safedgolmirchi,
  
  "safed mirch powder": safedmirchpowder,
  "safed mirch powder premium": safedmirchpowder,
  
  saunf: saunf,
  "saunf mahin": saunfmahin,
  "sauff": saunf, // alias
  
  "shah jeera": shahjeera,
  
  "star phool": starfool,
  "starfool": starfool, // alias
  
  "yellow mustard": yellowmustard,

  "bhuna jeera powder": bhunaJeeraPowder,
  "bhuna jeera": bhunaJeeraPowder,
  
  "chat masala": chatMasala,
  
  "kachori atta": kachoriAtta,
  "kachodi atta": kachoriAtta, // alias
  "kachori": kachoriAtta, // alias
  
  "posto dana": postodana,
};

export const getProductImage = (name, fallbackImage) => {
  if (!name) return fallbackImage || "/images/no-image.png";
  
  const searchName = name.toLowerCase().trim();
  
  // Try exact match first
  if (productImages[searchName]) {
    return productImages[searchName];
  }
  
  // Sort keys by length descending so "safed mirch powder" is checked before "mirch powder"
  const sortedKeys = Object.keys(productImages).sort((a, b) => b.length - a.length);

  // Try includes match
  for (const key of sortedKeys) {
    if (searchName.includes(key) || key.includes(searchName)) {
      return productImages[key];
    }
  }
  
  return fallbackImage || "/images/no-image.png";
};

// Returns an array of images for carousel usage
export const getProductImages = (name, fallbackImage) => {
  const mainImage = getProductImage(name, fallbackImage);
  const searchName = name?.toLowerCase()?.trim() || "";
  
  if (searchName.includes("haldi") && !searchName.includes("safed")) {
    return [mainImage, haldiJpg];
  }
  
  if (searchName.includes("dhaniya whole") || searchName.includes("dhania whole")) {
    return [mainImage, dhaniyaWhole];
  }
  
  if ((searchName.includes("mirch powder") || searchName.includes("mirchi powder") || searchName.includes("lal mirch")) && 
      !searchName.includes("safed") && !searchName.includes("kali")) {
    return [mainImage, lalMirchPowder];
  }
  
  return [mainImage];
};

export default productImages;
