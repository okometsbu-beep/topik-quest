# S04 · TOPIK II inference/evidence grammar Shorts pilot

Baseline: production v104 `42d6c3c703444023ba8c010ade5d4ef35e79c1a2`; reviewed candidate v105.
Scope: four new TOPIK II grammar cards only. This is an AI content review plus automated/browser QA record,
not native-speaker approval, learner timing evidence, or approval of the other 300 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment using the visible clue, degree of certainty, or following clause:

- `-나 보다`: makes a tentative inference from something observed or heard
- `-(으)ㄹ지도 모르다`: leaves an outcome possible without asserting it
- `-(으)ㄹ 것이 틀림없다`: expresses strong confidence that the judgment is true
- `-(으)ㄹ 테니`: uses the speaker's intention or prediction as the basis for a following request

The batch deliberately avoids putting heavily overlapping conjectural forms such as `-나 보다`, `-는 모양이다`,
and `-는 듯하다` into one answer set. Each reviewed example exposes a different decision signal, so only one
option fits. Selected-choice feedback explains the chosen distinction before optional full coaching maps all four
and gives one reusable clue → certainty → next-clause method. Fixed choices are shuffled and restored through the
existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-II-G-INFER-01` | `a51c2753338b97fad4c69f398c7f8dc2aaded7705768c70128519cfff2575074` | `사무실 불이 꺼진 걸 보니 모두 퇴근했나 봐요.` |
| `S04-II-G-INFER-02` | `f89ebfcefb585c450e67221f834cd3b14bdbccc6004ed6d1d62106a3ba0694da` | `눈이 많이 오면 기차가 늦을지도 몰라요.` |
| `S04-II-G-INFER-03` | `4fb54d5c6bb1c2e7a1de1e583c40b2e311664adc1fd6f37e0b64d1458fabbfcb` | `매일 연습했으니 실력이 늘었을 것이 틀림없어요.` |
| `S04-II-G-INFER-04` | `8825ee9b6938d9f12d0b4e8ccb8c241fc8f172fbcb661e2f6af63efdac81c471` | `제가 자료를 정리할 테니 먼저 발표를 준비하세요.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One grammar form and four compact signals. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Observation, open possibility, strong certainty, and intention followed by a request are separated. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reusable method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; choice order and graded state restore without deleting progress. |
| Emulated mobile | automated/visual pass | PR #124 CI `34586448188`: Linux Chrome at 320/375/390/430px, light/dark, selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. This is not physical-device evidence. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Overall | in-review | Suitable for this limited web pilot after automated/emulated-mobile gates; external validation remains open. |

Inventory becomes 304 rows / 178 exact question-choice families (TOPIK I 88, TOPIK II 90). The 15 existing
structural review candidates do not increase. These totals are not content approvals: the generated inventory
remains `approved: 0`, and only the four IDs above have this bounded AI review record.
