import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseButton from '../assets/cross';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Sidemenu(){
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const menuRef = useRef(null);
    
    useEffect(()=>{ (async()=>{ try{ const { data } = await api.get('/categories'); setCategories(Array.isArray(data)?data:(data?.categories||[])); }catch{} })(); },[]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        console.log("Button clicked");
        setIsMenuOpen(!isMenuOpen);
    }

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false); // Close menu after navigation
    }

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    }

    const handleLogin = () => {
        navigate('/login');
        setIsMenuOpen(false);
    }

    const handleAboutUs = () => {
        setIsMenuOpen(false);
        navigate('/');
        // Wait for navigation to complete, then scroll based on screen size
        setTimeout(() => {
            const isMobile = window.innerWidth < 768;
            const section = document.getElementById(isMobile ? 'about-us-section' : 'footer-section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    const toggleCategoryExpansion = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    }

    const handleSubcategoryClick = (categoryId, subcategorySlug) => {
        navigate(`/categories/${categoryId}/${subcategorySlug}`);
        setIsMenuOpen(false);
    }

    function Menu(){
        return (
            <>
                <button onClick={toggleMenu} className="p-2 rounded-full transition-colors hover:bg-[#95C5F4]">
                    <img src="/hamburger-icon.png" alt="Menu" className="w-8 h-8" />
                </button>
                {isMenuOpen && (
                    <>
                        {/* Menu Sidebar */}
                        <div 
                            ref={menuRef}
                            className={`fixed top-0 left-0 w-[300px] md:w-[350px] transition-transform duration-500 h-full z-50 ease-in-out bg-white
                            shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        >
                            <button onClick={toggleMenu} className="absolute top-6 right-6 hover:bg-[#95C5F4]">
                                <CloseButton/>
                            </button>
                            <div className="flex flex-col items-start p-6 space-y-4 mt-16 overflow-y-auto max-h-[90vh]">
                                <button onClick={() => handleNavigation("/")} className="w-full text-gray-800 text-left font-bold text-base hover:bg-[#95C5F4] p-2 rounded">Home</button>
                                
                                <div className="pt-2 w-full border-t border-gray-200">
                                  <div className="flex flex-col space-y-2 pl-2">
                                    {categories.map(c => (
                                      <div key={c._id} className="w-full">
                                        <div className="flex items-center justify-between">
                                          <button 
                                            onClick={() => handleNavigation(`/categories/${c._id}`)} 
                                            className="flex-1 text-gray-800 text-left font-bold hover:bg-[#95C5F4] p-2 rounded"
                                          >
                                            {c.name}
                                          </button>
                                          {c.subcategories && c.subcategories.length > 0 && (
                                            <button
                                              onClick={() => toggleCategoryExpansion(c._id)}
                                              className="p-1 hover:bg-[#95C5F4] rounded"
                                            >
                                              {expandedCategories.has(c._id) ? (
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                              ) : (
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                              )}
                                            </button>
                                          )}
                                        </div>
                                        
                                        {/* Subcategories Dropdown */}
                                        {expandedCategories.has(c._id) && c.subcategories && c.subcategories.length > 0 && (
                                          <div className="ml-4 mt-1 space-y-1">
                                            {c.subcategories.filter(sub => sub.isActive).map(subcategory => (
                                              <button
                                                key={subcategory._id}
                                                onClick={() => handleSubcategoryClick(c._id, subcategory.slug)}
                                                className="w-full text-gray-600 text-left text-sm hover:bg-[#95C5F4] p-2 rounded pl-4"
                                              >
                                                {subcategory.name}
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    {categories.length===0 && (<span className="text-gray-400 text-sm">No categories</span>)}
                                  </div>
                                </div>
                                
                                {/* About Us and Contact Us temporarily disabled for Razorpay compliance */}
                                {false && (
                                    <>
                                        <button 
                                            onClick={handleAboutUs} 
                                            className="w-full text-gray-800 text-left font-bold text-base hover:bg-[#95C5F4] p-2 rounded"
                                        >
                                            About us
                                        </button>
                                        <button 
                                            onClick={() => handleNavigation("/contact")} 
                                            className="w-full text-gray-800 text-left font-bold text-base hover:bg-[#95C5F4] p-2 rounded"
                                        >
                                            Contact us
                                        </button>
                                    </>
                                )}
                                
                                {isAuthenticated && (
                                    <button onClick={() => handleNavigation("/account")} className="w-full text-gray-800 text-left font-bold text-base hover:bg-[#95C5F4] p-2 rounded">Account</button>
                                )}
                                
                                {/* Login/Logout Section */}
                                <div className="pt-2 w-full border-t border-gray-200">
                                  {isAuthenticated ? (
                                    <button onClick={handleLogout} className="w-full text-red-600 hover:text-red-700 text-left font-medium text-base hover:bg-[#95C5F4] p-2 rounded">
                                      Log Out
                                    </button>
                                  ) : (
                                    <button onClick={handleLogin} className="w-full text-green-600 hover:text-green-700 text-left font-medium text-base hover:bg-[#95C5F4] p-2 rounded">
                                      Login
                                    </button>
                                  )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </>
        ) 
    }

    return (
    <>
        <Menu/>
    </>
    )
}

export default Sidemenu;