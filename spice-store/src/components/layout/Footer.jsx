import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/products/logo.jpeg";

export default function Footer() {
  // AUTH CONTEXT
  const { user } = useAuth();

  // FOOTER SECTIONS
  const sections = [
    {
      title: "Quick Links",

      links: [
        {
          text: "Home",
          path: "/",
        },

        {
          text: "Products",
          path: "/products",
        },

        {
          text: "Cart",
          path: "/cart",
        },

        {
          text: "My Orders",
          path: "/my-orders",
        },

        // ADMIN DASHBOARD
        ...(user?.role === "admin"
          ? [
              {
                text: "Admin Dashboard",
                path: "/admin",
              },
            ]
          : []),
      ],
    },

    {
      title: "Categories",

      links: [
        {
          text: "Whole Spices",
          path: "/products",
        },

        {
          text: "Ground Spices",
          path: "/products",
        },

        {
          text: "Blended Masala",
          path: "/products",
        },

        {
          text: "Premium Masala",
          path: "/products",
        },
      ],
    },
  ];

  return (
    <footer className="mt-24 bg-[#111827] text-white overflow-hidden">
      {/* TOP BAR */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white text-center py-4 text-sm font-semibold tracking-wide">
        🚚 Free Shipping On Orders Above ₹500
      </div>

      <div className="container-custom">
        {/* MAIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-20">
          {/* BRAND */}
          <div>
            <Link to="/" className="flex items-center gap-4">
              {/* LOGO */}
              <img
                src={logo}
                alt="Dayal Food Stuffs"
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-200 shadow-lg"
              />

              {/* TEXT */}
              <div>
                <h2 className="font-heading text-3xl font-bold text-white leading-none">
                  Dayal Food
                </h2>

                <p className="text-sm text-orange-200 mt-2">
                  Pure Spices & Trusted Taste
                </p>
              </div>
            </Link>

            {/* DESCRIPTION */}
            <p className="mt-7 text-gray-400 leading-8 text-[15px] max-w-sm">
              Bringing premium Indian spices and authentic masalas directly to
              your kitchen with freshness, purity and traditional taste.
            </p>

            {/* ADMIN LOGIN */}
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition shadow-lg"
              >
                <ShieldCheck size={18} />
                Admin Login
              </Link>
            </div>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://wa.me/919335082270"
                target="_blank"
                rel="noreferrer"
                className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-2xl text-sm font-medium transition shadow-lg"
              >
                WhatsApp Order
              </a>

              <a
                href="tel:+919335082270"
                className="border border-gray-700 hover:border-primary hover:text-primary px-6 py-3 rounded-2xl text-sm font-medium transition"
              >
                Call Now
              </a>
            </div>
          </div>

          {/* SECTIONS */}
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold mb-6">{section.title}</h3>

              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className="group flex items-center gap-2 text-gray-400 hover:text-primary transition"
                    >
                      <ChevronRight
                        size={16}
                        className="group-hover:translate-x-1 transition"
                      />

                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CONTACT */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Contact Us</h3>

            <div className="space-y-6 text-gray-400">
              {/* PHONE */}
              <a
                href="tel:+919335082270"
                className="flex gap-3 hover:text-primary transition"
              >
                <Phone size={18} className="mt-1 shrink-0" />

                <span>
                  +91 9335082270
                  <br />
                  +91 8896541914
                </span>
              </a>

              {/* EMAIL */}
              <a
                href="mailto:support@dayalfoodstuffs.in"
                className="flex gap-3 hover:text-primary transition break-all"
              >
                <Mail size={18} className="mt-1 shrink-0" />

                <span>support@dayalfoodstuffs.in</span>
              </a>

              {/* ADDRESS */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=17-D+Nathmalpur+Near+Green+City+Colony+Gorakhnath+Gorakhpur+273015"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 hover:text-primary transition"
              >
                <MapPin size={18} className="mt-1 shrink-0" />

                <span>
                  17-D, Nathmalpur,
                  <br />
                  Near Green City Colony,
                  <br />
                  Gorakhpur - 273015
                </span>
              </a>

              {/* TIMING */}
              <div className="flex gap-3">
                <Clock3 size={18} className="mt-1 shrink-0" />

                <span>
                  Mon - Sun :
                  <br />
                  8:00 AM to 9:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 Dayal Food Stuffs • All Rights Reserved</p>

          <div className="flex flex-wrap justify-center gap-6">
            <p className="hover:text-primary transition cursor-pointer">
              Privacy Policy
            </p>

            <p className="hover:text-primary transition cursor-pointer">
              Terms & Conditions
            </p>

            <p className="hover:text-primary transition cursor-pointer">
              Shipping Policy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
