# DEVLOG.md

## 2026-06-20 - Deployment Workflow Guardrails

### Version

- `1.3.8`

### Feature Summary

- Added generic deployment and verification workflow rules for future Codex work.

### What Changed

- Added a risk-based verification ladder to `AGENTS.md`.
- Added local tooling failure limits for typegen/typecheck/build/dev issues.
- Added deployment readiness categories for GO, yellow-but-okay, and NO-GO states.
- Documented that Vercel's clean build can be deployment truth for low-risk changes when local tooling is flaky.

### Why It Changed

- Small safe changes should ship without local cache/tooling issues turning into expensive debugging spirals.

### Files Touched

- `AGENTS.md`
- `DEVLOG.md`

### Verification Status

- Not run; documentation/process-only change per owner instruction.

### Commit

- Pending

## 2026-06-20 - Completed Badge Frame Polish

### Version

- `1.3.8`

### Feature Summary

- Simplified completed achievement badge framing so earned emblems look larger and less busy.

### What Changed

- Removed the completed badge crop's inner background and inset ring shadows.
- Kept the existing outer badge frame and ember glow.
- Scaled completed badge artwork up inside the circular frame.
- Preserved locked badge styling and achievement data.
- Bumped the app version to `1.3.8`.

### Why It Changed

- Completed badges were developing a nested bullseye effect from multiple containment rings, making the actual emblem art feel smaller than locked badges.

### Files Touched

- `AGENTS.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/globals.css`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`; passed after refreshing the local `node_modules` install from `package-lock.json`.
- Ran `npm run build`; passed.
- Ran local production smoke test with `next start`; homepage rendered with no browser console errors.
- Verified 5 completed badges and 7 locked badges on the current signed-in board.
- Verified completed badge crop has no inner background or inset ring shadow.
- Verified completed badge artwork scales up inside the outer circular frame.
- Verified completed badge art across multiple styles: Basic Training, This Feels Personal, Embrace the Darkness, Shadow Government, and The King's Halo.
- Verified mobile one-column layout at 390px width still renders completed badges cleanly.

### Commit

- `14734ef`

## 2026-06-20 - Board Link Identity Cleanup

### Version

- `1.3.7`

### Feature Summary

- Removed user-facing username/slug language from the Friends flow and made board links the primary add-friend primitive.

### What Changed

- Updated Friends add input to accept full board URLs, relative `/u/...` paths, and raw route-key fallback.
- Changed Friends placeholder and errors to talk about board links and friend boards instead of usernames or slugs.
- Kept Discord display name/avatar as the visible identity in account and friend surfaces.
- Kept `profiles.username` unchanged as the stable internal/public route key for existing `/u/...` board links.
- Updated README, backlog, current state, and version tracking for the launch identity model.
- Bumped the app version to `1.3.7`.

### Why It Changed

- Users should not need to know a second Neowtwork username before sharing with friends or Reddit.
- Discord identity can remain visible while stable board links preserve existing routes and avoid Discord-name collision/change risk.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `README.md`
- `VERSION.md`
- `app/u/[username]/page.tsx`
- `components/AuthPanel.tsx`
- `components/FriendsPanel.tsx`
- `config/app.ts`
- `lib/username.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`; passed.
- Ran `npm run build`; passed.
- Ran local production smoke test with `next start`; homepage rendered with no browser console errors.
- Verified Friends flyout shows Discord display names and no visible username/slug copy.
- Verified friend add accepts `/u/dillpicklez`.
- Verified friend add accepts `https://neowtwork.vercel.app/u/dillpicklez`.
- Verified friend add accepts raw fallback `dillpicklez`.
- Verified duplicate, self-board, and invalid-link errors use board-link language.
- Verified no usernames, slugs, raw board URLs, Discord IDs, or emails were added to analytics.

### Commit

- `9942cb2`

## 2026-06-20 - Dev Server and My Board Cleanup

### Version

- `1.3.6`

### Feature Summary

- Fixed local dev startup reliability and removed redundant `My Board` navigation while already on the user's own board.

### What Changed

- Updated `npm run dev` to clear generated `.next` output before starting Next dev.
- Treated both `/` and `/u/[username]` as own-board contexts for hiding `My Board`.
- Preserved existing share-board, copy-toast, friends, analytics, and documentation work already in the local checkout.
- Bumped the app version to `1.3.6`.

### Why It Changed

