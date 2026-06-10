# Neowtwork Achievements

Neowtwork is a dark fantasy achievement codex for impossible Slay the Spire-style challenge runs.

Core loop:

```text
complete achievement -> upload proof -> save ascension/seed -> share board -> inspect friends' boards
```

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- lucide-react
- framer-motion
- Supabase foundation for auth, database, and proof storage
- PostHog for privacy-conscious product analytics

## Local Setup

Install dependencies:

```bash
npm install
```

Create local env:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

- `npm run dev` starts the local Next.js server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run typecheck` runs TypeScript without emitting files.

## Supabase Setup Guide

Phase 1 backend foundation is wired in the codebase, but Brandon still needs to create/configure the external Supabase and Discord pieces.

### 1. Create Supabase Project

1. Go to Supabase.
2. Create a new project.
3. Save the project URL and anon public key.

### 2. Add Env Vars

Add these to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-project-token
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Never commit real keys. `.env.example` shows the required names only.

PostHog analytics are optional locally. Leave the PostHog values blank to
disable analytics without breaking the app.

### 3. Run Migrations

In Supabase SQL Editor, run:

```text
supabase/migrations/202606100001_backend_foundation.sql
```

This creates:

- `profiles`
- `achievements`
- `completions`
- `friends`
- `proofs` storage bucket
- basic RLS policies

### 4. Seed Achievements

In Supabase SQL Editor, run:

```text
supabase/seed.sql
```

This copies the current 12 local achievements into the database.

### 5. Configure Discord OAuth

1. Create a Discord application in the Discord Developer Portal.
2. Add an OAuth2 redirect URL for Supabase:

```text
https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
```

3. Copy the Discord client id and client secret.
4. In Supabase, go to Authentication -> Providers -> Discord.
5. Enable Discord and paste the client id/secret.

### 6. Configure App Redirect URLs

In Supabase Authentication URL settings, add:

```text
http://localhost:3000/auth/callback
```

For production later, also add:

```text
https://YOUR_DOMAIN/auth/callback
```

### 7. Confirm Storage Bucket

The migration creates a public `proofs` bucket.

Proof paths should use:

```text
{user_id}/{filename}
```

Users can only upload/update/delete proof files inside their own user-id folder. Public boards can read proof screenshots.

### 8. Start Local Dev

After env vars and Supabase setup:

```bash
npm run dev
```

The auth panel should show `Sign in with Discord` instead of the dormant backend message.

## Current Backend Status

Implemented:

- Supabase client/server setup.
- Discord OAuth button and callback route.
- Live Discord OAuth verified with the first Supabase auth user.
- Username onboarding scaffold.
- Public read-only profile route at `/u/[username]`.
- Database schema and RLS policies.
- Proof storage bucket design.
- Local completion model refactored toward multiple completions.
- Logged-in completion save/load through Supabase.
- Proof screenshot upload to Supabase Storage bucket `proofs`.
- Public profile completion reads from Supabase.
- Friends can be added by Neowtwork username and opened as read-only public boards.

Still manual/incomplete:

- Other machines need their own `.env.local` values.
- Local completions are not yet automatically synced to Supabase.
- Deleted or replaced proof screenshots are not cleaned up from Storage yet.

## Vercel Environment Notes

The production app expects these exact variable names:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
```

The homepage auth panel receives this public Supabase config from the server-rendered app shell. This keeps the missing-env fallback, but avoids relying only on stale client-bundle substitution when Vercel env vars change.

If production ever shows the dormant backend message again, check the non-secret diagnostic text in that banner:

- `URL: configured/missing`
- `Key: configured/missing`

Do not log or paste the actual key value.

## Analytics Setup

Neowtwork uses PostHog for explicit, privacy-conscious behavior analytics.
Analytics track product behavior, not personal data.

Tracked events:

- `achievement_viewed`
- `completion_added`
- `seed_copied`
- `friend_added`
- `profile_viewed`

The app does not track raw seed values, proof image URLs, emails, Discord IDs,
access tokens, or personal profile data. Broad autocapture, session replay, and
heatmaps are disabled.

To verify events in PostHog:

1. Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.
2. Restart local dev or redeploy Vercel.
3. Open PostHog Activity or Live Events.
4. Trigger one tracked action in the app, such as opening an achievement detail
   modal or copying a seed.
5. Confirm the event appears with gameplay metadata like achievement id,
   ascension, source, and app version.

Future public/global stats should come from Supabase completion data, not
directly from PostHog event counts.

## Renaming The App

Most visible naming lives in `config/brand.ts`. To rename the app later, update the app name, short name, board title, tagline, metadata title, metadata description, and repo name there first.
