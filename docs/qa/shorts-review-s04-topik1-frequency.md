# S04 · TOPIK I frequency-adverb Shorts pilot

Baseline: production v107 `18a8b9008cb38f3fca276191767482520fb80186`; reviewed candidate v108.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated/browser QA record,
not native-speaker approval, learner timing evidence, or approval of the other 312 Shorts rows.

## Reviewed learning contract

Each card asks one quick frequency judgment:

- `항상`: every time, without an exception
- `자주`: many times or with high frequency
- `가끔`: on some occasions, not regularly
- `전혀`: zero degree or frequency when paired with a negative expression such as `안`, `못`, or `없다`

Each example makes one distinction decisive. Selected-choice feedback explains the chosen frequency before
optional full coaching maps all four and gives one reusable frequency-scale method. Fixed choices are shuffled
and restored through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-I-W-FREQ-01` | `76bab1017a2515d3b0e15672febb4b3a7c5101b7e07148ab1b90d65c69bd2b95` | `저는 항상 아침밥을 먹어요.` |
| `S04-I-W-FREQ-02` | `43036d30af7699a93382be5edff5736a0f34f4bbd7357c82536459a8c030cdfc` | `주말에 이 공원에 자주 와요.` |
| `S04-I-W-FREQ-03` | `a25d65a67f7cf5beb53129b986acaacd421b3e52ec9ee6d549dd511939f52ebd` | `저는 가끔 버스로 학교에 가요.` |
| `S04-I-W-FREQ-04` | `723e57cd6ad783955019b218de1d32e0f81bd0128e0c3af97e7a4b57994352c4` | `저는 매운 음식을 전혀 못 먹어요.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One frequency word and four compact meanings. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Every time, high frequency, some occasions, and zero with a negative are separated by each example. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reusable method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Inventory and vocabulary tests pass 12/12 on Node 22. |
| Full release checks | pass | Node 22 `npm run check` passed 103/103; content checks passed 15/15. |
| Emulated mobile | pass | PR #127 CI `34669739020` covered 320/375/390/430px, light/dark, wrong-answer recovery, expanded coaching, next-first flow and reload restoration. Evidence: `00bq-shorts-topik1-frequency-wrong-light.png`, `00br-shorts-topik1-frequency-full-dark.png`. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Overall | bounded pass | Automated, visual-emulation and AI content gates pass for these four IDs only; external human, timing and physical-device validation remains open. |

Inventory becomes 316 rows / 190 exact question-choice families (TOPIK I 96, TOPIK II 94). The 15 existing
structural review candidates do not increase. These totals are not content approvals: the generated inventory
remains `approved: 0`, and only the four IDs above have this bounded AI review record.
