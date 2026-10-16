# Original listening audio, frozen batch 2

This separate incremental pack covers the 50 reviewed O03 TOPIK II listening items
present in the 628-item authoring source on 2026-10-15. Its frozen snapshot contains
35 unique scripts, 100 distinct spoken text/preset pairs and five response blanks.
The prescribed casts use F1 for 55 utterances, M1 for 44 and F2 for the moderator's
single introduction. Unspecified role gender remains unspecified; stock-preset
selection is a documented production choice.

`original-v1` remains immutable. Reuse is permitted only when text and preset both
match a prior corpus entry, its independently verified manifest agrees, and its
MP3 hash remains unchanged. Reused segments keep their prior file URL and record
their source pack. This batch has zero such matches and requires 100 new clips.

The model, pinned helper, packages and F1/F2/M1 styles are the same local assets as
batch 1. No additional model, executable, paid service, credentials or text export
is required. The model license and technical-review limits are described in the
first batch README and the third-party notices.

## Commands

```sh
node scripts/build-original-listening-corpus.mjs --pack original-v2 --check
/path/to/venv/bin/python scripts/generate-original-listening-audio.py \
  --output audio/listening/original-v2 \
  --model-dir /path/to/model --helper-dir /path/to/reference/py
/path/to/venv/bin/python scripts/verify-original-listening-audio.py \
  --output audio/listening/original-v2
node scripts/build-original-listening-catalog.mjs --pack original-v2
node --test tests/original-listening-audio.test.cjs tests/original-listening-batches.test.cjs
```

For preparation only, the verifier and catalog builder accept `--allow-pending`.
The resulting `HARUMAL_ORIGINAL_LISTENING_AUDIO_V2` has `verified: false` and an empty
`byId`, so no unrecorded script is exposed as ready. A successful full verification
allows the same source-bound entry structure used in batch 1. The V2 global never
overwrites `HARUMAL_ORIGINAL_LISTENING_AUDIO`.

These files do not change approved question objects or their `audioStatus`, and do
not deploy or activate a service. File decoding, input mapping and level checks do
not certify pronunciation, spoken meaning, naturalness or actual listening quality.
