export const designSystem = {
  colors: {
    ash: "#100d0b",
    pitch: "#080605",
    blood: "#5c1112",
    ember: "#d8732c",
    brass: "#caa25a",
    parchment: "#f4dfb8",
    bone: "#dbc89d",
    soot: "#211816",
    cardHover: "#281b17",
  },
  typography: {
    fontFamily: {
      display: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
      body: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
    },
    letterSpacing: {
      ritual: "0.34em",
    },
  },
  spacing: {
    pageX: "1.25rem",
    pageY: "2rem",
    shellMax: "72rem",
    sectionGap: "2rem",
    cardPadding: "1.25rem",
  },
  shadows: {
    card: "0 18px 50px rgba(0, 0, 0, 0.45)",
    ember: "0 0 24px rgba(216, 115, 44, 0.26)",
  },
  radii: {
    card: "0.5rem",
    badge: "9999px",
  },
} as const;
