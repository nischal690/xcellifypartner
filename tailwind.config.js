/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        dmsans: ["DM Sans", "sans-serif"],
      },
      colors:{
        "blue-primary":" #19074A",
        "purple-primary":"#876FFD",
        "purple-disabled":"#c0b4fe",
      }
    },
  },
  plugins: [],
}