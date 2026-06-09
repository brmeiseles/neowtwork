export const designSystem = {
  colors: {
    ash: "#120e0c",
    pitch: "#070504",
    void: "#030201",
    blood: "#5c1112",
    burgundy: "#2a0d10",
    ember: "#d8732c",
    emberBright: "#f29a45",
    brass: "#caa25a",
    antiqueGold: "#d7b56d",
    tarnishedGold: "#7a5b2b",
    parchment: "#f4dfb8",
    darkParchment: "#2a2118",
    bone: "#dbc89d",
    soot: "#211816",
    charcoal: "#17110f",
    cardHover: "#302018",
    scorch: "#0d0706",
  },
  typography: {
    fontFamily: {
      display: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
      body: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
    },
    letterSpacing: {
      ritual: "0.34em",
      title: "0.04em",
    },
  },
  spacing: {
    pageX: "1.25rem",
    pageY: "2rem",
    shellMax: "72rem",
    sectionGap: "2rem",
    cardPadding: "1.35rem",
  },
  shadows: {
    card:
      "0 22px 54px rgba(0, 0, 0, 0.58), inset 0 1px 0 rgba(244, 223, 184, 0.08)",
    codex:
      "0 0 0 1px rgba(202, 162, 90, 0.18), 0 20px 42px rgba(0, 0, 0, 0.48), inset 0 0 32px rgba(92, 17, 18, 0.22)",
    ember:
      "0 0 20px rgba(216, 115, 44, 0.34), 0 0 44px rgba(92, 17, 18, 0.22)",
    badge:
      "0 0 0 3px rgba(0, 0, 0, 0.35), 0 10px 24px rgba(0, 0, 0, 0.46), inset 0 2px 8px rgba(244, 223, 184, 0.12)",
  },
  radii: {
    card: "0.625rem",
    badge: "9999px",
  },
  borders: {
    codex: "1px solid rgba(202, 162, 90, 0.28)",
    scorched: "1px solid rgba(122, 91, 43, 0.54)",
  },
} as const;
