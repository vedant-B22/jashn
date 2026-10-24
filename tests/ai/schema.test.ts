import { describe, it, expect } from 'vitest';
import { ParsedBriefSchema, CreativeIdeasSchema } from '@/ai/schemas/plan.schema';

describe('Plan Schemas & Validation Resilience', () => {
  it('validates a compliant parsed brief successfully', () => {
    const valid = {
      eventType: 'wedding',
      guests: 200,
      budget: 1500000,
      currency: 'INR',
      targetDate: '2026-11-20',
      city: 'Jaipur',
      vibe: 'Royal Heritage',
      priorities: ['venue', 'catering'],
      dietaryConstraints: ['Vegetarian'],
      missingFields: [],
    };

    const parsed = ParsedBriefSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('rejects malformed dates or negative guests', () => {
    const invalid = {
      eventType: 'wedding',
      guests: -5,
      budget: 1500000,
      targetDate: 'invalid-date-string',
      city: 'Jaipur',
    };

    const parsed = ParsedBriefSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('validates creative ideas with valid hex colors and menu items', () => {
    const validIdeas = {
      themeTitle: 'Royal Marigold',
      themeDescription: 'Heritage palette',
      decorConcept: 'Brass lamps',
      entertainmentConcept: 'Live acoustic',
      moodBoardColors: [
        { name: 'Saffron', hex: '#FF7F11', role: 'primary' },
        { name: 'Magenta', hex: '#D81159', role: 'secondary' },
        { name: 'Gold', hex: '#FFB800', role: 'accent' },
      ],
      proceduralPattern: 'mandala',
      menuSuggestions: [
        { course: 'starters', name: 'Paneer Tikka', description: 'Grilled', isVegetarian: true, tags: ['Appetizer'] },
        { course: 'main_course', name: 'Dal Makhani', description: 'Slow cooked', isVegetarian: true, tags: ['Main'] },
        { course: 'welcome_drinks', name: 'Thandai', description: 'Chilled', isVegetarian: true, tags: ['Drink'] },
        { course: 'desserts', name: 'Halwa', description: 'Warm', isVegetarian: true, tags: ['Sweet'] },
      ],
      whyThisTheme: 'Matches Jaipur heritage',
    };

    const parsed = CreativeIdeasSchema.safeParse(validIdeas);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid hex codes in mood board colors', () => {
    const invalidColors = {
      themeTitle: 'Title',
      themeDescription: 'Desc',
      decorConcept: 'Decor',
      entertainmentConcept: 'Music',
      moodBoardColors: [
        { name: 'Bad Hex', hex: 'not-a-hex-color', role: 'primary' },
      ],
      proceduralPattern: 'mandala',
      menuSuggestions: [],
      whyThisTheme: 'Reason',
    };

    const parsed = CreativeIdeasSchema.safeParse(invalidColors);
    expect(parsed.success).toBe(false);
  });
});
