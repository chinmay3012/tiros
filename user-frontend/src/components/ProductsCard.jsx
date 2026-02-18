import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUtils";
import SuccessNotification from "./SuccessNotification";

function ProductsCard({ id, image, images = [], alt, title, price, status = 'available', displayDescription, isHotSelling = false, isCreateHype = false }) {
  const [added, setAdded] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [showWishlistNotification, setShowWishlistNotification] = useState(false);
  const { addToCart, clearCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Prepare primary + secondary images (supports legacy single image field)
  const resolvedImages = [image, ...(Array.isArray(images) ? images : [])].filter(Boolean);
  const uniqueImages = [...new Set(resolvedImages)];
  const primaryImagePath = uniqueImages[0] || null;
  const hoverImagePath = uniqueImages[1] || null;
  const primaryImageSrc = getImageUrl(primaryImagePath) || "https://placehold.co/400x533";
  const hoverImageSrc = hoverImagePath ? getImageUrl(hoverImagePath) : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Disable for coming_soon and sold_out items
    if (status === 'coming_soon' || status === 'sold_out') return;

    addToCart({ id, image: primaryImagePath, alt, title, price, status });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000); // show "Added to Cart" for 2 seconds
  };

  const handleMoveToWishlist = (e) => {
    e.stopPropagation();
    // Only allow for coming_soon and sold_out items
    if (status !== 'coming_soon' && status !== 'sold_out') return;

    addToWishlist({ id, image: primaryImagePath, alt, title, price, status });
    setShowWishlistNotification(true);
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
      addToCart({ id, image: primaryImagePath, alt, title, price, status });

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

  const isDisabled = status === 'coming_soon' || status === 'sold_out';

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col h-full cursor-pointer overflow-hidden rounded-xl bg-transparent transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-white shrink-0">
        <img
          src={primaryImageSrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-out ${hoverImageSrc ? "opacity-100 group-hover:opacity-0" : ""} group-hover:scale-105`}
        />
        {hoverImageSrc && (
          <img
            src={hoverImageSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-contain opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-70 pointer-events-none" />
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
      <div className="flex-1 min-h-0 flex flex-col px-3 pt-2 pb-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-900 text-base flex-1 text-left" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.20em' }}>{title}</h3>
          <div className="ml-2">
            <p className="text-base text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{price}</p>
          </div>
        </div>
        {displayDescription ? (
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-600 flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{displayDescription}</p>
            {isCreateHype && (
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold text-black ml-2" style={{ backgroundColor: '#95C5F4', fontFamily: 'Poppins, sans-serif' }}>
                (2) Left
              </span>
            )}
          </div>
        ) : isCreateHype && (
          <div className="flex justify-end mt-1">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold text-black" style={{ backgroundColor: '#95C5F4', fontFamily: 'Poppins, sans-serif' }}>
              (2) Left
            </span>
          </div>
        )}
      </div>
      <div className="space-y-0 shrink-0">
        {status === 'coming_soon' || status === 'sold_out' ? (
          <button
            onClick={handleMoveToWishlist}
            disabled={isInWishlist(id)}
            className={`h-10 w-full rounded-t-lg flex items-center justify-center overflow-hidden transition-opacity ${isInWishlist(id) ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:opacity-80 cursor-pointer"
              } bg-transparent`}
          >
            <img
              src="/images/BUTTON-2 copy.png"
              alt="Move to Wishlist"
              className="pointer-events-none h-full w-auto max-w-full object-contain object-center"
              style={{ transform: "translateY(1px)" }}
            />
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={added || isDisabled}
            className={`h-10 w-full rounded-t-lg flex items-center justify-center overflow-hidden transition-opacity ${added || isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:opacity-80 cursor-pointer"
              } bg-transparent`}
          >
            <img
              src={getImageUrl("uploads/BUTTON-9.png")}
              alt="Add to Cart"
              className="pointer-events-none h-full w-auto max-w-full object-contain object-center"
              style={{ transform: "translateY(1px)" }}
            />
          </button>
        )}

        <button
          onClick={handleBuyNow}
          disabled={buyNowLoading || added || isDisabled}
          className={`h-10 w-full rounded-b-lg flex items-center justify-center overflow-hidden transition-opacity text-sm font-medium ${buyNowLoading || added || isDisabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-90 active:opacity-80 cursor-pointer"
            } bg-transparent`}
        >
          {buyNowLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-3 w-3 text-black shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : status === 'sold_out' ? (
            <img
              src="/images/BUTTON-5 copy.png"
              alt="Sold Out"
              className="pointer-events-none h-full w-auto max-w-full object-contain object-center"
              style={{ transform: "translateY(1px)" }}
            />
          ) : (
            <img
              src={getImageUrl("uploads/BUTTON-10.png")}
              alt="Buy Now"
              className="pointer-events-none h-full w-auto max-w-full object-contain object-center"
              style={{ transform: "translateY(1px)" }}
            />
          )}
        </button>
      </div>
      {added && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white text-black px-4 py-2 rounded shadow">Added to Cart</div>
        </div>
      )}
      <SuccessNotification
        message="Added to Wishlist!"
        show={showWishlistNotification}
        onClose={() => setShowWishlistNotification(false)}
      />
    </div>
  );
}

export default ProductsCard;
