# MALBIT compact handoff

This is the short continuity record for future work. Use it with `AGENTS.md`; do not reconstruct
these facts from conversation history or the large TOPIK source bundle.

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
- Beginner missions follow situation → action → visible world reaction → reward or recoverable time
  cost. The first route varies the input as dialogue, sign hotspot, and ticket-machine action instead
  of presenting six visually identical worksheets.
- Before grading, Travel answer choices expose Korean only; the selected and correct translations are
  revealed afterward. NPC quests use multi-turn dialogue, and free composition accepts a reviewed set
  of meaningful non-canonical sentences for a limited smaller reward.
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
- Travel UI uses nine-slice generated frames with explicit safe-area content wrappers. Never stretch a
  square frame over variable copy, absolutely position learning content, or truncate essential Japanese.
  Every UI change must pass 320/375/390/430px containment, sibling-overlap, 44px touch-target, console,
  and durable-storage checks before merge.
- Game Mode now uses semantic spacing, type, surface, border, and accent tokens through the purpose-named
  `game-visual-system.js` final owner. Equipment, rarity, stage, run-slot, and map-node tiles must stay
  readable rather than near-black. CI checks 320/375/390/430px symmetry, overflow, 44px enabled controls,
  10px minimum support copy, tile brightness, console errors, and screenshot evidence.
- The old Story Mode is retired from product UI. Travel Mode deliberately keeps the legacy
  `malbitStoryV1` root and scene IDs so saved answers, clears, and best scores migrate in place.
- `storage-guard.js` keeps a last-known-good `malbitRecoverySnapshotV1` of durable learner roots.
  Backup import is additive for keys missing from old files; only the explicit full-reset action
  may clear the recovery snapshot.
- Vocabulary cards open `vocab-editor.js` for multilingual meanings, simple Korean definitions,
  examples/translations, origins, notes, TTS, source, and review metadata.
- Vocabulary automatic fill preserves manual edits. `MALBIT_AI_ADAPTER` is only a safe integration
  boundary; the current static app has no generative-AI server or provider key.

## Known gaps, not bugs

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

## Execution defaults

- A request to explain, review, or plan is read-only.
- A request to modify means implement and verify locally.
- A request that explicitly includes deployment means: one version bump after the coherent batch,
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
