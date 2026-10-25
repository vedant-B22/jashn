import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#07070D',
        surface: {
          0: '#07070D',
          50: '#0D0D18',
          100: '#141424',
          200: '#1E1E34',
          300: '#2A2A46',
        },
        festive: {
          saffron: '#FF9F1C',
          gold: '#FFC857',
          marigold: '#F48C06',
          magenta: '#D81159',
          rose: '#E83F6F',
          indigo: '#4C3BCF',
          teal: '#06D6A0',
          jade: '#06D6A0',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
        serif: [
          '"Playfair Display"',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'serif',
        ],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        glow: '0 0 30px -5px rgba(255, 159, 28, 0.35)',
        'glow-gold': '0 0 30px -5px rgba(255, 200, 87, 0.35)',
        'glow-magenta': '0 0 30px -5px rgba(232, 63, 111, 0.35)',
        'glow-indigo': '0 0 40px -5px rgba(76, 59, 207, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
