import { useEffect, useState, useRef } from "react";
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
        const navigate = useNavigate();
        const [params] = useSearchParams();
        const scrollRefs = useRef({});

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

        // Helper function to highlight search terms
        const highlightSearchTerm = (text, searchTerm) => {
            if (!searchTerm) return text;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
        };

        // Helper function to render product grid with horizontal scrolling
        const renderProductGrid = (productList, title) => {
            if (productList.length === 0) return null;
            
            const searchTerm = (params.get('q') || '').toLowerCase();
            const isSearchResults = searchTerm && title === "ALL PRODUCTS";
            const sectionKey = title.toLowerCase().replace(/\s+/g, '_');

            const handlePrev = () => {
                const container = scrollRefs.current[sectionKey];
                if (container) {
                    const cardWidth = container.querySelector('div')?.offsetWidth || 300;
                    const gap = 24; // gap-6 = 1.5rem = 24px
                    const scrollAmount = cardWidth + gap;
                    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            };

            const handleNext = () => {
                const container = scrollRefs.current[sectionKey];
                if (container) {
                    const cardWidth = container.querySelector('div')?.offsetWidth || 300;
                    const gap = 24; // gap-6 = 1.5rem = 24px
                    const scrollAmount = cardWidth + gap;
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
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
                        {/* Arrow buttons - same style for all screens */}
                        {productList.length > 1 && (
                            <>
                                <button 
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                                    onClick={handlePrev}
                                    aria-label="Previous"
                                >
                                    <img src="/images/Frame 1000003999 copy.png" alt="Prev" className="w-10 h-10 hover:opacity-80 transition-opacity" />
                                </button>
                                <button 
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
                                    onClick={handleNext}
                                    aria-label="Next"
                                >
                                    <img src="/images/Frame 1000003998 copy.png" alt="Next" className="w-10 h-10 hover:opacity-80 transition-opacity" />
                                </button>
                            </>
                        )}
                        {/* Horizontal scrolling container */}
                        <div 
                            ref={(el) => scrollRefs.current[sectionKey] = el}
                            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {productList.map((p) => (
                                <div key={p._id} className="flex-shrink-0 w-[280px] sm:w-[300px]">
                                    <ProductsCard 
                                        id={p._id}
                                        image={p.image}
                                        images={p.images}
                                        alt={p.name}
                                        title={p.name}
                                        price={`Rs. ${p.price}`}
                                        status={p.status || 'available'}
                                        displayDescription={p.displayDescription}
                                        isHotSelling={p.isHotSelling}
                                        isCreateHype={p.isCreateHype}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        };

        return(
     <>
        <SEO 
          title="Topshot | Official Paddle Store"
          description="TOPSHOT, a premium pickleball brand in India. Shop the latest pickleball equipment from this premium Indian pickleball brand for the TOP!."
          canonical="https://topshot.co/"
          ogTitle="Topshot | Official Paddle Store"
          ogDescription="TOPSHOT, a premium pickleball brand in India. Shop the latest pickleball equipment from this premium Indian pickleball brand for the TOP!"
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
                <div id="about-us-section" className="w-full mt-6 md:mt-8 md:hidden relative">
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
                
                {/* Content sections hidden on mobile - desktop-only storytelling sections */}
                <div className="hidden md:block">
                
                {/* Desktop Frame Image above remaining desktop sections */}
                <div className="w-full">
                    <img 
                        src="/images/Frame 1686553383 copy.png" 
                        alt="Frame Image - Desktop" 
                        className="w-full h-auto"
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