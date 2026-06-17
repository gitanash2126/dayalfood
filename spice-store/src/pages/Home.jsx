import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { ShieldCheck, Truck, Leaf, BadgeCheck, ArrowRight } from "lucide-react";

import ProductCard from "../components/products/ProductCard";
import ProductSkeleton from "../components/products/ProductSkeleton";

import API from "../api/axios";

import { groupProducts } from "../utils/productHelpers";
import localProducts from "../data/products.js";

import heroImg from "../assets/products/mishritkhadamasala.jpeg";
import offerImg from "../assets/products/badiilaichi.jpeg";
import wholeSpicesImg from "../assets/products/khadamasala.jpeg";
import groundSpicesImg from "../assets/products/haldi.jpeg";
import masalaBlendsImg from "../assets/products/garammasala.jpeg";
import seedsImg from "../assets/products/jeera.jpeg";

// CATEGORIES
const categories = [
  {
    name: "Whole Spices",
    image: wholeSpicesImg,
  },
  {
    name: "Ground Spices",
    image: groundSpicesImg,
  },
  {
    name: "Masala Blends",
    image: masalaBlendsImg,
  },
  {
    name: "Seeds",
    image: seedsImg,
  },
];

export default function Home() {
  const [products, setProducts] = useState(() => {
    const cached = sessionStorage.getItem("homeProducts");
    if (cached) return JSON.parse(cached);
    return groupProducts(localProducts);
  });

  const [loading, setLoading] = useState(false);

  // FETCH PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      const grouped = groupProducts(data.products || data.data?.products || []);
      
      setProducts(grouped);
      sessionStorage.setItem("homeProducts", JSON.stringify(grouped));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="overflow-hidden bg-[#fffdf8]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-orange-100">
        {/* BG */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff8f1] via-[#fffdf8] to-[#fff8f1]" />

        <div className="container-custom relative py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            {/* LEFT */}
            <div>
              {/* BADGE */}
              <div className="inline-flex items-center gap-2 bg-orange-100 text-primary px-5 py-3 rounded-full text-sm font-semibold">
                🌿 100% Pure & Authentic Indian Spices
              </div>

              {/* HEADING */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl leading-tight font-bold text-[#2b1d12] mt-6">
                Bring Real Indian
                <span className="text-primary"> Flavors</span>
                <br />
                To Your Kitchen
              </h1>

              {/* DESC */}
              <p className="mt-5 text-base text-gray-600 leading-relaxed max-w-xl">
                Premium quality masalas and handpicked spices crafted with rich
                aroma, purity and authentic taste for everyday cooking.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-5 mt-10">
                <Link
                  to="/products"
                  className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
                >
                  Shop Now
                  <ArrowRight size={18} />
                </Link>

                <button className="border border-orange-200 hover:border-primary hover:text-primary bg-white px-6 py-3 rounded-xl font-semibold transition text-sm sm:text-base">
                  Explore Collection
                </button>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10">
                <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-orange-100 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-dark">50+</h3>
                  <p className="text-gray-500 mt-1 text-xs sm:text-sm">Premium Spices</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-orange-100 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-dark">10K+</h3>
                  <p className="text-gray-500 mt-1 text-xs sm:text-sm">Happy Customers</p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md border border-orange-100 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-dark">4.9★</h3>
                  <p className="text-gray-500 mt-1 text-xs sm:text-sm">Customer Rating</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              {/* MAIN IMAGE */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-orange-100">
                <img
                  src={heroImg}
                  alt="Indian Spices"
                  className="w-full h-[400px] lg:h-[480px] object-cover hover:scale-105 transition duration-700"
                />
              </div>

              {/* FLOATING CARD */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-3xl shadow-2xl p-6 border border-orange-100">
                <p className="text-sm text-gray-500">Best Selling</p>

                <h4 className="font-semibold text-xl mt-2">
                  Premium Garam Masala
                </h4>

                <div className="flex items-center gap-2 mt-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>

                  <span className="text-sm text-gray-600">Freshly Packed</span>
                </div>
              </div>

              {/* TRUST */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-lg border border-orange-100">
                <p className="text-xs sm:text-sm text-gray-500">Trusted By</p>
                <h4 className="font-bold text-primary text-lg sm:text-xl mt-1">
                  10,000+ Families
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          {/* TOP */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
            <div>
              <p className="text-primary font-semibold">Categories</p>

              <h2 className="font-heading text-5xl mt-3 text-dark">
                Shop By Category
              </h2>
            </div>

            <Link
              to="/products"
              className="text-primary font-semibold text-lg hover:text-secondary transition"
            >
              View All
            </Link>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative h-32 sm:h-40 md:h-48 lg:h-56 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-lg"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                  <h3 className="text-white text-lg sm:text-2xl font-bold">
                    {category.name}
                  </h3>

                  <p className="text-orange-200 mt-1 text-xs sm:text-sm">Premium Collection</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 bg-[#fffdf8]">
        <div className="container-custom">
          {/* TOP */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
            <div>
              <p className="text-primary font-semibold">Best Selling</p>

              <h2 className="font-heading text-5xl text-dark mt-3">
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              className="text-primary font-semibold text-lg hover:text-secondary transition"
            >
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
            {loading ? (
              Array.from({ length: 12 }).map((_, idx) => (
                <ProductSkeleton key={idx} />
              ))
            ) : products.length > 0 ? (
              products
                .slice(0, 16)
                .map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
            ) : (
              <div className="col-span-full text-center text-2xl font-semibold">
                No Products Found
              </div>
            )}
          </div>
        </div>
      </section>

      {/* OFFER BANNER */}
      <section className="py-12 bg-primary overflow-hidden relative">
        {/* BG */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-[500px] h-[500px] bg-white rounded-full absolute -top-40 -left-40"></div>

          <div className="w-[400px] h-[400px] bg-white rounded-full absolute bottom-0 right-0"></div>
        </div>

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* LEFT */}
            <div>
              <p className="text-orange-100 font-semibold text-lg">
                Limited Time Offer
              </p>

              <h2 className="font-heading text-5xl text-white mt-5 leading-tight">
                Get Fresh Indian Spices
                <br />
                Delivered To Your Doorstep
              </h2>

              <p className="text-orange-50 mt-7 text-lg leading-9">
                Experience premium quality masalas with rich aroma, authentic
                flavor and farm-fresh ingredients.
              </p>

              <div className="flex flex-wrap gap-5 mt-10">
                <Link
                  to="/products"
                  className="bg-white text-primary px-8 py-5 rounded-2xl font-semibold hover:scale-105 transition"
                >
                  Shop Now
                </Link>

                <button className="border border-white text-white px-8 py-5 rounded-2xl font-semibold hover:bg-white hover:text-primary transition">
                  Explore More
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <img
                src={offerImg}
                alt="Offer"
                className="rounded-[40px] h-[500px] w-full object-cover shadow-2xl"
              />

              {/* DISCOUNT */}
              <div className="absolute top-6 right-6 bg-white text-primary px-8 py-5 rounded-3xl shadow-xl">
                <p className="text-sm font-medium">Special Discount</p>

                <h3 className="text-5xl font-bold mt-1">30% OFF</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          {/* TOP */}
          <div className="text-center mb-20">
            <p className="text-primary font-semibold">Why Choose Us</p>

            <h2 className="font-heading text-5xl mt-3 text-dark">
              Trusted By Thousands
            </h2>

            <p className="text-gray-600 mt-6 max-w-3xl mx-auto leading-9 text-lg">
              We provide premium quality spices with authentic taste, freshness
              and trusted ingredients sourced directly from the best farms.
            </p>
          </div>

          {/* FEATURES */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* CARD */}
            <div className="bg-[#fff8f1] rounded-[36px] p-8 border border-orange-100 hover:shadow-xl transition">
              <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg">
                <ShieldCheck size={36} className="text-primary" />
              </div>

              <h3 className="text-2xl font-bold mt-8">100% Pure</h3>

              <p className="text-gray-600 mt-4 leading-8">
                Premium quality authentic Indian spices with natural
                ingredients.
              </p>
            </div>

            {/* CARD */}
            <div className="bg-[#fff8f1] rounded-[36px] p-8 border border-orange-100 hover:shadow-xl transition">
              <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg">
                <Truck size={36} className="text-primary" />
              </div>

              <h3 className="text-2xl font-bold mt-8">Fast Delivery</h3>

              <p className="text-gray-600 mt-4 leading-8">
                Quick and secure delivery across India with premium packaging.
              </p>
            </div>

            {/* CARD */}
            <div className="bg-[#fff8f1] rounded-[36px] p-8 border border-orange-100 hover:shadow-xl transition">
              <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg">
                <Leaf size={36} className="text-primary" />
              </div>

              <h3 className="text-2xl font-bold mt-8">Farm Fresh</h3>

              <p className="text-gray-600 mt-4 leading-8">
                Carefully sourced from trusted farms to maintain freshness and
                aroma.
              </p>
            </div>

            {/* CARD */}
            <div className="bg-[#fff8f1] rounded-[36px] p-8 border border-orange-100 hover:shadow-xl transition">
              <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg">
                <BadgeCheck size={36} className="text-primary" />
              </div>

              <h3 className="text-2xl font-bold mt-8">Trusted Quality</h3>

              <p className="text-gray-600 mt-4 leading-8">
                Loved by thousands of customers for authentic taste and quality.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
