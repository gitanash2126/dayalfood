import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const user = response.data.data;
      
      if (user.role !== "admin" && user.role !== "shopkeeper") {
        toast.error("Access denied. Admin only.");
        return;
      }

      login(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Admin Login Successful");
      
      navigate("/admin");
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
        <div className="bg-gray-800 px-10 py-12 text-center">
          <h1 className="font-heading text-5xl text-white">Admin Login</h1>
          <p className="text-gray-300 mt-5 text-lg leading-8">
            Login to manage Dayal Spices
          </p>
        </div>

        <div className="p-10">
          <form onSubmit={handleLogin} className="space-y-7">
            <div>
              <label className="block mb-3 font-semibold text-dark">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 focus:border-gray-800 outline-none px-5 py-4 rounded-2xl text-lg transition"
                required
              />
            </div>

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
                  className="w-full border border-gray-200 focus:border-gray-800 outline-none px-5 py-4 rounded-2xl text-lg transition pr-14"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-black text-white py-4 rounded-2xl text-lg font-semibold transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
