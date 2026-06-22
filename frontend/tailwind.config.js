/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      colors: {
        // Brand accent — used sparingly, Swiss-style.
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Near-black neutral scale for type and the primary control.
        ink: {
          50: '#f6f7f8',
          100: '#eceef1',
          200: '#d7dbe0',
          300: '#b3bac4',
          400: '#8a93a1',
          500: '#646e7e',
          600: '#48515f',
          700: '#343b46',
          800: '#1f242c',
          900: '#0c0e12',
        },
      },
      boxShadow: {
        glass:
          '0 1px 0 0 rgba(255,255,255,0.55) inset, 0 14px 44px -16px rgba(12,14,18,0.28)',
        'glass-sm':
          '0 1px 0 0 rgba(255,255,255,0.5) inset, 0 8px 24px -14px rgba(12,14,18,0.22)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -4%, 0) scale(1.08)' },
        },
        'drift-slow': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1.05)' },
          '50%': { transform: 'translate3d(-3%, 3%, 0) scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        drift: 'drift 18s ease-in-out infinite',
        'drift-slow': 'drift-slow 24s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
