# MALBIT compact handoff

This is the short continuity record for future work. Use it with `AGENTS.md`; do not reconstruct
these facts from conversation history or the large TOPIK source bundle.

## Current release priority · 2026-09-11

- Source of truth: [release blueprint #110](https://github.com/okometsbu-beep/topik-quest/issues/110).
  It supersedes #76 map expansion until core learning quality gates pass. A01–A12 remain audit findings,
  not resolved items; existing feature/visual checks do not certify translation or teaching accuracy.
- Production is v102 at `5d5a9ec9831c3b39265367ad0cba066f66b21106` (PR #121).
  Four reviewed TOPIK I time-adverb Shorts are shipped on top of stable card/family cycling. Product rollback is
  v101 `711d2b234fd2ba3ba038bdc5e5162c6d76a71468`.
- Latest #110 instruction: C01–C06 content quality, first applied as S01–S05 Shorts, outranks A08/#76.
  S01 adds `docs/qa/shorts-audit.md`, generated ID/content-hash inventory and `scripts/audit-shorts.cjs`.
  The v103 candidate has 296 runtime rows but only 170 distinct question-choice sets (I 88, II 82), 30 duplicate
  groups and 15 structural review candidates. Comprehensive content approvals remain 0/296, not 296 passed questions.
  Audit-only curated IDs must NOT replace saved numeric indices without the S03 migration contract.
- S03 v101 (PR #120) migrates schema-2 numeric Shorts progress to stable card/family IDs without
  replacing `topikQuestShortsV1`. It cycles 162 exact question-choice families before intentional repeats,
  prioritizes newly added families, avoids the current/recent family, and labels exhausted-cycle items as review.
  Original 288 rows, answers, mock placement and all learner roots remain unchanged. Node quick 83/83 and PR CI
  `34494776380` passed; direct Linux Chrome evidence covers 320/375/390/430px light/dark, cycle exhaustion,
  visible Japanese review disclosure and reload restoration.
- S04 v102 adds four TOPIK I time-adverb cards with explicit stable IDs, fixed reviewed choice sets,
  concise selected-choice feedback and optional evidence→traps→method coaching in ko/ja/en/zh. Inventory and
  automated/AI review details are in `docs/qa/shorts-review-s04-time.md`; human review and learner timing stay open.
  Local Node v24 and branch CI `34532452034` pass 97/97; that CI also covers Linux Chrome emulation at
  320/375/390/430px in both themes, concise wrong-answer recovery, expanded coaching and reload restoration.
  Bundled ko/ja/en/zh examples render without network translation. Physical devices remain unverified.
- S04 candidate v103 adds four TOPIK II connective-adverb cards for result, contrast, addition and limiting
  condition. Each uses one short relation judgment, fixed reviewed choices, choice-specific ko/ja/en/zh feedback,
  bundled full examples, and evidence→traps→method coaching. The bounded review ledger is
  `docs/qa/shorts-review-s04-topik2-linkers.md`. Local Node 22 and PR #122 CI `34557440568` pass 98/98;
  that CI also covers 320/375/390/430px Linux Chrome emulation in both themes, selected-wrong feedback,
  expanded coaching and reload restoration. Physical devices and learner timing remain unverified.
- Next: add one bounded TOPIK II cause/concession grammar batch. Quantity alone is not progress, and a new P0 or clear
  wrong answer takes precedence. At least 52 I / 58 II additional distinct sets remain even before suitability review for the 140/level
  planning floor; this is not the final expansion target. Timing 5–15 seconds is unmeasured and never forced.
- Follow start → understand → recall/speak/write → review → next learning for Japanese beginners, and
  passage evidence → specific distractor traps → reusable solving method for TOPIK I/II.
- 2026 draft gates: Sep 13 audit/scope/dependencies; Sep 27 core flow/P0/P1/backup; Oct 11 teaching,
  language, review and one RPG course; Oct 18 freeze/RC; Oct 19–Nov 2 real beta; Nov 2–15 review buffer.
  Nov 17 is conditional first public release, Dec 1 a fallback review date, not a promised approval.
- Report evidence and gaps at each weekly gate. #110's 12-person beta targets (10 first-step successes,
  9 next/review discoveries) are small-sample goals, never QA-seed statistics or industry benchmarks.
  Actual day-1/day-7 recall, real iPhone/Android evidence, and approved post-release 14-day stability remain open.
- Autonomous publishing is GitHub Pages only. Store accounts/payment/identity, signing keys, external
  tester invitations, personal-data collection, store submission and publication need separate owner approval.
  Stop on PAUSE. Only pause the recurring loop for owner stop, all-work blockage, or completed #110 gates.
- Current-pass checks, documentation PR/merge and live verification belong in #110's progress comment.
  Unseen states and unrun tests must remain unverified, including corpus-wide translation completeness,
  corpus-wide explanation and grammar correctness, A06/A07 physical-mobile reproduction, actual iPhone/Android, audio, offline recovery,
  and real learner delayed recall. Corpus-wide grammar-translation correctness remains unverified beyond A05.

## Stable product state

- Production is a dependency-free static PWA in `okometsbu-beep/topik-quest`, hosted on GitHub
  Pages. It must remain usable without login.
- Browser progress is local-first. Existing storage keys, saved questions, vocabulary, review
  intervals, game state, and settings are compatibility contracts.
- The runtime bank contains 2,144 original practice items: the immutable 2,088-item generated bank
  plus 56 type-focused items in `data/question-bank-practice-v1.js`. Generated bank parts are build
  output and must not be opened or edited for non-content work.
- Travel Mode is an independent Seoul learning-adventure below Game Mode and cannot overwrite a
  timed mock exam. Its first route is Incheon Airport T1 → Seoul Station → Myeongdong.
- Travel scenes compose generated pixel-art backgrounds, player skins, NPCs, props/rewards, and UI
  tiles as separate layers. Do not bake characters into backgrounds or replace travel art with emoji;
  keep localized and accessible text as HTML above the generated surfaces.
- Travel exploration uses `data/travel-map-seoul-v1.js` for world/district/zone/collision/POI/portal data
  and the DOM-free `travel-rpg-engine.js` for movement. Add Seoul one verified zone and portal at a time;
  never duplicate the engine inside a route pack or draw the whole city as one untestable canvas.
- The first spatial slice has separate Incheon Airport T1 Arrivals, Transport Center, and Airport Railroad
  Concourse zones joined by bidirectional portal connections. Player zone, position, facing, steps, and discovery IDs are stored
  under the existing route episode's `exploration` field in `malbitStoryV1`; rewards are one-time.
- Beginner missions follow situation → action → visible world reaction → reward or recoverable time
  cost. The first route varies the input as dialogue, sign hotspot, and ticket-machine action instead
  of presenting six visually identical worksheets.
- Hangul Start keeps its existing reading and recognized-handwriting progress in `malbitBeginnerV1` and
  adds grammar only under the nested `grammarV1` field. `data/beginner-grammar-v1.js` owns a reviewed
  9-chapter, 64-lesson absolute-beginner course covering word order, particles, tense, speech endings,
  negation, connective endings, modifiers, 받침-dependent selection, contraction, honorifics, counters,
  and major irregular conjugations. Every lesson must show the condition and contrasting form branches,
  original examples, a common trap, a typed transformation drill, and per-Hangul-unit handwriting; both
  practices are required for completion. Keep Korean/Japanese/English/Chinese coaching in the data owner.
- Before grading, Travel answer choices expose Korean only; the selected and correct translations are
  revealed afterward. NPC quests use multi-turn dialogue, and free composition accepts a reviewed set
  of meaningful non-canonical sentences for a limited smaller reward.
- The first airport NPC lesson saves a five-turn Korean exchange, requested-only translation, the first
  wrong keyword, and two progressive hint stages inside the existing route episode. Re-entry resumes the
  same turn; a hinted resolution remains an honest missed first attempt for score and review.
- Arrivals owns one independent 3×4-tile cheongsachorong welcome prop. Its two collision cells are declared
  with the visual, its investigation teaches `어서 오세요` without treating `어서` as a hurry command,
  and its 200-travel-won reward is idempotent under the existing discovery contract.
- Bank, Game, and Travel explanations follow evidence → distractor/selected-choice analysis → reusable
  type-solving tip. TOPIK II writing uses separate short-fill, expository-fill, graph-summary, and essay
  plans. Game battle rendering must not force `scrollIntoView` or smooth page scrolling.
- Myeongdong follow-ups now progress from free NPC composition to Hangul sign building and a Korean
  price-board budget quest. The budget quest uses only game travel won, records one idempotent
  `street-food` spend under `malbitStoryV1`, and states that stall prices can vary.
- Travel Mode keeps privacy-free local funnel counters under `malbitStoryV1.metrics`: route starts,
  first completions, first Myeongdong entries, first collectible-exchange sessions, and the Myeongdong
  price quest's starts, first clears, pre-clear wrong submissions, and aggregate wallet-after-clear.
  The on-device Travel card shows derived rates and average remaining travel won; no event, identifier,
  timestamp, device detail, or counter leaves the browser.
- Travel UI follows the saved system/light/dark preference. Do not force `colorScheme`, paint a whole mode
  bright, or use a near-black placeholder tile as scenery. Map art stays unfiltered while cards, controls,
  text, borders, and focus states use theme tokens. Every UI change must pass both Travel themes plus
  320/375/390/430px containment, symmetry, 44px touch-target, console, and durable-storage checks.
- Travel zones use a 48×36, 25px tile contract. Every ground cell references an explicit catalog entry
  with atlas coordinates, terrain, walkability, and layer; the browser paints individual tiles and never
  a full-map `<img>`. Legacy 12×9 saved coordinates migrate once to version 2 without changing the storage key.
- `data/travel-tiles-korean-street-v1.js` owns the first reusable Seoul streetscape catalog independently
  from the airport migration maps. Its 4×4 WebP atlas contains 16 64px source tiles for sidewalks, roads,
  straight curb boundaries, crosswalks, tactile paving, and lane marks. Every entry declares terrain,
  walkability, orientation, ground layer, and four edge materials; a non-playable 12×8 fixture is the
  mobile seam/theme gate and must not be added to `world.zones` as a shortcut.
- Purpose-named corner and junction sibling catalogs extend that foundation without changing the airport
  world. The corner sheet owns four inner and four outer turns; the junction sheet owns four oriented T
  centers, four cross variants, approaches, and a 20×12 all-entry fixture. T centers expose three road
  exits plus one closed sidewalk edge, while cross centers expose four traversable exits.
- The building-entrance sibling catalog owns thresholds, stairs, step-free ramps, and transparent upper
  facades. A separate decoration sibling catalog owns 16 text-free signs, awnings, planters, and street
  details. Every decoration declares its actor baseline, upper occlusion, and collision footprint; only
  seven floor-standing props block one cell. Both catalogs remain isolated from playable airport zones.
- `data/travel-block-korean-street-v1.js` composes a non-playable 12×10 Seoul block using only IDs from
  the five reusable catalogs. Its validator resolves each catalog-owned edge, walkability, upper baseline,
  and collision footprint; it rejects unknown IDs, broken named routes, invalid ports, and footprint drift.
- The same owner composes isolated 12×10 blocks east-to-west, north-to-south, and as a four-block
  2×2 grid. Its adjacency validator rejects
  overlapping blocks, mismatched full seams, reused or non-adjacent ports, non-opposing directions,
  different materials, non-walkable endpoints, incomplete internal links, and reused external exit
  coordinates while keeping every fixture out of playable zones.
- Travel movement keeps the live tile and sprite DOM in place for a 110ms player step and 160ms camera
  follow. Pointer-held SVG direction controls repeat until release, blocked movement stops silently, and
  reduced-motion devices settle immediately without map opacity, filter, or brightness changes. The five
  map controls and their SVG children suppress iOS callout, selection, and drag while ordinary learning
  copy remains selectable.
- Travel exploration stores a versioned 10,000-step stamina record inside the existing episode
  `exploration` field. Only successful movement spends stamina; blocked input is free and exhausted input
  is ignored. At 0%, a separate unfiltered 4:3 rest-lounge image owns the full-height game-over screen.
  One-hour rest resets only stamina and position to the current zone spawn while retaining discoveries,
  rewards, route answers, wallet, inventory, and lifetime exploration steps.
- The default `traveler-blue` skin owns one optimized transparent 8×4 sprite sheet. Rows are
  down/left/right/up; columns 0–3 are a 4fps idle loop and 4–7 are a 12fps walk loop. Every frame uses
  the same `.5,.9375` foot anchor and one preloaded image URL, so movement must not swap `src`, opacity,
  filter, or brightness. Player and visible NPC containers share the same near-one-tile scale; NPC art
  has an idle loop. Clear/perfect reward skins intentionally keep the prior static fallback.
- Travel exploration is map-first: the 4:3 world stays aspect-correct at full viewport height, the camera
  follows both axes around interior tiles with 1.2× vertical overscan, and location, objective, travel
  status, D-pad, and interaction controls are compact overlays. Viewport resizing snaps camera bounds
  before restoring movement interpolation so no empty edge flashes. Investigation copy expands only
  while a discovery is open.
- Travel zones declare upper-foreground silhouettes, object baselines, and collision cells together.
  Ground, foot-depth actors, and upper foreground render as separate DOM layers; signs, kiosks, ticket
  gates, machines, and planters reuse exact pixels from the unfiltered map rather than a dark overlay.
  The entire world is an isolated stacking context below HUD controls, so scaled Y-depth cannot cover UI.
- Player and visible NPC contact shadows render in their own layer between ground and actors. Each
  shadow shares the actor's foot coordinate and depth, stays the same DOM node through movement, and
  uses a small bounded pixel oval instead of a baked image filter or scene-wide dark paint.
- Each Travel zone can declare bounded lamp, screen, or window highlights with position, size, color,
  and strength. They render in a separate environment layer between ground and contact shadows;
  validation rejects out-of-bounds effects, opacity above 0.65, and mobile coverage large enough to
  become a scene-wide tint. The original map, actors, and foreground remain unfiltered.
- Travel world data owns the mobile performance budget: at most 1,728 ground tiles, 256 upper tiles,
  and 2,048 live board DOM nodes per zone. The real-Chrome movement probe samples 47 animation frames
  and rejects p95 above 34ms or more than 15% of frames above 50ms.
- Travel exploration exposes one reusable cue plan for portal enter/arrive, investigation discovery,
  first reward, NPC entry, and return. Each 70–220ms state animates only the active control, marker,
  reward text, or location HUD; the map and viewport never receive opacity, brightness, or filter
  animation. `MALBIT_TRAVEL_CUE_HOOKS` is an opt-in adapter boundary: sound and vibration callbacks are
  ignored unless their individual booleans are explicitly enabled, and reduced-motion settles at once.
- Game Mode now uses semantic spacing, type, surface, border, and accent tokens through the purpose-named
  `game-visual-system.js` final owner. Equipment, rarity, stage, run-slot, and map-node tiles follow the
  saved system/light/dark preference and must stay readable rather than near-black. CI checks both themes
  at 320/375/390/430px for symmetry, overflow, 44px controls, 10px copy, contrast, and screenshot evidence.
- Home uses the same semantic contract through `home-visual-system.js`. The hero remains scenic, while
  level controls, Quick Practice, full mock, speaking, weekly-goal, and bottom-navigation surfaces resolve
  to white cards only in light mode and navy surfaces in dark mode. CI rejects a mixed light/dark shell.
- Shorts uses `shorts-visual-system.js` as the final visual owner for question, choice, graded feedback,
  instructor coaching, and save-proposal surfaces. All use the shared theme tokens; CI checks light and dark
  unanswered/graded cards at all four widths while preserving coaching and the existing progress root.
- Random Practice uses `random-practice-visual-system.js` as the final visual owner for both TOPIK I and II
  headers, stats, questions, choices, graded states, translations, and expandable coaching. These resolve
  through the same light/dark surface and state tokens; CI checks both themes without changing stored sessions
  or the Japanese evidence → distractor → type-solving structure.
- Review uses `review-visual-system.js` as the final visual owner for its TOPIK I/II filter, queue, retry sheet,
  requested translation, graded state, and detailed option elimination. Queue and sheet surfaces follow the
  selected theme; CI checks both themes, resolution, and re-entry while preserving `malbitWrongReviewV3`.
- The old Story Mode is retired from product UI. Travel Mode deliberately keeps the legacy
  `malbitStoryV1` root and scene IDs so saved answers, clears, and best scores migrate in place.
- `storage-guard.js` keeps a last-known-good `malbitRecoverySnapshotV1` of durable learner roots.
  Backup import is additive for keys missing from old files; only the explicit full-reset action
  may clear the recovery snapshot.
- Vocabulary cards open `vocab-editor.js` for multilingual meanings, simple Korean definitions,
  examples/translations, origins, notes, TTS, source, and review metadata.
- Vocabulary automatic fill preserves manual edits. `MALBIT_AI_ADAPTER` is only a safe integration
  boundary; the current static app has no generative-AI server or provider key.

## Known gaps and deferred work (audit defects are tracked in #110)

- No account or cloud sync: clearing browser storage or changing devices does not carry progress.
- Real AI-generated examples and etymology require a server-side endpoint. The current fallback uses
  reviewed local data and automatic translation where available.
- TTS defaults to an optional zero-fee local neural pack: ten Supertonic 3 voices, learner-friendly
  `0.82` speed, an explicit one-time ~230 MB download, and no text upload or client API key. The
  pack is lazy, separately cached, removable, and falls back to ranked device voices if absent or
  unsupported. Mobile and low-memory browsers never initialize the large ONNX sessions because the
  fp16 CPU path can exceed mobile tab memory; they use device TTS and can remove an existing pack.
  All voice and speed controls stay in the single detailed More-screen setting.
- A returning GitHub Pages tab can briefly show the previous release while its service worker swaps;
  closing and reopening the tab completes the update without deleting progress.
- Travel has static bounded highlights but no weather or time-varying environment effects yet. Future
  effects must reuse the independent environment layer and must never simulate night with a black scene overlay.
- The cue contract currently owns airport exploration interactions. Myeongdong dialogue/reward screens
  still need to adopt the same states; no audio files or persistent sound/vibration controls ship yet.
- Current airport tile catalogs migrate the existing three backgrounds into explicit per-cell atlas entries.
  The reusable Korean street foundation now covers straight segments, typed inner and outer curb corners,
  T/cross junctions, building entrances, decorative upper layers, one validated block, and east-west,
  north-south, plus 2×2 neighboring-block compositions. An isolated Seoul street zone data contract is
  deferred behind #110 core learning gates; these fixtures are not playable Seoul learning progress.
  Other NPCs still need the keyword-learning contract, and the cheongsachorong is only the first Korean
  investigation object.

## Execution defaults

- A request to explain, review, or plan is read-only.
- A request to modify means implement and verify locally.
- A request that explicitly includes deployment means: one version bump for public asset changes after the coherent batch (none for docs-only changes),
  full check, mobile flow check, branch/PR, CI, merge, and live smoke.
- The connected GitHub integration can publish without GitHub CLI. Do not ask the user to install
  `gh` merely because it is absent inside a temporary workspace.
- Autonomous development uses a standalone GitHub-connected ChatGPT Scheduled task at Asia/Seoul
  00:00, 06:00, 12:00, and 18:00. Durable instructions live in `loop/PROMPT.md`, product intent in
  `docs/DESIGN.md`, current state in `docs/STATUS.md`, and phone input in `[AI 지시]` GitHub Issues.
- Each autonomous pass handles one bounded task and at most one PR. Passing changes may deploy to
  GitHub Pages; App Store and Google Play publishing stay disabled until signed release lanes exist.
- Payment UX is quarantined. Until a separate monetization discussion and explicit user approval,
  do not add prices, purchase/subscription buttons, paid locks, Premium/Plus labels, upsells, external
  payment links, or placeholder stores anywhere in the app.
- Ignore `TOPIK_public_sources_bundle*.zip` unless the requested change actually concerns question
  content, provenance, or rebuilding the bank.

## Compact task packet

Before editing, reduce each request internally to four lines: outcome, owning files, acceptance
check, and whether release is requested. If those are inferable, proceed without a clarification
round trip.
