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
      backgroundImage: {
        "card-parchment":
          "linear-gradient(145deg, rgba(42, 33, 24, 0.96), rgba(23, 17, 15, 0.96) 44%, rgba(42, 13, 16, 0.72))",
        "badge-relic":
          "radial-gradient(circle at 32% 24%, rgba(244, 223, 184, 0.2), transparent 30%), linear-gradient(145deg, #2a2118, #070504 68%)",
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
