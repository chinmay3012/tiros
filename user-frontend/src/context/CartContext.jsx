import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  // Initialize state with data from local storage, or an empty array if none exists
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = window.localStorage.getItem("cartItems");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error retrieving data from local storage", error);
      return [];
    }
  });

  // Use useEffect to save cartItems to local storage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving data to local storage", error);
    }
  }, [cartItems]); // The dependency array ensures this effect runs whenever cartItems changes

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      if (!existingItem) {
        return prev;
      }
      if (existingItem.quantity === 1) {
        return prev.filter((item) => item.id !== productId);
      }
      return prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const clearCart = () => setCartItems([]);

  const checkout = async ({ address, payment } = {}) => {
    // Build simple order payload
    const items = cartItems.map((item) => ({
      product: item.id,
      quantity: item.quantity,
      price: Number(String(item.price).replace("Rs. ", "").replace(",", "")),
    }));
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const payload = {
      userId: user?._id,
      items,
      totalAmount: total,
      shippingAddress: address ? `${address.name}, ${address.street}, ${address.city}, ${address.zip}, ${address.country}, ${address.phone}` : undefined,
      payment,
    };
    const res = await api.post("/orders", payload);
    clearCart();
    return res.data;
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);