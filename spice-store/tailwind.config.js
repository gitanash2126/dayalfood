/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D97706",
        secondary: "#B45309",
        accent: "#DC2626",
        cream: "#FFFBEB",
        warm: "#FEF3C7",
        dark: "#1C1917",
        success: "#16A34A",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