- Stale generated Next output could make dev compilation hang on the first homepage request even though production build/start was healthy.
- The home route already represents the signed-in user's board, so showing `My Board` there was redundant navigation clutter.

### Files Touched

- `AGENTS.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `components/AuthPanel.tsx`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`; passed.
- Ran `npm run build`; passed.
- Ran local production smoke test with `next start`; homepage rendered with no browser console errors.
- Verified `npm run dev` now clears `.next`, starts Next dev, and serves the homepage locally.
- Verified `/` hides `My Board` for a logged-in user.
- Verified `/u/brando_prime` hides `My Board` for the logged-in owner.
- Verified `/u/dillpicklez` shows `My Board` for a logged-in viewer on another user's board.

### Commit

- `e08b7ca`

## 2026-06-11 - Share Board Flow

### Version

- `1.3.5`

### Feature Summary

- Added a compact Share Board action and lightweight copy confirmations while tightening public-board context UI.

### What Changed

- Added `Share Board` to the authenticated account controls.
- Share Board copies the signed-in user's public `/u/[username]` board URL.
- Added shared copy confirmation toast behavior for clipboard actions.
- Copy Seed now shows `Seed copied.` confirmation on editable and read-only boards.
- Removed the full-width board ownership plaque from public/profile boards.
- Viewing another user's board now shows a small inline context label below the hero.
- Viewing your own board no longer repeats ownership context above the achievement grid.
- Added the explicit `board_link_copied` analytics event with safe metadata only.
- Documented that Discord friend discovery remains deferred behind simpler share/invite polish.
- Bumped the app version to `1.3.5`.

### Why It Changed

- Sharing should support the core loop without pushing the achievement wall lower or turning public boards into profile dashboards.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/globals.css`
- `app/u/[username]/page.tsx`
- `components/AchievementBoard.tsx`
- `components/AuthPanel.tsx`
- `components/BoardContextPlaque.tsx`
- `components/CopyConfirmationToast.tsx`
- `components/PublicAchievementBoard.tsx`
- `config/app.ts`
- `lib/analytics.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`; `next typegen` completed, then `tsc --noEmit` hung with no diagnostics and was stopped.
- Ran a focused `tsc --noEmit` over changed TypeScript/TSX files; it also hung with no diagnostics and was stopped.
- Ran `npm run build`; `next build` emitted no progress after 90 seconds and was stopped.
- Confirmed no stale Next/TypeScript processes were running before retrying.
- Cleared `.next` and retried local dev startup.
- `npm run dev -- -p 3000` also hung before binding a port and was stopped.
- Current shell Node is `v24.16.0`; no alternate local Node 20/22 runtime was available.
- Full production build verification is blocked by local Next/TypeScript tooling hangs in this checkout.

### Commit

- Pending

## 2026-06-11 - Collaboration Agreement Cleanup

### Version

- `1.3.4`

### Feature Summary

- Added explicit Codex collaboration guardrails and removed the rejected experimental creative work from the codebase.

### What Changed

- Added a `Collaboration Agreement` section to `AGENTS.md`.
- Documented that chat/brainstorming and planning do not imply code changes.
- Documented that prototypes require a clarifying pause before implementation.
- Documented that experimental creative, lore, or visual-identity work must not move into production without explicit approval.
- Removed the rejected experimental builder route, components, styles, roadmap notes, and preview artifact from the local worktree.
- Bumped the app version to `1.3.4`.

### Why It Changed

- Codex should spend owner attention and tokens more carefully, especially while the owner is still learning what Codex can and cannot safely do.

### Files Touched

- `AGENTS.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Not run; documentation cleanup only.

### Commit

- Pending

## 2026-06-10 - Friend Add Copy Cleanup

### Version

- `1.3.3`

### Feature Summary

- Cleaned up the Friends flyout add-friend copy after the Discord identity simplification.

### What Changed

- Changed `Add Guildmate` back to `Add Friend`.
- Changed the add button back to `Add Friend`.
- Removed the helper text under the friend search field.
- Kept Discord display-name identity behavior and board-slug lookup logic unchanged.
- Bumped the app version to `1.3.3`.

### Why It Changed

- The previous copy over-explained the temporary slug behavior and made the Friends flyout feel heavier than needed.

### Files Touched

