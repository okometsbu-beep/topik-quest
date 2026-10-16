# Original listening audio, frozen batch 1

This pack is generated locally from the 220 approved listening questions present in
the 578-item source snapshot on 2026-10-15. It covers 178 exact scripts and 510 unique
spoken text/preset pairs. The ten response blanks become 1,200 ms pauses. Speaker
labels, question instructions, options, answers and explanations are never synthesized.

`source-snapshot.json` preserves the exact approved question objects and the SHA-256
of the source file at the start of this batch. The evolving main authoring file is
not read by subsequent audio builds. `corpus.json` records source review hashes,
exact script hashes, casting decisions and every expected MP3 path. Existing source
questions keep `audioStatus: "unavailable"`; recorded availability is derived from
a separate matching runtime catalog rather than changing reviewed content.

## Voices and provenance

Synthesis uses the already installed official Supertonic-3 revision
`aafc6e32416a594460b32413efc49d7fe4ce6d46`, the pinned MIT reference helper and CPU
ONNX Runtime. The prior environment's verified downloads and package pins are in
`docs/qa/listening-audio-execution-v1.json` and
`docs/qa/listening-audio-build-requirements.proposed.txt`.

- Explicit 여자/남자 labels map to stock F1/M1 presets.
- Other role labels receive documented production casting. Jobs, names and titles
  are not treated as evidence of a character's gender.
- The two three-role discussions use F2 for the introductory moderator and M1/F1
  for the debaters. `additional-voice-provenance.json` pins the 292,423-byte F2 JSON
  from the same approved model revision. No extra executable code or model weights
  are installed. This uses the same OpenRAIL-M license already accepted for the model.
- Shared exact scripts have identical casts. Reuse is allowed only for identical
  text and voice. This batch has no exact text/voice matches in the retained older
  packs, so all 510 clips are newly synthesized in this directory.

The 373 pre-existing MP3s and 60 register-correction MP3s remain byte-for-byte intact.
No script or learner information is sent to a synthesis service. No model, Python
environment, helper code or FFmpeg executable is shipped in the web application.

## Reproduction and verification

From the repository root, with the separately provisioned environment:

```sh
node scripts/build-original-listening-corpus.mjs --check
/path/to/venv/bin/python scripts/generate-original-listening-audio.py \
  --model-dir /path/to/model --helper-dir /path/to/reference/py
/path/to/venv/bin/python scripts/verify-original-listening-audio.py
node scripts/build-original-listening-catalog.mjs
node --test tests/original-listening-audio.test.cjs
```

The resumable generator hashes its exact text input and each finished MP3. Its
shipped `generation-records.json` binds those hashes to the frozen corpus and records
the helper/voice-style hashes and synthesis parameters, so re-verification does not
depend on temporary resume state. It uses
eight denoising steps, speed 1.0, deterministic per-row seeds, and a loudness filter
targeting -18 LUFS/-2 dBTP before 44.1 kHz mono 64 kbps MP3 encoding. The manifest
independently decodes every MP3 and checks its duration, finite waveform, peak/RMS,
integrated loudness, true peak, content hash, generation-input hash and file mapping.
The catalog builder rejects missing files, invalid review hashes, stale manifests,
unexpected files and duplicate encoded audio under different text/voice identities.

`data/original-listening-audio-v1.js` is emitted only after the complete pack passes
technical checks. It exposes `HARUMAL_ORIGINAL_LISTENING_AUDIO.byId`, with
`sourceContentSha256`, `sourceScriptSha256`, the exact script and its segments.
The application must still require an exact approved-content/script match before
deriving recorded availability. A missing catalog never justifies substitution
with an older question's recording.

Technical verification is not listening QA. Pronunciation, spoken meaning,
naturalness, perceptual separation of stock voices, native-speaker review and
physical-device playback are not certified. The manifest states these limits
explicitly. Local file generation does not activate or deploy the service.
