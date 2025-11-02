import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUtils";

function ProductsCard({ id, image, alt, title, price, status = 'available', displayDescription, isHotSelling = false }) {
  const [added, setAdded] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const { addToCart, clearCart } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Disable for non-available products
    if (status !== 'available') return;
    
    addToCart({ id ,image, alt, title, price });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000); // show "Added to Cart" for 2 seconds
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    
    // Disable for non-available products
    if (status !== 'available') return;
    
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

  const handleCardClick = () => {
    // Navigate to product page when clicking on the card
    navigate(`/products/${id}`);
  };

  const isDisabled = status !== 'available';

  return (
    <div 
      onClick={handleCardClick}
      className="group rounded-lg bg-white relative cursor-pointer"
    >
      <div className="relative h-50 pt-1 pb-1 px-0.5">
        <img
          src={getImageUrl(image) || "https://placehold.co/400x533"}
          alt={alt}
          className="w-full h-full object-contain transition-transform duration-300 aspect-[1/2]"
        />
        {/* Status Badge - Only for coming_soon, removed for sold_out */}
        {status === 'coming_soon' && (
          <div className="absolute top-2 left-2 z-20">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold text-white shadow-md bg-yellow-500">
              ⏳ Coming Soon
            </span>
          </div>
        )}
        {/* Hot Selling Badge */}
        {isHotSelling && (
          <div className="absolute top-2 right-2 z-20">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-red-600 shadow-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
              HOT SELLING
            </span>
          </div>
        )}
      </div>
      <div className="px-3 pt-2 pb-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-900 text-base flex-1 text-left" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.20em' }}>{title}</h3>
          <p className="text-base text-gray-700 ml-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{price}</p>
        </div>
        {displayDescription && (
          <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{displayDescription}</p>
        )}
      </div>
      <div className="space-y-0">
        <button
          onClick={handleAddToCart}
          disabled={added || isDisabled}
          className={`justify-center w-full rounded-t-lg flex items-center transition-opacity ${
            added || isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:opacity-80 cursor-pointer"
          } bg-transparent`}
        >
          <img
            src="/images/BUTTON-2 copy.png"
            alt="Add to Cart"
            className="mx-auto pointer-events-none h-auto w-auto sm:h-12"
          />
        </button>
        
        <button
          onClick={handleBuyNow}
          disabled={buyNowLoading || added || isDisabled}
          className={`justify-center w-full py-1 px-2 rounded-b-lg flex items-center transition-opacity text-sm font-medium ${
            buyNowLoading || added || isDisabled
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
          ) : status === 'sold_out' ? (
            <>
              <img
                src="/images/BUTTON-5 copy.png"
                alt="Sold Out"
                className="mx-auto pointer-events-none h-auto w-auto sm:h-12 block sm:hidden"
              />
              <img
                src="/images/BUTTON-5 copy.png"
                alt="Sold Out"
                className="mx-auto pointer-events-none h-auto w-auto sm:h-12 hidden sm:block"
              />
            </>
          ) : (
            <>
              <img
                src="/images/BUTTON-3 copy.png"
                alt="Buy Now"
                className="mx-auto pointer-events-none h-auto w-auto sm:h-12 block sm:hidden"
              />
              <img
                src={import.meta.env.VITE_BUY_BUTTON_URL || "/images/buy-button.png"}
                alt="Buy Now"
                className="mx-auto pointer-events-none h-auto w-auto sm:h-12 hidden sm:block"
              />
            </>
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
