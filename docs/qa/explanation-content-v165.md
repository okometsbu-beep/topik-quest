# v165 explanation/content review

This report distinguishes semantic reading from automated structural checks. Passing a corpus test does not certify every sentence or translation as pedagogically correct.

## Curated vocabulary and grammar

Source: `data/shorts-levels.js` (246 entries: TOPIK I 116, TOPIK II 130).

- Read all 246 Korean terms/examples and Japanese meanings for semantic fit.
- Rewrote all 143 lexical entries (words, expressions and idioms) to a natural Japanese equivalent followed by a parenthetical plain-Japanese gloss. Natural phrases are used where a one-word equivalent would distort the meaning. Grammar choices were not mechanically reformatted.
- Read all 144 fixed-choice cards' Korean/Japanese term definitions and Japanese example translations/rationales. These cards share 36 authored four-way contrast groups. Each group's four definitions serve as its selected-choice explanations.
- Corrected the shared hidden-context bug in all 144 cards and all four locales: immediate coaching now explains the visible term. Full coaching begins with that definition, then explicitly labels and prints the Korean example, its translation, and the example-specific rationale. The list containing the correct and incorrect meanings is now called “Choice comparison,” rather than “Distractor traps.”
- Read the deterministic distractor combinations for all 67 non-fixed lexical cards in the vocabulary-only runtime. Removed the ambiguous `바꾸다` / `교환하다` pairing without changing the correct-answer slot or card identity.
- Further semantic fixes: `-(으)ㄹ 정도로` had the two clauses reversed in all four definitions; Japanese `-는데도` now contrasts the result with expectation, not fact; `-(으)ㄹ 생각이다` no longer falsely requires an undecided plan; `-(으)ㄹ지도 모르다` is not restricted to future events; `대책` includes prevention; the `-는 대신에` example now actually uses the displayed verb-attached construction. Polished Japanese expansion/reduction example wording.
- Automated checks cover all 143 Japanese lexical labels, all 144 fixed answer indices/choice uniqueness/definition-first feedback/labelled examples in ko/ja/en/zh. A baseline comparison confirmed unchanged entry order, term, type, level, explicit ID and answer index for all 246 entries.
- Also read all 144 fixed-choice immediate definitions in English and Chinese after the corrections. The remaining English/Chinese fields receive shared structural/identified semantic corrections and whole-corpus localization checks; this is not a sentence-by-sentence reread of every field of all 246 entries.

## Beginner grammar

Source: `data/beginner-grammar-v1.js` (64 lessons).

Read all 64 formulas, variant examples, Korean drill explanations and Korean/Japanese caution notes. This is a focused rule/feedback pass, not a new exhaustive four-language review of every field.

Corrected four lessons:

1. `adjective-modifier`: `크다 → 큰` keeps vowel ㅡ and adds ㄴ batchim; it does not drop 으.
2. `hieut-irregular`: removed the incorrect `ㅏ + ㅓ → ㅐ` derivation for `파래요`.
3. `past`: earlier clauses can carry past marking depending on ending and meaning.
4. `and-sequence`: tense and subject honorifics are not forbidden in earlier clauses.

Added regressions for these distinctions.

## Verification and release boundary

- Curated/beginner/browser-contract focused tests: 53 passed.
- Initial content lane: 85 passed before the final engine rule pass; the integrated release check is recorded separately by the release owner.
- Updated 19 Japanese lexical browser fixtures, answer assertions, and comparison headings to the reviewed text; browser-script syntax passed. This is not evidence of a browser run.
- Initial explanation edits did not change bank source answers. Follow-on written-source and audio corrections are documented below; stable answer indices and learner storage remain preserved. No paid translation service was added.
- Browser/mobile/live-deployment verification belongs to the integrated release. Do not infer it from the Node checks above.

## Generated-bank explanation engine

Runtime inventory: 2,144 rows = 2,088 generated base rows (2,040 multiple choice + 48 writing) plus 56 authored expansion multiple-choice rows. Of the 2,096 multiple-choice rows, 71 have custom coaching (15 base overrides + all 56 expansion rows); 2,025 use the generic engine.

