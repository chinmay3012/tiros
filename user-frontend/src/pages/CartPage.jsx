import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { getImageUrl } from "../utils/imageUtils";


function CartPage() {
  const { cartItems, addToCart, removeFromCart, syncCartWithProducts } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);

  // Sync cart with current product data when page loads
  useEffect(() => {
    if (cartItems.length > 0) {
      setSyncing(true);
      syncCartWithProducts().finally(() => setSyncing(false));
    }
  }, []); // Only run on mount

  // Also sync when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && cartItems.length > 0) {
        syncCartWithProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cartItems.length, syncCartWithProducts]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Cart</h1>
      {syncing && (
        <div className="max-w-xl mx-auto mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 text-center">
          Updating cart with latest product information...
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors hover:bg-[#95C5F4]"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid gap-4 max-w-xl mx-auto">
          {cartItems.map((item, index) => (
            <div key={item.id || index} className="flex items-center gap-4 border p-4 rounded shadow">
              <img src={getImageUrl(item.image) || "https://placehold.co/80x80"} alt={item.alt} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p>{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center border border-black bg-white rounded hover:bg-gray-100 active:bg-gray-200 text-black text-lg font-medium transition-colors"
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] text-center font-medium tabular-nums">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => addToCart({ id: item.id, image: item.image, alt: item.alt, title: item.title, price: item.price, status: item.status })}
                    className="w-8 h-8 flex items-center justify-center border border-black bg-white rounded hover:bg-gray-100 active:bg-gray-200 text-black text-lg font-medium transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="max-w-xl mx-auto mt-8 p-4 border rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Cart Summary</h2>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Total:</span>
            <span className="font-medium">
              Rs. {cartItems.filter((item) => !item.status || item.status !== 'sold_out').reduce((sum, item) => sum + parseFloat(item.price.replace('Rs. ', '').replace(',', '')) * item.quantity, 0).toFixed(2)}
            </span>
          </div>
          <div>
          <button 
            className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium transition-colors hover:bg-[#95C5F4]" 
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login');
              } else {
                navigate("/checkout");
              }
            }}
          >
            {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
          </button>
        </div>
        </div>
      )}

        <div className="flex justify-center">
          {/* <button
            onClick={() => navigate("/")}
            className="mt-4 p-2.5 bg-blue-500 text-white rounded hover:bg-blue-600">
            Continue Shopping
          </button> */}
        </div>
    </div>
  );
}

export default CartPage;
