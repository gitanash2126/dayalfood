import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { ShoppingBag, MapPin, Phone, User } from "lucide-react";

import { useCart } from "../context/CartContext";

import { useAuth } from "../context/AuthContext";

import API from "../api/axios";

export default function Checkout() {
  const navigate = useNavigate();

  // AUTH
  const { user } = useAuth();

  // CART
  const { cartItems, cartTotal, clearCart } = useCart();

  // FORM STATES
  const [fullName, setFullName] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  const [state, setState] = useState("");

  const [postalCode, setPostalCode] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // CHECK AUTH & CART
  // ==========================================
  useEffect(() => {
    // LOGIN CHECK
    if (!user) {
      navigate("/login");

      return;
    }

    // EMPTY CART
    if (cartItems.length === 0) {
      navigate("/cart");
    }

    // AUTO FILL
    setFullName(user.name || "");

    setPhone(user.phone || "");
  }, [user, cartItems, navigate]);

  // SHIPPING
  const shippingCharge = cartTotal >= 500 ? 0 : 40;

  const finalTotal = Number(cartTotal) + shippingCharge;

  // ==========================================
  // PLACE ORDER
  // ==========================================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ORDER ITEMS
      const orderItems = cartItems.map((item) => ({
        product: item._id,

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

      console.log("ORDER:", data);

      // CLEAR BACKEND CART
      await clearCart();

      alert("Order Placed Successfully 🎉");

      // REDIRECT
      navigate("/my-orders");
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
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-primary/10 p-4 rounded-2xl">
          <ShoppingBag className="text-primary" />
        </div>

        <div>
          <h1 className="font-heading text-5xl">Checkout</h1>

          <p className="text-gray-500 mt-2">Complete your order details</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* FORM */}
        <form
          onSubmit={handlePlaceOrder}
          className="bg-white p-8 rounded-[32px] shadow-xl space-y-5"
        >
          {/* FULL NAME */}
          <div>
            <label className="font-semibold flex items-center gap-2 mb-2">
              <User size={18} />
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary"
              required
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="font-semibold flex items-center gap-2 mb-2">
              <Phone size={18} />
              Phone Number
            </label>

            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary"
              required
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="font-semibold flex items-center gap-2 mb-2">
              <MapPin size={18} />
              Address
            </label>

            <textarea
              placeholder="Enter Complete Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={4}
              className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary"
              required
            />
          </div>

          {/* CITY */}
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary"
            required
          />

          {/* STATE */}
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary"
            required
          />

          {/* PINCODE */}
          <input
            type="text"
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary"
            required
          />

          {/* PAYMENT */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <h3 className="font-semibold text-lg">Payment Method</h3>

            <p className="text-gray-600 mt-2">Cash On Delivery (COD)</p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-2xl text-lg font-semibold transition shadow-lg disabled:opacity-70"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* ORDER SUMMARY */}
        <div className="bg-white p-8 rounded-[32px] shadow-xl h-fit sticky top-24">
          <h2 className="text-3xl font-semibold mb-8">Order Summary</h2>

          {/* ITEMS */}
          <div className="space-y-5">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
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
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>₹{cartTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span className="text-green-600">
                {shippingCharge === 0 ? "Free" : `₹${shippingCharge}`}
              </span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-2xl">
              <span>Total</span>

              <span className="text-primary">₹{finalTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
