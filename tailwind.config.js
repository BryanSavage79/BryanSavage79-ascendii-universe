/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './docs/**/*.{html,js}',
    './src/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FFD700',
          500: '#EAB308',
          600: '#CA8A04',
        },
        navy: {
          900: '#0A0F1E',
        }
      }
    }
  },
  plugins: [],
}
