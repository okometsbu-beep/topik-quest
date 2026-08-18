# MALBIT architecture

## Runtime flow

MALBIT is a dependency-free static PWA. `index.html` is a small app shell. It loads the base visual
system from `styles.css`, the original TOPIK II payload from `legacy-data.js`, and its runtime from
`legacy-core.js`. The page bootstrap installs or updates `sw.js`, then loads `site-patch.js` with
the shared release version.

The extracted base files retain their original execution order but are independently cacheable.
This keeps repeat edits and navigations from reparsing a 600 KB HTML document when only one layer
changed.

`site-patch.js` owns the canonical runtime order:

1. shared DOM/runtime patch
2. TOPIK I, Shorts, explanation, Story Mode, and question-bank data
3. question-bank engine
4. TOPIK I and learning features
5. Story Mode engine
6. product UI/growth layers
7. compatibility layers v22, v24, v33, v34, and v35

All runtime files are preloaded in parallel, then executed serially. This preserves override order
without paying a network round trip between every script.

## Why the compatibility layers remain

The versioned `app-polish-*` files are historical compatibility layers and contain working features
that are covered by runtime tests. Moving all of them in one release would create a large regression
surface. New work must not create another numbered layer. Modify the owning layer when the behavior
clearly belongs there, or create a purpose-named module and document its dependency.

Consolidation can proceed feature by feature after browser parity tests exist. The safe order is:

1. extract shared utilities and storage adapters
2. extract beginner/handwriting
3. extract expedition
4. extract review/vocabulary
5. migrate feature-owned code out of `legacy-core.js` behind focused parity tests

## Content pipeline

`scripts/build-question-bank.mjs` converts the canonical 2,088-item JSON source into four generated
browser payloads plus `data/question-bank-manifest.json`. The generated payloads are not source files
for manual editing.

`question-bank-engine.js` normalizes those rows and supplies all modes with stable IDs, difficulty
pools, shuffled display order, multilingual explanations, and no-repeat behavior.

## Story Mode

`story-mode.js` owns the reusable scene renderer, episode progress, clue notebook, result grading,
question-bank delivery, and wrong-answer handoff. Authored episode content stays in purpose-named
`data/story-pack-*.js` files. A new episode should normally require a data pack and focused tests,
not another runtime engine or numbered compatibility layer.

Story progress uses the independent `malbitStoryV1` browser-storage root, with one state record per
episode. It does not share navigation or answer state with the full mock exam, so resuming or
replaying a case cannot overwrite an in-progress timed exam.

## Persistence contract

Progress, wrong answers, vocabulary, listening preferences, and game state live in browser storage.
Vocabulary enrichment stays inside each existing `topikQuestV8.vocab` entry, so old entries and exported progress files remain compatible. `vocab-editor.js` owns the detail editor and exposes a narrow `MALBIT_AI_ADAPTER` boundary for optional server-side translation and enrichment; the static client contains no provider secret.
Changing a key without migration silently destroys a user's continuity, so storage keys are treated
as public API. Any migration must accept old values, write the new representation, and have a test.

## Cache contract

`index.html`, `site-patch.js`, and `sw.js` share one integer release version. Literal asset URLs in
`index.html` carry that version too. The service worker precaches the base shell; the larger feature
runtime and generated question-bank parts are cached as a successful boot loads them. This makes
updates activate quickly while retaining offline use after a completed first load.

Run `npm run check:runtime` to validate versions, loader targets, generated bank hashes, and the rule
against adding new numbered patch files.