- `AGENTS.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `components/FriendsPanel.tsx`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Confirmed current Friends flyout source shows `Add Friend` and no longer renders the helper text.

### Commit

- `03c1c1e`

## 2026-06-10 - Discord Identity Simplification

### Version

- `1.3.2`

### Feature Summary

- Simplified visible identity around Discord names and removed manual username onboarding for new users.

### What Changed

- Friend cards now show one primary identity: Discord display name when available, otherwise the public slug fallback.
- The account panel now shows Discord display name instead of the public slug.
- Public board context plaques already prefer Discord display name and continue using the slug only for routing.
- Removed the manual first-login username claim form.
- New profiles are automatically created from Discord auth metadata.
- `profiles.username` is now generated as a URL-safe slug from Discord identity for new users.
- Existing users keep their current slugs until a redirect-safe migration exists.
- Friend add/search copy now says `Add Guildmate` and asks for the board-link slug instead of `friend_username`.
- Documented Discord friend discovery direction: basic Discord profile info is available now; friend-list import should wait for Social SDK / `relationships.read` scope and approval clarity; invite links are the safer first step.
- Bumped the app version to `1.3.2`.

### Why It Changed

- Discord is already the login identity, so asking users to maintain a second visible Neowtwork username created unnecessary friction and duplicate identity UI.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `components/AuthPanel.tsx`
- `components/BoardContextPlaque.tsx`
- `components/FriendsPanel.tsx`
- `config/app.ts`
- `lib/profile-display.ts`
- `lib/username.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev -- -p 3001`.
- Confirmed the local homepage renders `v1.3.2`, the app hero, and no manual public board slug claim form.
- Confirmed `/u/brando_prime` renders `v1.3.2`, board context, and no manual public board slug claim form.
- Confirmed Friends UI source shows one visible name per friend row using Discord display name fallback behavior.
- Confirmed new profile creation source derives `profiles.username` automatically from Discord identity and preserves existing profile slugs.
- Confirmed Discord friend-list import is documented as future work that likely needs Social SDK / `relationships.read` access and approval, while invite links remain the safer near-term direction.

### Commit

- `2febd86`

## 2026-06-10 - Header Identity And Board UX Polish

### Version

- `1.3.1`

### Feature Summary

- Restored Neowtwork as the primary app identity on public boards and tightened board/friends/badge UX.

### What Changed

- Added a shared `AppHero` for the global `Neowtwork` / `Slay the Spire 2 Achievements` / official tagline treatment.
- Replaced the oversized public profile hero with a smaller contextual board-owner plaque.
- Hid `My Board` when the signed-in user is already viewing their own board.
- Added hover/focus opening for the Friends flyout while preserving click support and outside-click dismissal.
- Simplified completed achievement badge framing so completed emblems have fewer rings and more visible art.
- Added a backlog note to continue tuning completed badge frame/art balance after more real completions are visible.
- Bumped the app version to `1.3.1`.

### Why It Changed

- The public board route was starting to feel like a profile dashboard. The app should feel like a shared community achievement codex first, with the viewed board owner as secondary context.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/globals.css`
- `app/page.tsx`
- `app/u/[username]/page.tsx`
- `components/AppHero.tsx`
- `components/AuthPanel.tsx`
- `components/BoardContextPlaque.tsx`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev -- -p 3001`.
- Confirmed the homepage renders the global `Neowtwork` / `Slay the Spire 2 Achievements` hero, official tagline, and `v1.3.1`.
- Confirmed `/u/brando_prime` keeps the global app hero primary and renders `Viewing @brando_prime` as secondary board context instead of a giant profile hero.
- Confirmed the public/profile board route still renders the achievement board.
- Confirmed the same app hero, board context plaque, board, and `v1.3.1` render at a 390px mobile viewport.
- Confirmed source behavior hides `My Board` when the current pathname already matches the signed-in user's board route.
- Confirmed Friends opens on hover/focus while preserving click-to-open support and outside-click dismissal.

### Commit

- `c0171e0`

## 2026-06-10 - Privacy-Conscious Analytics

### Version

- `1.3.0`

### Feature Summary

- Added lightweight PostHog analytics for the pre-Reddit launch learning loop.

### What Changed

- Installed `posthog-js`.
- Added optional public PostHog env vars: `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.
- Added a centralized analytics helper that safely no-ops when analytics env vars are missing.
- Added a client analytics provider with autocapture, pageview capture, pageleave capture, and session recording disabled.
- Tracked explicit custom events only: `achievement_viewed`, `completion_added`, `seed_copied`, `friend_added`, and `profile_viewed`.
- Added safe gameplay/product metadata such as achievement id/name, ascension, seed/proof booleans, source, profile view type, completion count, logged-in state, and app version.
- Avoided raw seed values, proof URLs, emails, Discord IDs, access tokens, and personal profile data.
- Documented local/Vercel setup and PostHog verification steps.
- Updated backlog notes for future Supabase-backed global stats.
- Bumped the app version to `1.3.0`.

