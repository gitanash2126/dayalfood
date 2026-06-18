import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { useEffect } from "react";

import Navbar from "./components/layout/Navbar";

import Footer from "./components/layout/Footer";

import Home from "./pages/Home";

import Products from "./pages/Products";

import ProductDetails from "./pages/ProductDetails";

import Login from "./pages/Login";

import Register from "./pages/Register";

import AdminLogin from "./pages/AdminLogin";

import Cart from "./pages/Cart";

import Checkout from "./pages/Checkout";

import MyOrders from "./pages/MyOrders";

// ADMIN
import AdminLayout from "./components/admin/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminOrders from "./pages/admin/AdminOrders";

import AdminProducts from "./pages/admin/AdminProducts";

import AdminUsers from "./pages/admin/AdminUsers";

import AdminLowStock from "./pages/admin/AdminLowStock";

import AdminTransactions from "./pages/admin/AdminTransactions";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top instantly on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-[#fffdf8] min-h-screen">
        {/* NAVBAR */}
        <Navbar />

        {/* ROUTES */}
        <Routes>
          {/* USER ROUTES */}
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route path="/products/:slug" element={<ProductDetails />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/my-orders" element={<MyOrders />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* DASHBOARD */}
            <Route index element={<AdminDashboard />} />

            {/* PRODUCTS */}
            <Route path="products" element={<AdminProducts />} />

            {/* ORDERS */}
            <Route path="orders" element={<AdminOrders />} />

            <Route path="low-stock" element={<AdminLowStock />} />

            {/* USERS */}
            <Route path="users" element={<AdminUsers />} />

            {/* TRANSACTIONS */}
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>
        </Routes>

        {/* FOOTER */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
