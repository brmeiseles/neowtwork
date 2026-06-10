# CURRENT_STATE.md

## Current Version

`1.2.1`

## Architecture

- Next.js app router project using TypeScript and Tailwind CSS.
- `app/page.tsx` renders the homepage shell and achievement board.
- `components/AppShell.tsx` includes the shared shell, footer, and compact auth panel area.
- `components/AuthPanel.tsx` scaffolds Discord sign-in, sign-out, auth state, and first-login username claiming.
- `components/FriendsPanel.tsx` renders the compact authenticated Friends dropdown for adding friends and opening friend boards.
- `components/AchievementBoard.tsx` owns completion state, Supabase save/load coordination, localStorage fallback, and modal coordination.
- `components/AchievementCard.tsx` renders each clickable achievement card with the best ascension badge only.
- `components/AchievementCompletionDialog.tsx` handles local proof, optional seed, ascension, and notes capture.
- `components/AchievementDetailDialog.tsx` displays all completions for an achievement and supports add/edit/delete/reset.
- `components/PublicAchievementBoard.tsx` renders read-only public boards.
- `components/PublicAchievementBoard.tsx` supports read-only completed-achievement detail modals with copyable seeds.
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
- Logged-in completion data saves to Supabase; logged-out completion data still uses localStorage.
- Local completions now support multiple completions per achievement.
- Collapsed completed cards show the highest ascension only.
- Seed is optional and only shown in the detail modal.
- Detail modals show all completions and add/edit/delete controls.
- Ascension range is currently `0-10`.
- Canonical achievement emblems come from `public/achievement-emblems/`.
- Locked achievements intentionally do not render canonical emblem art; they show an empty dark circular frame with a lock.
- Completed achievements render canonical emblem art inside the circular frame with contained, centered cropping.
- Proof screenshots never replace achievement emblems.
- Proof screenshots appear only in completion/detail UI.
- Completed cards should not expand in size; prestige comes from border glow, emblem treatment, and subtle styling.
- The current board style favors denser collectible-codex spacing over roomy SaaS spacing.
- Kreon is the primary app font via `next/font/google`.
- Completion proof entry supports file upload and clipboard paste only; image URL entry was removed to keep the flow cleaner.
- The homepage board header is `Slay the Spire 2 Achievements`; the app/brand name remains `Neowtwork`.
- Friends access lives in the authenticated top-bar account block, not the main achievement board body.
- Logged-out users do not see Friends UI.

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
- Logged-in users load their own completions from Supabase.
- Logged-in completion saves insert rows into `public.completions`.
- Proof screenshots upload to Supabase Storage bucket `proofs` under the signed-in user's folder before the completion row is created.
- Public boards at `/u/[username]` read Supabase completions in read-only mode.
- Completion edit/delete/reset is wired for Supabase rows and still respects user ownership through RLS.
- Friends use the existing Supabase `friends` table.
- Users can add friends by username, cannot add themselves, and duplicate/unknown usernames are rejected.
- Friend rows link to `/u/[username]`.
- `/u/[username]` renders owner controls only when the signed-in user is viewing their own board; other boards are read-only.
- Auth/profile loading keeps a fixed-height intermediate panel instead of flashing the username onboarding form during session refresh.
- Friends load only after the logged-in profile is resolved and only inside the compact dropdown, avoiding empty-state flashes in the page body.

## Manual / Incomplete

- Local completions are not synced/migrated to Supabase accounts yet.
- Deleted or replaced Supabase proof screenshots are not cleaned up from Storage yet.
- Browser-driven username form typing could not be automated in Codex because the in-app browser virtual clipboard was unavailable; the profile row was created directly in Supabase and verified through the app.

## Deployed Status

- Production is deployed on Vercel for the `main` branch.
- Local development runs with `npm run dev`, usually at `http://localhost:3000`.
- Latest verification target is local build/typecheck plus runtime smoke checks against the live Supabase project.
- Production spacing is driven by the committed source CSS in `app/globals.css`, shared layout spacing in `components/AppShell.tsx`, and Tailwind tokens in `lib/design-system.ts`.

## Next Recommended Priorities

- Sync existing localStorage completions into a logged-in account with clear conflict handling.
- Clean up old proof Storage objects when completions are deleted or proof images are replaced.
- Add richer profile sharing polish for Discord/Reddit.
- Replace The King's Halo achievement once the new Regent Stars candidate is chosen.
