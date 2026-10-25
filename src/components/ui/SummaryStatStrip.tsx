'use client';

import React from 'react';
import { SpotlightCard } from './SpotlightCard';
import { CountUpNumber } from './CountUpNumber';
import { EventBrief, BudgetBreakdown } from '@/engine/types';

interface SummaryStatStripProps {
  brief: EventBrief;
  budget: BudgetBreakdown;
  currency: string;
}

export function SummaryStatStrip({ brief, budget, currency }: SummaryStatStripProps) {
  // Compute approximate weeks / days to event
  const today = new Date();
  const target = new Date(brief.targetDate);
  const diffDays = Math.max(0, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const diffWeeks = Math.max(1, Math.round(diffDays / 7));

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4 my-8">
      {/* 1. Total Budget */}
      <SpotlightCard className="p-4 sm:p-5 flex flex-col justify-between space-y-2 border-festive-saffron/20">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="uppercase tracking-wider">Total Allocation</span>
          <span className="text-festive-gold">💰</span>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-white">
            <CountUpNumber value={budget.totalBudget} prefix={`${currency} `} />
          </p>
          <span className="text-[11px] font-bold text-festive-jade flex items-center gap-1 mt-0.5">
            <span>●</span> 100% Zero-Sum
          </span>
        </div>
        {/* Micro Sparkline SVG */}
        <div className="h-4 w-full pt-1" aria-hidden="true">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-festive-gold/40">
            <path d="M0 15 Q25 5, 50 12 T100 4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </SpotlightCard>

      {/* 2. Per Guest Investment */}
      <SpotlightCard className="p-4 sm:p-5 flex flex-col justify-between space-y-2 border-festive-gold/20">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="uppercase tracking-wider">Per Guest</span>
          <span className="text-festive-saffron">🍽️</span>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-festive-gold">
            <CountUpNumber value={budget.perGuestAverage} prefix={`${currency} `} />
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            for {brief.guests} invited guests
          </span>
        </div>
        <div className="h-4 w-full pt-1" aria-hidden="true">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-festive-saffron/40">
            <path d="M0 18 Q30 8, 60 14 T100 6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </SpotlightCard>

      {/* 3. Contingency Reserve */}
      <SpotlightCard className="p-4 sm:p-5 flex flex-col justify-between space-y-2 border-emerald-500/20">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="uppercase tracking-wider">Reserve Buffer</span>
          <span className="text-emerald-400">🛡️</span>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">
            <CountUpNumber value={budget.contingencyPercentage} suffix="%" />
          </p>
          <span className="text-[11px] text-emerald-300/80 font-bold mt-0.5 block">
            {currency} {Math.round(budget.totalBudget * (budget.contingencyPercentage / 100)).toLocaleString()} safety net
          </span>
        </div>
        <div className="h-4 w-full pt-1" aria-hidden="true">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-emerald-400/40">
            <path d="M0 10 L40 10 L60 4 L100 4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </SpotlightCard>

      {/* 4. Headcount */}
      <SpotlightCard className="p-4 sm:p-5 flex flex-col justify-between space-y-2 border-festive-rose/20">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="uppercase tracking-wider">Guest Count</span>
          <span className="text-festive-rose">👥</span>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-white">
            <CountUpNumber value={brief.guests} suffix=" guests" />
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            📍 {brief.city}
          </span>
        </div>
        <div className="h-4 w-full pt-1" aria-hidden="true">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-festive-rose/40">
            <path d="M0 14 Q35 18, 70 6 T100 10" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </SpotlightCard>

      {/* 5. Countdown */}
      <SpotlightCard className="p-4 sm:p-5 flex flex-col justify-between space-y-2 border-festive-indigo/40 col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span className="uppercase tracking-wider">Timeline</span>
          <span className="text-festive-gold">⏳</span>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-black text-festive-gold">
            <CountUpNumber value={diffWeeks} suffix=" Weeks" />
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {diffDays} days to celebration
          </span>
        </div>
        <div className="h-4 w-full pt-1" aria-hidden="true">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-festive-indigo/60">
            <path d="M0 8 Q40 16, 75 4 T100 2" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </SpotlightCard>
    </div>
  );
}
