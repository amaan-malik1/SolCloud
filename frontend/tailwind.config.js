/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist Variable"', 'system-ui', 'sans-serif'],
        display: ['"Geist Variable"', 'system-ui', 'sans-serif'],
        body: ['"Geist Variable"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        // Single committed accent: Solana mint. sol.* keys are kept so existing
        // dashboard/auth pages re-theme without touching every file.
        sol: { purple: '#34d399', green: '#34d399', blue: '#5eead4' },
        accent: {
          DEFAULT: '#34d399',
          bright: '#4ae3ab',
          dim: '#10b981',
          ink: '#052e21',
        },
        dark: {
          bg: '#060a09',
          bg2: '#090f0d',
          surface: '#0c1311',
          surface2: '#121a17',
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      keyframes: {
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        'float-soft': 'float-soft 6s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
