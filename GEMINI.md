# Gemini CLI rules for this repository

Read `AGENTS.md` first, then `loop/PROMPT.md`. Those two files are the contract; this file only adds
what is specific to an automated Gemini run.

## Scope of one run

- One bounded task per run and at most one pull request. A question gets an answer, not a patch.
- Pick the owning file from the `AGENTS.md` table and edit that file plus later overrides of the same
  symbol. Do not restructure the app or add another `app-polish-vNN.js`.
- Never modify `assets/`, `audio/`, or `content/` files, and never redraw the mascot artwork.
- Never add a payment, subscription, preview-lock, or store-purchase surface. Monetisation needs an
  explicit decision from the repository owner.

## Safety

- Never put API keys, tokens, or personal data in code, docs, issues, commits, or pull request bodies.
  This site is public and static on GitHub Pages.
- Preserve storage keys and learner progress; a change that touches stored records needs the
  migration and recovery tests in `tests/storage-preservation.test.cjs` to pass.

## Verification and delivery

- Run the matching lane from `AGENTS.md`: `npm run check:runtime` for docs, `npm run test:quick` for UI
  or behaviour, `npm run test:content` for question data. Run the full `npm run check` only when the
  change is a release candidate, and say so.
- When public JS/HTML/CSS/cache assets change, run `npm run version:bump` once.
- Branch `gemini/issue-<number>` (or `gemini/<slug>` for a manual run), push it, and open a pull
  request against `main`. Never push straight to `main`.
- Answer in the issue with a Korean summary of 3-6 lines: what changed, which files, the verification
  result, and the pull request link.
