import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { BudgetPlanner } from '@/features/budget/BudgetPlanner';
import { TimelineBuilder } from '@/features/timeline/TimelineBuilder';
import { VendorChecklist } from '@/features/vendors/VendorChecklist';
import { calculateInitialBudget } from '@/engine/budget-allocator';
import { buildTimelineSchedule } from '@/engine/timeline-scheduler';
import { buildVendorChecklists } from '@/engine/checklist-rules';
import { EventBrief } from '@/engine/types';

describe('Accessibility & WCAG 2.2 AA Compliance Audits', () => {
  const brief: EventBrief = {
    eventType: 'wedding',
    guests: 200,
    budget: 1500000,
    currency: 'INR',
    targetDate: '2026-11-20',
    city: 'Jaipur',
    vibe: 'Royal Heritage',
    priorities: ['venue', 'catering'],
    dietaryConstraints: [],
  };

  const budget = calculateInitialBudget(brief);
  const timeline = buildTimelineSchedule(brief);
  const checklists = buildVendorChecklists(brief);

  it('BudgetPlanner view passes automated axe accessibility checks', async () => {
    const { container } = render(
      <BudgetPlanner
        currentLocale="en"
        breakdown={budget}
        onUpdateBreakdown={() => {}}
        guestCount={brief.guests}
        currency={brief.currency}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('TimelineBuilder view passes automated axe accessibility checks', async () => {
    const { container } = render(
      <TimelineBuilder currentLocale="en" schedule={timeline} />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('VendorChecklist view passes automated axe accessibility checks', async () => {
    const { container } = render(
      <VendorChecklist currentLocale="en" initialChecklists={checklists} currency={brief.currency} />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
