/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
        },
      },
    },
  },
  plugins: [],
}
