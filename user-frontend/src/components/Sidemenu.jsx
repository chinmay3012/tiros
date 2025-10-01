import { useState, useEffect } from 'react';
import HamburgerIcon from '../assets/hamburger';
import CloseButton from '../assets/cross';
import api from '../api/axios';

function Sidemenu(){

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    useEffect(()=>{ (async()=>{ try{ const { data } = await api.get('/categories'); setCategories(Array.isArray(data)?data:(data?.categories||[])); }catch{} })(); },[]);

    const toggleMenu = () => {
        console.log("Button clicked");
        setIsMenuOpen(!isMenuOpen);
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
                            <a href="/home" className="text-gray-800 hover:text-blue-600">Home</a>
                            <a href="/about" className="text-gray-800 hover:text-blue-600">About</a>
                            <a href="/cart" className="text-gray-800 hover:text-blue-600">Cart</a>
                            <a href="/orders" className="text-gray-800 hover:text-blue-600">Orders</a>
                            <a href="/account" className="text-gray-800 hover:text-blue-600">Account</a>
                            <a href="/checkout" className="text-gray-800 hover:text-blue-600">Checkout</a>
                            <div className="pt-2">
                              <div className="text-xs text-gray-500 mb-1">Categories</div>
                              <div className="flex flex-col space-y-2">
                                {categories.map(c => (
                                  <a key={c._id} href={`/categories/${c._id}`} className="text-gray-800 hover:text-blue-600">{c.name}</a>
                                ))}
                                {categories.length===0 && (<span className="text-gray-400 text-sm">No categories</span>)}
                              </div>
                            </div>
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