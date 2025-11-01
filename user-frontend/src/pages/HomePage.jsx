import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import ProductsCard from "../components/ProductsCard";
import SEO from "../components/SEO";
import SignUpForDrops from "../components/SignUpForDrops";
import api from "../api/axios";

function HomePage(){
        const [products, setProducts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        const [currentIndex, setCurrentIndex] = useState(0);
        const [itemsPerView, setItemsPerView] = useState(4);
        const navigate = useNavigate();
        const [params] = useSearchParams();

        // Group products by section (fallback to homepage_top if no section)
        const topProducts = products.filter(p => !p.section || p.section === 'homepage_top');
        const midProducts = products.filter(p => p.section === 'homepage_mid');
        const bottomProducts = products.filter(p => p.section === 'homepage_bottom');

        useEffect(()=>{
            let isMounted = true;
            (async ()=>{
                try{
                    const q = (params.get('q')||'').toLowerCase();
                    // Reduce limit to 30 for faster loading on free Render tier
                    const res = await api.get("/products", { params: { search: q || undefined, limit: 30 } });
                    if(isMounted){
                        const data = res.data;
                        const list = Array.isArray(data) ? data : (data?.products || []);
                        setProducts(list);
                    }
                }catch(err){
                    setError("Failed to load products");
                }finally{
                    if(isMounted) setLoading(false);
                }
            })();
            return ()=>{ isMounted = false };
        },[params]);

        // Update items per view based on screen size
        useEffect(() => {
            const updateItemsPerView = () => {
                if (window.innerWidth < 768) {
                    setItemsPerView(1);
                } else if (window.innerWidth < 1024) {
                    setItemsPerView(3);
                } else {
                    setItemsPerView(4);
                }
            };

            updateItemsPerView();
            window.addEventListener('resize', updateItemsPerView);
            return () => window.removeEventListener('resize', updateItemsPerView);
        }, []);

        // Helper function to highlight search terms
        const highlightSearchTerm = (text, searchTerm) => {
            if (!searchTerm) return text;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
        };

        // Helper function to render product grid with slider when overflowing
        const renderProductGrid = (productList, title) => {
            if (productList.length === 0) return null;
            
            const searchTerm = (params.get('q') || '').toLowerCase();
            const isSearchResults = searchTerm && title === "ALL PRODUCTS";
            const canSlide = productList.length > itemsPerView;
            const start = Math.min(currentIndex, Math.max(0, productList.length - itemsPerView));
            const visibleProducts = canSlide 
              ? productList.slice(start, Math.min(start + itemsPerView, productList.length))
              : productList;

            const handlePrev = () => {
                setCurrentIndex((prev) => Math.max(0, prev - itemsPerView));
            };

            const handleNext = () => {
                setCurrentIndex((prev) => {
                    const nextIndex = prev + itemsPerView;
                    const maxStart = Math.max(0, productList.length - itemsPerView);
                    return Math.min(maxStart, nextIndex);
                });
            };
            
            return (
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {isSearchResults ? `Search Results for "${searchTerm}" (${productList.length} found)` : title}
                        </h2>
                        {isSearchResults && (
                            <p className="text-gray-600 mt-2">
                                Showing products matching your search criteria
                            </p>
                        )}
                    </div>
                    <div className="relative">
                        {canSlide && (
                            <>
                                <button 
                                    className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-8 h-8 items-center justify-center shadow hover:bg-gray-50"
                                    onClick={handlePrev}
                                    aria-label="Previous"
                                    disabled={start === 0}
                                >
                                    <img src="/images/Frame 1000003999 copy.png" alt="Prev" className="w-4 h-4" />
                                </button>
                                <button 
                                    className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-8 h-8 items-center justify-center shadow hover:bg-gray-50"
                                    onClick={handleNext}
                                    aria-label="Next"
                                    disabled={start + itemsPerView >= productList.length}
                                >
                                    <img src="/images/Frame 1000003998 copy.png" alt="Next" className="w-4 h-4" />
                                </button>

                                {/* Mobile arrows using provided images, centered vertically */}
                                <button 
                                    className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10"
                                    onClick={handlePrev}
                                    aria-label="Previous"
                                    disabled={start === 0}
                                >
                                    <img src="/images/Frame 1000003999 copy.png" alt="Prev" className="w-10 h-10 disabled:opacity-50" />
                                </button>
                                <button 
                                    className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10"
                                    onClick={handleNext}
                                    aria-label="Next"
                                    disabled={start + itemsPerView >= productList.length}
                                >
                                    <img src="/images/Frame 1000003998 copy.png" alt="Next" className="w-10 h-10 disabled:opacity-50" />
                                </button>
                            </>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {visibleProducts.map((p) => (
                                <div key={p._id}>
                                    <ProductsCard 
                                        id={p._id}
                                        image={p.image}
                                        alt={p.name}
                                        title={p.name}
                                        price={`Rs. ${p.price}`}
                                        status={p.status || 'available'}
                                        displayDescription={p.displayDescription}
                                    />
                                </div>
                            ))}
                        </div>
                        {canSlide && (
                            <></>
                        )}
                    </div>
                </div>
            );
        };

        return(
     <>
        <SEO 
          title="Topshot | Official Paddle Store"
          description="Shop the latest fashion trends at Topshot. Premium clothing, fast delivery, and secure checkout."
          canonical="https://topshot.co/"
          ogTitle="Topshot | Official Paddle Store"
          ogDescription="Shop the latest fashion trends at Topshot. Premium clothing, fast delivery, and secure checkout."
          ogUrl="https://topshot.co/"
        />
        <div>
                    <HeroSection />

            {/* Vector Image Section */}
            <section className="w-full flex justify-center py-4 md:py-8 px-4">
                <img 
                    src="/images/Vector 699 copy.png" 
                    alt="Vector Image" 
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain"
                />
            </section>

            <section className="container mx-auto px-4 py-12">
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}
                {!loading && !error && (
                <>
                    {/* Search Results */}
                    {params.get('q') && (
                        <>
                            {products.length > 0 ? (
                                renderProductGrid(products, "ALL PRODUCTS")
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
                                    <p className="text-gray-600 mb-4">
                                        We couldn't find any products matching "{params.get('q')}"
                                    </p>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">Try:</p>
                                        <ul className="text-sm text-gray-500 space-y-1">
                                            <li>• Checking your spelling</li>
                                            <li>• Using different keywords</li>
                                            <li>• Using more general terms</li>
                                            <li>• Browsing our categories</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    
                    {/* Regular Product Sections (only show when not searching) */}
                    {!params.get('q') && (
                        <>
                            {/* Top Section Products */}
                            {renderProductGrid(topProducts, "FEATURED PRODUCTS")}
                            
                            {/* Middle Section Products */}
                            {renderProductGrid(midProducts, "NEW ARRIVALS")}
                            
                            {/* Bottom Section Products */}
                            {renderProductGrid(bottomProducts, "BEST SELLERS")}
                            
                            {/* Fallback: Show all products if no sections have products */}
                            {topProducts.length === 0 && midProducts.length === 0 && bottomProducts.length === 0 && products.length > 0 && (
                                renderProductGrid(products, "ALL PRODUCTS")
                            )}
                        </>
                    )}
                </>
                )}
                
                {/* Vector 704 Image Section - Mobile Only */}
                <div className="w-full mt-6 md:mt-8 md:hidden relative">
                    <img 
                        src="/images/Vector 704 copy.png" 
                        alt="Vector 704 Image" 
                        className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-6" style={{ zIndex: 10 }}>
                        <p 
                            className="text-white text-center"
                            style={{
                                fontFamily: 'Kode Mono, monospace',
                                fontWeight: 580,
                                fontSize: '16px',
                                lineHeight: '24px'
                            }}
                        >
                            Topshot represents the bold edge of pickleball — dynamic, disruptive, and unapologetically Futuristic. Whether you're on the court or on your feed, Topshot gives you the tools to make your mark
                        </p>
                    </div>
                </div>
                
                {/* Content sections hidden on mobile - Pro Sport Journey to Discover More */}
                <div className="hidden md:block">
                
                {/* Desktop Frame Image above Pro Sport Journey */}
                <div className="w-full">
                    <img 
                        src="/images/Frame 1686553383 copy.png" 
                        alt="Frame Image - Desktop" 
                        className="w-full h-auto"
                    />
                </div>
                
                {/* Pro Sport Journey Section */}
                <div className="w-full mt-8 md:mt-12" style={{ backgroundColor: '#EDEDED' }}>
                    <div className="container mx-auto px-4 py-16 md:py-20">
                        <div className="text-center max-w-4xl mx-auto">
                            {/* Heading */}
                            <h2 
                                className="mb-6"
                                style={{
                                    fontFamily: 'Kode Mono, monospace',
                                    fontWeight: 600,
                                    fontSize: '36px',
                                    lineHeight: '100%',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0%'
                                }}
                            >
                                PRO SPORT JOURNEY
                            </h2>
                            
                            {/* Paragraph */}
                            <p 
                                className="mb-8"
                                style={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '18px',
                                    lineHeight: '30px',
                                    textAlign: 'center',
                                    letterSpacing: '0%'
                                }}
                            >
                                Latico donates 10 meals to Feeding America for each purchase. Over 110k+ meals have been donated across nationwide food banks. Each Latico bag is handcrafted by artisans & made with responsibly sourced leather.
                            </p>
                            
                            {/* Button */}
                            <button 
                                className="text-white font-medium transition-colors hover:bg-gray-800 cursor-pointer"
                                style={{
                                    backgroundColor: '#000000',
                                    width: '234px',
                                    height: '64px',
                                    paddingTop: '22px',
                                    paddingRight: '26px',
                                    paddingBottom: '22px',
                                    paddingLeft: '26px',
                                    borderWidth: '1px',
                                    borderColor: '#000000',
                                    gap: '10px'
                                }}
                            >
                                OUR STORY
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Frame 148 Section */}
                <div 
                    className="flex flex-col items-center mt-16 md:mt-20"
                    style={{
                        transform: 'rotate(0deg)',
                        opacity: 1,
                        position: 'relative'
                    }}
                >
                    <p 
                        className="text-center"
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '19px',
                            lineHeight: '27px',
                            letterSpacing: '10%',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            color: '#201A15'
                        }}
                    >
                        YOUR NEW EVERYDAY PADDLE
                    </p>
                    <p 
                        className="text-center mt-4"
                        style={{
                            fontFamily: 'Kode Mono, monospace',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '36px',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            color: '#201A15'
                        }}
                    >
                        Over 1 Million Bags Sold
                    </p>
                    <p 
                        className="text-center mt-4"
                        style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 300,
                            fontStyle: 'normal',
                            fontSize: '15px',
                            lineHeight: '18px',
                            letterSpacing: '0%',
                            textAlign: 'center',
                            color: '#201A15'
                        }}
                    >
                        40k+ 5-star Reviews
                    </p>
                    <img 
                        src="/images/Frame 148-2 copy.png" 
                        alt="Frame 148-2" 
                        className="mt-4"
                        style={{
                            width: '200px',
                            height: '200px',
                            transform: 'rotate(0deg)',
                            opacity: 1
                        }}
                    />
                </div>
                
                {/* Frame 140 Section */}
                <div className="mt-16 md:mt-20">
                    {/* Frame 113 */}
                    <div className="flex flex-col items-center">
                        <p 
                            className="text-center"
                            style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 400,
                                fontStyle: 'normal',
                                fontSize: '19px',
                                lineHeight: '27px',
                                letterSpacing: '10%',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                color: '#201A15'
                            }}
                        >
                            Shop The Feed
                        </p>
                        <p 
                            className="text-center mt-4"
                            style={{
                                fontFamily: 'Kode Mono, monospace',
                                fontWeight: 400,
                                fontStyle: 'normal',
                                fontSize: '36px',
                                lineHeight: '100%',
                                letterSpacing: '0%',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                            color: '#201A15'
                        }}
                    >
                        @TOPSHOT
                    </p>
                    </div>
                </div>
                
                <div className="text-center mt-12">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors font-medium">DISCOVER MORE &gt;</button>
                        {/* TODO: UI polish */}
                </div>
                
                </div>
                {/* End of content hidden on mobile */}
                
            </section>

            {/* Full-width Frame Image - Mobile Only */}
            <div className="w-full md:hidden">
                <img 
                    src="/images/Frame 1686553383-2 copy.png" 
                    alt="Frame Image - Mobile" 
                    className="w-full h-auto"
                />
            </div>

       </div>

        <SignUpForDrops />
       
     </>
        )
}
export default HomePage;