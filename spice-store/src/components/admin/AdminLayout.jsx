import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Users,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  CreditCard,
  Gift,
} from "lucide-react";

import { Link, Outlet, useNavigate } from "react-router-dom";

import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // LOGOUT
  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  // SIDEBAR LINKS
  const links = [
    {
      name: "Dashboard",

      path: "/admin",

      icon: LayoutDashboard,
    },

    {
      name: "Products",

      path: "/admin/products",

      icon: ShoppingBag,
    },

    {
      name: "Orders",

      path: "/admin/orders",

      icon: PackageCheck,
    },

    {
      name: "Users",

      path: "/admin/users",

      icon: Users,
    },

    {
      name: "Transactions",

      path: "/admin/transactions",

      icon: CreditCard,
    },

    // LOW STOCK
    {
      name: "Low Stock",

      path: "/admin/low-stock",

      icon: AlertTriangle,
    },

    {
      name: "Offers",

      path: "/admin/offers",

      icon: Gift,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f4e8] flex">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-[280px] bg-[#111827] text-white p-6 transform transition duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* TOP */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>

            <p className="text-gray-400 text-sm mt-2">Dayal Food</p>
          </div>

          {/* CLOSE */}
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={28} />
          </button>
        </div>

        {/* LINKS */}
        <nav className="space-y-4">
          {links.map((link, index) => {
            const Icon = link.icon;

            return (
              <Link
                key={index}
                to={link.path}
                className="flex items-center gap-4 bg-[#1f2937] hover:bg-primary px-5 py-4 rounded-2xl transition"
              >
                <Icon size={22} />

                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 bg-red-500 hover:bg-red-600 px-5 py-4 rounded-2xl transition w-full mt-10"
        >
          <LogOut size={22} />

          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-h-screen">
        {/* MOBILE TOPBAR */}
        <div className="lg:hidden bg-white shadow-md px-4 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={28} />
          </button>

          <h2 className="font-bold text-xl">Admin Panel</h2>
        </div>

        {/* PAGE */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
