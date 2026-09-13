# S04 · TOPIK II condition-relation Shorts pilot

Production: v112 `b42d0759a6b98c363f77f6ac72be527e742e8707`; product rollback is v111
`5cbb6773f9cb78c6ab4bd6791165841126038707`.
Scope: four new TOPIK II grammar cards only. This is an AI content review plus automated/browser QA record,
not native-speaker approval, learner timing evidence, or approval of the other 324 Shorts rows.

## Reviewed learning contract

Each card asks one quick condition-relation judgment:

- `-거든`: carry out a following request or instruction when an event actually occurs
- `-아/어야만`: the following result is possible only when a necessary condition is met
- `-(으)ㄴ/는다면`: suppose an undecided situation and consider that case
- `-다가는`: warn that continuing the current behavior will lead to an undesirable result

The examples make the distinction decisive through a following request, an explicit prerequisite, an
undecided supposition, or a continuing-behavior warning. Selected-choice feedback explains the chosen trap
before optional full coaching compares all four and gives one reusable following-clause method. Fixed choices
are shuffled and restored through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-II-G-COND-01` | `b715d158cb70194cb4a1d71ac9df9b9a8e1fe41ad066ccc1f41ac37ff393fe63` | `시간이 나거든 이 서류를 확인해 주세요.` |
| `S04-II-G-COND-02` | `6a796959f0742ba45a82340773c642e12e7c37eebca5815f475769fff8f38187` | `신분증을 보여야만 들어갈 수 있습니다.` |
| `S04-II-G-COND-03` | `d76cbfa63104ba35dca5cd26a1201af21ff3cb7b1e60619c136f739c2ba86a28` | `회사를 옮긴다면 어떤 일을 하고 싶어요?` |
| `S04-II-G-COND-04` | `1da636a9d354f94d0cc75a295bbc58bf63919b3d3f539094d4cdb1739f4d00ed` | `계속 무리하다가는 건강을 해칠 거예요.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One grammar form and four compact condition functions. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Request-after-event, prerequisite, undecided supposition, and continuing-behavior warning are separated by explicit cues. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a following-clause method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK II rows. |
| Focused local checks | pass | Node 24 vocabulary/data checks pass 13/13; generated inventory checks pass 2/2. |
| Full release checks | pass | Node 24 `npm run check` passes 112/112 at production v112. |
| Emulated mobile | pass | PR #134 final CI `34765253730` covers 320/375/390/430px in light/dark, selected-wrong feedback, expanded coaching, next-first flow and reload restoration. Artifact `10320915051` screens `00bz`/`00cb` were inspected. Local Chrome was unavailable; this is CI Linux Chrome emulation. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Overall | bounded pass | Automated, full-release, AI content and CI Linux Chrome emulation gates pass for these four IDs. PR #134 is merged; main CI `34765463888`, Pages `34765463632`, live v112 HTTP smoke, and live asset hashes pass. Human and physical-device limits above stay open. |

Inventory becomes 328 rows / 202 exact question-choice families (TOPIK I 100, TOPIK II 102). The 15 existing
structural review candidates do not increase. These totals are not content approvals: the generated inventory
remains `approved: 0`, and only the four IDs above have this bounded AI review record.
