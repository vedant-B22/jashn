import { describe, it, expect } from 'vitest';
import { calculateInitialBudget } from '@/engine/budget-allocator';
import { buildVendorChecklists } from '@/engine/checklist-rules';
import { generateExplainabilityReports } from '@/engine/explainability';
import { EventBrief } from '@/engine/types';

describe('Vendor Checklist & Explainability (Pure Engine)', () => {
  const brief: EventBrief = {
    eventType: 'wedding',
    guests: 180,
    budget: 1200000,
    currency: 'INR',
    targetDate: '2026-10-15',
    city: 'Pune',
    vibe: 'Traditional Maharashtrian',
    priorities: ['catering', 'photography'],
    dietaryConstraints: ['Vegetarian'],
  };

  const budget = calculateInitialBudget(brief);

  it('builds comprehensive vendor checklists with lead times and red flags', () => {
    const checklist = buildVendorChecklists(brief, { venue: 'booked' });
    expect(checklist.length).toBeGreaterThan(0);

    const venue = checklist.find((c) => c.category === 'venue');
    expect(venue?.status).toBe('booked');
    expect(venue?.questionsToAsk.length).toBeGreaterThan(0);
    expect(venue?.redFlags.length).toBeGreaterThan(0);
    expect(venue?.negotiationTips.length).toBeGreaterThan(0);
  });

  it('generates transparent explainability reports detailing rules and inputs', () => {
    const reports = generateExplainabilityReports(brief, budget);
    expect(reports.length).toBe(budget.categories.length);

    const cateringReport = reports.find((r) => r.category === 'catering');
    expect(cateringReport).toBeDefined();
    expect(cateringReport?.rulesApplied.length).toBeGreaterThan(0);
    expect(cateringReport?.inputDrivers.length).toBeGreaterThan(0);
  });
});
