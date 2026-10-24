import { z } from 'zod';

export const EventTypeSchema = z.enum(['wedding', 'birthday', 'community']);

export const CurrencySchema = z.enum(['INR', 'USD', 'EUR', 'GBP']).default('INR');

export const BudgetCategorySchema = z.enum([
  'venue',
  'catering',
  'decor',
  'photography',
  'attire',
  'entertainment',
  'misc',
  'contingency',
]);

export const ParsedBriefSchema = z.object({
  eventType: EventTypeSchema,
  guests: z.number().int().positive().max(5000).default(200),
  budget: z.number().nonnegative().default(1500000),
  currency: CurrencySchema,
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  city: z.string().min(1).max(100).default('Jaipur'),
  vibe: z.string().min(1).max(150).default('Festive Heritage Elegance'),
  priorities: z.array(BudgetCategorySchema).default(['venue', 'catering']),
  dietaryConstraints: z.array(z.string()).default([]),
  missingFields: z.array(z.string()).default([]),
});

export type ParsedBrief = z.infer<typeof ParsedBriefSchema>;

export const MenuItemSchema = z.object({
  course: z.enum(['welcome_drinks', 'starters', 'main_course', 'desserts', 'late_night']),
  name: z.string(),
  description: z.string(),
  isVegetarian: z.boolean(),
  tags: z.array(z.string()),
});

export const MoodBoardColorSchema = z.object({
  name: z.string(),
  hex: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/),
  role: z.enum(['primary', 'secondary', 'accent', 'neutral']),
});

export const CreativeIdeasSchema = z.object({
  themeTitle: z.string(),
  themeDescription: z.string(),
  decorConcept: z.string(),
  entertainmentConcept: z.string(),
  moodBoardColors: z.array(MoodBoardColorSchema).min(3).max(6),
  proceduralPattern: z.enum(['mandala', 'marigold_lattice', 'royal_jali', 'starry_lights']),
  menuSuggestions: z.array(MenuItemSchema).min(4),
  whyThisTheme: z.string(),
});

export type CreativeIdeas = z.infer<typeof CreativeIdeasSchema>;

export const PlanRequestSchema = z.object({
  rawBrief: z.string().min(3).max(2000),
  overrideBrief: ParsedBriefSchema.partial().optional(),
});

export type PlanRequest = z.infer<typeof PlanRequestSchema>;
