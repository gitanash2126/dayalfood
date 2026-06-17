import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import API from "../api/axios";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  // ==========================================
  // AUTH
  // ==========================================
  const { user } = useAuth();

  // ==========================================
  // STATES
  // ==========================================
  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // SYNC & FETCH CART
  // ==========================================
  useEffect(() => {
    if (user) {
      syncGuestCart().then(() => fetchCart());
    } else {
      // Load from local storage
      const localCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      setCartItems(localCart);
    }
  }, [user]);

  const syncGuestCart = async () => {
    const localCart = JSON.parse(localStorage.getItem("guest_cart"));
    if (localCart && localCart.length > 0) {
      try {
        setLoading(true);
        // Sync each item to backend
        for (const item of localCart) {
          await API.post("/cart", { productId: item._id, quantity: item.quantity });
        }
        localStorage.removeItem("guest_cart");
      } catch (err) {
        console.log("Error syncing cart", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchCart = async () => {
    if (!user) return; // Only fetch if logged in
    try {
      setLoading(true);
      const { data } = await API.get("/cart");
      const items = data.data?.items || [];

      const formattedItems = items.map((item) => ({
        _id: item.product?._id,
        name: item.product?.name || "Product",
        hindiName: item.product?.hindiName || "",
        image: item.product?.image || "",
        category: item.product?.category || "Spices",
        weight: item.product?.weight || "500g",
        price: Number(item.product?.price || 0),
        sale_price: Number(item.product?.sale_price || item.product?.price || 0),
        quantity: Number(item.quantity || 1),
        stock: Number(item.product?.stock || 0),
      }));

      setCartItems(formattedItems);
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 401) {
        toast.error("Failed to fetch cart");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================
  const addToCart = async (product, qty = 1) => {
    const productId = product._id || product.id;
    if (!productId) {
      toast.error("Product ID missing");
      return;
    }

    if (!user) {
      // Guest Cart
      const currentCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      const existing = currentCart.find((i) => String(i._id) === String(productId));
      if (existing) {
        existing.quantity += qty;
      } else {
        currentCart.push({
          _id: productId,
          name: product.name,
          hindiName: product.hindiName || "",
          image: product.image,
          category: product.category,
          weight: product.weight || "500g",
          price: Number(product.price || 0),
          sale_price: Number(product.sale_price || product.price || 0),
          quantity: qty,
          stock: Number(product.stock || 0),
        });
      }
      localStorage.setItem("guest_cart", JSON.stringify(currentCart));
      setCartItems([...currentCart]);
      toast.success("Added to Cart!");
      return;
    }

    try {
      await API.post("/cart", { productId, quantity: qty });
      toast.success("Added to Cart!");
      fetchCart();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Add To Cart Failed");
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================
  const removeFromCart = async (productId) => {
    if (!user) {
      const currentCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      const updated = currentCart.filter((i) => String(i._id) !== String(productId));
      localStorage.setItem("guest_cart", JSON.stringify(updated));
      setCartItems([...updated]);
      toast.success("Item Removed");
      return;
    }

    try {
      setCartItems((prev) => prev.filter((item) => String(item._id) !== String(productId)));
      toast.success("Item Removed");
      await API.delete(`/cart/${productId}`);
    } catch (error) {
      console.log(error);
      toast.error("Remove Failed");
      fetchCart();
    }
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================
  const increaseQuantity = async (productId) => {
    const item = cartItems.find((item) => String(item._id) === String(productId));
    if (!item) return;
    if (item.quantity >= item.stock) {
      toast.error("Maximum stock reached");
      return;
    }
    const newQty = item.quantity + 1;

    if (!user) {
      const currentCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      const existing = currentCart.find((i) => String(i._id) === String(productId));
      if (existing) existing.quantity = newQty;
      localStorage.setItem("guest_cart", JSON.stringify(currentCart));
      setCartItems([...currentCart]);
      return;
    }

    try {
      setCartItems((prev) => prev.map((item) => String(item._id) === String(productId) ? { ...item, quantity: newQty } : item));
      await API.put(`/cart/${productId}`, { quantity: newQty });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
      fetchCart();
    }
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================
  const decreaseQuantity = async (productId) => {
    const item = cartItems.find((item) => String(item._id) === String(productId));
    if (!item) return;
    const newQty = item.quantity > 1 ? item.quantity - 1 : 1;

    if (!user) {
      const currentCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      const existing = currentCart.find((i) => String(i._id) === String(productId));
      if (existing) existing.quantity = newQty;
      localStorage.setItem("guest_cart", JSON.stringify(currentCart));
      setCartItems([...currentCart]);
      return;
    }

    try {
      setCartItems((prev) => prev.map((item) => String(item._id) === String(productId) ? { ...item, quantity: newQty } : item));
      await API.put(`/cart/${productId}`, { quantity: newQty });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
      fetchCart();
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================
  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem("guest_cart");
      setCartItems([]);
      toast.success("Cart Cleared");
      return;
    }

    try {
      setCartItems([]);
      toast.success("Cart Cleared");
      await API.delete("/cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to clear cart");
      fetchCart();
    }
  };

  // ==========================================
  // TOTAL
  // ==========================================
  const cartTotal = cartItems.reduce((total, item) => total + Number(item.sale_price || item.price || 0) * Number(item.quantity || 1), 0);

  // ==========================================
  // PROVIDER
  // ==========================================
  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        fetchCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ==========================================
// HOOK
// ==========================================
export function useCart() {
  return useContext(CartContext);
}
