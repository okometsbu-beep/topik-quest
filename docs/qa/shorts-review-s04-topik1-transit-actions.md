# S04 · TOPIK I transit-action Shorts pilot

Candidate: v129. Production remains v128 `6840bd478937ebb524f59ec8b68c203f41a1fb46` until CI,
mobile evidence, merge, and live verification pass.
Product rollback: v128 `6840bd478937ebb524f59ec8b68c203f41a1fb46`.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 392 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the learner's stage of movement:

- `타다`: board and use a bus, subway, or other transport
- `내리다`: leave the transport being ridden
- `갈아타다`: change to another line or vehicle
- `건너다`: move from one side of a road, crosswalk, or river to the other

The examples name an unambiguous bus, subway exit, Line 4 transfer, or crosswalk. Selected-choice
feedback explains the chosen movement stage before optional full coaching compares all four. Fixed
choices are shuffled and restored through the existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-I-W-TRANSIT-01` | `c9ab721b9bb2d33a83a06b2706db2c34a2f076e15f81d6ae71100d013a871c28` | `집 앞 정류장에서 버스를 탔어요.` |
| `S04-I-W-TRANSIT-02` | `fc2b7c95000a175c2856c32d94db59e7e2c5b48c873eb239fae80c937777f8f3` | `지하철에서 내린 뒤 출구로 갔어요.` |
| `S04-I-W-TRANSIT-03` | `6e6ce28a0b732c6d946df7a5965c3565f808e2add2af7c252ae00cee5af63957` | `서울역에서 4호선으로 갈아탔어요.` |
| `S04-I-W-TRANSIT-04` | `d4c906e62e39134c8b30a0406c77bcb6d5372e62594266323d4444081a063f11` | `신호가 바뀐 뒤 횡단보도를 건넜어요.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One concrete movement stage per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Boarding, exiting, transferring, and crossing are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reusable movement-stage method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example, and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 32/32; content checks pass 35/35. |
| Full release checks | pass | Node 24 release check passes 129/129; the v129 runtime contract covers 45 ordered files and valid generated-bank hashes. |
| Emulated mobile | pass | PR #168 evidence CI `35617795816` covers Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10647651432` screens `00di`/`00dj` were inspected. Local Chrome remains unavailable. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | Evidence CI passed; final PR CI, merge, main CI, Pages, and live verification remain. |

Candidate inventory is 396 rows / 270 exact question-choice families (TOPIK I 136, TOPIK II 134).
The existing 126 redundant rows, 30 duplicate groups, and 15 structural review candidates do not
increase. These totals are not content approvals: the generated inventory remains `approved: 0`, and
only the four IDs above have this bounded AI review record. No existing Shorts row, original bank item,
answer, or stable ID is altered.