### Why It Changed

- Neowtwork needs enough behavioral signal before a public Reddit launch to understand what players actually use, while staying true to the project rule: track behavior, not personal data.

### Files Touched

- `.env.example`
- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `README.md`
- `VERSION.md`
- `app/layout.tsx`
- `app/u/[username]/page.tsx`
- `components/AchievementBoard.tsx`
- `components/AchievementDetailDialog.tsx`
- `components/AnalyticsProvider.tsx`
- `components/FriendsPanel.tsx`
- `components/ProfileViewAnalytics.tsx`
- `components/PublicAchievementBoard.tsx`
- `config/app.ts`
- `lib/analytics.ts`
- `lib/env.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev -- -p 3001`.
- Confirmed the local homepage renders `v1.3.0`, the Slay the Spire 2 achievement board, the official tagline, and achievement cards with PostHog env enabled.
- Confirmed opening `Basic Training` opens the completion modal, exercising the `achievement_viewed` event path.
- Confirmed tracked source code sends only safe metadata booleans/ids/counts and does not pass raw seed values, proof image URLs, emails, Discord IDs, access tokens, or profile identifiers into analytics events.
- Confirmed broad PostHog autocapture, pageview capture, pageleave capture, and session recording are disabled.
- Confirmed tracked project files do not contain the provided PostHog project token.

### Commit

- `71cacad`

## 2026-06-10 - Friend Row Label Cleanup

### Version

- `1.2.5`

### Feature Summary

- Removed the redundant trailing `Seeds` action label from Friends dropdown rows.

### What Changed

- Friend rows remain full-card clickable links.
- Removed the right-side `Seeds` text and external-link icon from each friend row.
- Bumped the app version to `1.2.5`.

### Why It Changed

- Once the whole friend card became clickable, the extra row action label created visual noise and made the dropdown feel busier than needed.

### Files Touched

- `AGENTS.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `components/FriendsPanel.tsx`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Confirmed source no longer renders `Seeds` or the external-link icon inside friend rows.

### Commit

- `db9b76e`

## 2026-06-10 - Account Friends Polish

### Version

- `1.2.4`

### Feature Summary

- Polished the account/Friends UX, added a My Board return path, updated the official tagline, and documented the Discord identity recommendation.

### What Changed

- Replaced the homepage tagline with `Because Slay 2 deserves achievements.`
- Added a top-bar `My Board` action for logged-in users.
- Added outside-click dismissal for the Friends dropdown.
- Removed the separate `Board` button from friend rows.
- Made each friend row a full-card link to that friend's board with hover/focus states.
- Preserved keyboard accessibility through normal link behavior.
- Reviewed username/Discord identity assumptions and documented why manual username slugs should stay for now.
- Added backlog items for Discord-derived profile slugs, Discord display-name lookup, and future Discord friend discovery.
- Bumped the app version to `1.2.4`.

### Why It Changed

- Friend navigation should feel like account/guild functionality, and users need a clear way back to their own codex when inspecting someone else's board. The tagline also needed to state the app's player-made reason for existing instead of sounding like product copy.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `components/AuthPanel.tsx`
- `components/FriendsPanel.tsx`
- `config/app.ts`
- `config/brand.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev -- -p 3001`.
- Confirmed the local homepage renders the updated `Because Slay 2 deserves achievements.` tagline, the `Slay the Spire 2 Achievements` title, 12 achievement cards, and `v1.2.4`.
- Confirmed the old `Track impossible runs. Share proof. Steal seeds.` tagline is absent from the rendered homepage.
- Confirmed source behavior for authenticated Friends: `My Board` links to the signed-in user's `/u/[username]` board, Friends is only shown for resolved profiles, the dropdown closes on outside pointer clicks, and friend rows are full-card links with no separate `Board` button.
- Confirmed username/Discord identity review: public username slugs remain required for stable routes and friend lookup; Discord display identity remains profile metadata until a safe slug migration is designed.

### Commit

- `c30262b`

## 2026-06-10 - Rebuilt Achievement Badges

### Version

- `1.2.3`

### Feature Summary

- Replaced all 12 screenshot-cropped achievement badges with purpose-built generated medal assets.

### What Changed

- Added `scripts/generate-achievement-emblems.mjs` as the maintainable source for all badge artwork.
- Regenerated all 12 files in `public/achievement-emblems/` as square `512x512` PNG medals.
- Preserved the same core badge themes: sword, vulnerable skull, energy ring, shield, zero coin, void, mask, crown, doom skull, cannon, prism shards, and merchant takeover.
- Removed old crop-specific CSS positioning hacks.
- Kept locked badges as intentional empty locked frames and completed badges as earned guild medals.
- Bumped the app version to `1.2.3`.

### Why It Changed

- The old badge files were screenshot crops with inconsistent aspect ratio, centering, scale, and padding. The new assets are designed for the existing circular card/detail badge system instead of being patched into it.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/globals.css`
- `config/app.ts`
- `package.json`
- `package-lock.json`
- `public/achievement-emblems/basic-training.png`
- `public/achievement-emblems/embrace-the-darkness.png`
- `public/achievement-emblems/hostile-takeover.png`
- `public/achievement-emblems/intern-economy.png`
- `public/achievement-emblems/junkyard-detonation.png`
- `public/achievement-emblems/mutually-assured-destruction.png`
- `public/achievement-emblems/prismatic-strike.png`
- `public/achievement-emblems/shadow-government.png`
- `public/achievement-emblems/terms-and-conditions-apply.png`
- `public/achievement-emblems/the-kings-halo.png`
- `public/achievement-emblems/this-feels-personal.png`
- `public/achievement-emblems/walk-it-off.png`
- `scripts/generate-achievement-emblems.mjs`

