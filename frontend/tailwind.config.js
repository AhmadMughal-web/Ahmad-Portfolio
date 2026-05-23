/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan:   '#00f7ff',
        purple: '#a855f7',
        blue:   '#3b82f6',
        bg:     '#020408',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'grad-cp': 'linear-gradient(135deg, #a855f7, #00f7ff)',
        'grad-pc': 'linear-gradient(135deg, #00f7ff, #a855f7)',
      },
    },
  },
  plugins: [],
};
