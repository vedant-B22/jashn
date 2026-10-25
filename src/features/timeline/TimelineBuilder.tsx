'use client';

import React, { useState } from 'react';
import { TimelineSchedule } from '@/engine/types';
import { Locale, DICTIONARIES } from '@/lib/i18n';
import { downloadIcsFile } from '@/lib/ics-export';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface TimelineBuilderProps {
  currentLocale: Locale;
  schedule: TimelineSchedule;
}

export function TimelineBuilder({ currentLocale, schedule }: TimelineBuilderProps) {
  const t = DICTIONARIES[currentLocale];
  const [viewMode, setViewMode] = useState<'vertical' | 'gantt'>('vertical');

  const handleExportIcs = () => {
    downloadIcsFile(schedule.tasks, `jashn-timeline-${schedule.eventDate}.ics`);
  };

  return (
    <SpotlightCard
      aria-labelledby="timeline-heading"
      className="p-6 sm:p-10 border border-white/10 shadow-glass space-y-8"
    >
      {/* Header with View Toggle & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-festive-rose/10 border border-festive-rose/30 text-xs font-bold text-festive-rose mb-2">
            <span>●</span> Backward Scheduling Engine
          </div>
          <h2 id="timeline-heading" className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span aria-hidden="true">📅</span> {t.timelineTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">{t.timelineSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-surface-100 p-1 border border-white/10" role="group" aria-label="Timeline View Selection">
            <button
              type="button"
              onClick={() => setViewMode('vertical')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all min-h-[38px] ${
                viewMode === 'vertical'
                  ? 'bg-gradient-to-r from-festive-saffron to-festive-gold text-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              aria-pressed={viewMode === 'vertical'}
            >
              Vertical Path
            </button>
            <button
              type="button"
              onClick={() => setViewMode('gantt')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all min-h-[38px] ${
                viewMode === 'gantt'
                  ? 'bg-gradient-to-r from-festive-saffron to-festive-gold text-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              aria-pressed={viewMode === 'gantt'}
            >
              Mini Gantt
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportIcs}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-surface-100 hover:bg-surface-200 border border-festive-gold/30 text-festive-gold shadow-sm hover:border-festive-gold transition-all min-h-[44px] active:scale-95"
          >
            <span aria-hidden="true">📥</span>
            <span>{t.exportIcsBtn}</span>
          </button>
        </div>
      </div>

      {/* Short-notice Compression & Urgent Tasks Priority Banner */}
      {schedule.urgentTasks.length > 0 && (
        <div
          className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-festive-rose/15 via-festive-magenta/10 to-festive-indigo/20 border border-festive-rose/40 space-y-3.5 shadow-glow-magenta/10"
          role="alert"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-festive-rose font-black text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-festive-rose animate-ping" aria-hidden="true" />
              <span>⚡ {t.urgentMilestones}</span>
            </div>
            <span className="text-xs font-bold text-festive-gold bg-festive-gold/10 px-2.5 py-1 rounded-full border border-festive-gold/20">
              High Priority Contracts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {schedule.urgentTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-surface-100/90 border border-festive-rose/30 text-xs space-y-1.5 transition-all hover:border-festive-gold/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-sm">{task.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-festive-rose/25 text-festive-rose font-black tabular-nums">
                    Due: {task.targetDate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 1: Vertical Chronological Path */}
      {viewMode === 'vertical' ? (
        <div className="relative pl-6 sm:pl-10 border-l-2 border-surface-200 space-y-6 pt-2">
          {schedule.tasks.map((task, index) => {
            const isCritical = task.isCriticalPath;

            return (
              <div key={task.id} className="relative group">
                {/* Milestone Node */}
                <div
                  className={`absolute -left-[31px] sm:-left-[47px] top-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-all ${
                    isCritical
                      ? 'bg-festive-rose border-white pulse-critical ring-4 ring-festive-rose/30'
                      : 'bg-surface-200 border-festive-gold group-hover:scale-125'
                  }`}
                  aria-hidden="true"
                />

                {/* Task Milestone Card */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isCritical
                      ? 'bg-surface-100/90 border-festive-rose/40 shadow-glow-magenta/10 hover:border-festive-rose/60'
                      : 'bg-surface-100/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400 font-mono font-bold">#{index + 1}</span>
                      <h3 className="font-extrabold text-base text-white">{task.title}</h3>
                      {isCritical && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-festive-rose/25 text-festive-rose border border-festive-rose/50 uppercase tracking-wider">
                          {t.criticalPathLabel}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-festive-gold font-bold tabular-nums">
                      Target: {task.targetDate} ({task.recommendedWeeksBefore} wks prior)
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {task.description}
                  </p>

                  {task.dependencies.length > 0 && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 pt-2 border-t border-white/5 mt-3">
                      <span className="font-semibold text-slate-300">Prerequisites:</span>
                      <span className="text-festive-gold font-medium">{task.dependencies.join(' ➔ ')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View 2: Horizontal Mini Gantt View */
        <div className="space-y-4 rounded-2xl bg-surface-100/50 p-4 sm:p-6 border border-white/10 overflow-x-auto">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider pb-2 border-b border-white/10 flex items-center justify-between min-w-[600px]">
            <span>Milestone / Category</span>
            <span>Weeks Remaining to Celebration</span>
          </div>

          <div className="space-y-3 min-w-[600px]">
            {schedule.tasks.map((task) => {
              const maxWeeks = 24;
              const barWidth = Math.min(100, Math.max(15, (task.recommendedWeeksBefore / maxWeeks) * 100));

              return (
                <div key={task.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      {task.isCriticalPath && <span className="text-festive-rose">★</span>}
                      {task.title}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] tabular-nums">
                      Due: {task.targetDate}
                    </span>
                  </div>

                  <div className="h-4 w-full bg-surface-200/60 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        task.isCriticalPath
                          ? 'bg-gradient-to-r from-festive-rose to-festive-magenta shadow-sm'
                          : 'bg-gradient-to-r from-festive-saffron to-festive-gold'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}
