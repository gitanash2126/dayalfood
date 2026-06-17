import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Phone, CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
        const fromPath = typeof location.state?.from === 'string' ? location.state.from : (location.state?.from?.pathname || "/");
        navigate(fromPath, { replace: true });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-br from-[#fffdf8] via-[#fdf6e3] to-[#f4e6ce]">
      {/* BACKGROUND BLOBS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-orange-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40vw] h-[40vw] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_50px_rgba(217,119,6,0.15)] border border-white/50 overflow-hidden relative z-10 animate-fade-in-up">
        {/* TOP */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 px-10 py-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm mix-blend-overlay"></div>
          <h1 className="font-heading text-5xl text-white relative z-10 drop-shadow-md">Login</h1>
          <p className="text-orange-50 mt-5 text-lg leading-8 relative z-10 drop-shadow-sm font-medium">
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
                    className="w-full border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none pl-16 pr-5 py-4 rounded-2xl text-lg transition-all duration-300 tracking-widest font-semibold bg-white/70 backdrop-blur-sm hover:border-orange-300"
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
                  className="w-full border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none px-5 py-4 rounded-2xl text-lg transition-all duration-300 text-center tracking-[0.5em] font-bold bg-white/70 backdrop-blur-sm hover:border-orange-300"
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

          {/* Admin Login Link Removed As Requested */}
        </div>
      </div>
    </div>
  );
}
