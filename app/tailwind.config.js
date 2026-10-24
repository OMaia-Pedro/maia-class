/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#FBFBFC',
          dark: '#121214',
          gridLight: '#E2E8F0',
          gridDark: '#27272A',
        }
      }
    },
  },
  plugins: [],
}
