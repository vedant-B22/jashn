import { PlanBScenario, PlanBTrigger, BudgetBreakdown, BudgetCategory, CategoryAllocation } from './types';

/**
 * Calculates deterministic Plan B contingencies for unexpected disruptions.
 * Returns exact budget deltas, timeline impacts, and adjusted category breakdowns.
 */
export function calculatePlanBScenario(
  trigger: PlanBTrigger,
  baseBreakdown: BudgetBreakdown,
): PlanBScenario {
  switch (trigger) {
    case 'rain':
      return createRainScenario(baseBreakdown);
    case 'vendor_cancellation':
      return createVendorCancellationScenario(baseBreakdown);
    case 'guest_surge':
      return createGuestSurgeScenario(baseBreakdown);
    case 'budget_cut':
      return createBudgetCutScenario(baseBreakdown);
  }
}

/** Sudden heavy rain / weather disruption scenario */
function createRainScenario(base: BudgetBreakdown): PlanBScenario {
  const waterproofCost = Math.round(base.totalBudget * 0.08);
  const updatedCategories = adjustCategoryAmount(base.categories, 'venue', waterproofCost);

  return {
    trigger: 'rain',
    title: 'Monsoon / Outdoor Weather Contingency',
    description: 'Emergency shift to waterproof German hangar canopy or indoor banquet hall.',
    budgetDelta: waterproofCost,
    timelineImpactDays: 1,
    affectedCategories: ['venue', 'decor', 'contingency'],
    immediateActionItems: [
      'Activate venue waterproof canopy clause or shift to indoor banquet space.',
      'Deploy anti-skid rubberized walkways for guest arrival areas.',
      'Cover electrical sound mixers and stage cabling with weatherproof sheeting.',
    ],
    updatedBreakdown: {
      ...base,
      allocatedBudget: base.totalBudget + waterproofCost,
      categories: updatedCategories,
    },
  };
}

/** Last-minute key vendor drop scenario */
function createVendorCancellationScenario(base: BudgetBreakdown): PlanBScenario {
  const premiumCost = Math.round(base.totalBudget * 0.06);
  const updatedCategories = adjustCategoryAmount(base.categories, 'catering', premiumCost);

  return {
    trigger: 'vendor_cancellation',
    title: 'Emergency Vendor Drop Protocol',
    description: 'Key vendor fails to appear; activate verified pre-negotiated backup vendor with 20% rush premium.',
    budgetDelta: premiumCost,
    timelineImpactDays: 2,
    affectedCategories: ['catering', 'contingency'],
    immediateActionItems: [
      'Contact pre-vetted regional backup partner from emergency directory.',
      'Transfer contract deposit dispute to legal escrow/payment provider.',
      'Finalize core essentials menu (cut elaborate 8-dessert counter to 3 signature sweets).',
    ],
    updatedBreakdown: {
      ...base,
      allocatedBudget: base.totalBudget + premiumCost,
      categories: updatedCategories,
    },
  };
}

/** Guest count surge of +30% */
function createGuestSurgeScenario(base: BudgetBreakdown): PlanBScenario {
  const cateringSurge = Math.round(base.totalBudget * 0.12);
  const updatedCategories = adjustCategoryAmount(base.categories, 'catering', cateringSurge);

  return {
    trigger: 'guest_surge',
    title: '+30% Surprise Guest Surge',
    description: 'Attendance surges beyond RSVP count; activate live buffet replenishment and extra seating.',
    budgetDelta: cateringSurge,
    timelineImpactDays: 0,
    affectedCategories: ['catering', 'venue', 'misc'],
    immediateActionItems: [
      'Instruct catering captain to initiate batch cooking of high-yield rice and dal platters.',
      'Deploy 4 additional round tables and 40 Chiavari banquet chairs from warehouse stock.',
      'Open auxiliary parking sector to relieve valet congestion.',
    ],
    updatedBreakdown: {
      ...base,
      allocatedBudget: base.totalBudget + cateringSurge,
      categories: updatedCategories,
    },
  };
}

/** Emergency budget cut of 15% */
function createBudgetCutScenario(base: BudgetBreakdown): PlanBScenario {
  const reductionAmount = Math.round(base.totalBudget * 0.15);
  const trimmedCategories = base.categories.map((c) => {
    // Trim non-essential categories (entertainment, decor, misc) while protecting venue & food
    if (c.category === 'entertainment' || c.category === 'decor' || c.category === 'photography') {
      const reduction = Math.round(reductionAmount / 3);
      const newAmount = Math.max(0, c.amount - reduction);
      return { ...c, amount: newAmount };
    }
    return c;
  });

  return {
    trigger: 'budget_cut',
    title: '15% Budget Cutdown Protocol',
    description: 'Downscale non-essential aesthetic items to preserve primary hospitality and dining experience.',
    budgetDelta: -reductionAmount,
    timelineImpactDays: 0,
    affectedCategories: ['decor', 'entertainment', 'photography'],
    immediateActionItems: [
      'Replace imported live orchid floral arches with brass oil lamps and reusable marigold drapery.',
      'Switch from 5-piece live acoustic band to curated bespoke DJ sound list.',
      'Condense photography coverage from 3 days to peak ceremony hours.',
    ],
    updatedBreakdown: {
      ...base,
      allocatedBudget: base.totalBudget - reductionAmount,
      categories: trimmedCategories,
    },
  };
}

/** Helper to adjust amount of a specific category */
function adjustCategoryAmount(
  categories: readonly CategoryAllocation[],
  categoryToAdjust: BudgetCategory,
  delta: number,
): readonly CategoryAllocation[] {
  return categories.map((c) => {
    if (c.category === categoryToAdjust) {
      return { ...c, amount: c.amount + delta };
    }
    return c;
  });
}
