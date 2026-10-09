# Listening-only prerecorded voice candidate — 2026-10-09

## Final user scope

On-device real-time synthesis was explicitly cancelled. The active app now loads no AI model,
shows no model download/activation control and generates no audio on the learner's device.
Only listening questions use the generated Supertonic 3 files. General vocabulary/grammar
read-aloud remains device speech. The earlier broad 224-string prerecorded pack was removed.
The historical `neural-tts.js` source is not part of the runtime loader.

## Complete listening inventory

- Generated bank: 960 listening questions.
- Authored expansion: 8.
- Legacy TOPIK I: 30; legacy TOPIK II: 50.
- Growth listening: 2.
- Total: **1,050 question IDs**, **843 normalized scripts**, **360 spoken strings**,
  **363 voice-specific MP3 files** (F1 female / M1 male).

`audio/listening/v1/corpus.json` maps every source ID to its exact script and ordered clips.
`manifest.json` records every MP3 path, SHA-256, bytes, decoded duration, peak and RMS.
Only known role prefixes are removed. Nested `진행자:` prefixes found in 20 authored strings
were fixed before generation. Host/expert roles use F1/M1 consistently. Two answer blanks
become 1.2-second pauses; answer choices are not synthesized.

## Source content corrections

The original bank contained 28 distinct particle/connector defects across 65 repeated rows.
They were corrected in the authored pipeline and generated bank before affected audio was
regenerated (source commit `8800ddc`). An additional 48 ambiguous wrong choices were repaired
without changing narration, question IDs or answer keys (source commit `6b07240`). These are
bounded reviewed fixes, not a certification that all question language/content is flawless.
Old text-hash audio and other unused generated clips were removed.

## Playback and safety

`listening-audio.js` performs exact full-script lookup and sequential file playback using one
Audio element. New playback, navigation and dismissal settle/cancel the previous promise.
File failure returns the remaining script for device speech, avoiding a full-script restart;
an interrupted current line may restart. The legacy fallback loops stop on cancelled/error/
unavailable results instead of restarting after dismissal. Growth listening also validates
session and phase before fallback and cancels playback when changing lessons/stages.
Existing exam replay limits and all learner storage roots remain unchanged.

Audio files are optional network resources, not mandatory service-worker shell assets.
The app does not promise all listening audio works offline, and does not cache partial Range
responses. The source label distinguishes generated listening files and device fallback.

## Audio verification

All **363 files** decoded successfully to finite, non-silent PCM. Combined MP3 bytes:
**31,956,719 bytes (30.48 MiB)**. Every file has a distinct hash and every expected clip exists.
No model weights or executable inference dependencies are included in the active download.

A bounded independent check also reviewed eight clips structurally and found the inherited
source grammar issues above. ASR installation was not completed; no automatic transcription
or exhaustive pronunciation comparison is claimed. Actual iPhone/Android playback and
native-listener assessment remain unverified; decoding does not prove naturalness.

## Validation and release

Final runtime, syntax, content, data-preservation and playback tests are run after the final
source/audio manifest. The separate release owner performs publication, browser CI and live
verification. This local report alone is not a deployment confirmation.

Final local result: `npm run check` passes **410/410 tests**, parses **147 JavaScript files**,
and verifies runtime **v161 / 66 ordered files** plus bank hashes. Playback-focused tests
including the independent cancellation/source-scope checks pass **18/18**. All 363 MP3s
were decoded before the final test; maximum duration 55.1523 s, peak 0.821594, minimum
RMS 0.064308. `git diff --check` passed. Public CI and live verification remain release tasks.
