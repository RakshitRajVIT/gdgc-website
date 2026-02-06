import { useRef, useEffect, useState, Children } from "react";

// Size presets
const SIZE_CLASSES = {
    sm: "h-[60vh]",
    md: "h-[70vh]",
    lg: "h-[80vh]",
    xl: "h-[85vh]",
    "2xl": "h-[90vh]",
};

const SIZE_VALUES = {
    sm: 70,
    md: 80,
    lg: 85,
    xl: 90,
    "2xl": 95,
};

const DEFAULT_GAP_VW = 5;

// Utility functions
const getCardWidthVw = (cardSize) => SIZE_VALUES[cardSize] || SIZE_VALUES.lg;
const getInitialOffset = (cardWidthVw) => (100 - cardWidthVw) / 2;

const getScrollDistance = (cardCount, cardWidthVw, gapVw = DEFAULT_GAP_VW) => {
    if (cardCount <= 1) return 0;
    return (cardCount - 1) * (cardWidthVw + gapVw);
};

const calculateCardScale = (cardRect, viewportWidth, minScale = 0.75, maxScale = 1) => {
    const viewportCenter = viewportWidth / 2;
    const cardCenter = cardRect.left + cardRect.width / 2;
    const distanceFromCenter = Math.abs(viewportCenter - cardCenter);
    const maxDistance = viewportWidth / 2 + cardRect.width / 2;

    const proximity = 1 - Math.min(1, distanceFromCenter / maxDistance);
    return minScale + proximity * (maxScale - minScale);
};

const calculateScrollProgress = (containerRect, containerHeight, viewportHeight) => {
    const scrollableDistance = containerHeight - viewportHeight;
    if (scrollableDistance <= 0) return 0;
    return Math.max(0, Math.min(1, -containerRect.top / scrollableDistance));
};

// CardMainSection component
export default function CardMainSection({
    children,
    bgColor = "#3B28CC",
    cardSize = "lg",
    direction = "horizontal",
}) {
    const isHorizontal = direction === "horizontal";
    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const cardRefs = useRef([]);
    const [scales, setScales] = useState({});
    const [translateX, setTranslateX] = useState(0);
    const childArray = Children.toArray(children);

    const cardWidthVw = getCardWidthVw(cardSize);
    const gapVw = DEFAULT_GAP_VW;
    const initialOffset = getInitialOffset(cardWidthVw);
    const scrollDistance = getScrollDistance(childArray.length, cardWidthVw, gapVw);

    // Horizontal scroll effect based on vertical scroll position
    useEffect(() => {
        if (!isHorizontal) return;

        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const rect = container.getBoundingClientRect();
            const progress = calculateScrollProgress(rect, container.offsetHeight, window.innerHeight);
            setTranslateX(progress * scrollDistance);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [childArray.length, scrollDistance, isHorizontal]);

    // Scale cards based on distance from viewport center (horizontal mode)
    useEffect(() => {
        if (!isHorizontal) return;

        const updateScales = () => {
            const viewportWidth = window.innerWidth;
            cardRefs.current.forEach((ref, index) => {
                if (!ref) return;
                const scale = calculateCardScale(ref.getBoundingClientRect(), viewportWidth);
                setScales((prev) => ({ ...prev, [index]: scale }));
            });
        };

        updateScales();
        window.addEventListener("resize", updateScales);
        return () => window.removeEventListener("resize", updateScales);
    }, [translateX, childArray.length, isHorizontal]);

    // Scale cards using IntersectionObserver (vertical mode)
    useEffect(() => {
        if (isHorizontal) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = entry.target.dataset.cardIndex;
                    const scale = 0.75 + entry.intersectionRatio * 0.25;
                    setScales((prev) => ({ ...prev, [index]: scale }));
                });
            },
            {
                root: null,
                rootMargin: "-5% 0px -5% 0px",
                threshold: Array.from({ length: 101 }, (_, i) => i / 100),
            }
        );

        cardRefs.current.forEach((ref) => ref && observer.observe(ref));
        return () => observer.disconnect();
    }, [childArray.length, isHorizontal]);

    const containerHeight = isHorizontal ? `calc(100vh + ${scrollDistance}vw)` : "auto";

    const cardStyle = (index) => ({
        width: `${cardWidthVw}vw`,
        transform: `scale(${scales[index] || 0.85})`,
        transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    });

    // Vertical mode
    if (!isHorizontal) {
        return (
            <section
                ref={containerRef}
                className="flex flex-col items-center py-[10vh] gap-[8vh]"
                style={{ backgroundColor: bgColor }}
            >
                {childArray.map((child, index) => (
                    <div
                        key={index}
                        ref={(el) => (cardRefs.current[index] = el)}
                        data-card-index={index}
                        className={`${SIZE_CLASSES[cardSize]} transition-transform duration-400 ease-out will-change-transform`}
                        style={cardStyle(index)}
                    >
                        {child}
                    </div>
                ))}
            </section>
        );
    }

    // Horizontal mode
    return (
        <div ref={containerRef} style={{ height: containerHeight }}>
            <section
                ref={stickyRef}
                className="sticky top-0 h-screen flex items-center overflow-hidden"
                style={{ backgroundColor: bgColor }}
            >
                <div
                    className="flex flex-row items-center"
                    style={{
                        gap: `${gapVw}vw`,
                        paddingLeft: `${initialOffset}vw`,
                        transform: `translateX(-${translateX}vw)`,
                        transition: "transform 0.1s ease-out",
                    }}
                >
                    {childArray.map((child, index) => (
                        <div
                            key={index}
                            ref={(el) => (cardRefs.current[index] = el)}
                            data-card-index={index}
                            className={`${SIZE_CLASSES[cardSize]} shrink-0 transition-transform duration-300 ease-out will-change-transform`}
                            style={cardStyle(index)}
                        >
                            {child}
                        </div>
                    ))}
                    {/* Spacer for centering last card */}
                    <div className="shrink-0" style={{ width: `${initialOffset}vw` }} aria-hidden="true" />
                </div>
            </section>
        </div>
    );
}
