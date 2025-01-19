/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "#131313",
        accent: "#1c1c1c",
        border: "#303033",
        primary: "#8e8e8e",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
