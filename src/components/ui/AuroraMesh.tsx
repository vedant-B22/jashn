'use client';

import React, { useRef, useState, useEffect } from 'react';

export function AuroraMesh() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const isReduced =
      (typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      (typeof document !== 'undefined' && document.documentElement.classList.contains('reduce-motion'));

    setReducedMotion(isReduced);

    // IntersectionObserver to pause animation when offscreen
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          setIsPaused(!entry || !entry.isIntersecting);
        },
        { threshold: 0.05 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
    }

    const handlePointerMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* Aurora Ambient Radial Blobs */}
      <div
        className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-festive-saffron/15 blur-[120px] will-change-transform ${
          !reducedMotion && !isPaused ? 'animate-aurora' : ''
        }`}
        style={{ animationDuration: '34s' }}
      />
      <div
        className={`absolute top-1/4 -right-32 w-[650px] h-[650px] rounded-full bg-festive-magenta/15 blur-[140px] will-change-transform ${
          !reducedMotion && !isPaused ? 'animate-aurora' : ''
        }`}
        style={{ animationDuration: '40s', animationDirection: 'reverse' }}
      />
      <div
        className={`absolute bottom-[-100px] left-1/3 w-[550px] h-[550px] rounded-full bg-festive-indigo/25 blur-[130px] will-change-transform ${
          !reducedMotion && !isPaused ? 'animate-aurora' : ''
        }`}
        style={{ animationDuration: '38s' }}
      />
      <div
        className={`absolute top-2/3 right-1/4 w-[450px] h-[450px] rounded-full bg-festive-gold/10 blur-[110px] will-change-transform ${
          !reducedMotion && !isPaused ? 'animate-aurora' : ''
        }`}
        style={{ animationDuration: '45s' }}
      />

      {/* Subtle Dotted Grid Overlay with Cursor Spotlight Mask */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-70"
        style={
          !reducedMotion
            ? {
                maskImage: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 80%)`,
                WebkitMaskImage: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 80%)`,
              }
            : undefined
        }
      />
    </div>
  );
}
