
import { Link } from "react-router-dom";

function Footer(){
        return (
            <footer id="footer-section" className="mt-0 border-t border-gray-800" style={{ backgroundColor: 'hsl(220, 13%, 13%)', color: 'hsl(0, 0%, 95%)', fontFamily: 'Poppins, sans-serif' }}>
            <div className="container mx-auto px-4 py-12">
                {/* Four-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
                    
                    {/* Brand Column */}
                    <div className="col-span-1">
                        <h2 className="mb-6 text-white" style={{ 
                            fontFamily: 'Kode Mono, monospace',
                            fontWeight: 500,
                            fontSize: '60px',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            textAlign: 'left'
                        }}>TOPSHOT</h2>
                        
                        {/* Social Media Icons */}
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <a 
                                    href="https://twitter.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on X/Twitter"
                                    className="w-10 h-10 bg-white rounded flex items-center justify-center hover:opacity-80 transition-opacity"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'hsl(220, 13%, 13%)' }}>
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </a>
                                <a 
                                    href="https://www.instagram.com/topshot_padel/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on Instagram"
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'hsl(220, 13%, 13%)' }}>
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </div>
                                    <span style={{ 
                                        fontFamily: 'Kode Mono, monospace',
                                        color: '#FFFFFF',
                                        fontSize: '14px'
                                    }}>topshot_padel</span>
                                </a>
                            </div>
                            <a 
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=Topshotinfra@gmail.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Send us an email"
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'hsl(220, 13%, 13%)' }}>
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </div>
                                <span style={{ 
                                    fontFamily: 'Kode Mono, monospace',
                                    color: '#FFFFFF',
                                    fontSize: '14px'
                                }}>Topshotinfra@gmail.com</span>
                            </a>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <a 
                                    href="tel:+919266987400" 
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                    aria-label="Call us"
                                >
                                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'hsl(220, 13%, 13%)' }}>
                                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                        </svg>
                                    </div>
                                    <span style={{ 
                                        fontFamily: 'Kode Mono, monospace',
                                        color: '#FFFFFF',
                                        fontSize: '14px'
                                    }}>(+91)-9266-987400</span>
                                </a>
                                <p className="text-sm ml-12" style={{ color: 'hsl(0, 0%, 60%)' }}>NEW DELHI, INDIA</p>
                            </div>
                            <div style={{ color: 'hsl(0, 0%, 60%)' }}>
                                <p className="text-sm">Mon-Fri: 9AM - 6PM EST</p>
                                <p className="text-sm">Sat-Sun: 10AM - 4PM EST</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Story Column */}
                    <div className="col-span-1 lg:col-span-2 lg:mr-8">
                        <h3 className="font-semibold mb-4 text-white">OUR STORY</h3>
                        <div className="space-y-3" style={{ color: 'hsl(0, 0%, 60%)' }}>
                            <p className="text-sm">
                                Topshot represents the bold edge of pickleball — dynamic, disruptive, and unapologetically Futuristic. Whether you're on the court or on your feed, Topshot gives you the tools to make your mark
                            </p>
                            <p className="text-sm">
                                Bring the best game style
                            </p>
                        </div>
                        
                        {/* Brand Logos */}
                        <div className="flex items-center gap-6 mt-6 opacity-50">
                            <span className="text-xs font-semibold tracking-wider">GLAMOUR</span>
                            <span className="text-xs font-semibold tracking-wider">REFINERY29</span>
                            <span className="text-xs font-semibold tracking-wider">WWD</span>
                        </div>
                    </div>
                    
                    {/* Menu and Footer Menu Container with reduced gap */}
                    <div className="col-span-1 hidden md:block">
                        <div className="grid grid-cols-2 gap-2">
                            {/* Menu Column */}
                            <div>
                                <h3 className="font-semibold mb-4 text-white">MENU</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link to="/categories/new" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            New
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/categories/best-sellers" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Best Sellers
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/categories/library" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Library
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/categories/beginner" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Beginner
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/categories/intermediate" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Intermediate
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/categories/pro" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Pro
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            
                            {/* Footer Menu Column */}
                            <div>
                                <h3 className="font-semibold mb-4 text-white">FOOTER MENU</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link to="/reviews" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Reviews
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/join-community" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Join community
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/gift-cards" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Gift Cards
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/orders" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Track Order
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/accessibility" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Accessibility
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/shipping-returns" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Shipping And Returns
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/contact" className="block hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }}>
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="border-t border-gray-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Copyright */}
                        <p className="text-sm text-center lg:text-left" style={{ color: 'hsl(0, 0%, 60%)' }}>
                            © 2025 TOPSHOT. ALL RIGHTS RESERVED.
                        </p>
                        
                        {/* Payment Methods Image */}
                        <div className="flex items-center justify-center">
                            <img 
                                src="/images/image 231 copy.png" 
                                alt="Payment Methods" 
                                className="h-auto max-w-full opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        );
}
export default Footer;