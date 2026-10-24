'use client';

import React, { useState } from 'react';
import { CreativeIdeas } from '@/ai/schemas/plan.schema';
import { Locale, DICTIONARIES } from '@/lib/i18n';

interface PersonalizedIdeasProps {
  currentLocale: Locale;
  ideas: CreativeIdeas;
  onOpenWhyThis?: () => void;
}

export function PersonalizedIdeas({ currentLocale, ideas, onOpenWhyThis }: PersonalizedIdeasProps) {
  const t = DICTIONARIES[currentLocale];
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const filteredMenuItems =
    selectedCourse === 'all'
      ? ideas.menuSuggestions
      : ideas.menuSuggestions.filter((item) => item.course === selectedCourse);

  return (
    <section aria-labelledby="ideas-heading" className="rounded-3xl glass-card p-6 sm:p-8 border border-white/10 shadow-glass space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 id="ideas-heading" className="text-2xl font-black text-white flex items-center gap-2">
            <span aria-hidden="true">🎨</span> {t.ideasTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.ideasSubtitle}</p>
        </div>

        {onOpenWhyThis && (
          <button
            type="button"
            onClick={onOpenWhyThis}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-surface-100 hover:bg-surface-200 border border-festive-gold/30 text-festive-gold shadow-sm transition-all min-h-[44px]"
          >
            <span>💡</span>
            <span>{t.whyThisBtn}</span>
          </button>
        )}
      </div>

      {/* Hero Theme & Procedural Mood Board Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Procedural Pattern & Color Swatches (Interactive Flip Card) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-surface-100/70 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-festive-gold uppercase tracking-wider">
              Procedural Mood Board
            </span>
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded bg-surface-200 border border-white/10 min-h-[36px]"
              aria-label="Flip mood board pattern"
            >
              🔄 Flip Texture
            </button>
          </div>

          {/* Procedural SVG Graphic Tile */}
          <div
            className={`w-full h-44 rounded-xl border border-white/15 flex items-center justify-center p-4 transition-transform duration-500 transform ${
              isFlipped ? 'rotate-180 scale-95' : ''
            }`}
            style={{
              background: `linear-gradient(135deg, ${ideas.moodBoardColors[0]?.hex ?? '#FF7F11'}33, ${
                ideas.moodBoardColors[1]?.hex ?? '#D81159'
              }33)`,
            }}
          >
            <svg
              viewBox="0 0 120 120"
              className="w-32 h-32 opacity-80"
              aria-hidden="true"
            >
              <defs>
                <pattern id="jashn-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="3" fill={ideas.moodBoardColors[0]?.hex ?? '#FF7F11'} />
                  <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke={ideas.moodBoardColors[2]?.hex ?? '#FFB800'} strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="120" height="120" fill="url(#jashn-pattern)" rx="8" />
              <circle cx="60" cy="60" r="28" fill="none" stroke={ideas.moodBoardColors[1]?.hex ?? '#D81159'} strokeWidth="2" />
              <circle cx="60" cy="60" r="14" fill="none" stroke={ideas.moodBoardColors[0]?.hex ?? '#FF7F11'} strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* Color Palette Swatches */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Color Palette:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ideas.moodBoardColors.map((color) => (
                <div key={color.name} className="p-2 rounded-xl bg-surface-200/50 border border-white/5 text-center space-y-1">
                  <div
                    className="w-full h-6 rounded-md shadow-sm border border-white/10"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />
                  <p className="text-[10px] font-bold text-white truncate">{color.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Theme Title, Decor & Entertainment Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-2xl bg-surface-100/70 border border-white/10 space-y-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-festive-saffron/20 text-festive-saffron border border-festive-saffron/30">
              Curated Theme
            </span>
            <h3 className="text-2xl font-black text-white">{ideas.themeTitle}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{ideas.themeDescription}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-festive-gold uppercase tracking-wider flex items-center gap-1.5">
                <span>🪔</span> Decor & Ambiance
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{ideas.decorConcept}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-festive-rose uppercase tracking-wider flex items-center gap-1.5">
                <span>🎵</span> Entertainment Concept
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{ideas.entertainmentConcept}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-200/40 border border-white/5 text-xs text-slate-400 italic">
            &ldquo;{ideas.whyThisTheme}&rdquo;
          </div>
        </div>
      </div>

      {/* Dietary-Conscious Banquet Menu Suggestions */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🍽️</span> Bespoke Banquet Tasting Menu
            </h3>
            <p className="text-xs text-slate-400">Respecting dietary guidelines and regional flavors</p>
          </div>

          {/* Course filter pills */}
          <div className="flex flex-wrap gap-1" role="group" aria-label="Course Filter">
            {['all', 'welcome_drinks', 'starters', 'main_course', 'desserts'].map((course) => (
              <button
                key={course}
                type="button"
                onClick={() => setSelectedCourse(course)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors min-h-[36px] ${
                  selectedCourse === course
                    ? 'bg-festive-saffron text-black font-bold'
                    : 'bg-surface-100 text-slate-400 hover:text-white'
                }`}
              >
                {course.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredMenuItems.map((item, idx) => (
            <div key={idx} className="glass-card p-4 rounded-xl border border-white/5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="capitalize text-slate-400 font-medium">
                    {item.course.replace('_', ' ')}
                  </span>
                  <span
                    className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                      item.isVegetarian
                        ? 'border-emerald-500 text-emerald-500'
                        : 'border-red-500 text-red-500'
                    }`}
                    title={item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                    aria-label={item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-white">{item.name}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-tight">{item.description}</p>
              </div>

              <div className="flex flex-wrap gap-1 pt-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-surface-200 text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
