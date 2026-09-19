# S04 · TOPIK I basic-negation Shorts pilot

Production: v123 `cdefae5b00748f2df360f99050d66ea0c079495d` (PR #156).
Product rollback is v122 `16048fd8f67700f96575d85119614a0db3e8a9cc`.
Scope: four new TOPIK I grammar cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 368 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about what kind of negation the expression carries:

- `안`: simple negation of an action or state
- `못`: inability caused by skill or circumstances
- `아니에요`: denial of a noun identity or category
- `없어요`: absence or nonexistence of a person, thing, or time

The example supplies the decisive cue: an ordinary action, an external obstacle, a noun predicate,
or an absent item. Selected-choice feedback explains the chosen semantic trap before optional full
coaching compares all four. Fixed choices are shuffled and restored through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-I-G-NEGATION-01` | `4533d3bbb0f47e51523ead43edc7f9ec135202c3e53eee3a5be62cbc4611dfd0` | `저는 아침에 커피를 안 마셔요.` |
| `S04-I-G-NEGATION-02` | `b064517448483cd03399580752d45444bf19a8a6582bc1702c3669cf029463f1` | `오늘은 바빠서 친구를 못 만나요.` |
| `S04-I-G-NEGATION-03` | `7c594a8122e63038b1da2a3b4dd9e496961703313122ce39d94918f2ca6ff81f` | `여기는 약국이 아니에요. 은행이에요.` |
| `S04-I-G-NEGATION-04` | `8b0dc769fda0fee339440c5d16f3904daaa89b2b60cba14244807dbb10b3554f` | `냉장고에 우유가 없어요.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One form and one explicit negation role per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Simple refusal, inability, noun-category denial, and absence are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a semantic-role method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Course consistency | AI-reviewed pass | Functions match the existing beginner-course negation lessons and do not teach `안` and `못` as interchangeable. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 26/26; content checks pass 29/29. |
| Full release checks | pass | Node 24 `npm run check` passes 123/123; runtime contract reports v123, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pass | PR #156 CI `35417933793` covers 320/375/390/430px light/dark, selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10576448286` screens `00cw`/`00cx` were inspected. Local Chrome remains unavailable. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pass | PR #156 final CI `35418170909`, main CI `35418404159`, and Pages `35418403561` passed. Live HTTP smoke reports v123 with 3 base + 45 runtime files; public Chrome verified the Japanese `없어요` wrong-answer, reload-restoration, and detailed-coaching flow. |

Production inventory is 372 rows / 246 exact question-choice families (TOPIK I 124, TOPIK II 122).
The 15 existing structural review candidates do not increase. These totals are not content approvals:
the generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.
No existing Shorts row, original bank item, answer, or stable ID is altered.
The inspected light screenshot shows a deliberately wrong inability choice, the correct simple-negation
answer, and choice-specific Japanese feedback. The dark screenshot shows next-first flow and the complete
evidence → traps → negation-role method without clipping. This is Linux Chrome emulation rather than
physical-device evidence.
