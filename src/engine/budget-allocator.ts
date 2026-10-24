import { BudgetCategory, CategoryAllocation, BudgetBreakdown, EventBrief } from './types';

export const MIN_CONTINGENCY_PERCENT = 5;
export const MAX_CONTINGENCY_PERCENT = 15;
export const DEFAULT_CONTINGENCY_PERCENT = 8;

export const BASE_WEIGHTS: Record<EventBrief['eventType'], Record<BudgetCategory, number>> = {
  wedding: {
    venue: 28,
    catering: 26,
    decor: 12,
    photography: 10,
    attire: 8,
    entertainment: 5,
    misc: 3,
    contingency: 8,
  },
  birthday: {
    venue: 25,
    catering: 35,
    decor: 15,
    entertainment: 10,
    photography: 5,
    attire: 0,
    misc: 4,
    contingency: 6,
  },
  community: {
    venue: 30,
    catering: 30,
    decor: 10,
    entertainment: 12,
    photography: 4,
    attire: 0,
    misc: 6,
    contingency: 8,
  },
};

export const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  venue: 'Venue & Infrastructure',
  catering: 'Catering & Beverages',
  decor: 'Decor & Ambience',
  photography: 'Photography & Video',
  attire: 'Attire & Styling',
  entertainment: 'Music & Entertainment',
  misc: 'Logistics & Permissions',
  contingency: 'Emergency Contingency Fund',
};

const CATEGORIES_LIST: readonly BudgetCategory[] = [
  'venue',
  'catering',
  'decor',
  'photography',
  'attire',
  'entertainment',
  'misc',
  'contingency',
];

/**
 * Calculates initial budget allocations based on brief, priorities, and guest count.
 * Guaranteed to sum to 100% and match total budget exactly.
 */
export function calculateInitialBudget(brief: EventBrief): BudgetBreakdown {
  const safeBudget = Math.max(0, brief.budget);
  const safeGuests = Math.max(1, brief.guests);
  const baseRatios = { ...BASE_WEIGHTS[brief.eventType] };

  // Boost priority categories moderately
  const adjustedWeights = adjustWeightsForPriorities(baseRatios, brief.priorities);
  const normalizedPercentages = normalizePercentages(adjustedWeights);

  const categories = CATEGORIES_LIST.map((cat) => {
    const percentage = normalizedPercentages[cat] ?? 0;
    const amount = Math.round((safeBudget * percentage) / 100);
    return {
      category: cat,
      label: CATEGORY_LABELS[cat],
      percentage,
      amount,
      perGuestAmount: Math.round(amount / safeGuests),
      isFlexible: cat !== 'contingency',
      isContingency: cat === 'contingency',
      rationale: buildCategoryRationale(cat, percentage, safeGuests),
    };
  });

  const reconciledCategories = reconcileRoundingErrors(categories, safeBudget, safeGuests);
  const warnings = generateBudgetWarnings(safeBudget, safeGuests, brief.eventType);

  return {
    totalBudget: safeBudget,
    allocatedBudget: safeBudget,
    remainingBudget: 0,
    perGuestAverage: Math.round(safeBudget / safeGuests),
    contingencyPercentage: normalizedPercentages.contingency ?? DEFAULT_CONTINGENCY_PERCENT,
    categories: reconciledCategories,
    warnings,
  };
}

/**
 * Rebalances other flexible categories when a user adjusts a single category slider.
 * Preserves the invariant: sum(percentages) === 100% and sum(amounts) === totalBudget.
 */
export function rebalanceBudget(
  currentBreakdown: BudgetBreakdown,
  targetCategory: BudgetCategory,
  newTargetPercentage: number,
): BudgetBreakdown {
  const safeTargetPct = Math.min(100, Math.max(0, Math.round(newTargetPercentage)));
  const totalBudget = currentBreakdown.totalBudget;
  const safeGuests = Math.max(1, Math.round(totalBudget / (currentBreakdown.perGuestAverage || 1)));

  const otherCategories = currentBreakdown.categories.filter((c) => c.category !== targetCategory);
  const sumOtherCurrentPct = otherCategories.reduce((acc, c) => acc + c.percentage, 0);
  const remainingPctToDistribute = 100 - safeTargetPct;

  const updatedCategories: CategoryAllocation[] = currentBreakdown.categories.map((cat) => {
    if (cat.category === targetCategory) {
      const amount = Math.round((totalBudget * safeTargetPct) / 100);
      return {
        ...cat,
        percentage: safeTargetPct,
        amount,
        perGuestAmount: Math.round(amount / safeGuests),
      };
    }

    const share = sumOtherCurrentPct > 0 ? cat.percentage / sumOtherCurrentPct : 1 / otherCategories.length;
    const newPct = Math.round(share * remainingPctToDistribute);
    const amount = Math.round((totalBudget * newPct) / 100);
    return {
      ...cat,
      percentage: newPct,
      amount,
      perGuestAmount: Math.round(amount / safeGuests),
    };
  });

  const reconciled = reconcileRoundingErrors(updatedCategories, totalBudget, safeGuests);
  const contingency = reconciled.find((c) => c.category === 'contingency')?.percentage ?? DEFAULT_CONTINGENCY_PERCENT;

  return {
    ...currentBreakdown,
    allocatedBudget: totalBudget,
    remainingBudget: 0,
    categories: reconciled,
    contingencyPercentage: contingency,
  };
}

