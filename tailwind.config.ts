import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 明るいカラーパレット
        light: {
          primary: "#fce7f3", // pink-100
          secondary: "#fed7d7", // red-100
          accent: "#fef3c7", // yellow-100
          background: "#f8fafc", // slate-50
          surface: "#ffffff", // white
          text: "#1f2937", // gray-800
          "text-light": "#6b7280", // gray-500
        },
        bright: {
          pink: "#f9a8d4", // pink-300
          blue: "#93c5fd", // blue-300
          green: "#86efac", // green-300
          yellow: "#fde047", // yellow-300
          purple: "#c4b5fd", // purple-300
        },
      },
      "link-card":
        "shadow-md cursor-pointer hover:shadow-md hover:scale-105 transition-transform duration-300 rounded-lg",
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    // ...
  ],
};
export default config;
