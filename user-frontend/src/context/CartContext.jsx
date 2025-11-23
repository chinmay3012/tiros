import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const cartItemsRef = useRef(cartItems);
  const isInitialLoad = useRef(true);
  
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  // Load cart from API when user logs in, or from localStorage if not logged in
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (user?._id) {
          // User is logged in - load from API
          const response = await api.get(`/users/${user._id}/cart`);
          const dbCart = response.data.cart || [];
          
          // Check if there's a localStorage cart to merge
          try {
            const localData = window.localStorage.getItem("cartItems");
            const localCart = localData ? JSON.parse(localData) : [];
            
            if (localCart.length > 0) {
              // Merge localStorage cart with database cart
              const mergedCart = [...dbCart];
              localCart.forEach((localItem) => {
                const existingIndex = mergedCart.findIndex(item => item.id === localItem.id);
                if (existingIndex >= 0) {
                  // Item exists in both - use database quantity but allow increment
                  mergedCart[existingIndex].quantity = Math.max(
                    mergedCart[existingIndex].quantity,
                    localItem.quantity
                  );
                } else {
                  // New item from localStorage - add it
                  mergedCart.push(localItem);
                }
              });
              
              setCartItems(mergedCart);
              // Save merged cart to database
              await api.put(`/users/${user._id}/cart`, { cart: mergedCart });
              // Clear localStorage cart after merge
              window.localStorage.removeItem("cartItems");
            } else {
              setCartItems(dbCart);
            }
          } catch (localError) {
            // If localStorage merge fails, just use database cart
            setCartItems(dbCart);
          }
        } else {
          // User not logged in - load from localStorage
          try {
            const localData = window.localStorage.getItem("cartItems");
            setCartItems(localData ? JSON.parse(localData) : []);
          } catch (error) {
            console.error("Error retrieving cart from local storage", error);
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Fallback to localStorage on error
        try {
          const localData = window.localStorage.getItem("cartItems");
          setCartItems(localData ? JSON.parse(localData) : []);
        } catch (e) {
          setCartItems([]);
        }
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    };

    loadCart();
  }, [user?._id]); // Reload when user changes

  // Save cart to API (if logged in) or localStorage (if not logged in) whenever it changes
  useEffect(() => {
    // Skip saving on initial load
    if (isInitialLoad.current) return;

    const saveCart = async () => {
      try {
        if (user?._id) {
          // User is logged in - save to API
          await api.put(`/users/${user._id}/cart`, { cart: cartItems });
        } else {
          // User not logged in - save to localStorage
          window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error("Error saving cart:", error);
        // Fallback to localStorage on error
        try {
          window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
      }
    };

    saveCart();
  }, [cartItems, user?._id]);

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

  // Sync cart items with current product data from backend
  const syncCartWithProducts = useCallback(async () => {
    const currentCartItems = cartItemsRef.current;

    if (currentCartItems.length === 0) return;

    try {
      // Fetch current product data for all items in cart
      const productPromises = currentCartItems.map((item) =>
        api.get(`/products/${item.id}`).catch((err) => {
          // Return null if product not found (deleted) or any other error
          if (err.response?.status === 404) {
            return null; // Product deleted
          }
          console.warn(`Error fetching product ${item.id}:`, err);
          return null;
        })
      );

      const productResponses = await Promise.all(productPromises);
      
      setCartItems((prev) => {
        const updatedCart = [];
        let hasChanges = false;
        const removedProducts = [];
        const updatedProducts = [];

        prev.forEach((cartItem, index) => {
          const productResponse = productResponses[index];
          
          // If product was deleted (404 or null), remove it from cart
          if (!productResponse || !productResponse.data) {
            hasChanges = true;
            removedProducts.push(cartItem.title || cartItem.id);
            return; // Skip this item (removed from cart)
          }

          const currentProduct = productResponse.data;
          
          // Check if product is still active
          if (currentProduct.isActive === false) {
            hasChanges = true;
            removedProducts.push(currentProduct.name || cartItem.title || cartItem.id);
            return; // Skip inactive products
          }

          // Prepare updated cart item with current product data
          const updatedItem = {
            ...cartItem,
            // Update price if changed
            price: `Rs. ${currentProduct.price}`,
            // Update title if changed
            title: currentProduct.name,
            // Update image if changed (use primary image or first from images array)
            image: currentProduct.image || (currentProduct.images && currentProduct.images.length > 0 && currentProduct.images[0]) || cartItem.image,
            // Update alt text
            alt: currentProduct.name,
            // Update status if changed
            status: currentProduct.status || 'available',
            // Preserve quantity
            quantity: cartItem.quantity,
          };

          // Check if any field actually changed
          const priceChanged = updatedItem.price !== cartItem.price;
          const titleChanged = updatedItem.title !== cartItem.title;
          const imageChanged = updatedItem.image !== cartItem.image;
          const statusChanged = updatedItem.status !== cartItem.status;

          if (priceChanged || titleChanged || imageChanged || statusChanged) {
            hasChanges = true;
            if (priceChanged) {
              updatedProducts.push({ name: updatedItem.title, change: 'price' });
            }
            if (titleChanged) {
              updatedProducts.push({ name: updatedItem.title, change: 'name' });
            }
            if (statusChanged) {
              updatedProducts.push({ name: updatedItem.title, change: 'status' });
            }
          }

          updatedCart.push(updatedItem);
        });

        // Only update state if there were actual changes
        if (hasChanges) {
          // Log changes for debugging (could be used for notifications in the future)
          if (removedProducts.length > 0) {
            console.log('Products removed from cart:', removedProducts);
          }
          if (updatedProducts.length > 0) {
            console.log('Products updated in cart:', updatedProducts);
          }
          return updatedCart;
        }
        
        return prev;
      });
    } catch (error) {
      console.error("Error syncing cart with products:", error);
      // Don't throw - allow cart to continue functioning even if sync fails
    }
  }, []); // Empty deps - uses ref for cart items

  const checkout = async ({ address, payment, couponCode } = {}) => {
    // Build simple order payload - filter out sold out items
    const items = cartItems
      .filter((item) => !item.status || item.status !== 'sold_out')
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
      shippingAddress: address ? `${address.name}, ${address.street}, ${address.city}, ${address.zip}, ${address.country}, ${address.phone}` : undefined,
      payment,
      couponCode: couponCode || undefined,
    };
    const res = await api.post("/orders", payload);
    clearCart();
    return res.data;
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, checkout, syncCartWithProducts }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);