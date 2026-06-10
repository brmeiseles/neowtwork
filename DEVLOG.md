# DEVLOG.md

## 2026-06-10 - Fixed Production Supabase Env Detection

### Version

- `1.0.3`

### Feature Summary

- Fixed production Supabase detection so Vercel runtime env can clear the dormant backend banner.

### What Changed

- Changed `AuthPanel` to receive Supabase public env from the server-rendered app shell.
- Kept the exact expected variable names: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Forced the homepage to render dynamically so Vercel reads runtime env instead of relying on a stale static/client bundle.
- Added safe boolean-only dormant diagnostics: URL configured/missing and key configured/missing.
- Documented Vercel env troubleshooting in `README.md`.
- Bumped the app version to `1.0.3` as a PATCH production-auth fix.

### Why It Changed

- Production kept showing the dormant backend banner even after Vercel env vars were added. The app's previous client-side env check depended on build-time `NEXT_PUBLIC_*` substitution, which can stay stale if a production deployment was built without those values or served from a cached/static bundle.

### Files Touched

- `AGENTS.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `README.md`
- `VERSION.md`
- `app/page.tsx`
- `components/AppShell.tsx`
- `components/AuthPanel.tsx`
- `config/app.ts`
- `lib/env.ts`
- `lib/supabase/client.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Confirmed build output marks `/` as dynamic, so the homepage reads server runtime env instead of being statically frozen.
- Ran `npm run dev` with `.env.local`.
- Confirmed local homepage no longer shows the dormant banner, shows `@brando_prime`/`Sign out` from the live Supabase session, renders 12 cards, shows `v1.0.3`, and has no browser console errors.
- Confirmed missing-env fallback remains in code and now reports only non-secret boolean-style diagnostics.
- Production should clear the dormant banner after this push/redeploy if Vercel has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set for the deployed environment.

### Commit

- To be recorded after push, if available.

## 2026-06-10 - Connected And Verified Supabase Auth

### Version

- `1.0.2`

### Feature Summary

- Connected Neowtwork to the live Supabase project and verified Discord OAuth through the first public profile.

### What Changed

- Added local-only `.env.local` values for the Supabase project URL and publishable key.
- Applied `202606100001_backend_foundation.sql` to remote Supabase project `kdeslyohpjicuczgfnny`.
- Ran `supabase/seed.sql` against the remote database to insert the 12 achievement rows.
- Verified the remote `proofs` Storage bucket exists.
- Verified Discord OAuth created the first Supabase auth user.
- Created and verified the first live public profile at `@brando_prime`.
- Updated version and continuity docs to reflect the live Supabase/auth checkpoint.

### Why It Changed

- The backend foundation moved from code-only scaffolding to a live Supabase project with schema, policies, storage bucket, achievement data, Discord auth, and a public profile in place.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `.gitignore`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Applied the remote Supabase migration successfully.
- Seeded 12 remote achievement rows.
- Queried remote counts after setup: 12 achievements, 0 profiles, 0 completions, 0 friends, 1 `proofs` bucket.
- Ran `npm run dev` with `.env.local`; homepage shows `Sign in with Discord`, hides the dormant backend message, renders 12 achievement cards, and has no browser console errors.
- Confirmed `/u/test-slayer` now uses live Supabase and returns not found because no profile exists yet.
- Verified Discord OAuth login creates a Supabase auth user.
- Created `@brando_prime` profile in Supabase after Codex browser text entry was blocked by unavailable virtual clipboard.
- Reloaded the logged-in app and confirmed it displays `@brando_prime` with no console errors.
- Confirmed `/u/brando_prime` renders the live public board with 12 achievements and no console errors.
- Queried remote counts after auth/profile verification: 1 auth user, 1 profile, 12 achievements, 0 completions, 0 friends.
- Ran `npm run build`.
- Ran `npm run typecheck`.
- Note: an initial parallel typecheck/build attempt hit the known transient `.next/types` race while build regenerated route types; rerunning typecheck by itself passed cleanly.
- Browser-driven first-login username form typing still needs a manual/user-browser check outside Codex automation because the in-app browser text entry path is blocked.

