# S04 · TOPIK II argument-noun Shorts candidate

Candidate: v151. Product rollback baseline: v150
`69523389d740a5b3f4f0ad0c8c97d355f906d601`.
Scope: four new TOPIK II word cards only. This is a bounded AI content review plus automated and
emulated-browser QA record, not native-speaker approval, learner timing evidence, or approval of the
other 412 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the role of a noun in an argument:

- `주장`: a position or opinion put forward
- `근거`: information or a reason supporting a claim or judgment
- `반박`: a response showing what is wrong with another claim
- `결론`: a final judgment reached after review or discussion

The examples expose one decisive role: proposing a speed-limit position, supporting a policy judgment
with survey data, challenging a company explanation, or reaching a final decision after reviewing
sources. Selected-choice feedback explains the chosen role; optional coaching compares all four.
Fixed choices are shuffled and restored through the existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
| --- | --- | --- |
| `S04-II-W-ARGUMENT-01` | `d808b6fc01e10664b5c649e5c26e3c4b4a28425d5cc3e6cf54ad661eeb8d57fb` | `전문가들은 어린이 보호 구역의 제한 속도를 유지해야 한다는 주장을 폈습니다.` |
| `S04-II-W-ARGUMENT-02` | `56dbbc6cd9125d71b9188b6d359bed4bbccb3a968bed10c17e90d5a8601871ce` | `연구팀은 설문 조사 결과를 정책 개선의 근거로 제시했습니다.` |
| `S04-II-W-ARGUMENT-03` | `ec7c4a95413d4b79d40e583608ad1fba62f52942dab9fbcf9946af322d2c5d4f` | `회사의 해명은 사실과 다르다는 반박이 제기되었습니다.` |
| `S04-II-W-ARGUMENT-04` | `1d42ac17c363a58c40d40138e342006b70d9d2b3545340dc422120f0f2fed10f` | `여러 자료를 검토한 뒤 위원회는 지원을 확대해야 한다는 결론을 내렸습니다.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
| --- | --- | --- |
| One quick judgment | designed-pass | One argument role per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Position, support, challenge, and final judgment are non-overlapping in these definitions and examples. |
| Explanation | AI-reviewed pass | Decisive evidence, every-choice traps, and a reusable argument-role method exist in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, example, and coaching are bundled in four languages; no network translation is required. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1`, earlier IDs, original bank, and learner records are unchanged. |
| Focused local checks | pass | `npm run test:content` passes 47/47. |
| Full release checks | pass | Local and GitHub release checks pass 181/181 at v151. |
| Browser visual | emulated-pass | PR CI checks Japanese wrong-answer and expanded coaching at 320/375/390/430px in both themes; the two representative screens were directly inspected. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |

Candidate inventory is 416 rows / 290 exact question-choice families (TOPIK I 144, TOPIK II 146).
The existing 126 redundant rows, 30 duplicate groups, 15 structural review candidates, zero answer
conflicts, and zero comprehensive approvals remain unchanged. These totals are inventory, not
educational approval.

## Deployment record

- PR: [#216](https://github.com/okometsbu-beep/topik-quest/pull/216), squash
  `c91510535188b273f8177a449415c4b607773f6d`.
- PR CI: [36590876365](https://github.com/okometsbu-beep/topik-quest/actions/runs/36590876365),
  Ubuntu/Node22/Chrome, 181/181 plus 473 mobile screenshots. Artifact `11043988217`.
- Main CI: [36592147626](https://github.com/okometsbu-beep/topik-quest/actions/runs/36592147626), pass.
- Pages: [36592145973](https://github.com/okometsbu-beep/topik-quest/actions/runs/36592145973), pass.
- Live: https://okometsbu-beep.github.io/topik-quest/ reports v151; 4 base + 51 runtime files pass HTTP smoke and the live `data/shorts-levels.js` SHA-256 matches the release file.
- Rollback: revert #216 or restore v150 main
  `69523389d740a5b3f4f0ad0c8c97d355f906d601`.
- Unverified: physical iPhone/Android, native Japanese or Korean educator review, consenting learner timing, D1/D7 recall, and full offline recovery.
