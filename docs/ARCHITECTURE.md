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

1. shared DOM/runtime patch and durable storage guard
2. TOPIK I, Shorts, explanation, Travel Mode, and question-bank data
3. question-bank engine
4. TOPIK I and learning features
5. Travel Mode engine
6. product UI/growth layers
7. compatibility layers v22, v24, v33, v34, and v35
8. `game-visual-system.js`, the final owner for Game/Expedition geometry and visual surfaces
9. `home-visual-system.js`, the final owner for Home cards, entry controls, and navigation surfaces
10. `shorts-visual-system.js`, the final owner for Shorts question, answer, and coaching surfaces
11. `random-practice-visual-system.js`, the final owner for TOPIK I/II Random Practice surfaces

All runtime files are preloaded in parallel, then executed serially. This preserves override order
without paying a network round trip between every script.

Game visual consolidation begins with a purpose-named final owner rather than another numbered polish
layer. It consumes semantic tokens from `styles.css`; a small fixed legacy bridge overrides only the
remaining v24/v33 `!important` declarations and is count-locked by a focused test. New Game styling
belongs in this owner while older compatibility rules are removed incrementally behind screenshot parity.

Home follows the same migration pattern. `home-visual-system.js` owns its semantic surfaces and geometry,
while a count-locked bridge contains only the remaining v24/v35 declarations. New Home styling belongs in
that module and must extend the four-width browser contract rather than add a compatibility layer.

Shorts follows the same pattern through `shorts-visual-system.js`. It owns the question header, choices,
graded states, instructor feedback, actions, and save proposal. Its count-locked bridge exists only for the
older proposal copy declarations, and the mobile gate covers both unanswered and graded cards.

Random Practice follows through `random-practice-visual-system.js`. It owns both TOPIK I and II headers,
statistics, question and choice cards, graded states, translation, and expandable type coaching without
changing either question engine. Its fixed bridge contains the remaining v24 feedback declarations; mobile
checks cover unanswered and graded states at four widths and retain the three-part Japanese coaching flow.

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

`data/question-bank-practice-v1.js` is a reviewed set-0 expansion loaded after those generated parts.
It adds type-focused Random Practice, Game, Shorts, and Review items without changing the size or
composition of any fixed mock set.

`question-bank-engine.js` normalizes both sources and supplies all modes with stable IDs, difficulty
pools, shuffled display order, multilingual instructor explanations, and no-repeat behavior. The
curated Shorts decks contain 48 TOPIK I and 54 TOPIK II cards; eligible bank items bring the actual
quick-practice pools to 172 and 116.

## Travel Mode

`travel-mode.js` owns the Seoul map, route renderer, travel passport, avatar rewards, result grading,
question-bank delivery, and wrong-answer handoff. Authored route content stays in purpose-named
`data/travel-pack-seoul-*.js` files. A new route should normally require a data pack and focused tests,
not another runtime engine or numbered compatibility layer.

Travel progress intentionally keeps the independent legacy `malbitStoryV1` browser-storage root,
with one state record per route. Keeping the key and original scene IDs migrates existing Story
answers, clears, and best scores in place. It does not share navigation or answer state with the
full mock exam, so resuming or replaying a route cannot overwrite an in-progress timed exam.

## Persistence contract

Progress, wrong answers, vocabulary, listening preferences, and game state live in browser storage.
Vocabulary enrichment stays inside each existing `topikQuestV8.vocab` entry, so old entries and exported progress files remain compatible. `vocab-editor.js` owns the detail editor and exposes a narrow `MALBIT_AI_ADAPTER` boundary for optional server-side translation and enrichment; the static client contains no provider secret.
Changing a key without migration silently destroys a user's continuity, so storage keys are treated
as public API. Any migration must accept old values, write the new representation, and have a test.

`storage-guard.js` maintains a last-known-good `malbitRecoverySnapshotV1` for durable roots and
restores missing, malformed, or suspiciously empty core progress during boot. Translation cache is
excluded to control size. Explicit full reset clears the snapshot first; ordinary app updates and
imports do not. An older exported file may replace keys it contains but cannot delete newer roots
that are absent from that file.

## Cache contract

`index.html`, `site-patch.js`, and `sw.js` share one integer release version. Literal asset URLs in
`index.html` carry that version too. The service worker precaches the base shell; the larger feature
runtime and generated question-bank parts are cached as a successful boot loads them. This makes
updates activate quickly while retaining offline use after a completed first load.

Run `npm run check:runtime` to validate versions, loader targets, generated bank hashes, and the rule
against adding new numbered patch files.