### Commit

- `36c5a47`

## 2026-06-10 - Phase 1 Backend Foundation

### Version

- `1.0.0`

### Feature Summary

- Added the Supabase + Discord OAuth backend foundation, public profile scaffolding, and backend-ready completion model.

### What Changed

- Installed `@supabase/supabase-js` and `@supabase/ssr`.
- Added `.env.example`, public env helpers, and reusable Supabase browser/server clients.
- Added typed database shape for `profiles`, `achievements`, `completions`, and `friends`.
- Added Supabase SQL migration for tables, indexes, timestamps, RLS policies, and the `proofs` storage bucket.
- Added seed SQL for the current 12 achievements.
- Added Discord auth UI scaffolding with sign-in, sign-out, auth state, missing-env handling, and username onboarding.
- Added `/auth/callback` route for Supabase OAuth session exchange.
- Added public read-only board route at `/u/[username]`.
- Refactored local completion state to support multiple completions per achievement.
- Updated completion UX so collapsed cards show only the best ascension, seed is optional, ascension range is `0-10`, and detail modals show all completions with local add/edit/delete controls.
- Updated README with manual Supabase, Discord OAuth, redirect URL, migration, seed, and storage setup steps.
- Updated `BACKLOG.md`, `CURRENT_STATE.md`, and version references for the backend milestone.

### Why It Changed

- Neowtwork needs persistent accounts, public boards, proof storage, and future friend/social features without rushing external credential setup or pretending auth is fully verified before Supabase exists.

### Files Touched

- `.env.example`
- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `README.md`
- `VERSION.md`
- `app/auth/callback/route.ts`
- `app/u/[username]/page.tsx`
- `components/AchievementBoard.tsx`
- `components/AchievementCompletionDialog.tsx`
- `components/AchievementDetailDialog.tsx`
- `components/AppShell.tsx`
- `components/AuthPanel.tsx`
- `components/PublicAchievementBoard.tsx`
- `config/app.ts`
- `docs/backend-foundation.md`
- `lib/env.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/username.ts`
- `package.json`
- `package-lock.json`
- `supabase/migrations/202606100001_backend_foundation.sql`
- `supabase/seed.sql`
- `types/completion.ts`
- `types/database.ts`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev`.
- Confirmed homepage renders 12 achievement cards, the missing-env backend dormant state, visible `Neowtwork v1.0.0`, no horizontal overflow, and no browser console errors.
- Confirmed `/u/test-slayer` renders the public read-only board placeholder with 12 achievements, missing-env setup guidance, no horizontal overflow, and no browser console errors.
- Confirmed `/auth/callback` responds with a safe redirect when no OAuth code is present.
- Confirmed installed Supabase packages: `@supabase/ssr@0.12.0` and `@supabase/supabase-js@2.108.1`.
- Full Discord OAuth, username uniqueness against live data, Supabase persistence, and Storage upload verification remain manual until Brandon creates the Supabase project, configures Discord OAuth, and adds real env vars.

### Commit

- `5d5d287`

## 2026-06-09 - Immediate Polish Pass

### Version

- `0.2.4`

### Feature Summary

- Tightened the achievement board into a denser collectible codex and cleaned up completed-card presentation.

### What Changed

- Reduced page, hero, board, card, and grid spacing for a more game-like information density.
- Tightened achievement title, subtitle, divider, and description spacing while preserving readability.
- Added circular clipping and refined framing for canonical achievement emblems.
- Removed seed text and copy action from collapsed completed cards; seed remains in the detail modal.
- Refined completed-card metadata to emphasize ascension without changing card size.
- Softened hover motion while strengthening tactile border/glow feedback.
- Added `app/icon.svg` as a circular glowing Neowtwork favicon.
- Moved completed Immediate Polish backlog items into this devlog checkpoint and bumped the app version to `0.2.4`.

### Why It Changed

- The app needed to feel less like a roomy prototype and more like a tight, premium achievement codex without changing the core local completion flow.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/globals.css`
- `app/icon.svg`
- `app/page.tsx`
- `components/AchievementBoard.tsx`
- `components/AchievementCard.tsx`
- `components/AchievementDetailDialog.tsx`
- `components/AppShell.tsx`
- `config/app.ts`
- `lib/design-system.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev` and confirmed `localhost:3000` serves the app without runtime console errors.
- Confirmed desktop layout renders 12 cards, 12 circular emblem clips, the `/icon.svg` favicon link, no horizontal overflow, and the visible `Neowtwork v0.2.4` footer.
- Confirmed mobile-sized layout remains one column with no horizontal overflow.
- Confirmed `/icon.svg` returns `200 OK` as `image/svg+xml`.
- Captured and reviewed a local headless Chrome screenshot of the polished board.
- Note: the in-app browser connector could not complete a typed form smoke test because its virtual clipboard was unavailable; the collapsed card seed removal is covered by typecheck/build and direct component review.

