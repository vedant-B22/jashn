'use client';

import React, { useState, useEffect } from 'react';
import { Locale, DICTIONARIES } from '@/lib/i18n';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '@/lib/voice';
import { EventBrief } from '@/engine/types';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface BriefIntakeProps {
  currentLocale: Locale;
  isLoading: boolean;
  onGeneratePlan: (briefText: string, override?: Partial<EventBrief>) => void;
  extractedBrief?: EventBrief;
  missingFields?: readonly string[];
}

const PRESET_BRIEFS = {
  wedding:
    'Indian wedding in Jaipur, 200 guests, ₹15 Lakhs budget, royal heritage vibe with authentic Rajasthani catering, 24 weeks away.',
  birthday:
    '30th birthday rooftop party in Mumbai, 60 guests, ₹2 Lakhs budget, chic modern vibe with craft cocktails and DJ, 4 weeks away.',
  community:
    'Diwali community celebration in Pune, 300 guests, ₹5 Lakhs budget, traditional cultural evening with vegetarian buffet, 12 weeks away.',
};

const ASSEMBLY_STEPS = [
  'Understanding celebration brief & cultural constraints...',
  'Allocating budget with zero-sum deterministic engine...',
  'Scheduling backward timeline & critical path milestones...',
  'Curating vendor intelligence & negotiation playbooks...',
  'Crafting bespoke theme mood boards & explainability trace...',
];

