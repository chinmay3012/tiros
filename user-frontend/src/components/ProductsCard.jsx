import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUtils";

function ProductsCard({ id, image, alt, title, price }) {
  const [added, setAdded] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const { addToCart, clearCart } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ id ,image, alt, title, price });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000); // show "Added to Cart" for 2 seconds
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBuyNowLoading(true);
    
    try {
      // Clear existing cart and add only this item
      clearCart();
      addToCart({ id, image, alt, title, price });
      
      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error in buy now:', error);
    } finally {
      setBuyNowLoading(false);
    }
  };

  return (
    <div className="group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white relative">
      <div className="relative overflow-hidden aspect-[3/4] p-4 md:p-3">
        <img
          src={getImageUrl(image) || "https://placehold.co/400x533"}
          alt={alt}
          className="w-full h-full object-contain transition-transform duration-300 transform scale-90 md:scale-100 group-hover:scale-95 md:group-hover:scale-105"
        />
      </div>
      <div className="p-2 text-center">
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        <p className="text-base text-gray-700">{price}</p>
      </div>
      <div className="space-y-1">
        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`justify-center w-full py-2 px-2 rounded-t-lg flex items-center transition-colors text-sm ${
            added ? "bg-green-500" : "bg-black hover:bg-gray-800"
          } text-white cursor-pointer`}
        >
          {added ? "✓ Added to Cart" : "Add to Cart"}
        </button>
        
        <button
          onClick={handleBuyNow}
          disabled={buyNowLoading || added}
          className={`justify-center w-full py-2 px-2 rounded-b-lg flex items-center transition-opacity text-sm font-medium ${
            buyNowLoading || added 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:opacity-90 active:opacity-80 cursor-pointer"
          } bg-transparent`}
        >
          {buyNowLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <img
              src={import.meta.env.VITE_BUY_BUTTON_URL || "/images/buy-button.png"}
              alt="Buy Now"
              className="h-10 md:h-12 w-auto mx-auto pointer-events-none"
            />
          )}
        </button>
      </div>
      {added && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white text-black px-4 py-2 rounded shadow">Added to Cart</div>
        </div>
      )}
    </div>
  );
}

export default ProductsCard;
