import { useEffect, useRef, useState } from "react";

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function HeroSection() {
    const heroRef = useRef(null);
    const rafRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const viewportHeight = window.innerHeight || 1;
            const heroHeight = heroRef.current?.offsetHeight || viewportHeight;
            const scrolled = window.scrollY;
            const progress = clamp(scrolled / (heroHeight * 0.45));
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
    const contentReveal = clamp((scrollProgress - 0.4) / 0.25);
    const heroLayerOpacity = clamp(1 - contentReveal * 1.1, 0, 1);
    const logoOpacity = clamp((1 - scrollProgress * 0.8) * heroLayerOpacity, 0, 1);

    return (
        <section
            ref={heroRef}
            className="relative w-full min-h-[180vh] flex items-start justify-center bg-black"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Desktop split effect */}
                <div
                    className="hidden sm:block absolute inset-0"
                    aria-hidden="true"
                    style={{ opacity: heroLayerOpacity, transition: "opacity 0.4s ease-out" }}
                >
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
                <div
                    className="sm:hidden absolute inset-0"
                    aria-hidden="true"
                    style={{ opacity: heroLayerOpacity, transition: "opacity 0.4s ease-out" }}
                >
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
                <div className="hidden sm:flex absolute inset-0 items-center justify-center z-10 pointer-events-none">
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
                            opacity: logoOpacity,
                            transform: `translateY(-${scrollProgress * 20}px)`,
                            transition: "opacity 0.3s ease-out, transform 0.3s ease-out"
                        }}
                    >
                        TOPSHOT
                    </h1>
                </div>

                {/* Content reveal panel */}
                <div
                    className="absolute inset-0 flex items-center justify-center px-6"
                    style={{
                        opacity: contentReveal,
                        transform: `translateY(${(1 - contentReveal) * 40}px)`,
                        transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                        pointerEvents: "none",
                        background: `linear-gradient(180deg, rgba(10,10,10,${0.9 - contentReveal * 0.6}) 0%, rgba(0,0,0,${0.5 - contentReveal * 0.5}) 40%, rgba(4,4,4,0) 100%)`
                    }}
                >
                    <div
                        className="absolute inset-0 z-0 opacity-90 mix-blend-screen pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(circle at 8% 15%, rgba(255,255,255,0.38) 0, transparent 10px),
                                              radial-gradient(circle at 16% 32%, rgba(255,255,255,0.34) 0, transparent 8px),
                                              radial-gradient(circle at 26% 18%, rgba(255,255,255,0.32) 0, transparent 7px),
                                              radial-gradient(circle at 38% 8%, rgba(255,255,255,0.3) 0, transparent 6px),
                                              radial-gradient(circle at 48% 24%, rgba(255,255,255,0.36) 0, transparent 9px),
                                              radial-gradient(circle at 60% 12%, rgba(255,255,255,0.35) 0, transparent 8px),
                                              radial-gradient(circle at 72% 18%, rgba(255,255,255,0.33) 0, transparent 7px),
                                              radial-gradient(circle at 84% 10%, rgba(255,255,255,0.32) 0, transparent 6px),
                                              radial-gradient(circle at 92% 26%, rgba(255,255,255,0.34) 0, transparent 8px),
                                              radial-gradient(circle at 6% 52%, rgba(255,255,255,0.3) 0, transparent 9px),
                                              radial-gradient(circle at 18% 60%, rgba(255,255,255,0.32) 0, transparent 7px),
                                              radial-gradient(circle at 30% 70%, rgba(255,255,255,0.34) 0, transparent 8px),
                                              radial-gradient(circle at 42% 62%, rgba(255,255,255,0.36) 0, transparent 7px),
                                              radial-gradient(circle at 54% 78%, rgba(255,255,255,0.33) 0, transparent 8px),
                                              radial-gradient(circle at 66% 68%, rgba(255,255,255,0.35) 0, transparent 7px),
                                              radial-gradient(circle at 78% 82%, rgba(255,255,255,0.3) 0, transparent 9px),
                                              radial-gradient(circle at 90% 72%, rgba(255,255,255,0.32) 0, transparent 8px),
                                              radial-gradient(circle at 12% 85%, rgba(255,255,255,0.33) 0, transparent 7px),
                                              radial-gradient(circle at 36% 88%, rgba(255,255,255,0.34) 0, transparent 9px),
                                              radial-gradient(circle at 58% 90%, rgba(255,255,255,0.31) 0, transparent 8px),
                                              radial-gradient(circle at 80% 90%, rgba(255,255,255,0.3) 0, transparent 7px),
                                              radial-gradient(circle at 94% 86%, rgba(255,255,255,0.28) 0, transparent 8px)`,
                            filter: "blur(0.02px)"
                        }}
                    />
                    <div
                        className="max-w-3xl text-center relative z-10"
                        style={{
                            opacity: contentReveal,
                            transform: `translateY(${(1 - contentReveal) * 30}px)`,
                            transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                            color: `rgba(255,255,255,${contentReveal || 0})`
                        }}
                    >
                        <p
                            className="uppercase tracking-[0.4em] text-sm sm:text-base mb-4"
                            style={{ fontFamily: 'Kode Mono, monospace', fontWeight: 500 }}
                        >
                            forged for the fast lane
                        </p>
                        <h2
                            className="text-2xl sm:text-4xl font-semibold"
                            style={{ fontFamily: 'Kode Mono, monospace', letterSpacing: '0.08em' }}
                        >
                            Topshot provides paddles for players who refuse to coast.
                        </h2>
                        <div className="mt-10 text-xs sm:text-sm tracking-[0.4em] uppercase text-white/70 flex flex-col items-center gap-2">
                            <span>scroll</span>
                            <span className="text-lg sm:text-xl">↓</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;