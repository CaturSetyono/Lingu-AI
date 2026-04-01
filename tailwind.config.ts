import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Modern Neobrutalism - Calm Blue Palette
        // Primary Colors
        "nb-primary": "#1E3A8A", // Deep Blue - main, strong & dominant
        "nb-bright": "#3B82F6", // Bright Blue - highlight, main buttons
        "nb-light": "#60A5FA", // Light Blue - secondary accent
        // Neutral Colors
        "nb-white": "#FFFFFF", // Background utama
        "nb-soft-gray": "#F3F4F6", // Card background
        "nb-medium-gray": "#9CA3AF", // Text secondary
        "nb-dark": "#111827", // Text utama / Dark gray
        // Dark mode colors
        "nb-dark-bg": "#0F172A", // Dark background (deep indigo)
        "nb-dark-surface": "#1E293B", // Dark card surface (deeper slate)
        "nb-dark-text": "#F1F5F9", // Light text untuk dark mode
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
        nb: "12px", // Medium-large rounded corners (neobrutalism playful)
        "nb-sm": "6px", // Small rounded
        "nb-lg": "20px", // Large rounded corners for cards
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
