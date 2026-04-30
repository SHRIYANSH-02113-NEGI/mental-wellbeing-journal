/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#6366f1",
        secondary: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        background: "#0f172a",
        card: "#020617",
        surface: "#1e293b",
      },
    },
  },
  plugins: [],
};
