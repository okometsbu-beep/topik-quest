# S04 · TOPIK I housework-action Shorts pilot

Candidate: v131 on `agent/loop-20260922-topik1-bounded`. Production remains v130
`bfc3f89121f3477a964f474ec378391b3c37dbf8`; product rollback baseline is v129
`8a33bd6025243187d3f569e3ddd85f432ed4cc94`.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 400 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the object and result of a familiar household task:

- `청소하다`: make a room or place clean
- `빨래하다`: wash clothes, towels, or other fabric items
- `설거지하다`: wash and put away used dishes after a meal
- `요리하다`: turn ingredients into food

The examples name an unambiguous living room, clothes to wear, action after dinner, or ingredients
from a refrigerator. Selected-choice feedback explains the chosen task before optional full coaching
compares all four. Fixed choices are shuffled and restored through the existing stable-ID storage
contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-I-W-HOUSEWORK-01` | `652bb215132a879d28853755e526075564c33868d89f4db9a19ed85a4ceb89fd` | `손님이 오기 전에 거실을 청소했어요.` |
| `S04-I-W-HOUSEWORK-02` | `b4e8b9181df4c9ec8cd9507d0d43a06fc8374c1be974e71de2c0a9c96969c27e` | `입을 옷이 없어서 주말에 빨래했어요.` |
| `S04-I-W-HOUSEWORK-03` | `b387892b7b5b835686d4e541fed5b4eb0bb688bd001749f62f59f948d3ca3da4` | `저녁을 먹은 뒤 설거지했어요.` |
| `S04-I-W-HOUSEWORK-04` | `eb12579565d6ac7f65466f278d47cb7ae44af2ed951585ae8c5d6a7118c6f159` | `냉장고에 있는 재료로 요리했어요.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One familiar task and one concrete object/result per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Room cleaning, fabric laundry, post-meal dishes, and cooking are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reusable object/result method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example, and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 34/34; content checks pass 37/37. |
| Full release checks | pass | Node 24 `npm run check` passes 131/131; runtime contract reports v131, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pending | PR CI must cover 320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching, next-first flow, and reload restoration. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | No PR merge or GitHub Pages deployment has been claimed for v131. |

Candidate inventory is 404 rows / 278 exact question-choice families (TOPIK I 140, TOPIK II 138).
The existing 126 redundant rows, 30 duplicate groups, 15 structural review candidates, 0 answer
conflicts, and 0 approvals do not change. These totals are not content approvals, and no existing
Shorts row, original bank item, answer, or stable ID is altered.
