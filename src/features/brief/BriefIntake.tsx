'use client';

import React, { useState, useEffect } from 'react';
import { Locale, DICTIONARIES } from '@/lib/i18n';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '@/lib/voice';
import { EventBrief } from '@/engine/types';

interface BriefIntakeProps {
  currentLocale: Locale;
  isLoading: boolean;
  onGeneratePlan: (briefText: string, override?: Partial<EventBrief>) => void;
  extractedBrief?: EventBrief;
  missingFields?: readonly string[];
}

const PRESET_BRIEFS = {
  wedding: 'Indian wedding in Jaipur, 200 guests, ₹15 Lakhs budget, royal heritage vibe with authentic Rajasthani catering, 24 weeks away.',
  birthday: '30th birthday rooftop party in Mumbai, 60 guests, ₹2 Lakhs budget, chic modern vibe with craft cocktails and DJ, 4 weeks away.',
  community: 'Diwali community celebration in Pune, 300 guests, ₹5 Lakhs budget, traditional cultural evening with vegetarian buffet, 12 weeks away.',
};

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

  useEffect(() => {
    setVoiceAvailable(isSpeechRecognitionSupported());
  }, []);

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
      currentLocale === 'hi' ? 'hi-IN' : currentLocale === 'mr' ? 'mr-IN' : 'en-IN',
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
    <section aria-labelledby="intake-heading" className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-10 border border-white/10 shadow-glass">
      {/* Mesh gradient ambient background */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 bg-festive-saffron/20 rounded-full blur-3xl pointer-events-none animate-mesh"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-festive-magenta/20 rounded-full blur-3xl pointer-events-none animate-mesh"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
        <h1
          id="intake-heading"
          className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-festive-saffron via-festive-gold to-festive-magenta"
        >
          {t.appTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.appSubtitle}
        </p>

        {/* Preset Chips */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2" role="group" aria-label={t.presetsTitle}>
          <span className="text-xs text-slate-400 font-medium mr-1">{t.presetsTitle}:</span>
          <button
            type="button"
            onClick={() => setBriefText(PRESET_BRIEFS.wedding)}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-surface-100 hover:bg-surface-200 border border-white/10 text-slate-200 hover:text-festive-gold transition-colors"
          >
            🏰 {t.weddingPreset}
          </button>
          <button
            type="button"
            onClick={() => setBriefText(PRESET_BRIEFS.birthday)}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-surface-100 hover:bg-surface-200 border border-white/10 text-slate-200 hover:text-festive-gold transition-colors"
          >
            🎂 {t.birthdayPreset}
          </button>
          <button
            type="button"
            onClick={() => setBriefText(PRESET_BRIEFS.community)}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-surface-100 hover:bg-surface-200 border border-white/10 text-slate-200 hover:text-festive-gold transition-colors"
          >
            🪔 {t.communityPreset}
          </button>
        </div>

        {/* Intake Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          <div className="relative rounded-2xl bg-surface-50/80 border border-white/10 p-2 shadow-inner focus-within:ring-2 focus-within:ring-festive-saffron transition-all">
            <label htmlFor="celebration-brief" className="sr-only">
              {t.intakePlaceholder}
            </label>
            <textarea
              id="celebration-brief"
              rows={3}
              value={briefText}
              onChange={(e) => setBriefText(e.target.value)}
              placeholder={t.intakePlaceholder}
              className="w-full bg-transparent p-3 text-slate-100 placeholder-slate-400 text-sm sm:text-base outline-none resize-none"
              disabled={isLoading}
            />

            <div className="flex items-center justify-between pt-2 px-2 border-t border-white/5">
              {voiceAvailable ? (
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  aria-pressed={isListening}
                  className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium min-h-[44px] transition-colors ${
                    isListening
                      ? 'bg-festive-magenta text-white animate-pulse'
                      : 'bg-surface-100 text-slate-300 hover:text-white'
                  }`}
                >
                  <span aria-hidden="true">{isListening ? '🔴' : '🎙️'}</span>
                  <span>{isListening ? t.listeningBtn : t.voiceStartBtn}</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={isLoading || !briefText.trim()}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-festive-saffron via-festive-gold to-festive-magenta text-black shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] transition-all"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    <span>Planning Celebration...</span>
                  </>
                ) : (
                  <span>{t.generatePlanBtn} →</span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Dynamic Parameter Extraction Chips */}
        {extractedBrief && (
          <div className="mt-4 pt-4 border-t border-white/10 text-left space-y-2" aria-live="polite">
            <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
              Parsed Celebration Parameters:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-festive-indigo/60 border border-festive-indigo text-slate-200">
                🎉 Type: <strong className="text-festive-gold uppercase">{extractedBrief.eventType}</strong>
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface-100 border border-white/10 text-slate-200">
                👥 Guests: <strong>{extractedBrief.guests}</strong>
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface-100 border border-white/10 text-slate-200">
                💰 Budget: <strong>{extractedBrief.currency} {extractedBrief.budget.toLocaleString()}</strong>
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface-100 border border-white/10 text-slate-200">
                📍 City: <strong>{extractedBrief.city}</strong>
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface-100 border border-white/10 text-slate-200">
                📅 Date: <strong>{extractedBrief.targetDate}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Missing Field Follow-Up Chips */}
        {missingFields.length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-festive-magenta/10 border border-festive-magenta/30 text-left" role="alert">
            <p className="text-xs font-bold text-festive-rose mb-2">
              ⚠️ Missing Details (Click to provide):
            </p>
            <div className="flex flex-wrap gap-2">
              {missingFields.map((field) => (
                <div key={field} className="flex items-center space-x-1">
                  <span className="text-xs text-slate-300 font-medium capitalize">{field}:</span>
                  <input
                    type="text"
                    placeholder={`Enter ${field}`}
                    value={missingFieldValues[field] ?? ''}
                    onChange={(e) => setMissingFieldValues((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="px-2 py-1 text-xs bg-surface-100 rounded border border-white/20 text-white outline-none focus:border-festive-gold"
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
