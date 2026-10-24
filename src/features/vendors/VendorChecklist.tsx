'use client';

import React, { useState, useEffect } from 'react';
import { VendorChecklistItem, VendorStatus, BudgetCategory } from '@/engine/types';
import { Locale, DICTIONARIES } from '@/lib/i18n';

interface VendorChecklistProps {
  currentLocale: Locale;
  initialChecklists: readonly VendorChecklistItem[];
  currency: string;
}

const STORAGE_KEY = 'jashn_vendor_statuses';

const STATUS_OPTIONS: readonly { value: VendorStatus; label: string; color: string }[] = [
  { value: 'not_started', label: 'Not Started', color: 'bg-surface-200 text-slate-300' },
  { value: 'contacted', label: 'Contacted', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  { value: 'quoted', label: 'Quoted', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  { value: 'booked', label: 'Booked', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
];

export function VendorChecklist({ currentLocale, initialChecklists, currency }: VendorChecklistProps) {
  const t = DICTIONARIES[currentLocale];
  const [statuses, setStatuses] = useState<Record<BudgetCategory, VendorStatus>>(() => {
    return {} as Record<BudgetCategory, VendorStatus>;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setStatuses(JSON.parse(stored));
        }
      } catch {
        // Fallback to default
      }
    }
  }, []);

  const handleStatusChange = (category: BudgetCategory, newStatus: VendorStatus) => {
    setStatuses((prev) => {
      const next = { ...prev, [category]: newStatus };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore
        }
      }
      return next;
    });
  };

  return (
    <section aria-labelledby="vendors-heading" className="rounded-3xl glass-card p-6 sm:p-8 border border-white/10 shadow-glass space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 id="vendors-heading" className="text-2xl font-black text-white flex items-center gap-2">
          <span aria-hidden="true">🤝</span> {t.vendorsTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.vendorsSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialChecklists.map((item) => {
          const currentStatus = statuses[item.category] ?? item.status;

          return (
            <div
              key={item.category}
              className="glass-card p-5 sm:p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{item.title}</h3>
                    <span className="text-xs text-festive-gold">
                      Recommended Lead Time: {item.leadTimeWeeks} weeks before
                    </span>
                  </div>

                  {/* Status Picker Pill Group */}
                  <div className="flex flex-wrap gap-1" role="group" aria-label={`Status for ${item.title}`}>
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleStatusChange(item.category, opt.value)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all min-h-[36px] ${
                          currentStatus === opt.value
                            ? opt.color
                            : 'bg-surface-100 text-slate-400 hover:text-white'
                        }`}
                        aria-pressed={currentStatus === opt.value}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estimated Budget Range */}
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-slate-400">Benchmark Cost: </span>
                  <strong className="text-white">
                    {currency} {item.estimatedCostRange.min.toLocaleString()} – {currency} {item.estimatedCostRange.max.toLocaleString()}
                  </strong>
                </div>

                {/* Key Questions */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-festive-saffron uppercase tracking-wider">
                    Must-Ask Questions:
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 leading-relaxed">
                    {item.questionsToAsk.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>

                {/* Red Flags Alert */}
                <div className="p-3 rounded-xl bg-festive-magenta/10 border border-festive-magenta/20 space-y-1">
                  <p className="text-[11px] font-bold text-festive-rose uppercase">🚩 Red Flags to Watch:</p>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 leading-relaxed">
                    {item.redFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>

                {/* Negotiation Tips */}
                <div className="p-3 rounded-xl bg-festive-gold/10 border border-festive-gold/20 space-y-1">
                  <p className="text-[11px] font-bold text-festive-gold uppercase">💡 Negotiation Power Move:</p>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 leading-relaxed">
                    {item.negotiationTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
