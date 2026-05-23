import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import API from "../api/axios";

export default function Checkout() {
  const navigate = useNavigate();

  const { cartItems, cartTotal } = useCart();

  // FORM STATES
  const [fullName, setFullName] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  const [state, setState] = useState("");

  const [postalCode, setPostalCode] = useState("");

  const [loading, setLoading] = useState(false);

  // PLACE ORDER
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ORDER ITEMS
      const orderItems = cartItems.map((item) => ({
        product: item._id || item.id,

        quantity: item.quantity,
      }));

      // API CALL
      const { data } = await API.post("/orders", {
        orderItems,

        shippingAddress: {
          fullName,
          phone,
          address,
          city,
          state,
          postalCode,
          country: "India",
        },

        paymentMethod: "COD",
      });

      console.log(data);

      // CLEAR CART
      localStorage.removeItem("dayal-cart");

      alert("Order Placed Successfully");

      // REDIRECT
      window.location.href = "/";
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Order Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-16">
      {/* TITLE */}
      <h1 className="font-heading text-5xl mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* FORM */}
        <form
          onSubmit={handlePlaceOrder}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-5"
        >
          {/* FULL NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          {/* PHONE */}
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          {/* ADDRESS */}
          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          {/* CITY */}
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          {/* STATE */}
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          {/* PINCODE */}
          <input
            type="text"
            placeholder="Pincode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* ORDER SUMMARY */}
        <div className="bg-white p-8 rounded-2xl shadow-lg h-fit">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>

          {/* ITEMS */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id || item.id}
                className="flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>

                  <p className="text-sm text-gray-500">
                    Qty:
                    {item.quantity}
                  </p>
                </div>

                <span className="font-bold text-primary">
                  ₹{Number(item.sale_price || item.price || 0) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <hr className="my-6" />

          {/* TOTALS */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>₹{cartTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span>{cartTotal >= 500 ? "Free" : "₹40"}</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>

              <span>₹{cartTotal >= 500 ? cartTotal : cartTotal + 40}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