### Verification Status

- Ran `node scripts/generate-achievement-emblems.mjs`.
- Confirmed all 12 files in `public/achievement-emblems/` are `512x512` PNG assets.
- Reviewed a generated contact sheet for visual consistency, centering, scale, and padding.
- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev`.
- Confirmed local homepage renders 12 achievement cards and `v1.2.3`.
- Confirmed locked cards do not mount emblem images.
- Confirmed completed cards use centered `object-fit: contain` emblem rendering with no per-badge positioning hacks.
- Confirmed completed achievement detail modal opens and renders the new emblem asset with the shared centered treatment.
- Confirmed no browser console errors during local smoke checks.

### Commit

- `dca17da`

## 2026-06-10 - Removed Codex Ledger Flash

### Version

- `1.2.2`

### Feature Summary

- Removed the transient achievement-board loading banner and added a workflow rule to include app versions in Vercel-facing commit messages.

### What Changed

- Removed the visible `Checking the codex ledger...` banner during normal completion loading.
- Preserved plain backend error rendering if completion loading fails.
- Added an `AGENTS.md` instruction to include the current app version in deployment-facing commit messages.
- Bumped the app version to `1.2.2`.

### Why It Changed

- The normal completion-loading banner flashed between the hero and achievement board quickly enough to feel like a visual glitch.
- Vercel deployment rows show Git commit messages, so including the app version there makes deployments easier to identify.

### Files Touched

- `AGENTS.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `components/AchievementBoard.tsx`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev`.
- Confirmed local homepage renders 12 achievement cards and `v1.2.2`.
- Confirmed `Checking the codex ledger...` is absent during immediate page load and after the app settles.
- Confirmed Friends remains in the top bar and no browser console errors appeared.

### Commit

- `b082a93`

## 2026-06-10 - Stabilized Friends Top Bar

### Version

- `1.2.1`

### Feature Summary

- Moved Friends into the authenticated top bar and tightened auth/friends loading states to prevent flicker and page jumps.

### What Changed

- Removed the Friends/Seed Thieves panel from the homepage body.
- Added a small `Friends` button to the authenticated account block near username/sign out.
- Rendered add-friend and friends list UI in a compact dropdown.
- Mounted Friends only after the signed-in user and profile are fully resolved.
- Refactored Friends to use the already-resolved auth/profile state instead of running its own separate auth session fetch.
- Kept logged-out users from seeing Friends UI.
- Made the auth loading state fixed-height and prevented same-user session refreshes from clearing the profile.
- Preserved the achievement board as the primary page content.

### Why It Changed

- Friends are account/navigation functionality, not achievement board content. The previous page-body panel also had its own loading lifecycle, which could flash empty/loading states separately from auth.

### Files Touched

- `AGENTS.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/page.tsx`
- `components/AuthPanel.tsx`
- `components/FriendsPanel.tsx`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev`.
- Confirmed the homepage no longer renders the Friends/Seed Thieves panel in the main body.
- Confirmed the signed-in top bar shows a small `Friends` button next to `@brando_prime` and `Sign out`.
- Confirmed the immediate auth refresh state shows a stable `Checking Discord session...` panel with no `Choose your codex name` flash.
- Confirmed the settled auth refresh state restores `@brando_prime` and `Friends` with no onboarding flash.
- Confirmed opening the Friends dropdown shows `Checking the friend ledger...` before the empty state, avoiding an empty-state flash before friend data loads.
- Confirmed the achievement board top position did not move when opening the Friends dropdown or after auth refresh settled.
- Confirmed the compact Friends dropdown fits in a 390px mobile viewport without horizontal overflow.
- Confirmed logged-out Friends UI is guarded in code by the resolved authenticated profile; the dropdown is only mounted when `profile` exists.
- Confirmed no browser console errors during local smoke checks.

