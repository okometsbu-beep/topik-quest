> Superseded by the later listening-only scope in `docs/qa/listening-audio-20261009.md`. The earlier general vocabulary/grammar pack below was removed before publication.

# Korean voice candidate — 2026-10-09

## Why this architecture

The current PWA uses system `speechSynthesis` on iPhone. Its optional FP16 Supertonic browser
engine is deliberately disabled for all mobile/low-memory devices, and this guard remains.
Removing the guard or relabeling a single system voice as two genders would not fulfill the
request safely. A new dynamic cloud endpoint would need hosting and an operational cost/access
model, while free weights alone do not make inference hosting free.

The bounded candidate uses two genuine pre-generated preset files for each supported text.
It runs without loading a model into the phone. Other text still uses an explicitly identified
fallback. No paid service, account, API key or persistent access was added.

## Exact coverage

224 distinct strings × F1/M1 = 448 MP3s:
- 44 dialogue lines for all 30 original TOPIK I listening items.
- 128 beginner grammar examples (not every drill/prompt).
- 2 growth-listening scripts.
- 49 starter vocabulary headwords.
- 1 settings preview.

Existing recorded TOPIK II audio priority and unsupported text remain unchanged. User-created
vocabulary only uses this pack when its exact normalized text matches. This is not a claim that
all reading has been replaced.

## Runtime

`tts-static-ko.js` loads before `tts-quality.js`. Settings show one female and one male recorded
voice at the top; device/desktop options remain under a collapsed advanced group. Existing
preferences and local progress roots are preserved. Male/female dialogue labels choose their
respective recorded voices. A new playback cancels and settles the old promise. Audio errors,
autoplay refusal and timeout return to device speech without hanging or replaying stale text.
The source indicator reports the engine actually chosen.

Only exact NFC/whitespace matching is permitted; punctuation differences fall back instead of
playing a different utterance. The optional MP3 path bypasses the service-worker cache to avoid
partial-range caching and unbounded audio accumulation. This is not an offline audio pack.

## Verification

- Focused runtime tests: male/female file separation, normalization boundaries, inherited keys,
  cancellation, stale callbacks, missing text, rejected/error playback, preview, device fallback,
  saved settings and iOS model-memory guard.
- Full Node/runtime/syntax suite passed before final corpus materialization (391 tests).
- Final manifest, decode totals and final full-suite outcome will be appended after generation.
- NOT verified: physical iPhone/Android playback; native-listener pronunciation/naturalness;
  comparative improvement against the user's specific installed system voice. Synthetic audio
  samples were generated for listening review, not labeled as subjectively validated.

## Final local verification

- All 448 MP3s decoded successfully to finite, non-silent PCM. Total media size:
  **9,995,705 bytes (9.53 MiB)**; largest file 122,923 bytes.
- Clip duration range 1.3395–15.286 seconds; decoded peak is at most 0.823659,
  below clipping. Minimum RMS 0.034992. F1/M1 file hashes are all distinct.
- `audio/korean/manifest.json` records every file hash, bytes, decoded duration,
  peak and RMS. `corpus.json` records exact source-text coverage.
- Final `npm run check`: **396/396 tests passed**, runtime v161 / 67 ordered
  files, question-bank hashes intact, JavaScript syntax passed.
- `git diff --check` passed. No model weight is added to the repository.
- Separate source QA found no additional P1 issue in matching, interruption,
  stale playback, popup dismissal or optional audio caching.
- Public publishing and physical-device/listener validation have not occurred.
