import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { ShoppingBag, MapPin, Phone, User } from "lucide-react";

import { useCart } from "../context/CartContext";

import { useAuth } from "../context/AuthContext";

import API from "../api/axios";

export default function Checkout() {
  const navigate = useNavigate();

  // AUTH
  const { user, loading: authLoading } = useAuth();

  // CART
  const { cartItems, cartTotal, clearCart } = useCart();

  // FORM STATES
  const [fullName, setFullName] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  const [state, setState] = useState("");

  const [postalCode, setPostalCode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [distance, setDistance] = useState("");
  const [calculatingDistance, setCalculatingDistance] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // CHECK AUTH & CART
  // ==========================================
  useEffect(() => {
    if (authLoading) return;

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
  }, [user, authLoading, cartItems, navigate]);

  // ==========================================
  // AUTO CALCULATE DISTANCE
  // ==========================================
  useEffect(() => {
    const fetchDistance = async () => {
      // Require both Postal Code and City for accurate Indian geocoding
      if (postalCode.length === 6 && city.length >= 3) {
        setCalculatingDistance(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&city=${encodeURIComponent(city)}&country=India&format=json`);
          const data = await res.json();
          if (data && data.length > 0) {
            const userLat = parseFloat(data[0].lat);
            const userLng = parseFloat(data[0].lon);
            
            // Amrit Dayal Food - Nathmalpur, Gorakhpur Coords
            const STORE_LAT = 26.7663;
            const STORE_LNG = 83.3689;
            
            // Haversine formula
            const R = 6371; // km
            const dLat = (userLat - STORE_LAT) * Math.PI / 180;
            const dLon = (userLng - STORE_LNG) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(STORE_LAT * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) * 
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const d = R * c;
            
            setDistance(d);
          } else {
            setDistance(10); // default > 5km
          }
        } catch (err) {
          setDistance(10);
        } finally {
          setCalculatingDistance(false);
        }
      } else {
        setDistance(""); // Reset if not fully entered
      }
    };
    
    // Add debounce
    const timeoutId = setTimeout(() => {
      fetchDistance();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [postalCode, city]);

  // SHIPPING & DISCOUNT
  const discount = paymentMethod === "Online" ? Number(cartTotal) * 0.05 : 0;
  
  let shippingCharge = 0;
  if (distance !== "") {
    shippingCharge = Number(distance) <= 5 ? 49 : 99;
  }

  const finalTotal = Math.round(Number(cartTotal) - discount + shippingCharge);

  // ==========================================
  // PLACE ORDER
  // ==========================================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (paymentMethod === "Online" && (!transactionId || transactionId.length < 10)) {
      alert("Please enter a valid Transaction / UTR ID for your Online Payment.");
      return;
    }

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

        paymentMethod,
        transactionId: paymentMethod === "Online" ? transactionId : "",
        itemsPrice: cartTotal,
        shippingPrice: shippingCharge,
        taxPrice: 0,
        totalPrice: finalTotal,
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
            {/* PAYMENT METHOD */}
            <h3 className="text-xl font-bold font-heading text-dark mt-10 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
              Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`py-4 px-4 rounded-2xl border-2 font-bold transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === "COD" 
                    ? "border-primary bg-orange-50 text-primary" 
                    : "border-gray-100 text-gray-500 hover:border-orange-200 hover:bg-orange-50/50"
                }`}
              >
                Cash on Delivery
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("Online")}
                className={`py-4 px-4 rounded-2xl border-2 font-bold transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === "Online" 
                    ? "border-primary bg-orange-50 text-primary" 
                    : "border-gray-100 text-gray-500 hover:border-orange-200 hover:bg-orange-50/50"
                }`}
              >
                Online (5% OFF)
              </button>
            </div>

            {/* DISTANCE & SHIPPING INFO HAPPENS SILENTLY IN BACKGROUND */}

            {paymentMethod === "Online" && (
              <div className="mt-5 bg-white p-6 rounded-xl border border-orange-200 text-center shadow-inner">
                <h4 className="font-bold text-dark text-lg mb-2">Pay via UPI to Confirm Order</h4>
                <p className="text-sm text-gray-600 mb-4">Scan the QR code below with PhonePe, GPay, or Paytm.</p>
                
                {/* DYNAMIC UPI QR CODE */}
                <div className="bg-white p-3 rounded-2xl inline-block shadow-md border border-gray-100 mb-4">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=7275060800@paytm&pn=Amrit%20Dayal%20Food&am=${finalTotal}&cu=INR`} 
                    alt="UPI QR Code" 
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>
                
                <p className="text-primary font-bold text-xl mb-6">Amount: ₹{finalTotal}</p>

                <div className="text-left">
                  <label className="text-sm font-bold text-gray-700 block mb-2">Enter Transaction ID / UTR No. *</label>
                  <input
                    type="text"
                    placeholder="e.g. 301234567890"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary font-medium tracking-wide"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Required to verify your payment. Your order will be processed after verification.</p>
                </div>
              </div>
            )}
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

              <span className={shippingCharge === 0 ? "text-green-600 font-semibold" : "font-semibold"}>
                {shippingCharge === 0 ? "Free" : `₹${shippingCharge}`}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Online Discount (5%)</span>
                <span className="font-semibold">-₹{Math.round(discount)}</span>
              </div>
            )}

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
