import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Phone, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // REGISTER USER
  // ==========================================
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || name.trim().length < 3) {
      toast.error("Please enter a valid name");
      return;
    }
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      
      const { data } = await API.post("/auth/register", { name, phone, password });
      
      const loggedUser = data.data;
      
      // Login context
      login(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      
      toast.success("Registration Successful");
      
      if (loggedUser.role === "admin") {
        navigate("/admin");
      } else {
        const fromPath = typeof location.state?.from === 'string' ? location.state.from : (location.state?.from?.pathname || "/");
        navigate(fromPath, { replace: true });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-br from-[#fffdf8] via-[#fdf6e3] to-[#f4e6ce]">
      {/* BACKGROUND BLOBS */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-orange-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] bg-yellow-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[20%] w-[40vw] h-[40vw] bg-orange-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_50px_rgba(217,119,6,0.15)] border border-white/50 overflow-hidden relative z-10 animate-fade-in-up">
        {/* TOP */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 px-10 py-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm mix-blend-overlay"></div>
          <h1 className="font-heading text-5xl text-white relative z-10 drop-shadow-md">Register</h1>
          <p className="text-orange-50 mt-5 text-lg leading-8 relative z-10 drop-shadow-sm font-medium">
            Create an account to start shopping instantly.
          </p>
        </div>

        {/* FORM AREA */}
        <div className="p-10">
          <form onSubmit={handleRegister} className="space-y-7">
            <div>
              <label className="block mb-3 font-semibold text-dark">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none pl-14 pr-5 py-4 rounded-2xl text-lg transition-all duration-300 font-semibold bg-white/70 backdrop-blur-sm hover:border-orange-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-3 font-semibold text-dark">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                  <Phone size={20} />
                </span>
                <input
                  type="tel"
                  placeholder="Enter your 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none pl-14 pr-5 py-4 rounded-2xl text-lg transition-all duration-300 font-semibold bg-white/70 backdrop-blur-sm hover:border-orange-300"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-3 font-semibold text-dark">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock size={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none pl-14 pr-14 py-4 rounded-2xl text-lg transition-all duration-300 font-semibold bg-white/70 backdrop-blur-sm hover:border-orange-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white py-4 rounded-2xl text-lg font-semibold transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Create Account"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium text-lg">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
