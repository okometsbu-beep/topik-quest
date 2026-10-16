# Original exam collection: reviewed staged release

## Scope and safeguards

Target: 12 separate TOPIK I sets (840 items) and 12 TOPIK II sets (1248 items), adding 2088 original questions to the existing 2144. The old bank payloads, IDs, answer keys and learner progress are preserved. A 60-item pilot is only a subset, never an extra complete release.

The new `original12-v1` collection uses O01–O12 IDs and independent rotation keys. Old saved sessions without a collection remain in `legacy-original-v1`. Selecting a collection or set never starts the clock or clears progress. An incomplete, unreviewed or missing-picture set cannot start, including through direct engine calls.

Source is `content/original-exams-v1.json`; structure/type/point coverage is `content/original-exams-coverage.json`. Build through `scripts/build-original-exams.mjs`, not by editing generated payloads. `--allow-partial` builds a partial collection. The complete collection remains a 2088-item/24-set target. A staged release is allowed only through an explicit versioned release-scope manifest binding all four source files, exact reviewed item/audio counts and per-locale complete sets; every included item and asset must pass review. Incomplete sets remain locked.

These are newly authored app questions based on exam formats, not reproduced past papers or official predictions. New listening availability is derived from separately verified, exact-source audio catalogs. Unrecorded scripts remain explicitly unavailable and offer device speech; generated clips are labelled synthesized audio. No paid TTS or fabricated audio metadata is used.

## Review integrity

Each accepted content review is bound to SHA-256 of recursively sorted-key compact UTF-8 JSON, excluding `qa`, `visualReady`, `requiresVisual`, and `reviewReady`. Edited content loses review readiness until reviewed again. Original-content QA requires answer uniqueness where applicable, bilingual rationale, duplicate review, appropriate speech register and visual review. Image bytes require matching reviewer asset hashes.

Automatic checks include canonical IDs, exact slots/points, shared-stimulus consistency, four distinct options and current shuffled-answer mapping, authored Korean/Japanese option explanations, writing model lengths, and exact duplicate detection ignoring option order and dialogue-label changes. Such checks cannot establish every semantic nuance or prove exhaustive copyright uniqueness.

## Pilot review

The initial local pilot contained 60 approved, hash-bound text items: TOPIK I reading 16/listening 10, TOPIK II reading 16/listening 10, and writing 8. Independent AI text review checked answer uniqueness, both-language coaching, register and original-content comparison. The pilot is a subset of the growing collection, not a complete release. The generated manifests record current import and readiness counts. New listening scripts are explicitly unrecorded until generated audio is separately validated.

## Writing pilot

Eight writing items cover O01/O02, types 51–54. Independent AI text review checked task logic, accepted variants, Korean/Japanese explanations, register, table values and model lengths. No blocking issues were found. This is not certification by a human teacher or an official scoring service. Type 53 models contain 229/248 characters; type 54 models contain 639/643, counting spaces/punctuation and excluding line breaks.

Self-check rubrics are learning guidance. TOPIK I results remain the existing accuracy-based learning score, explicitly labelled for the new collection; official weighted-score certification is not claimed. Existing long-writing history limitations are unchanged.

## Verification status

Local semantic/unit tests and HTTP checks are available. Actual mobile rendering is pending: the installed Chromium exits during launch, and the supported cloud browser cannot reach the session-local HTTP server. The release CI runs the existing real-Chrome harness; a local launch limitation does not count as browser success.

## Localization support

Core text approvals remain immutable. Separate reviewed support packs bind every translation and explanation to the approved core-content SHA-256; every listening translation additionally binds the exact Korean-script SHA-256. `scripts/build-original-support.mjs` checks independent approval hashes, full turn reconstruction and exact answer-cue substrings before including support. EN/ZH coaching and writing criteria are companion fields; Chinese uses simplified `zh`. Missing translations show a localized pending notice, never an automatic Japanese substitute. Completion of the full collection requires all 2088 items in four languages and all 960 listening questions with current-source recordings. The staged release validates every included listening question and independently gates each locale/set.

