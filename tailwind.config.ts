import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        "bg-base":      "var(--bg-base)",
        "bg-sidebar":   "var(--bg-sidebar)",
        "bg-card":      "var(--bg-card)",
        "bg-card-dark": "var(--bg-card-dark)",
        "bg-input":     "var(--bg-input)",

        // Surfaces
        "surface-low": "var(--surface-low)",
        "surface-mid": "var(--surface-mid)",
        "surface-lg":  "var(--surface-lg)",

        // Brand / Accent
        "accent-mint":      "var(--accent-mint)",
        "accent-green":     "var(--accent-green)",
        "accent-green-alt": "var(--accent-green-alt)",

        // Text
        "text-primary":   "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted":     "var(--text-muted)",
        "text-dimmed":    "var(--text-dimmed)",

        // Status
        "status-success": "var(--status-success)",
        "status-warning": "var(--status-warning)",
        "status-error":   "var(--status-error)",

        // Borders
        "border-subtle":  "var(--border-subtle)",
        "border-default": "var(--border-default)",
        "border-mid":     "var(--border-mid)",
        "border-high":    "var(--border-high)",
        "border-mint":    "var(--border-mint)",

        // UI accents
        "color-badge":    "var(--color-badge)",
        "color-avatar-1": "var(--color-avatar-1)",
        "color-avatar-2": "var(--color-avatar-2)",
      },

      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Courier New", "monospace"],
      },

      spacing: {
        xs:  "var(--space-xs)",
        sm:  "var(--space-sm)",
        md:  "var(--space-md)",
        lg:  "var(--space-lg)",
        xl:  "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
      },

      borderRadius: {
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)",
        full: "var(--radius-full)",
      },
    },
  },
  plugins: [],
};

export default config;
