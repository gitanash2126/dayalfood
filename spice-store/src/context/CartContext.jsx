import { createContext, useContext, useEffect, useState } from "react";

import API from "../api/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // LOAD CART
  useEffect(() => {
    const savedCart = localStorage.getItem("dayal-cart");

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // SAVE CART
  useEffect(() => {
    localStorage.setItem("dayal-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ADD TO CART
  const addToCart = async (product) => {
    try {
      const productId = product._id || product.id;

      // CHECK PRODUCT ID
      if (!productId) {
        alert("Product ID is required");

        return;
      }

      // BACKEND API
      await API.post("/cart", {
        productId,
        quantity: 1,
      });

      // CLEAN PRODUCT OBJECT
      const newProduct = {
        _id: productId,

        name: product.name || "Premium Spice",

        image: product.image || product.images?.[0] || "",

        category:
          typeof product.category === "object"
            ? product.category?.name
            : product.category || "Spices",

        weight: product.weight || "500g",

        price: Number(product.price || 0),

        sale_price: Number(product.sale_price || product.price || 0),

        quantity: 1,
      };

      // UPDATE CART
      setCartItems((prevItems) => {
        const existingProduct = prevItems.find(
          (item) => String(item._id) === String(productId),
        );

        // IF EXISTS
        if (existingProduct) {
          return prevItems.map((item) =>
            String(item._id) === String(productId)
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          );
        }

        // NEW ITEM
        return [...prevItems, newProduct];
      });

      alert("Added To Cart");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Add To Cart Failed");
    }
  };

  // REMOVE
  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => String(item._id) !== String(id)),
    );
  };

  // INCREASE
  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item._id) === String(id)
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  // DECREASE
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item._id) === String(id)
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
            }
          : item,
      ),
    );
  };

  // TOTAL
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.sale_price || item.price || 0) * Number(item.quantity || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// CUSTOM HOOK
export function useCart() {
  return useContext(CartContext);
}
