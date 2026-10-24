import { TimelineTask } from '../engine/types';

/**
 * Generates an RFC 5545 compliant .ics calendar file from timeline tasks.
 */
export function generateIcsCalendar(tasks: readonly TimelineTask[], eventTitle = 'Jashn Event Timeline'): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jashn//Celebration Planner RFC5545//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${cleanIcsText(eventTitle)}`,
  ];

  for (const task of tasks) {
    const dateStr = task.targetDate.replace(/-/g, '');
    const uid = `jashn-${task.id}-${dateStr}@jashn.planner`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dateStr}T090000Z`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:${cleanIcsText(`[Jashn] ${task.title}`)}`,
      `DESCRIPTION:${cleanIcsText(`${task.description} (Category: ${task.category}, Priority: ${task.isCriticalPath ? 'Critical' : 'Standard'})`)}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/** Triggers automatic download of the .ics file in browser */
export function downloadIcsFile(tasks: readonly TimelineTask[], filename = 'jashn-celebration-schedule.ics'): void {
  if (typeof window === 'undefined') return;

  const icsData = generateIcsCalendar(tasks);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function cleanIcsText(str: string): string {
  return str.replace(/[\\;,]/g, (match) => `\\${match}`).replace(/\n/g, '\\n');
}