### Commit

- `aa5b17c`

## 2026-06-10 - Friends And Read-Only Boards

### Version

- `1.2.0`

### Feature Summary

- Added the first Friends feature pass, read-only friend board inspection, owner/viewer board logic, auth flicker cleanup, and desktop hero title polish.

### What Changed

- Added a homepage Friends panel where logged-in users can add friends by Neowtwork username.
- Added validation for self-adds, duplicate friends, invalid usernames, and unknown usernames.
- Added friend list rows with avatar/display-name support and links to `/u/[username]`.
- Made public/friend boards interactive for completed achievements with read-only detail modals.
- Kept owner completion/edit/delete actions available when the signed-in user views their own `/u/[username]` board.
- Hid owner actions when viewing someone else's board.
- Preserved copy-seed behavior in read-only completion details when a seed exists.
- Fixed auth-panel onboarding flicker by holding a stable profile-loading state during session/profile refresh.
- Adjusted the homepage hero title so `Slay the Spire 2 Achievements` stays on one line at desktop sizes while remaining responsive on mobile.
- Bumped the app version to `1.2.0`.

### Why It Changed

- Friends are the first social layer for the core loop: complete an achievement, upload proof, share a board, inspect friends, and steal seeds.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `README.md`
- `VERSION.md`
- `app/globals.css`
- `app/page.tsx`
- `app/u/[username]/page.tsx`
- `components/AchievementDetailDialog.tsx`
- `components/AuthPanel.tsx`
- `components/FriendsPanel.tsx`
- `components/PublicAchievementBoard.tsx`
- `config/app.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev`.
- Confirmed homepage renders the Friends panel, `v1.2.0`, and the signed-in `@brando_prime` auth state with no browser console errors.
- Confirmed empty friends state: `No friends yet. Add a username to start stealing seeds.`
- Created a temporary Supabase `friend_smoke` profile/completion for smoke testing, then removed it after verification.
- Confirmed add-friend validation rejects self-adds.
- Confirmed add-friend validation rejects unknown usernames.
- Confirmed valid username add creates a friend row and shows a `View Board` action.
- Confirmed duplicate friend add is rejected.
- Confirmed `/u/friend_smoke` rendered a read-only board with 12 cards, a completed achievement, proof detail modal, copyable seed, and no Add/Edit/Delete owner actions.
- Confirmed copy seed from a friend completion wrote `FRIEND-SEED-123` to the browser clipboard.
- Confirmed `/u/brando_prime` keeps owner actions available and uses `Your editable achievement codex.` copy.
- Confirmed auth refresh/reload uses a stable loading state and does not flash the username onboarding state before restoring `@brando_prime`.
- Confirmed desktop hero title stays on one line at 1280px with no overflow, while mobile remains responsive without overflow.
- Confirmed clean state after removing temporary friend data: empty friends state restored and no test friend remained.

### Commit

- `221163f`

## 2026-06-10 - Badge And Completion Form Polish

### Version

- `1.1.1`

### Feature Summary

- Cleaned up locked/completed badge visuals, tightened board spacing at the source, and simplified proof entry to upload/paste only.

### What Changed

