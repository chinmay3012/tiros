import { useState , useEffect , useRef } from "react";
import Marquee from "react-fast-marquee";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import Sidemenu from "./Sidemenu";
import LoginMobile from "./LoginMobile";
import LogoutMobile from "./LogoutMobile";
import CartPage from "../pages/CartPage";

function Navbar(){

    const [searchQuery, setSearchQuery] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isTopGearOpen, setIsTopGearOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { isAuthenticated, user, isLoading } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    // Refs for each dropdown to check for outside clicks
  const topGearRef = useRef(null);

  useEffect(()=>{
    (async()=>{
      try{
        const [categoriesRes, productsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        const categoriesList = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data?.categories || []);
        const productsList = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.products || []);
        setCategories(categoriesList);
        setAllProducts(productsList);
      }catch(e){ /* ignore */ }
    })();
    const handleClicksOutside = (event)=> {
        if(topGearRef.current && !topGearRef.current.contains(event.target)){
            setIsTopGearOpen(false);
        }
    }
    // Add event listener for clicks outside the dropdowns
    window.addEventListener("click" , handleClicksOutside);

    // Cleanup function to remove the event listener
    return () => {
        window.removeEventListener("click", handleClicksOutside);
    }
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

    // Function to toggle dropdowns
  const toggleDropdown = () => setIsTopGearOpen(!isTopGearOpen);

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
        <nav className="mt-6 flex sticky items-center justify-between px-4 mb-1 top-0 z-20 bg-white">
        {isLoading ? (
                      <p>Loading...</p>
                    ) : isAuthenticated ? (
                      <div className="flex items-center md:gap-4 gap-2">
                        <LogoutMobile />
                      </div>
                    ) : (
                      <LoginMobile />
                    )}
            <div className="ml-2">
                <a href="/" className="transition-colors duration-300 ease-in-out 
                hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-red-500 hover:to-green-500"
                style={{
                    fontFamily: 'Kode Mono, monospace',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize: '24px',
                    letterSpacing: '0%',
                    textAlign: 'center'
                }}>TIROS</a>
            </div>
            <div className="relative hidden md:flex text-sm" ref={topGearRef}>
            <button 
              className="flex items-center gap-1 focus:outline-none hover:text-green-600 transition-colors"
              onClick={toggleDropdown}
            >
              CATEGORIES 
              <svg className={`w-3 h-3 transition-transform duration-300 ${isTopGearOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isTopGearOpen && (
              <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md border border-gray-100 z-10 w-48">
                <ul className="py-2 text-gray-800">
                  {categories.map(c=> (
                    <li key={c._id}><button onClick={()=>{setIsTopGearOpen(false); navigate(`/categories/${c._id}`)}} className="block w-full text-left px-4 py-2 hover:bg-gray-100">{c.name}</button></li>
                  ))}
                  {categories.length===0 && (<li className="px-4 py-2 text-gray-400">No categories</li>)}
                </ul>
              </div>
            )}
          </div>
            {/* Search Icon */}
            <div className="flex items-center space-x-1">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer" onClick={()=>setSearchQuery(!searchQuery)}>
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* TODO: UI polish */}
          
          {/* <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A5 5 0 017 15h10a5 5 0 011.879 2.804M15 11a3 3 0 10-6 0" />
            </svg>
          </button> */}

              {isLoading ? (
                      <p>Loading...</p>
                    ) : isAuthenticated ? (
                      <div className="flex items-center md:gap-4 gap-2">
                        <LogoutButton />
                      </div>
                    ) : (
                      <LoginButton />
                    )}


          
          {isAuthenticated && (
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer" onClick={()=>navigate("/cart")}>
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4zM6 10v10h12V10H6zm6-6a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {cartItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                  {cartItems.reduce((sum, it)=> sum + (it.quantity||1), 0)}
                </span>
              )}
            </div>
          )}
          {isAuthenticated && (
            <button className="p-2 rounded hover:bg-gray-100 hidden md:inline-flex" onClick={()=>navigate('/account')}>
              <span className="text-sm">Account</span>
            </button>
          )}
            </div>


          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden pt-1.5">
            <Sidemenu />
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
                        src={product.image || "https://placehold.co/50x50"} 
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
        
        <hr style={{color : "lightgray"}} className="mt-5"></hr>

        <div className="bg-black text-white items-center font-normal flex p-1 mt-1">
        <Marquee className="space-x-2.5" ><span className="text-xs uppercase tracking-wider text-gray-200">NEW DROP - NOW LIVE !!</span></Marquee>
        <Marquee className="space-x-2.5" ><span className="text-xs uppercase tracking-wider text-gray-200">NEW DROP - NOW LIVE !!</span></Marquee>
        <Marquee className="space-x-2.5" ><span className="text-xs uppercase tracking-wider text-gray-200">NEW DROP - NOW LIVE !!</span></Marquee>
        </div>
        </>
    )
}

export default Navbar;