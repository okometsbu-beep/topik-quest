# S04 · TOPIK II stance-adverb Shorts pilot

Candidate: v126. Production remains v125 `91923d31206dfbe8695f5348050ab9834dafc478`.
Product rollback remains v125 until deployment completes.
Scope: four new TOPIK II word cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 380 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about what an adverb contributes to its sentence:

- `간신히`: a result achieved only after difficulty or by a narrow margin
- `차라리`: choosing a preferable alternative to an undesirable situation
- `도무지`: emphatic impossibility or total negation with a negative predicate
- `미처`: an expected action not completed in time

The examples make the cue explicit through the last-train deadline, the `-느니` alternative,
`이해할 수 없습니다`, or `못 하고`. Selected-choice feedback explains the chosen function before
optional full coaching compares all four. Fixed choices are shuffled and restored through the
existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-II-W-STANCE-01` | `0bb4a066641b00df55fa50a1100f9457a7bd4be6f2787f0b977a5297dfc9a47c` | `막차가 출발하기 직전에 간신히 역에 도착했습니다.` |
| `S04-II-W-STANCE-02` | `777a2eb2e3f65018afdb6f18dfa223ae1b95cd889fefe6164583e8ce8a1f9130` | `계속 기다리느니 차라리 걸어가겠습니다.` |
| `S04-II-W-STANCE-03` | `0227f1b7f8ffc9f894bb63c61950e6f34fcd8cf6c30c0b394d37d427f4db5f5e` | `설명을 여러 번 읽어도 도무지 이해할 수 없습니다.` |
| `S04-II-W-STANCE-04` | `ac76a4be0aad8d47dcdb2e35cb1d7a8ce5353073e146b1d7f23c20efb26b66be` | `갑자기 불려서 인사도 미처 못 하고 나왔습니다.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One adverb and one explicit sentence function per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Narrow success, alternative choice, emphatic negation, and missed timing are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reusable context method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK II rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 29/29; content checks pass 32/32. |
| Full release checks | pass | Node 24 `npm run check` passes 126/126; runtime contract reports v126, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pass | PR #162 CI `35501505213` covers 320/375/390/430px light/dark, selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10602636471` screens `00dc`/`00dd` were inspected. Local Chrome remains unavailable. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | PR #162 final CI, merge, Pages release, and public-browser verification are not complete. |

Candidate inventory is 384 rows / 258 exact question-choice families (TOPIK I 128, TOPIK II 130).
The 15 existing structural review candidates do not increase. These totals are not content approvals:
the generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.
No existing Shorts row, original bank item, answer, or stable ID is altered.
The inspected light screenshot shows the deliberately wrong alternative choice, the correct narrow-
success answer, and choice-specific Japanese feedback. The dark screenshot shows next-first flow and
the complete evidence → traps → context method without horizontal clipping. This is Linux Chrome
emulation rather than physical-device evidence.
