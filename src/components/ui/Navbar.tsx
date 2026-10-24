'use client';

import React from 'react';
import { Locale } from '@/lib/i18n';

interface NavbarProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onFinalizePlan?: () => void;
  hasPlan: boolean;
}

export function Navbar({ currentLocale, onLocaleChange, onFinalizePlan, hasPlan }: NavbarProps) {

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-white/10 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-festive-saffron to-festive-magenta flex items-center justify-center shadow-glow text-white font-black text-xl">
            ज
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">Jashn</span>
            <span className="hidden sm:inline-block ml-2 text-xs text-festive-gold font-medium px-2 py-0.5 rounded-full border border-festive-gold/30 bg-festive-gold/10">
              GenAI Planner
            </span>
          </div>
        </div>

        <nav aria-label="Main Navigation" className="flex items-center space-x-2 sm:space-x-4">
          {hasPlan && (
            <button
              onClick={onFinalizePlan}
              className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-festive-saffron to-festive-magenta text-white shadow-glow hover:brightness-110 active:scale-95 transition-all"
            >
              🎉 Celebrate
            </button>
          )}

          {/* Accessible Locale Switcher */}
          <div className="flex items-center rounded-lg bg-surface-100 p-1 border border-white/10" role="group" aria-label="Language Selector">
            <button
              type="button"
              onClick={() => onLocaleChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentLocale === 'en'
                  ? 'bg-festive-saffron text-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              aria-pressed={currentLocale === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLocaleChange('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentLocale === 'hi'
                  ? 'bg-festive-saffron text-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              aria-pressed={currentLocale === 'hi'}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => onLocaleChange('mr')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentLocale === 'mr'
                  ? 'bg-festive-saffron text-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              aria-pressed={currentLocale === 'mr'}
            >
              मराठी
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
