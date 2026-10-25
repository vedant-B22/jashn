'use client';

import React, { useState } from 'react';
import { PlanBScenario, PlanBTrigger } from '@/engine/types';
import { Locale, DICTIONARIES } from '@/lib/i18n';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface PlanBStudioProps {
  currentLocale: Locale;
  scenarios: readonly PlanBScenario[];
  currency: string;
}

const TRIGGER_TABS: readonly { trigger: PlanBTrigger; label: string; icon: string }[] = [
  { trigger: 'rain', label: 'Sudden Monsoon / Rain', icon: '🌧️' },
  { trigger: 'vendor_cancellation', label: 'Key Vendor Drop', icon: '🚨' },
  { trigger: 'guest_surge', label: '+30% Guest Surge', icon: '👥' },
  { trigger: 'budget_cut', label: '15% Budget Cut', icon: '✂️' },
];

export function PlanBStudio({ currentLocale, scenarios, currency }: PlanBStudioProps) {
  const t = DICTIONARIES[currentLocale];
  const [activeTrigger, setActiveTrigger] = useState<PlanBTrigger>('rain');

  const currentScenario = scenarios.find((s) => s.trigger === activeTrigger) ?? scenarios[0];

  if (!currentScenario) return null;

  return (
    <SpotlightCard
      aria-labelledby="planb-heading"
      className="p-6 sm:p-10 border border-white/10 shadow-glass space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-festive-indigo/50 border border-festive-indigo text-xs font-bold text-festive-gold mb-2">
            <span>●</span> Contingency Stress-Testing
          </div>
          <h2 id="planb-heading" className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span aria-hidden="true">🛡️</span> {t.planBTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.planBSubtitle}</p>
        </div>
      </div>

      {/* Scenario Trigger Pills */}
      <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Contingency Scenario Selection">
        {TRIGGER_TABS.map((tab) => (
          <button
            key={tab.trigger}
            type="button"
            role="tab"
            aria-selected={activeTrigger === tab.trigger}
            onClick={() => setActiveTrigger(tab.trigger)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] active:scale-95 ${
              activeTrigger === tab.trigger
                ? 'bg-gradient-to-r from-festive-saffron via-festive-gold to-festive-rose text-black font-extrabold shadow-glow'
                : 'bg-surface-100 hover:bg-surface-200 text-slate-300 border border-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Scenario Breakdown Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-100/70 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-xl font-black text-white">{currentScenario.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {currentScenario.description}
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-surface-200/50 p-3.5 rounded-xl border border-white/5">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Budget Impact
              </span>
              <p
                className={`text-lg font-black tabular-nums ${
                  currentScenario.budgetDelta >= 0 ? 'text-festive-rose' : 'text-emerald-400'
                }`}
              >
                {currentScenario.budgetDelta >= 0 ? '+' : ''}
                {currency} {currentScenario.budgetDelta.toLocaleString()}
              </p>
            </div>

            <div className="text-right border-l border-white/10 pl-4">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Timeline Shift
              </span>
              <p className="text-lg font-black text-festive-gold tabular-nums">
                {currentScenario.timelineImpactDays} days
              </p>
            </div>
          </div>
        </div>

        {/* Action Item Steps */}
        <div className="space-y-3">
          <p className="text-xs font-extrabold text-festive-gold uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡</span> Immediate Contingency Directives:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentScenario.immediateActionItems.map((action, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-200/50 border border-white/5 text-xs text-slate-200 leading-relaxed flex items-start space-x-2.5"
              >
                <span className="text-festive-gold font-bold">✓</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Affected Categories */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Impacted Categories:</span>
          {currentScenario.affectedCategories.map((cat) => (
            <span
              key={cat}
              className="px-2.5 py-0.5 rounded-full bg-surface-200 text-slate-200 uppercase font-mono text-[10px] border border-white/5"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}
