import { TimelineSchedule, EventBrief, BudgetCategory, TimelineTask } from './types';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

interface TaskTemplate {
  readonly id: string;
  readonly title: string;
  readonly category: BudgetCategory;
  readonly defaultWeeksBefore: number;
  readonly dependencies: readonly string[];
  readonly isCritical: boolean;
  readonly description: string;
}

const WEDDING_TASK_TEMPLATES: readonly TaskTemplate[] = [
  {
    id: 'venue_booking',
    title: 'Lock Venue & Date',
    category: 'venue',
    defaultWeeksBefore: 16,
    dependencies: [],
    isCritical: true,
    description: 'Finalize and pay advance for ceremony and reception spaces.',
  },
  {
    id: 'catering_tasting',
    title: 'Catering Tasting & Menu Lock',
    category: 'catering',
    defaultWeeksBefore: 12,
    dependencies: ['venue_booking'],
    isCritical: true,
    description: 'Taste food samples, finalize dietary arrangements and head count buffer.',
  },
  {
    id: 'photography_booking',
    title: 'Book Lead Photographer & Videographer',
    category: 'photography',
    defaultWeeksBefore: 10,
    dependencies: ['venue_booking'],
    isCritical: true,
    description: 'Reserve creative team for pre-wedding and primary celebrations.',
  },
  {
    id: 'decor_concept',
    title: 'Theme & Stage Decor Approval',
    category: 'decor',
    defaultWeeksBefore: 8,
    dependencies: ['venue_booking'],
    isCritical: false,
    description: 'Approve 3D stage layout, floral palette, and lighting design.',
  },
  {
    id: 'attire_fitting',
    title: 'Bridal & Groom Attire First Fitting',
    category: 'attire',
    defaultWeeksBefore: 7,
    dependencies: [],
    isCritical: false,
    description: 'Order bespoke outfits and confirm tailoring lead times.',
  },
  {
    id: 'entertainment_booking',
    title: 'Book DJ / Live Band & Sound Setup',
    category: 'entertainment',
    defaultWeeksBefore: 6,
    dependencies: ['venue_booking'],
    isCritical: false,
    description: 'Confirm sound vendor, artist playlists, and acoustic limits.',
  },
  {
    id: 'invitations_dispatch',
    title: 'Send Digital & Physical Invites',
    category: 'misc',
    defaultWeeksBefore: 5,
    dependencies: ['venue_booking'],
    isCritical: true,
    description: 'Dispatch RSVP links and track dietary preferences.',
  },
  {
    id: 'final_headcount',
    title: 'Lock Final Headcount & Table Layout',
    category: 'catering',
    defaultWeeksBefore: 2,
    dependencies: ['catering_tasting', 'invitations_dispatch'],
    isCritical: true,
    description: 'Provide final catering guarantees and guest seating chart.',
  },
  {
    id: 'rehearsal_and_payments',
    title: 'Vendor Run-Through & Balance Payments',
    category: 'misc',
    defaultWeeksBefore: 1,
    dependencies: ['final_headcount', 'entertainment_booking'],
    isCritical: true,
    description: 'Conduct soundcheck, lighting check, and stage rehearsal.',
  },
];

/**
 * Calculates a backward-scheduled timeline from the target event date.
 * Automatically compresses intervals for short-notice events and highlights critical path.
 */
export function buildTimelineSchedule(
  brief: EventBrief,
  referenceDate: Date = new Date(),
): TimelineSchedule {
  const targetDateObj = new Date(brief.targetDate);
  const diffDays = Math.max(1, Math.round((targetDateObj.getTime() - referenceDate.getTime()) / MS_PER_DAY));
  const availableWeeks = Math.max(1, Math.floor(diffDays / 7));
  const isCompressed = availableWeeks < 12;

  // Scale weeks before based on available timeframe
  const compressionRatio = isCompressed ? Math.max(0.2, availableWeeks / 16) : 1.0;

  const scheduledTasks: TimelineTask[] = WEDDING_TASK_TEMPLATES.map((tmpl) => {
    const scaledWeeksBefore = Math.min(
      availableWeeks,
      Math.max(1, Math.round(tmpl.defaultWeeksBefore * compressionRatio)),
    );
    const taskDateObj = new Date(targetDateObj.getTime() - scaledWeeksBefore * 7 * MS_PER_DAY);
    const isUrgent = isTaskUrgent(taskDateObj, referenceDate, tmpl.isCritical);

    return {
      id: tmpl.id,
      title: tmpl.title,
      category: tmpl.category,
      recommendedWeeksBefore: scaledWeeksBefore,
      targetDate: taskDateObj.toISOString().split('T')[0] ?? brief.targetDate,
      dependencies: tmpl.dependencies,
      isCriticalPath: tmpl.isCritical,
      isUrgent,
      status: 'pending' as const,
      description: tmpl.description,
    };
  });

  // Sort tasks chronologically (earliest action required first)
  const sortedTasks = [...scheduledTasks].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime(),
  );

  const urgentTasks = sortedTasks.filter((t) => t.isUrgent);
  const criticalPathTaskIds = sortedTasks.filter((t) => t.isCriticalPath).map((t) => t.id);

  return {
    eventDate: brief.targetDate,
    totalPlanningWeeks: availableWeeks,
    isCompressed,
    urgentTasks,
    tasks: sortedTasks,
    criticalPathTaskIds,
  };
}

/** Determines if a task requires immediate action ("book this week") */
function isTaskUrgent(taskDate: Date, referenceDate: Date, isCritical: boolean): boolean {
  const daysUntilDeadline = (taskDate.getTime() - referenceDate.getTime()) / MS_PER_DAY;
  return daysUntilDeadline <= 7 || (isCritical && daysUntilDeadline <= 14);
}
