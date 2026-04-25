/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 45px rgba(31, 41, 55, 0.14)"
      },
      keyframes: {
        wheelSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(1440deg)" }
        },
        pop: {
          "0%": { transform: "scale(.94)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        "wheel-spin": "wheelSpin 1.5s cubic-bezier(.12,.75,.18,1) both",
        pop: "pop .28s ease-out both",
        floaty: "floaty 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
