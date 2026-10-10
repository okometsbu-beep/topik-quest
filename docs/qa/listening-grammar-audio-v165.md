# Listening grammar audio correction, v165

## Bounded change

- 21 question IDs, 13 exact labelled scripts, ten unique M1 recordings.
- Seven Korean object-particle errors corrected. Six non-exercise hobby recordings also replace the exercise claim with `꾸준히 취미 활동을 하는 것이`.
- Exact old/new texts, text hashes, voices and question IDs: `generated-korean-audio-repairs-v165.json`.
- Current coverage stays 1,050 questions / 843 scripts / 360 unique texts / 363 voice-specific clips.
- The other 353 currently referenced MP3s retain their exact original bytes.
- Ten previous MP3 URLs remain for already-open older clients, isolated from the current corpus. Physical files: 373; current files: 363; compatibility files: ten. No fuzzy lookup or alias maps an incorrect script to a different recording.

## Reproduction and provenance

Synthesis used the existing repository generator, same CPU/M1/8 steps/speed 1.0 and per-corpus-index seed. The full corrected corpus was staged in a temporary cloud output directory, with existing clips linked read-only for exact manifest hash checks and generation-progress entries. This skipped the existing 353 clips and synthesized only the ten missing corrected IDs. The final source-rebuilt corpus matched the generation corpus exactly, including voice selection and row ordering.

- Model: `supertone-oss-archive/supertonic-3`, revision `aafc6e32416a594460b32413efc49d7fe4ce6d46`.
- Official reference helper: `supertone-oss-archive/supertonic`, main revision observed `1e9799e964ea4c0dad7cde993b65c3c813a7b373`; helper.py SHA-256 `b14b1da8a018aa4db6ca8cbb927c32590bfc889b49116ea344c56e8351d94279`.
- Python runtime: ONNX Runtime 1.31.0, NumPy 2.3.5, SoundFile 0.14.0; FFmpeg MP3 encoding remains 44.1 kHz mono / 64 kbit/s with -18 LUFS/-2 dBTP targets.
- Official model and helper LICENSE files were byte-for-byte identical to the repository's existing OpenRAIL-M and MIT license copies. Model metadata reported public, ungated access. No account, credentials, paid API, or new service was used.
- Build-only model and Python dependencies remain outside the repository; no model weights or runtime binaries are published.

## Verification boundaries

Exact source-to-hash mapping and audio decoding establish artifact consistency, not pronunciation quality. Native-listener pronunciation review and physical iOS/Android playback are still unverified. Automated browser playback checks are recorded separately by the integration owner.

## Local verification results (2026-10-10 UTC)

- All 373 physical MP3s decoded with FFmpeg and passed finite-sample, duration, peak, RMS and no-clipping checks.
- Current manifest: 363 referenced clips, 31,987,232 bytes. Newly generated ten clips: 2,124,496 bytes.
- Existing 353 current clips retained their original SHA-256 hashes exactly.
- Source-rebuilt corpus equalled the synthesis input corpus, including ordering, voices and all ten corrected text IDs.
- `node --test tests/listening-audio.test.cjs tests/listening-player.test.cjs`: 33/33 passed.
- Compatibility clips are separately declared and checked; current script lookup rejects the old 13 script strings and resolves the exact corrected strings.
- Actual listening/pronunciation review was not performed; available tools did not expose an audio-listening or transcription capability. Decode and hash success do not establish spoken-text accuracy or naturalness.
