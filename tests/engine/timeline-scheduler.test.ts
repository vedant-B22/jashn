import { describe, it, expect } from 'vitest';
import { buildTimelineSchedule } from '@/engine/timeline-scheduler';
import { EventBrief } from '@/engine/types';

describe('Timeline Scheduler (Pure Engine)', () => {
  const referenceDate = new Date('2026-05-01');

  const longNoticeBrief: EventBrief = {
    eventType: 'wedding',
    guests: 200,
    budget: 2000000,
    currency: 'INR',
    targetDate: '2026-11-01', // ~26 weeks away
    city: 'Mumbai',
    vibe: 'Modern Festive',
    priorities: ['venue'],
    dietaryConstraints: [],
  };

  const shortNoticeBrief: EventBrief = {
    eventType: 'wedding',
    guests: 150,
    budget: 1000000,
    currency: 'INR',
    targetDate: '2026-05-22', // 3 weeks away
    city: 'Delhi',
    vibe: 'Intimate Rooftop',
    priorities: ['catering'],
    dietaryConstraints: [],
  };

  it('schedules tasks chronologically backward from target date', () => {
    const schedule = buildTimelineSchedule(longNoticeBrief, referenceDate);
    expect(schedule.tasks.length).toBeGreaterThan(0);
    expect(schedule.isCompressed).toBe(false);

    // Tasks should be sorted by targetDate ascending
    for (let i = 0; i < schedule.tasks.length - 1; i++) {
      const taskA = schedule.tasks[i]!;
      const taskB = schedule.tasks[i + 1]!;
      expect(new Date(taskA.targetDate).getTime()).toBeLessThanOrEqual(
        new Date(taskB.targetDate).getTime(),
      );
    }
  });

  it('detects short-notice compression and flags urgent tasks', () => {
    const schedule = buildTimelineSchedule(shortNoticeBrief, referenceDate);
    expect(schedule.isCompressed).toBe(true);
    expect(schedule.urgentTasks.length).toBeGreaterThan(0);

    const urgentTaskIds = schedule.urgentTasks.map((t) => t.id);
    expect(urgentTaskIds).toContain('venue_booking');
  });

  it('identifies critical path task identifiers correctly', () => {
    const schedule = buildTimelineSchedule(longNoticeBrief, referenceDate);
    expect(schedule.criticalPathTaskIds.length).toBeGreaterThan(0);
    expect(schedule.criticalPathTaskIds).toContain('venue_booking');
  });
});
