# S04 · TOPIK I counter Shorts pilot

Baseline: production v110 `a0f852517ae72b3371ca9ab6c6fc3936c09ddda3`; reviewed candidate v111.
Scope: four new TOPIK I counter cards only. This is an AI content review plus automated/browser QA record,
not native-speaker approval, learner timing evidence, or approval of the other 320 Shorts rows.

## Reviewed learning contract

Each card asks one quick object-category judgment:

- `명`: people
- `개`: general objects without a more specific counter
- `병`: bottles and things packaged in bottles
- `권`: books, notebooks, and other bound volumes

Each example names the counted object, so only one counter category is supported. Selected-choice feedback
explains the chosen counter before optional full coaching compares all four and gives one reusable
object-first method. Fixed choices are shuffled and restored through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-I-W-COUNT-01` | `c81a24cb02b24cb5c1006b33e08e0679b3a0acfc47c6c2dfda68ffa9ec36e85d` | `교실에 학생이 두 명 있어요.` |
| `S04-I-W-COUNT-02` | `fa4d900c45befd6f3fa8ae884a0b6bd4753af6c4710a615925726a58ac5edf15` | `사과를 세 개 샀어요.` |
| `S04-I-W-COUNT-03` | `88fbcae7ea7a87124f2f4751a84e81fdf1ee22dba02100534ebd284a49b81e4b` | `물을 한 병 주세요.` |
| `S04-I-W-COUNT-04` | `ac72d8bf4e53c28ff82d9625ac013be6e8f6233c650a8ab670bf508c36141f6f` | `책을 네 권 빌렸어요.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One counter and four compact object categories. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Student, apple, bottled water, and book each select one different counter category. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and an object-first method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Node 24 content checks passed 17/17; generated inventory checks passed 2/2. |
| Full release checks | pass | Node 24 `npm run check` passed 111/111 at candidate v111. |
| Emulated mobile | pass | PR #132 CI run `34734763048` passed at 320/375/390/430px in light/dark, including selected-wrong feedback, expanded coaching and reload restoration. Artifact `10311116003` screenshots `00bx-shorts-topik1-counter-wrong-light.png` and `00by-shorts-topik1-counter-full-dark.png` were inspected. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Overall | release candidate | Local and PR automated/mobile-emulation gates pass. Merge and live deployment verification remain. |

Inventory becomes 324 rows / 198 exact question-choice families (TOPIK I 100, TOPIK II 98). The 15 existing
structural review candidates do not increase. These totals are not content approvals: the generated inventory
remains `approved: 0`, and only the four IDs above have this bounded AI review record.
