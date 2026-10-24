import { describe, it, expect } from 'vitest';
import { calculateInitialBudget } from '@/engine/budget-allocator';
import { calculatePlanBScenario } from '@/engine/contingency-engine';
import { EventBrief } from '@/engine/types';

describe('Plan B Contingency Engine (Pure Engine)', () => {
  const brief: EventBrief = {
    eventType: 'wedding',
    guests: 200,
    budget: 1000000,
    currency: 'INR',
    targetDate: '2026-12-10',
    city: 'Bangalore',
    vibe: 'Garden Celebration',
    priorities: ['venue'],
    dietaryConstraints: [],
  };

  const initialBudget = calculateInitialBudget(brief);

  it('calculates rain scenario with venue canopy surcharge and actionable items', () => {
    const rain = calculatePlanBScenario('rain', initialBudget);
    expect(rain.trigger).toBe('rain');
    expect(rain.budgetDelta).toBeGreaterThan(0);
    expect(rain.affectedCategories).toContain('venue');
    expect(rain.immediateActionItems.length).toBeGreaterThan(0);
  });

  it('calculates vendor cancellation with emergency premium surcharge', () => {
    const cancel = calculatePlanBScenario('vendor_cancellation', initialBudget);
    expect(cancel.trigger).toBe('vendor_cancellation');
    expect(cancel.budgetDelta).toBeGreaterThan(0);
    expect(cancel.timelineImpactDays).toBe(2);
  });

  it('calculates guest surge (+30%) catering scaling delta', () => {
    const surge = calculatePlanBScenario('guest_surge', initialBudget);
    expect(surge.trigger).toBe('guest_surge');
    expect(surge.budgetDelta).toBeGreaterThan(0);
    expect(surge.affectedCategories).toContain('catering');
  });

  it('calculates budget cutdown (-15%) safely trimming non-essentials', () => {
    const cut = calculatePlanBScenario('budget_cut', initialBudget);
    expect(cut.trigger).toBe('budget_cut');
    expect(cut.budgetDelta).toBeLessThan(0);
    expect(cut.updatedBreakdown.allocatedBudget).toBeLessThan(initialBudget.allocatedBudget);
  });
});
