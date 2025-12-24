
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
