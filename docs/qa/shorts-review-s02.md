# S02 · meeting/home Shorts review pilot

Baseline: v99 `5a2cf78fc3ff53e29d1f3f32265770f04a5ef2ce`, reviewed candidate v100.
Scope: one exact duplicate family only. This is an AI content review plus automated/browser QA record,
not a human language review, learner timing result, or approval of the other 279 Shorts rows.

## Reviewed learning contract

- Source: `회의가 끝난 후에 바로 집에 갔습니다.` — the meeting ended, then the speaker immediately went home.
- Correct paraphrase: `회의를 마치고 곧 집으로 갔습니다.` — preserves event order and action.
- Selected trap: `회의 전에 집에 들렀습니다.` reverses `후에` to `전에` and changes going home to stopping by home.
- Other traps: weekday exercise and a shop not selling fruit change both topic and action.
- Reusable method: compare subject, action, and time order; retain only `meeting ends → immediately goes home`.
- Japanese decisive meaning: `会議が終わった後、すぐ家に帰りました。`
  The reviewed short feedback and full explanation preserve `後／前`, immediacy, and the difference between
  `帰る` and `立ち寄る` without revealing an answer before grading.

All nine immutable generated IDs keep their original question, choices, answer, mock position, and storage identity:

| ID | S02 content hash |
|---|---|
| `M01-I-R-44` | `a95f129a9647aab350d14e828b0107a66d7106e7634e466c8838e224ea78cc7b` |
| `M02-I-R-43` | `e8e633823cc242dea75f82f042eb343f8efe640b699bc3bec9038b0f22082d6d` |
| `M04-I-R-45` | `c7cafb774898dc056db079769f8a1e8423a88bf837a90ec9007d47bedc6d14f4` |
| `M05-I-R-44` | `e2f928a77cf2157dffa75839bd8f8eacb1ada94642bccb3257a9a3a7c5d17e18` |
| `M06-I-R-43` | `895d031728096140b941828b43dbeba19788e09de19f2ce4d00b91b93a46f9bb` |
| `M08-I-R-45` | `adce9f7430a2bc8dce9f6eacdb950c1fc46cb4b20dbfa776a9dfb31b05504337` |
| `M09-I-R-44` | `3d6e41d834d5e0994b431fd1e0dfee043fac9024ce070c8f6ed89449b71fc1be` |
| `M10-I-R-43` | `6cd372f44dd41eeb0ad28edbcb6f667b9e9abf221df0c175e7406c1325cefa72` |
| `M12-I-R-45` | `4d9aee92b45ec1457881c7b892056be696b066af5d7dfb7a603718bdcd40e651` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One same-meaning decision; no added subquestion. Real 5–15 second timing remains unmeasured. |
| Answer | AI-reviewed pass | All nine IDs resolve to the same unique paraphrase under shuffled choices. |
| Explanation | AI-reviewed pass | Decisive evidence, all three choice-specific traps, and one reusable method in ko/ja/en/zh. |
| Japanese meaning | AI-reviewed pass | Source, correct choice, selected trap, two unrelated traps, short feedback and full coaching reviewed together. |
| Runtime/storage | automated pass | Original generated bank files, IDs, answer indices, fixed mocks, and learner roots are unchanged. |
| Mobile/theme | pending until CI evidence review | CI covers 320/375/390/430px light/dark, collapsed/expanded states; not a physical device. |
| Human/learner | unverified | No native Japanese reviewer, consenting beginner timing, day-1 recall, or physical iPhone/Android evidence. |
| Overall family | in-review | Automated and AI content gates pass; mobile CI and external evidence remain open. |

The graded card shows the selected-choice explanation first. `Next question` precedes a collapsed full explanation,
so detailed coaching is optional rather than a delay. Bank questions do not show a vocabulary proposal sourced from
an unrelated curated index. This does not implement S03 semantic repeat prevention or S04 corpus expansion.
