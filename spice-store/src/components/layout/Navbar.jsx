import { useState } from "react";

import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  PackageCheck,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/products/logo.jpeg";

import { useCart } from "../../context/CartContext";
import CartSidebar from "../cart/CartSidebar";

export default function Navbar() {
  const navigate = useNavigate();

  // STATES
  const [cartOpen, setCartOpen] = useState(false);

  const [mobileMenu, setMobileMenu] = useState(false);

  const [userMenu, setUserMenu] = useState(false);

  // USER
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // CART
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b">
        <div className="container-custom h-20 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              className="w-14 h-14 rounded-full object-cover border"
            />

            <div>
              <h2 className="font-bold text-2xl">Dayal Food</h2>

              <p className="text-sm text-gray-500">Premium Spices</p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-primary transition font-medium">
              Home
            </Link>

            <Link
              to="/products"
              className="hover:text-primary transition font-medium"
            >
              Products
            </Link>

            {/* USER */}
            {!user ? (
              <Link
                to="/login"
                className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-xl transition font-semibold shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                {/* USER BUTTON */}
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-gray-50 border px-4 py-2 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <span className="font-semibold text-sm">{user.name}</span>
                </button>

                {/* DROPDOWN */}
                {userMenu && (
                  <div className="absolute right-0 top-14 w-[240px] bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                    {/* USER INFO */}
                    <div className="px-3 py-3 border-b mb-2">
                      <h3 className="font-bold text-gray-800">{user.name}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">{user.phone || "No Mobile Number"}</p>
                    </div>

                    {/* MY ORDERS */}
                    <Link
                      to="/my-orders"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition"
                    >
                      <PackageCheck size={18} className="text-primary" />
                      <span className="font-medium text-sm">My Orders</span>
                    </Link>

                    {/* ADMIN */}
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition"
                      >
                        <LayoutDashboard size={18} className="text-primary" />
                        <span className="font-medium text-sm">Admin Dashboard</span>
                      </Link>
                    )}

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition w-full mt-1"
                    >
                      <LogOut size={18} />
                      <span className="font-medium text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CART BUTTON */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-primary hover:bg-secondary text-white p-3 rounded-2xl transition"
            >
              <ShoppingCart size={22} />

              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          {/* MOBILE ACTIONS */}
          <div className="flex md:hidden items-center gap-3">
            {/* CART */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-primary text-white p-3 rounded-2xl"
            >
              <ShoppingCart size={20} />

              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* MENU */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="bg-[#fff8f1] p-3 rounded-2xl"
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="md:hidden border-t bg-white px-6 py-5 space-y-5">
            <Link
              to="/"
              onClick={() => setMobileMenu(false)}
              className="block font-medium"
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={() => setMobileMenu(false)}
              className="block font-medium"
            >
              Products
            </Link>

            {!user ? (
              <Link
                to="/login"
                onClick={() => setMobileMenu(false)}
                className="block font-medium text-primary"
              >
                Login
              </Link>
            ) : (
              <>
                <div className="border-t pt-5">
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{user.phone || "No Mobile Number"}</p>
                </div>

                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenu(false)}
                  className="block font-medium"
                >
                  My Orders
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenu(false)}
                    className="block font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* CART SIDEBAR */}
      <CartSidebar isOpen={cartOpen} setIsOpen={setCartOpen} />
    </>
  );
}
