# DEVLOG.md

## 2026-06-09 - Added Semantic Versioning

### Version

- `0.1.0`

### Feature Summary

- Added semantic version tracking instructions for Neowtwork.

### What Changed

- Added `VERSION.md` with the current version and versioning philosophy.
- Updated `AGENTS.md` with current version tracking and future developer note requirements.
- Added version and feature summary fields to existing `DEVLOG.md` entries.

### Why It Changed

- Future checkpoints now have a consistent way to describe project progress with semantic versions.

### Files Touched

- `AGENTS.md`
- `DEVLOG.md`
- `VERSION.md`

### Verification Status

- Ran `npm run typecheck`.
- Typecheck completed successfully.

### Commit

- To be recorded after push, if available.

## 2026-06-09 - Added Agent Soul

### Version

- `0.1.0`

### Feature Summary

- Defined the project personality and working style for Neowtwork coding agents.

### What Changed

- Added an `Agent Soul` section to `AGENTS.md`.
- Clarified the expected personality, tone, product principles, developer note expectations, and commit/push workflow for future Neowtwork coding agents.

### Why It Changed

- The project now has clearer guidance for keeping future work playful, precise, screenshotable, social, and easy for a non-engineer owner to follow.

### Files Touched

- `AGENTS.md`
- `DEVLOG.md`

### Verification Status

- Ran `npm run typecheck`.
- Typecheck completed successfully.

### Commit

- To be recorded after push, if available.

## 2026-06-09 - Test Codex Git Workflow

### Version

- `0.1.0`

### Feature Summary

- Confirmed Codex could make, verify, commit, and push a small visible homepage change.

### What Changed

- Added a visible homepage subtitle: "Track impossible runs. Share proof. Steal seeds."

### Why It Changed

- This was a small end-to-end workflow test to confirm Codex could edit, verify, stage, commit, and push changes for the Neowtwork project.

### Files Touched

- `app/page.tsx`

### Verification Status

- Ran `npm run typecheck`.
- Typecheck completed successfully.

### Commit

- `db86267`

## 2026-06-09 - Initial Neowtwork MVP

### Version

- `0.1.0`

### Feature Summary

- Created the first working static achievement board MVP.

### What Changed

- Created the initial static Neowtwork achievement board MVP.
- Added a themed homepage, achievement board grid, reusable achievement cards, static achievement data, and shared achievement typing.
- Added Tailwind theme tokens and global dark fantasy styling.

### Why It Changed

- This established the first working version of the Neowtwork achievements page.

### Files Touched

- `README.md`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/AchievementBoard.tsx`
- `components/AchievementCard.tsx`
- `data/achievements.ts`
- `types/achievement.ts`

### Verification Status

- Project was set up as a working Next.js, TypeScript, and Tailwind CSS app.
- No specific verification command was recorded for this historical checkpoint.

### Commit

- Not recorded.
