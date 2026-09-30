# S04 · TOPIK II policy/review-noun Shorts candidate

Candidate: v153. Product rollback baseline: v152
`efaf145a0c8be0430fcbeb4ebc10e295463fc8b7`.
Scope: four new TOPIK II word cards only. This is a bounded AI content review plus automated and
emulated-browser QA record, not native-speaker approval, learner timing evidence, or approval of the
other 420 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the time and role of a policy/review noun:

- `대책`: a plan or action addressing a problem
- `효과`: a result appearing after an action or policy
- `한계`: a boundary or weakness preventing full achievement
- `과제`: an issue or goal that still needs to be addressed

The examples expose one decisive role: taking action to reduce fine dust, observing a result after
longer library hours, limiting what a small survey can represent, or naming a future care-workforce
problem. Selected-choice feedback explains the chosen role; optional coaching compares all four.
Fixed choices are shuffled and restored through the existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
| --- | --- | --- |
| `S04-II-W-POLICY-01` | `5797401566747440e60fb75d5bd7bc3df83cf7860332099d48f7d9515928a5e7` | `시는 미세 먼지를 줄이기 위한 대책으로 버스 운행을 늘렸습니다.` |
| `S04-II-W-POLICY-02` | `40fc76cb13bbde57f8cea2bd0407236b7be87ae49ac0662d16802abdecd791ee` | `도서관의 운영 시간을 연장한 뒤 이용자가 늘어 정책의 효과가 나타났습니다.` |
| `S04-II-W-POLICY-03` | `a42cdeebd8ce3a85b80f85e6accaf351617d7c737a2ffe4e40ea45fe9a02fc49` | `이번 조사는 참여자가 적어 전체 시민의 의견으로 보기에는 한계가 있습니다.` |
| `S04-II-W-POLICY-04` | `92b3a9fe55bd4db8bc987b792ed471eb2259fe9440e1d8611933fc9a191b2c5e` | `돌봄 인력을 확보하는 것은 고령 사회가 앞으로 해결해야 할 과제입니다.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
| --- | --- | --- |
| One quick judgment | designed-pass | One policy/review role per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Problem response, observed result, present boundary, and future task are non-overlapping in these definitions and examples. |
| Explanation | AI-reviewed pass | Decisive evidence, every-choice traps, and a reusable time/role method exist in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, example, and coaching are bundled in four languages; no network translation is required. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1`, earlier IDs, original bank, and learner records are unchanged. |
| Focused local checks | pass | `npm run test:content` passes 49/49. |
| Full release checks | pass | Local release checks pass 183/183 at v153. |
| Browser visual | emulated-pass | PR CI checks Japanese wrong-answer and expanded coaching at 320/375/390/430px in both themes and preserves the graded state after reload; the two representative screens were directly inspected. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |

Candidate inventory is 424 rows / 298 exact question-choice families (TOPIK I 148, TOPIK II 150).
The existing 126 redundant rows, 30 duplicate groups, 15 structural review candidates, zero answer
conflicts, and zero comprehensive approvals remain unchanged. These totals are inventory, not
educational approval.

## Deployment record

- PR: [#220](https://github.com/okometsbu-beep/topik-quest/pull/220), squash
  `d21a6d6d27351c6c9b98d8a276d2fa82aaedb310`.
- PR CI: [36663079992](https://github.com/okometsbu-beep/topik-quest/actions/runs/36663079992),
  Ubuntu/Node22/Chrome, 183/183 plus 477 mobile screenshots. Artifact `11075044000`.
- Main CI: [36663836834](https://github.com/okometsbu-beep/topik-quest/actions/runs/36663836834), pass.
- Pages: [36663836084](https://github.com/okometsbu-beep/topik-quest/actions/runs/36663836084), pass.
- Live: https://okometsbu-beep.github.io/topik-quest/ reports v153; 4 base + 51 runtime files
  pass HTTP smoke, the live `data/shorts-levels.js` SHA-256 matches the release file, and all four
  new IDs are present.
- Rollback: revert #220 or restore v152 main
  `efaf145a0c8be0430fcbeb4ebc10e295463fc8b7`.
- Unverified: physical iPhone/Android, native Japanese or Korean educator review, consenting learner
  timing, D1/D7 recall, and full offline recovery.
