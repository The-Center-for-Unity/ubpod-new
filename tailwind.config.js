/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0c1631',
          light: '#132048',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#e6c458',
        },
        primary: {
          DEFAULT: '#00aeef',
          dark: '#0096cc',
          light: '#33c1f3'
        }
      },
      fontFamily: {
        trajan: ['"trajan-pro-3"', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        'pt-serif': ['"PT Serif"', 'serif'],
        'fira-sans': ['"Fira Sans"', 'sans-serif'],
      },
      animation: {
        'slow-spin': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};