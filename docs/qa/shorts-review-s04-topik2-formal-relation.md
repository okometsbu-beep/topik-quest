# S04 · TOPIK II formal-relation marker Shorts pilot

Candidate: v122. Production remains v121 `4ab4628791d4524f6f9cb88b813a84e010bbe922` until
the candidate passes CI, mobile emulation, merge, Pages deployment, and live verification.
Product rollback is v121 `4ab4628791d4524f6f9cb88b813a84e010bbe922`.
Scope: four new TOPIK II grammar cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 364 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the role of the noun before a formal relation marker:

- `-에 따르면`: source of reported information
- `-에 따라(서)`: standard or condition that changes the result
- `-을/를 통해(서)`: means or channel used to learn, obtain, or do something
- `-에 의해(서)`: agent of a passive action or a formally stated cause

Selected-choice feedback explains the chosen role before optional full coaching compares all four
relations. Fixed choices are shuffled and restored through the existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-II-G-RELATION-01` | `345a46b684e7879123c625d73fdae217279fce848f61babcd3685097ce469a5a` | `기상청 발표에 따르면 내일 비가 옵니다.` |
| `S04-II-G-RELATION-02` | `9ce9b9f4b1235e91237de6c38d3c1993701ab417b03baaeeaf5a5bd017d812ab` | `계절에 따라 해가 지는 시간이 달라집니다.` |
| `S04-II-G-RELATION-03` | `3150138184528ec22ed3060b7245e4a65267539eafdae957fa8a0067d95b844c` | `온라인 강의를 통해 한국어를 배웠습니다.` |
| `S04-II-G-RELATION-04` | `8027c59cc149ca0e86a3a5c0c8bc08b340121b2f2474d4009c05144c4885ed6d` | `이 다리는 유명한 건축가에 의해 설계되었습니다.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One marker and one explicit noun role per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Source, varying standard, used channel, and passive agent are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a noun-role method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK II rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 25/25; content checks pass 28/28. |
| Full release checks | pass | Node 24 `npm run check` passes 122/122; runtime contract reports v122, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pass | PR #154 CI `35360830953` covers 320/375/390/430px light/dark, selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10554394352` screens `00cu`/`00cv` were inspected. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | Merge and Pages verification are forbidden until the candidate gates pass. |

Candidate inventory is 368 rows / 242 exact question-choice families (TOPIK I 120, TOPIK II 122).
The 15 existing structural review candidates do not increase. These totals are not content approvals:
the generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.
No existing Shorts row, original bank item, answer, or stable ID is altered.
The inspected light screenshot shows the deliberately wrong varying-standard choice, the correct
information-source answer, and choice-specific Japanese feedback. The dark screenshot shows next-first
flow and the complete evidence → traps → noun-role method without clipping. This is Linux Chrome
emulation rather than physical-device evidence.
