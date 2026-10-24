/**
 * Core domain types for Jashn event planner engine.
 * Pure TypeScript definitions, immutable domain models.
 */

export type EventType = 'wedding' | 'birthday' | 'community';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type BudgetCategory =
  | 'venue'
  | 'catering'
  | 'decor'
  | 'photography'
  | 'attire'
  | 'entertainment'
  | 'misc'
  | 'contingency';

export interface EventBrief {
  readonly eventType: EventType;
  readonly guests: number;
  readonly budget: number;
  readonly currency: Currency;
  readonly targetDate: string; // ISO 8601 YYYY-MM-DD
  readonly city: string;
  readonly vibe: string;
  readonly priorities: readonly BudgetCategory[];
  readonly dietaryConstraints: readonly string[];
}

export interface CategoryAllocation {
  readonly category: BudgetCategory;
  readonly label: string;
  readonly percentage: number; // 0 to 100
  readonly amount: number;
  readonly perGuestAmount: number;
  readonly isFlexible: boolean;
  readonly isContingency: boolean;
  readonly rationale: string;
}

export interface BudgetBreakdown {
  readonly totalBudget: number;
  readonly allocatedBudget: number;
  readonly remainingBudget: number;
  readonly perGuestAverage: number;
  readonly contingencyPercentage: number;
  readonly categories: readonly CategoryAllocation[];
  readonly warnings: readonly string[];
}

export interface TimelineTask {
  readonly id: string;
  readonly title: string;
  readonly category: BudgetCategory;
  readonly recommendedWeeksBefore: number;
  readonly targetDate: string; // ISO 8601
  readonly dependencies: readonly string[];
  readonly isCriticalPath: boolean;
  readonly isUrgent: boolean; // Compressed timeline flag ("book this week")
  readonly status: 'pending' | 'in_progress' | 'completed';
  readonly description: string;
}

export interface TimelineSchedule {
  readonly eventDate: string;
  readonly totalPlanningWeeks: number;
  readonly isCompressed: boolean;
  readonly urgentTasks: readonly TimelineTask[];
  readonly tasks: readonly TimelineTask[];
  readonly criticalPathTaskIds: readonly string[];
}

export type VendorStatus = 'not_started' | 'contacted' | 'quoted' | 'booked';

export interface VendorChecklistItem {
  readonly category: BudgetCategory;
  readonly title: string;
  readonly leadTimeWeeks: number;
  readonly targetDate: string;
  readonly questionsToAsk: readonly string[];
  readonly redFlags: readonly string[];
  readonly negotiationTips: readonly string[];
  readonly estimatedCostRange: { readonly min: number; readonly max: number };
  readonly status: VendorStatus;
}

export type PlanBTrigger = 'rain' | 'vendor_cancellation' | 'guest_surge' | 'budget_cut';

export interface PlanBScenario {
  readonly trigger: PlanBTrigger;
  readonly title: string;
  readonly description: string;
  readonly budgetDelta: number; // Positive = cost increase, Negative = cost reduction
  readonly timelineImpactDays: number;
  readonly affectedCategories: readonly BudgetCategory[];
  readonly immediateActionItems: readonly string[];
  readonly updatedBreakdown: BudgetBreakdown;
}

export interface ExplainabilityRecord {
  readonly category: BudgetCategory;
  readonly allocatedAmount: number;
  readonly rulesApplied: readonly string[];
  readonly inputDrivers: readonly string[];
}
