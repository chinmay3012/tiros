import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerIcon from '../assets/hamburger';
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

    function Menu(){
        return (
            <>
                <button onClick={toggleMenu}>
                    <HamburgerIcon/>
                </button>
                {isMenuOpen && (
                    <div className={`fixed top-0 right-0 w-[55%] transition-transform duration-500 h-full z-50 ease-in-out bg-white
                    rounded-lg ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <button onClick={toggleMenu} className="absolute top-10 right-7">
                            <CloseButton/></button>
                        <div className="flex flex-col items-start p-4 space-y-5 mt-20 ">
                            <button onClick={() => handleNavigation("/")} className="text-gray-800 hover:text-blue-600 text-left">Home</button>
                            <button onClick={() => handleNavigation("/about")} className="text-gray-800 hover:text-blue-600 text-left">About</button>
                            <button onClick={() => handleNavigation("/cart")} className="text-gray-800 hover:text-blue-600 text-left">Cart</button>
                            <button onClick={() => handleNavigation("/orders")} className="text-gray-800 hover:text-blue-600 text-left">Orders</button>
                            <button onClick={() => handleNavigation("/account")} className="text-gray-800 hover:text-blue-600 text-left">Account</button>
                            <button onClick={() => handleNavigation("/checkout")} className="text-gray-800 hover:text-blue-600 text-left">Checkout</button>
                            <div className="pt-2">
                              <div className="text-xs text-gray-500 mb-1">Categories</div>
                              <div className="flex flex-col space-y-2">
                                {categories.map(c => (
                                  <button key={c._id} onClick={() => handleNavigation(`/categories/${c._id}`)} className="text-gray-800 hover:text-blue-600 text-left">{c.name}</button>
                                ))}
                                {categories.length===0 && (<span className="text-gray-400 text-sm">No categories</span>)}
                              </div>
                            </div>
                            {isAuthenticated && (
                              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-gray-800 hover:text-blue-600 text-left mt-4">
                                Log Out
                              </button>
                            )}
                        </div>
                    </div>
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