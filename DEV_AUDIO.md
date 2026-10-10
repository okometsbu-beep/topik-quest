# Harumal listening audio pipeline

## Current listening priority

1. Exact matching script in `HARUMAL_LISTENING_AUDIO` → Supertonic 3 pre-generated MP3 sequence.
2. Existing uploaded question recording, where present.
3. Explicit device speech fallback chosen by the learner after an unavailable/failed recording. A failed recording is never reported as completed.

`listening-player.js` owns the shared TOPIK I, TOPIK II and growth transport. It uses exact catalog resolution before any legacy URL lookup. The cancel generation is established before asynchronous lookup, so late HEAD results cannot restart an old question. Short word and generic text reading uses device speech immediately at the saved settings speed, without opening the listening transport. New reading requests, navigation and settings dismissal cancel prior playback. Full listening questions retain the shared player. Settings previews use the existing female/male Supertonic 3 recordings for the displayed sample; device-voice tests remain explicitly labelled inside the device-voice details.

The four playback rates are 0.75, 1, 1.25 and 1.5. Existing `malbitTtsPrefsV1` fields are preserved. Recorded dialogue duration is the sum of actual browser media metadata and authored silences/inter-speaker gaps; seeking stays disabled until every duration is known. Exam seeking remains disabled. Growth hearing evidence is recorded only after uninterrupted playback; moving the seek bar to the end does not count as hearing. An exam attempt is consumed only on actual playback start, restored after an error, and remains consumed after a learner stops already-started playback. Loading can always be stopped. Device speed changes restart the current sentence because browser speech cannot reliably change rate mid-utterance.

Local regression page: `tests/fixtures/listening-player.html` (real existing audio, deliberate missing-file case, no reward writes). Transport tests cover cancellation races, metadata, rates, gaps, seeking, errors and exam semantics. Physical iOS/Android and human pronunciation review remain separate checks.

The full inventory is `audio/listening/v1/corpus.json`; every input question ID, exact script,
voice-specific segment, MP3 hash and byte count is traceable through corpus and manifest.
Do not key generated-bank audio only by visible question number: `bankId` and script vary.

There is no on-device model download or live synthesis in the active application. Generic
word/grammar read-aloud remains device TTS. Do not embed cloud API keys in static client code.

Existing `audio/topik1/q001.mp3` and `audio/topik2/q001.m4a` style paths remain compatible as
legacy fallback. The old recording-studio route is a hidden UI, not authentication.

See `audio/listening/v1/README.md` for the build, licensing, playback and validation contract.
