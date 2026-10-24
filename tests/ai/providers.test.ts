import { describe, it, expect } from 'vitest';
import { MockProvider } from '@/ai/providers/mock-provider';
import { FallbackProvider } from '@/ai/providers/fallback-provider';
import { GeminiProvider } from '@/ai/providers/gemini-provider';
import { EventBrief } from '@/engine/types';

describe('AI Providers & Deterministic Fallbacks', () => {
  const sampleBrief: EventBrief = {
    eventType: 'wedding',
    guests: 200,
    budget: 1500000,
    currency: 'INR',
    targetDate: '2026-11-20',
    city: 'Jaipur',
    vibe: 'Royal Heritage',
    priorities: ['venue', 'catering'],
    dietaryConstraints: [],
  };

  it('MockProvider parses raw text and extracts parameters reliably', async () => {
    const mock = new MockProvider();
    const result = await mock.parseBrief('30th birthday, 60 guests, 2L budget, rooftop vibe in Mumbai');

    expect(result.eventType).toBe('birthday');
    expect(result.guests).toBe(60);
    expect(result.budget).toBe(200000);
    expect(result.city).toBe('Mumbai');
  });

  it('FallbackProvider produces authentic creative ideas without API key', async () => {
    const fallback = new FallbackProvider();
    const ideas = await fallback.generateCreativeIdeas(sampleBrief);

    expect(ideas.themeTitle).toBeDefined();
    expect(ideas.moodBoardColors.length).toBeGreaterThanOrEqual(3);
    expect(ideas.menuSuggestions.length).toBeGreaterThanOrEqual(4);
  });

  it('GeminiProvider falls back to deterministic provider when API key is missing', async () => {
    const gemini = new GeminiProvider(''); // Empty API key
    const result = await gemini.parseBrief('Traditional Indian wedding, 250 guests, 20 Lakhs, Jaipur');

    expect(result.eventType).toBe('wedding');
    expect(result.guests).toBe(250);
    expect(result.budget).toBe(2000000);
  });
});
