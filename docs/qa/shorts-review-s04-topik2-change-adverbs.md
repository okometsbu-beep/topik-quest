# S04 · TOPIK II change-adverb Shorts pilot

Candidate: v130. Product rollback baseline: v129
`8a33bd6025243187d3f569e3ddd85f432ed4cc94`.
Scope: four new TOPIK II word cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 396 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the duration and magnitude of a change:

- `점차`: a state or value changes little by little over time
- `일시적으로`: a state lasts only for a short limited period
- `지속적으로`: a change or activity continues over an extended period
- `급격히`: a state or value changes by a large amount in a short time

The examples make the cue explicit through `처음에는 ... 늘고 있습니다`, `오늘 오전`,
`5년 동안`, or an abrupt rise after heavy rain. Selected-choice feedback explains the chosen
function before optional full coaching compares all four. Fixed choices are shuffled and restored
through the existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-II-W-CHANGE-01` | `b6d07632d48179ac9972d7e7bf3d0f450bc0d130bfe77cf1cc00bba961450b88` | `처음에는 적었지만 이용자가 점차 늘고 있습니다.` |
| `S04-II-W-CHANGE-02` | `0dd314e6e671dbe7408d51afccead3df040e3a6d302eae63b5808f10481d897b` | `시설 점검 때문에 오늘 오전에 서비스가 일시적으로 중단되었습니다.` |
| `S04-II-W-CHANGE-03` | `0b85527bc65d2775e31890e7a5f083418313916cfec90d1cf1096d07885e4a33` | `이 지역의 관광객 수는 5년 동안 지속적으로 증가했습니다.` |
| `S04-II-W-CHANGE-04` | `1e20a61d34c17a2356045922dff194b2ea40ce452cac6491365d07a6488d2082` | `폭우가 시작된 뒤 강물의 수위가 급격히 높아졌습니다.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One adverb and one explicit duration/magnitude cue per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Gradual progression, temporary duration, continued duration, and sharp magnitude are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reusable duration/magnitude method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example, and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK II rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 33/33; content checks pass 36/36. |
| Full release checks | pass | Node 24 `npm run check` passes 130/130; runtime contract reports v130, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pass | PR #170 CI `35682292167` covers Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10675775494` screens `00dk`/`00dl` were inspected. Local Chrome remains unavailable. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | No production change until PR CI, visual evidence inspection, merge, Pages, and live smoke pass. |

Candidate inventory is 400 rows / 274 exact question-choice families (TOPIK I 136, TOPIK II 138).
The 15 existing structural review candidates do not increase. These totals are not content approvals:
the generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.
No existing Shorts row, original bank item, answer, or stable ID is altered.
The inspected light screenshot shows the deliberately wrong temporary choice, the correct gradual-
change answer, and choice-specific Japanese feedback. The dark screenshot shows next-first flow and
the complete evidence → traps → duration/magnitude method without horizontal clipping. This is Linux
Chrome emulation rather than physical-device evidence.
