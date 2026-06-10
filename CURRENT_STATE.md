# CURRENT_STATE.md

## Current Version

`1.3.2`

## Architecture

- Next.js app router project using TypeScript and Tailwind CSS.
- `app/page.tsx` renders the homepage shell and achievement board.
- `components/AppShell.tsx` includes the shared shell, footer, and compact auth panel area.
- `components/AnalyticsProvider.tsx` initializes optional PostHog analytics when public env vars are present.
- `components/AppHero.tsx` renders the global Neowtwork / Slay the Spire 2 Achievements hero identity.
- `components/AuthPanel.tsx` scaffolds Discord sign-in, sign-out, auth state, and automatic profile creation from Discord identity.
- `components/BoardContextPlaque.tsx` renders secondary board-owner context on public/profile boards.
- `components/FriendsPanel.tsx` renders the compact authenticated Friends dropdown for adding friends and opening friend boards.
- `components/AchievementBoard.tsx` owns completion state, Supabase save/load coordination, localStorage fallback, and modal coordination.
- `components/AchievementCard.tsx` renders each clickable achievement card with the best ascension badge only.
- `components/AchievementCompletionDialog.tsx` handles local proof, optional seed, ascension, and notes capture.
- `components/AchievementDetailDialog.tsx` displays all completions for an achievement and supports add/edit/delete/reset.
- `components/PublicAchievementBoard.tsx` renders read-only public boards.
- `components/PublicAchievementBoard.tsx` supports read-only completed-achievement detail modals with copyable seeds.
- `components/ProfileViewAnalytics.tsx` records privacy-conscious public profile board views.
- `app/u/[username]/page.tsx` is the public read-only board route.
- `app/auth/callback/route.ts` exchanges Supabase OAuth codes after Discord login.
- `lib/supabase/client.ts` and `lib/supabase/server.ts` create browser/server Supabase clients.
- `lib/env.ts` centralizes public env handling and safe missing-env checks.
- `lib/analytics.ts` centralizes explicit PostHog event capture and safely no-ops when analytics env vars are missing.
- `components/AppShell.tsx` passes server-read Supabase public env into `AuthPanel`.
- `types/database.ts` holds the current Supabase table types.
- `supabase/migrations/202606100001_backend_foundation.sql` defines database tables, RLS policies, and the `proofs` bucket.
- `supabase/seed.sql` seeds the current 12 achievements into Supabase.
- `data/achievements.ts` remains the local editable source for the current achievement list.
- `public/achievement-emblems/` contains purpose-built generated 512x512 PNG medal assets.
- `scripts/generate-achievement-emblems.mjs` is the source generator for all 12 canonical badge assets.
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
- `posthog-js`
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
- Canonical achievement emblems come from generated square PNG medals in `public/achievement-emblems/`.
- Locked achievements intentionally do not render canonical emblem art; they show an empty dark circular frame with a lock.
- Completed achievements render canonical emblem art inside the circular frame with a shared centered `object-fit: contain` treatment and no per-badge crop hacks.
- Proof screenshots never replace achievement emblems.
- Proof screenshots appear only in completion/detail UI.
- Completed cards should not expand in size; prestige comes from border glow, emblem treatment, and subtle styling.
- The current board style favors denser collectible-codex spacing over roomy SaaS spacing.
- Kreon is the primary app font via `next/font/google`.
- Completion proof entry supports file upload and clipboard paste only; image URL entry was removed to keep the flow cleaner.
- The homepage board header is `Slay the Spire 2 Achievements`; the app/brand name remains `Neowtwork`.
- The official homepage tagline is `Because Slay 2 deserves achievements.`
- The global app hero stays primary on home and public board pages; viewed board owner info is secondary contextual metadata.
- Friends access lives in the authenticated top-bar account block, not the main achievement board body.
- Friends opens on hover/focus and still supports click plus outside-click dismissal.
- Discord display names are the primary visible identity in the account panel, Friends rows, and board context plaque.
- `profiles.username` is still the stable URL slug for `/u/[username]`, but new profiles now auto-generate it from Discord identity instead of asking the user to invent one.
- Public username slugs should stay visually secondary/internal whenever possible.
- Logged-out users do not see Friends UI.
- The achievement board does not show a normal completion-loading banner; backend errors still render plainly if loading fails.
- Analytics track explicit behavior events only: `achievement_viewed`, `completion_added`, `seed_copied`, `friend_added`, and `profile_viewed`.
- Analytics do not track raw seeds, proof image URLs, emails, Discord IDs, access tokens, or personal profile data.
- PostHog autocapture, pageview capture, pageleave capture, and session recording are disabled.

## Backend Status

- Supabase clients and env scaffolding are implemented.
- Required Supabase env vars are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Optional PostHog env vars are `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.
- Local `.env.local` is configured for Supabase project `kdeslyohpjicuczgfnny`.
- Missing env is still handled gracefully with a dormant backend message.
- Production env detection is runtime server-fed for the homepage; `app/page.tsx` is intentionally dynamic so Vercel env changes are not trapped in a stale static/client bundle.
- Discord OAuth UI and callback route are scaffolded.
- Discord OAuth has been verified against the live Supabase project.
- First-login username onboarding has been removed.
- New Discord users get a profile automatically with a URL-safe slug derived from Discord identity.
- Current username records are still required for stable `/u/[username]` public routes, friend lookup, and profile uniqueness.
- Discord display names and avatars are stored on profiles and now drive primary visible identity.
- Current Discord OAuth user metadata supports basic profile display such as name/display name and avatar.
- Discord friend-list discovery is not implemented; it likely requires Discord Social SDK / `relationships.read` access and approval, so lightweight invite links are the safer near-term path.
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
- Logged-in users have a top-bar `My Board` link back to their own `/u/[username]` board.
- `My Board` is hidden while already viewing your own board.
- Friends dropdown closes on outside click.
- Friend rows are full-card links with no trailing action label.
- `/u/[username]` renders owner controls only when the signed-in user is viewing their own board; other boards are read-only.
- Auth/profile loading keeps a fixed-height intermediate panel instead of flashing incorrect account UI during session refresh.
- Friends load only after the logged-in profile is resolved and only inside the compact dropdown, avoiding empty-state flashes in the page body.
- Deployment-facing commit messages should include the current app version so Vercel deployments are easy to map back to `VERSION.md`.

## Manual / Incomplete

- Local completions are not synced/migrated to Supabase accounts yet.
- Deleted or replaced Supabase proof screenshots are not cleaned up from Storage yet.
- Browser-driven username form typing could not be automated in Codex because the in-app browser virtual clipboard was unavailable; the profile row was created directly in Supabase and verified through the app.
- Recommendation: keep existing manually chosen slugs until a migration can safely backfill Discord-derived slugs without breaking existing public board URLs.
- Future identity migration should preserve redirects from existing `/u/[username]` routes and avoid forcing current users to rename themselves.
- Public/global stats are not implemented yet and should eventually come from Supabase completion data rather than PostHog event counts.

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
