'use client';

import React, { useState, useEffect } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-festive-saffron via-festive-gold via-festive-rose to-festive-indigo transition-transform duration-75 ease-out origin-left"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
