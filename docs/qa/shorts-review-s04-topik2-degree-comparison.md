# S04 · TOPIK II degree/comparison Shorts pilot

Production: v124 `10bb264f48b75754c10456f33236d3352f6ba5a0` (PR #158).
Product rollback is v123 `cdefae5b00748f2df360f99050d66ea0c079495d`.
Scope: four new TOPIK II grammar cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 372 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the relationship between a reference and a degree:

- `-에 비해(서)`: difference from an explicit comparison baseline
- `-에 못지않게`: a degree not inferior to the reference
- `-만큼`: the same degree as the reference
- `-(으)ㄹ 정도로`: an extreme degree made visible by its result

The examples supply distinct cues: two named periods, `못지않게`, equality in height, or a result
that demonstrates loudness. Selected-choice feedback explains the chosen relation before optional
full coaching compares all four. Fixed choices are shuffled and restored through the existing
stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-II-G-DEGREE-01` | `90b4c48cb0b2d31024c224f686c7218a64d4006f03ff580bcd85f3d5f244051b` | `지난달에 비해 이번 달 매출이 늘었습니다.` |
| `S04-II-G-DEGREE-02` | `a2cf36705a4b841576e0bd3ddc8bc67bf894f1b43d0c2a92600b091b4e92aceb` | `이 작품은 전작에 못지않게 인기가 많습니다.` |
| `S04-II-G-DEGREE-03` | `fdaf65f5115f1244a33342e5519f2457616e8318e49dcb6494bb34d5c86bee96` | `동생은 형만큼 키가 큽니다.` |
| `S04-II-G-DEGREE-04` | `bc0bbaffec9a87138d81423fb7d49611b340b58d2d125ff5eca32931dd9a168c` | `목소리가 밖에서도 들릴 정도로 컸습니다.` |

## Production verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One form and one explicit reference/degree relation per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Difference, not-inferior degree, equal degree, and result-demonstrated extent are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reference/degree method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK II rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 27/27; content checks pass 30/30. |
| Full release checks | pass | Node 24 `npm run check` passes 124/124; runtime contract reports v124, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pass | PR #158 CI `35434058774` covers 320/375/390/430px light/dark, selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10581702595` screens `00cy`/`00cz` were inspected. Local Chrome remains unavailable. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pass | PR #158 final CI `35434477757`, main CI `35434734289`, and Pages `35434733945` passed. Live HTTP smoke reports v124 with 3 base + 45 runtime files; public Chrome verified the Japanese `-만큼` wrong-answer, reload-restoration, and detailed-coaching flow. |

Production inventory is 376 rows / 250 exact question-choice families (TOPIK I 124, TOPIK II 126).
The 15 existing structural review candidates do not increase. These totals are not content approvals:
the generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.
No existing Shorts row, original bank item, answer, or stable ID is altered.
The inspected light screenshot shows the deliberately wrong not-inferior choice, the correct explicit-
baseline answer, and choice-specific Japanese feedback. The dark screenshot shows next-first flow and
the complete evidence → traps → reference/degree method without horizontal clipping. This is Linux
Chrome emulation rather than physical-device evidence.
