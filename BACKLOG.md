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
- Add feedback admin dashboard after launch if Supabase dashboard review becomes annoying.
- Add feedback rate limiting if anonymous spam becomes real.
- Add feedback email notifications if manual dashboard checks are too easy to miss.
- Consider feedback screenshot attachments after core launch feedback proves useful.
- Continue tuning completed badge art scale and frame weight after more real completions are visible.

## Core Completion System

- Completed local/backend-ready foundation in `1.0.0`; see `DEVLOG.md` entry `2026-06-10 - Phase 1 Backend Foundation`.
- Completed logged-in Supabase completion persistence and proof uploads in `1.1.0`; see `DEVLOG.md` entry `2026-06-10 - Supabase Completion Persistence`.
- Migrate existing localStorage completions into a logged-in account.
- Add graceful sync conflict handling if local and backend data both exist.
- Delete old proof Storage objects when completions are deleted or proof images are replaced.

## Achievement List Updates

- Add future enemy-specific achievement after more playtesting.
- Maintain achievement names/descriptions as editable source of truth.

## Backend / Accounts

- Completed Phase 1 Supabase/Discord foundation in `1.0.0`; see `DEVLOG.md` entry `2026-06-10 - Phase 1 Backend Foundation`.
- Completed Supabase project env/migration/seed and Discord OAuth/profile verification in `1.0.2`; see `DEVLOG.md` entry `2026-06-10 - Connected And Verified Supabase Auth`.
- Completed new-user Discord-derived slug creation in `1.3.2`; see `DEVLOG.md` entry `2026-06-10 - Discord Identity Simplification`.
- Completed board-link based friend add and visible Discord identity cleanup in `1.3.7`; see `DEVLOG.md` entry `2026-06-20 - Board Link Identity Cleanup`.
- Backfill existing manually chosen profile slugs to Discord-derived slugs only with redirect support.
- Explore Discord display-name based friend lookup while preserving stable public profile URLs.
- Preserve redirects from existing public board URLs if slugs are regenerated.
- Consider renaming `profiles.username` to a slug field only after a migration and redirect plan exists.
- Avoid email/password system initially unless needed.
- Migrate localStorage completions to logged-in user account if possible.

## Friends / Social

- Completed first Friends feature pass in `1.2.0`; see `DEVLOG.md` entry `2026-06-10 - Friends And Read-Only Boards`.
- Completed lightweight Share Board copy flow in `1.3.5`; see `DEVLOG.md` entry `2026-06-11 - Share Board Flow`.
- Completed board-link based friend add in `1.3.7`; users should share boards rather than exchange app usernames.
- Completed launch-safe one-way follows/follow-back MVP in `1.4.0`; see `DEVLOG.md` entry `2026-06-20 - Followers MVP`.
- Add unfollow/remove follow after launch.
- Add follower/following counts once useful for Reddit sharing.
- Consider renaming the `friends` table to `follows` only with a migration plan after launch.
- Explore Discord friend discovery or Discord-linked friend suggestions.
- Add exact-match Discord display-name lookup only after duplicate-name handling is clear.
- Add invite-link polish for Discord/Reddit sharing.
- Add richer invite/share polish before attempting Discord friend-list import.
- Investigate Discord Social SDK / `relationships.read` access requirements before any Discord friend-list integration.
- Avoid Discord friend-list import unless scopes, user consent, and approval requirements are clear.
- Support profile sharing for Discord/Reddit.

## Social Features

### Followers / Follow Back

- Allow users to follow public boards.
- Show who follows your board.
- Make it easy to follow followers back.
- Keep the model lightweight and one-directional initially.
- Avoid approvals, comments, reactions, or social-network complexity.
- Goal: support sharing boards on Reddit and community discovery.

### Leaderboards

- Show most achievements completed.
- Show highest ascension completion.
- Show rarest achievement.
- Show most copied seed.
- Show most followed board.
- Add character-specific leaderboards later.
- Keep leaderboard design aligned with the codex/guild-board aesthetic.

### Comments

- Add lightweight comments on public boards and/or achievement completions.
- Consider moderation requirements before implementation.
- Validate community demand before building.
- Keep comments lower priority than sharing, follows, and achievement tracking.

## Completion Tracking

### Character Tracking

- Add character field to completion submissions.
- Store character per completion.
- Show character in completion history/detail modal.
- Eventually display a small character icon/badge near ascension.
- Use character data for future stats and leaderboards.
- Example: highest ascension by character.
- Example: most achievements completed by character.
- Example: achievement rarity by character.

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

## Screenshot Intelligence

### Metadata Extraction (OCR)

- Reduce submission friction by extracting metadata from uploaded screenshots.
- Extract seed automatically from uploaded screenshots.
- Extract ascension automatically from uploaded screenshots.
- Extract character automatically from uploaded screenshots.
- Pre-fill completion form fields automatically.
- Allow users to review/edit extracted values before saving.
- Treat OCR results as suggestions, not authoritative values.
- Require user confirmation before save.
- Start with seed and ascension.
- Add character detection later if needed.

### Proof Validation / Achievement Verification

- Assist with validating uploaded proof.
- Analyze screenshots for achievement-specific evidence.
- Detect likely valid completions automatically.
- Flag suspicious or incomplete proof.
- Provide verification assistance rather than hard rejection.
- Start as an assistant, not an enforcement system.
- Build achievement-specific verification rules over time.
- Keep proof validation separate from OCR metadata extraction.
- Example: validate achievement requirements from screenshot state.
- Example: detect proof types such as combat screen, victory screen, deck screen, or other relevant states.
- Eventually support achievement-specific validation workflows.

### Priority Note

- OCR metadata extraction is higher priority and lower risk than full achievement verification because it reduces form friction without deciding whether a completion is valid.

## Later / Icebox

- Add OCR seed extraction from screenshots.
- Add seed screenshot upload field.
- Add seasonal achievements.
- Add hidden achievements.
- Add rarity tiers.
- Add comments/reactions on completions.
- Add animated Neow / lore flavor.
- Add achievement submission/voting system.
