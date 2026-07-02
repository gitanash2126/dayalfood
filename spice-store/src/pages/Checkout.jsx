import { useEffect, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { ShoppingBag, MapPin, Phone, User, CheckCircle2, Plus, X } from "lucide-react";

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
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [loading, setLoading] = useState(false);

  // SAVED ADDRESSES
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  // COUPON
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // ==========================================
  // CHECK AUTH & CART
  // ==========================================
  const location = useLocation();

  useEffect(() => {
    if (authLoading) return;

    // LOGIN CHECK
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // EMPTY CART
    if (cartItems.length === 0) {
      navigate("/cart");
    }

    // FETCH SAVED ADDRESSES
    const fetchAddresses = async () => {
      try {
        const { data } = await API.get("/users/addresses");
        if (data?.data && data.data.length > 0) {
          setSavedAddresses(data.data);
          const def = data.data.find(a => a.isDefault) || data.data[0];
          setSelectedAddressId(def._id);
          setFullName(def.fullName || "");
          setPhone(String(def.phone || ""));
          setAddress(def.address || "");
          setCity(def.city || "");
          setState(def.state || "");
          setPostalCode(String(def.postalCode || ""));
        } else {
          setIsAddingNew(true);
          setFullName(user.name || "");
          setPhone(user.phone || "");
        }
      } catch (err) {
        setIsAddingNew(true);
        setFullName(user.name || "");
        setPhone(user.phone || "");
      }
    };
    fetchAddresses();
  }, [user, authLoading, cartItems, navigate]);

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    setIsAddingNew(false);
    const def = savedAddresses.find(a => a._id === id);
    if (def) {
      setFullName(def.fullName || "");
      setPhone(String(def.phone || ""));
      setAddress(def.address || "");
      setCity(def.city || "");
      setState(def.state || "");
      setPostalCode(String(def.postalCode || ""));
    }
  };

  // ==========================================
  // AUTO CALCULATE DISTANCE
  // ==========================================
  useEffect(() => {
    const fetchDistance = async () => {
      // Require both Postal Code and City for accurate Indian geocoding
      const pCode = String(postalCode || "");
      const cCity = String(city || "");

      if (pCode.length === 6 && cCity.length >= 3) {
        setCalculatingDistance(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pCode}&city=${encodeURIComponent(cCity)}&country=India&format=json`);
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
  const paymentDiscount = paymentMethod === "Online" ? Number(cartTotal) * 0.10 : 0;
  
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      couponDiscount = (Number(cartTotal) * appliedCoupon.discountValue) / 100;
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  const totalDiscount = paymentDiscount + couponDiscount;

  let shippingCharge = 49; // Flat rate
  if (Number(cartTotal) > 399) {
    shippingCharge = 0; // Free shipping above 399
  }

  const finalTotal = Math.max(0, Math.round(Number(cartTotal) - totalDiscount + shippingCharge));

  // APPLY COUPON HANDLER
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const { data } = await API.post("/offers/validate-coupon", { couponCode });
      setAppliedCoupon(data.data);
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (paymentMethod === "Online" && !paymentScreenshot) {
      alert("Please upload a screenshot of your payment.");
      return;
    }

    try {
      setLoading(true);

      // ORDER ITEMS
      const orderItems = cartItems.map((item) => ({
        product: item._id,

        quantity: item.quantity,
      }));

      let screenshotUrl = "";

      // UPLOAD SCREENSHOT IF ONLINE PAYMENT
      if (paymentMethod === "Online" && paymentScreenshot) {
        const formData = new FormData();
        formData.append("image", paymentScreenshot);

        const uploadRes = await API.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        screenshotUrl = uploadRes.data.data.url;
      }

      // SAVE NEW ADDRESS IF NEEDED
      if (isAddingNew) {
        try {
          await API.post("/users/addresses", {
            fullName, phone, address, city, state, postalCode, country: "India", isDefault: true
          });
        } catch (err) {
          console.log("Failed to save address", err);
        }
      }

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
        paymentScreenshot: screenshotUrl,
        itemsPrice: cartTotal,
        shippingPrice: shippingCharge,
        taxPrice: 0,
        discountPrice: totalDiscount,
        couponCodeUsed: appliedCoupon ? appliedCoupon.couponCode : "",
        totalPrice: finalTotal,
      });

      console.log("ORDER:", data);

      // CLEAR BACKEND CART
      await clearCart();

      setOrderPlaced(true);

      // REDIRECT AFTER A VERY SHORT DELAY TO FEEL FASTER
      setTimeout(() => {
        navigate("/my-orders");
      }, 500);
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Order Failed");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container-custom py-20 min-h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-500 text-lg mb-8 max-w-md">
          Thank you for choosing Amrit Dayal Food. Your order has been received and is being processed.
        </p>
        <button onClick={() => navigate("/my-orders")} className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-secondary transition hover:-translate-y-1">
          View My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      {/* TITLE */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-primary/10 p-4 rounded-2xl">
          <ShoppingBag className="text-primary" />
        </div>

        <div>
          <h1 className="font-heading text-5xl">Checkout</h1>

          <p className="text-gray-500 mt-2">Complete your order details</p>
        </div>
      </div>

      {/* FREE SHIPPING PROGRESS */}
      <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex-1 w-full">
          {Number(cartTotal) > 399 ? (
             <div className="flex items-center gap-3 text-green-600 font-bold">
               <span className="bg-green-100 p-2 rounded-full"><CheckCircle2 size={20} /></span>
               <span>Congratulations! You get FREE Delivery on this order.</span>
             </div>
          ) : (
             <div>
               <p className="font-bold text-dark mb-2">
                 Add items worth <span className="text-primary">₹{399 - Number(cartTotal)}</span> more to get <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md">Free Delivery</span>
               </p>
               <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-primary transition-all duration-500 rounded-full" 
                   style={{ width: `${Math.min((Number(cartTotal) / 399) * 100, 100)}%` }}
                 ></div>
               </div>
             </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* FORM */}
        <form
          onSubmit={handlePlaceOrder}
          className="bg-white p-8 rounded-[32px] shadow-xl space-y-5"
        >
          {/* ADDRESS SELECTION */}
          {savedAddresses.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2 mb-4">
                <MapPin size={22} className="text-primary"/> Select Delivery Address
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {savedAddresses.map((addr) => (
                  <div 
                    key={addr._id} 
                    onClick={() => handleSelectAddress(addr._id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition relative ${selectedAddressId === addr._id && !isAddingNew ? "border-primary bg-orange-50" : "border-gray-100 hover:border-orange-200"}`}
                  >
                    {selectedAddressId === addr._id && !isAddingNew && (
                      <div className="absolute top-3 right-3 text-primary"><CheckCircle2 size={20}/></div>
                    )}
                    <p className="font-bold text-dark text-lg">{addr.fullName}</p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{addr.address}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-2 flex items-center gap-1"><Phone size={14}/> {addr.phone}</p>
                  </div>
                ))}
              </div>
              {!isAddingNew && (
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAddingNew(true);
                    setSelectedAddressId("");
                    setFullName(user.name || "");
                    setPhone(user.phone || "");
                    setAddress(""); setCity(""); setState(""); setPostalCode("");
                  }} 
                  className="mt-4 flex items-center gap-2 text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-xl transition"
                >
                  <Plus size={18}/> Add New Address
                </button>
              )}
            </div>
          )}

          {(isAddingNew || savedAddresses.length === 0) && (
            <div className="space-y-5 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="font-bold text-xl text-dark">Enter New Address</h3>
                 {savedAddresses.length > 0 && (
                    <button type="button" onClick={() => handleSelectAddress(savedAddresses[0]._id)} className="text-sm font-bold text-gray-500 hover:text-red-500">Cancel</button>
                 )}
              </div>
              
              <div>
                <label className="font-semibold flex items-center gap-2 mb-2"><User size={18} /> Full Name</label>
                <input type="text" placeholder="Enter Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary" required />
              </div>

              <div>
                <label className="font-semibold flex items-center gap-2 mb-2"><Phone size={18} /> Phone Number</label>
                <input type="text" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary" required />
              </div>

              <div>
                <label className="font-semibold flex items-center gap-2 mb-2"><MapPin size={18} /> Complete Address</label>
                <textarea placeholder="House No, Building, Street, Area" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary" required />
                <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary" required />
              </div>
              
              <input type="text" placeholder="Postal Code (6 digits)" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full border rounded-2xl px-5 py-4 outline-none focus:border-primary" required />
            </div>
          )}

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
                Online (10% OFF)
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
                    src="/payment-qr.jpeg" 
                    alt="Scan & Pay Using PhonePe App" 
                    className="w-64 object-contain mx-auto rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=7275060800@paytm&pn=Amrit%20Dayal%20Food&am=${finalTotal}&cu=INR`;
                    }}
                  />
                </div>
                
                <p className="text-primary font-bold text-xl mb-6">Amount: ₹{finalTotal}</p>

                <div className="text-left bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="text-sm font-bold text-gray-700 block mb-2">Upload Payment Screenshot *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                    className="w-full text-sm text-gray-500
                      file:mr-4 file:py-3 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-secondary transition cursor-pointer"
                    required
                  />
                  {paymentScreenshot && (
                    <p className="text-xs text-green-600 font-semibold mt-2">
                      Selected: {paymentScreenshot.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Required to verify your payment. Admin will review the screenshot.</p>
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
                  <h3 className="font-semibold">{item.name} {item.hindiName && <span className="text-gray-500 font-normal">({item.hindiName})</span>}</h3>

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
                {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
              </span>
            </div>

            {paymentDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Online Payment Discount (10%)</span>
                <span>-₹{Math.round(paymentDiscount)}</span>
              </div>
            )}

            {appliedCoupon && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Coupon ({appliedCoupon.couponCode})</span>
                <span>-₹{Math.round(couponDiscount)}</span>
              </div>
            )}

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span className="text-primary">₹{finalTotal}</span>
            </div>
          </div>

          {/* COUPON SECTION */}
          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold text-gray-700 mb-3">Have a coupon code?</h3>
            {!appliedCoupon ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 border rounded-xl px-4 py-3 outline-none focus:border-primary uppercase text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="bg-gray-800 hover:bg-black text-white px-5 py-3 rounded-xl font-semibold transition disabled:opacity-50 text-sm"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-xs font-semibold">{couponError}</p>}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-green-700 font-bold text-sm">{appliedCoupon.couponCode} Applied!</p>
                  <p className="text-green-600 text-xs mt-0.5">{appliedCoupon.discountText}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
