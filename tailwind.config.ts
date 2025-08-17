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
        // 統一されたカラーパレット
        theater: {
          // プライマリカラー（ピンク系 - ブランド色）
          primary: {
            50: "#fdf2f8",
            100: "#fce7f3",
            200: "#fbcfe8",
            300: "#f9a8d4",
            400: "#f472b6",
            500: "#ec4899",
            600: "#db2777",
            700: "#be185d",
            800: "#9f1239",
            900: "#881337",
          },
          // セカンダリカラー（緑系 - アクション）
          secondary: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
          },
          // ニュートラルカラー（グレー系）
          neutral: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
          },
          // アクセントカラー
          accent: {
            blue: "#3b82f6",
            yellow: "#fbbf24",
            red: "#ef4444",
            purple: "#a855f7",
          }
        },
        // 互換性のための旧カラー（段階的に削除予定）
        light: {
          primary: "#fce7f3",
          secondary: "#dcfce7",
          accent: "#fef3c7",
          background: "#f8fafc",
          surface: "#ffffff",
          text: "#1e293b",
          "text-light": "#64748b",
        },
        bright: {
          pink: "#f9a8d4",
          blue: "#93c5fd",
          green: "#86efac",
          yellow: "#fde047",
          purple: "#c4b5fd",
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
