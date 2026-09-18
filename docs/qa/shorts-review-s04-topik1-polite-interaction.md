# S04 · TOPIK I polite-interaction Shorts pilot

Candidate: v121 on `agent/loop-20260918-topik1-polite-interaction`.
Production remains v120 `ab8fa3e8803d904310ba49c811a9b4e9f764a0ab`; product rollback is v119
`584b42f86b062eb18932aac541ed2ffcfc3b723d` until the candidate passes CI and live verification.
Scope: four new TOPIK I grammar cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 360 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the purpose of a polite utterance:

- `주세요`: request an item named immediately before it
- `-(으)세요`: politely ask or direct the listener to do an action
- `-지 마세요`: politely ask the listener not to do an action
- `-(으)ㄹ까요?`: suggest an action for speaker and listener to do together

The example supplies the decisive cue: noun phrase, requested action, negated action, or `같이` plus
a question. Selected-choice feedback explains the chosen speech-act trap before optional full coaching
compares all four. Fixed choices are shuffled and restored through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-I-G-INTERACTION-01` | `c9f02849a8e5c7db08772180947f8198ab03f2a4f0eb9e5649025feb733c6993` | `물 한 병 주세요.` |
| `S04-I-G-INTERACTION-02` | `9318b204b9faa24ce2f1420a26d91f022623669557f4bb3a6d5c6fa40caaf734` | `여기에서 잠깐 기다리세요.` |
| `S04-I-G-INTERACTION-03` | `406762666ca9dca26adec57d2428d4fe67907cf3fc3f80412b1e6e385694fa22` | `안에 들어가지 마세요.` |
| `S04-I-G-INTERACTION-04` | `e6963861720e38db5b5956665fdd96f65753d2ea2a569c7fa091be81b5de73c2` | `같이 사진을 찍을까요?` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One form and one explicit speech purpose per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Noun request, positive action request, negative action request, and shared suggestion are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a speech-goal method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Course consistency | AI-reviewed pass | Functions match the existing beginner course lessons for noun `주세요`, `-(으)세요`, `-지 마세요`, and `-(으)ㄹ까요?`. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 24/24; content checks pass 27/27. |
| Full release checks | pass | Node 24 `npm run check` passes 121/121; runtime contract reports v121, 45 ordered files, and valid bank hashes. |
| Emulated mobile | pending | Required at 320/375/390/430px in light/dark before PR merge. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | GitHub Pages remains on v120 until CI and live checks pass. |

Candidate inventory is 364 rows / 238 exact question-choice families (TOPIK I 120, TOPIK II 118).
The 15 existing structural review candidates do not increase. These totals are not content approvals:
the generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.
No existing Shorts row, original bank item, answer, or stable ID is altered.
