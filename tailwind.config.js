/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Resources/app/**/*.{vue,js,ts,jsx,tsx}",
    "./Resources/views/**/*.twig"
  ],
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '80': '20rem',
        '88': '22rem',
        '96': '24rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
} 