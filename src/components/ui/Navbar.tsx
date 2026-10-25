'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/lib/i18n';
import { MagneticButton } from './MagneticButton';

interface NavbarProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onFinalizePlan?: () => void;
  hasPlan: boolean;
}

const NAV_SECTIONS = [
  { id: 'intake-heading', label: 'Brief' },
  { id: 'budget-heading', label: 'Budget' },
  { id: 'timeline-heading', label: 'Timeline' },
  { id: 'vendors-heading', label: 'Vendors' },
  { id: 'ideas-heading', label: 'Ideas' },
  { id: 'planb-heading', label: 'Plan B' },
];

export function Navbar({ currentLocale, onLocaleChange, onFinalizePlan, hasPlan }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('intake-heading');
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial reduced motion state
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stored = localStorage.getItem('jashn_reduce_motion') === 'true';
    const active = stored || mq.matches;
    setIsReducedMotion(active);
    if (active) {
      document.documentElement.classList.add('reduce-motion');
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);

          // Find current active section
          const scrollPos = window.scrollY + 200;
          for (let i = NAV_SECTIONS.length - 1; i >= 0; i--) {
            const sec = NAV_SECTIONS[i];
            if (!sec) continue;
            const el = document.getElementById(sec.id);
            if (el && el.offsetTop <= scrollPos) {
              setActiveSection(sec.id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleReducedMotion = () => {
    const next = !isReducedMotion;
    setIsReducedMotion(next);
    localStorage.setItem('jashn_reduce_motion', String(next));
    if (next) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id="jashn-nav-dock"
      className="fixed top-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none no-print transition-all duration-300"
    >
      <nav
        aria-label="Main Navigation"
        className={`pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 rounded-2xl glass-card border border-white/10 shadow-2xl transition-all duration-300 ${
          isScrolled
            ? 'py-2 px-3 sm:px-5 bg-surface-50/90 backdrop-blur-xl scale-[0.98] border-white/15 shadow-glow/10'
            : 'py-2.5 px-4 sm:px-6 bg-surface-50/75 backdrop-blur-lg scale-100'
        } max-w-5xl w-full`}
      >
        {/* Brand Crest */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-festive-saffron to-festive-rose flex items-center justify-center shadow-glow text-black font-black text-lg select-none">
            ज
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-tight text-white">Jashn</span>
            <span className="hidden md:inline-block text-[10px] font-bold text-festive-gold px-2 py-0.5 rounded-full bg-festive-gold/10 border border-festive-gold/25 uppercase tracking-wider">
              Luxury Atelier
            </span>
          </div>
        </div>

        {/* Section Quick-Jump Pills (Desktop) */}
        <div className="hidden lg:flex items-center space-x-1 rounded-full p-1 bg-surface-100/70 border border-white/5">
          {NAV_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeSection === sec.id
                  ? 'bg-gradient-to-r from-festive-saffron to-festive-gold text-black shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Controls & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Accessible Locale Switcher */}
          <div
            className="flex items-center rounded-xl bg-surface-100/90 p-0.5 border border-white/10"
            role="group"
            aria-label="Language Selector"
          >
            {(['en', 'hi', 'mr'] as const).map((loc) => {
              const labels: Record<Locale, string> = { en: 'EN', hi: 'हिंदी', mr: 'मराठी' };
              const isActive = currentLocale === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => onLocaleChange(loc)}
                  className={`px-2 sm:px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all min-h-[36px] ${
                    isActive
                      ? 'bg-gradient-to-r from-festive-saffron to-festive-gold text-black shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  aria-pressed={isActive}
                >
                  {labels[loc]}
                </button>
              );
            })}
          </div>

          {/* Reduce Motion Toggle */}
          <button
            type="button"
            onClick={toggleReducedMotion}
            className={`p-2 rounded-xl text-xs font-bold border transition-all min-h-[38px] min-w-[38px] flex items-center justify-center ${
              isReducedMotion
                ? 'bg-festive-rose/20 border-festive-rose/50 text-festive-rose'
                : 'bg-surface-100 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
            title={isReducedMotion ? 'Motion Reduced (Click to enable animations)' : 'Reduce Motion (Click to disable animations)'}
            aria-label={isReducedMotion ? 'Enable animations' : 'Reduce animations'}
            aria-pressed={isReducedMotion}
          >
            {isReducedMotion ? '⏸️' : '⚡'}
          </button>

          {/* Celebrate Finalize Trigger */}
          {hasPlan && (
            <MagneticButton
              variant="primary"
              onClick={onFinalizePlan}
              className="py-1.5 px-3.5 text-xs font-bold rounded-xl shadow-glow min-h-[38px]"
            >
              <span aria-hidden="true">🎉</span>
              <span className="hidden sm:inline">Celebrate</span>
            </MagneticButton>
          )}
        </div>
      </nav>
    </header>
  );
}
