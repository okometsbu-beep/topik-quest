# S04 · TOPIK II state/change Shorts pilot

Baseline: production v108 `d68ac0a8dac3fa3d4ab7355aec8b3b34cddeb082`; reviewed candidate v109.
Scope: four new TOPIK II grammar cards only. This is an AI content review plus automated/browser QA record,
not native-speaker approval, learner timing evidence, or approval of the other 316 Shorts rows.

## Reviewed learning contract

Each card asks one quick state/change judgment:

- `-게 되다`: a change in circumstances or plans leads to doing something new
- `-아/어지다`: a quality or state becomes different
- `-고 있다`: the subject's action is in progress now
- `-아/어 있다`: the result state of a completed action remains

The examples make the distinction decisive with `회사 사정`, an adjective change, `지금`, or a completed
action's remaining state. Selected-choice feedback explains the chosen trap before optional full coaching maps
all four and gives one reusable change/progress/result-state method. Fixed choices are shuffled and restored
through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-II-G-STATE-01` | `ab0ba7831dd3f6a65a37333d286efaf47c02d8ef349e1651b39eefd9d3a2544c` | `회사 사정으로 다음 달부터 부산에서 근무하게 되었습니다.` |
| `S04-II-G-STATE-02` | `1c547043139655488ef36c9a5707608372e39406201b8c657f37c75bb1d6c79c` | `봄이 오면서 날씨가 따뜻해졌습니다.` |
| `S04-II-G-STATE-03` | `9ae1eafbeaf50cd814d920b3737339f2e741eddd072b8c8b38319204061b67b6` | `학생들이 지금 도서관에서 공부하고 있습니다.` |
| `S04-II-G-STATE-04` | `dc09ffa37534cc4c268e56de8b939a367a6081eab9ba1bd08e2cbe86190fc8a9` | `회의실 문이 열려 있습니다.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One grammar form and four compact functions. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Circumstance-led action, adjective quality change, present action, and remaining result state are separated by explicit cues. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reusable method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK II rows. |
| Focused local checks | pass | Inventory and vocabulary tests pass 13/13 on Node 24. |
| Full release checks | pass | Node 24 `npm run check` passed 104/104; content checks passed 16/16. |
| Emulated mobile | pending | PR CI must cover 320/375/390/430px, both themes, wrong-answer recovery, expanded coaching, next-first flow and reload restoration. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Overall | pending | Automated, full-release and AI content gates pass for these four IDs; release awaits visual gates. |

Inventory becomes 320 rows / 194 exact question-choice families (TOPIK I 96, TOPIK II 98). The 15 existing
structural review candidates do not increase. These totals are not content approvals: the generated inventory
remains `approved: 0`, and only the four IDs above have this bounded AI review record.
