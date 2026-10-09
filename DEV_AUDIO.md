# Harumal listening audio pipeline

## Current listening priority

1. Exact matching script in `HARUMAL_LISTENING_AUDIO` → Supertonic 3 pre-generated MP3 sequence.
2. Existing uploaded question recording, where present.
3. Device speech fallback. File failure resumes with the remaining script only.

The full inventory is `audio/listening/v1/corpus.json`; every input question ID, exact script,
voice-specific segment, MP3 hash and byte count is traceable through corpus and manifest.
Do not key generated-bank audio only by visible question number: `bankId` and script vary.

There is no on-device model download or live synthesis in the active application. Generic
word/grammar read-aloud remains device TTS. Do not embed cloud API keys in static client code.

Existing `audio/topik1/q001.mp3` and `audio/topik2/q001.m4a` style paths remain compatible as
legacy fallback. The old recording-studio route is a hidden UI, not authentication.

See `audio/listening/v1/README.md` for the build, licensing, playback and validation contract.
