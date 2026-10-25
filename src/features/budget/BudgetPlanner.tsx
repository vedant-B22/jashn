'use client';

import React, { useState } from 'react';
import { BudgetBreakdown, BudgetCategory } from '@/engine/types';
import { rebalanceBudget, simulateGuestCountChange } from '@/engine/budget-allocator';
import { Locale, DICTIONARIES } from '@/lib/i18n';
import { CountUpNumber } from '@/components/ui/CountUpNumber';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface BudgetPlannerProps {
  currentLocale: Locale;
  breakdown: BudgetBreakdown;
  onUpdateBreakdown: (newBreakdown: BudgetBreakdown) => void;
  guestCount: number;
  currency: string;
}

const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  venue: '#FF9F1C', // Saffron
  catering: '#FFC857', // Gold
  decor: '#D81159', // Magenta
  photography: '#06D6A0', // Jade / Teal
  attire: '#E83F6F', // Rose
  entertainment: '#4C3BCF', // Royal Indigo
  misc: '#3A86FF', // Blue
  contingency: '#2EC4B6', // Emerald
};

export function BudgetPlanner({
  currentLocale,
  breakdown,
  onUpdateBreakdown,
  guestCount,
  currency,
}: BudgetPlannerProps) {
  const t = DICTIONARIES[currentLocale];
  const [activeCategory, setActiveCategory] = useState<BudgetCategory | null>(null);
  const [showAccessibleTable, setShowAccessibleTable] = useState(false);
  const [simulatedGuests, setSimulatedGuests] = useState(guestCount);

  const handleSliderChange = (cat: BudgetCategory, newPct: number) => {
    const updated = rebalanceBudget(breakdown, cat, newPct);
    onUpdateBreakdown(updated);
  };

  const simulation = simulateGuestCountChange(breakdown, simulatedGuests, guestCount);

  // SVG Donut Calculations
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPct = 0;

  return (
    <SpotlightCard
      aria-labelledby="budget-heading"
      className="p-6 sm:p-10 border border-white/10 shadow-glass space-y-8"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-festive-saffron/10 border border-festive-saffron/30 text-xs font-bold text-festive-gold mb-2">
            <span>●</span> Deterministic Engine
          </div>
          <h2 id="budget-heading" className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span aria-hidden="true">💰</span> {t.budgetTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.budgetSubtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAccessibleTable(!showAccessibleTable)}
          className="self-start sm:self-auto px-4 py-2 text-xs font-bold rounded-xl bg-surface-100 hover:bg-surface-200 border border-white/10 text-slate-200 hover:text-festive-gold transition-all min-h-[44px] shadow-sm active:scale-95"
          aria-expanded={showAccessibleTable}
        >
          {showAccessibleTable ? '📊 Show Interactive SVG Donut' : `♿ ${t.accessibleTableToggle}`}
        </button>
      </div>

      {/* Main Budget Visualizer / Living Donut + Sliders Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* SVG Living Donut / Accessible Table */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-2">
          {!showAccessibleTable ? (
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full -rotate-90 transform drop-shadow-2xl"
                aria-label="Interactive budget allocation donut chart"
                role="img"
              >
                {/* Background Ring */}
                <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#121624" strokeWidth="20" />

                {/* Animated Segments */}
                {breakdown.categories.map((cat) => {
                  const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPct / 100) * circumference);
                  accumulatedPct += cat.percentage;
                  const isHovered = activeCategory === cat.category;

                  return (
                    <circle
                      key={cat.category}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke={CATEGORY_COLORS[cat.category]}
                      strokeWidth={isHovered ? '26' : '20'}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      style={{
                        transition:
                          'stroke-dasharray 0.35s cubic-bezier(0.16, 1, 0.3, 1), stroke-dashoffset 0.35s cubic-bezier(0.16, 1, 0.3, 1), stroke-width 0.2s ease',
                      }}
                      className="cursor-pointer"
                      onMouseEnter={() => setActiveCategory(cat.category)}
                      onMouseLeave={() => setActiveCategory(null)}
                      role="graphics-symbol"
                      aria-label={`${cat.label}: ${cat.percentage}% (${currency} ${cat.amount.toLocaleString()})`}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Callout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  Total Plan
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white mt-1 tabular-nums">
                  <CountUpNumber value={breakdown.totalBudget} prefix={`${currency} `} />
                </span>
                <span className="text-[11px] font-bold text-festive-jade mt-1 px-2.5 py-0.5 rounded-full bg-festive-jade/10 border border-festive-jade/25">
                  100% Zero-Sum
                </span>
              </div>
            </div>
          ) : (
            /* Accessible Data Table for Screen Readers */
            <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-surface-100/50 p-2">
              <table className="w-full text-left text-xs border-collapse">
                <caption className="sr-only">Detailed Budget Allocation Table</caption>
                <thead>
                  <tr className="border-b border-white/20 text-slate-300">
                    <th scope="col" className="p-2.5">Category</th>
                    <th scope="col" className="p-2.5">Share</th>
                    <th scope="col" className="p-2.5">Amount ({currency})</th>
                    <th scope="col" className="p-2.5">Per Guest</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.categories.map((cat) => (
                    <tr key={cat.category} className="border-b border-white/5 hover:bg-white/5">
                      <th scope="row" className="p-2.5 font-bold text-white flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[cat.category] }}
                        />
                        {cat.label}
                      </th>
                      <td className="p-2.5 text-festive-gold font-extrabold tabular-nums">{cat.percentage}%</td>
                      <td className="p-2.5 text-slate-200 tabular-nums">{cat.amount.toLocaleString()}</td>
                      <td className="p-2.5 text-slate-400 tabular-nums">{cat.perGuestAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Live Rebalancing Sliders */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span className="font-semibold italic">ℹ️ {t.rebalanceNotice}</span>
            <span className="text-festive-gold font-bold">Total: 100%</span>
          </div>

          <div className="space-y-3">
            {breakdown.categories.map((cat) => {
              const isOverspend = cat.percentage > 40;
              const isActive = activeCategory === cat.category;

              return (
                <div
                  key={cat.category}
                  onMouseEnter={() => setActiveCategory(cat.category)}
                  onMouseLeave={() => setActiveCategory(null)}
                  className={`p-3.5 rounded-2xl transition-all border ${
                    isActive
                      ? 'bg-surface-100/95 border-festive-gold/50 ring-2 ring-festive-gold/20 shadow-glow/10'
                      : 'bg-surface-100/50 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-md inline-block shadow-sm"
                        style={{ backgroundColor: CATEGORY_COLORS[cat.category] }}
                        aria-hidden="true"
                      />
                      <label htmlFor={`slider-${cat.category}`} className="font-extrabold text-slate-100 cursor-pointer">
                        {cat.label}
                      </label>
                      {isOverspend && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-festive-rose/20 text-festive-rose border border-festive-rose/30 animate-pulse">
                          High Share
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-festive-gold font-black text-sm tabular-nums">
                        {cat.percentage}%
                      </span>
                      <span className="text-slate-400 text-xs tabular-nums">
                        ({currency} {cat.amount.toLocaleString()})
                      </span>
                    </div>
                  </div>

                  <input
                    id={`slider-${cat.category}`}
                    type="range"
                    min="0"
                    max="60"
                    value={cat.percentage}
                    onChange={(e) => handleSliderChange(cat.category, parseInt(e.target.value, 10))}
                    className="w-full h-2.5 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-festive-saffron min-h-[44px]"
                    aria-label={`${cat.label} percentage allocation slider`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* What-If Guest Count Simulator */}
      <div className="mt-8 pt-6 border-t border-white/10 rounded-2xl bg-surface-100/40 p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>🔮</span> {t.whatIfTitle}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">{t.whatIfDescription}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Simulated Headcount: </span>
            <strong className="text-festive-gold text-base tabular-nums">{simulatedGuests} guests</strong>
          </div>
        </div>

        <input
          type="range"
          min={Math.max(20, Math.round(guestCount * 0.5))}
          max={Math.round(guestCount * 2.0)}
          value={simulatedGuests}
          onChange={(e) => setSimulatedGuests(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-festive-gold min-h-[44px]"
          aria-label="What if guests change simulator slider"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs pt-1">
          <div className="p-3.5 rounded-xl bg-surface-200/60 border border-white/5">
            <span className="text-slate-400 font-medium">New Estimated Total:</span>
            <p className="text-sm font-black text-white mt-1 tabular-nums">
              {currency} {simulation.estimatedTotal.toLocaleString()}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-200/60 border border-white/5">
            <span className="text-slate-400 font-medium">Budget Delta:</span>
            <p
              className={`text-sm font-black mt-1 tabular-nums ${
                simulation.deltaAmount >= 0 ? 'text-festive-rose' : 'text-emerald-400'
              }`}
            >
              {simulation.deltaAmount >= 0
                ? `+${currency} ${simulation.deltaAmount.toLocaleString()}`
                : `-${currency} ${Math.abs(simulation.deltaAmount).toLocaleString()}`}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-200/60 border border-white/5">
            <span className="text-slate-400 font-medium">Recalculated Per Head:</span>
            <p className="text-sm font-black text-festive-saffron mt-1 tabular-nums">
              {currency} {simulation.perGuestNew.toLocaleString()}/guest
            </p>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
