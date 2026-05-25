import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../utils/baseURL";

import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from "lucide-react";

import { useState, useEffect } from "react";

import ProductCard from "../components/products/ProductCard";

import { useCart } from "../context/CartContext";

import API from "../api/axios";

export default function ProductDetails() {
  const { slug } = useParams();

  const navigate = useNavigate();

  // CART
  const { addToCart } = useCart();

  // STATES
  const [product, setProduct] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  // ==========================================
  // FETCH PRODUCT
  // ==========================================
  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      // PRODUCT DETAILS
      const { data } = await API.get(`/products/${slug}`);

      console.log("PRODUCT DETAILS:", data);

      const productData = data.data || data.product || data.data?.product;

      setProduct(productData);

      // REVIEWS
      const reviewsRes = await API.get(`/products/${productData._id}/reviews`);

      setReviews(reviewsRes.data.data?.reviews || []);

      // RELATED PRODUCTS
      const relatedRes = await API.get(
        `/products?category=${productData.category}&limit=4`,
      );

      const related = relatedRes.data.data?.products || [];

      const filtered = related.filter((item) => item._id !== productData._id);

      setRelatedProducts(filtered);
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
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf8]">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-6 text-2xl font-semibold">Loading Product...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf8]">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary">Product Not Found</h1>

          <p className="text-gray-500 mt-4">Product does not exist.</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // IMAGE URL
  // ==========================================
  const imageUrl = product.image?.startsWith("/uploads")
    ? `${BASE_URL}${product.image}`
    : product.image;

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
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-[320px] sm:h-[420px] lg:h-[550px] object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="overflow-hidden">
              {/* CATEGORY */}
              <p className="text-primary font-semibold uppercase tracking-wide text-sm sm:text-base">
                {product.category}
              </p>

              {/* NAME */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-dark mt-3 leading-tight break-words">
                {product.name}
              </h1>

              {/* RATING */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <div className="flex items-center gap-1">
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
                </div>

                <span className="text-gray-500 text-base sm:text-lg">
                  ({product.numReviews} Reviews)
                </span>
              </div>

              {/* PRICE */}
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <span className="text-4xl sm:text-5xl font-bold text-primary">
                  ₹{product.price}
                </span>

                {product.mrp && (
                  <span className="text-xl sm:text-2xl text-gray-400 line-through">
                    ₹{product.mrp}
                  </span>
                )}
              </div>

              {/* DISCOUNT */}
              {product.mrp && product.price && (
                <div className="mt-5">
                  <span className="bg-red-100 text-red-600 px-5 py-2 rounded-full text-sm font-semibold">
                    {Math.round(
                      ((product.mrp - product.price) / product.mrp) * 100,
                    )}
                    % OFF
                  </span>
                </div>
              )}

              {/* STOCK */}
              <div className="mt-6">
                {product.stock > 0 ? (
                  <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-5 py-2 rounded-full text-sm font-semibold">
                    Out Of Stock
                  </span>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="mt-10">
                <h3 className="font-semibold text-2xl">Description</h3>

                <p className="text-gray-600 leading-8 mt-5 text-base sm:text-lg break-words">
                  {product.description}
                </p>
              </div>

              {/* QUANTITY */}
              <div className="mt-10">
                <h3 className="font-semibold text-2xl mb-5">Quantity</h3>

                <div className="flex items-center gap-5">
                  <div className="flex items-center border border-orange-100 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="px-5 py-4 hover:bg-orange-50"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="px-7 font-semibold text-lg">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        quantity < product.stock && setQuantity(quantity + 1)
                      }
                      className="px-5 py-4 hover:bg-orange-50"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-5 mt-12">
                {/* ADD TO CART */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center gap-3 bg-primary hover:bg-secondary disabled:opacity-50 text-white px-10 py-5 rounded-2xl font-semibold transition shadow-xl w-full sm:w-auto"
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
                  disabled={product.stock === 0}
                  className="border border-orange-200 hover:border-primary hover:text-primary px-10 py-5 rounded-2xl font-semibold transition w-full sm:w-auto"
                >
                  Buy Now
                </button>
              </div>

              {/* FEATURES */}
              <div className="grid sm:grid-cols-2 gap-5 mt-14">
                {/* PURE */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 flex gap-4">
                  <div className="bg-[#fff8f1] p-4 rounded-2xl">
                    <ShieldCheck className="text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">100% Pure</h3>

                    <p className="text-gray-500 mt-2 text-sm leading-6">
                      Premium authentic Indian spices.
                    </p>
                  </div>
                </div>

                {/* DELIVERY */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 flex gap-4">
                  <div className="bg-[#fff8f1] p-4 rounded-2xl">
                    <Truck className="text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Fast Delivery</h3>

                    <p className="text-gray-500 mt-2 text-sm leading-6">
                      Secure shipping across India.
                    </p>
                  </div>
                </div>

                {/* QUALITY */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 flex gap-4">
                  <div className="bg-[#fff8f1] p-4 rounded-2xl">
                    <BadgeCheck className="text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Premium Quality</h3>

                    <p className="text-gray-500 mt-2 text-sm leading-6">
                      Hygienically packed premium spices.
                    </p>
                  </div>
                </div>

                {/* SECURE */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 flex gap-4">
                  <div className="bg-[#fff8f1] p-4 rounded-2xl">
                    <ShieldCheck className="text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Secure Shopping</h3>

                    <p className="text-gray-500 mt-2 text-sm leading-6">
                      Trusted ecommerce experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REVIEWS */}
          <div className="mt-24">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-dark mb-12">
              Customer Reviews
            </h2>

            <div className="grid gap-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-3xl border border-orange-100 p-8"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-xl">{review.name}</h3>

                        <div className="flex items-center gap-1 mt-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              className={`${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-8 mt-5">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-3xl border border-orange-100 p-10 text-center">
                  <h3 className="text-3xl font-bold">No Reviews Yet</h3>

                  <p className="text-gray-500 mt-4">
                    Be the first to review this product.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RELATED PRODUCTS */}
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
        </div>
      </section>
    </div>
  );
}
