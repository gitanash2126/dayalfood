import { useState, useEffect } from "react";

import { SlidersHorizontal, X, Search } from "lucide-react";

import ProductCard from "../components/products/ProductCard";

import API from "../api/axios";

export default function Products() {
  // MOBILE FILTER
  const [mobileFilters, setMobileFilters] = useState(false);

  // PRODUCTS
  const [products, setProducts] = useState([]);

  // LOADING
  const [loading, setLoading] = useState(true);

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
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");

      console.log("Products API:", data);

      setProducts(data.products || data.data?.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // FILTER PRODUCTS
  let filteredProducts = products.filter((product) => {
    // CATEGORY
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;

    // SEARCH
    const searchMatch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // PRICE
    const priceMatch = product.price <= maxPrice;

    return categoryMatch && searchMatch && priceMatch;
  });

  // SORTING
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold">
        Loading Products...
      </div>
    );
  }

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
              Explore our premium collection of authentic Indian spices and
              masalas.
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
              <div className="bg-white rounded-[32px] border border-orange-100 p-7 sticky top-28">
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
                </div>

                {/* CATEGORY */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-5">Categories</h3>

                  <div className="space-y-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
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

                  <p className="mt-3 font-semibold text-primary">₹{maxPrice}</p>
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
                    Showing {filteredProducts.length} Products
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
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
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