Reviewed all 22 MCQ rule families (20 currently active plus practical/general fallbacks), including both blank and nonblank inference branches: 23 reason packs, 23 comparison/trap packs, 23 strategy packs, 13 distractor branch packs, and four writing-task plans. These contain four-language strings. Read 32 representative/boundary questions together with their sources and answers, rather than claiming a semantic reread of all 2,144 rows.

Rule repairs:

- Preserve times, prices and labelled notice facts; strip only known dialogue-speaker prefixes rather than arbitrary text before a colon.
- Separate causal reasons from communicative purpose (73 reason-mode rows).
- Choose evidence for the selected distractor rather than reusing the correct choice's evidence everywhere.
- Separate blank completion from inference without a blank; do not fabricate blank-position instructions.
- Allow an inserted demonstrative to refer to a whole situation, not only a prior noun.
- Separate presentation structure (36 rows) from attitude; passage-wide expression questions (12 rows) from imaginary word-meaning targets.
- Headline and sentence-order methods no longer assume every source has a causal/event narrative.

Ten new regression tests cover these rules and all 2,144 runtime rows: localized explanations; shuffled answer alignment; four distinct/nonempty choices and choice explanations; no undefined/object placeholders; retained notice times; and quoted evidence from the source, actual choice, or legitimate answer insertion in all 2,025 generic MCQ. This does not prove all source answers or translations correct and does not deduplicate separate source rows.

Semantic sample IDs: M01-I-L-{01,07,11,15,17,22,05,18,29}; M01-I-R-{31,34,37,40,43,49,52,57,59,36,41}; M01-II-L-{04,48,50}; M01-II-R-{19,25,42,18,21,28,44,47}; M03-II-R-27.

The sample pass also identified source-generation wording/ambiguity issues: unsupported gender in M01-I-L-15, current-action wording inconsistent with the conditional offer in M01-II-L-04, and malformed Korean particles. The source-builder follow-on repaired the intended question contract without changing answer indices. Action coaching now quotes the complete short exchange, including the request and conditional response, and distinguishes requests, plans, ongoing actions and completion. English sentence-ending quotes no longer append a duplicate full stop.

## Other authored source layers

These inventories overlap runtime sources and must not be added as unique question totals:

- `data/explanations-i18n.js`: 174 legacy mappings (TOPIK I 30 listening + 40 reading; TOPIK II 50 listening + 50 reading + four writing) and 15 base bank-coach overrides.
- Growth: 11 recipes / 22 tasks.
- Writing curriculum: 37 items.
- Vocabulary grammar: seven full records read across ko/ja/en/zh; no further correction identified.
- Travel: eight adventure learning items plus eight unique pack learning items (six base + two taxi variants). The pack has 12 narrative/choice/ending scenes, which must not be counted as 12 learning questions.

The initial inventory was followed by the semantic passes below. These are separate source layers, not an additive count of unique questions.

The regenerated Shorts inventory has 189 active runtime cards (143 curated lexical + 46 bank), 161 distinct question/choice sets and 28 repeated rows. Its generated reviewed/approved counters remain zero deliberately: structural metadata is not a manual approval ledger.

## Follow-on growth and writing review

Read all 22 growth tasks in Korean (source, choices, answer, hint, retry and rationale), plus their 11 Japanese rules and all 22 Japanese prompts/hints/retries/rationales. The two listening tasks added morning/afternoon qualifiers in six choices that the audio did not state. Removed only those qualifiers; exact audio strings and correct choice IDs stay unchanged. A dedicated regression locks this distinction and the localization-preservation hash documents the intentional six-label update.

Read all 37 writing items' Korean prompts, facts, models and teacher notes alongside Japanese prompts and support/meaning guidance. No additional confirmed content defect was found in that pass. Existing model/form, content-localization and rendering tests remain the automated coverage; no new claim of automatic semantic grading is made.

Growth/writing focused verification: 42 tests passed.

## Follow-on legacy and travel review

All 174 legacy items were compared against the Korean question source and intended answer in all four explanation languages (696 localized explanation entries). This was question/answer/rationale review, not a claim to have reread every UI or option translation field. Actual visual assets for TOPIK II listening 1–3 were also inspected.

