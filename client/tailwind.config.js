/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fcf9f7",
        foreground: "#322026",
        card: { DEFAULT: "#ffffff", foreground: "#322026" },
        primary: { DEFAULT: "#b8586c", foreground: "#fcf9f7" },
        plum: "#561d33",
        blush: "#f3dadf",
        secondary: { DEFAULT: "#f4ebea", foreground: "#561d33" },
        muted: { DEFAULT: "#f7f3f1", foreground: "#7c636c" },
        border: "#ebdcd9",
        input: "#ebdcd9",
        ring: "#b8586c",
      },
      fontFamily: {
        display: ["Fraunces", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(80, 20, 60, 0.05), 0 8px 32px -8px rgba(180, 80, 120, 0.12)",
        glow: "0 20px 40px -15px rgba(184, 88, 108, 0.25)",
      },
      backgroundImage: {
        "gradient-warm": "linear-gradient(135deg, #fcf5f0 0%, #f7e6e8 100%)",
        "gradient-primary": "linear-gradient(135deg, #b8586c 0%, #561d33 100%)",
      },
      borderRadius: {
        lg: "0.875rem",
        md: "calc(0.875rem - 2px)",
        sm: "calc(0.875rem - 4px)",
      },
    },
  },
  plugins: [],
}