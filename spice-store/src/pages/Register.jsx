import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import API from "../api/axios";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();

  // AUTH CONTEXT
  const { login } = useAuth();

  // STATES
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // REGISTER FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // API CALL
      const response = await API.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });

      console.log("REGISTER RESPONSE:", response.data);

      // BACKEND RESPONSE
      const responseData = response.data.data;

      // TOKEN
      const token = responseData.token;

      // USER
      const user = {
        _id: responseData._id,

        name: responseData.name,

        email: responseData.email,

        phone: responseData.phone,

        role: responseData.role,
      };

      // SAVE TOKEN
      localStorage.setItem("token", token);

      // LOGIN USER
      login(user);

      alert("Registration Successful");

      // REDIRECT HOME
      navigate("/");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffdf8] px-4">
      <div className="bg-white shadow-2xl rounded-[32px] p-8 w-full max-w-md border border-orange-100">
        {/* HEADING */}
        <h1 className="font-heading text-4xl text-center text-dark">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Register to continue shopping
        </p>

        {/* FORM */}
        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          {/* NAME */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Full Name :
            </label>

            <input
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-orange-200 rounded-2xl px-4 py-4 outline-none focus:border-primary"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address :
            </label>

            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-orange-200 rounded-2xl px-4 py-4 outline-none focus:border-primary"
              required
            />
          </div>

          {/* MOBILE */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mobile Number :
            </label>

            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-orange-200 rounded-2xl px-4 py-4 outline-none focus:border-primary"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password :
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-orange-200 rounded-2xl px-4 py-4 outline-none focus:border-primary"
              required
              autoComplete="new-password"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white py-4 rounded-2xl font-semibold transition duration-300 disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-secondary font-semibold transition"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
