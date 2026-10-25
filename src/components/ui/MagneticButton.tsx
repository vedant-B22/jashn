'use client';

import React, { useRef, useState, useEffect } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  pullStrength?: number;
}

export function MagneticButton({
  children,
  className = '',
  variant = 'primary',
  pullStrength = 0.25,
  onClick,
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches || document.documentElement.classList.contains('reduce-motion'));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current || reducedMotion) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * pullStrength;
    const dy = (e.clientY - centerY) * pullStrength;
    setPos({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-festive-saffron via-festive-gold to-festive-rose text-black font-extrabold shadow-glow hover:brightness-110 active:scale-95',
    secondary:
      'bg-surface-100/90 text-slate-100 border border-white/10 hover:border-festive-gold/40 hover:text-festive-gold active:scale-95',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 active:scale-95',
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: !reducedMotion ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : 'none',
        transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), filter 0.15s ease',
      }}
      className={`relative inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm min-h-[44px] min-w-[44px] overflow-hidden group select-none ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Shine sweep effect */}
      {!reducedMotion && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
