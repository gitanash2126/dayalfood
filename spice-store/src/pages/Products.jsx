import { useEffect, useState } from "react";

import {
  SlidersHorizontal,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ProductCard from "../components/products/ProductCard";

import API from "../api/axios";

import { groupProducts } from "../utils/productHelpers";

export default function Products() {
  // MOBILE FILTER
  const [mobileFilters, setMobileFilters] = useState(false);

  // PRODUCTS
  const [products, setProducts] = useState([]);

  // LOADING
  const [loading, setLoading] = useState(true);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  // FILTER STATES
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("");

  const [maxPrice, setMaxPrice] = useState(5000);

  // CATEGORIES
  const categories = [
    "All",

    "Whole Spices",

    "Ground Spices",

    "Masala Blends",

    "Seeds",
  ];

  // FETCH PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, sortBy, maxPrice]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = `/products?page=${currentPage}&limit=9`;

      // SEARCH
      if (searchTerm.trim()) {
        url += `&keyword=${searchTerm}`;
      }

      // CATEGORY
      if (selectedCategory !== "All") {
        url += `&category=${selectedCategory}`;
      }

      // SORT
      if (sortBy) {
        url += `&sort=${sortBy}`;
      }

      // PRICE
      url += `&maxPrice=${maxPrice}`;

      const { data } = await API.get(url);

      console.log("Products API:", data);

      const responseData = data.data;

      setProducts(groupProducts(responseData.products || []));

      setTotalPages(responseData.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // SEARCH HANDLER
  const handleSearch = () => {
    setCurrentPage(1);

    fetchProducts();
  };



  return (
    <div className="bg-[#fffdf8] min-h-screen">
      {/* HERO */}
      <section className="bg-[#fff8f1] border-b border-orange-100">
        <div className="container-custom py-16">
          <div className="text-center">
            <p className="text-primary font-semibold">Premium Collection</p>

            <h1 className="font-heading text-5xl lg:text-6xl text-dark mt-4">
              Our Products
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto mt-6 leading-8">
              Explore premium Indian spices, masalas and authentic flavors.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex gap-10">
            {/* SIDEBAR */}
            <div className="hidden lg:block w-[300px] shrink-0">
              <div className="bg-white rounded-[32px] border border-orange-100 p-7 sticky top-28 shadow-lg">
                <h2 className="text-2xl font-semibold text-dark mb-8">
                  Filters
                </h2>

                {/* SEARCH */}
                <div className="mb-8">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSearch}
                    className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-2xl mt-4 font-semibold transition"
                  >
                    Search
                  </button>
                </div>

                {/* CATEGORY */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-5">Categories</h3>

                  <div className="space-y-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);

                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-5 py-3 rounded-2xl transition font-medium ${
                          selectedCategory === category
                            ? "bg-primary text-white shadow-lg"
                            : "bg-[#fff8f1] hover:bg-orange-100 text-dark"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PRICE */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-5">Max Price</h3>

                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full"
                  />

                  <p className="mt-3 font-semibold text-primary text-lg">
                    ₹{maxPrice}
                  </p>
                </div>

                {/* SORT */}
                <div>
                  <h3 className="font-semibold text-lg mb-5">Sort By</h3>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none"
                  >
                    <option value="">Default</option>

                    <option value="price-low">Price Low to High</option>

                    <option value="price-high">Price High to Low</option>

                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1">
              {/* TOPBAR */}
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-semibold text-dark">
                    {products.length} Products
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Premium Indian spices & masalas
                  </p>
                </div>

                {/* MOBILE FILTER */}
                <button
                  onClick={() => setMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl shadow-lg"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
              </div>

              {/* GRID */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                  <div className="col-span-full py-20 flex justify-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <h2 className="text-4xl font-bold text-dark">
                      No Products Found
                    </h2>

                    <p className="text-gray-500 mt-4">
                      Try changing filters or search
                    </p>
                  </div>
                )}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center items-center gap-4 mt-16">
                {/* PREV */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="bg-white border border-orange-100 hover:bg-primary hover:text-white w-14 h-14 rounded-2xl flex items-center justify-center transition disabled:opacity-50"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* PAGE */}
                <div className="bg-primary text-white px-8 py-4 rounded-2xl font-semibold shadow-lg">
                  Page {currentPage} of {totalPages}
                </div>

                {/* NEXT */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="bg-white border border-orange-100 hover:bg-primary hover:text-white w-14 h-14 rounded-2xl flex items-center justify-center transition disabled:opacity-50"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE FILTER DRAWER */}
      <div
        className={`fixed inset-0 z-[100] transition ${
          mobileFilters ? "visible" : "invisible"
        }`}
      >
        {/* OVERLAY */}
        <div
          onClick={() => setMobileFilters(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            mobileFilters ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* DRAWER */}
        <div
          className={`absolute left-0 top-0 h-full w-[320px] bg-white shadow-2xl transition-transform duration-300 ${
            mobileFilters ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b border-orange-100">
            <h2 className="text-2xl font-semibold">Filters</h2>

            <button
              onClick={() => setMobileFilters(false)}
              className="bg-[#fff8f1] p-3 rounded-xl"
            >
              <X size={22} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);

                  setMobileFilters(false);
                }}
                className={`w-full text-left px-5 py-3 rounded-2xl mb-3 ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-[#fff8f1]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
