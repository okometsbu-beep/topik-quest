# S04 · TOPIK I wearing-action Shorts pilot

Candidate: v127. Production remains v126 `39e2ac7d305d5e5acbfdd8308bf1075994c00d1c`.
Product rollback remains v126 until deployment completes.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 384 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the object and body location selected by a wearing verb:

- `입다`: clothes worn on the body, such as a coat or shirt
- `신다`: shoes or socks worn on the feet
- `쓰다`: a hat worn on the head
- `끼다`: gloves fitted onto the hands

The examples name an unambiguous coat, rain boots, hat, or gloves. Selected-choice feedback explains
the chosen object-location pairing before optional full coaching compares all four. Fixed choices are
shuffled and restored through the existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-I-W-WEAR-01` | `25e089120fdd7cd7ebf5cf2362dd80182a98cf9158a06dbb9ad14b53541f524e` | `날씨가 추워서 두꺼운 코트를 입었어요.` |
| `S04-I-W-WEAR-02` | `2ae60ffc09b69d728851357289419d8747734a8e23c8b30c15ec89dbf095e519` | `비가 와서 장화를 신었어요.` |
| `S04-I-W-WEAR-03` | `cad2896ed922afaf40608930d96a176a842424efd91332dcbaa16787e23da1c3` | `햇빛이 강해서 모자를 썼어요.` |
| `S04-I-W-WEAR-04` | `83d30e8cb7cd5e022cc0e19595073ac4fa49b0b9aee145f4b79a9ba55c601b5f` | `손이 시려서 장갑을 꼈어요.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One concrete object and one body location per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Coat/body, boots/feet, hat/head, and gloves/hands are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reusable object-location method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example, and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 30/30; content checks pass 33/33. |
| Full release checks | pass | Node 24 `npm run check` passes 127/127; runtime contract reports v127, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pass | PR #164 CI `35518597198` covers 320/375/390/430px light/dark, selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10606903965` screens `00de`/`00df` were inspected. Local Chrome remains unavailable. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | PR CI, merge, Pages release, and public-browser verification are not complete. |

Candidate inventory is 388 rows / 262 exact question-choice families (TOPIK I 132, TOPIK II 130).
The existing 126 redundant rows, 30 duplicate groups, and 15 structural review candidates do not
increase. These totals are not content approvals: the generated inventory remains `approved: 0`, and
only the four IDs above have this bounded AI review record. No existing Shorts row, original bank item,
answer, or stable ID is altered.
The inspected light screenshot shows the deliberately wrong footwear choice, the correct clothing answer,
and choice-specific Japanese feedback. The dark screenshot shows next-first flow and the complete
evidence → traps → object-location method without horizontal clipping. This is Linux Chrome emulation
rather than physical-device evidence.
