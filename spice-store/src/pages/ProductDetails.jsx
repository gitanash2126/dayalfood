import { useParams, useNavigate } from "react-router-dom";

import { Star, ShoppingCart, Minus, Plus } from "lucide-react";

import { useState, useEffect } from "react";

import ProductCard from "../components/products/ProductCard";

import { useCart } from "../context/CartContext";

import API from "../api/axios";

import { getProductImage } from "../utils/productImages";

import { getProductBaseName } from "../utils/productHelpers";

export default function ProductDetails() {
  const { slug } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  // ==========================================
  // STATES
  // ==========================================
  const [product, setProduct] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [variants, setVariants] = useState([]);
  
  const [selectedVariant, setSelectedVariant] = useState(null);

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
      const cacheKey = `product_${slug}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setProduct(parsed.product);
        setVariants(parsed.variants);
        setRelatedProducts(parsed.relatedProducts);
        setLoading(false);
      } else {
        setLoading(true);
      }

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

      // RELATED PRODUCTS & VARIANTS
      try {
        const relatedRes = await API.get(`/products`);

        const allProducts = relatedRes.data.data?.products || relatedRes.data.products || [];

        const baseName = getProductBaseName(productData.name, productData.weight);

        // Use groupProducts to get properly structured variants from both old and new schema
        const { groupProducts } = await import("../utils/productHelpers");
        const groupedAll = groupProducts(allProducts);
        
        // Find the group that matches the current product baseName
        const matchedGroup = groupedAll.find(g => g.baseName === baseName);

        let finalVariants = [];
        if (matchedGroup && matchedGroup.variants) {
          finalVariants = matchedGroup.variants;
          setVariants(finalVariants);
        } else {
          setVariants([]);
        }

        // Filter out variants from related products
        const filteredRelated = allProducts.filter(
          (item) => getProductBaseName(item.name, item.weight) !== baseName
        );

        const finalRelated = filteredRelated.slice(0, 4);
        setRelatedProducts(finalRelated);

        sessionStorage.setItem(cacheKey, JSON.stringify({
          product: productData,
          variants: finalVariants,
          relatedProducts: finalRelated
        }));
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (variants.length > 0) {
      // Find the variant that matches the currently fetched product, or fallback to first
      const current = variants.find((v) => v._id === product?._id) || variants[0];
      setSelectedVariant(current);
    }
  }, [variants, product]);

  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf8]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
  const imageUrl = getProductImage(productName, product?.imageUrl || product?.image);

  // ==========================================
  // ADD TO CART
  // ==========================================
  const handleAddToCart = () => {
    const toAdd = selectedVariant?.productObj || {
      ...product,
      _id: selectedVariant?._id || product._id,
      price: selectedVariant?.price || product.price,
      sale_price: selectedVariant?.sale_price || product.sale_price || selectedVariant?.price || product.price,
      weight: selectedVariant?.weight || product.weight,
      stock: selectedVariant?.stock || product.stock,
    };
    
    addToCart({
      ...toAdd,
      quantity,
    });
  };

  return (
    <div className="bg-[#fffdf8] overflow-hidden">
      {/* PRODUCT */}
      <section className="py-6 sm:py-10 lg:py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* IMAGE */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="bg-white rounded-[28px] lg:rounded-[36px] overflow-hidden border border-orange-100 shadow-xl">
                <img
                  src={imageUrl}
                  alt={product?.name}
                  loading="lazy"
                  className="w-full h-[250px] sm:h-[350px] lg:h-[450px] object-cover hover:scale-105 transition duration-500"
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
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-dark mt-2 leading-tight">
                {product.name} {product.hindiName && <span className="text-xl sm:text-2xl text-gray-500 font-normal ml-2">({product.hindiName})</span>}
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
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  ₹{selectedVariant?.sale_price || selectedVariant?.price || product.price}
                </span>
                {variants.length === 1 && (
                  <span className="text-gray-500 text-lg">
                    ({selectedVariant?.weight || product.weight})
                  </span>
                )}
              </div>

              {/* SELECT QUANTITY / WEIGHT VARIANTS */}
              {variants.length > 1 && (
                <div className="mt-6 bg-orange-50/20 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-orange-100/50">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Select Pack Size</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {variants.map((v) => {
                      const isActive = selectedVariant?._id === v._id;
                      return (
                        <button
                          key={v._id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-4 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 border flex flex-col items-center min-w-[80px] sm:min-w-[100px] shadow-sm hover:shadow-md ${
                            isActive
                              ? "bg-gradient-to-br from-primary to-secondary text-white border-primary shadow-lg scale-105"
                              : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                          }`}
                        >
                          <span className="text-base">{v.weight}</span>
                          <span className={`text-xs mt-1.5 font-semibold ${isActive ? "text-orange-100" : "text-gray-400"}`}>
                            ₹{v.sale_price || v.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STOCK */}
              <div className="mt-5">
                {selectedVariant?.stock > 0 || (!selectedVariant && product.stock > 0) ? (
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
              <div className="mt-8">
                <div className="flex items-center border border-orange-100 rounded-xl sm:rounded-2xl overflow-hidden w-fit">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="px-4 py-3 sm:px-5 sm:py-4 hover:bg-orange-50"
                  >
                    <Minus size={16} className="sm:w-[18px]" />
                  </button>

                  <span className="px-5 sm:px-7 font-semibold text-base sm:text-lg">{quantity}</span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 sm:px-5 sm:py-4 hover:bg-orange-50"
                  >
                    <Plus size={16} className="sm:w-[18px]" />
                  </button>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-8">
                {/* ADD TO CART */}
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 sm:gap-3 bg-primary hover:bg-secondary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition shadow-md sm:shadow-xl text-sm sm:text-base"
                >
                  <ShoppingCart size={20} />
                  Add To Cart
                </button>

                {/* BUY NOW */}
                <button
                  onClick={() => {
                    handleAddToCart();

                    navigate("/checkout");
                  }}
                  className="border border-orange-200 hover:border-primary hover:text-primary px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition text-sm sm:text-base"
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

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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