export function BriefIntake({
  currentLocale,
  isLoading,
  onGeneratePlan,
  extractedBrief,
  missingFields = [],
}: BriefIntakeProps) {
  const t = DICTIONARIES[currentLocale];
  const [briefText, setBriefText] = useState(PRESET_BRIEFS.wedding);
  const [isListening, setIsListening] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [missingFieldValues, setMissingFieldValues] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setVoiceAvailable(isSpeechRecognitionSupported());
  }, []);

  // Step through cinematic assembly sequence while loading
  useEffect(() => {
    if (!isLoading) {
      setActiveStep(0);
      return;
    }

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < ASSEMBLY_STEPS.length - 1 ? prev + 1 : prev));
    }, 900);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setBriefText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      },
      () => setIsListening(false),
      () => setIsListening(false),
      currentLocale === 'hi' ? 'hi-IN' : currentLocale === 'mr' ? 'mr-IN' : 'en-IN'
    );

    if (recognizer) {
      setIsListening(true);
      recognizer.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefText.trim() || isLoading) return;
    onGeneratePlan(briefText);
  };

  return (
    <section aria-labelledby="intake-heading" className="relative pt-12 sm:pt-20 pb-8 sm:pb-12 text-center">
      {/* Floating Decorative Festive Elements (Pure SVG) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-8 w-24 h-24 opacity-20 hidden md:block animate-pulse"
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-festive-saffron">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.8" />
          <path d="M50 15 L50 85 M15 50 L85 50" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 right-10 w-28 h-28 opacity-25 hidden md:block"
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-festive-rose">
          <polygon points="50,10 63,38 90,38 68,56 77,84 50,68 23,84 32,56 10,38 37,38" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 px-4">
        {/* Subtle Category Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-100/90 border border-white/10 shadow-glass">
          <span className="w-2 h-2 rounded-full bg-festive-saffron animate-ping" aria-hidden="true" />
          <span className="text-xs font-bold text-festive-gold tracking-wide uppercase">
            Autonomous Celebration Atelier
          </span>
        </div>

        {/* Hero Title with Word Blur-to-Sharp Reveal & Shimmer Accent */}
        <h1
          id="intake-heading"
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] [text-wrap:balance]"
        >
          <span className="text-white">Turn One Sentence Into An Unforgettable </span>
          <span className="shimmer-text font-serif italic font-normal">Celebration</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
          {t.appSubtitle} Deterministic budget rules paired with generative AI. Zero hallucinations.
        </p>

        {/* Preset Chips Marquee / Snap Carousel */}
        <div
          className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          role="group"
          aria-label={t.presetsTitle}
        >
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1">
            {t.presetsTitle}:
          </span>
          <button
            type="button"
            onClick={() => setBriefText(PRESET_BRIEFS.wedding)}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-surface-100/90 hover:bg-surface-200 border border-white/10 text-slate-200 hover:text-festive-gold hover:border-festive-gold/40 transition-all active:scale-95 shadow-sm"
          >
            🏰 {t.weddingPreset}
          </button>
          <button
            type="button"
            onClick={() => setBriefText(PRESET_BRIEFS.birthday)}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-surface-100/90 hover:bg-surface-200 border border-white/10 text-slate-200 hover:text-festive-gold hover:border-festive-gold/40 transition-all active:scale-95 shadow-sm"
          >
            🎂 {t.birthdayPreset}
          </button>
          <button
            type="button"
            onClick={() => setBriefText(PRESET_BRIEFS.community)}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-surface-100/90 hover:bg-surface-200 border border-white/10 text-slate-200 hover:text-festive-gold hover:border-festive-gold/40 transition-all active:scale-95 shadow-sm"
          >
            🪔 {t.communityPreset}
          </button>
        </div>

        {/* The Showpiece Command Bar */}
        <form onSubmit={handleSubmit} className="mt-8 text-left">
          <div className="conic-border-glow rounded-3xl p-1.5 bg-surface-50/90 backdrop-blur-2xl shadow-glass">
            <div className="relative rounded-[22px] bg-surface-100/80 p-3 sm:p-5 border border-white/5 space-y-3">
              <label htmlFor="celebration-brief" className="sr-only">
                {t.intakePlaceholder}
              </label>

              {/* Scanning lightbeam during AI processing */}
              {isLoading && (
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-festive-gold to-transparent animate-pulse"
                />
              )}

              <textarea
                id="celebration-brief"
                rows={3}
                value={briefText}
                onChange={(e) => setBriefText(e.target.value)}
                placeholder={t.intakePlaceholder}
                className="w-full bg-transparent p-2 sm:p-3 text-slate-100 placeholder-slate-400 text-sm sm:text-base outline-none resize-none leading-relaxed"
                disabled={isLoading}
              />

              {/* Action Bar inside Command Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  {voiceAvailable && (
                    <button
                      type="button"
                      onClick={handleVoiceToggle}
                      aria-pressed={isListening}
                      className={`relative inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold min-h-[44px] transition-all ${
                        isListening
                          ? 'bg-festive-rose text-white ring-4 ring-festive-rose/30 animate-pulse'
                          : 'bg-surface-200 text-slate-300 hover:text-white hover:bg-surface-300 border border-white/10'
                      }`}
                    >
                      <span aria-hidden="true">{isListening ? '🔴' : '🎙️'}</span>
                      <span>{isListening ? t.listeningBtn : t.voiceStartBtn}</span>
                    </button>
                  )}
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {briefText.length} characters
                  </span>
                </div>

                <MagneticButton
                  type="submit"
                  disabled={isLoading || !briefText.trim()}
                  className="w-full sm:w-auto px-7 py-3 text-sm font-black"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      <span>Assembling Plan...</span>
                    </div>
                  ) : (
                    <span>{t.generatePlanBtn} →</span>
                  )}
                </MagneticButton>
              </div>
            </div>
          </div>
        </form>

        {/* Cinematic Assembly Sequence Progress Stepper */}
        {isLoading && (
          <SpotlightCard className="p-6 text-left space-y-4 border border-festive-gold/30 bg-surface-50/95 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-festive-gold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-festive-gold animate-ping" />
                Deterministic Engine Synthesis
              </span>
              <span className="text-xs font-bold text-slate-400 tabular-nums">
                Step {activeStep + 1} of {ASSEMBLY_STEPS.length}
              </span>
            </div>

            <div className="space-y-2">
              {ASSEMBLY_STEPS.map((step, idx) => {
                const isPast = idx < activeStep;
                const isCurrent = idx === activeStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 text-xs sm:text-sm transition-all duration-300 ${
                      isPast
                        ? 'text-emerald-400 font-semibold'
                        : isCurrent
                        ? 'text-festive-gold font-bold scale-[1.01]'
                        : 'text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isPast
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isCurrent
                          ? 'bg-festive-gold/20 text-festive-gold border border-festive-gold animate-pulse'
                          : 'bg-surface-200 text-slate-500'
                      }`}
                    >
                      {isPast ? '✓' : idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </SpotlightCard>
        )}

        {/* Dynamic Parameter Extraction Chips with Glowing Rings */}
        {extractedBrief && !isLoading && (
          <div className="pt-2 text-left space-y-3" aria-live="polite">
            <p className="text-xs text-slate-400 font-extrabold tracking-wider uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-festive-jade" />
              Verified Celebration Parameters:
            </p>
            <div className="flex flex-wrap gap-2.5">
              <span className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-festive-indigo/50 border border-festive-indigo text-slate-100 shadow-sm flex items-center gap-1.5">
                <span>🎉</span> Type: <strong className="text-festive-gold uppercase">{extractedBrief.eventType}</strong>
              </span>
              <span className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-surface-100 border border-white/10 text-slate-100 shadow-sm flex items-center gap-1.5 tabular-nums">
                <span>👥</span> Guests: <strong className="text-white">{extractedBrief.guests}</strong>
              </span>
              <span className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-surface-100 border border-white/10 text-slate-100 shadow-sm flex items-center gap-1.5 tabular-nums">
                <span>💰</span> Budget: <strong className="text-festive-gold">{extractedBrief.currency} {extractedBrief.budget.toLocaleString()}</strong>
              </span>
              <span className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-surface-100 border border-white/10 text-slate-100 shadow-sm flex items-center gap-1.5">
                <span>📍</span> City: <strong className="text-white">{extractedBrief.city}</strong>
              </span>
              <span className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-surface-100 border border-white/10 text-slate-100 shadow-sm flex items-center gap-1.5 tabular-nums">
                <span>📅</span> Date: <strong className="text-white">{extractedBrief.targetDate}</strong>
              </span>
              {extractedBrief.dietaryConstraints?.map((diet) => (
                <span
                  key={diet}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-surface-100 border border-white/10 text-emerald-300 shadow-sm flex items-center gap-1.5"
                >
                  <span>🥗</span> {diet}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Field Follow-Up Chips */}
        {missingFields.length > 0 && !isLoading && (
          <div
            className="p-4 rounded-2xl bg-festive-rose/10 border border-festive-rose/30 text-left space-y-2 shadow-glow-magenta/10"
            role="alert"
          >
            <p className="text-xs font-extrabold text-festive-rose uppercase tracking-wide flex items-center gap-2">
              <span>⚠️</span> Missing Details (Provide to refine accuracy):
            </p>
            <div className="flex flex-wrap gap-2.5">
              {missingFields.map((field) => (
                <div key={field} className="flex items-center space-x-1.5 bg-surface-100/90 px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold capitalize">{field}:</span>
                  <input
                    type="text"
                    placeholder={`Enter ${field}`}
                    value={missingFieldValues[field] ?? ''}
                    onChange={(e) => setMissingFieldValues((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="px-2 py-1 text-xs bg-surface-200 rounded-lg border border-white/20 text-white outline-none focus:border-festive-gold min-h-[32px]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