`listening-transcripts.js` shows a collapsed transcript only after a practice answer is submitted or a complete mock exam is finished. An active TOPIK II mock or saved unfinished TOPIK I mock suppresses it. Selected-language text and Korean original are separate; only reviewed exact evidence spans are highlighted. Retry translation cannot reveal listening scripts before submitting the retry. Wrong-answer retries have their own audio playback, cancellation and explicit device fallback. An unfinished mock blocks retry entry, submission, translation and feedback, including late asynchronous responses from an older retry. Both completed exam reviews include listening dialogue review. Actual rendered browser/mobile checks remain pending.

## Listening playback default

The previous code default was 1.0. The new unset/fallback rate is 0.85; 0.75 remains an explicit player option. Existing saved rates, including custom rates such as 0.90, remain exact rather than snapping to a preset. Native clips, later dialogue segments, gaps and explicit device speech use the selected speed. Speed changes apply directly without a popup or a separate speed-control button.

## Local import

Run `npm run import:original -- /path/to/reviewed-manuscripts`, then `npm run build:original:support`. Only current hash-approved core and asset bytes are copied; draft items are withheld. Support packs are checked separately. The entire incoming snapshot, image bytes and support packs are validated before replacing current sources. Importing never publishes by itself. The versioned release integrates the separately reviewed intro after exact-commit CI.

## Mock answer order

Only the new collection shuffles option rows at exam start. The exact per-question order is saved with the session and last result; reload, grading, wrong-answer review, visual options and choice-specific coaching use the same order. Sequence labels inside option text remain untouched. Existing mock sessions retain their fixed ordering. A missing saved answer slot is not interpreted as slot zero.

## Rendered checks awaiting execution

`HARUMAL_ORIGINAL_CONTENT_ONLY=1 node scripts/check-travel-mobile.mjs` covers four locales, both themes, 320/390px component layouts, actual SVG decode, data tables, translated transcript cues, per-locale readiness, actual wrong-answer retry playback/cancellation and submission, and a complete TOPIK I submit/reload/review sequence. It is registered in the full browser suite. Syntax/unit validation of the harness is not evidence of actual browser success.

## Existing structured tables

The 12 legacy type-53 JSON passages now have an exact-data table overlay. Every title, agency label, year, value, unit, participant-group change and both stated causes is preserved. The display labels this as authored practice data; these agency strings are not treated as verified external research. Original payloads, IDs, accepted-answer criteria and model answers are unchanged. Raw JSON stays in the source passage while the learner sees the table and prompt. This is a presentation transformation, not a new approval of the old model answers. Mobile rendering remains pending.


## Original audio batches

