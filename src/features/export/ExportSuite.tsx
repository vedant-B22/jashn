'use client';

import React, { useState } from 'react';
import { EventBrief, BudgetBreakdown, TimelineSchedule } from '@/engine/types';
import { Locale, DICTIONARIES } from '@/lib/i18n';
import { downloadIcsFile } from '@/lib/ics-export';

interface ExportSuiteProps {
  currentLocale: Locale;
  brief: EventBrief;
  budget: BudgetBreakdown;
  timeline: TimelineSchedule;
}

export function ExportSuite({ currentLocale, brief, budget, timeline }: ExportSuiteProps) {
  const t = DICTIONARIES[currentLocale];
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleIcs = () => {
    downloadIcsFile(timeline.tasks, `jashn-${brief.eventType}-timeline.ics`);
  };

  const handleCopySummary = async () => {
    const summaryLines = [
      `=== JASHN CELEBRATION PLAN ===`,
      `Event: ${brief.eventType.toUpperCase()} in ${brief.city}`,
      `Guests: ${brief.guests} | Target Date: ${brief.targetDate}`,
      `Total Budget: ${brief.currency} ${budget.totalBudget.toLocaleString()} (${brief.currency} ${budget.perGuestAverage}/guest)`,
      `Contingency Cushion: ${budget.contingencyPercentage}%`,
      ``,
      `--- BUDGET BREAKDOWN ---`,
      ...budget.categories.map((c) => `- ${c.label}: ${c.percentage}% (${brief.currency} ${c.amount.toLocaleString()})`),
      ``,
      `--- CRITICAL MILESTONES ---`,
      ...timeline.tasks.filter((t) => t.isCriticalPath).map((t) => `- [Due: ${t.targetDate}] ${t.title}`),
    ];

    try {
      await navigator.clipboard.writeText(summaryLines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="rounded-3xl glass-card p-6 border border-white/10 shadow-glass flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>📤</span> Export & Share Master Plan
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Take your offline-ready plan anywhere: calendar, print, or text summary.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={handleIcs}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-surface-100 hover:bg-surface-200 border border-white/10 text-white min-h-[44px]"
        >
          <span>📅</span>
          <span>{t.exportIcsBtn}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-surface-100 hover:bg-surface-200 border border-white/10 text-white min-h-[44px]"
        >
          <span>🖨️</span>
          <span>{t.printBtn}</span>
        </button>

        <button
          type="button"
          onClick={handleCopySummary}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-festive-saffron to-festive-gold text-black shadow-glow min-h-[44px]"
        >
          <span>📋</span>
          <span>{copied ? '✓ Copied to Clipboard!' : t.copySummaryBtn}</span>
        </button>
      </div>
    </div>
  );
}
