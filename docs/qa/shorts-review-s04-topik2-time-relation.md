# S04 · TOPIK II time-relation Shorts pilot

Candidate: v120 on `agent/loop-20260918-topik2-time-relation`.
Production remains v119 `584b42f86b062eb18932aac541ed2ffcfc3b723d`; product rollback is v118
`5d7b03c73c21276523b8c56d00d7e0d347b0fea3` until this candidate is deployed.
Scope: four new TOPIK II grammar cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 356 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the temporal relation between two actions:

- `-자마자`: the second action follows immediately after the first
- `-고 나서`: the second action follows after the first is completed
- `-는 동안`: the two actions overlap during one interval
- `-기 전에`: the tested action happens before the reference action

Selected-choice feedback explains the chosen temporal trap before optional full coaching compares all
four relations. Fixed choices are shuffled and restored through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-II-G-TIME-01` | `47e60ada2300c19de604d3c6587de537724b2ae105c1d212b6a71ee410df6979` | `집에 도착하자마자 손을 씻었어요.` |
| `S04-II-G-TIME-02` | `140e093a166a1717c2538cc700647be27b96ad7ab0a1ed63a72c6edeb467e2ea` | `회의를 마치고 나서 보고서를 보냈어요.` |
| `S04-II-G-TIME-03` | `c54d1fa3c3e6e752c0c717bb8db579a8821618bb830b5285821db867dbf8cb10` | `기차를 기다리는 동안 책을 읽었어요.` |
| `S04-II-G-TIME-04` | `8986c19d5109be67ef940eab20f995b63ca18d3d6ab0dbfae879f0e222e47293` | `잠자기 전에 알람을 맞췄어요.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One form and one explicit time relation per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Immediate succession, completed sequence, overlapping interval, and prior action do not overlap in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a time-axis method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK II rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 23/23; content checks pass 26/26. |
| Full release checks | pass | Node 24 `npm run check` passes 120/120; runtime contract reports v120, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pending | Verify 320/375/390/430px light/dark, wrong-answer feedback, expanded coaching, next-first flow, and reload restoration. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | Merge only after CI and visual inspection; then verify GitHub Pages v120 and hashes. |

Candidate inventory is 360 rows / 234 exact question-choice families (TOPIK I 116, TOPIK II 118).
The 15 existing structural review candidates do not increase. These totals are not content approvals:
the generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.
No existing Shorts row, original bank item, answer, or stable ID is altered.
