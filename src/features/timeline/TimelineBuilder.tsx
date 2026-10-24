'use client';

import React from 'react';
import { TimelineSchedule } from '@/engine/types';
import { Locale, DICTIONARIES } from '@/lib/i18n';
import { downloadIcsFile } from '@/lib/ics-export';

interface TimelineBuilderProps {
  currentLocale: Locale;
  schedule: TimelineSchedule;
}

export function TimelineBuilder({ currentLocale, schedule }: TimelineBuilderProps) {
  const t = DICTIONARIES[currentLocale];

  const handleExportIcs = () => {
    downloadIcsFile(schedule.tasks, `jashn-timeline-${schedule.eventDate}.ics`);
  };

  return (
    <section aria-labelledby="timeline-heading" className="rounded-3xl glass-card p-6 sm:p-8 border border-white/10 shadow-glass space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 id="timeline-heading" className="text-2xl font-black text-white flex items-center gap-2">
            <span aria-hidden="true">📅</span> {t.timelineTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.timelineSubtitle}</p>
        </div>

        <button
          type="button"
          onClick={handleExportIcs}
          className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-surface-100 hover:bg-surface-200 border border-white/10 text-festive-gold shadow-sm hover:border-festive-gold/40 transition-all min-h-[44px]"
        >
          <span aria-hidden="true">📥</span>
          <span>{t.exportIcsBtn}</span>
        </button>
      </div>

      {/* Short-notice Compression & Urgent Tasks Priority Banner */}
      {schedule.urgentTasks.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-festive-magenta/15 border border-festive-magenta/40 space-y-3" role="alert">
          <div className="flex items-center space-x-2 text-festive-rose font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-festive-rose animate-ping" aria-hidden="true" />
            <span>⚡ {t.urgentMilestones}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {schedule.urgentTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-surface-100/90 border border-festive-magenta/30 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white">{task.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-festive-rose/20 text-festive-rose font-black">
                    Due: {task.targetDate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chronological Milestone Track with SVG Timeline Path */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-surface-200 space-y-6 pt-2">
        {schedule.tasks.map((task, index) => {
          const isCritical = task.isCriticalPath;

          return (
            <div key={task.id} className="relative group">
              {/* Milestone Indicator Node */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                  isCritical
                    ? 'bg-festive-magenta border-white pulse-critical'
                    : 'bg-surface-300 border-festive-gold'
                }`}
                aria-hidden="true"
              />

              {/* Task Milestone Card */}
              <div className="glass-card glass-card-hover p-4 sm:p-5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 font-mono">#{index + 1}</span>
                    <h3 className="font-extrabold text-base text-white">{task.title}</h3>
                    {isCritical && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-festive-magenta/30 text-festive-rose border border-festive-magenta/50">
                        {t.criticalPathLabel}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-festive-gold font-bold">
                    Target: {task.targetDate} ({task.recommendedWeeksBefore} wks prior)
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {task.description}
                </p>

                {task.dependencies.length > 0 && (
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400 pt-1">
                    <span className="font-semibold">Prerequisites:</span>
                    <span>{task.dependencies.join(' ➔ ')}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
