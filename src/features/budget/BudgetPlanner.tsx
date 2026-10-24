'use client';

import React, { useState } from 'react';
import { BudgetBreakdown, BudgetCategory } from '@/engine/types';
import { rebalanceBudget, simulateGuestCountChange } from '@/engine/budget-allocator';
import { Locale, DICTIONARIES } from '@/lib/i18n';

interface BudgetPlannerProps {
  currentLocale: Locale;
  breakdown: BudgetBreakdown;
  onUpdateBreakdown: (newBreakdown: BudgetBreakdown) => void;
  guestCount: number;
  currency: string;
}

const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  venue: '#FF7F11', // Saffron
  catering: '#FFB800', // Gold
  decor: '#D81159', // Magenta
  photography: '#06D6A0', // Teal
  attire: '#E83F6F', // Rose
  entertainment: '#8338EC', // Violet
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

  // Calculate SVG donut segments
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPct = 0;

  return (
    <section aria-labelledby="budget-heading" className="rounded-3xl glass-card p-6 sm:p-8 border border-white/10 shadow-glass space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 id="budget-heading" className="text-2xl font-black text-white flex items-center gap-2">
            <span aria-hidden="true">💰</span> {t.budgetTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.budgetSubtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAccessibleTable(!showAccessibleTable)}
          className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface-100 hover:bg-surface-200 border border-white/10 text-slate-300 min-h-[44px]"
          aria-expanded={showAccessibleTable}
        >
          {showAccessibleTable ? '📊 Show SVG Donut Chart' : `♿ ${t.accessibleTableToggle}`}
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface-100/60 border border-white/5">
          <span className="text-xs text-slate-400 font-medium">{t.totalBudgetLabel}</span>
          <p className="text-lg sm:text-2xl font-black text-festive-gold mt-1">
            {currency} {breakdown.totalBudget.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-100/60 border border-white/5">
          <span className="text-xs text-slate-400 font-medium">{t.perGuestLabel}</span>
          <p className="text-lg sm:text-2xl font-black text-festive-saffron mt-1">
            {currency} {breakdown.perGuestAverage.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-100/60 border border-white/5">
          <span className="text-xs text-slate-400 font-medium">{t.contingencyLabel}</span>
          <p className="text-lg sm:text-2xl font-black text-emerald-400 mt-1">
            {breakdown.contingencyPercentage}%
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-100/60 border border-white/5">
          <span className="text-xs text-slate-400 font-medium">{t.guestsLabel}</span>
          <p className="text-lg sm:text-2xl font-black text-white mt-1">{guestCount}</p>
        </div>
      </div>

      {/* Main Budget Visualizer / Sliders Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Living Donut OR Accessible Table Toggle */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          {!showAccessibleTable ? (
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full -rotate-90 transform drop-shadow-lg"
                aria-label="Interactive budget allocation donut chart"
                role="img"
              >
                <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#1B2337" strokeWidth="24" />
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
                      strokeWidth={isHovered ? '28' : '24'}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setActiveCategory(cat.category)}
                      onMouseLeave={() => setActiveCategory(null)}
                      role="graphics-symbol"
                      aria-label={`${cat.label}: ${cat.percentage}% (${currency} ${cat.amount.toLocaleString()})`}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Plan</span>
                <span className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {currency} {Math.round(breakdown.allocatedBudget / 1000)}k
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">100% Zero-Sum</span>
              </div>
            </div>
          ) : (
            /* Accessible Data Table alternative for screen readers and WCAG AA */
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <caption className="sr-only">Detailed Budget Allocation Table</caption>
                <thead>
                  <tr className="border-b border-white/20 text-slate-300">
                    <th scope="col" className="p-2">Category</th>
                    <th scope="col" className="p-2">Share</th>
                    <th scope="col" className="p-2">Amount ({currency})</th>
                    <th scope="col" className="p-2">Per Guest</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.categories.map((cat) => (
                    <tr key={cat.category} className="border-b border-white/5 hover:bg-white/5">
                      <th scope="row" className="p-2 font-medium text-white">{cat.label}</th>
                      <td className="p-2 text-festive-gold font-bold">{cat.percentage}%</td>
                      <td className="p-2 text-slate-200">{cat.amount.toLocaleString()}</td>
                      <td className="p-2 text-slate-400">{cat.perGuestAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Live Rebalancing Sliders */}
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs text-slate-400 italic">
            ℹ️ {t.rebalanceNotice}
          </p>

          <div className="space-y-3">
            {breakdown.categories.map((cat) => (
              <div
                key={cat.category}
                onMouseEnter={() => setActiveCategory(cat.category)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`p-3 rounded-xl transition-all ${
                  activeCategory === cat.category ? 'bg-surface-100/90 ring-1 ring-festive-gold/40' : 'bg-surface-50/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.category] }}
                      aria-hidden="true"
                    />
                    <label htmlFor={`slider-${cat.category}`} className="font-bold text-slate-200 cursor-pointer">
                      {cat.label}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-festive-gold font-black text-sm">{cat.percentage}%</span>
                    <span className="text-slate-400 text-xs">
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
                  className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-festive-saffron min-h-[44px]"
                  aria-label={`${cat.label} percentage allocation slider`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What-If Guest Count Simulator */}
      <div className="mt-6 pt-6 border-t border-white/10 rounded-2xl bg-surface-100/40 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🔮</span> {t.whatIfTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{t.whatIfDescription}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Simulated Headcount: </span>
            <strong className="text-festive-gold text-base">{simulatedGuests} guests</strong>
          </div>
        </div>

        <input
          type="range"
          min={Math.max(20, Math.round(guestCount * 0.5))}
          max={Math.round(guestCount * 2.0)}
          value={simulatedGuests}
          onChange={(e) => setSimulatedGuests(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-festive-gold min-h-[44px]"
          aria-label="What if guests change simulator slider"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg bg-surface-200/50">
            <span className="text-slate-400">New Estimated Total:</span>
            <p className="text-sm font-bold text-white mt-1">
              {currency} {simulation.estimatedTotal.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface-200/50">
            <span className="text-slate-400">Budget Delta:</span>
            <p className={`text-sm font-bold mt-1 ${simulation.deltaAmount >= 0 ? 'text-festive-rose' : 'text-emerald-400'}`}>
              {simulation.deltaAmount >= 0 ? `+${currency} ${simulation.deltaAmount.toLocaleString()}` : `-${currency} ${Math.abs(simulation.deltaAmount).toLocaleString()}`}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface-200/50">
            <span className="text-slate-400">Recalculated Per Head:</span>
            <p className="text-sm font-bold text-festive-saffron mt-1">
              {currency} {simulation.perGuestNew.toLocaleString()}/guest
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