The first fixed batch covers 220 approved questions, 178 distinct scripts and 510 voice-specific clips. Total decoded duration is 4076.5684 seconds, with 32,898,775 MP3 bytes. Every clip passed decoding, source-input mapping, file hash, loudness and clipping checks. These checks do not establish pronunciation, naturalness, spoken meaning or physical-device behavior. A second fixed batch adds 50 approved questions, 35 scripts and 100 clips, bringing the total to 270 questions, 610 clips and 5311.5125 decoded seconds. A third batch adds 30 questions, 27 scripts and 67 clips. Combined coverage is 300 questions, 677 clips and 5624.4172 decoded seconds (45,375,902 MP3 bytes). Earlier snapshots and all existing recordings remain unchanged while later approved questions are generated in separate batches. A stale, missing or unverified catalog never grants recording availability. A separate v4 catalog rebinds O01-II-L27 after an independently approved two-field Korean/Japanese coaching correction. Its script, options and answer remain byte-identical; five existing clips are reused, with zero new recordings and no increase in unique question counts. Frozen earlier catalogs stay unchanged. A fifth catalog adds O04-II and O06-I: 80 questions, 62 distinct scripts and 174 new clips (1462.2681 decoded seconds, 11,795,516 bytes). After the fifth batch, unique totals were 380 questions, 302 scripts and 851 clips (7086.6853 seconds, 57,171,418 bytes). Every new file passed technical verification; source snapshots, generation records and exact-byte catalog are frozen under `audio/listening/original-v5/`, with the technical report in `docs/qa/original-listening-audio-v5.json`. A sixth catalog adds O05-II and O07-I: 80 questions, 62 scripts and 166 new clips (1552.012 decoded seconds, 12,510,934 bytes). After the sixth batch, unique totals were 460 questions, 364 scripts and 1017 clips (8638.6973 seconds, 69,682,352 bytes). The interrupted sixth generation resumed from 124 hash-verified checkpoints; all 166 files were then decoded and verified. Its frozen corpus and report use `original-v6`. A seventh catalog adds O06-II and O08-I: 80 questions, 62 scripts and 167 new clips (1346.3519 decoded seconds, 10,866,517 bytes). After the seventh batch, unique totals were 540 questions, 426 scripts and 1184 clips (9985.0492 seconds, 80,548,869 bytes). All 1486 pre-existing audio/catalog/source-record files were rechecked unchanged. An eighth catalog adds O07-II, O09-I and O10-I: 110 questions, 89 scripts and 232 new clips (1767.8966 decoded seconds, 14,275,018 bytes). Current unique totals are 650 questions, 515 scripts and 1416 clips (11752.9458 seconds, 94,823,887 bytes). All 1670 prior boundary files were rechecked unchanged. See `docs/qa/original-listening-audio-v8.json`. Actual audible and browser/device checks remain pending.

## Existing answer corrections

252 legacy questions (168 listening, 84 reading) have an additive, independently reviewed answer repair. Original packed rows, scripts, passages, IDs and correct-answer indexes remain unchanged. The four choices and KO/JA/EN/ZH rationales are corrected, including paraphrased correct answers. Review was independent AI content review, not a human-teacher or psychometric certification. Twenty semantic families remain repeated across the original bank; this repair does not claim that all old duplicates or all advanced-difficulty shortcomings are resolved. Shared coaching payloads are deduplicated only in transport, with no change in question counts or content.

## Existing picture and notice overlays

34 newly drawn SVGs cover 24 existing picture questions and 148 existing notice questions. They are source- and asset-hash guarded and have passed independent AI visual/source review. The final reviewed bytes are connected locally. Exact option-text mapping preserves shuffled answers. Optional notice illustrations do not remove text-solvable items from their previous game eligibility. The separate 12 structured writing tables are already connected. Asset rendering in a vector renderer is not proof of integrated browser/mobile behavior.

## Neutral visual-only choices

Before submission, original picture and graph choices use displayed positions, images and neutral accessible descriptions. Stable scene/graph keys remain private bindings for shuffling, grading and submitted coaching, never visible answer labels. Both TOPIK engines, random/infinity, game reordering/decoys and review retry use the shared `choiceContent` helper. Missing or malformed neutral mappings fail closed to a localized image-unavailable notice. Meaningful legacy text choices remain unchanged.

Some approved SVGs contained the internal keys as painted text. `scripts/build-neutral-choice-visuals.mjs` preserves every original byte and creates display derivatives that remove only exact label nodes, keeping all other markup unchanged. It validates approved source hashes, emits `data/neutral-choice-visuals-v1.js`, and runs after every original-content import. Current coverage is 41 questions, 164 source images, 48 derivatives and 116 already-neutral identity mappings. All 48 source/display pairs were rendered at 260px: 44 differ only in the internal-label area, while four metadata-only removals leave pixels identical. The independently reviewed implementation bytes are unchanged; increment regression is recorded in `docs/qa/visual-choice-labels-v8-increment.json`. This is vector-renderer evidence, not browser/mobile QA.

The regression suite checks every current visual-only item through all 24 option permutations and four locales, including safe missing-helper/catalog fallbacks, image/answer/coaching binding and new retry disclosure. The future browser harness includes decoded neutral-image assertions. Separate independent implementation review and actual browser verification remain distinct gates.
