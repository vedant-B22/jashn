import { BudgetCategory, VendorChecklistItem, VendorStatus, EventBrief } from './types';

interface VendorRule {
  readonly category: BudgetCategory;
  readonly defaultLeadWeeks: number;
  readonly title: string;
  readonly questions: readonly string[];
  readonly redFlags: readonly string[];
  readonly negotiationTips: readonly string[];
  readonly costRatioMin: number;
  readonly costRatioMax: number;
}

const VENDOR_RULES: readonly VendorRule[] = [
  {
    category: 'venue',
    defaultLeadWeeks: 16,
    title: 'Banquet Hall / Resort Booking',
    questions: [
      'Is there an in-house catering mandate or is outside catering permitted without royalty fees?',
      'What are the strict generator backup capacities and air conditioning redundancy?',
      'What are the municipal sound cut-off restrictions (e.g. 10:00 PM vs 12:00 AM)?',
    ],
    redFlags: [
      'Refusal to provide written slot exclusivity (dual bookings on same lawn).',
      'Hidden surcharge fees for outside decorators or power generator diesel fuel.',
      'No clear force-majeure refund clause in the draft contract.',
    ],
    negotiationTips: [
      'Negotiate 2 complimentary green rooms for bride and groom families.',
      'Ask for setup time waiver (morning 6 AM entry without additional half-day charges).',
    ],
    costRatioMin: 0.25,
    costRatioMax: 0.32,
  },
  {
    category: 'catering',
    defaultLeadWeeks: 12,
    title: 'Catering & Live Counters',
    questions: [
      'Do you provide live counter chefs and live tandoor stations included in per-plate cost?',
      'What is your buffer policy if guest attendance exceeds the RSVP count by 10%?',
      'Are food hygiene certificates and filtered mineral water used for cooking?',
    ],
    redFlags: [
      'Unwillingness to host a formal food tasting session with primary curries.',
      'No dedicated captain assigned to replenish dessert and appetiser platters.',
    ],
    negotiationTips: [
      'Bundle mocktail bar and late-night tea/coffee station into the primary buffet price.',
      'Request price-locking on market-sensitive ingredients like paneer and seasonal sweets.',
    ],
    costRatioMin: 0.24,
    costRatioMax: 0.30,
  },
  {
    category: 'decor',
    defaultLeadWeeks: 8,
    title: 'Stage & Mandap Decorator',
    questions: [
      'Will you provide a 3D architectural render or visual moodboard before fabrication?',
      'Are fresh seasonal blooms guaranteed rather than synthetic dust-retaining fabric flowers?',
    ],
    redFlags: [
      'Recycled floral arrangements from a prior morning event without discount.',
      'Unclear electrical safety or flammable drapery near ceremonial fire/candles.',
    ],
    negotiationTips: [
      'Substitute expensive out-of-season orchids with rich marigold, jasmine, and tuberoses.',
      'Repurpose entrance walkway floral arches as photo-booth backdrops for reception.',
    ],
    costRatioMin: 0.1,
    costRatioMax: 0.15,
  },
  {
    category: 'photography',
    defaultLeadWeeks: 10,
    title: 'Traditional & Candid Cinematography',
    questions: [
      'How many primary photographers and drone pilots will be physically on-site?',
      'What is the guaranteed delivery timeline for teaser reel (7 days) and full album (45 days)?',
    ],
    redFlags: [
      'Subcontracting work to unverified junior freelancers without portfolio review.',
      'Withholding high-resolution RAW photo archives behind an extra fee paywall.',
    ],
    negotiationTips: [
      'Combine pre-wedding shoot and 2-day wedding coverage for a 15% bundled package discount.',
    ],
    costRatioMin: 0.08,
    costRatioMax: 0.12,
  },
  {
    category: 'entertainment',
    defaultLeadWeeks: 6,
    title: 'Sound, DJ & Sangeet Choreographer',
    questions: [
      'Do you bring certified line-array sound speakers and wireless microphones?',
      'Can you adapt live song tempo according to crowd demographics (elders vs youth)?',
    ],
    redFlags: [
      'Demanding full advance payment before soundcheck on event day.',
      'Lack of backup laptops or secondary mixing consoles on site.',
    ],
    negotiationTips: [
      'Include dry ice fog machine and cold-pyro sparkle fountains as a packaged incentive.',
    ],
    costRatioMin: 0.04,
    costRatioMax: 0.08,
  },
];

/**
 * Builds vendor checklists tailored to the event brief with cost benchmarks and lead times.
 */
export function buildVendorChecklists(
  brief: EventBrief,
  existingStatuses: Partial<Record<BudgetCategory, VendorStatus>> = {},
): readonly VendorChecklistItem[] {
  const targetDateObj = new Date(brief.targetDate);

  return VENDOR_RULES.map((rule) => {
    const targetDate = new Date(targetDateObj.getTime() - rule.defaultLeadWeeks * 7 * 24 * 60 * 60 * 1000);
    const minCost = Math.round(brief.budget * rule.costRatioMin);
    const maxCost = Math.round(brief.budget * rule.costRatioMax);

    return {
      category: rule.category,
      title: rule.title,
      leadTimeWeeks: rule.defaultLeadWeeks,
      targetDate: targetDate.toISOString().split('T')[0] ?? brief.targetDate,
      questionsToAsk: rule.questions,
      redFlags: rule.redFlags,
      negotiationTips: rule.negotiationTips,
      estimatedCostRange: { min: minCost, max: maxCost },
      status: existingStatuses[rule.category] ?? 'not_started',
    };
  });
}
