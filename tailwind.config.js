/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5D26C1',
          dark: '#4C1D9E',
          light: '#7B52D3',
        },
        secondary: {
          DEFAULT: '#FF5E5B',
          dark: '#E54340',
          light: '#FF8A87',
        },
        background: {
          light: '#FFFFFF',
          dark: '#121212',
        },
        text: {
          light: '#333333',
          dark: '#F2F2F2',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
        serif: ['Noto Serif KR', 'serif'],
      },
      animation: {
        'stroke-draw': 'stroke-draw 1.5s ease forwards',
      },
      keyframes: {
        'stroke-draw': {
          '0%': { strokeDashoffset: '100%' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
} 