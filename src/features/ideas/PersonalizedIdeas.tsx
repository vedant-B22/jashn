'use client';

import React, { useState } from 'react';
import { CreativeIdeas } from '@/ai/schemas/plan.schema';
import { Locale, DICTIONARIES } from '@/lib/i18n';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface PersonalizedIdeasProps {
  currentLocale: Locale;
  ideas: CreativeIdeas;
  onOpenWhyThis?: () => void;
}

const PROCEDURAL_PATTERNS = [
  { id: 'mandala', name: 'Mandala Sunburst' },
  { id: 'marigold_lattice', name: 'Mughal Jaali Lattice' },
  { id: 'royal_jali', name: 'Royal Jali Lattice' },
  { id: 'starry_lights', name: 'Starry Twilight Lights' },
];

export function PersonalizedIdeas({ currentLocale, ideas, onOpenWhyThis }: PersonalizedIdeasProps) {
  const t = DICTIONARIES[currentLocale];
  const [patternIndex, setPatternIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const filteredMenuItems =
    selectedCourse === 'all'
      ? ideas.menuSuggestions
      : ideas.menuSuggestions.filter((item) => item.course === selectedCourse);

  const handleCopyColor = (hex: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex);
    }
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleFlipPattern = () => {
    setIsFlipped(!isFlipped);
    setPatternIndex((prev) => (prev + 1) % PROCEDURAL_PATTERNS.length);
  };

  const c1 = ideas.moodBoardColors[0]?.hex ?? '#FF9F1C';
  const c2 = ideas.moodBoardColors[1]?.hex ?? '#E83F6F';
  const c3 = ideas.moodBoardColors[2]?.hex ?? '#FFC857';

  return (
    <SpotlightCard
      aria-labelledby="ideas-heading"
      className="p-6 sm:p-10 border border-white/10 shadow-glass space-y-8"
    >
      {/* Toast Alert for Copied Color */}
      {copiedColor && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-surface-100 border border-festive-gold text-festive-gold text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2"
        >
          <span>✓</span> Copied {copiedColor} to clipboard!
        </div>
      )}

      {/* Header with "Why this?" button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-festive-saffron/10 border border-festive-saffron/30 text-xs font-bold text-festive-gold mb-2">
            <span>●</span> Generative Creative Engine
          </div>
          <h2 id="ideas-heading" className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span aria-hidden="true">🎨</span> {t.ideasTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.ideasSubtitle}</p>
        </div>

        {onOpenWhyThis && (
          <button
            type="button"
            onClick={onOpenWhyThis}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-surface-100 hover:bg-surface-200 border border-festive-gold/40 text-festive-gold shadow-glow/10 hover:border-festive-gold transition-all min-h-[44px] active:scale-95"
          >
            <span>💡</span>
            <span>{t.whyThisBtn}</span>
          </button>
        )}
      </div>

      {/* Hero Theme & Procedural Mood Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Procedural Pattern & Swatches Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-surface-100/70 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold text-festive-gold uppercase tracking-wider block">
                Procedural Mood Board
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {PROCEDURAL_PATTERNS[patternIndex]?.name ?? 'Mandala'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleFlipPattern}
              className="text-xs font-bold text-slate-200 hover:text-white px-3 py-1.5 rounded-xl bg-surface-200 hover:bg-surface-300 border border-white/10 transition-all min-h-[36px] active:scale-95"
              aria-label="Flip mood board pattern"
            >
              🔄 Re-roll Texture
            </button>
          </div>

          {/* Interactive Procedural SVG Graphic Tile */}
          <div
            className={`w-full h-48 rounded-2xl border border-white/15 flex items-center justify-center p-4 transition-transform duration-500 transform ${
              isFlipped ? 'rotate-180 scale-95' : 'scale-100'
            }`}
            style={{
              background: `radial-gradient(circle at center, ${c1}33, ${c2}22, #0D0D18)`,
            }}
          >
            <svg viewBox="0 0 120 120" className="w-36 h-36 opacity-85" aria-hidden="true">
              <defs>
                <pattern id="jashn-pattern-active" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="12" cy="12" r="3.5" fill={c1} />
                  <path d="M 0 12 L 24 12 M 12 0 L 12 24" stroke={c3} strokeWidth="0.6" strokeDasharray="2 2" />
                </pattern>
              </defs>
              <rect width="120" height="120" fill="url(#jashn-pattern-active)" rx="12" />
              <circle cx="60" cy="60" r="32" fill="none" stroke={c2} strokeWidth="2" />
              <circle cx="60" cy="60" r="16" fill="none" stroke={c1} strokeWidth="1.5" strokeDasharray="4 4" />
              <polygon points="60,20 72,50 102,50 78,68 87,98 60,80 33,98 42,68 18,50 48,50" fill="none" stroke={c3} strokeWidth="0.8" />
            </svg>
          </div>

          {/* Color Palette Swatches with Copy-on-Click */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Curated Palette (Click to Copy):</span>
              <span className="text-festive-gold">Hex Codes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ideas.moodBoardColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleCopyColor(color.hex)}
                  className="p-2.5 rounded-xl bg-surface-200/60 hover:bg-surface-200 border border-white/5 hover:border-festive-gold/40 text-center space-y-1.5 transition-all active:scale-95 group min-h-[44px]"
                  title={`Click to copy ${color.hex}`}
                >
                  <div
                    className="w-full h-7 rounded-lg shadow-sm border border-white/10 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />
                  <div className="leading-none">
                    <p className="text-[11px] font-extrabold text-white truncate">{color.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{color.hex}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theme Narrative & Decor Concepts */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="p-6 rounded-2xl bg-surface-100/60 border border-white/10 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">✨</span>
              <h3 className="text-xl font-black text-white">{ideas.themeTitle}</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{ideas.themeDescription}</p>

            <div className="text-xs text-festive-gold font-bold pt-1">
              Decor Concept: <span className="text-slate-200 font-normal">{ideas.decorConcept}</span>
            </div>
            <div className="text-xs text-festive-saffron font-bold">
              Entertainment Vibe: <span className="text-slate-200 font-normal">{ideas.entertainmentConcept}</span>
            </div>
          </div>

          {/* Why This Theme Narrative */}
          <div className="p-6 rounded-2xl bg-surface-100/60 border border-white/10 space-y-2.5">
            <h4 className="text-xs font-extrabold text-festive-gold uppercase tracking-wider flex items-center gap-2">
              <span>🪔</span> Cultural Alignment & Creative Rationalization:
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ideas.whyThisTheme}
            </p>
          </div>
        </div>
      </div>

      {/* Banquet Culinary Menu Suggestions */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>🍽️</span> Bespoke Celebration Banquet
            </h3>
            <p className="text-xs text-slate-400">
              Curated dining selections aligned with guest dietary preferences.
            </p>
          </div>

          {/* Course Filter Tabs */}
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Course Filters">
            {['all', 'welcome_drinks', 'starters', 'main_course', 'desserts', 'late_night'].map((course) => (
              <button
                key={course}
                type="button"
                onClick={() => setSelectedCourse(course)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all min-h-[36px] ${
                  selectedCourse === course
                    ? 'bg-gradient-to-r from-festive-saffron to-festive-gold text-black shadow-sm'
                    : 'bg-surface-100 text-slate-300 hover:text-white hover:bg-surface-200'
                }`}
                aria-pressed={selectedCourse === course}
              >
                {course.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMenuItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-surface-100/60 border border-white/5 space-y-2 hover:border-festive-gold/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-festive-saffron uppercase mb-1">
                  <span>{item.course.replace('_', ' ')}</span>
                  {item.isVegetarian && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                      Veg
                    </span>
                  )}
                </div>
                <h4 className="font-extrabold text-sm text-white">{item.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">{item.description}</p>
              </div>

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {item.tags.map((tg) => (
                    <span key={tg} className="px-1.5 py-0.5 rounded text-[9px] bg-surface-200 text-slate-300">
                      {tg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}
