import { useState , useEffect } from "react";
import Marquee from "react-fast-marquee";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUtils";

import Sidemenu from "./Sidemenu";

function Navbar(){

    const [searchQuery, setSearchQuery] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { isAuthenticated } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

  useEffect(()=>{
    (async()=>{
      try{
        const productsRes = await api.get('/products');
        const productsList = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.products || []);
        setAllProducts(productsList);
      }catch(e){ /* ignore */ }
    })();
  } , [])

  // Search suggestions effect
  useEffect(() => {
    if (searchInput.length > 1) {
      const suggestions = allProducts
        .filter(product => 
          product.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchInput.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 suggestions
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchInput, allProducts]);

  // Search functions
  const handleSearch = (query = searchInput) => {
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/');
    }
    setSearchQuery(false);
    setSearchInput("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (product) => {
    navigate(`/products/${product._id}`);
    setSearchQuery(false);
    setSearchInput("");
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setSearchQuery(false);
      setSearchInput("");
      setShowSuggestions(false);
    }
  };

    return(
        <>
        <style>
        {`
          /* Custom keyframes for the slow spin animation */
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          /* Custom class to apply the animation */
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          
          /* Custom transition for search bar */
          .search-bar-enter {
            opacity: 0;
            transform: translateY(-20px);
          }
          .search-bar-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 300ms, transform 300ms;
          }
          .search-bar-exit {
            opacity: 1;
            transform: translateY(0);
          }
          .search-bar-exit-active {
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 300ms, transform 300ms;
          }
        `}
      </style>
        <nav className="mt-2 flex sticky items-center justify-between px-4 py-2 top-0 z-20 bg-white">
            {/* Hamburger Icon - Left Side */}
            <div className="flex items-center">
              <Sidemenu />
            </div>

            {/* TOPSHOT Logo - Center */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <a href="/" className="transition-colors duration-300 ease-in-out 
                hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-red-500 hover:to-green-500"
                style={{
                    fontFamily: 'Kode Mono, monospace',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: '24px',
                    letterSpacing: '0%',
                    textAlign: 'center'
                }}>TOPSHOT</a>
            </div>

            {/* Right Side - Search and Cart */}
            <div className="flex items-center space-x-1">
            <button className="p-2 rounded-full hover:bg-[#95C5F4] transition-colors hover:cursor-pointer" onClick={()=>setSearchQuery(!searchQuery)}>
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {isAuthenticated && (
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer" onClick={()=>navigate("/cart")}>
                <img src="/cart-icon.png" alt="Cart" className="w-5 h-5" />
              </button>
              {cartItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full">
                  {cartItems.reduce((sum, it)=> sum + (it.quantity||1), 0)}
                </span>
              )}
            </div>
          )}
            </div>
        </nav>

        {/*Search Bar*/} 
        {searchQuery &&(
            <div className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-center 
            transition-all duration-300 ease-in-out search-bar-enter-active sticky top-16 z-10 relative">
            <div className="flex-grow max-w-xl relative">
              <input 
                id="search-input" 
                type="text" 
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setShowSuggestions(searchInput.length > 1)}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-20 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSuggestionClick(product)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                    >
                      <img 
                        src={getImageUrl(product.image) || "https://placehold.co/50x50"} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">Rs. {product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
              onClick={handleSearch}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button 
              className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
              onClick={() => { setSearchQuery(false); setSearchInput(""); setShowSuggestions(false); }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>  
        )}
        
        <hr style={{color : "lightgray"}} className="mt-0"></hr>

        <div className="bg-black text-white items-center font-normal flex p-1 mt-1">
        <Marquee className="space-x-2.5" ><span className="text-xs uppercase tracking-wider text-gray-200">NEW DROP - NOW LIVE !!</span></Marquee>
        <Marquee className="space-x-2.5" ><span className="text-xs uppercase tracking-wider text-gray-200">NEW DROP - NOW LIVE !!</span></Marquee>
        <Marquee className="space-x-2.5" ><span className="text-xs uppercase tracking-wider text-gray-200">NEW DROP - NOW LIVE !!</span></Marquee>
        </div>
        </>
    )
}

export default Navbar;