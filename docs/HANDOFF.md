# MALBIT compact handoff

This is the short continuity record for future work. Use it with `AGENTS.md`; do not reconstruct
these facts from conversation history or the large TOPIK source bundle.

## Stable product state

- Production is a dependency-free static PWA in `okometsbu-beep/topik-quest`, hosted on GitHub
  Pages. It must remain usable without login.
- Browser progress is local-first. Existing storage keys, saved questions, vocabulary, review
  intervals, game state, and settings are compatibility contracts.
- The bank contains 2,088 original practice items. Generated bank parts are build output and must
  not be opened or edited for non-content work.
- Story Mode is an independent mode below Game Mode and cannot overwrite a timed mock exam.
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
- Ignore `TOPIK_public_sources_bundle*.zip` unless the requested change actually concerns question
  content, provenance, or rebuilding the bank.

## Compact task packet

Before editing, reduce each request internally to four lines: outcome, owning files, acceptance
check, and whether release is requested. If those are inferable, proceed without a clarification
round trip.
