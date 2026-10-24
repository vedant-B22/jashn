import { sanitizeUserInput, wrapInBoundaryTags } from '../sanitize';

/**
 * Builds the system and user prompt for parsing a raw celebration brief into structured JSON.
 */
export function buildBriefParserPrompt(rawText: string): { systemPrompt: string; userPrompt: string } {
  const sanitized = sanitizeUserInput(rawText);
  const boundedText = wrapInBoundaryTags(sanitized);

  const systemPrompt = `You are an expert event planning intake parser for Jashn, specializing in Indian weddings, birthdays, and community celebrations.
Your role is to strictly extract structured event parameters from free-text user briefs.
Return ONLY valid JSON matching this schema:
{
  "eventType": "wedding" | "birthday" | "community",
  "guests": number (positive integer, default to 200 if not stated),
  "budget": number (in local currency units, e.g. 1500000 for 15L or 15 Lakhs, 200000 for 2L),
  "currency": "INR" | "USD" | "EUR" | "GBP",
  "targetDate": "YYYY-MM-DD" (calculate relative to current year 2026 if relative e.g. "3 weeks away", "in November"),
  "city": string,
  "vibe": string,
  "priorities": Array<"venue" | "catering" | "decor" | "photography" | "attire" | "entertainment" | "misc" | "contingency">,
  "dietaryConstraints": string[],
  "missingFields": string[]
}
Rules:
- If a required field (budget, guests, targetDate, city) is missing from the brief, add its name to "missingFields" and supply a sensible default.
- Never output markdown code fences, comments, or conversational text. Output pure JSON only.`;

  const userPrompt = `Extract the structured event parameters from the following user brief:
${boundedText}`;

  return { systemPrompt, userPrompt };
}
