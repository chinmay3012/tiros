import { useEffect, useRef, useState } from "react";

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

// Detect Safari for performance optimizations
const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function HeroSection() {
    const heroRef = useRef(null);
    const rafRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const lastScrollTime = useRef(0);

    useEffect(() => {
        const updateProgress = () => {
            const viewportHeight = window.innerHeight || 1;
            const heroHeight = heroRef.current?.offsetHeight || viewportHeight;
            const scrolled = window.scrollY;
            const progress = clamp(scrolled / (heroHeight * 0.45));
            setScrollProgress(progress);
        };

        const handleScroll = () => {
            const now = performance.now();
            // Throttle more aggressively on Safari
            if (isSafari && now - lastScrollTime.current < 8) {
                return;
            }
            lastScrollTime.current = now;
            
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

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return;
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        const updateIsMobile = () => setIsMobile(mediaQuery.matches);
        updateIsMobile();

        const addListener = mediaQuery.addEventListener ? mediaQuery.addEventListener.bind(mediaQuery) : mediaQuery.addListener?.bind(mediaQuery);
        const removeListener = mediaQuery.removeEventListener ? mediaQuery.removeEventListener.bind(mediaQuery) : mediaQuery.removeListener?.bind(mediaQuery);

        if (addListener) {
            addListener("change", updateIsMobile);
        }

        return () => {
            if (removeListener) {
                removeListener("change", updateIsMobile);
            }
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

    const splitDistance = isMobile ? 15 : 25;
    const scaleIntensity = isMobile ? 0.04 : 0.08;
    // Remove CSS transitions during scroll for Safari - they conflict with RAF updates
    const transformDuration = isSafari ? "none" : (isMobile ? "transform 0.45s ease-out" : "transform 0.3s ease-out");
    const overlayOpacity = 1 - scrollProgress * 0.6;
    const contentReveal = clamp((scrollProgress - (isMobile ? 0.45 : 0.4)) / (isMobile ? 0.3 : 0.25));
    const heroLayerOpacity = clamp(1 - contentReveal * 1.1, 0, 1);
    const logoOpacity = clamp((1 - scrollProgress * 0.8) * heroLayerOpacity, 0, 1);
    const sparkleOpacity = isMobile ? 0.75 : (isSafari ? 0.85 : 0.9);
    const sparkleBlur = isMobile ? "blur(0.1px)" : (isSafari ? "blur(0.05px)" : "blur(0.02px)");
    const contentTransition = isSafari ? "none" : (isMobile ? "opacity 0.5s ease-out, transform 0.5s ease-out" : "opacity 0.4s ease-out, transform 0.4s ease-out");
    const stickyMinHeightClass = isMobile ? "min-h-[160vh]" : "min-h-[180vh]";
    
    // Use translate3d for better GPU acceleration, especially on Safari
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const topTranslateY = -scrollProgress * splitDistance * viewportHeight / 100;
    const bottomTranslateY = scrollProgress * splitDistance * viewportHeight / 100;
    const scale = 1 + scrollProgress * scaleIntensity;
    const topTransform = `translate3d(0, ${topTranslateY}px, 0) scale(${scale})`;
    const bottomTransform = `translate3d(0, ${bottomTranslateY}px, 0) scale(${scale})`;

    return (
        <section
            ref={heroRef}
            className={`relative w-full ${stickyMinHeightClass} sm:min-h-[180vh] flex items-start justify-center bg-black`}
        >
            <div 
                className="sticky top-0 h-screen w-full overflow-hidden"
                style={{
                    willChange: 'transform',
                    WebkitTransform: 'translateZ(0)',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                }}
            >
                {/* Desktop split effect */}
                <div
                    className="hidden sm:block absolute inset-0"
                    aria-hidden="true"
                    style={{ 
                        opacity: heroLayerOpacity, 
                        transition: isSafari ? "none" : "opacity 0.4s ease-out",
                        willChange: 'opacity',
                        contain: 'layout style paint'
                    }}
                >
                    <div
                        className="absolute inset-0 will-change-transform"
                        style={{
                            ...splitBaseStyleDesktop,
                            clipPath: "inset(0 0 50% 0)",
                            transform: topTransform,
                            transition: transformDuration,
                            WebkitTransform: topTransform,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            contain: 'layout style paint'
                        }}
                    />
                    <div
                        className="absolute inset-0 will-change-transform"
                        style={{
                            ...splitBaseStyleDesktop,
                            clipPath: "inset(50% 0 0 0)",
                            transform: bottomTransform,
                            transition: transformDuration,
                            WebkitTransform: bottomTransform,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            contain: 'layout style paint'
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
                    style={{ 
                        opacity: heroLayerOpacity, 
                        transition: isSafari ? "none" : "opacity 0.4s ease-out",
                        willChange: 'opacity',
                        contain: 'layout style paint'
                    }}
                >
                    <div
                        className="absolute inset-0 will-change-transform"
                        style={{
                            ...splitBaseStyleMobile,
                            clipPath: "inset(0 0 50% 0)",
                            transform: topTransform,
                            transition: transformDuration,
                            WebkitTransform: topTransform,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            contain: 'layout style paint'
                        }}
                    />
                    <div
                        className="absolute inset-0 will-change-transform"
                        style={{
                            ...splitBaseStyleMobile,
                            clipPath: "inset(50% 0 0 0)",
                            transform: bottomTransform,
                            transition: transformDuration,
                            WebkitTransform: bottomTransform,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            contain: 'layout style paint'
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
                            transform: `translate3d(0, ${-scrollProgress * 20}px, 0)`,
                            transition: isSafari ? "none" : "opacity 0.3s ease-out, transform 0.3s ease-out",
                            willChange: 'transform, opacity',
                            WebkitTransform: `translate3d(0, ${-scrollProgress * 20}px, 0)`,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden'
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
                        transform: `translate3d(0, ${(1 - contentReveal) * 40}px, 0)`,
                        transition: contentTransition,
                        pointerEvents: "none",
                        background: `linear-gradient(180deg, rgba(10,10,10,${0.9 - contentReveal * 0.6}) 0%, rgba(0,0,0,${0.5 - contentReveal * 0.5}) 40%, rgba(4,4,4,0) 100%)`,
                        WebkitTransform: `translate3d(0, ${(1 - contentReveal) * 40}px, 0)`,
                        willChange: 'transform, opacity',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    <div
                        className="absolute inset-0 z-0 mix-blend-screen pointer-events-none"
                        style={{
                            backgroundImage: isSafari 
                                ? `radial-gradient(circle at 10% 20%, rgba(255,255,255,0.4) 0, transparent 12px),
                                   radial-gradient(circle at 30% 15%, rgba(255,255,255,0.35) 0, transparent 10px),
                                   radial-gradient(circle at 50% 25%, rgba(255,255,255,0.38) 0, transparent 11px),
                                   radial-gradient(circle at 70% 20%, rgba(255,255,255,0.33) 0, transparent 9px),
                                   radial-gradient(circle at 90% 30%, rgba(255,255,255,0.36) 0, transparent 10px),
                                   radial-gradient(circle at 15% 60%, rgba(255,255,255,0.32) 0, transparent 9px),
                                   radial-gradient(circle at 40% 70%, rgba(255,255,255,0.35) 0, transparent 10px),
                                   radial-gradient(circle at 65% 65%, rgba(255,255,255,0.34) 0, transparent 9px),
                                   radial-gradient(circle at 85% 75%, rgba(255,255,255,0.3) 0, transparent 11px),
                                   radial-gradient(circle at 20% 85%, rgba(255,255,255,0.33) 0, transparent 10px),
                                   radial-gradient(circle at 55% 88%, rgba(255,255,255,0.31) 0, transparent 9px),
                                   radial-gradient(circle at 80% 90%, rgba(255,255,255,0.29) 0, transparent 10px)`
                                : `radial-gradient(circle at 8% 15%, rgba(255,255,255,0.38) 0, transparent 10px),
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
                            filter: sparkleBlur,
                            opacity: sparkleOpacity,
                            willChange: 'opacity',
                            contain: 'layout style paint'
                        }}
                    />
                    <div
                        className="max-w-3xl text-center relative z-10"
                        style={{
                            opacity: contentReveal,
                            transform: `translate3d(0, ${(1 - contentReveal) * 30}px, 0)`,
                            transition: contentTransition,
                            color: `rgba(255,255,255,${contentReveal || 0})`,
                            WebkitTransform: `translate3d(0, ${(1 - contentReveal) * 30}px, 0)`,
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden'
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