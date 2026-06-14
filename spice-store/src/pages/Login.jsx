import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Phone, CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // SEND OTP (MOCK DEVELOPMENT MODE)
  // ==========================================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      // Calls our backend which just returns success without using Fast2SMS
      const response = await API.post("/auth/send-otp", { phone });
      
      const dynamicOtp = response.data.data.testOtp;

      // SHOW AN ALERT SO THE USER ABSOLUTELY CANNOT MISS IT
      alert(`⚠️ FREE TEST MODE ⚠️\n\nYour OTP is: ${dynamicOtp}\n\n(No real SMS was sent to avoid billing limits)`);
      
      setStep(2);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      
      const { data } = await API.post("/auth/verify-otp", { phone, otp });
      
      const user = data.data;
      
      // Login context
      login(user);
      localStorage.setItem("user", JSON.stringify(user));
      
      toast.success("Login Successful");
      
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4e8] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl border border-orange-100 overflow-hidden">
        {/* TOP */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-10 py-12 text-center">
          <h1 className="font-heading text-5xl text-white">Login</h1>
          <p className="text-orange-50 mt-5 text-lg leading-8">
            Login with your mobile number to continue shopping.
          </p>
        </div>

        {/* FORM AREA */}
        <div className="p-10">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-7">
              <div>
                <label className="block mb-3 font-semibold text-dark">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter your 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 focus:border-primary outline-none pl-16 pr-5 py-4 rounded-2xl text-lg transition tracking-widest font-semibold"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white py-4 rounded-2xl text-lg font-semibold transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Sending OTP..." : "Get OTP"}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-7">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-semibold text-dark">
                    Enter OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                    }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-200 focus:border-primary outline-none px-5 py-4 rounded-2xl text-lg transition text-center tracking-[0.5em] font-bold"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-semibold transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Login"}
                {!loading && <CheckCircle size={20} />}
              </button>
            </form>
          )}

          <div className="mt-10 text-center">
             <Link
                to="/admin-login"
                className="text-gray-400 hover:text-gray-600 font-semibold transition text-sm"
              >
                Admin Login
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
