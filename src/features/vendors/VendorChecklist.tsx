'use client';

import React, { useState, useEffect } from 'react';
import { VendorChecklistItem, VendorStatus, BudgetCategory } from '@/engine/types';
import { Locale, DICTIONARIES } from '@/lib/i18n';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

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
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

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

  const toggleExpand = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Progress metrics
  const totalCount = initialChecklists.length;
  const bookedCount = initialChecklists.filter(
    (item) => (statuses[item.category] ?? item.status) === 'booked'
  ).length;
  const bookedPercentage = totalCount > 0 ? Math.round((bookedCount / totalCount) * 100) : 0;

  return (
    <SpotlightCard
      aria-labelledby="vendors-heading"
      className="p-6 sm:p-10 border border-white/10 shadow-glass space-y-8"
    >
      {/* Header with Progress Ring Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-festive-gold/10 border border-festive-gold/30 text-xs font-bold text-festive-gold mb-2">
            <span>●</span> Negotiation Intelligence
          </div>
          <h2 id="vendors-heading" className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span aria-hidden="true">🤝</span> {t.vendorsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.vendorsSubtitle}</p>
        </div>

        {/* Overall Category Progress Ring Pill */}
        <div className="flex items-center gap-3 bg-surface-100/90 px-4 py-2.5 rounded-2xl border border-white/10">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1E1E34"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#FFB800"
                strokeWidth="3.5"
                strokeDasharray={`${bookedPercentage}, 100`}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[10px] font-black text-festive-gold tabular-nums">
              {bookedPercentage}%
            </span>
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">
              {bookedCount} of {totalCount} Booked
            </span>
            <span className="text-[11px] text-slate-400">Contracts Finalized</span>
          </div>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialChecklists.map((item) => {
          const currentStatus = statuses[item.category] ?? item.status;
          const isExpanded = expandedCategories[item.category] ?? true;

          return (
            <div
              key={item.category}
              className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between transition-all hover:border-festive-gold/30 hover:shadow-glow/5"
            >
              <div className="space-y-3.5">
                {/* Header & Status Pill Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{item.title}</h3>
                    <span className="text-xs font-semibold text-festive-gold">
                      Recommended Lead: {item.leadTimeWeeks} weeks prior
                    </span>
                  </div>

                  {/* Kanban Status Pill Group */}
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

                {/* Benchmark Cost Range */}
                <div className="text-xs text-slate-300 flex items-center justify-between bg-surface-100/50 p-2.5 rounded-xl border border-white/5">
                  <span className="font-semibold text-slate-400">Benchmark Market Range:</span>
                  <strong className="text-white font-mono tabular-nums">
                    {currency} {item.estimatedCostRange.min.toLocaleString()} – {currency} {item.estimatedCostRange.max.toLocaleString()}
                  </strong>
                </div>

                {/* Accordion Toggle */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item.category)}
                  className="text-xs font-bold text-festive-gold hover:text-white flex items-center gap-1.5 transition-colors pt-1"
                >
                  <span>{isExpanded ? '▾ Hide Questions & Warnings' : '▸ Show Questions & Warnings'}</span>
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="space-y-3 pt-2">
                    {/* Must-Ask Questions */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-extrabold text-festive-saffron uppercase tracking-wider">
                        Essential Vendor Questions:
                      </p>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4 leading-relaxed">
                        {item.questionsToAsk.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Red Flag Contract Warnings */}
                    <div className="p-3 rounded-xl bg-festive-rose/10 border border-festive-rose/25 space-y-1">
                      <p className="text-[11px] font-black text-festive-rose uppercase tracking-wider flex items-center gap-1.5">
                        <span>⚠️</span> Contract Red Flags to Check:
                      </p>
                      <ul className="text-xs text-slate-300 space-y-0.5 list-disc pl-4 leading-relaxed">
                        {item.redFlags.map((flag, idx) => (
                          <li key={idx} className="text-slate-300">{flag}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Negotiation Tactics */}
                    <div className="p-3 rounded-xl bg-festive-indigo/30 border border-festive-indigo/60 space-y-1">
                      <p className="text-[11px] font-black text-festive-gold uppercase tracking-wider flex items-center gap-1.5">
                        <span>💡</span> Negotiation Tactics & Tips:
                      </p>
                      <ul className="text-xs text-slate-300 space-y-0.5 list-disc pl-4 leading-relaxed">
                        {item.negotiationTips.map((tip, idx) => (
                          <li key={idx} className="text-slate-300">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SpotlightCard>
  );
}
