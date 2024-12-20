/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./node_modules/flowbite/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    colors:{
      bgDark: "#111111",
      bgCard: "#1C1C1E",
      bgStroke: "#2D2D2D",
      bgText: "#C0C0C0",


    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
],
}