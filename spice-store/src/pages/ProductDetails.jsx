import { useParams, useNavigate } from "react-router-dom";

import {
  Star,
  ShoppingCart,
  Heart,
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

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  // FETCH PRODUCT
  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${slug}`);

      console.log("Product Details:", data);

      const productData = data.product || data.data?.product || data.data;

      setProduct(productData);

      // RELATED PRODUCTS
      const related = await API.get("/products");

      const relatedData =
        related.data.products || related.data.data?.products || [];

      const filtered = relatedData
        .filter(
          (item) =>
            (typeof item.category === "object"
              ? item.category?.name
              : item.category) ===
              (typeof productData.category === "object"
                ? productData.category?.name
                : productData.category) && item._id !== productData._id,
        )
        .slice(0, 4);

      setRelatedProducts(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading...
      </div>
    );
  }

  // NOT FOUND
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf8]">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary">Product Not Found</h1>

          <p className="text-gray-500 mt-4">This product does not exist.</p>
        </div>
      </div>
    );
  }

  // ADD TO CART
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="bg-[#fffdf8]">
      {/* PRODUCT SECTION */}
      <section className="py-14 lg:py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* IMAGE */}
            <div className="sticky top-28">
              <div className="bg-white rounded-[36px] overflow-hidden border border-orange-100 shadow-xl">
                <img
                  src={
                    product.image
                      ? `http://localhost:5000${product.image}`
                      : "/images/default-product.jpg"
                  }
                  alt={product.name}
                  className="w-full h-[520px] object-cover"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div>
              {/* CATEGORY */}
              <p className="text-primary font-semibold uppercase tracking-wide">
                {typeof product.category === "object"
                  ? product.category?.name
                  : product.category}
              </p>

              {/* TITLE */}
              <h1 className="font-heading text-5xl text-dark mt-3 leading-tight">
                {product.name}
              </h1>

              {/* RATING */}
              <div className="flex items-center gap-3 mt-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <span className="text-gray-500">
                  ({product.numReviews || 0} Reviews)
                </span>
              </div>

              {/* PRICE */}
              <div className="flex items-center gap-4 mt-8">
                <span className="text-5xl font-bold text-primary">
                  ₹{product.price}
                </span>

                {product.mrp && (
                  <span className="text-2xl text-gray-400 line-through">
                    ₹{product.mrp}
                  </span>
                )}
              </div>

              {/* DISCOUNT */}
              {product.mrp && product.price && (
                <div className="mt-4">
                  <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
                    {Math.round(
                      ((product.mrp - product.price) / product.mrp) * 100,
                    )}
                    % OFF
                  </span>
                </div>
              )}

              {/* STOCK */}
              <div className="mt-5">
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

              {/* WEIGHT */}
              <div className="mt-8">
                <p className="font-semibold text-lg text-dark">Weight</p>

                <div className="mt-4 inline-flex items-center bg-[#fff8f1] border border-orange-100 px-6 py-3 rounded-2xl">
                  {product.weight || "500g"}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-8">
                <p className="font-semibold text-lg text-dark">Description</p>

                <p className="text-gray-600 leading-8 mt-4">
                  {product.description}
                </p>
              </div>

              {/* QUANTITY */}
              <div className="mt-10">
                <p className="font-semibold text-lg text-dark mb-4">Quantity</p>

                <div className="flex items-center gap-4">
                  {/* QUANTITY BOX */}
                  <div className="flex items-center border border-orange-100 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="px-5 py-4 hover:bg-orange-50 transition"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="px-6 font-semibold">{quantity}</span>

                    <button
                      onClick={() =>
                        quantity < product.stock && setQuantity(quantity + 1)
                      }
                      className="px-5 py-4 hover:bg-orange-50 transition"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* WISHLIST */}
                  <button className="border border-orange-100 hover:border-primary hover:text-primary p-4 rounded-2xl transition">
                    <Heart size={22} />
                  </button>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-5 mt-10">
                {/* ADD TO CART */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex items-center gap-3 bg-primary hover:bg-secondary disabled:opacity-50 text-white px-10 py-5 rounded-2xl font-semibold transition shadow-xl hover:scale-105"
                >
                  <ShoppingCart size={22} />
                  Add To Cart
                </button>

                {/* BUY NOW */}
                <button
                  onClick={() => {
                    addToCart(product);

                    navigate("/checkout");
                  }}
                  disabled={product.stock === 0}
                  className="border border-orange-200 hover:border-primary hover:text-primary disabled:opacity-50 px-10 py-5 rounded-2xl font-semibold transition"
                >
                  Buy Now
                </button>
              </div>

              {/* FEATURES */}
              <div className="grid sm:grid-cols-2 gap-5 mt-14">
                {/* PURE */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 flex items-start gap-4">
                  <div className="bg-[#fff8f1] p-4 rounded-2xl">
                    <ShieldCheck size={28} className="text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">100% Pure</h3>

                    <p className="text-gray-500 mt-2 text-sm leading-6">
                      Premium quality authentic Indian spices.
                    </p>
                  </div>
                </div>

                {/* DELIVERY */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 flex items-start gap-4">
                  <div className="bg-[#fff8f1] p-4 rounded-2xl">
                    <Truck size={28} className="text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Fast Delivery</h3>

                    <p className="text-gray-500 mt-2 text-sm leading-6">
                      Secure shipping across India.
                    </p>
                  </div>
                </div>

                {/* QUALITY */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 flex items-start gap-4">
                  <div className="bg-[#fff8f1] p-4 rounded-2xl">
                    <BadgeCheck size={28} className="text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Premium Quality</h3>

                    <p className="text-gray-500 mt-2 text-sm leading-6">
                      Carefully selected & hygienically packed.
                    </p>
                  </div>
                </div>

                {/* SUPPORT */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 flex items-start gap-4">
                  <div className="bg-[#fff8f1] p-4 rounded-2xl">
                    <ShieldCheck size={28} className="text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Secure Shopping</h3>

                    <p className="text-gray-500 mt-2 text-sm leading-6">
                      Safe & trusted ecommerce experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          <div className="mt-24">
            <div className="mb-12">
              <p className="text-primary font-semibold">More Products</p>

              <h2 className="font-heading text-5xl text-dark mt-3">
                Related Products
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id || item.id} product={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
