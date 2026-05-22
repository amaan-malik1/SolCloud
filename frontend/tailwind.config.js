/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        sol: { purple: '#9945FF', green: '#14F195', blue: '#00C2FF' },
        dark: { bg: '#050508', bg2: '#0a0a10', surface: '#13131f', surface2: '#1a1a2a' },
      },
    },
  },
  plugins: [],
}
