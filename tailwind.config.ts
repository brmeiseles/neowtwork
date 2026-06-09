import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ash: "#100d0b",
        pitch: "#080605",
        blood: "#5c1112",
        ember: "#d8732c",
        brass: "#caa25a",
        parchment: "#f4dfb8",
        bone: "#dbc89d",
        soot: "#211816",
      },
      boxShadow: {
        card: "0 18px 50px rgba(0, 0, 0, 0.45)",
        ember: "0 0 24px rgba(216, 115, 44, 0.26)",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
