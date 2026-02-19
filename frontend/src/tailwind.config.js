/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        song: ['Song Myung', 'serif'],
        corinthia: ['Corinthia', 'cursive'],
      },
      colors: {
        'docent-bg': '#F3F3F3', // 피그마 배경색
      },
    },
  },
  plugins: [],
};