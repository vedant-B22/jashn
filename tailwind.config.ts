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
        background: '#0B0F19',
        surface: {
          50: '#141A29',
          100: '#1B2337',
          200: '#232E47',
          300: '#2F3C5B',
        },
        festive: {
          saffron: '#FF7F11',
          gold: '#FFB800',
          marigold: '#F48C06',
          magenta: '#D81159',
          rose: '#E83F6F',
          indigo: '#1E1B4B',
          teal: '#06D6A0',
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
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 25px -5px rgba(255, 127, 17, 0.4)',
        'glow-magenta': '0 0 25px -5px rgba(216, 17, 89, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
