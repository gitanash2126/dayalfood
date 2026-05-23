import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

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
    <div className="container-custom py-16">
      {/* HEADING */}
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-primary/10 p-4 rounded-2xl">
          <ShoppingBag className="text-primary" />
        </div>

        <div>
          <h1 className="font-heading text-5xl">Shopping Cart</h1>

          <p className="text-gray-500 mt-2">Manage your selected products</p>
        </div>
      </div>

      {/* EMPTY CART */}
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-[32px] shadow-xl p-16 text-center">
          <h2 className="text-3xl font-semibold">Your cart is empty</h2>

          <p className="text-gray-500 mt-4">
            Add products to continue shopping
          </p>

          <button
            onClick={() => navigate("/products")}
            className="inline-block mt-8 bg-primary hover:bg-secondary text-white px-8 py-4 rounded-2xl font-semibold transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const itemId = item._id || item.id;

              const itemPrice = Number(item.sale_price || item.price || 0) || 0;

              return (
                <div
                  key={itemId}
                  className="bg-white rounded-[32px] shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center"
                >
                  {/* IMAGE */}
                  <img
                    src={
                      item.image ||
                      item.images?.[0] ||
                      "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    alt={item.name}
                    className="w-36 h-36 object-cover rounded-2xl bg-[#fff8f1]"
                  />

                  {/* DETAILS */}
                  <div className="flex-1 w-full">
                    <h2 className="text-2xl font-semibold">{item.name}</h2>

                    <p className="text-gray-500 mt-2">
                      {item.weight || item.category || "Premium Spice"}
                    </p>

                    {/* QUANTITY */}
                    <div className="mt-4 flex items-center gap-3">
                      {/* DECREASE */}
                      <button
                        onClick={() => decreaseQuantity(itemId)}
                        className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center hover:bg-primary hover:text-white transition"
                      >
                        <Minus size={18} />
                      </button>

                      {/* QTY */}
                      <span className="text-xl font-semibold">
                        {item.quantity}
                      </span>

                      {/* INCREASE */}
                      <button
                        onClick={() => increaseQuantity(itemId)}
                        className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center hover:bg-primary hover:text-white transition"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* PRICE + REMOVE */}
                  <div className="flex flex-col items-end gap-6">
                    <h3 className="text-3xl font-bold text-primary">
                      ₹{(itemPrice * item.quantity).toFixed(0)}
                    </h3>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeFromCart(itemId)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl h-fit sticky top-24">
            <h2 className="text-3xl font-semibold">Order Summary</h2>

            <div className="mt-8 space-y-5">
              {/* SUBTOTAL */}
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>

                <span>₹{Number(cartTotal || 0).toFixed(0)}</span>
              </div>

              {/* SHIPPING */}
              <div className="flex justify-between text-lg">
                <span>Shipping</span>

                <span className="text-green-600">Free</span>
              </div>

              <hr />

              {/* TOTAL */}
              <div className="flex justify-between font-bold text-2xl">
                <span>Total</span>

                <span className="text-primary">
                  ₹{Number(cartTotal || 0).toFixed(0)}
                </span>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-primary hover:bg-secondary text-white py-4 rounded-2xl text-lg font-semibold transition shadow-lg"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
