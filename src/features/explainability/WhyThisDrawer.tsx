'use client';

import React, { useEffect } from 'react';
import { ExplainabilityRecord, EventBrief } from '@/engine/types';

interface WhyThisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reports: readonly ExplainabilityRecord[];
  brief: EventBrief;
}

export function WhyThisDrawer({ isOpen, onClose, reports, brief }: WhyThisDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="why-this-title"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-card p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 id="why-this-title" className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>💡</span> Transparent Engine Explainability
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Direct audit trace of mathematical heuristics and constraints powering this plan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-100 hover:bg-surface-200 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 min-h-[44px] min-w-[44px]"
            aria-label="Close explainability panel"
          >
            ✕
          </button>
        </div>

        {/* Input Parameters Driver Summary */}
        <div className="p-4 rounded-2xl bg-surface-100/60 border border-white/5 space-y-2">
          <span className="text-xs font-bold text-festive-gold uppercase tracking-wider">
            Primary Brief Drivers:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-surface-200/50">
              <span className="text-slate-400">Vertical:</span>
              <p className="font-bold text-white uppercase">{brief.eventType}</p>
            </div>
            <div className="p-2 rounded-lg bg-surface-200/50">
              <span className="text-slate-400">Guests:</span>
              <p className="font-bold text-white">{brief.guests}</p>
            </div>
            <div className="p-2 rounded-lg bg-surface-200/50">
              <span className="text-slate-400">Total Budget:</span>
              <p className="font-bold text-white">{brief.currency} {brief.budget.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-lg bg-surface-200/50">
              <span className="text-slate-400">Priorities:</span>
              <p className="font-bold text-festive-saffron truncate">{brief.priorities.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown Explanations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Deterministic Rules Applied per Category:
          </h3>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.category}
                className="p-4 rounded-xl bg-surface-100/40 border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-festive-gold capitalize">
                    {report.category}
                  </h4>
                  <span className="text-xs text-slate-300 font-bold">
                    {brief.currency} {report.allocatedAmount.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  {report.rulesApplied.map((rule, idx) => (
                    <p key={idx} className="text-xs text-slate-300 flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-festive-saffron">▪</span>
                      <span>{rule}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
