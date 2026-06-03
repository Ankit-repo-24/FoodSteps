/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class", // enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: "hsl(260, 70%, 50%)",
        secondary: "hsl(260, 40%, 90%)",
        accent: "hsl(45, 90%, 55%)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px"
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "spin-slow": "spin-slow 20s linear infinite"
      },
      keyframes: {
        fadeIn: {
          "from": { opacity: "0" },
          "to": { opacity: "1" }
        },
        "spin-slow": {
          "from": { transform: "rotate(0deg)" },
          "to": { transform: "rotate(360deg)" }
        }
      }
    }
  },
  plugins: []
};
