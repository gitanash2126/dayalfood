import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  Send,
  CreditCard,
  Truck,
  Award
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/products/logo.jpeg";

export default function Footer() {
  const { user } = useAuth();

  const quickLinks = [
    { text: "Home", path: "/" },
    { text: "Products", path: "/products" },
    { text: "Cart", path: "/cart" },
    { text: "My Orders", path: "/my-orders" },
    ...(user?.role === "admin"
      ? [{ text: "Admin Dashboard", path: "/admin" }]
      : []),
  ];

  const categories = [
    { text: "Whole Spices", path: "/products" },
    { text: "Ground Spices", path: "/products" },
    { text: "Blended Masala", path: "/products" },
    { text: "Premium Masala", path: "/products" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#111] text-gray-300 font-body mt-24 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2 tracking-wide font-heading">
                Join the Dayal Food Family
              </h3>
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter for exclusive offers, new spice arrivals, and traditional Indian recipes.
              </p>
            </div>
            <div className="flex w-full md:w-auto flex-1 max-w-md shadow-xl rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-black/40 border border-gray-700/50 px-4 py-3.5 focus:outline-none focus:border-primary text-white transition-colors"
              />
              <button className="bg-primary hover:bg-secondary text-white px-6 py-3.5 flex items-center gap-2 font-semibold transition-all duration-300">
                Subscribe <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-4 group inline-flex">
              <img
                src={logo}
                alt="Dayal Food"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <h2 className="text-3xl font-extrabold text-white font-heading tracking-wide">
                  Dayal Food
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mt-1">
                  100% Pure & Authentic
                </p>
              </div>
            </Link>
            <p className="text-[15px] leading-relaxed text-gray-400">
              Crafting premium Indian spices and traditional masalas with rich
              aroma, unmatched purity, and trusted taste directly to your
              kitchen.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-white font-bold text-lg mb-6 font-heading tracking-wide flex items-center gap-2">
              <span className="w-6 h-px bg-primary inline-block"></span> Quick Links
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="text-gray-400 hover:text-primary transition-all duration-300 flex items-center gap-2 text-[15px] group w-fit"
                  >
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1.5 transition-transform duration-300 text-primary/70 group-hover:text-primary"
                    />
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-heading tracking-wide flex items-center gap-2">
              <span className="w-6 h-px bg-primary inline-block"></span> Categories
            </h4>
            <ul className="space-y-3.5">
              {categories.map((cat, i) => (
                <li key={i}>
                  <Link
                    to={cat.path}
                    onClick={scrollToTop}
                    className="text-gray-400 hover:text-primary transition-all duration-300 flex items-center gap-2 text-[15px] group w-fit"
                  >
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1.5 transition-transform duration-300 text-primary/70 group-hover:text-primary"
                    />
                    {cat.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 font-heading tracking-wide flex items-center gap-2">
              <span className="w-6 h-px bg-primary inline-block"></span> Get In Touch
            </h4>
            <ul className="space-y-4 text-[15px] text-gray-400">
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-primary shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=17-D+Nathmalpur+Near+Green+City+Colony+Gorakhnath+Gorakhpur+273015"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors leading-relaxed"
                >
                  17-D, Nathmalpur, <br />
                  Near Green City Colony, <br />
                  Gorakhpur - 273015
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <a href="tel:+919335082270" className="hover:text-primary transition-colors">+91 9335082270</a>
                  <a href="tel:+918896541914" className="hover:text-primary transition-colors">+91 8896541914</a>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={18} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:support@dayalfoodstuffs.in" className="hover:text-primary transition-colors">support@dayalfoodstuffs.in</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock3 size={18} className="text-primary shrink-0" />
                <span>Mon - Sun : 8:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-t border-white/5 bg-[#0a0a0a]">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Secure Payments</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Award size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">FSSAI Certified</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Multiple Options</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} Dayal Food Stuffs. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs font-medium text-gray-500">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Shipping Policy</a>
            <Link to="/admin-login" className="hover:text-primary transition-colors flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10">
              <ShieldCheck size={14} className="text-primary" /> Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
