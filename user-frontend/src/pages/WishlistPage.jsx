import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import { getImageUrl } from "../utils/imageUtils";
import SuccessNotification from "../components/SuccessNotification";
import api from "../api/axios";

function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [itemsWithStatus, setItemsWithStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest product status for wishlist items
  useEffect(() => {
    if (!isAuthenticated || wishlistItems.length === 0) {
      setItemsWithStatus(wishlistItems);
      setLoading(false);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        // Fetch all products to get latest status
        const res = await api.get('/products');
        const allProducts = Array.isArray(res.data) ? res.data : (res.data?.products || []);
        
        // Map wishlist items with latest status from backend
        const updatedItems = wishlistItems.map(wishlistItem => {
          const latestProduct = allProducts.find(p => p._id === wishlistItem.id);
          if (latestProduct) {
            return {
              ...wishlistItem,
              status: latestProduct.status || wishlistItem.status || 'available',
              price: `Rs. ${latestProduct.price}` || wishlistItem.price,
              title: latestProduct.name || wishlistItem.title,
              image: latestProduct.image || wishlistItem.image
            };
          }
          return wishlistItem;
        });

        if (isMounted) {
          setItemsWithStatus(updatedItems);
        }
      } catch (error) {
        console.error('Failed to fetch product status:', error);
        // Fallback to wishlist items if fetch fails
        if (isMounted) {
          setItemsWithStatus(wishlistItems);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => { isMounted = false };
  }, [wishlistItems, isAuthenticated]);

  const handleMoveToCart = (item) => {
    // Only move if item is available
    if (item.status === 'available') {
      addToCart({ id: item.id, image: item.image, alt: item.alt, title: item.title, price: item.price, status: item.status });
      // Remove from wishlist when moved to cart
      removeFromWishlist(item.id);
      setNotificationMessage("Moved to Cart!");
      setShowNotification(true);
    }
  };

  const handleRemoveFromWishlist = (itemId) => {
    removeFromWishlist(itemId);
    setNotificationMessage("Removed from Wishlist");
    setShowNotification(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-6 text-center">Wishlist</h1>
          <p className="text-xl text-gray-600 mb-4">Please log in to view your wishlist</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors hover:bg-[#95C5F4]"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Your Wishlist</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Wishlist</h1>

      {itemsWithStatus.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <p className="text-xl text-gray-600 mb-4">Your wishlist is empty</p>
          <p className="text-gray-500 mb-6">Add some products to your wishlist!</p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors hover:bg-[#95C5F4]"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid gap-4 max-w-xl mx-auto">
          {itemsWithStatus.map((item, index) => (
            <div key={item.id || index} className="flex items-center gap-4 border p-4 rounded shadow">
              <img 
                src={getImageUrl(item.image) || "https://placehold.co/80x80"} 
                alt={item.alt} 
                className="w-20 h-20 object-cover rounded cursor-pointer"
                onClick={() => navigate(`/products/${item.id}`)}
              />
              <div className="flex-1">
                <h3 
                  className="font-semibold text-lg cursor-pointer hover:text-green-600"
                  onClick={() => navigate(`/products/${item.id}`)}
                >
                  {item.title}
                </h3>
                <p>{item.price}</p>
                {item.status && (
                  <p className="text-xs text-gray-500 capitalize">
                    Status: {item.status.replace('_', ' ')}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  {item.status === 'available' && (
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm hover:bg-[#95C5F4]"
                    >
                      Move to Cart
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SuccessNotification
        message={notificationMessage}
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}

export default WishlistPage;
