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
  // FETCH CART ONLY IF USER LOGGED IN
  // ==========================================
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  // ==========================================
  // FETCH CART
  // ==========================================
  const fetchCart = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/cart");

      console.log("CART RESPONSE:", data);

      const items = data.data?.items || [];

      // FORMAT ITEMS
      const formattedItems = items.map((item) => ({
        _id: item.product?._id,

        name: item.product?.name || "Product",

        image: item.product?.image || "",

        category: item.product?.category || "Spices",

        weight: item.product?.weight || "500g",

        price: Number(item.product?.price || 0),

        sale_price: Number(
          item.product?.sale_price || item.product?.price || 0,
        ),

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
    try {
      // LOGIN CHECK
      if (!user) {
        toast.error("Please login first");
        return;
      }

      const productId = product._id || product.id;

      if (!productId) {
        toast.error("Product ID missing");
        return;
      }

      // API
      await API.post("/cart", {
        productId,

        quantity: qty,
      });

      // Show toast immediately so it feels fast
      toast.success("Added to Cart!");

      // Refresh in background
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
    try {
      // Optimistic Update
      setCartItems((prev) =>
        prev.filter((item) => String(item._id) !== String(productId)),
      );
      toast.success("Item Removed");

      // Background API call
      await API.delete(`/cart/${productId}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Remove Failed");
      fetchCart(); // Rollback if failed
    }
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================
  const increaseQuantity = async (productId) => {
    try {
      const item = cartItems.find(
        (item) => String(item._id) === String(productId),
      );

      if (!item) return;

      if (item.quantity >= item.stock) {
        toast.error("Maximum stock reached");
        return;
      }

      const newQty = item.quantity + 1;

      // Optimistic Update
      setCartItems((prev) =>
        prev.map((item) =>
          String(item._id) === String(productId)
            ? {
                ...item,

                quantity: newQty,
              }
            : item,
        ),
      );

      // Background API call
      await API.put(`/cart/${productId}`, {
        quantity: newQty,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
      fetchCart(); // Rollback if failed
    }
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================
  const decreaseQuantity = async (productId) => {
    try {
      const item = cartItems.find(
        (item) => String(item._id) === String(productId),
      );

      if (!item) return;

      const newQty = item.quantity > 1 ? item.quantity - 1 : 1;

      // Optimistic Update
      setCartItems((prev) =>
        prev.map((item) =>
          String(item._id) === String(productId)
            ? {
                ...item,

                quantity: newQty,
              }
            : item,
        ),
      );

      // Background API call
      await API.put(`/cart/${productId}`, {
        quantity: newQty,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity");
      fetchCart(); // Rollback if failed
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================
  const clearCart = async () => {
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
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.sale_price || item.price || 0) * Number(item.quantity || 1),

    0,
  );

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
