import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  // AUTH
  const { login } = useAuth();

  // STATES
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // API CALL
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      // ==========================================
      // USER DATA
      // ==========================================
      const user = response.data.data;

      // ==========================================
      // SAVE USER IN AUTH CONTEXT
      // ==========================================
      login(user);

      // ==========================================
      // SAVE USER IN LOCAL STORAGE
      // ==========================================
      localStorage.setItem("user", JSON.stringify(user));

      // ==========================================
      // SUCCESS
      // ==========================================
      toast.success("Login Successful");

      // ==========================================
      // ADMIN REDIRECT
      // ==========================================
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4e8] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl border border-orange-100 overflow-hidden">
        {/* TOP */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-10 py-12 text-center">
          <h1 className="font-heading text-5xl text-white">Welcome Back</h1>

          <p className="text-orange-50 mt-5 text-lg leading-8">
            Login to continue shopping premium spices & masalas.
          </p>
        </div>

        {/* FORM AREA */}
        <div className="p-10">
          <form onSubmit={handleLogin} className="space-y-7">
            {/* EMAIL */}
            <div>
              <label className="block mb-3 font-semibold text-dark">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 focus:border-primary outline-none px-5 py-4 rounded-2xl text-lg transition"
                required
                autoComplete="email"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-3 font-semibold text-dark">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 focus:border-primary outline-none px-5 py-4 rounded-2xl text-lg transition pr-14"
                  required
                  autoComplete="current-password"
                />

                {/* TOGGLE */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-primary hover:text-secondary transition text-sm font-semibold"
              >
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-2xl text-lg font-semibold transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          {/* REGISTER */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 text-lg">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-secondary font-semibold transition"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
