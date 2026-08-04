/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { pink: '#ec4899', purple: '#a855f7', dark: '#0b0a10' },
      },
    },
  },
  plugins: [],
};