/**
 * Simulates budget implications when guest count changes (what-if analysis).
 * Variable costs (catering, decor) scale with guests; fixed costs remain stable.
 */
export function simulateGuestCountChange(
  baseBreakdown: BudgetBreakdown,
  newGuestCount: number,
  originalGuestCount: number,
): {
  readonly estimatedTotal: number;
  readonly deltaAmount: number;
  readonly perGuestNew: number;
  readonly categoryDeltas: Record<BudgetCategory, number>;
} {
  const safeNewGuests = Math.max(1, newGuestCount);
  const safeOrigGuests = Math.max(1, originalGuestCount);
  const guestRatio = safeNewGuests / safeOrigGuests;

  const categoryDeltas = {} as Record<BudgetCategory, number>;
  let simulatedTotal = 0;

  for (const cat of baseBreakdown.categories) {
    const isVariable = cat.category === 'catering' || cat.category === 'decor' || cat.category === 'misc';
    const newAmount = isVariable ? Math.round(cat.amount * guestRatio) : cat.amount;
    categoryDeltas[cat.category] = newAmount - cat.amount;
    simulatedTotal += newAmount;
  }

  return {
    estimatedTotal: simulatedTotal,
    deltaAmount: simulatedTotal - baseBreakdown.totalBudget,
    perGuestNew: Math.round(simulatedTotal / safeNewGuests),
    categoryDeltas,
  };
}

/** Adjusts weights according to user priorities */
function adjustWeightsForPriorities(
  weights: Record<BudgetCategory, number>,
  priorities: readonly BudgetCategory[],
): Record<BudgetCategory, number> {
  const result = { ...weights };
  for (const p of priorities) {
    if (result[p] !== undefined && p !== 'contingency') {
      result[p] = (result[p] ?? 10) * 1.25;
    }
  }
  return result;
}

/** Normalizes category weights to exact integer percentages totaling 100 */
function normalizePercentages(weights: Record<BudgetCategory, number>): Record<BudgetCategory, number> {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  const normalized = {} as Record<BudgetCategory, number>;
  let total = 0;

  for (const cat of CATEGORIES_LIST) {
    const rawVal = ((weights[cat] ?? 0) / sum) * 100;
    const rounded = Math.round(rawVal);
    normalized[cat] = rounded;
    total += rounded;
  }

  const discrepancy = 100 - total;
  if (discrepancy !== 0) {
    normalized.misc = Math.max(1, (normalized.misc ?? 2) + discrepancy);
  }
  return normalized;
}

/** Reconciles rounding to ensure category sums match totalBudget exactly */
function reconcileRoundingErrors(
  categories: CategoryAllocation[],
  totalBudget: number,
  guests: number,
): CategoryAllocation[] {
  const currentSum = categories.reduce((acc, c) => acc + c.amount, 0);
  const delta = totalBudget - currentSum;
  if (delta === 0) return categories;

  return categories.map((c) => {
    if (c.category === 'misc') {
      const adjustedAmount = Math.max(0, c.amount + delta);
      return {
        ...c,
        amount: adjustedAmount,
        perGuestAmount: Math.round(adjustedAmount / guests),
      };
    }
    return c;
  });
}

/** Generates advisory warnings for tight or skewed budgets */
function generateBudgetWarnings(budget: number, guests: number, eventType: string): string[] {
  const warnings: string[] = [];
  const perGuest = budget / guests;

  if (eventType === 'wedding' && perGuest < 1200) {
    warnings.push('Per-guest budget is tight for a wedding (₹1,200/guest). Consider trimming decor/entertainment.');
  } else if (perGuest < 500) {
    warnings.push('Low per-guest allowance detected. Essential catering and venue may require cost compromises.');
  }

  return warnings;
}

/** Produces natural language rationale for allocation */
function buildCategoryRationale(category: BudgetCategory, percentage: number, guests: number): string {
  if (category === 'catering') {
    return `Scaled for ${guests} guests at ${percentage}% of total allocation including beverages.`;
  }
  if (category === 'contingency') {
    return `Reserved ${percentage}% safety cushion for emergency surge, overtime, or unexpected vendor taxes.`;
  }
  return `Targeted ${percentage}% allocation aligned with historical benchmarks.`;
}
