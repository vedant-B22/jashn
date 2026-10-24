import { EventBrief } from '../../engine/types';
import { sanitizeUserInput } from '../sanitize';

/**
 * Builds the prompt for generating bespoke creative celebration ideas:
 * Themes, dietary-conscious banquet menus, decor concepts, and procedural mood board palettes.
 */
export function buildCreativeIdeasPrompt(brief: EventBrief): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are an elite creative director for Jashn, specializing in Indian weddings, birthdays, and community festivals.
Generate authentic, high-elegance celebration concepts respecting dietary constraints and cultural aesthetics.
Return ONLY valid JSON matching this schema:
{
  "themeTitle": string,
  "themeDescription": string,
  "decorConcept": string,
  "entertainmentConcept": string,
  "moodBoardColors": [
    { "name": string, "hex": string, "role": "primary" | "secondary" | "accent" | "neutral" }
  ],
  "proceduralPattern": "mandala" | "marigold_lattice" | "royal_jali" | "starry_lights",
  "menuSuggestions": [
    {
      "course": "welcome_drinks" | "starters" | "main_course" | "desserts" | "late_night",
      "name": string,
      "description": string,
      "isVegetarian": boolean,
      "tags": string[]
    }
  ],
  "whyThisTheme": string
}
Rules:
- Strictly honor any dietary constraints mentioned (e.g. Jain, Vegan, Pure Vegetarian, Halal).
- Hex colors must be valid 6-character strings like #FF9933.
- Provide at least 4 diverse course items.
- Output pure JSON only without markdown formatting.`;

  const userPrompt = `Generate tailored creative celebration concepts for:
Event Type: ${brief.eventType}
City & Cultural Context: ${sanitizeUserInput(brief.city)}
Vibe: ${sanitizeUserInput(brief.vibe)}
Guests: ${brief.guests}
Budget: ${brief.currency} ${brief.budget.toLocaleString()}
Dietary Constraints: ${brief.dietaryConstraints.join(', ') || 'None specified'}`;

  return { systemPrompt, userPrompt };
}
