import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const LOCAL_KEY = "cartItems";

function readLocalCart() {
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(items || []));
  } catch {
    // ignore quota / private mode
  }
}

function mergeCarts(dbCart = [], localCart = []) {
  const merged = Array.isArray(dbCart) ? [...dbCart] : [];
  (localCart || []).forEach((localItem) => {
    if (!localItem?.id) return;
    const existingIndex = merged.findIndex((item) => String(item.id) === String(localItem.id));
    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...localItem,
        quantity: Math.max(
          Number(merged[existingIndex].quantity) || 1,
          Number(localItem.quantity) || 1
        ),
      };
    } else {
      merged.push(localItem);
    }
  });
  return merged;
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => readLocalCart());
  const [loading, setLoading] = useState(true);
  const cartItemsRef = useRef(cartItems);
  const hydratedRef = useRef(false);
  const saveTimerRef = useRef(null);
  const userId = user?._id || null;

  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  const persistCart = useCallback(async (items, uid) => {
    // Always mirror locally so refresh never loses items if API is slow/fails
    writeLocalCart(items);

    if (!uid) return;

    try {
      await api.put(`/users/${uid}/cart`, { cart: items });
    } catch (error) {
      console.error("Error saving cart to API:", error);
    }
  }, []);

  // Load cart when auth user changes
  useEffect(() => {
    let cancelled = false;
    hydratedRef.current = false;
    const uid = userId;

    const loadCart = async () => {
      setLoading(true);
      const localCart = readLocalCart();

      try {
        if (uid) {
          const response = await api.get(`/users/${uid}/cart`);
          const dbCart = response.data?.cart || [];
          const merged = mergeCarts(dbCart, localCart);

          if (!cancelled) {
            setCartItems(merged);
            writeLocalCart(merged);
            // Persist merge to API when local had extras
            if (localCart.length > 0) {
              await api.put(`/users/${uid}/cart`, { cart: merged }).catch(() => {});
            }
          }
        } else if (!cancelled) {
          setCartItems(localCart);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        if (!cancelled) setCartItems(localCart);
      } finally {
        if (!cancelled) {
          hydratedRef.current = true;
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Persist after hydration whenever cart changes (debounced)
  useEffect(() => {
    if (!hydratedRef.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      persistCart(cartItems, userId);
    }, 250);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [cartItems, userId, persistCart]);

  const addToCart = (product) => {
    if (!product?.id) return;
    setCartItems((prev) => {
      const existingItem = prev.find((item) => String(item.id) === String(product.id));
      const next = existingItem
        ? prev.map((item) =>
            String(item.id) === String(product.id)
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          )
        : [...prev, { ...product, id: String(product.id), quantity: 1 }];

      // Immediate local backup (don't wait for effect)
      writeLocalCart(next);
      return next;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => String(item.id) === String(productId));
      if (!existingItem) return prev;

      const next =
        existingItem.quantity === 1
          ? prev.filter((item) => String(item.id) !== String(productId))
          : prev.map((item) =>
              String(item.id) === String(productId)
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );

      writeLocalCart(next);
      return next;
    });
  };

  const clearCart = () => {
    writeLocalCart([]);
    setCartItems([]);
  };

  // Sync cart items with current product data from backend
  const syncCartWithProducts = useCallback(async () => {
    const currentCartItems = cartItemsRef.current;
    if (currentCartItems.length === 0) return;

    try {
      const productResponses = await Promise.all(
        currentCartItems.map((item) =>
          api.get(`/products/${item.id}`).then((res) => ({ ok: true, data: res.data })).catch((err) => ({
            ok: false,
            status: err.response?.status,
            data: null,
          }))
        )
      );

      setCartItems((prev) => {
        const updatedCart = [];
        let hasChanges = false;

        prev.forEach((cartItem, index) => {
          const result = productResponses[index];

          // Only remove when product is confirmed missing/inactive — never on network errors
          if (result?.ok && result.data) {
            const currentProduct = result.data;
            if (currentProduct.isActive === false) {
              hasChanges = true;
              return;
            }

            const updatedItem = {
              ...cartItem,
              id: String(cartItem.id),
              price: `Rs. ${currentProduct.price}`,
              title: currentProduct.name,
              image:
                currentProduct.image ||
                (currentProduct.images && currentProduct.images[0]) ||
                cartItem.image,
              alt: currentProduct.name,
              status: currentProduct.status || "available",
              quantity: cartItem.quantity,
            };

            if (
              updatedItem.price !== cartItem.price ||
              updatedItem.title !== cartItem.title ||
              updatedItem.image !== cartItem.image ||
              updatedItem.status !== cartItem.status
            ) {
              hasChanges = true;
            }
            updatedCart.push(updatedItem);
            return;
          }

          if (result?.status === 404) {
            hasChanges = true;
            return;
          }

          // Keep item on transient failures
          updatedCart.push(cartItem);
        });

        if (!hasChanges) return prev;
        writeLocalCart(updatedCart);
        return updatedCart;
      });
    } catch (error) {
      console.error("Error syncing cart with products:", error);
    }
  }, []);

  const checkout = async ({ address, payment, couponCode } = {}) => {
    const items = cartItems
      .filter((item) => !item.status || item.status !== "sold_out")
      .map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: Number(String(item.price).replace("Rs. ", "").replace(",", "")),
      }));
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const payload = {
      userId: user?._id,
      items,
      totalAmount: total,
      shippingAddress: address
        ? `${address.name}, ${address.street}, ${address.city}, ${address.zip}, ${address.country}, ${address.phone}`
        : undefined,
      payment,
      couponCode: couponCode || undefined,
    };
    const res = await api.post("/orders", payload);
    return res.data;
  };

  return (
    <CartContext.Provider
      value={{ cartItems, loading, addToCart, removeFromCart, clearCart, checkout, syncCartWithProducts }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
