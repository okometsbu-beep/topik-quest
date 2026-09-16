# S04 · TOPIK II plan-stage Shorts pilot

Candidate: v118 on `agent/loop-20260916-topik2-plan-stage`.
Production remains v117 `a14dd083f3afd64142990ae1d829df985cbf8db3` until CI, emulated-mobile review, merge, and live checks pass.
Product rollback is v117 `a14dd083f3afd64142990ae1d829df985cbf8db3`.
Scope: four new TOPIK II grammar cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 348 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the stage of a future plan:

- `-(으)ㄹ까 하다`: still considering, not decided yet
- `-(으)ㄹ 생각이다`: the speaker's personal intention
- `-기로 하다`: a decision already made after judgment or discussion
- `-(으)ㄹ 예정이다`: an event fixed on a date or schedule

The examples make the stage decisive through an undecided swimming idea, a personal post-graduation
intention, a family decision, or a Monday event schedule. Selected-choice feedback explains the chosen
trap before optional full coaching compares all four. Fixed choices are shuffled and restored through
the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-II-G-PLAN-01` | `c3d0bdfd4bb00afcad34064d9714549bb3acbc707f54a400e33373e260e3ef58` | `졸업 후에는 한국에서 일할 생각이에요.` |
| `S04-II-G-PLAN-02` | `1c7d3adc6de8981c44bafe8daf9a484a1b9b56bed5487ddbdb9eb888151d7956` | `가족 회의에서 올해는 제주도로 여행하기로 했어요.` |
| `S04-II-G-PLAN-03` | `5822a9365ce9acee079ebca38bb484233001b1f849a6944635284d63a1b5973f` | `요즘 퇴근 후에 수영을 배울까 해요.` |
| `S04-II-G-PLAN-04` | `1e99808a0820457fdf8fb3b25ae3034cabeb5c7ed2055858b28b2cabbe693838` | `설명회는 다음 주 월요일에 열릴 예정입니다.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One grammar form and four compact plan stages. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Considering, personal intention, decision, and fixed schedule use explicit non-overlapping contextual cues. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a plan-stage method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK II rows. |
| Focused local checks | pass | Node 24 content checks pass 24/24; generated inventory checks pass 2/2. |
| Full release checks | pass | Node 24 `npm run check` passes 118/118; runtime contract reports v118, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pending | CI must cover 320/375/390/430px light/dark, selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | Production remains v117 until main CI, Pages, live asset, stable-ID, and smoke checks pass. |

Candidate inventory is 352 rows / 226 exact question-choice families (TOPIK I 112, TOPIK II 114).
The 15 existing structural review candidates do not increase. These totals are not content approvals:
the generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.

The first draft reused the existing original term `-(으)려던 참이다`. The uniqueness check rejected it
before release; the candidate now uses the distinct `-(으)ㄹ까 하다` to make the progression
considering → intention → decision → fixed schedule explicit. No existing row or stable ID was altered.
