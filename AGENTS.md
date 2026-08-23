# MALBIT repository contract

This repository is the production source for the public MALBIT Korean-learning PWA.
Read this file before changing code. Prefer narrow edits and preserve user progress.

## Product invariants

- Production repository: `okometsbu-beep/topik-quest`
- Public deployment: `https://okometsbu-beep.github.io/topik-quest/`
- Hosting stays static on GitHub Pages. Never put API keys or private credentials in client code.
- Keep the site public and usable without login.
- Preserve existing browser storage keys and saved progress unless a migration is included and tested.
- Preserve TOPIK I, TOPIK II, Shorts, Random Practice, full mock exams, Review, Vocabulary,
  Statistics, Hangul beginner/handwriting, listening settings, and Wordlight Expedition.
- The 2,088-item bank is original app content. Do not replace it with copied exam text.

## Fast orientation

| Area | Owning files |
| --- | --- |
| App shell and versioned bootstrap | `index.html` |
| Base visual system | `styles.css` |
| Legacy TOPIK II payload and runtime | `legacy-data.js`, `legacy-core.js` |
| Boot order and versioned script loading | `site-patch.js` |
| Service worker and offline cache | `sw.js` |
| Shared DOM/runtime patch | `site-patch-core.js` |
| TOPIK I and shared mode runtime | `topik1.js` |
| Review, explanations, vocabulary | `learning-features.js` |
| Product UI and settings | `product-polish.js`, `product-growth.js` |
| Later compatibility layers | `app-polish-v22.js`, `app-polish-v24.js`, `app-polish-v33.js`, `app-polish-v34.js`, `app-polish-v35.js` |
| Question-bank behavior | `question-bank-engine.js` |
| Generated question-bank payload | `data/question-bank-v1-part*.js` |
| Tests | `tests/` |

For a deeper map, read `docs/ARCHITECTURE.md`. For commands and release lanes, read
`docs/DEVELOPMENT.md`.

## Token-minimal startup

1. Run `npm run context --silent` once. Do not rediscover the version, branch, bank size, hosting,
   or current known gaps by opening many files.
2. Treat this file plus `docs/HANDOFF.md` as sufficient default context. Read Architecture or
   Development only when the task changes those systems.
3. Classify the request before reading code: UI/behavior, content, release, or research. Search only
   the owning file, later overrides of the same symbol, and the focused test.
4. Never open the uploaded TOPIK source bundle or generated question-bank parts for UI, navigation,
   styling, deployment, vocabulary-editor, or business-analysis work.
5. Batch related searches and checks. Do not repeatedly print whole files, full test logs, or a diff
   already inspected; prefer `rg -n`, bounded `sed`, `git diff --stat`, and failure-only follow-up.
6. Run the lane-specific check during development and the full release check only once before a
   requested deployment.
7. Update `docs/HANDOFF.md` only when a stable capability, constraint, or known gap changes.

## Change routing

1. Search with `rg` before opening large files.
2. Do not read or rewrite generated question-bank parts for a UI-only change.
3. Do not add another `app-polish-vNN.js`. Put a change in its owning file or create a
   purpose-named module and add it to `site-patch.js`.
4. Do not edit `data/question-bank-v1-part*.js` by hand. Rebuild them with
   `scripts/build-question-bank.mjs` and validate the manifest.
5. When any public JS/HTML/CSS/cache asset changes, run `npm run version:bump` once before release.
   This also synchronizes every literal `?v=` asset URL in `index.html`.
6. Keep the runtime order in `site-patch.js`; later compatibility layers intentionally override
   earlier globals.

## Verification lanes

- Documentation-only: `npm run check:runtime`
- UI or behavior change: `npm run test:quick`
- Question data, answers, explanations, shuffling, or bank engine: `npm run test:content`
- Release candidate: `npm run check`
- Visual/mobile behavior: run `npm run serve`, then verify the affected flow at a narrow mobile
  viewport and check the browser console.
- HTTP/deployment availability: while the server is running use `npm run smoke`; after deployment
  use `npm run smoke -- https://okometsbu-beep.github.io/topik-quest/`.

The full automated suite is intentionally cheap; it should stay under a few seconds locally.

## Definition of done

- Relevant tests pass and `npm run check:runtime` reports one shared version.
- No unintended localStorage key changes or destructive data migration.
- No missing runtime file, duplicate loader entry, stale cache version, or console error.
- The branch diff contains only the requested work.
- Publish through a branch and PR, merge to `main`, then verify the live GitHub Pages build.
