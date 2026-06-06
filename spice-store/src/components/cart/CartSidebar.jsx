import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { productImages, getProductImage } from "../../utils/productImages";

export default function CartSidebar({ isOpen, setIsOpen }) {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();


  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[450px] bg-[#fffdf8] z-[999] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100/60 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-dark leading-none">Your Cart</h2>
              <p className="text-primary text-xs font-bold uppercase tracking-wider mt-1.5">
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mb-6 shadow-inner">
                <ShoppingBag size={40} className="text-primary/50" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-dark">
                Your Cart is Empty
              </h3>
              <p className="text-gray-500 mt-2 text-sm max-w-[250px]">
                Add some premium spices to your cart and start cooking.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-8 bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-[0_4px_14px_rgba(217,119,6,0.3)] hover:shadow-[0_6px_20px_rgba(217,119,6,0.4)] hover:-translate-y-0.5"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemId = item._id || item.id;
              const itemPrice = Number(item.sale_price || item.price || 0) || 0;
              const finalImage = getProductImage(item.name, item.image || item.images?.[0]);

              return (
                <div
                  key={itemId}
                  className="flex gap-4 bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl p-3 relative group transition-all duration-300 hover:border-orange-200"
                >
                  {/* IMAGE */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#fff8f1] shrink-0 border border-orange-50/50">
                    <img
                      src={finalImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/images/no-image.png";
                      }}
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 flex flex-col justify-between py-1 pr-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-[15px] leading-tight text-dark line-clamp-2 pr-6">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-1 bg-gray-50 inline-block px-2 py-0.5 rounded-md">
                          {item.weight || "Standard Pack"}
                        </p>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors duration-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* BOTTOM ROW */}
                    <div className="flex items-end justify-between mt-3">
                      {/* QUANTITY */}
                      <div className="flex items-center gap-0.5 bg-gray-50 rounded-xl p-0.5 border border-gray-100">
                        <button
                          onClick={() => decreaseQuantity(itemId)}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 shadow-sm text-dark"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(itemId)}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300 shadow-sm text-dark"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* PRICE */}
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-medium leading-none mb-1">
                          ₹{itemPrice} / pc
                        </p>
                        <p className="text-primary text-lg font-black leading-none">
                          ₹{(itemPrice * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 bg-white p-5 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10 relative">
            <div className="space-y-2.5 mb-5">
              {/* SUBTOTAL */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-bold text-dark">₹{Number(cartTotal || 0).toFixed(0)}</span>
              </div>
              
              {/* SHIPPING */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Shipping</span>
                <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider">Free</span>
              </div>
            </div>

            <div className="h-px w-full bg-gray-100 mb-4"></div>

            {/* TOTAL */}
            <div className="flex items-end justify-between mb-6">
              <span className="text-gray-500 font-bold">Total Amount</span>
              <span className="text-3xl font-black text-primary leading-none">
                ₹{Number(cartTotal || 0).toFixed(0)}
              </span>
            </div>

            {/* BUTTONS */}
            <div className="space-y-3">
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(217,119,6,0.3)] hover:shadow-[0_6px_20px_rgba(217,119,6,0.4)] hover:-translate-y-0.5"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
