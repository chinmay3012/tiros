import { useEffect, useRef, useState } from "react";

function HeroSection() {
    const heroRef = useRef(null);
    const rafRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

        const updateProgress = () => {
            const viewportHeight = window.innerHeight || 1;
            const heroHeight = heroRef.current?.offsetHeight || viewportHeight;
            const scrolled = window.scrollY;
            const progress = clamp(scrolled / (heroHeight * 0.8));
            setScrollProgress(progress);
        };

        const handleScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateProgress);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        updateProgress();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const desktopHeroSrc = "/images/Frame 1000004003-2 copy.png";
    const mobileHeroSrc = "/images/Frame 1686553400 copy.png";
    const encodedDesktopHeroSrc = encodeURI(desktopHeroSrc);
    const encodedMobileHeroSrc = encodeURI(mobileHeroSrc);

    const splitBaseStyleDesktop = {
        backgroundImage: `url("${encodedDesktopHeroSrc}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
    };

    const splitBaseStyleMobile = {
        backgroundImage: `url("${encodedMobileHeroSrc}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
    };

    const topTransform = `translateY(-${scrollProgress * 25}vh) scale(${1 + scrollProgress * 0.08})`;
    const bottomTransform = `translateY(${scrollProgress * 25}vh) scale(${1 + scrollProgress * 0.08})`;
    const overlayOpacity = 1 - scrollProgress * 0.6;

    return (
        <section
            ref={heroRef}
            className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black"
        >
            {/* Desktop split effect */}
            <div className="hidden sm:block absolute inset-0" aria-hidden="true">
                <div
                    className="absolute inset-0 will-change-transform"
                    style={{
                        ...splitBaseStyleDesktop,
                        clipPath: "inset(0 0 50% 0)",
                        transform: topTransform,
                        transition: "transform 0.3s ease-out",
                    }}
                />
                <div
                    className="absolute inset-0 will-change-transform"
                    style={{
                        ...splitBaseStyleDesktop,
                        clipPath: "inset(50% 0 0 0)",
                        transform: bottomTransform,
                        transition: "transform 0.3s ease-out",
                    }}
                />
                <div
                    className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none"
                    style={{ opacity: overlayOpacity }}
                />
            </div>

            {/* Mobile split effect */}
            <div className="sm:hidden absolute inset-0" aria-hidden="true">
                <div
                    className="absolute inset-0 will-change-transform"
                    style={{
                        ...splitBaseStyleMobile,
                        clipPath: "inset(0 0 50% 0)",
                        transform: topTransform,
                        transition: "transform 0.3s ease-out",
                    }}
                />
                <div
                    className="absolute inset-0 will-change-transform"
                    style={{
                        ...splitBaseStyleMobile,
                        clipPath: "inset(50% 0 0 0)",
                        transform: bottomTransform,
                        transition: "transform 0.3s ease-out",
                    }}
                />
                <div
                    className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none"
                    style={{ opacity: overlayOpacity }}
                />
            </div>

            {/* TOPSHOT Logo Overlay - hidden on mobile */}
            <div className="hidden sm:flex absolute inset-0 items-center justify-center z-10">
                <h1 
                    className="text-white font-medium text-center"
                    style={{
                        fontFamily: 'Kode Mono, monospace',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: 'clamp(60px, 15vw, 280px)',
                        lineHeight: '1',
                        letterSpacing: '0%',
                        textAlign: 'center',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        opacity: 1 - scrollProgress * 0.8,
                        transform: `translateY(-${scrollProgress * 20}px)`,
                        transition: "opacity 0.3s ease-out, transform 0.3s ease-out"
                    }}
                >
                    TOPSHOT
                </h1>
            </div>
        </section>
    );
}

export default HeroSection;