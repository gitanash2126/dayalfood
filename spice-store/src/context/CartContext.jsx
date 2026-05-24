import { createContext, useContext, useEffect, useState } from "react";

import API from "../api/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  // ==========================================
  // STATES
  // ==========================================
  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH CART FROM BACKEND
  // ==========================================
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/cart");

      console.log("CART RESPONSE:", data);

      const items = data.data?.items || [];

      // FORMAT CART
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

      // IGNORE 401
      if (error.response?.status !== 401) {
        alert("Failed to fetch cart");
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
      const productId = product._id || product.id;

      if (!productId) {
        alert("Product ID missing");

        return;
      }

      // API
      await API.post("/cart", {
        productId,

        quantity: qty,
      });

      // REFRESH CART
      await fetchCart();

      alert("Added To Cart");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Add To Cart Failed");
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================
  const removeFromCart = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);

      // UPDATE UI
      setCartItems((prev) =>
        prev.filter((item) => String(item._id) !== String(productId)),
      );

      alert("Item Removed");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Remove Failed");
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

      // STOCK CHECK
      if (item.quantity >= item.stock) {
        alert("Maximum stock reached");

        return;
      }

      const newQty = item.quantity + 1;

      // BACKEND UPDATE
      await API.put(`/cart/${productId}`, {
        quantity: newQty,
      });

      // UPDATE UI
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
    } catch (error) {
      console.log(error);

      alert("Failed to update quantity");
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

      // BACKEND UPDATE
      await API.put(`/cart/${productId}`, {
        quantity: newQty,
      });

      // UPDATE UI
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
    } catch (error) {
      console.log(error);

      alert("Failed to update quantity");
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================
  const clearCart = async () => {
    try {
      await API.delete("/cart");

      setCartItems([]);

      alert("Cart Cleared");
    } catch (error) {
      console.log(error);

      alert("Failed to clear cart");
    }
  };

  // ==========================================
  // CART TOTAL
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
// CUSTOM HOOK
// ==========================================
export function useCart() {
  return useContext(CartContext);
}
