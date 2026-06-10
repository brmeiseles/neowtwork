# BACKLOG.md

## Backlog Rules

- Keep items short and actionable.
- Move completed items to `DEVLOG.md`, not deleted silently.
- Prioritize small visible wins.
- Prefer product clarity over technical cleverness.
- Always preserve the core loop: complete achievement -> upload proof -> share seed -> inspire friends.

## Immediate Polish

- Completed in `0.2.4`; see `DEVLOG.md` entry `2026-06-09 - Immediate Polish Pass`.
- Completed bespoke generated badge asset pass in `1.2.3`; see `DEVLOG.md` entry `2026-06-10 - Rebuilt Achievement Badges`.
- Continue tuning completed badge art scale and frame weight after more real completions are visible.

## Core Completion System

- Completed local/backend-ready foundation in `1.0.0`; see `DEVLOG.md` entry `2026-06-10 - Phase 1 Backend Foundation`.
- Completed logged-in Supabase completion persistence and proof uploads in `1.1.0`; see `DEVLOG.md` entry `2026-06-10 - Supabase Completion Persistence`.
- Migrate existing localStorage completions into a logged-in account.
- Add graceful sync conflict handling if local and backend data both exist.
- Delete old proof Storage objects when completions are deleted or proof images are replaced.

## Achievement List Updates

- Replace The King's Halo because the multiple Sovereign Blade interaction was patched.
- Explore Regent Stars-based replacement.
- Add future enemy-specific achievement after more playtesting.
- Maintain achievement names/descriptions as editable source of truth.

## Backend / Accounts

- Completed Phase 1 Supabase/Discord foundation in `1.0.0`; see `DEVLOG.md` entry `2026-06-10 - Phase 1 Backend Foundation`.
- Completed Supabase project env/migration/seed and Discord OAuth/profile verification in `1.0.2`; see `DEVLOG.md` entry `2026-06-10 - Connected And Verified Supabase Auth`.
- Completed new-user Discord-derived slug creation in `1.3.2`; see `DEVLOG.md` entry `2026-06-10 - Discord Identity Simplification`.
- Backfill existing manually chosen profile slugs to Discord-derived slugs only with redirect support.
- Explore Discord display-name based friend lookup while preserving stable public profile URLs.
- Preserve redirects from existing public board URLs if slugs are regenerated.
- Avoid email/password system initially unless needed.
- Migrate localStorage completions to logged-in user account if possible.

## Friends / Social

- Completed first Friends feature pass in `1.2.0`; see `DEVLOG.md` entry `2026-06-10 - Friends And Read-Only Boards`.
- Explore Discord friend discovery or Discord-linked friend suggestions.
- Add exact-match Discord display-name lookup only after duplicate-name handling is clear.
- Add share/invite link flow before attempting Discord friend-list import.
- Investigate Discord Social SDK / `relationships.read` access requirements before any Discord friend-list integration.
- Avoid Discord friend-list import unless scopes, user consent, and approval requirements are clear.
- Support profile sharing for Discord/Reddit.

## Analytics Before Reddit

- Completed initial privacy-conscious PostHog analytics in `1.3.0`; see `DEVLOG.md` entry `2026-06-10 - Privacy-Conscious Analytics`.
- Keep tracking behavior, not personal data.
- Consider `achievement_completed` only after the first-completion semantics are clear.
- Consider `board_completed` after the all-12 completion celebration exists.
- Add future global stats page.
- Show most completed achievement.
- Show rarest achievement.
- Show highest ascension completion.
- Show most copied seed.
- Show board completion count.
- Show recent legendary clears.
- Build public/global stats from Supabase completion data, not directly from PostHog events.

## Delight / Endgame

- Add celebration when all 12 achievements are complete.
- Avoid generic confetti.
- Make completion feel like finishing a forbidden codex.
- Consider message: "The Spire Remembers You".
- Make all emblems glow.
- Intensify the board.
- Reveal a final rune.

## Later / Icebox

- Add OCR seed extraction from screenshots.
- Add seed screenshot upload field.
- Add seasonal achievements.
- Add hidden achievements.
- Add rarity tiers.
- Add comments/reactions on completions.
- Add animated Neow / lore flavor.
- Add achievement submission/voting system.
