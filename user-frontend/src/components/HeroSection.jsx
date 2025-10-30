function HeroSection() {
    return (
        <section className="relative w-full h-screen sm:h-[50vh] md:h-auto lg:h-auto flex items-center justify-center bg-gray-100">
            {/* Mobile hero image: single full-screen image */}
            <img 
                src="/images/Frame 1686553400 copy.png" 
                alt="Hero Image Mobile" 
                className="w-full h-full object-cover sm:hidden"
            />
            {/* Desktop/Tablet hero image */}
            <img 
                src="/images/Frame 1000004003-2 copy.png" 
                alt="Hero Image" 
                className="hidden sm:block w-full h-full object-cover md:h-auto md:object-contain"
            />
            {/* TOPSHOT Logo Overlay - hidden on mobile */}
            <div className="hidden sm:flex absolute inset-0 items-center justify-center z-10">
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