import { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // Load wishlist from API when user logs in, or from localStorage if not logged in
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        if (user?._id) {
          // User is logged in - load from API
          const response = await api.get(`/users/${user._id}/wishlist`);
          const dbWishlist = response.data.wishlist || [];
          
          // Check if there's a localStorage wishlist to merge
          try {
            const localData = window.localStorage.getItem("wishlistItems");
            const localWishlist = localData ? JSON.parse(localData) : [];
            
            if (localWishlist.length > 0) {
              // Merge localStorage wishlist with database wishlist (avoid duplicates)
              const mergedWishlist = [...dbWishlist];
              const dbIds = new Set(dbWishlist.map(item => item.id));
              
              localWishlist.forEach((localItem) => {
                if (!dbIds.has(localItem.id)) {
                  mergedWishlist.push(localItem);
                }
              });
              
              setWishlistItems(mergedWishlist);
              // Save merged wishlist to database
              await api.put(`/users/${user._id}/wishlist`, { wishlist: mergedWishlist });
              // Clear localStorage wishlist after merge
              window.localStorage.removeItem("wishlistItems");
            } else {
              setWishlistItems(dbWishlist);
            }
          } catch (localError) {
            // If localStorage merge fails, just use database wishlist
            setWishlistItems(dbWishlist);
          }
        } else {
          // User not logged in - load from localStorage
          try {
            const localData = window.localStorage.getItem("wishlistItems");
            setWishlistItems(localData ? JSON.parse(localData) : []);
          } catch (error) {
            console.error("Error retrieving wishlist from local storage", error);
            setWishlistItems([]);
          }
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
        // Fallback to localStorage on error
        try {
          const localData = window.localStorage.getItem("wishlistItems");
          setWishlistItems(localData ? JSON.parse(localData) : []);
        } catch (e) {
          setWishlistItems([]);
        }
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    };

    loadWishlist();
  }, [user?._id]); // Reload when user changes

  // Save wishlist to API (if logged in) or localStorage (if not logged in) whenever it changes
  useEffect(() => {
    // Skip saving on initial load
    if (isInitialLoad.current) return;

    const saveWishlist = async () => {
      try {
        if (user?._id) {
          // User is logged in - save to API
          await api.put(`/users/${user._id}/wishlist`, { wishlist: wishlistItems });
        } else {
          // User not logged in - save to localStorage
          window.localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
        }
      } catch (error) {
        console.error("Error saving wishlist:", error);
        // Fallback to localStorage on error
        try {
          window.localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
      }
    };

    saveWishlist();
  }, [wishlistItems, user?._id]);

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
