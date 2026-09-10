# S04 · TOPIK I time-adverb Shorts pilot

Baseline: production v101 `711d2b234fd2ba3ba038bdc5e5162c6d76a71468`; reviewed candidate v102.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated/browser QA record,
not native-speaker approval, learner timing evidence, or approval of the other 288 Shorts rows.

## Reviewed learning contract

Each card asks one meaning judgment on one Korean time adverb. The same contrast set is deliberate:

- `벌써`: an earlier-than-expected completed state (`もう（予想より早く）`)
- `아직`: a continuing or incomplete state (`まだ`)
- `방금`: the immediate past (`たった今`)
- `곧`: the near future (`もうすぐ`)

The examples place only the target adverb in the decisive time relation. Each selected choice explains its
own time reference before an optional full explanation contrasts all four and gives the reusable method.
The fixed reviewed choices are shuffled per card and restored from the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-I-W-TIME-01` | `1f3450513c1c2552421c7434c6d0dc0b9ae83d6da366a94fe5d1054ef35c4bde` | `숙제를 벌써 다 했어요.` |
| `S04-I-W-TIME-02` | `e47718913bafdb3af7fa3fa37b040cd920ab75b4282621cbc5eaff694d848ace` | `가게가 아직 안 열렸어요.` |
| `S04-I-W-TIME-03` | `10111293a5dec4513c8a5c109a88c8515716875a6eaadd050b280284b14ee21d` | `기차가 방금 출발했어요.` |
| `S04-I-W-TIME-04` | `a6dc21cedf6f44865afaab9290e29b8f13e73a8e626b6c51b09e0cd6af120cd8` | `수업이 곧 시작해요.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One short Korean word and four short meanings. Actual beginner 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Four non-overlapping time references; runtime and inventory tests preserve the answer under shuffling. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive example, all traps, and a reusable time-axis method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Term meaning, four choices, selected feedback, example explanation, and full coaching reviewed together in four languages. |
| Repeat/inventory | automated pass | Four new stable IDs and four new exact families; no new duplicate or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` root and earlier stable IDs remain; per-card choice order is restored without deleting progress. |
| Human/learner/device | unverified | No native reviewer, consenting beginner timing, delayed recall, or physical iPhone/Android evidence. |
| Overall | in-review | Suitable for this limited web pilot after automated/emulated-mobile gates; external validation remains open. |

Inventory becomes 292 rows / 166 exact question-choice families (TOPIK I 88, TOPIK II 78). These totals are
not content approvals: the generated inventory deliberately remains `approved: 0`, and only the four IDs above
have this bounded AI review record.
