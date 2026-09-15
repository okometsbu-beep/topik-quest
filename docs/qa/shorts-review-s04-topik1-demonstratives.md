# S04 · TOPIK I demonstrative Shorts pilot

Candidate: v117. Production remains v116 `0b93456fc400ff47b378c6e15b1384bc6187e8f2` until the
release gates pass. Product rollback is v115 `05e84b401330074bf3432339859169cc156d6357`.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 344 Shorts rows.

## Reviewed learning contract

Each card asks one quick object-reference judgment:

- `이것`: an object near the speaker (`これ`)
- `그것`: an object near the listener or already mentioned (`それ`)
- `저것`: an object far from both speaker and listener (`あれ`)
- `어느 것`: which object among multiple choices (`どれ`)

The examples make the answer decisive through an umbrella held by the speaker, an object in front of
the listener, something visible far away, or a question choosing among bags. Selected-choice feedback
explains the chosen trap before optional full coaching compares all four and gives one reusable
speaker/listener/distance/selection method. Fixed choices are shuffled and restored through the existing
Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-I-W-DEMONSTRATIVE-01` | `a315142e05fd92d99f0a5f1e568dc455577f6dcf36847abd2b65479b0cb8c714` | `이것은 제가 들고 있는 우산이에요.` |
| `S04-I-W-DEMONSTRATIVE-02` | `befccbc5a254a6ab3415dfe1913fe1c982e99dd1e861a41207126d1b94cc29fe` | `네 앞에 있는 그것을 주세요.` |
| `S04-I-W-DEMONSTRATIVE-03` | `8a44f4c3ab76958dcea6c5e7f0a61ce8caceac9ef945540ad0199f3dc47f80c9` | `저기 멀리 보이는 저것은 남산타워예요.` |
| `S04-I-W-DEMONSTRATIVE-04` | `070cab79f70829326997af6946ce22f98eb7a1855c8d89892e561dcad3e0e71d` | `이 가방들 중에서 어느 것이 가장 가벼워요?` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One demonstrative and four compact relations. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Speaker-held, listener-front, far-away, and choose-among-many cues do not overlap. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a relation-first method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Focused local checks | pass | Node 24 focused vocabulary and generated-inventory checks pass 20/20; content checks pass 23/23. |
| Full release checks | pass | Node 24 `npm run check` passes 117/117 at candidate v117. |
| Emulated mobile | pass | PR #144 CI `34986620849` covers 320/375/390/430px in light/dark, selected-wrong feedback, expanded coaching, next-first flow and reload restoration. Artifact `10403494820` screens `00ck`/`00cl` were inspected. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pending | Production remains v116 until the evidence-only final PR CI, merge, main CI, Pages and live checks pass. |

Candidate inventory is 348 rows / 222 exact question-choice families (TOPIK I 112, TOPIK II 110). The
15 existing structural review candidates do not increase. These totals are not content approvals: the
generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.

The first PR run `34986362108` never reached browser verification because the connector upload truncated
the generated inventory JSON. The candidate content tests themselves passed; replacing that one blob with
the exact local bytes made the remote tree identical to the locally checked tree, and unchanged run
`34986620849` passed the complete release and browser suite.
