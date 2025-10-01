function HeroSection() {
    return (
        <section className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center bg-gray-100">
            <img 
                src="/images/Frame 1000004003 copy.png" 
                alt="Hero Image" 
                className="w-full h-full object-cover object-center"
            />
            {/* TIROS Logo Overlay */}
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
                    TIROS
                </h1>
            </div>
        </section>
    );
}

export default HeroSection;