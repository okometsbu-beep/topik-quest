# Supertonic 3 listening-question audio

The app plays static speech files for listening questions only. There is no model download,
real-time synthesis, new inference server or embedded API secret in the public runtime.
Vocabulary, grammar examples and other arbitrary reading continue to use device speech.

## Source traceability

`corpus.json` links every question ID to its exact normalized listening script and ordered
spoken segments. `listening-audio.js` performs exact script matching, not a fuzzy word lookup.
The source inventory currently contains:

- Original bank: 960 listening questions.
- Additional authored practice: 8 listening questions.
- Existing TOPIK I: 30; existing TOPIK II: 50.
- Growth listening: 2.
- Total: 1,050 questions and 843 distinct full scripts.
- 360 distinct spoken strings / 363 voice-specific clips, with repeated strings reused.

Explicit male/female role labels control M1/F1. Fictional actor pairs are cast consistently.
Nested host labels are metadata, not spoken words: host F1 / expert M1. Unlabelled narration
uses F1. Label stripping recognizes only known role prefixes; it never strips arbitrary text
before a colon. Two response blanks become 1,200 ms pauses; answer options are never voiced.

## Playback

One Audio element plays the requested script, with 380 ms between ordinary turns. A new
request, navigation or dismissal cancels old playback and pending pauses. On a file error,
the caller receives only the remaining script for device-voice fallback, not the entire
already-heard script. An interrupted current turn may need to restart with device speech.
Existing exam replay restrictions are preserved.

Optional MP3s do not gate service-worker installation and partial Range responses are not
cached by the app. Internet access is required; this is not a guaranteed offline voice pack.

## Build and validation

1. `node scripts/build-listening-audio.cjs` rebuilds the inventory and runtime map from source.
2. `scripts/generate-static-korean-voices.py --model-dir PATH --helper-dir PATH` generates only
   required preset/text pairs using separately downloaded official assets and helper.py.
3. `python3 scripts/verify-static-korean-voices.py` decodes every expected MP3 and writes the
   byte/hash/duration/waveform manifest. Remove unused generated clips before committing.
4. Run the full test suite and check all changed source hashes before publishing.

Model snapshot: `supertone-oss-archive/supertonic-3` at
`aafc6e32416a594460b32413efc49d7fe4ce6d46`. Korean, 8 denoising steps, speed 1.0;
44.1 kHz mono MP3 / 64 kbit/s, loudness target -18 LUFS / -2 dBTP.
See `docs/THIRD_PARTY_NOTICES.md` for OpenRAIL-M and MIT notices.

Decoding and waveform checks do not prove correct pronunciation or naturalness. Native-listener
review, exhaustive audio-to-text verification and physical iPhone/Android playback remain
separate validation steps. No synthetic-audio quality claim is inferred from file hashes.
