/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#496287',
        'royal-blue': '#007AFF',
        'sunshine-yellow': '#FFCC00',
        'tomato-red': '#FF3B30',
        'success-green': '#34C759',
        'gray': '#9F9F9F',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
