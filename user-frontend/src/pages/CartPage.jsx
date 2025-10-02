import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";
import { getImageUrl } from "../utils/imageUtils";


function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid gap-4 max-w-xl mx-auto">
          {cartItems.map((item, index) => (
            <div key={item.id || index} className="flex items-center gap-4 border p-4 rounded shadow">
              <img src={getImageUrl(item.image) || "https://placehold.co/80x80"} alt={item.alt} className="w-20 h-20 object-cover rounded" />
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p>{item.price}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p> 
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-2 py-1 bg-black text-white rounded hover:bg-red-600 text-sm mt-1">
                  Remove
                </button>
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
              Rs. {cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('Rs. ', '').replace(',', '')) * item.quantity, 0).toFixed(2)}
            </span>
          </div>
          <div>
          <button 
            className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium transition-colors" 
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
          <button
            onClick={() => navigate("/")}
            className="mt-4 p-2.5 bg-blue-500 text-white rounded hover:bg-blue-600">
            Continue Shopping
          </button>
        </div>
    </div>
  );
}

export default CartPage;