### Commit

- `01baab5`

## 2026-06-09 - Added Product Backlog

### Version

- `0.2.3`

### Feature Summary

- Added a lightweight AI-native product backlog for future Neowtwork planning.

### What Changed

- Created `BACKLOG.md` with rules for maintaining backlog items over time.
- Organized future work into immediate polish, completion system, achievement list, backend/accounts, friends/social, analytics, delight/endgame, and icebox sections.
- Bumped the app version to `0.2.3` as a PATCH documentation/planning checkpoint.

### Why It Changed

- The project needed a clear place to preserve next-step product decisions and keep future Codex sessions aligned.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `DEVLOG.md`
- `VERSION.md`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run build`.
- Ran `npm run typecheck`.
- Note: an initial parallel typecheck/build attempt hit a transient `.next/types` race while build regenerated route types; rerunning typecheck by itself passed cleanly.

### Commit

- `e56a7d2`

## 2026-06-09 - Kreon Typography And Canonical Emblems

### Version

- `0.2.2`

### Feature Summary

- Added Kreon typography, canonical achievement emblem assets, and a continuity handoff file.

### What Changed

- Added Kreon from Google Fonts through `next/font/google` and made it the primary app font.
- Cropped the provided achievement screenshot into canonical emblem assets under `public/achievement-emblems/`.
- Added `emblemSrc` to achievement data and rendered canonical emblems on cards and detail modals.
- Locked achievements now show muted/darkened emblem art; completed achievements show full-color emblem art with brighter styling.
- Kept proof screenshots only inside the completed achievement detail modal.
- Added `CURRENT_STATE.md` for future session continuity.
- Bumped the app version to `0.2.2` as a PATCH polish/continuity checkpoint.

### Why It Changed

- The project needed stronger visual identity, canonical badge artwork, and a clear handoff document for the next work session.

### Files Touched

- `AGENTS.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/globals.css`
- `app/layout.tsx`
- `components/AchievementCard.tsx`
- `components/AchievementDetailDialog.tsx`
- `config/app.ts`
- `data/achievements.ts`
- `lib/design-system.ts`
- `package.json`
- `package-lock.json`
- `public/achievement-emblems/*`
- `types/achievement.ts`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Confirmed `localhost:3000` renders 12 achievement cards, 12 canonical emblem images, the Kreon primary font, and the visible `Neowtwork v0.2.2` footer.
- Captured and reviewed a local screenshot of the updated board.
- Completed a temporary achievement through the UI to confirm completed cards keep the same height, switch to full-color emblem treatment, show seed/ascension metadata, and can be reset cleanly.

### Commit

- `289306e`

## 2026-06-09 - Clickable Achievement Cards

### Version

- `0.2.1`

### Feature Summary

- Made the entire achievement card clickable for completion/viewing.

### What Changed

- Removed the visible Complete Achievement button from incomplete cards.
- Made incomplete cards open the completion modal when the card itself is clicked.
- Kept completed cards clickable for the detail modal.
- Preserved keyboard access with Enter/Space on focused cards.
- Kept the completed-card copy seed button working without triggering the card click.

### Why It Changed

- The previous Complete button was too easy to miss visually, especially near card edges. The whole card now behaves like the intended action surface.

### Files Touched

- `AGENTS.md`
- `DEVLOG.md`
- `VERSION.md`
- `components/AchievementCard.tsx`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Confirmed `localhost:3000` renders 12 card-level completion targets, no visible card-level Complete Achievement buttons, and the visible `Neowtwork v0.2.1` footer.
- Tested in headless Chrome that clicking an incomplete achievement card opens the completion modal.

### Commit

- `e742f84`

## 2026-06-09 - Completed Achievement State

### Version

- `0.2.0`

### Feature Summary

- Added the first local-only achievement completion and proof-viewing flow.

### What Changed

- Added localStorage-backed achievement completion data.
- Added a Complete Achievement modal with proof image upload, paste support, proof image URL capture, seed input, and ascension input.
- Added completed-card states that keep achievements in place, show an unlocked canonical badge placeholder, display ascension/seed metadata, and include a copy seed action.
- Added a completed achievement detail modal with title, description, canonical badge, proof screenshot, seed, ascension, completion timestamp, copy seed, and reset completion.
- Added shadcn-style Dialog support and completion-specific types.
- Bumped the app version to `0.2.0` as the first MINOR feature checkpoint.

### Why It Changed

- This implements the first version of the core loop: complete achievement, attach proof, keep the canonical badge, save seed metadata, and inspect the proof locally.

### Files Touched

- `AGENTS.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/globals.css`
- `components/AchievementBoard.tsx`
- `components/AchievementCard.tsx`
- `components/AchievementCompletionDialog.tsx`
- `components/AchievementDetailDialog.tsx`
- `components/ui/dialog.tsx`
- `config/app.ts`
- `package.json`
- `package-lock.json`
- `types/completion.ts`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Confirmed `localhost:3000` renders 12 achievement cards, 12 Complete Achievement actions, the codex board, and the visible `Neowtwork v0.2.0` footer.
- Tested the completion flow locally in headless Chrome: opened the completion dialog, saved proof/seed/ascension data, viewed the completed detail modal with proof image, and reset completion successfully.
- Note: the scripted full-flow rerun hit a Chrome DevTools Protocol reconnect issue when forcing a page reload, but the underlying completion/detail/reset behaviors were verified directly.

### Commit

- `6e88d46`

## 2026-06-09 - Applied Visible Game Board Styling

### Version

- `0.1.3`

### Feature Summary

- Made the achievement board visibly more like a dark fantasy game artifact.

### What Changed

- Added a prominent parchment/stone codex frame directly around the achievement grid.
- Added dedicated global component styling for the hero slab, board frame, ornate achievement cards, and locked emblems.
- Replaced the subtle question-mark badge with a dramatic locked relic emblem.
- Strengthened background texture, card borders, gold accents, ember glows, title treatment, and depth shadows.
- Kept the same achievement text, same responsive layout, and same app behavior.

### Why It Changed

- The previous design-system patch changed tokens but did not visibly change the local page enough. This pass applies the fantasy styling directly to the rendered achievement board UI.

### Files Touched

- `AGENTS.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/globals.css`
- `app/page.tsx`
- `components/AchievementBoard.tsx`
- `components/AchievementCard.tsx`
- `config/app.ts`
- `lib/design-system.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Confirmed `localhost:3000` renders 12 achievement cards, the visible `Neowtwork v0.1.3` footer, the codex board frame, ornate achievement cards, and locked emblem styling.
- Captured and reviewed a local screenshot of the updated board.

### Commit

- `852aa2d`

## 2026-06-09 - Dark Fantasy Design System Pass

### Version

- `0.1.2`

### Feature Summary

- Tuned the visual language toward a cursed achievement board and dungeon codex.

### What Changed

- Expanded design tokens for darker parchment, burgundy, antique gold, ember glow, scorched borders, and deeper card shadows.
- Updated the layered page background with richer radial glows, subtle texture, and vignette treatment.
- Strengthened achievement card frames, title hierarchy, badge depth, and hover animation while preserving the existing layout and text.
- Bumped the app version to `0.1.2` as a PATCH visual-polish checkpoint.

### Why It Changed

- The app should feel more like a roguelike relic screen and less like a generic web dashboard, without adding new functionality yet.

### Files Touched

- `AGENTS.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/globals.css`
- `app/page.tsx`
- `components/AchievementCard.tsx`
- `components/AppShell.tsx`
- `components/ui/button.tsx`
- `config/app.ts`
- `lib/design-system.ts`
- `package.json`
- `package-lock.json`
- `tailwind.config.ts`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Confirmed the rendered homepage keeps 12 achievement cards, unchanged text content, and the visible `Neowtwork v0.1.2` footer.

### Commit

- `15e2a04`

## 2026-06-09 - Added Frontend Support Packages

### Version

- `0.1.1`

### Feature Summary

- Added shadcn/ui, lucide-react, and framer-motion support without redesigning the app.

### What Changed

- Installed `lucide-react`, `framer-motion`, and the minimal shadcn Button dependencies.
- Added shadcn configuration, a shared `cn` utility, and `components/ui/button.tsx`.
- Used a subtle lucide icon and shadcn Button treatment in the footer/version area.
- Added a gentle framer-motion entrance and hover animation to achievement cards.
- Bumped the app version to `0.1.1` as a PATCH support/polish checkpoint.

### Why It Changed

- Future UI work now has the core frontend building blocks ready while preserving the current achievement-board experience.

### Files Touched

- `components.json`
- `components/AppShell.tsx`
- `components/AchievementCard.tsx`
- `components/ui/button.tsx`
- `lib/utils.ts`
- `package.json`
- `package-lock.json`
- `config/app.ts`
- `AGENTS.md`
- `VERSION.md`
- `DEVLOG.md`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.

### Commit

- `34d8903`

## 2026-06-09 - Centralized App Branding

### Version

- `0.1.0`

### Feature Summary

- Added a single brand config so future app renames are easier.

### What Changed

- Added `config/brand.ts` for app name, short name, tagline, metadata title, metadata description, and repo name.
- Updated homepage UI, metadata, and footer branding to read from the brand config.
- Added a README note explaining where to rename the app later.

### Why It Changed

- Future renames should start in one obvious file instead of hunting through UI and metadata code.

### Files Touched

- `app/layout.tsx`
- `app/page.tsx`
- `components/AppShell.tsx`
- `config/app.ts`
- `config/brand.ts`
- `README.md`
- `DEVLOG.md`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.

### Commit

- `86552aa`

## 2026-06-09 - Foundation Architecture Pass

### Version

- `0.1.0`

### Feature Summary

- Strengthened the Neowtwork foundation without changing the core achievement-board experience.

### What Changed

- Added lightweight design-system tokens for colors, typography, spacing, shadows, glows, and border radii.
- Added a reusable application shell with future slots for navigation/profile areas and a visible version footer.
- Added `.env.example` scaffolding for future Supabase configuration without integrating Supabase.
- Expanded achievement data with stable ids, slugs, sort order, rarity, and category fields.
- Kept the current achievement card rendering focused on title and description.

### Why It Changed

- The project is now easier to extend for profile, friends, proof upload, seed sharing, and future social features while staying readable for a non-engineer owner.

### Files Touched

- `.env.example`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `components/AppShell.tsx`
- `components/AchievementBoard.tsx`
- `components/AchievementCard.tsx`
- `config/app.ts`
- `data/achievements.ts`
- `lib/design-system.ts`
- `tailwind.config.ts`
- `types/achievement.ts`
- `DEVLOG.md`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Confirmed the rendered homepage contains the title, subtitle, and visible `Neowtwork v0.1.0` footer.

### Commit

- `5a0b4d0`

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
