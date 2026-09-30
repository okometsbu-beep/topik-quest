# S04 · TOPIK I morning-routine Shorts candidate

Candidate: v154. Product rollback baseline: v153
`ace86c3600080693ac440dcaaf373f141fa1f960`.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 424 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about a different everyday morning action:

- `일어나다`: rise from bed after sleeping
- `씻다`: clean the face, hands, or body with water
- `갈아입다`: remove current clothes and put on different ones
- `준비하다`: get needed items or conditions ready beforehand

The examples explicitly name getting up at seven, washing face and hands, changing after exercise,
or preparing a bag and umbrella. Selected-choice feedback explains the learner's choice before
optional full coaching compares all four. Fixed choices are shuffled and restored through the
existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-I-W-ROUTINE-01` | `d42fa04b06ef45f0a9e5ac2aefbea76feab8f62cda3016d8043e50fddc6fc607` | `저는 아침 일곱 시에 일어나요.` |
| `S04-I-W-ROUTINE-02` | `4bf26367542f420fb5f3e0e151a8454d2cf9412c594e1c54adcb8d4dd51ff9b7` | `일어나서 얼굴과 손을 씻었어요.` |
| `S04-I-W-ROUTINE-03` | `b218ff38c046d708ba857363bbc7d2c5be60aeba9e7b643c1f580421efc422a1` | `운동이 끝난 뒤 새 옷으로 갈아입었어요.` |
| `S04-I-W-ROUTINE-04` | `6311b939b91d9847a87c7e5bf6723619c1ff00b1bdb2a0065bf6947bd760f0b8` | `가방과 우산을 미리 준비했어요.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One action and result per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Rising, washing, changing clothes, and preparing do not overlap in these examples. |
| Explanation | AI-reviewed pass | Selected-choice feedback plus decisive evidence, all four traps, and a reusable action/result method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example, and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |

Candidate inventory is 428 rows / 302 exact question-choice families (TOPIK I 152, TOPIK II 150).
The existing 126 redundant rows, 30 duplicate groups, 15 structural review candidates, 0 answer
conflicts, and 0 comprehensive approvals do not change. These totals are not content approvals, and
no existing Shorts row, original 2,088-item bank entry, answer, or stable ID is altered.

## Release record

Fill after branch CI, merge, Pages, live smoke, and direct representative-screen inspection.
Physical iPhone/Android, native Japanese or Korean educator review, consenting learner timing,
D1/D7 recall, and full offline recovery remain unverified.
