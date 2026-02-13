/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        site: '1400px',
      },
      colors: {
        navy: {
          50: '#e8edf5',
          100: '#c5d1e8',
          200: '#9eb2d8',
          300: '#7793c8',
          400: '#597bbc',
          500: '#3b64b0',
          600: '#335aa0',
          700: '#294d8b',
          800: '#1e3a6e',
          900: '#0f1f3d',
          950: '#091428',
        },
        sky: {
          50: '#e6f7ff',
          100: '#b3e5fc',
          200: '#81d4fa',
          300: '#4fc3f7',
          400: '#29b6f6',
          500: '#03a9f4',
          600: '#039be5',
          700: '#0288d1',
          800: '#0277bd',
          900: '#01579b',
        },
        cyan: {
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#00bcd4',
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        admin: ['Funnel Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
