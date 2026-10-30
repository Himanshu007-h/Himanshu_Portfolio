/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: { 950: '#05070d', 900: '#080c16', 800: '#0d1424', 700: '#141d33' },
        cyanx: { 300: '#7fe7ff', 400: '#38d4f5', 500: '#12b5da' },
        violetx: { 400: '#9b8cff', 500: '#7c6cff' },
        amberx: { 400: '#ffc857' },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(56,212,245,0.45)',
        panel: '0 30px 80px -30px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins: [],
}
