import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest:  "#1a4d36",
        emerald: "#34a960",
        "emerald-bright": "#2ecc71",
        gold:    "#c69138",
        "gold-soft": "#d4a848",
        rust:    "#c25234",
        ink:     "#0d1a12",
        "ink-2": "#2a3828",
        "ink-3": "#4a5e50",
        "ink-mute": "#7a9080",
        cream:   "#f5f0e8",
        "cream-soft": "#ede8e0",
        paper:   "#faf8f4",
        line:    "#d8d0c4",
        "line-soft": "#e8e2d8",
        "good-bg":  "#e8f5ed",
        "good-fg":  "#1a6b3f",
        "okay-bg":  "#fef3cd",
        "okay-fg":  "#7c5c00",
        honey:   "#c8902a",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans:  ["Geist", "system-ui", "sans-serif"],
        mono:  ["Geist Mono", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        "2xl": "28px",
      },
      boxShadow: {
        "1": "0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)",
        "2": "0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04)",
        "3": "0 12px 32px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06)",
      },
    },
  },
  plugins: [],
};

export default config;
