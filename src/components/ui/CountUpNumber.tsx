'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CountUpNumberProps {
  value: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (val: number) => string;
  className?: string;
}

export function CountUpNumber({
  value,
  durationMs = 900,
  prefix = '',
  suffix = '',
  formatter,
  className = '',
}: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const isReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced || (typeof document !== 'undefined' && document.documentElement.classList.contains('reduce-motion'))) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    let start = 0;
    const startVal = prevValueRef.current;
    const diff = value - startVal;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / durationMs, 1);
      // EaseOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startVal + diff * eased);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        prevValueRef.current = value;
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, durationMs]);

  const formatted = formatter ? formatter(displayValue) : displayValue.toLocaleString();

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
