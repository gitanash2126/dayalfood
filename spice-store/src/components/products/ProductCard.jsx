import { ShoppingCart, Eye, Star } from "lucide-react";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

import { useCart } from "../../context/CartContext";

import { productImages, getProductImage } from "../../utils/productImages";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

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

  // =====================================
  // PRODUCT IMAGE MATCHING
  // =====================================
  const productImage = getProductImage(product?.name, product?.image || product?.imageUrl);

  return (
    <div className="group bg-white rounded-[28px] overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* IMAGE */}
      <div className="relative overflow-hidden bg-[#fff8f1]">
        {/* QUICK VIEW */}
        <Link
          to={productLink}
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-primary hover:text-white"
        >
          <Eye size={18} />
        </Link>

        {/* PRODUCT IMAGE */}
        <Link to={productLink}>
          <img
            src={productImage}
            alt={product?.name || "Product"}
            loading="lazy"
            className="w-full h-[280px] object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => {
              e.target.src = "/images/no-image.png";
            }}
          />
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {/* CATEGORY */}
        <p className="text-sm text-primary font-medium">
          {typeof product?.category === "object"
            ? product.category?.name
            : product?.category || "Premium Spice"}
        </p>

        {/* PRODUCT NAME */}
        <Link to={productLink}>
          <h3 className="text-2xl font-semibold text-dark mt-2 group-hover:text-primary transition">
            {product?.name}
          </h3>
        </Link>

        {/* QUANTITY */}
        {variants.length > 1 ? (
          <div className="mt-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Select Quantity:</span>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const isSelected = v._id === selectedVariant?._id;
                return (
                  <button
                    type="button"
                    key={v._id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-md scale-105"
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
          <p className="text-gray-500 text-sm mt-2">
            Quantity : {selectedVariant?.weight || "500g"}
          </p>
        )}

        {/* RATING */}
        <div className="flex items-center gap-1 mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={`${
                star <= Math.round(product?.rating || 0)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}

          <span className="text-sm text-gray-500 ml-2">
            ({product?.rating || 0})
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-500 leading-7 text-sm mt-4">
          {product?.description
            ? `${product.description.slice(0, 70)}...`
            : "Premium quality authentic Indian spice with rich aroma."}
        </p>

        {/* PRICE */}
        <div className="flex items-center justify-between mt-6">
          <div>
            <span className="text-2xl font-bold text-primary">
              ₹{selectedVariant?.sale_price || selectedVariant?.price || 0}
            </span>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={() => {
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
            className="bg-primary hover:bg-secondary text-white p-4 rounded-2xl transition duration-300 shadow-lg hover:scale-105"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
