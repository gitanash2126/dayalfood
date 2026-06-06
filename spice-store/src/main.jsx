import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster position="top-center" toastOptions={{ duration: 2000, style: { background: '#333', color: '#fff', borderRadius: '10px' } }} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);
