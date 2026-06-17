import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productImages, getProductImage } from "../utils/productImages";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();


  return (
    <div className="bg-[#fffdf8] min-h-screen py-16 font-body">
      <div className="container-custom">
        {/* HEADING */}
        <div className="flex items-center gap-5 mb-12 border-b border-orange-100/60 pb-8">
          <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl shadow-lg shadow-primary/20">
            <ShoppingBag className="text-white" size={32} />
          </div>
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-dark">Your Cart</h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base tracking-wide">Review and manage your selected spices</p>
          </div>
        </div>

        {/* EMPTY CART */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[40px] shadow-2xl shadow-orange-100/50 p-16 text-center border border-orange-50 max-w-2xl mx-auto mt-10">
            <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={48} className="text-primary/50" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-dark">Your cart is feeling light</h2>
            <p className="text-gray-500 mt-4 text-lg">
              Add some premium spices to continue your culinary journey.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 mt-10 bg-primary hover:bg-secondary text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-primary/30"
            >
              Explore Collection <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            {/* CART ITEMS LIST */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => {
                const itemId = item._id || item.id;
                const itemPrice = Number(item.sale_price || item.price || 0) || 0;
                const finalImage = getProductImage(item.name, item.image || item.images?.[0]);

                return (
                  <div
                    key={itemId}
                    className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 flex flex-col sm:flex-row gap-6 items-center transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:border-orange-100 group"
                  >
                    {/* IMAGE */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#fff8f1] shrink-0">
                      <img
                        src={finalImage}
                        alt={item.name}
                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "/images/no-image.png";
                        }}
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 w-full flex flex-col justify-between py-2">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                              {item.category || "Premium Spice"}
                            </p>
                            <h2 className="text-xl sm:text-2xl font-bold text-dark font-heading leading-tight group-hover:text-primary transition-colors">
                              {item.name} {item.hindiName && <span className="text-lg font-medium text-gray-500">({item.hindiName})</span>}
                            </h2>
                            <p className="text-gray-500 mt-1 text-sm font-medium bg-gray-50 inline-block px-3 py-1 rounded-lg">
                              Pack: {item.weight || "Standard"}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(itemId)}
                            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all duration-300 -mr-2 -mt-2"
                            title="Remove from cart"
                          >
                            <Trash2 size={22} />
                          </button>
                        </div>
                      </div>

                      {/* QUANTITY & PRICE */}
                      <div className="flex flex-wrap items-end justify-between gap-6 mt-6">
                        {/* QUANTITY CONTROL */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-2xl p-1 border border-gray-100">
                          <button
                            onClick={() => decreaseQuantity(itemId)}
                            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 shadow-sm"
                          >
                            <Minus size={16} strokeWidth={2.5} />
                          </button>
                          <span className="w-12 text-center text-lg font-bold text-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(itemId)}
                            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 shadow-sm"
                          >
                            <Plus size={16} strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* PRICE */}
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-medium mb-1">
                            {item.quantity} × ₹{itemPrice}
                          </p>
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">
                            ₹{(itemPrice * item.quantity).toFixed(0)}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="bg-white rounded-[40px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
                
                <h2 className="text-2xl font-bold font-heading text-dark mb-8">Order Summary</h2>

                <div className="space-y-6">
                  {/* SUBTOTAL */}
                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span className="text-dark font-bold text-lg">₹{Number(cartTotal || 0).toFixed(0)}</span>
                  </div>

                  {/* SHIPPING */}
                  <div className="flex justify-between items-center text-gray-600 font-medium">
                    <span>Shipping Estimate</span>
                    <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">Free Delivery</span>
                  </div>

                  <div className="w-full h-px bg-gray-100 my-2"></div>

                  {/* TOTAL */}
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-dark">Total Amount</span>
                    <span className="text-4xl font-black text-primary tracking-tight">
                      ₹{Number(cartTotal || 0).toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* CHECKOUT BUTTON */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-10 bg-primary hover:bg-secondary text-white py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(217,119,6,0.3)] hover:shadow-[0_15px_40px_rgba(217,119,6,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>

                <p className="text-center text-xs text-gray-400 font-medium mt-6 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Secure 256-bit SSL checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
