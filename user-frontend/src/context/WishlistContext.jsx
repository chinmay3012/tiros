import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();
const LOCAL_KEY = "wishlistItems";

function readLocalWishlist() {
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalWishlist(items) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(items || []));
  } catch {
    // ignore
  }
}

function mergeWishlists(dbWishlist = [], localWishlist = []) {
  const merged = Array.isArray(dbWishlist) ? [...dbWishlist] : [];
  const ids = new Set(merged.map((item) => String(item.id)));
  (localWishlist || []).forEach((localItem) => {
    if (!localItem?.id) return;
    if (!ids.has(String(localItem.id))) {
      merged.push({ ...localItem, id: String(localItem.id) });
      ids.add(String(localItem.id));
    }
  });
  return merged;
}

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => readLocalWishlist());
  const [loading, setLoading] = useState(true);
  const hydratedRef = useRef(false);
  const saveTimerRef = useRef(null);
  const userId = user?._id || null;

  const persistWishlist = useCallback(async (items, uid) => {
    writeLocalWishlist(items);
    if (!uid) return;
    try {
      await api.put(`/users/${uid}/wishlist`, { wishlist: items });
    } catch (error) {
      console.error("Error saving wishlist to API:", error);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    hydratedRef.current = false;

    const loadWishlist = async () => {
      setLoading(true);
      const localWishlist = readLocalWishlist();

      try {
        if (userId) {
          const response = await api.get(`/users/${userId}/wishlist`);
          const dbWishlist = response.data?.wishlist || [];
          const merged = mergeWishlists(dbWishlist, localWishlist);

          if (!cancelled) {
            setWishlistItems(merged);
            writeLocalWishlist(merged);
            if (localWishlist.length > 0) {
              await api.put(`/users/${userId}/wishlist`, { wishlist: merged }).catch(() => {});
            }
          }
        } else if (!cancelled) {
          setWishlistItems(localWishlist);
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
        if (!cancelled) setWishlistItems(localWishlist);
      } finally {
        if (!cancelled) {
          hydratedRef.current = true;
          setLoading(false);
        }
      }
    };

    loadWishlist();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      persistWishlist(wishlistItems, userId);
    }, 250);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [wishlistItems, userId, persistWishlist]);

  const addToWishlist = (product) => {
    if (!product?.id) return;
    setWishlistItems((prev) => {
      if (prev.some((item) => String(item.id) === String(product.id))) return prev;
      const next = [...prev, { ...product, id: String(product.id) }];
      writeLocalWishlist(next);
      return next;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => {
      const next = prev.filter((item) => String(item.id) !== String(productId));
      writeLocalWishlist(next);
      return next;
    });
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => String(item.id) === String(productId));

  const clearWishlist = () => {
    writeLocalWishlist([]);
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
