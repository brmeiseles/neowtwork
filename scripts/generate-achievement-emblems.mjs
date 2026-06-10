import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUTPUT_DIR = path.join(process.cwd(), "public", "achievement-emblems");

const palette = {
  bone: "#f4dfb8",
  brass: "#d7b56d",
  ember: "#f29a45",
  emberDark: "#d8732c",
  pitch: "#090504",
  soot: "#17100e",
  blood: "#8b1f21",
  red: "#db4a44",
  blue: "#65d9f2",
  cyan: "#9df6ff",
  green: "#69d66d",
  purple: "#a45ce8",
  gold: "#ffd66e",
  steel: "#a9c4cf",
};

const achievements = [
  {
    slug: "basic-training",
    accent: palette.emberDark,
    glyph: `
      <g transform="translate(256 258) rotate(44)">
        <path d="M-24 -168 L38 -168 L22 52 L-8 92 L-38 52 Z" fill="${palette.steel}" stroke="${palette.bone}" stroke-width="14" stroke-linejoin="round"/>
        <path d="M8 -138 L22 -138 L12 35 L2 55 Z" fill="${palette.cyan}" opacity=".75"/>
        <rect x="-74" y="70" width="148" height="28" rx="12" fill="${palette.gold}" stroke="${palette.pitch}" stroke-width="10"/>
        <circle cx="0" cy="96" r="28" fill="${palette.ember}" stroke="${palette.pitch}" stroke-width="10"/>
        <path d="M0 112 L0 170" stroke="${palette.steel}" stroke-width="22" stroke-linecap="round"/>
      </g>
    `,
  },
  {
    slug: "this-feels-personal",
    accent: palette.red,
    glyph: `
      <g transform="translate(256 246)">
        <circle r="112" fill="${palette.red}" stroke="${palette.pitch}" stroke-width="18"/>
        <path d="M-72 -12 Q-38 -46 -4 -12 Q-38 10 -72 -12 Z M72 -12 Q38 -46 4 -12 Q38 10 72 -12 Z" fill="${palette.pitch}"/>
        <path d="M-42 56 Q0 90 42 56" fill="none" stroke="${palette.pitch}" stroke-width="18" stroke-linecap="round"/>
        <path d="M-18 24 L0 -4 L18 24 Z" fill="${palette.pitch}"/>
        <path d="M-124 110 L-124 178 M124 110 L124 178" stroke="${palette.ember}" stroke-width="24" stroke-linecap="round"/>
        <path d="M-154 148 L-124 184 L-94 148 M94 148 L124 184 L154 148" fill="none" stroke="${palette.ember}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    `,
  },
  {
    slug: "terms-and-conditions-apply",
    accent: palette.blue,
    glyph: `
      <g transform="translate(256 256)">
        <circle r="126" fill="none" stroke="${palette.blue}" stroke-width="22" stroke-dasharray="34 20"/>
        <circle r="95" fill="${palette.soot}" stroke="${palette.cyan}" stroke-width="12"/>
        <text x="0" y="34" text-anchor="middle" font-family="Georgia, serif" font-size="108" font-weight="900" fill="${palette.bone}">10+</text>
        <path d="M-156 -6 Q-190 28 -166 70 M156 6 Q190 -28 166 -70" fill="none" stroke="${palette.cyan}" stroke-width="18" stroke-linecap="round"/>
      </g>
    `,
  },
  {
    slug: "walk-it-off",
    accent: palette.blue,
    glyph: `
      <g transform="translate(256 260)">
        <path d="M-104 -126 L104 -126 L84 56 Q52 118 0 154 Q-52 118 -84 56 Z" fill="${palette.blue}" stroke="${palette.pitch}" stroke-width="16" stroke-linejoin="round"/>
        <path d="M0 -94 L0 112 M-68 -80 L0 -40 L68 -80" fill="none" stroke="${palette.bone}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
        <path d="M-74 92 L74 -92" stroke="${palette.pitch}" stroke-width="26" stroke-linecap="round"/>
        <path d="M-74 92 L74 -92" stroke="${palette.ember}" stroke-width="12" stroke-linecap="round"/>
      </g>
    `,
  },
  {
    slug: "intern-economy",
    accent: palette.green,
    glyph: `
      <g transform="translate(256 256)">
        <ellipse cx="0" cy="0" rx="82" ry="132" fill="${palette.gold}" stroke="${palette.pitch}" stroke-width="18"/>
        <ellipse cx="0" cy="0" rx="46" ry="94" fill="${palette.soot}" stroke="${palette.brass}" stroke-width="12"/>
        <text x="0" y="38" text-anchor="middle" font-family="Georgia, serif" font-size="124" font-weight="900" fill="${palette.bone}">0</text>
        <g fill="${palette.green}">
          <path d="M-148 -92 L-126 -68 L-148 -44 L-170 -68 Z"/>
          <path d="M148 -92 L170 -68 L148 -44 L126 -68 Z"/>
          <path d="M-148 44 L-126 68 L-148 92 L-170 68 Z"/>
          <path d="M148 44 L170 68 L148 92 L126 68 Z"/>
        </g>
      </g>
    `,
  },
  {
    slug: "embrace-the-darkness",
    accent: palette.purple,
    glyph: `
      <g transform="translate(256 256)">
        <circle r="104" fill="${palette.pitch}" stroke="${palette.purple}" stroke-width="22"/>
        <circle r="58" fill="#000000"/>
        <path d="M-142 -22 C-92 -110 8 -150 86 -96 M142 22 C92 110 -8 150 -86 96 M-120 70 C-42 142 78 118 128 24 M120 -70 C42 -142 -78 -118 -128 -24" fill="none" stroke="${palette.purple}" stroke-width="18" stroke-linecap="round" opacity=".8"/>
      </g>
    `,
  },
  {
    slug: "shadow-government",
    accent: palette.green,
    glyph: `
      <g transform="translate(256 258)">
        <path d="M-142 -22 C-94 -108 -32 -114 0 -56 C32 -114 94 -108 142 -22 C112 84 54 124 0 86 C-54 124 -112 84 -142 -22 Z" fill="${palette.green}" stroke="${palette.pitch}" stroke-width="16" stroke-linejoin="round"/>
        <path d="M-86 -8 Q-48 -36 -16 -8 Q-50 14 -86 -8 Z M86 -8 Q48 -36 16 -8 Q50 14 86 -8 Z" fill="${palette.pitch}"/>
        <path d="M-32 52 Q0 32 32 52" fill="none" stroke="${palette.pitch}" stroke-width="14" stroke-linecap="round"/>
        <path d="M-154 -96 L-122 -72 M154 -96 L122 -72 M-154 86 L-122 62 M154 86 L122 62" stroke="${palette.green}" stroke-width="12" stroke-linecap="round"/>
      </g>
    `,
  },
  {
    slug: "the-kings-halo",
    accent: palette.gold,
    glyph: `
      <g transform="translate(256 264)">
        <g stroke="${palette.bone}" stroke-width="12" stroke-linecap="round">
          <path d="M-138 -126 L-98 30"/>
          <path d="M-46 -156 L-28 32"/>
          <path d="M46 -156 L28 32"/>
          <path d="M138 -126 L98 30"/>
        </g>
        <path d="M-144 72 L-112 -56 L-48 22 L0 -76 L48 22 L112 -56 L144 72 Z" fill="${palette.gold}" stroke="${palette.pitch}" stroke-width="16" stroke-linejoin="round"/>
        <path d="M-110 72 L110 72 L90 122 L-90 122 Z" fill="${palette.ember}" stroke="${palette.pitch}" stroke-width="12" stroke-linejoin="round"/>
        <circle cx="0" cy="22" r="18" fill="${palette.bone}"/>
      </g>
    `,
  },
  {
    slug: "mutually-assured-destruction",
    accent: palette.purple,
    glyph: `
      <g transform="translate(256 256)">
        <path d="M-104 -20 C-104 -104 -44 -142 0 -142 C44 -142 104 -104 104 -20 C104 44 64 82 28 90 L28 132 L-28 132 L-28 90 C-64 82 -104 44 -104 -20 Z" fill="${palette.purple}" stroke="${palette.pitch}" stroke-width="16" stroke-linejoin="round"/>
        <path d="M-62 -14 Q-32 -48 -2 -14 Q-34 8 -62 -14 Z M62 -14 Q32 -48 2 -14 Q34 8 62 -14 Z" fill="${palette.pitch}"/>
        <path d="M-22 42 L0 20 L22 42 Z" fill="${palette.pitch}"/>
        <path d="M-140 -94 C-60 -156 84 -150 142 -42 M140 92 C60 156 -84 150 -142 42" fill="none" stroke="${palette.purple}" stroke-width="18" stroke-linecap="round" opacity=".7"/>
      </g>
    `,
  },
  {
    slug: "junkyard-detonation",
    accent: palette.green,
    glyph: `
      <g transform="translate(256 258) rotate(-18)">
        <g fill="${palette.steel}" stroke="${palette.pitch}" stroke-width="12">
          <rect x="-122" y="-58" width="68" height="154" rx="28"/>
          <rect x="-42" y="-72" width="68" height="154" rx="28"/>
          <rect x="38" y="-54" width="68" height="154" rx="28"/>
        </g>
        <g fill="${palette.pitch}">
          <circle cx="-88" cy="-18" r="16"/>
          <circle cx="-8" cy="-32" r="16"/>
          <circle cx="72" cy="-14" r="16"/>
        </g>
        <path d="M84 8 L164 -54 L134 28 L178 42 L86 92 Z" fill="${palette.green}" stroke="${palette.pitch}" stroke-width="10" stroke-linejoin="round"/>
        <path d="M-138 96 L96 96" stroke="${palette.brass}" stroke-width="18" stroke-linecap="round"/>
      </g>
    `,
  },
  {
    slug: "prismatic-strike",
    accent: palette.cyan,
    glyph: `
      <g transform="translate(256 270)">
        <path d="M0 -154 L54 18 L0 136 L-54 18 Z" fill="${palette.green}" stroke="${palette.pitch}" stroke-width="10"/>
        <path d="M-28 -132 L-106 58 L-8 134 Z" fill="${palette.gold}" stroke="${palette.pitch}" stroke-width="10"/>
        <path d="M28 -132 L106 58 L8 134 Z" fill="${palette.blue}" stroke="${palette.pitch}" stroke-width="10"/>
        <path d="M-92 -64 L-166 96 L-66 118 Z" fill="${palette.red}" stroke="${palette.pitch}" stroke-width="10"/>
        <path d="M92 -64 L166 96 L66 118 Z" fill="${palette.purple}" stroke="${palette.pitch}" stroke-width="10"/>
        <path d="M-150 146 L150 146" stroke="${palette.bone}" stroke-width="14" stroke-linecap="round" opacity=".7"/>
      </g>
    `,
  },
  {
    slug: "hostile-takeover",
    accent: palette.gold,
    glyph: `
      <g transform="translate(256 258)">
        <path d="M-86 -96 C-24 -150 86 -122 100 -28 C110 42 70 110 0 118 C-78 112 -112 46 -100 -28 C-96 -54 -92 -76 -86 -96 Z" fill="#9aa37a" stroke="${palette.pitch}" stroke-width="16" stroke-linejoin="round"/>
        <path d="M-58 -12 Q-30 -38 -4 -12 Q-30 8 -58 -12 Z M58 -12 Q30 -38 4 -12 Q30 8 58 -12 Z" fill="${palette.pitch}"/>
        <path d="M-30 48 Q0 68 30 48" fill="none" stroke="${palette.pitch}" stroke-width="14" stroke-linecap="round"/>
        <path d="M58 98 C96 62 144 82 150 132 L66 132 Z" fill="${palette.brass}" stroke="${palette.pitch}" stroke-width="12" stroke-linejoin="round"/>
        <g fill="${palette.gold}" stroke="${palette.pitch}" stroke-width="6">
          <circle cx="-132" cy="126" r="20"/>
          <circle cx="-92" cy="146" r="18"/>
          <circle cx="-52" cy="126" r="16"/>
        </g>
      </g>
    `,
  },
];

