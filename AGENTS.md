# AGENTS.md

## Project Workflow

- After each meaningful feature or project change, write a short developer note in `DEVLOG.md`.
- Keep `DEVLOG.md` in reverse chronological order, with the newest entry at the top.
- Use clear checkpoint titles, for example: `2026-06-09 - Completed Achievement State`.
- Each developer note should explain:
  - what changed
  - why it changed
  - files touched
  - how it was verified
  - commit hash after push, if available
- After successful verification, commit and push changes automatically unless the user says otherwise.
- After pushing, always summarize the checkpoint in the Codex response.
