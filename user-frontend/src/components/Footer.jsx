
import { Link } from "react-router-dom";

function Footer(){
        return (
            <footer id="footer-section" className="mt-0 border-t border-gray-800" style={{ backgroundColor: 'hsl(220, 13%, 13%)', color: 'hsl(0, 0%, 95%)', fontFamily: 'Poppins, sans-serif' }}>
            <div className="container mx-auto px-4 py-12">
                {/* Four-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
                    
                    {/* Brand Column */}
                    <div className="col-span-1">
                        <h2 className="text-3xl font-bold tracking-wider mb-6 text-white" style={{ fontFamily: 'Kode Mono, monospace' }}>TOPSHOT</h2>
                        
                        {/* Social Media Icons */}
                        <div className="flex items-center gap-3 mb-6">
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
                                href="https://facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Follow us on Facebook"
                                className="w-10 h-10 bg-white rounded flex items-center justify-center hover:opacity-80 transition-opacity"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'hsl(220, 13%, 13%)' }}>
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://pinterest.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Follow us on Pinterest"
                                className="w-10 h-10 bg-white rounded flex items-center justify-center hover:opacity-80 transition-opacity"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'hsl(220, 13%, 13%)' }}>
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
                                    <path d="M11.5 7.5c-1.4 0-2.5.9-2.5 2.1 0 .6.3 1.2.7 1.4.1.1.1.1.1.2 0 .1-.1.3-.1.4-.1.5-.3 1.1-.4 1.6-.1.7.3 1.2 1 1.2 1.2 0 2.1-1.4 2.1-3.4 0-1.8-1.4-3.1-3.5-3.1zm-.6 6.8c-.5 0-.9-.3-1-.7-.1-.3-.1-.8.2-1.4.2-.5.4-1 .5-1.4 0-.1 0-.3-.1-.3 0-.1-.1-.1-.2-.1-.7.2-1.2 1-1.2 1.8 0 1.3.9 2.1 2.3 2.1 1.4 0 2.3-.8 2.3-1.9 0-3.3-2.8-5.9-6.4-5.9-3.1 0-5.5 2.2-5.5 5.2 0 1.9.7 3.6 2.1 4.8.2.2.3.3.2.5-.1.4-.4 1.6-.5 2-.1.3-.3.5-.6.5-.9 0-3.8-2.1-5-5.5-.4-1.2-.7-2.4-.7-3.5 0-4.1 3.7-7.5 8.9-7.5 4.6 0 7.9 3.3 7.9 6.9 0 4.1-2.6 7.4-6.3 7.4z"/>
                                </svg>
                            </a>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="space-y-3" style={{ color: 'hsl(0, 0%, 60%)' }}>
                            <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-sm">(+91)-9266-987400 NEW DELHI, INDIA</span>
                            </div>
                            <div>
                                <p className="text-sm">Mon-Fri: 9AM - 6PM EST</p>
                                <p className="text-sm">Sat-Sun: 10AM - 4PM EST</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Story Column */}
                    <div className="col-span-1 lg:mr-8">
                        <h3 className="font-semibold mb-4 text-white">OUR STORY</h3>
                        <div className="space-y-3" style={{ color: 'hsl(0, 0%, 60%)' }}>
                            <p className="text-sm">
                                Latico Leathers has been crafting premium quality leather goods for over three decades. 
                                Born from a passion for traditional craftsmanship and timeless design, we've built our 
                                reputation on creating products that blend heritage techniques with modern functionality.
                            </p>
                            <p className="text-sm">
                                Every piece in our collection is a testament to our commitment to excellence, 
                                featuring carefully selected materials and meticulous attention to detail that 
                                stands the test of time.
                            </p>
                        </div>
                        
                        {/* Brand Logos */}
                        <div className="flex items-center gap-6 mt-6 opacity-50">
                            <span className="text-xs font-semibold tracking-wider">GLAMOUR</span>
                            <span className="text-xs font-semibold tracking-wider">REFINERY29</span>
                            <span className="text-xs font-semibold tracking-wider">WWD</span>
                        </div>
                    </div>
                    
                    {/* Menu Column */}
                    <div className="col-span-1">
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
                    <div className="col-span-1">
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
                                className="h-auto max-w-full opacity-80 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        );
}
export default Footer;