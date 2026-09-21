# S04 · TOPIK II scope-relation Shorts pilot

Candidate: v128. Production remains v127 `b1d9140dc9b06ecfd63bbf92dfbdaf8d056a9ac5` until CI, mobile evidence, merge, and live verification pass.
Product rollback: v127 `b1d9140dc9b06ecfd63bbf92dfbdaf8d056a9ac5`.
Scope: four new TOPIK II grammar cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 388 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about how the preceding noun relates to the following scope:

- `-을/를 제외하고`: remove one item from the full set
- `-을/를 대신해(서)`: another person takes the preceding person’s role
- `-에 관계없이`: the preceding condition does not affect the result
- `-을/를 비롯해(서)`: include the preceding item as a representative example

The examples include a decisive full-set, replacement-role, universal-eligibility, or wider-group cue.
Selected-choice feedback explains the chosen relation before optional full coaching compares all four.
Fixed choices are shuffled and restored through the existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-II-G-SCOPE-01` | `1389c7893527bd58aed2bb3a039c8626d6b243c0444eb9577b82b504931d7384` | `월요일을 제외하고 매일 문을 엽니다.` |
| `S04-II-G-SCOPE-02` | `9a963e34f76443a791a6e4e1646e9f914880bb7ed47c752dd4a95fabd485734c` | `부모님을 대신해서 제가 회의에 참석했습니다.` |
| `S04-II-G-SCOPE-03` | `0a091573f7262d4e51d0485c98950e7f9a89206302acac850cb9db5bbe47bed4` | `나이에 관계없이 누구나 신청할 수 있습니다.` |
| `S04-II-G-SCOPE-04` | `6bffce9517d3b5ae81fb9c23b48dd5e3380bb26352fcb5c71f27074026b91753` | `서울을 비롯해서 여러 도시에서 행사가 열렸습니다.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One noun-scope relation per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Exclusion, role substitution, irrelevant condition, and representative inclusion are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reusable scope-relation method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example, and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK II rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 31/31; content checks pass 34/34. |
| Full release checks | pass | Node 24 `npm run check` passes 128/128; runtime contract reports v128, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pass | PR #166 evidence CI `35556820642` covers Linux Chrome 320/375/390/430px light/dark, wrong-answer feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10621001103` screens `00dg`/`00dh` were inspected. Local Chrome remains unavailable. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | Evidence CI passed; final PR CI, merge, main CI, Pages, and live verification remain. |

Candidate inventory is 392 rows / 266 exact question-choice families (TOPIK I 132, TOPIK II 134).
The existing 126 redundant rows, 30 duplicate groups, and 15 structural review candidates do not
increase. These totals are not content approvals: the generated inventory remains `approved: 0`, and
only the four IDs above have this bounded AI review record. No existing Shorts row, original bank item,
answer, or stable ID is altered.
The inspected light screenshot shows the deliberately wrong role-substitution choice, the correct
exclusion answer, and choice-specific Japanese feedback. The dark screenshot shows next-first flow and
the complete evidence → traps → scope-relation method without horizontal clipping. This is Linux Chrome
emulation rather than physical-device evidence.
