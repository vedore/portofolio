/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lab: {
          blue: '#d9efff',
          deep: '#0f3f5b',
          ink: '#0f172a',
        },
      },
      boxShadow: {
        lens: '0 0 80px rgba(14, 55, 87, 0.22)',
      },
    },
  },
  plugins: [],
};
