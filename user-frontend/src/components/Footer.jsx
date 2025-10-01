

function Footer(){
        return (
            // Footer Section
            <footer className="bg-black text-white py-16 mt-16 border-t border-gray-200">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                    <div className="col-span-1 mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold font-['system-ui'] mb-4 text-white">TIROS</h2>
                        <p className="text-xs text-white">
                            © 2025 TIROS. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-semibold mb-2 text-white">HELP</h3>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:underline text-gray-700">MEMBERSHIP & LOGIN</a></li>
                            <li><a href="#" className="hover:underline text-gray-700">EXCHANGE/RETURNS</a></li>
                            <li><a href="#" className="hover:underline text-gray-700">FAQ</a></li>
                            <li><a href="#" className="hover:underline text-gray-700">SHIPPING</a></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-semibold mb-2 text-white">COMPANY</h3>
                        <ul className="space-y-1">
                            <li><a href="/about" className="hover:underline text-gray-700">STORY</a></li>
                            <li><a href="#" className="hover:underline text-gray-700">OUR STORES</a></li>
                            <li><a href="#" className="hover:underline text-gray-700">CAREERS</a></li>
                            <li><a href="/contact" className="hover:underline text-gray-700">CONTACT US</a></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-semibold mb-2 text-white">SOCIAL</h3>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:underline text-gray-700">INSTAGRAM</a></li>
                            <li><a href="#" className="hover:underline text-gray-700">YOUTUBE</a></li>
                            <li><a href="#" className="hover:underline text-gray-700">LINKEDIN</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
        );
}
export default Footer;