# CURRENT_STATE.md

## Current Version

`0.2.4`

## Architecture

- Next.js app router project using TypeScript and Tailwind CSS.
- `app/page.tsx` renders the homepage shell and achievement board.
- `components/AchievementBoard.tsx` owns local completion state and modal coordination.
- `components/AchievementCard.tsx` renders each clickable achievement card.
- `components/AchievementCompletionDialog.tsx` handles local proof, seed, and ascension capture.
- `components/AchievementDetailDialog.tsx` displays completed achievement proof and reset controls.
- `data/achievements.ts` contains achievement content and canonical emblem paths.
- `public/achievement-emblems/` contains cropped canonical emblem assets from the provided achievement screenshot.
- `app/icon.svg` provides the App Router favicon as a circular glowing `N` relic.
- `lib/design-system.ts` and `app/globals.css` hold the dark fantasy visual system.

## Installed Libraries

- `next`, `react`, `react-dom`
- `typescript`
- `tailwindcss`, `postcss`, `autoprefixer`
- `lucide-react`
- `framer-motion`
- shadcn-style primitives/helpers: `@radix-ui/react-slot`, `@radix-ui/react-dialog`, `class-variance-authority`, `clsx`, `tailwind-merge`

## Current UX Decisions

- The whole achievement card is clickable.
- Incomplete cards open the Complete Achievement modal.
- Completed cards open the completed detail modal.
- Canonical achievement emblems come from `public/achievement-emblems/`.
- Locked achievements show muted/darkened emblem art with subdued lock treatment.
- Completed achievements show full-color emblem art with brighter border/glow.
- Achievement emblems are clipped into circular relic frames in the UI.
- Proof screenshots never replace achievement emblems; proof images only appear in the completed detail modal.
- Completion data is local-only and stored in `localStorage`.
- Completed cards should not expand in size; prestige comes from border glow, emblem treatment, and subtle styling.
- Collapsed completed cards show ascension status only; seed values stay in the detail modal.
- The current board style favors denser collectible-codex spacing over roomy SaaS spacing.
- Kreon is the primary app font via `next/font/google`.

## Deployed Status

- No production deployment is configured in this repo.
- Local development runs with `npm run dev`, usually at `http://localhost:3000`.
- Latest verification target is local build/typecheck plus local UI smoke checks.

## Next Recommended Priorities

- Improve the proof form ergonomics and error states.
- Add small toast/feedback for copied seeds.
- Start the multiple-completions model when the local single-completion loop feels stable.
- Review cropped emblem assets and regenerate if cleaner transparent cutouts are desired.
- Keep backend/auth/friends/uploads deferred until the local proof loop feels right.
