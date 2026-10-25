'use client';

import React, { useRef, useState, useEffect } from 'react';

interface RevealProps {
  children: React.ReactNode;
  delayMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function Reveal({
  children,
  delayMs = 0,
  direction = 'up',
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mq.matches || document.documentElement.classList.contains('reduce-motion');
    setReducedMotion(isReduced);

    if (isReduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '40px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getOffsetTransform = () => {
    if (reducedMotion || isVisible) return 'none';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 24px, 0)';
      case 'down':
        return 'translate3d(0, -24px, 0)';
      case 'left':
        return 'translate3d(24px, 0, 0)';
      case 'right':
        return 'translate3d(-24px, 0, 0)';
      default:
        return 'none';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getOffsetTransform(),
        filter: isVisible || reducedMotion ? 'blur(0px)' : 'blur(4px)',
        transition: reducedMotion
          ? 'opacity 0.15s ease'
          : `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, filter 0.6s ease ${delayMs}ms`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
