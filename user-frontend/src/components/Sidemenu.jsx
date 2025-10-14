import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseButton from '../assets/cross';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Sidemenu(){
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    useEffect(()=>{ (async()=>{ try{ const { data } = await api.get('/categories'); setCategories(Array.isArray(data)?data:(data?.categories||[])); }catch{} })(); },[]);

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

    function Menu(){
        return (
            <>
                <button onClick={toggleMenu} className="p-2 rounded-full transition-colors hover:bg-[#95C5F4]">
                    <img src="/hamburger-icon.png" alt="Menu" className="w-8 h-8" />
                </button>
                {isMenuOpen && (
                    <>
                        {/* Menu Sidebar */}
                        <div className={`fixed top-0 left-0 w-[300px] md:w-[350px] transition-transform duration-500 h-full z-50 ease-in-out bg-white
                        shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        >
                            <button onClick={toggleMenu} className="absolute top-6 right-6 hover:bg-[#95C5F4]">
                                <CloseButton/>
                            </button>
                            <div className="flex flex-col items-start p-6 space-y-4 mt-16 overflow-y-auto max-h-[90vh]">
                                <button onClick={() => handleNavigation("/")} className="w-full text-gray-800 text-left font-bold text-base hover:bg-[#95C5F4] p-2 rounded">Home</button>
                                
                                <div className="pt-2 w-full border-t border-gray-200">
                                  <div className="flex flex-col space-y-3 pl-2">
                                    {categories.map(c => (
                                      <button key={c._id} onClick={() => handleNavigation(`/categories/${c._id}`)} className="w-full text-gray-800 text-left font-bold hover:bg-[#95C5F4] p-2 rounded">{c.name}</button>
                                    ))}
                                    {categories.length===0 && (<span className="text-gray-400 text-sm">No categories</span>)}
                                  </div>
                                </div>
                                
                                <button onClick={() => handleNavigation("/about")} className="w-full text-gray-800 text-left font-bold text-base hover:bg-[#95C5F4] p-2 rounded">About us</button>
                                <button onClick={() => handleNavigation("/contact")} className="w-full text-gray-800 text-left font-bold text-base hover:bg-[#95C5F4] p-2 rounded">Contact us</button>
                                
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