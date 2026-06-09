import type { Config } from "tailwindcss";
import { designSystem } from "./lib/design-system";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...designSystem.colors,
      },
      boxShadow: {
        ...designSystem.shadows,
      },
      borderRadius: {
        ...designSystem.radii,
      },
      fontFamily: {
        display: [...designSystem.typography.fontFamily.display],
        body: [...designSystem.typography.fontFamily.body],
      },
      letterSpacing: {
        ...designSystem.typography.letterSpacing,
      },
      maxWidth: {
        shell: designSystem.spacing.shellMax,
      },
      padding: {
        "shell-x": designSystem.spacing.pageX,
        "shell-y": designSystem.spacing.pageY,
        card: designSystem.spacing.cardPadding,
      },
      gap: {
        section: designSystem.spacing.sectionGap,
      },
    },
  },
  plugins: [],
};

export default config;
