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
        // サイト全体で使用する4色のカラーパレット
        brand: {
          // プライマリカラー（深いピンク - ブランド色）
          primary: "#db2777",
          // セカンダリカラー（深い緑 - アクション）
          secondary: "#16a34a", 
          // ダークグレー（テキスト・影）
          dark: "#1e293b",
          // ライトグレー（背景）
          light: "#f8fafc",
        },
        // 互換性のための既存カラーマッピング
        theater: {
          primary: {
            50: "#fdf2f8",
            100: "#fce7f3",
            200: "#fbcfe8",
            300: "#f9a8d4",
            400: "#f472b6",
            500: "#db2777",
            600: "#db2777",
            700: "#be185d",
          },
          secondary: {
            500: "#16a34a",
            600: "#16a34a",
            700: "#15803d",
          },
          neutral: {
            50: "#f8fafc",
            100: "#f1f5f9",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
          },
          accent: {
            yellow: "#fbbf24",
          }
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
