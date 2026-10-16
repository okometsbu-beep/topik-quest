# Original listening audio, frozen batch 3

This batch contains the 30 reviewed O05 TOPIK I listening questions selected from
the 748-item authoring source on 2026-10-15, excluding all IDs in batches 1 and 2.
It has 27 exact scripts and 67 distinct spoken text/preset pairs: F1 34, M1 33.
No exact text/voice pair matches either prior pack, so all 67 clips are new.

The L24 snapshot is the final approved dialogue about avoiding uncertain directions
to a park. Its approved core SHA-256 is
`57a7964b9be303c3dda611904b6b9198b132cb7c9ef972b0d9b8085f50897880` and its script
SHA-256 is `f28c9bc22165128f0ca7a6a86bad0a1702b065040eeefd8eb8b22a22f87ec447`.
The discarded earlier photo-related draft is not used.

All thirty scripts were checked for consistent polite speech and explicit speaker
gender labels. The gender-unspecified 안내자 role is assigned F1 as a production
choice. L25–26, L27–28 and L29–30 intentionally share their respective scripts.
Only script utterances are synthesized; labels, instructions, choices, answers and
explanations are excluded. The approved source questions remain unchanged.

Generation uses the already provisioned local Supertonic-3 model and existing voice
styles, with the same pinned runtime, license and parameters as the prior packs.
No new install, paid service or external synthesis API is involved. Batches 1 and 2
and all older recordings remain immutable.

```sh
node scripts/build-original-listening-corpus.mjs --pack original-v3 --check
/path/to/venv/bin/python scripts/generate-original-listening-audio.py \
  --output audio/listening/original-v3 \
  --model-dir /path/to/model --helper-dir /path/to/reference/py
/path/to/venv/bin/python scripts/verify-original-listening-audio.py \
  --output audio/listening/original-v3
node scripts/build-original-listening-catalog.mjs --pack original-v3
node --test tests/original-listening-v3.test.cjs
```

The separate catalog exposes `HARUMAL_ORIGINAL_LISTENING_AUDIO_V3`. It retains an
empty `byId` and `verified: false` during preparation. Only complete technical
verification produces the source-hash-bound ready entries. The corpus and manifest
record exact mapping, hashes, duration, MP3 encoding, decoded waveform and level
checks. Actual listening, pronunciation, meaning and device playback are not
certified. Generation does not deploy or activate a service.
