# CURRENT_STATE.md

## Current Version

`1.0.3`

## Architecture

- Next.js app router project using TypeScript and Tailwind CSS.
- `app/page.tsx` renders the homepage shell and achievement board.
- `components/AppShell.tsx` includes the shared shell, footer, and compact auth panel area.
- `components/AuthPanel.tsx` scaffolds Discord sign-in, sign-out, auth state, and first-login username claiming.
- `components/AchievementBoard.tsx` owns local completion state and modal coordination.
- `components/AchievementCard.tsx` renders each clickable achievement card with the best ascension badge only.
- `components/AchievementCompletionDialog.tsx` handles local proof, optional seed, ascension, and notes capture.
- `components/AchievementDetailDialog.tsx` displays all completions for an achievement and supports add/edit/delete/reset locally.
- `components/PublicAchievementBoard.tsx` renders read-only public boards.
- `app/u/[username]/page.tsx` is the public read-only board route.
- `app/auth/callback/route.ts` exchanges Supabase OAuth codes after Discord login.
- `lib/supabase/client.ts` and `lib/supabase/server.ts` create browser/server Supabase clients.
- `lib/env.ts` centralizes public env handling and safe missing-env checks.
- `components/AppShell.tsx` passes server-read Supabase public env into `AuthPanel`.
- `types/database.ts` holds the current Supabase table types.
- `supabase/migrations/202606100001_backend_foundation.sql` defines database tables, RLS policies, and the `proofs` bucket.
- `supabase/seed.sql` seeds the current 12 achievements into Supabase.
- `data/achievements.ts` remains the local editable source for the current achievement list.
- `public/achievement-emblems/` contains cropped canonical emblem assets.
- `app/icon.svg` provides the App Router favicon as a circular glowing `N` relic.
- `lib/design-system.ts` and `app/globals.css` hold the dark fantasy visual system.

## Installed Libraries

- `next`, `react`, `react-dom`
- `typescript`
- `tailwindcss`, `postcss`, `autoprefixer`
- `lucide-react`
- `framer-motion`
- `@supabase/supabase-js`
- `@supabase/ssr`
- shadcn-style primitives/helpers: `@radix-ui/react-slot`, `@radix-ui/react-dialog`, `class-variance-authority`, `clsx`, `tailwind-merge`

## Current UX Decisions

- The whole achievement card is clickable.
- Incomplete cards open the Complete Achievement modal.
- Completed cards open the completed detail modal.
- Completion data still has a localStorage fallback.
- Local completions now support multiple completions per achievement.
- Collapsed completed cards show the highest ascension only.
- Seed is optional and only shown in the detail modal.
- Detail modals show all completions and local add/edit/delete controls.
- Ascension range is currently `0-10`.
- Canonical achievement emblems come from `public/achievement-emblems/`.
- Proof screenshots never replace achievement emblems.
- Proof screenshots appear only in completion/detail UI.
- Completed cards should not expand in size; prestige comes from border glow, emblem treatment, and subtle styling.
- The current board style favors denser collectible-codex spacing over roomy SaaS spacing.
- Kreon is the primary app font via `next/font/google`.

## Backend Status

- Supabase clients and env scaffolding are implemented.
- Required env vars are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Local `.env.local` is configured for Supabase project `kdeslyohpjicuczgfnny`.
- Missing env is still handled gracefully with a dormant backend message.
- Production env detection is runtime server-fed for the homepage; `app/page.tsx` is intentionally dynamic so Vercel env changes are not trapped in a stale static/client bundle.
- Discord OAuth UI and callback route are scaffolded.
- Discord OAuth has been verified against the live Supabase project.
- First-login username onboarding is scaffolded with lowercase URL-safe usernames.
- Live profile `@brando_prime` exists for the first authenticated user.
- Public read-only route `/u/[username]` exists.
- Database schema and RLS policies are documented as SQL migrations.
- Proof Storage bucket design uses bucket `proofs`.
- Remote Supabase migration `202606100001_backend_foundation.sql` has been applied.
- Remote Supabase achievement seed has inserted the current 12 achievement rows.
- Remote `proofs` bucket exists.

## Manual / Incomplete

- Proof upload to Supabase Storage is not wired into the completion form yet.
- Local completions are not synced/migrated to Supabase accounts yet.
- Browser-driven username form typing could not be automated in Codex because the in-app browser virtual clipboard was unavailable; the profile row was created directly in Supabase and verified through the app.

## Deployed Status

- No production deployment is configured in this repo.
- Local development runs with `npm run dev`, usually at `http://localhost:3000`.
- Latest verification target is local build/typecheck plus runtime smoke checks against the live Supabase project.

## Next Recommended Priorities

- Wire completion save/read to Supabase for logged-in users.
- Wire proof uploads to the `proofs` Storage bucket.
- Sync logged-in completions to Supabase while preserving local fallback/migration.
- Add friend boards after account persistence is proven.
- Replace The King's Halo achievement once the new Regent Stars candidate is chosen.
