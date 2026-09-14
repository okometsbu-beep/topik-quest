# S04 · TOPIK I question-word Shorts pilot

Release: production v113 `71c749eb02868d0dd72bb378bfbe34ca0f9c34ff`; product rollback v112
`b42d0759a6b98c363f77f6ac72be527e742e8707`.
Scope: four new TOPIK I question-word cards only. This is an AI content review plus automated/browser QA
record, not native-speaker approval, learner timing evidence, or approval of the other 328 Shorts rows.

## Reviewed learning contract

Each card asks one quick target-category judgment:

- `누구`: a person or identity
- `어디`: a place or location
- `언제`: a day or time
- `얼마`: a price or amount of money

Each example names one target category, so only one question word is supported. Selected-choice feedback
explains the chosen question word before optional full coaching compares all four and gives one reusable
target-first method. Fixed choices are shuffled and restored through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-I-W-QUESTION-01` | `0027fee688e72803ad1354a8e3d96b4ba62bcc4d9edc9213b740a11d85bea4f6` | `저 사람은 누구예요?` |
| `S04-I-W-QUESTION-02` | `d7cdaebb81a25eafe04709e28a2fbf2b1ae4f955f3b3c86a689dfa7a2ce73237` | `화장실이 어디에 있어요?` |
| `S04-I-W-QUESTION-03` | `b0f260cbf075c6221eadb72d9a8d1e7fc30815d07c9e33446f7f265dcd32b653` | `시험이 언제예요?` |
| `S04-I-W-QUESTION-04` | `361eed81562006c2109f1b7758d7323a12443b440d46d6b0b342c5bccb64166c` | `이 가방은 얼마예요?` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One question word and four compact target categories. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Person, restroom location, exam time, and bag price each support one different category. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a target-first method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Node 24 content checks passed 19/19; generated inventory checks passed. |
| Full release checks | pass | Node 24 `npm run check` passed 113/113 at candidate v113 after the inventory-count contract was updated. |
| Emulated mobile | pass | PR #136 CI `34783191274` passed at 320/375/390/430px in light/dark, including selected-wrong feedback, expanded coaching, next-first flow and reload restoration. Artifact `10325594505` screens `00cc`/`00cd` were inspected. Local Chrome was unavailable; this is CI Linux Chrome emulation. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pass | PR #136 final CI `34783447830` passed; squash merge `71c749eb02868d0dd72bb378bfbe34ca0f9c34ff`, main CI `34783696587` unchanged rerun, and Pages `34783696240` succeeded. Live v113 HTTP smoke passed 3 base + 45 runtime files; the card and bootstrap hashes plus all four IDs match main. |
| Overall | bounded release | Automated, bounded AI review, CI Linux Chrome emulation, merge and live verification pass; human, learner and physical-device gates remain open. |

Inventory becomes 332 rows / 206 exact question-choice families (TOPIK I 104, TOPIK II 102). The 15
existing structural review candidates do not increase. These totals are not content approvals: the generated
inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.
