import { ShoppingCart, Eye, Star } from "lucide-react";

import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  // PRODUCT ID
  const productId = product._id || product.id;

  // PRODUCT LINK
  const productLink = `/products/${productId}`;

  // IMAGE FIX
  const productImage = product.image?.startsWith("/uploads")
    ? `http://localhost:5000${product.image}`
    : product.image || "/images/default-product.jpg";

  return (
    <div className="group bg-white rounded-[32px] overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
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
            alt={product.name}
            loading="lazy"
            className="w-full h-[280px] object-cover group-hover:scale-110 transition duration-700"
          />
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {/* CATEGORY */}
        <p className="text-sm text-primary font-medium">
          {product.category || "Premium Spice"}
        </p>

        {/* PRODUCT NAME */}
        <Link to={productLink}>
          <h3 className="text-2xl font-semibold text-dark mt-2 group-hover:text-primary transition">
            {product.name}
          </h3>
        </Link>

        {/* WEIGHT */}
        <p className="text-gray-500 text-sm mt-2">
          Weight : {product.weight || "500g"}
        </p>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={`${
                star <= Math.round(product.rating || 0)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}

          <span className="text-sm text-gray-500 ml-2">
            ({product.rating || 0})
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-500 leading-7 text-sm mt-4">
          {product.description
            ? `${product.description.slice(0, 70)}...`
            : "Premium quality authentic Indian spice with rich aroma."}
        </p>

        {/* PRICE */}
        <div className="flex items-center justify-between mt-6">
          <div>
            <span className="text-2xl font-bold text-primary">
              ₹{product.price}
            </span>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={() => addToCart(product)}
            className="bg-primary hover:bg-secondary text-white p-4 rounded-2xl transition duration-300 shadow-lg hover:scale-105"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
