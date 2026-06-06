/**
 * Extracts the base name of a product by removing its weight/quantity suffix.
 * E.g., "Garam Masala 200g" -> "Garam Masala"
 *       "Jeera 50g" -> "Jeera"
 *       "Hing Premium Box" -> "Hing"
 * @param {string} name 
 * @param {string} weight 
 * @returns {string}
 */
export function getProductBaseName(name, weight) {
  if (!name) return "";
  if (!weight) return name.trim();
  
  // Escape regex special chars in weight
  const escapedWeight = weight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  // Create a regex to match the weight at the end of the name (case insensitive, optional trailing space)
  const regex = new RegExp(`\\s*${escapedWeight}\\s*$`, 'i');
  return name.replace(regex, '').trim();
}

/**
 * Groups products by their base name and aggregates weight variants.
 * @param {Array} productsList 
 * @returns {Array}
 */
export function groupProducts(productsList) {
  if (!productsList || !Array.isArray(productsList)) return [];

  const grouped = {};

  productsList.forEach((product) => {
    const baseName = getProductBaseName(product.name, product.weight);
    
    if (!grouped[baseName]) {
      grouped[baseName] = {
        baseName,
        category: product.category,
        brand: product.brand,
        description: product.description,
        image: product.image || product.imageUrl,
        rating: product.rating,
        numReviews: product.numReviews,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        variants: [],
      };
    }
    
    // IF the product has built-in variants (from our new DB schema)
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(v => {
        grouped[baseName].variants.push({
          _id: `${product._id || product.id}-${v.weight}`,
          name: product.name,
          weight: v.weight,
          price: v.price,
          sale_price: v.sale_price || v.price,
          stock: v.stock,
          image: product.image || product.imageUrl,
          slug: product.slug || product._id || product.id,
          productObj: product, // original product object
        });
      });
    } else {
      // Fallback for older products
      grouped[baseName].variants.push({
        _id: product._id || product.id,
        name: product.name,
        weight: product.weight || "500g",
        price: product.price,
        sale_price: product.sale_price || product.price,
        stock: product.stock,
        image: product.image || product.imageUrl,
        slug: product.slug || product._id || product.id,
        productObj: product,
      });
    }
  });

  return Object.values(grouped).map((group) => {
    // Sort variants by weight
    group.variants.sort((a, b) => {
      const getWeightVal = (w) => {
        if (!w) return 0;
        const num = parseFloat(w);
        if (isNaN(num)) return 0;
        if (w.toLowerCase().includes("kg")) return num * 1000;
        return num;
      };
      return getWeightVal(a.weight) - getWeightVal(b.weight);
    });

    const defaultVariant = group.variants[0];
    return {
      ...group,
      _id: defaultVariant._id,
      id: defaultVariant._id,
      name: group.baseName,
      price: defaultVariant.price,
      sale_price: defaultVariant.sale_price,
      stock: defaultVariant.stock,
      weight: defaultVariant.weight,
      slug: defaultVariant.slug,
    };
  });
}
