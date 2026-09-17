# S04 · TOPIK I basic-tense Shorts pilot

Candidate: v119 on `agent/loop-20260917-topik1-basic-tense`.
Production remains v118 `5d7b03c73c21276523b8c56d00d7e0d347b0fea3` until CI, emulated-mobile review, merge, and live checks pass.
Product rollback is v118 `5d7b03c73c21276523b8c56d00d7e0d347b0fea3`.
Scope: four new TOPIK I grammar cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 352 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the time of an action:

- `-아/어요`: a repeated present habit, made decisive by `매일 아침`
- `-았/었어요`: an action completed in the past, made decisive by `어제`
- `-고 있어요`: an action in progress now, made decisive by `지금`
- `-(으)ㄹ 거예요`: a future plan, made decisive by `내일`

The four forms and examples match the existing beginner grammar course's reviewed present, past,
progressive, and future-plan rules. Selected-choice feedback explains the chosen time trap before optional
full coaching compares all four. Fixed choices are shuffled and restored through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-I-G-TENSE-01` | `45c8f75209b4e9e517eafb78b64994ce09a329333fb100aea028f0956ac7c2a3` | `저는 매일 아침 일곱 시에 일어나요.` |
| `S04-I-G-TENSE-02` | `760d9a511d797870f0178c97a433b34587cc4a43a40b07b970569a566d120a30` | `어제 도서관에서 책을 빌렸어요.` |
| `S04-I-G-TENSE-03` | `2ec439e0f020229210a92cb404c7cbad866ec668502ba3c6ac2e721db80d78e8` | `지금 버스를 기다리고 있어요.` |
| `S04-I-G-TENSE-04` | `738c812bd0ca9c82869ab061347f122e50d29fea9e141a93d0f7de23ec3c200c` | `내일 친구를 만날 거예요.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One grammar form and one explicit time cue per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | `매일 아침`, `어제`, `지금`, and `내일` make the four time categories non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a time-cue method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Course consistency | AI-reviewed pass | Forms and functions are aligned with `data/beginner-grammar-v1.js` present, past, progressive, and future-plan lessons. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 22/22; content checks pass 25/25. |
| Full release checks | pass | Node 24 `npm run check` passes 119/119; runtime contract reports v119, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pending | PR CI must cover 320/375/390/430px light/dark, selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | Production remains v118 until main CI, Pages, live asset, stable-ID, and smoke checks pass. |

Candidate inventory is 356 rows / 230 exact question-choice families (TOPIK I 116, TOPIK II 114).
The 15 existing structural review candidates do not increase. These totals are not content approvals:
the generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.

The local release candidate passes the same forms and functions already taught by the beginner grammar course.
No existing Shorts row, original bank item, answer, or stable ID was altered. PR mobile evidence, merge,
and deployment remain pending.
