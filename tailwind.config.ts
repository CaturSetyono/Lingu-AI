import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neo-Brutalism color scheme
        "nb-black": "#000000",
        "nb-white": "#ffffff",
        "nb-grey": "#1a1a1a",
        "nb-accent": "#ff6b35", // Bold orange/red accent
        "nb-secondary": "#004e89", // Bold blue
        // Dark mode colors
        "nb-dark-bg": "#0a0a0a",
        "nb-dark-surface": "#1a1a1a",
        "nb-dark-text": "#f5f5f5",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Courier New", ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        "nb-xs": ["0.75rem", { lineHeight: "1rem" }],
        "nb-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "nb-base": ["1rem", { lineHeight: "1.5rem" }],
        "nb-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "nb-xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "nb-2xl": ["1.5rem", { lineHeight: "2rem" }],
        "nb-3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "nb-4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "nb-5xl": ["3rem", { lineHeight: "1" }],
      },
      fontWeight: {
        "nb-bold": "700",
        "nb-black": "900",
      },
      spacing: {
        "nb-xs": "0.5rem",
        "nb-sm": "1rem",
        "nb-md": "1.5rem",
        "nb-lg": "2rem",
        "nb-xl": "3rem",
        "nb-2xl": "4rem",
      },
      borderWidth: {
        "nb-thin": "1px",
        "nb-regular": "2px",
        "nb-thick": "4px",
        "nb-extra": "6px",
      },
      borderRadius: {
        nb: "0px", // No rounding - raw/sharp edges for brutalism
        "nb-sm": "2px",
      },
      letterSpacing: {
        "nb-tight": "-0.02em",
        "nb-normal": "0em",
        "nb-wide": "0.05em",
      },
    },
  },
  plugins: [],
} satisfies Config;
