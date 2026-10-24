import { AIProvider } from './ai-provider.interface';
import { EventBrief } from '../../engine/types';
import { ParsedBrief, CreativeIdeas } from '../schemas/plan.schema';

const WEDDING_IDEAS: CreativeIdeas = {
  themeTitle: 'Royal Marigold & Heritage Velvet',
  themeDescription:
    'A timeless celebration blending Rajasthani palace arches with warm festive marigold garlands and amber lantern glow.',
  decorConcept:
    'Brass urlis with floating rose petals at the entryway, bespoke handwoven fabric canopies, and fairy-lit eucalyptus foliage for the reception mandap.',
  entertainmentConcept:
    'Sufi-fusion acoustic welcome lounge, live dhol entry procession, and a curated high-energy Bollywood DJ set with LED dholak accompaniment.',
  moodBoardColors: [
    { name: 'Saffron Gold', hex: '#FF7F11', role: 'primary' },
    { name: 'Royal Magenta', hex: '#D81159', role: 'secondary' },
    { name: 'Palace Ivory', hex: '#FFF8E7', role: 'neutral' },
    { name: 'Deep Emerald', hex: '#0B6E4F', role: 'accent' },
  ],
  proceduralPattern: 'marigold_lattice',
  menuSuggestions: [
    {
      course: 'welcome_drinks',
      name: 'Kesariya Thandai & Smoked Kokum Spritz',
      description: 'Chilled saffron almond milk refresher and sparkling spiced kokum cooler.',
      isVegetarian: true,
      tags: ['Traditional', 'Cooling'],
    },
    {
      course: 'starters',
      name: 'Dahi Ke Kebab & Amritsari Fish Tikka',
      description: 'Hung-curd croquettes with mint relish alongside carom-infused grilled fish.',
      isVegetarian: false,
      tags: ['Live Tandoor', 'Chef Signature'],
    },
    {
      course: 'main_course',
      name: 'Dal Makhani Dum Pukht & Paneer Lababdar',
      description: 'Slow-simmered black lentils with churned butter and cottage cheese in rich tomato gravy.',
      isVegetarian: true,
      tags: ['Royal Classic', 'Gluten-Free Option'],
    },
    {
      course: 'desserts',
      name: 'Moong Dal Halwa with Rabdi & Baked Jalebi Caviar',
      description: 'Rich ghee-roasted lentil confection served warm with condensed cream.',
      isVegetarian: true,
      tags: ['Festive', 'Warm'],
    },
  ],
  whyThisTheme:
    'Chosen to balance regal Indian heritage aesthetics with budget-conscious local floral sourcing and multi-generational appeal.',
};

const BIRTHDAY_IDEAS: CreativeIdeas = {
  themeTitle: 'Twilight Neon & Rooftop Chic',
  themeDescription:
    'A modern high-energy rooftop celebration featuring geometric neon accents, acoustic lounge beats, and artisanal craft mocktails.',
  decorConcept:
    'Minimalist warm Edison bulb arrays, metallic copper high tables, geometric photo backdrops, and subtle smoked amber uplighting.',
  entertainmentConcept:
    'Live indie-acoustic duo for sunset transitions into a deep house DJ session with interactive percussion.',
  moodBoardColors: [
    { name: 'Electric Magenta', hex: '#E83F6F', role: 'primary' },
    { name: 'Midnight Indigo', hex: '#1E1B4B', role: 'secondary' },
    { name: 'Champagne Glow', hex: '#FFD166', role: 'accent' },
    { name: 'Graphite Slate', hex: '#1E293B', role: 'neutral' },
  ],
  proceduralPattern: 'starry_lights',
  menuSuggestions: [
    {
      course: 'welcome_drinks',
      name: 'Spiced Guava Chilli & Yuzu Elderflower Fizz',
      description: 'Tangy pink guava with pink salt rim and botanical sparkling spritz.',
      isVegetarian: true,
      tags: ['Artisanal', 'Mocktail'],
    },
    {
      course: 'starters',
      name: 'Truffle Mushroom Sliders & Peri Peri Chicken Skewers',
      description: 'Mini brioche sliders with caramelized onions and flame-grilled herb skewers.',
      isVegetarian: false,
      tags: ['Finger Food', 'Modern Fusion'],
    },
    {
      course: 'main_course',
      name: 'Artisan Wood-Fired Sourdough Pizzas & Mezze Platters',
      description: 'Live pizza counter with burrata and seasonal toppings, served with fresh dips.',
      isVegetarian: true,
      tags: ['Live Counter', 'Interactive'],
    },
    {
      course: 'desserts',
      name: 'Salted Caramel Tart & Churros with Belgian Chocolate',
      description: 'Warm crispy pastry sticks served with dark chocolate fondue dip.',
      isVegetarian: true,
      tags: ['Decadent', 'Crowd Favorite'],
    },
  ],
  whyThisTheme:
    'Tailored for an intimate rooftop setting, maximizing skyline ambience while keeping seating and decor logistics nimble.',
};

/**
 * Deterministic fallback provider operating with 100% offline reliability.
 */
export class FallbackProvider implements AIProvider {
  readonly name = 'DeterministicFallback';

  async parseBrief(rawText: string): Promise<ParsedBrief> {
    const text = rawText.toLowerCase();

    // Deterministic extraction heuristics
    const isBirthday = text.includes('birthday') || text.includes('bday');
    const isCommunity = text.includes('community') || text.includes('diwali') || text.includes('gala');
    const eventType = isBirthday ? 'birthday' : isCommunity ? 'community' : 'wedding';

    // Guest extraction
    const guestMatch = text.match(/(\d+)\s*(guests?|people|pax|heads?)/i);
    const guests = guestMatch ? parseInt(guestMatch[1] ?? '200', 10) : isBirthday ? 60 : 200;

    // Budget extraction (e.g. 2L, 2 lakh, 15L, ₹15,00,000, 500000)
    let budget = isBirthday ? 200000 : 1500000;
    const lakhMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|l)/i);
    if (lakhMatch && lakhMatch[1]) {
      budget = Math.round(parseFloat(lakhMatch[1]) * 100000);
    } else {
      const numMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d{4,8})/i);
      if (numMatch && numMatch[1]) {
        budget = parseInt(numMatch[1], 10);
      }
    }

    // Target date estimation (default ~6 months ahead for wedding, ~4 weeks for birthday)
    const weeksAhead = isBirthday ? 4 : 24;
    const futureDate = new Date(Date.now() + weeksAhead * 7 * 24 * 60 * 60 * 1000);
    const targetDate = futureDate.toISOString().split('T')[0] ?? '2026-11-20';

    return {
      eventType,
      guests,
      budget,
      currency: 'INR',
      targetDate,
      city: text.includes('delhi') ? 'Delhi' : text.includes('mumbai') ? 'Mumbai' : 'Jaipur',
      vibe: isBirthday ? 'Chic Rooftop Vibe' : 'Festive Heritage Elegance',
      priorities: isBirthday ? ['catering', 'entertainment'] : ['venue', 'catering'],
      dietaryConstraints: text.includes('jain') ? ['Jain Pure Veg'] : text.includes('veg') ? ['Vegetarian'] : [],
      missingFields: [],
    };
  }

  async generateCreativeIdeas(brief: EventBrief): Promise<CreativeIdeas> {
    if (brief.eventType === 'birthday') {
      return BIRTHDAY_IDEAS;
    }
    return WEDDING_IDEAS;
  }
}
