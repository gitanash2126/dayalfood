import { ShoppingCart, Eye, Star } from "lucide-react";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

import { useCart } from "../../context/CartContext";

import { productImages, getProductImage } from "../../utils/productImages";

export default function ProductCard({ product }) {
  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  // Establish variants list (either from grouped product or fall back to single variant)
  const variants = product?.variants && product.variants.length > 0
    ? product.variants
    : [
        {
          _id: product?._id || product?.id,
          name: product?.name,
          weight: product?.weight || "500g",
          price: product?.price,
          sale_price: product?.sale_price || product?.price,
          stock: product?.stock || 0,
          image: product?.image || product?.imageUrl,
        },
      ];

  // Selected variant state
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  // Sync selected variant if product changes
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
  }, [product]);

  // PRODUCT ID of the active variant
  const rawId = selectedVariant?._id || product?._id || product?.id;
  const productId = typeof rawId === "string" ? rawId.split("-")[0] : rawId;

  // PRODUCT LINK
  const productLink = `/products/${productId}`;

  // Check if current variant is in cart
  const cartItem = cartItems.find((item) => String(item._id) === String(selectedVariant._id));

  // =====================================
  // PRODUCT IMAGE MATCHING
  // =====================================
  const productImage = getProductImage(product?.name, product?.image || product?.imageUrl);

  return (
    <div className="group bg-white/80 backdrop-blur-lg rounded-[24px] overflow-hidden border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(217,119,6,0.15)] transition-all duration-500 hover:-translate-y-2 relative">
      {/* SHINE EFFECT */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>

      {/* IMAGE */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#fffdf8] to-[#fdf6e3] p-2 sm:p-3 pb-0 sm:pb-0">
        {/* QUICK VIEW */}
        <Link
          to={productLink}
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110"
        >
          <Eye size={18} />
        </Link>

        {/* PRODUCT IMAGE */}
        <Link to={productLink} className="block overflow-hidden rounded-[16px] shadow-sm">
          <img
            src={productImage}
            alt={product?.name || "Product"}
            loading="lazy"
            className="w-full h-[140px] sm:h-[180px] object-cover group-hover:scale-110 transition duration-700"
            onError={(e) => {
              e.target.src = "/images/no-image.png";
            }}
          />
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-5">
        {/* CATEGORY */}
        <p className="text-[10px] sm:text-xs text-primary font-medium">
          {typeof product?.category === "object"
            ? product.category?.name
            : product?.category || "Premium Spice"}
        </p>

        {/* PRODUCT NAME */}
        <Link to={productLink}>
          <h3 className="text-sm sm:text-lg font-semibold text-dark mt-1 group-hover:text-primary transition line-clamp-2">
            {product?.name} {product?.hindiName && <span className="text-sm font-medium text-gray-500">({product.hindiName})</span>}
          </h3>
        </Link>

        {/* QUANTITY */}
        {variants.length > 1 ? (
          <div className="mt-2 sm:mt-3">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Select Quantity:</span>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {variants.map((v) => {
                const isSelected = v._id === selectedVariant?._id;
                return (
                  <button
                    type="button"
                    key={v._id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 border ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-sm scale-105"
                        : "bg-[#fffdf8] text-gray-600 border-orange-100 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {v.weight}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
            Quantity : {selectedVariant?.weight || "500g"}
          </p>
        )}

        {/* RATING */}
        <div className="flex items-center gap-1 mt-2 sm:mt-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={12}
              className={`${
                star <= Math.round(product?.rating || 0)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}

          <span className="text-xs text-gray-500 ml-1">
            ({product?.rating || 0})
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-500 leading-tight text-xs mt-2 hidden sm:block line-clamp-2">
          {product?.description
            ? product.description
            : "Premium quality authentic Indian spice with rich aroma."}
        </p>

        {/* PRICE */}
        <div className="flex items-center justify-between mt-3 sm:mt-4">
          <div>
            <span className="text-base sm:text-xl font-bold text-primary">
              ₹{selectedVariant?.sale_price || selectedVariant?.price || 0}
            </span>
          </div>

          {/* ADD TO CART / CONTROLS */}
          <div className="flex-shrink-0">
            {cartItem ? (
              <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-[14px] p-1 shadow-sm w-[90px] sm:w-[100px]">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    decreaseQuantity(cartItem._id);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-dark hover:bg-orange-100 hover:text-primary transition-colors text-lg font-medium"
                >
                  -
                </button>
                <span className="font-bold text-sm sm:text-base text-dark w-6 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    increaseQuantity(cartItem._id);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-dark hover:bg-orange-100 hover:text-primary transition-colors text-lg font-medium"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigating if this is inside a link somehow (though it's not)
                  const toAdd = selectedVariant?.productObj || {
                    ...product,
                    _id: selectedVariant?._id,
                    id: selectedVariant?._id,
                    price: selectedVariant?.price,
                    sale_price: selectedVariant?.sale_price || selectedVariant?.price,
                    weight: selectedVariant?.weight,
                    stock: selectedVariant?.stock,
                  };
                  addToCart(toAdd);
                }}
                className="bg-primary hover:bg-secondary text-white p-2.5 sm:p-3.5 rounded-[14px] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12"
                title="Add to Cart"
              >
                <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