- Locked achievement cards no longer render the canonical achievement emblem behind the lock.
- Locked badges now show only the circular frame, dark empty interior, and lock icon.
- Completed badges render canonical emblem art with contained circular cropping and per-emblem positioning where useful.
- Tightened the app shell, hero, board, card, and grid spacing through the existing source CSS/tokens instead of adding duplicate overrides.
- Removed the proof image URL option from the completion form.
- Changed the homepage board header to `Slay the Spire 2 Achievements` while keeping the app name as `Neowtwork`.
- Kept proof screenshots separate from canonical achievement emblems.
- Bumped the app version to `1.1.1`.

### Why It Changed

- The board needed clearer locked-vs-completed visual language, less roomy production spacing, and a cleaner completion form for the core proof-upload loop.

### Files Touched

- `AGENTS.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `VERSION.md`
- `app/globals.css`
- `app/page.tsx`
- `app/u/[username]/page.tsx`
- `components/AchievementBoard.tsx`
- `components/AchievementCard.tsx`
- `components/AchievementCompletionDialog.tsx`
- `components/AchievementDetailDialog.tsx`
- `components/AppShell.tsx`
- `components/PublicAchievementBoard.tsx`
- `config/app.ts`
- `config/brand.ts`
- `lib/design-system.ts`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev`.
- Confirmed local homepage shows `Slay the Spire 2 Achievements`, renders 12 cards, shows `v1.1.1`, and has no browser console errors.
- Confirmed locked badges render a circular frame and lock icon without mounting the canonical emblem image.
- Confirmed completed badges render canonical emblem art, no lock icon, `object-fit: contain`, and circular masking.
- Confirmed tightened source spacing is present locally through computed board/card padding and card min-height.
- Confirmed completion modal no longer shows the proof image URL field or `https://` URL placeholder, while upload/paste proof copy remains.
- Checked the live Vercel HTML before the patch and confirmed production was serving the current app/CSS bundle; the spacing fix was made by strengthening the existing source CSS/tokens and will apply through the next deployment.

### Commit

- `ec2d583`

## 2026-06-10 - Supabase Completion Persistence

### Version

- `1.1.0`

### Feature Summary

- Moved logged-in achievement completions from local-only storage to Supabase persistence with proof screenshot uploads.

### What Changed

- Wired the private achievement board to read the signed-in user's completions from Supabase.
- Saved new logged-in completions to `public.completions` without overwriting older completions.
- Uploaded proof screenshots to Supabase Storage bucket `proofs` under user-specific paths.
- Preserved localStorage completion behavior for logged-out users.
- Kept public `/u/[username]` boards reading Supabase completions in read-only mode.
- Preserved multiple completions per achievement, optional seeds, best-ascension collapsed cards, and proof screenshots inside detail modals only.
- Added Supabase delete/reset support for completion rows while leaving proof Storage cleanup as a follow-up.
- Updated continuity docs and bumped the app version to `1.1.0`.

### Why It Changed

- Neowtwork's core loop needs real persistence for logged-in players: complete achievement, upload proof, save ascension/seed, view later, and share the public board.

### Files Touched

- `AGENTS.md`
- `BACKLOG.md`
- `CURRENT_STATE.md`
- `DEVLOG.md`
- `README.md`
- `VERSION.md`
- `app/page.tsx`
- `components/AchievementBoard.tsx`
- `components/AchievementCompletionDialog.tsx`
- `config/app.ts`
- `docs/backend-foundation.md`
- `package.json`
- `package-lock.json`

### Verification Status

- Ran `npm run typecheck`.
- Ran `npm run build`.
- Ran `npm run dev` against `.env.local`.
- Confirmed local homepage renders 12 achievement cards, shows `v1.1.0`, hides the dormant backend banner, and has no browser console errors.
- Confirmed logged-in home can read a Supabase completion row and show the best ascension on the collapsed card.
- Confirmed `/u/brando_prime` can read Supabase completions in read-only mode and show the best ascension on the public board.
- Removed the temporary Supabase verification completion row after the read-path smoke test so the live board is not left with fake proof data.
- Confirmed clean-state homepage and `/u/brando_prime` render 12 cards with no dormant banner and no browser console errors after cleanup.
- Confirmed the logged-out localStorage fallback remains in code; full browser form-entry automation was limited by the known in-app browser text-entry issue, so manual save/upload verification in the normal browser is still recommended.

### Commit

- `2b6ddcb`

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

- `0e88803`

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
