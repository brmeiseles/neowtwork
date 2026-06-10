# Backend Foundation

Neowtwork's backend foundation uses Supabase for auth, database rows, and proof screenshot storage.

## Supabase Pieces

- Auth provider: Discord OAuth.
- Database tables: `profiles`, `achievements`, `completions`, `friends`.
- Storage bucket: `proofs`.
- Proof object path convention: `{user_id}/{completion_id-or-random-name}`.

## Security Rules

- Public visitors can read profiles, achievements, and completions so public boards can render at `/u/[username]`.
- Authenticated users can insert/update only their own profile.
- Authenticated users can insert/update/delete only their own completions.
- Authenticated users can add/remove only their own friend rows.
- Proof screenshots are public-readable for public boards.
- Users can upload/update/delete proof files only inside their own user-id folder.

## Manual Supabase Setup

1. Create a Supabase project.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
3. Run `supabase/migrations/202606100001_backend_foundation.sql`.
4. Run `supabase/seed.sql` to populate achievement rows.
5. Enable Discord in Supabase Auth providers.
6. Add the Discord client id and secret in Supabase.
7. Configure redirect URLs:
   - Local: `http://localhost:3000/auth/callback`
   - Production: `https://YOUR_DOMAIN/auth/callback`
8. Confirm the `proofs` storage bucket exists and is public.

## Current Persistence Status

- Logged-in users save and load completions through Supabase.
- Proof screenshots upload to Supabase Storage bucket `proofs`.
- Public profile routes read Supabase completions in read-only mode.
- The local completion flow still has a localStorage fallback for logged-out users.
- Local-to-account completion sync is intentionally not implemented yet.
- Deleted or replaced proof screenshots are not cleaned up from Storage yet.