Corrected 44 legacy explanation entries (TOPIK I reading 3; TOPIK II reading 31, listening 7, writing 3) plus two base-bank coach entries. Fixes include responses not yet spoken being described as already heard, invented entry/deadline claims, overly generic answer-number explanations, and imprecise purpose/causal advice.

Added explicit ordering/reference cues to legacy reading 13, 18 and 46 to remove competing plausible arrangements while retaining each intended answer. In TOPIK I reading 50, replaced the ambiguous distractor `하세요` (which can naturally pair with `목도리`) with `푸세요`; the correct answer position is unchanged. Aligned one writing model's Japanese source/wording (RW53).

Travel review read all 16 actual learning items, including source, choices, answer, evidence, distractor explanations, method and recall guidance in all four languages. No further correction was identified.

Authored regression file: `tests/authored-explanation-quality.test.cjs` (12 focused tests initially passed).

## Follow-on generated source and audio boundary

See `generated-korean-review-v165.md` for exact source rules, counts and verification. The builder-reviewed change covers 395 rows / 758 cells: nine dialogue families / 84 situation-clarity rows; 44 reviewed noun slots / 341 written particle occurrences across 298 rows; and 21 corrected recorded-script cells. These counts overlap. IDs, order, taxonomy and answer indices stay unchanged.

The 21 affected listening questions correspond to 13 labelled script strings and ten unique recorded texts. Twelve of those questions also called photography, cooking, reading or drawing exercise; the revised wording refers to a hobby activity. Exact old/new strings, clip paths and hashes are in `generated-korean-audio-repairs-v165.json`. The coordinated audio task reports ten replacement M1 clips, 363 active catalog entries, ten retained legacy clips (373 physical files), successful ffmpeg decode/waveform checks for all 373, and 33/33 focused audio tests. Human pronunciation review and browser playback evidence remain distinct from decode/catalog checks; see the audio/release record.

## Follow-on custom-bank coach review

Read all 71 custom-coached rows against their sources and answer keys in Korean/Japanese. Also read all 15 base override English/Chinese packs and all 72 newly authored selected-choice explanations in four languages. Compared every option in the 56 expansion items; the 26 blank items received an explicit 104-alternative substitution pass. Generated English/Chinese runtime explanations for every expansion row were not all reread line-by-line.

Corrected 21 expansion rows / 48 Korean-Japanese reason or trap fields. Five rows had hard-coded original choice numbers that became wrong after shuffling; the remaining 16 affected rows received evidence, distractor-judgment or natural-language improvements (some changes overlap). Valid collocations and causal readings are no longer called grammatically impossible merely because they are not the task's intended relation.

Five written-only clarifications make the intended answer unique while preserving the answer keys and all option strings: a personal-closet cue in P01-I-R-09, and explicit requested relations in P01-I-R-16, P01-I-R-17, P01-I-R-27 and P01-II-R-15. Six rows now have three explicit distractor explanations in four languages (72 explanations), including the online-only evidence for the claim that documents must be delivered in person.

`tests/bank-coaching-quality.test.cjs`: five tests passed; content lane 87 passed. Identity, answer-key and option hashes for all 56 expansion rows and exact scripts for all eight listening rows were preserved. Two base-coach fixes are included in the legacy pass above, not counted twice as new unique items.

All content-source writers are frozen after these reviews. Final integrated content/inventory and audio/release outcomes should be attached to the release record rather than inferred from these overlapping focused runs.

## Final content integration checkpoint

After all content writers froze, regenerated and checked `shorts-inventory.json` against final source hashes. The inventory reports 189 active cards, 161 distinct question/choice sets, 28 repeated rows and three structural review flags. Flags are length/review signals, not automatic content rejections; generated reviewed/approved counters remain zero.

A combined run of the ten affected content test files passed 125/125 (`/tmp/content-audit-final.log` during this execution). It includes engine, legacy, custom coach, generated-source, curated vocabulary, beginner grammar, growth/localization and writing-content checks. The release owner runs the full aggregate/runtime/mobile/deployment gates separately.

The corrected ten audio clips are a coordinated follow-on; the saved scripts/corpus and new playback files must be published together. No remaining known audio-text discrepancy from the identified 21-row repair set is intentionally deferred. This does not claim external teacher review of the entire 2,144-row bank.
