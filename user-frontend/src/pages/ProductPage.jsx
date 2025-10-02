import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductsCard from "../components/ProductsCard";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUtils";

function ProductPage(){
  const { id } = useParams();
  const { addToCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  // Load product details
  useEffect(()=>{
    let isMounted = true;
    (async ()=>{
      try{
        const res = await api.get(`/products/${id}`);
        if(isMounted){ setProduct(res.data); }
      }catch(err){
        setError("Failed to load product");
      }finally{
        if(isMounted) setLoading(false);
      }
    })();
    return ()=>{ isMounted = false };
  },[id]);

  // Load suggested products
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get('/products');
        if (isMounted) {
          const allProducts = Array.isArray(res.data) ? res.data : (res.data?.products || []);
          
          // Filter out current product and get random suggestions
          const otherProducts = allProducts.filter(p => p._id !== id);
          
          // Shuffle array and take first 4 products
          const shuffled = otherProducts.sort(() => 0.5 - Math.random());
          const suggestions = shuffled.slice(0, 4);
          
          setSuggestedProducts(suggestions);
        }
      } catch (err) {
        console.error("Failed to load suggested products:", err);
      } finally {
        if (isMounted) setSuggestionsLoading(false);
      }
    })();
    return () => { isMounted = false };
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ 
      id: product._id, 
      image: getImageUrl(product.image), 
      alt: product.name, 
      title: product.name, 
      price: `Rs. ${product.price}` 
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBuyNowLoading(true);
    
    try {
      // Clear existing cart and add only this item
      clearCart();
      addToCart({ 
        id: product._id, 
        image: getImageUrl(product.image), 
        alt: product.name, 
        title: product.name, 
        price: `Rs. ${product.price}` 
      });
      
      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error in buy now:', error);
    } finally {
      setBuyNowLoading(false);
    }
  };

  if(loading) return <div className="p-8 text-center">Loading...</div>;
  if(error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if(!product) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <img src={getImageUrl(product.image) || "https://placehold.co/600x600"} alt={product.name} className="w-full object-cover rounded" />
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-green-600 mb-2">Rs. {product.price}</p>
          
          {/* Product Features */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              {/* <span className="text-green-600 mr-2">✓</span> */}
              {/* <span className="text-sm text-gray-600">Free shipping on orders above Rs. 500</span> */}
            </div>
            <div className="flex items-center mb-2">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-sm text-gray-600">Easy returns within 7 days</span>
            </div>
            <div className="flex items-center mb-4">
              <span className="text-green-600 mr-2">✓</span>
              <span className="text-sm text-gray-600">Secure payment with Razorpay</span>
            </div>
          </div>
          
          {product.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={addedToCart}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                addedToCart 
                  ? "bg-green-500 text-white cursor-not-allowed" 
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              }`}
            >
              {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={buyNowLoading || addedToCart}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                buyNowLoading || addedToCart
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white"
              }`}
            >
              {buyNowLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Buy Now"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Products Section */}
      {suggestedProducts.length > 0 && (
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You Might Also Like</h2>
            <p className="text-gray-600">Discover more products you might be interested in</p>
          </div>
          
          {suggestionsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Loading suggestions...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {suggestedProducts.map((suggestedProduct) => (
                <div 
                  key={suggestedProduct._id} 
                  onClick={() => navigate(`/products/${suggestedProduct._id}`)} 
                  className="cursor-pointer"
                >
                  <ProductsCard 
                    id={suggestedProduct._id}
                    image={suggestedProduct.image}
                    alt={suggestedProduct.name}
                    title={suggestedProduct.name}
                    price={`Rs. ${suggestedProduct.price}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default ProductPage; 