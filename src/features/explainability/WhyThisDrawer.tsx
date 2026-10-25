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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="why-this-title"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-card p-6 sm:p-9 rounded-3xl border border-white/20 shadow-2xl space-y-6 bg-surface-50/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-festive-gold/15 text-festive-gold text-[10px] font-black uppercase tracking-widest mb-1.5">
              <span>●</span> Audit Trail
            </div>
            <h2 id="why-this-title" className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>💡</span> Transparent Engine Explainability
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Direct mathematical trace of heuristics, constraints, and priorities powering this plan.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-100 hover:bg-surface-200 text-slate-200 hover:text-white flex items-center justify-center border border-white/10 min-h-[44px] min-w-[44px] transition-all active:scale-90"
            aria-label="Close explainability panel"
          >
            ✕
          </button>
        </div>

        {/* Input Parameters Driver Summary */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-100/70 border border-white/10 space-y-3">
          <span className="text-[11px] font-extrabold text-festive-gold uppercase tracking-wider block">
            Primary Brief Drivers & Constraints:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Event Type:</span>
              <strong className="text-white capitalize text-sm">{brief.eventType}</strong>
            </div>
            <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Headcount:</span>
              <strong className="text-white text-sm tabular-nums">{brief.guests} guests</strong>
            </div>
            <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Location:</span>
              <strong className="text-white text-sm">{brief.city}</strong>
            </div>
            <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5">
              <span className="text-slate-400 block text-[10px]">Priorities:</span>
              <strong className="text-festive-saffron text-sm capitalize">
                {brief.priorities.join(', ')}
              </strong>
            </div>
          </div>
        </div>

        {/* Audit Records List */}
        <div className="space-y-4">
          <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider block">
            Deterministic Rules Applied per Category:
          </span>

          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.category}
                className="p-4 sm:p-5 rounded-2xl bg-surface-100/50 border border-white/5 space-y-2 hover:border-white/15 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base text-festive-gold capitalize">
                    {report.category}
                  </h3>
                  <span className="text-xs text-slate-200 font-bold tabular-nums">
                    {brief.currency} {report.allocatedAmount.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  {report.rulesApplied.map((rule, idx) => (
                    <p key={idx} className="text-xs text-slate-300 flex items-start space-x-1.5 leading-relaxed">
                      <span className="text-festive-saffron font-bold">▪</span>
                      <span>{rule}</span>
                    </p>
                  ))}
                </div>

                {report.inputDrivers.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {report.inputDrivers.map((driver, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-surface-200 text-slate-300 border border-white/5"
                      >
                        {driver}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
