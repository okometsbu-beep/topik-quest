# S04 · TOPIK I morning-routine Shorts candidate

Candidate: v154. Product rollback baseline: v153
`ace86c3600080693ac440dcaaf373f141fa1f960`.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 424 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about a different everyday morning action:

- `일어나다`: rise from bed after sleeping
- `씻다`: clean the face, hands, or body with water
- `갈아입다`: remove current clothes and put on different ones
- `준비하다`: get needed items or conditions ready beforehand

The examples explicitly name getting up at seven, washing face and hands, changing after exercise,
or preparing a bag and umbrella. Selected-choice feedback explains the learner's choice before
optional full coaching compares all four. Fixed choices are shuffled and restored through the
existing stable-ID storage contract.

| Stable ID | Content hash | Korean example |
|---|---|---|
| `S04-I-W-ROUTINE-01` | `d42fa04b06ef45f0a9e5ac2aefbea76feab8f62cda3016d8043e50fddc6fc607` | `저는 아침 일곱 시에 일어나요.` |
| `S04-I-W-ROUTINE-02` | `4bf26367542f420fb5f3e0e151a8454d2cf9412c594e1c54adcb8d4dd51ff9b7` | `일어나서 얼굴과 손을 씻었어요.` |
| `S04-I-W-ROUTINE-03` | `b218ff38c046d708ba857363bbc7d2c5be60aeba9e7b643c1f580421efc422a1` | `운동이 끝난 뒤 새 옷으로 갈아입었어요.` |
| `S04-I-W-ROUTINE-04` | `6311b939b91d9847a87c7e5bf6723619c1ff00b1bdb2a0065bf6947bd760f0b8` | `가방과 우산을 미리 준비했어요.` |

## Candidate verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One action and result per card. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Rising, washing, changing clothes, and preparing do not overlap in these examples. |
| Explanation | AI-reviewed pass | Selected-choice feedback plus decisive evidence, all four traps, and a reusable action/result method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example, and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | designed-pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |

Candidate inventory is 428 rows / 302 exact question-choice families (TOPIK I 152, TOPIK II 150).
The existing 126 redundant rows, 30 duplicate groups, 15 structural review candidates, 0 answer
conflicts, and 0 comprehensive approvals do not change. These totals are not content approvals, and
no existing Shorts row, original 2,088-item bank entry, answer, or stable ID is altered.

## Release record

- Product PR: [#222](https://github.com/okometsbu-beep/topik-quest/pull/222), squash
  `99772e910a744f813ba8a0d8236ba694093103c6`.
- Branch CI: [36738114875](https://github.com/okometsbu-beep/topik-quest/actions/runs/36738114875),
  Ubuntu/Node 22/Chrome. Full 184/184 passes. The mobile artifact `11110255353` contains 479 PNGs,
  including 320/375/390/430px light/dark checks, the Japanese selected washing distractor,
  optional full coaching, and graded reload restore.
- Direct inspection: `00dy-shorts-topik1-morning-routine-wrong-light.png` and
  `00dz-shorts-topik1-morning-routine-full-dark.png` show readable selected feedback, Next before
  optional coaching, and no observed horizontal clipping. These are browser-emulated screenshots,
  not physical-device evidence.
- Deployment: [main CI 36742809499](https://github.com/okometsbu-beep/topik-quest/actions/runs/36742809499)
  and [Pages 36742810718](https://github.com/okometsbu-beep/topik-quest/actions/runs/36742810718) pass.
  Live `https://okometsbu-beep.github.io/topik-quest/` reports v154 with 4 base + 51 runtime files;
  live `data/shorts-levels.js` SHA-256 `5b3b144140a4cd1e7e02997d1197a4b293f4002191e01f5cd02746ceefc0b598`
  matches main, and all four stable IDs are present.
- Rollback: revert #222 or restore v153 main
  `ace86c3600080693ac440dcaaf373f141fa1f960`.

Physical iPhone/Android, native Japanese or Korean educator review, consenting learner timing,
D1/D7 recall, and full offline recovery remain unverified.
