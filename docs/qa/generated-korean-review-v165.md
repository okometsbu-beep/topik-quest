# Generated Korean source review, v165

## Written-content result

- 382 of the 2,088 original packed rows changed, with 737 changed field cells.
- 84 listening-question rows receive situation/wording clarification: four picture-selection families (24 rows, six per family) and five speaker-action families (60 rows, one of each family in every mock set).
- 298 other rows receive 341 particle corrections in written fields. These cover 42 distinct malformed noun-plus-particle forms.
- The common batchim helper handles 은/는, 을/를, 이/가, 과/와 and 으로/로, including the ㄹ exception. Normalization is restricted to 44 reviewed noun slots: 20 topic names, four graph subjects, eight hobbies and 12 essay topics. It does not guess particles from arbitrary words or rewrite verb endings.
- The four picture families no longer infer gender, location, or an action already underway from dialogue that only establishes an intended action. All choices and matching visual descriptions retain their positions.
- The five action families now distinguish an address-correction request, intended equipment return, presentation-order change, warranty inquiry, and volunteering-method inquiry. Prompts ask about the conversation situation rather than asserting execution is already underway.
- These are clarity corrections, not evidence that the original answer index was wrong. Every answer index is preserved.

## Provenance and rebuild

The original imported JSON at `../upload/02-topik_question_bank.json` is unavailable in this workspace. The existing sanctioned recovery command was used:

```sh
node scripts/rebuild-question-bank-from-packed.mjs
```

That script losslessly reconstructs all 20 documented packed fields into a temporary JSON source and calls `scripts/build-question-bank.mjs`. No generated part was hand-edited. The builder now records `source_provenance` in the manifest, explicitly identifying reconstruction rather than implying access to the original authored upload. The source hash is the reconstructed input's hash.

A second rebuild produced byte-identical content in all four payload files. The expected manifest timestamp/input provenance metadata may change between rebuilds; it is not a payload change.

## Verification and limits

- Focused generated-language tests: 6/6 passed.
- Focused generated-language plus existing exact-audio tests: 15/15 passed.
- `npm run test:content`: 87/87 passed.
- `npm run check:runtime`: v165, all bank part hashes valid.
- `git diff --check` passed for the owned source, manifest and test.
- Compared all rows against the pre-repair snapshot: IDs, order, level, section, question number, type, difficulty, answer keys, target skills, rubrics and stimulus groups are unchanged; all 20 packed columns remain present.
- Written-content phase changes no listening-script strings. Existing tests verify all 1,050 listening questions still resolve to the exact catalog and all 363 MP3 hashes remain valid.
- Automated checks cover all 2,088 original rows for schema/key/script preservation, repair idempotence, known written noun slots, manifest hashes and unique choices.
- Semantic review covers the nine dialogue source families across their 84 instances and the 44 interpolated noun slots. This is not a claim of an independent native-language educator review of every question or of human pronunciation review.

## Coordinated audio-source phase

After the written phase was committed separately (`bc0513e`), the audio worker confirmed the first corrected M1 synthesis had succeeded and authorized the coordinated source update. The ten exact corpus-text mappings below were appended to `scripts/lib/listening-script-repairs.json` (38 total maps), then the normal recovery/builder command was run again. No MP3 or audio-catalog file is owned by this source worker.

- Exactly 21 listening-script cells changed, matching the 13 fully specified labelled scripts in the handoff. There are now 395 changed rows / 758 changed field cells relative to the pre-review bank, including the written phase.
- Focused generated-language/source tests pass 7/7. The immutable pre-review signature remains enforced after reversing only these 21 explicitly reviewed audio-script corrections; no answer index or other metadata delta is allowed.
- All known malformed interpolated particles are absent from the regenerated bank's written fields and listening scripts.
- Updated audio corpus/catalog and ten regenerated MP3s still require the audio worker's integrated hash/decode/coverage verification. Source-focused success alone is not release acceptance.

### Reviewed source changes

The broad residual scan found seven malformed noun-particle strings in preserved listening scripts. They affect 21 questions, 13 exact labelled scripts and 10 unique recorded text/MP3 files, all M1:

| Original → correction | Affected question IDs |
| --- | --- |
| 원격 근무을 → 원격 근무를 | M01-II-L-18, M07-II-L-20, M08-II-L-17 |
| 음식물 쓰레기을 → 음식물 쓰레기를 | M03-II-L-19, M10-II-L-18 |
| 사진 찍기을 → 사진 찍기를 | M02-I-L-29, M02-I-L-30, M10-I-L-29, M10-I-L-30 |
| 요리을 → 요리를 | M03-I-L-29, M03-I-L-30, M11-I-L-29, M11-I-L-30 |
| 자전거 타기을 → 자전거 타기를 | M04-I-L-29, M04-I-L-30, M12-I-L-29, M12-I-L-30 |
| 독서을 → 독서를 | M05-I-L-29, M05-I-L-30 |
| 그림 그리기을 → 그림 그리기를 | M06-I-L-29, M06-I-L-30 |

Six of those hobby clips (12 rows: the photography, cooking, reading and drawing rows above) also describe their nonexercise hobby as `꾸준히 운동하는 것이`. The proposed bounded semantic correction is `꾸준히 취미 활동을 하는 것이`. Cycling and the other actual exercise hobbies do not need that semantic replacement.

Exact original/corrected texts, clip hashes, voices, file paths and every affected ID are recorded in `docs/qa/generated-korean-audio-repairs-v165.json`. Those source mappings are applied, and the coordinated audio phase regenerated the ten affected clips and validated the exact catalog. See `docs/qa/listening-grammar-audio-v165.md` for decode, waveform and hash verification. The original fixed signature is retained, with only the authorized 21-row script delta normalized back for verification.

## Owned files in this phase

- `scripts/build-question-bank.mjs`
- `scripts/lib/listening-script-repairs.json` (coordinated audio-source phase only)
- `data/question-bank-v1-part1.js` through `part4.js`
- `data/question-bank-manifest.json`
- `tests/generated-korean-quality.test.cjs`
- This review and `docs/qa/generated-korean-audio-repairs-v165.json`

No version bump, commit, push, merge, deployment, storage migration or audio-file modification was performed by this worker.
