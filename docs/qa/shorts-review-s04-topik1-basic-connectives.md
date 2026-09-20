# S04 · TOPIK I basic-connective Shorts pilot

Production: v125 `91923d31206dfbe8695f5348050ab9834dafc478` (PR #160).
Product rollback is v124 `10bb264f48b75754c10456f33236d3352f6ba5a0`.
Scope: four new TOPIK I grammar cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 376 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about the relation between two clauses:

- `-(으)면서`: the same person performs two actions simultaneously
- `-(으)니까`: the first clause gives a reason for a judgment or request
- `-(으)러`: an action is the purpose of movement expressed by `가다` or `오다`
- `-는데`: the first clause supplies background for the following decision or explanation

The examples supply a decisive relation cue: overlapping actions, a request after a reason, a
movement verb after a purpose, or a current situation before a later decision. Selected-choice
feedback explains the chosen trap before optional full coaching compares all four. Fixed choices
are shuffled and restored through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-I-G-CONNECTIVE-01` | `7df8371b2a16717ace9db107b8a46c5459370e39b11c2f2e0ba70f2b16b51186` | `친구와 이야기하면서 커피를 마셨어요.` |
| `S04-I-G-CONNECTIVE-02` | `cca3b7390601fe3ccba859bfbe6cbf271fba279c21b11220c0d37257096d4c46` | `비가 오니까 우산을 가져가세요.` |
| `S04-I-G-CONNECTIVE-03` | `473b170c04a386c2351eec4980c4b4afc76dccdf2c299b62c0ffe2c0632031e6` | `책을 빌리러 도서관에 갔어요.` |
| `S04-I-G-CONNECTIVE-04` | `ab2073e2c95e13e6b634d250ff1c900b42f524505fbdfb132b537b9ad6863902` | `지금 회의 중인데 나중에 전화할게요.` |

## Production verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One form and one explicit clause relation per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Simultaneity, reason before a request, movement purpose, and discourse background are non-overlapping in these examples. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a clause-relation method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Node 24 vocabulary + generated-inventory checks pass 28/28. |
| Content/full checks | pass | Content checks pass 31/31; `npm run check` passes 125/125 with the v125 45-file runtime contract. |
| Emulated mobile | pass | PR #160 CI `35469665976` covers 320/375/390/430px light/dark, selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10592252454` screens `00da`/`00db` were inspected. Local Chrome remains unavailable. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pass | PR #160 final CI `35470007260`, main CI `35470201592`, and Pages `35470200959` passed. Live HTTP smoke reports v125 with 3 base + 45 runtime files; public Chrome verified the Japanese `-(으)면서` wrong-answer, reload-restoration, and detailed-coaching flow. |

Production inventory is 380 rows / 254 exact question-choice families (TOPIK I 128, TOPIK II 126).
The 15 existing structural review candidates do not increase. These totals are not content approvals:
the generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.
No existing Shorts row, original bank item, answer, or stable ID is altered.
The inspected light screenshot shows a deliberately wrong reason/request choice, the correct
simultaneous-action answer, and choice-specific Japanese feedback. The dark screenshot shows
next-first flow and the complete evidence → traps → clause-relation method without horizontal
overflow. This is Linux Chrome emulation rather than physical-device evidence.
