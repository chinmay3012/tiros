import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // Initialize state with data from local storage, or an empty array if none exists
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const localData = window.localStorage.getItem("wishlistItems");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error retrieving wishlist from local storage", error);
      return [];
    }
  });

  // Use useEffect to save wishlistItems to local storage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error saving wishlist to local storage", error);
    }
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      // Check if item already exists in wishlist
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev; // Don't add duplicates
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = () => setWishlistItems([]);

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlistItems, 
        addToWishlist, 
        removeFromWishlist, 
        isInWishlist,
        clearWishlist 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
