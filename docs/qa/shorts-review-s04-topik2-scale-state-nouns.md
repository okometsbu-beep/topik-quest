# S04 · TOPIK II scale/state-noun Shorts release

Candidate: v155. Product rollback baseline: v154
`58e5251cfee99f2d650a7effc95c6b767d2d0703`.
Scope: four new TOPIK II word cards only. This is a bounded AI content review plus automated and
emulated-browser QA record, not native-speaker approval, learner timing evidence, or approval of the
other 428 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the direction of an operational or policy change:

- `확대`: make the scale, scope, or amount larger
- `축소`: make the scale, scope, or amount smaller
- `유지`: keep the current state or level
- `중단`: stop an activity or operation that was in progress

The examples expose one decisive direction: broadening support eligibility, reducing branch count,
keeping a safety standard unchanged, or stopping an outdoor event. Selected-choice feedback explains
the chosen direction; optional coaching compares all four. Fixed choices are shuffled and restored
through the existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
| --- | --- | --- |
| `S04-II-W-SCALE-01` | `68ae6b0eae9d13029c8a9dbda5823550afbdfafe1e9d89f3b30c57c1adccb8f4` | `시는 늘어나는 돌봄 수요에 맞춰 지원 대상을 확대했습니다.` |
| `S04-II-W-SCALE-02` | `bae0488f712eb8b85c9b3120f9c70ea19fcc885fc78bda3af7266b6aa74695b3` | `회사는 비용을 줄이기 위해 해외 지점 수를 축소했습니다.` |
| `S04-II-W-SCALE-03` | `ea558a7f6768d1b80e306327e2fc63a93139362f658ee44715e7c69458262c37` | `위원회는 안전 기준을 현재 수준으로 유지하기로 했습니다.` |
| `S04-II-W-SCALE-04` | `9d383de8ac48dddf674294e94fde486c5b1ff909fbe5bb1fc00e74c9e02a6b74` | `강한 비 때문에 야외 행사가 잠시 중단되었습니다.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
| --- | --- | --- |
| One quick judgment | designed-pass | One change direction per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Larger, smaller, unchanged, and stopped are non-overlapping in these definitions and examples. |
| Explanation | AI-reviewed pass | Decisive evidence, every-choice traps, and a reusable change-direction method exist in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, example, and coaching are bundled in four languages; no network translation is required. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1`, earlier IDs, original bank, and learner records are unchanged. |
| Focused local checks | pass | Node 24 content checks pass 51/51; generated-inventory checks pass 2/2. |
| Full release checks | pass | Local release checks pass 185/185 at v155 with 51 ordered runtime files and valid bank hashes. |
| Browser visual | pass | PR CI verified Japanese wrong-answer and expanded coaching at 320/375/390/430px in both themes plus graded-state restoration. The new 390px light wrong-answer and dark full-coaching frames were inspected directly; this is browser emulation, not physical-device evidence. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |

Candidate inventory is 432 rows / 306 exact question-choice families (TOPIK I 152, TOPIK II 154).
The existing 126 redundant rows, 30 duplicate groups, 15 structural review candidates, zero answer
conflicts, and zero comprehensive approvals remain unchanged. These totals are inventory, not
educational approval.

## Deployment record

- Product: [PR #224](https://github.com/okometsbu-beep/topik-quest/pull/224), squash
  `590eaaaf6bf8ff21b68b7f6c1548e9c97e670795`.
- [PR CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36777452399) passed on
  Ubuntu/Node 22/Chrome. Artifact `11126636409` contains 481 screenshots; only the two new
  representative states above were directly inspected.
- [Main CI](https://github.com/okometsbu-beep/topik-quest/actions/runs/36778602468) and
  [Pages](https://github.com/okometsbu-beep/topik-quest/actions/runs/36778601347) passed.
- Live https://okometsbu-beep.github.io/topik-quest/ serves v155 with 4 base + 51 runtime files.
  `data/shorts-levels.js` SHA-256 is
  `bd07fb7f466efd024c05cea9f516a9691086b8d04d6c4facfd58a1c72ab99ffc`, matching main, and all
  four stable IDs are present.
- Rollback: revert #224 or return to v154 main
  `58e5251cfee99f2d650a7effc95c6b767d2d0703`.
- Unverified: physical iPhone/Android, native Japanese or Korean educator review, consenting learner
  timing, D1/D7 recall, and full offline recovery.
