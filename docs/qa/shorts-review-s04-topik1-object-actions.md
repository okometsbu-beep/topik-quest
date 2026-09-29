# S04 · TOPIK I object-action Shorts candidate

Candidate: v152. Product rollback baseline: v151
`b6fa7c4bc670c6fabe3f608c6477e40d1b4c0672`.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 416 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about an everyday object’s state or movement direction:

- `찾다`: discover an object after looking for it
- `잃어버리다`: no longer know where an object you had is
- `가져오다`: bring an object toward the speaker or reference place
- `가져가다`: take an object away from the speaker or reference place

The examples explicitly name a found key, lost wallet, passport brought to class, or umbrella taken
home. Selected-choice feedback explains the learner's choice before optional full coaching compares
all four. Fixed choices are shuffled and restored through the existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-I-W-OBJECT-01` | `20e8359b4e6697a7d9b5a10fcb75bff84e46c04d42e360ee4ace4ae809fc1edc` | `서랍에서 잃어버린 열쇠를 찾았어요.` |
| `S04-I-W-OBJECT-02` | `dfb136275005350ed7ffd3b837cc31c2719283f08d4b940e1153e6060868f793` | `버스에서 지갑을 잃어버렸어요.` |
| `S04-I-W-OBJECT-03` | `a6987986ed6ee13e1b30fd146cdac7929ed716466e4a990cff58e0eb5ba98726` | `내일 수업에 여권을 가져오세요.` |
| `S04-I-W-OBJECT-04` | `77bd672c393a0549a5ee8aff3bfd4717ae6ae77c359860b38e0277fbfa9c08da` | `이 우산을 집에 가져가세요.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One object state or direction per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Find, lose, bring-here, and take-away do not overlap in these examples. |
| Explanation | AI-reviewed pass | Selected-choice feedback plus decisive evidence, all four traps, and a reusable state/direction method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example, and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | `npm run test:content` passes 48/48; vocabulary plus generated-inventory checks pass 38/38. |
| Full release checks | pass | Local and GitHub release checks pass 182/182 at v152. |
| Browser visual | emulated-pass | PR CI checks Japanese wrong-answer and expanded coaching at 320/375/390/430px in both themes; the two representative screens were directly inspected. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |

Candidate inventory is 420 rows / 294 exact question-choice families (TOPIK I 148, TOPIK II 146).
The existing 126 redundant rows, 30 duplicate groups, 15 structural review candidates, 0 answer
conflicts, and 0 comprehensive approvals do not change. These totals are not content approvals, and
no existing Shorts row, original 2,088-item bank entry, answer, or stable ID is altered.

## Deployment record

- PR: [#218](https://github.com/okometsbu-beep/topik-quest/pull/218), squash
  `f2c80190290cb450a0f79abe59f76f2c1e2eee16`.
- PR CI: [36631648511](https://github.com/okometsbu-beep/topik-quest/actions/runs/36631648511),
  Ubuntu/Node22/Chrome, 182/182 plus 475 mobile screenshots. Artifact `11063266098`.
- Main CI: [36632864545](https://github.com/okometsbu-beep/topik-quest/actions/runs/36632864545), pass.
- Pages: [36632863379](https://github.com/okometsbu-beep/topik-quest/actions/runs/36632863379), pass.
- Live: https://okometsbu-beep.github.io/topik-quest/ reports v152; 4 base + 51 runtime files pass HTTP smoke and the live `data/shorts-levels.js` SHA-256 matches the release file. All four new IDs are present.
- Rollback: revert #218 or restore v151 main
  `b6fa7c4bc670c6fabe3f608c6477e40d1b4c0672`.
- Unverified: physical iPhone/Android, native Japanese or Korean educator review, consenting learner timing, D1/D7 recall, and full offline recovery.