function frame({ accent, glyph }) {
  return `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="medal" cx="36%" cy="28%" r="72%">
          <stop offset="0%" stop-color="#4a3120"/>
          <stop offset="58%" stop-color="#17100e"/>
          <stop offset="100%" stop-color="#050302"/>
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity=".55"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <circle cx="256" cy="256" r="226" fill="url(#medal)" stroke="${palette.pitch}" stroke-width="22"/>
        <circle cx="256" cy="256" r="204" fill="none" stroke="${palette.brass}" stroke-width="12"/>
        <circle cx="256" cy="256" r="176" fill="none" stroke="${accent}" stroke-width="7" opacity=".8"/>
        <path d="M112 108 C184 62 314 56 400 116" fill="none" stroke="${palette.bone}" stroke-width="10" stroke-linecap="round" opacity=".16"/>
        ${glyph}
        <g fill="${accent}" opacity=".8">
          <circle cx="118" cy="256" r="7"/>
          <circle cx="394" cy="256" r="7"/>
          <circle cx="256" cy="118" r="6"/>
          <circle cx="256" cy="394" r="6"/>
        </g>
      </g>
    </svg>
  `;
}

await mkdir(OUTPUT_DIR, { recursive: true });

await Promise.all(
  achievements.map(async (achievement) => {
    const svg = frame(achievement);
    const outputPath = path.join(OUTPUT_DIR, `${achievement.slug}.png`);

    await sharp(Buffer.from(svg)).png().resize(512, 512).toFile(outputPath);
  }),
);

console.log(`Generated ${achievements.length} achievement emblems.`);
