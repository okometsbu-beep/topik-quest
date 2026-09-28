# S04 · TOPIK I directional-action Shorts candidate

Candidate: v147. Product rollback baseline: v146
`3cf9154b38a54f1cd9e0200912b98055ca82eb52`.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 408 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the start and destination of a familiar movement:

- `올라가다`: move from a lower place to a higher place
- `내려가다`: move from a higher place to a lower place
- `들어가다`: move from outside to inside
- `나오다`: move from inside to outside

The examples give an explicit second floor, first floor, cafe interior, or classroom exterior.
Selected-choice feedback explains the learner's choice before optional full coaching compares all
four. Fixed choices are shuffled and restored through the existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-I-W-DIRECTION-01` | `1520ca5d909741ffe43999c34cfd7a2db34b0752ce83c1b7e1629d20bf502930` | `계단으로 2층에 올라갔어요.` |
| `S04-I-W-DIRECTION-02` | `e5dfcb0b6ee802f6c91c78c77a980cd3c82d30d4c21728cce152448c090a8a4e` | `수업이 끝나고 1층으로 내려갔어요.` |
| `S04-I-W-DIRECTION-03` | `1f29c7806105ba807a8c960bcaf5efec80b6fe131effcbf94c3a13176edd0801` | `비가 와서 카페 안으로 들어갔어요.` |
| `S04-I-W-DIRECTION-04` | `aecb4dce5288eba438eed01c83af107d5f2c11edcb7322a37c4ad8e9d37bfb7a` | `수업이 끝나서 교실 밖으로 나왔어요.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One start/destination relation per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Low→high, high→low, outside→inside, and inside→outside do not overlap in these examples. |
| Explanation | AI-reviewed pass | Selected-choice feedback plus decisive evidence, all four traps, and a reusable start/destination method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example, and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Vocabulary plus generated-inventory checks pass 36/36. |
| Full release checks | pass | Node 24 `npm run check` passes 163/163; runtime contract reports v147, 51 ordered files, and valid bank hashes. |
| Emulated mobile | pass | PR #208 CI `36401590122` covers Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10961036393` screens `00dq`/`00dr` were inspected. This is not physical-device evidence. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | PR #208 passes its release gates. Public GitHub Pages remains v146 until merge, main CI, Pages, live smoke, and asset-integrity checks pass. |

Candidate inventory is 412 rows / 286 exact question-choice families (TOPIK I 144, TOPIK II 142).
The existing 126 redundant rows, 30 duplicate groups, 15 structural review candidates, 0 answer
conflicts, and 0 comprehensive approvals do not change. These totals are not content approvals, and
no existing Shorts row, original 2,088-item bank entry, answer, or stable ID is altered.
