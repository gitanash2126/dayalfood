import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

export default function CartSidebar({ isOpen, setIsOpen }) {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
  } = useCart();

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] transition duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-white z-[999] shadow-2xl transition duration-500 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100">
          <div>
            <h2 className="text-2xl font-bold text-dark">Shopping Cart</h2>

            <p className="text-gray-500 text-sm mt-1">
              {cartItems.length} Items
            </p>
          </div>

          {/* CLOSE */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-11 h-11 rounded-full border border-orange-100 flex items-center justify-center hover:bg-primary hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 rounded-full bg-[#fff8f1] flex items-center justify-center mb-6">
                <ShoppingBag size={40} className="text-primary" />
              </div>

              <h3 className="text-2xl font-semibold text-dark">
                Your Cart is Empty
              </h3>

              <p className="text-gray-500 mt-3 leading-7 max-w-[250px]">
                Add premium spices and masalas to start shopping.
              </p>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-8 bg-primary hover:bg-secondary text-white px-8 py-4 rounded-2xl font-semibold transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-[#fffdf8] border border-orange-100 rounded-3xl p-4"
              >
                {/* IMAGE */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  {/* TITLE */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-lg leading-6 text-dark">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.weight}
                      </p>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* PRICE */}
                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <p className="text-primary text-xl font-bold">
                        ₹{item.sale_price}
                      </p>
                    </div>

                    {/* QUANTITY */}
                    <div className="flex items-center border border-orange-100 rounded-2xl overflow-hidden">
                      {/* MINUS */}
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-orange-50 transition"
                      >
                        <Minus size={16} />
                      </button>

                      {/* QTY */}
                      <span className="w-10 text-center font-semibold">
                        {item.quantity}
                      </span>

                      {/* PLUS */}
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-orange-50 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {cartItems.length > 0 && (
          <div className="border-t border-orange-100 p-6 bg-white">
            {/* SUBTOTAL */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500">Subtotal</span>

              <span className="font-semibold text-dark">₹{totalPrice}</span>
            </div>

            {/* SHIPPING */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-500">Shipping</span>

              <span className="font-semibold text-green-600">Free</span>
            </div>

            {/* TOTAL */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-bold text-dark">Total</span>

              <span className="text-3xl font-bold text-primary">
                ₹{totalPrice}
              </span>
            </div>

            {/* BUTTONS */}
            <div className="space-y-4">
              {/* CHECKOUT */}
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-2xl font-semibold transition flex items-center justify-center shadow-lg"
              >
                Proceed To Checkout
              </Link>

              {/* CONTINUE */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full border border-orange-100 hover:border-primary hover:text-primary py-4 rounded-2xl font-semibold transition"
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
