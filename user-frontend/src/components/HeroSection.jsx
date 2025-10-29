function HeroSection() {
    return (
        <section className="relative w-full h-[40vh] sm:h-[50vh] md:h-auto lg:h-auto flex items-center justify-center bg-gray-100">
            <img 
                src="/images/Frame 1000004003-2 copy.png" 
                alt="Hero Image" 
                className="w-full h-full object-cover md:h-auto md:object-contain"
            />
            {/* Left Border Image - Mobile Only */}
            <div className="absolute left-0 top-0 h-full flex sm:hidden items-center z-5">
                <img 
                    src="/images/Image copy.png" 
                    alt="Left Border Image" 
                    className="h-full w-auto object-contain object-left"
                />
            </div>
            {/* Bottom Border - Mobile Only */}
            <div className="absolute bottom-0 left-0 w-full sm:hidden z-10">
                <div
                    aria-hidden
                    style={{
                        backgroundImage: "url('/images/Exclude copy.png')",
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'center bottom',
                        backgroundSize: 'contain',
                        height: '64px',
                        width: '100%'
                    }}
                />
            </div>

            {/* Bottom Center Emblem + Label - Mobile Only */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col sm:hidden items-center justify-center z-15 mb-2">
                <img 
                    src="/images/Exclude copy.png" 
                    alt="Bottom Image" 
                    style={{ width: '80px', height: '96px' }}
                    className="object-contain mb-1"
                />
                <p 
                    className="text-white text-center"
                    style={{
                        fontFamily: 'Kode Mono, monospace',
                        fontWeight: 150,
                        fontStyle: 'normal',
                        fontSize: '11px',
                        letterSpacing: '0%'
                    }}
                >
                    PICKLEBALL STORE
                </p>
            </div>
            {/* TOPSHOT Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <h1 
                    className="text-white font-medium text-center"
                    style={{
                        fontFamily: 'Kode Mono, monospace',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: 'clamp(60px, 15vw, 280px)',
                        lineHeight: '367.54px',
                        letterSpacing: '0%',
                        textAlign: 'center',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                >
                    TOPSHOT
                </h1>
            </div>
        </section>
    );
}

export default HeroSection;