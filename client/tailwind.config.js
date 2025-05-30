/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: "#14C38E",
        secondary: "#E8E8E8",
      }
    },
  },
  plugins: [],
}

