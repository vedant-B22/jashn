import { describe, it, expect } from 'vitest';
import {
  calculateInitialBudget,
  rebalanceBudget,
  simulateGuestCountChange,
} from '@/engine/budget-allocator';
import { EventBrief } from '@/engine/types';

describe('Budget Allocator (Pure Engine)', () => {
  const sampleBrief: EventBrief = {
    eventType: 'wedding',
    guests: 200,
    budget: 1500000, // 15 Lakhs
    currency: 'INR',
    targetDate: '2026-11-20',
    city: 'Jaipur',
    vibe: 'Royal Heritage',
    priorities: ['venue', 'catering'],
    dietaryConstraints: ['Vegetarian', 'Jain counter required'],
  };

  it('allocates budget with exact zero-sum integrity', () => {
    const breakdown = calculateInitialBudget(sampleBrief);
    const sumAmounts = breakdown.categories.reduce((acc, c) => acc + c.amount, 0);

    expect(sumAmounts).toBe(sampleBrief.budget);
    expect(breakdown.allocatedBudget).toBe(sampleBrief.budget);
    expect(breakdown.remainingBudget).toBe(0);
  });

  it('ensures no category has a negative allocation', () => {
    const breakdown = calculateInitialBudget(sampleBrief);
    for (const cat of breakdown.categories) {
      expect(cat.amount).toBeGreaterThanOrEqual(0);
      expect(cat.percentage).toBeGreaterThanOrEqual(0);
    }
  });

  it('maintains total budget when a category slider is rebalanced', () => {
    const initial = calculateInitialBudget(sampleBrief);
    const rebalanced = rebalanceBudget(initial, 'venue', 40);

    const sumAmounts = rebalanced.categories.reduce((acc, c) => acc + c.amount, 0);
    expect(sumAmounts).toBe(sampleBrief.budget);

    const venue = rebalanced.categories.find((c) => c.category === 'venue');
    expect(venue?.percentage).toBe(40);
  });

  it('handles edge case: zero budget gracefully without NaN', () => {
    const zeroBrief: EventBrief = { ...sampleBrief, budget: 0 };
    const breakdown = calculateInitialBudget(zeroBrief);

    expect(breakdown.totalBudget).toBe(0);
    expect(breakdown.allocatedBudget).toBe(0);
    for (const cat of breakdown.categories) {
      expect(cat.amount).toBe(0);
      expect(Number.isNaN(cat.amount)).toBe(false);
    }
  });

  it('handles edge case: negative budget by clamping to 0', () => {
    const negBrief: EventBrief = { ...sampleBrief, budget: -50000 };
    const breakdown = calculateInitialBudget(negBrief);

    expect(breakdown.totalBudget).toBe(0);
  });

  it('generates advisory warnings when per-guest budget is tight', () => {
    const tightBrief: EventBrief = { ...sampleBrief, budget: 100000, guests: 200 }; // ₹500/guest
    const breakdown = calculateInitialBudget(tightBrief);

    expect(breakdown.warnings.length).toBeGreaterThan(0);
  });

  it('supports birthday and community presets correctly', () => {
    const bdayBrief: EventBrief = { ...sampleBrief, eventType: 'birthday', guests: 50, budget: 100000 };
    const commBrief: EventBrief = { ...sampleBrief, eventType: 'community', guests: 300, budget: 500000 };

    const bdayBreakdown = calculateInitialBudget(bdayBrief);
    const commBreakdown = calculateInitialBudget(commBrief);

    expect(bdayBreakdown.allocatedBudget).toBe(100000);
    expect(commBreakdown.allocatedBudget).toBe(500000);
  });

  it('calculates what-if guest count simulations accurately', () => {
    const initial = calculateInitialBudget(sampleBrief);
    const simulation = simulateGuestCountChange(initial, 260, 200); // +30% guests

    expect(simulation.estimatedTotal).toBeGreaterThan(sampleBrief.budget);
    expect(simulation.deltaAmount).toBeGreaterThan(0);
    expect(simulation.categoryDeltas.catering).toBeGreaterThan(0);
    // Fixed cost like venue should remain unchanged in variable simulation
    expect(simulation.categoryDeltas.venue).toBe(0);
  });
});
