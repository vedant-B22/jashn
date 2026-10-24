import { BudgetCategory, EventBrief, ExplainabilityRecord, BudgetBreakdown } from './types';

/**
 * Generates transparent explainability records for each budget category allocation.
 * Details the explicit inputs, heuristic ratios, and priority multipliers applied.
 */
export function generateExplainabilityReports(
  brief: EventBrief,
  breakdown: BudgetBreakdown,
): readonly ExplainabilityRecord[] {
  return breakdown.categories.map((allocation) => {
    return explainCategoryAllocation(allocation.category, allocation.amount, brief);
  });
}

/** Generates explanation for a single budget category */
export function explainCategoryAllocation(
  category: BudgetCategory,
  allocatedAmount: number,
  brief: EventBrief,
): ExplainabilityRecord {
  const isPriority = brief.priorities.includes(category);
  const rules: string[] = [];
  const drivers: string[] = [
    `Event Vertical: ${brief.eventType}`,
    `Total Guests: ${brief.guests}`,
    `Total Budget: ${brief.currency} ${brief.budget.toLocaleString()}`,
  ];

  if (isPriority) {
    rules.push('Priority Boost: Applied 1.25x scaling weight because user marked this category as high-priority.');
    drivers.push(`User marked '${category}' in priorities list.`);
  }

  if (category === 'catering') {
    rules.push(`Guest Scaling: ₹${Math.round(allocatedAmount / Math.max(1, brief.guests))} budgeted per head.`);
    if (brief.dietaryConstraints.length > 0) {
      drivers.push(`Dietary accommodations: ${brief.dietaryConstraints.join(', ')}.`);
    }
  } else if (category === 'venue') {
    rules.push('Infrastructure Baseline: 28% historical allocation for verified banquet/resort standard in metro hubs.');
  } else if (category === 'contingency') {
    rules.push('Reserve Invariant: Mandatory 5–10% emergency buffer isolated from discretionary spend.');
  } else {
    rules.push('Proportional Balancing: Distributed remainder ensuring zero-sum budget integrity.');
  }

  return {
    category,
    allocatedAmount,
    rulesApplied: rules,
    inputDrivers: drivers,
  };
}
