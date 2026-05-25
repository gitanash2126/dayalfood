import { useParams, useNavigate } from "react-router-dom";

import { Star, ShoppingCart, Minus, Plus } from "lucide-react";

import { useState, useEffect } from "react";

import ProductCard from "../components/products/ProductCard";

import { useCart } from "../context/CartContext";

import API from "../api/axios";

import productImages from "../utils/productImages";

export default function ProductDetails() {
  const { slug } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  // ==========================================
  // STATES
  // ==========================================
  const [product, setProduct] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  // ==========================================
  // FETCH PRODUCT
  // ==========================================
  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/products/${slug}`);

      const productData =
        response.data.data ||
        response.data.product ||
        response.data.data?.product;

      if (!productData) {
        setLoading(false);

        return;
      }

      setProduct(productData);

      // RELATED PRODUCTS
      try {
        const relatedRes = await API.get(`/products`);

        const related = relatedRes.data.data?.products || [];

        const filtered = related.filter((item) => item._id !== productData._id);

        setRelatedProducts(filtered.slice(0, 4));
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );
  }

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold text-primary">Product Not Found</h2>
      </div>
    );
  }

  // ==========================================
  // PRODUCT IMAGE MATCHING
  // ==========================================
  const productName = product?.name?.toLowerCase()?.trim() || "";

  let imageUrl = "/images/no-image.png";

  for (const key in productImages) {
    if (productName.includes(key)) {
      imageUrl = productImages[key];

      break;
    }
  }

  // ==========================================
  // ADD TO CART
  // ==========================================
  const handleAddToCart = () => {
    addToCart({
      ...product,

      quantity,
    });
  };

  return (
    <div className="bg-[#fffdf8] overflow-hidden">
      {/* PRODUCT */}
      <section className="py-10 sm:py-14 lg:py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* IMAGE */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="bg-white rounded-[28px] lg:rounded-[36px] overflow-hidden border border-orange-100 shadow-xl">
                <img
                  src={imageUrl}
                  alt={product?.name}
                  loading="lazy"
                  className="w-full h-[320px] sm:h-[420px] lg:h-[550px] object-cover hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.target.src = "/images/no-image.png";
                  }}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div>
              {/* CATEGORY */}
              <p className="text-primary font-semibold uppercase tracking-wide text-sm">
                {typeof product.category === "object"
                  ? product.category?.name
                  : product.category || "Premium Spice"}
              </p>

              {/* NAME */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-dark mt-3 leading-tight">
                {product.name}
              </h1>

              {/* RATING */}
              <div className="flex items-center gap-2 mt-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={`${
                      star <= Math.round(product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}

                <span className="text-gray-500 ml-2">
                  ({product.numReviews || 0})
                </span>
              </div>

              {/* PRICE */}
              <div className="mt-8">
                <span className="text-4xl font-bold text-primary">
                  ₹{product.price}
                </span>
              </div>

              {/* STOCK */}
              <div className="mt-5">
                {product.stock > 0 ? (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                    Out Of Stock
                  </span>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="mt-8">
                <h3 className="text-2xl font-semibold">Description</h3>

                <p className="text-gray-600 leading-8 mt-4">
                  {product.description}
                </p>
              </div>

              {/* QUANTITY */}
              <div className="mt-10">
                <div className="flex items-center border border-orange-100 rounded-2xl overflow-hidden w-fit">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="px-5 py-4 hover:bg-orange-50"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="px-7 font-semibold text-lg">{quantity}</span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-4 hover:bg-orange-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-5 mt-12">
                {/* ADD TO CART */}
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-3 bg-primary hover:bg-secondary text-white px-10 py-5 rounded-2xl font-semibold transition shadow-xl"
                >
                  <ShoppingCart size={22} />
                  Add To Cart
                </button>

                {/* BUY NOW */}
                <button
                  onClick={() => {
                    handleAddToCart();

                    navigate("/checkout");
                  }}
                  className="border border-orange-200 hover:border-primary hover:text-primary px-10 py-5 rounded-2xl font-semibold transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <div className="mb-12">
                <p className="text-primary font-semibold">More Products</p>

                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-dark mt-3">
                  Related Products
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
