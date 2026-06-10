# BACKLOG.md

## Backlog Rules

- Keep items short and actionable.
- Move completed items to `DEVLOG.md`, not deleted silently.
- Prioritize small visible wins.
- Prefer product clarity over technical cleverness.
- Always preserve the core loop: complete achievement -> upload proof -> share seed -> inspire friends.

## Immediate Polish

- Completed in `0.2.4`; see `DEVLOG.md` entry `2026-06-09 - Immediate Polish Pass`.

## Core Completion System

- Support multiple completions per achievement.
- Card shows best ascension badge only.
- No completion count on collapsed cards.
- Seed is optional.
- Detail modal shows all completions.
- Allow adding another completion from detail modal.
- Allow editing/deleting completions.
- Keep proof screenshots separate from canonical emblems.

## Achievement List Updates

- Replace The King's Halo because the multiple Sovereign Blade interaction was patched.
- Explore Regent Stars-based replacement.
- Add future enemy-specific achievement after more playtesting.
- Maintain achievement names/descriptions as editable source of truth.

## Backend / Accounts

- Add Supabase backend.
- Prefer Discord OAuth login.
- On first login, user chooses unique public Neowtwork username.
- Avoid email/password system initially unless needed.
- Add public read-only profile URLs at `/u/[username]`.
- Migrate localStorage completions to logged-in user account if possible.

## Friends / Social

- Add friends by Neowtwork username.
- Require no approval for adding friends.
- Show read-only friend boards.
- Allow copying friend seed values.
- Support profile sharing for Discord/Reddit.

## Analytics Before Reddit

- Add privacy-conscious analytics before public Reddit launch.
- Use PostHog as the recommended tool.
- Track behavior, not personal data.
- Track `achievement_completed`.
- Track `completion_added`.
- Track `achievement_viewed`.
- Track `seed_copied`.
- Track `profile_viewed`.
- Track `friend_added`.
- Track `board_completed`.
- Add future global stats page.
- Show most completed achievement.
- Show rarest achievement.
- Show highest ascension completion.
- Show most copied seed.

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
