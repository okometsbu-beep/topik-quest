# S04 · TOPIK II judgment/constraint Shorts pilot

Production: v116 `0b93456fc400ff47b378c6e15b1384bc6187e8f2` through PR #142.
Product rollback is v115 `05e84b401330074bf3432339859169cc156d6357`.
Scope: four new TOPIK II grammar cards only. This is an AI content review plus automated QA record,
not native-speaker approval, learner timing evidence, or approval of the other 340 Shorts rows.

## Reviewed learning contract

Each card asks one quick judgment about an action:

- `-(으)ㄹ 수밖에 없다`: no alternative remains, so the action is unavoidable
- `-(으)ㄹ 만하다`: the action is worth doing
- `-(으)ㄹ 필요가 있다`: the action is required for a goal or condition
- `-(으)ㄹ 필요가 없다`: the need is absent or already met, so the action is unnecessary

The examples make the judgment decisive through the last train ending, a film's good ending, a required
application document, or an already-booked ticket. Selected-choice feedback explains the chosen trap before
optional full coaching compares all four. Fixed choices are shuffled and restored through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-II-G-JUDGMENT-01` | `218916778a34b4bf0743cfb40c3a967c5b0195aadb080c35789295fa57f132f1` | `막차가 끊겨서 택시를 탈 수밖에 없었어요.` |
| `S04-II-G-JUDGMENT-02` | `d53e8fade9e16fb22766f4a2313a5c3a8107f5bf171966a8b8fd75dcdd03004e` | `이 영화는 결말이 좋아서 다시 볼 만해요.` |
| `S04-II-G-JUDGMENT-03` | `3a37aa88f0018527ef5c99dbeef5dc2aeea1e219bb00014e8e0ae7d9b6abb62c` | `신청하려면 오늘 서류를 낼 필요가 있어요.` |
| `S04-II-G-JUDGMENT-04` | `28762760aa4949f757bba3cdf4837e6171eba352f950976832eea92afcb74ba0` | `이미 예약했으니 표를 다시 살 필요가 없어요.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One expression and four compact action judgments. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | No alternative, worth, required, and unnecessary use explicit non-overlapping contextual cues. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and an action-judgment method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK II rows. |
| Focused local checks | pass | Node 24 content checks pass 22/22; generated inventory checks pass 2/2. |
| Full release checks | pass | Node 24 `npm run check` passes 116/116 at v116. |
| Emulated mobile | pass | PR #142 final CI `34925330780` covers 320/375/390/430px light/dark, selected-wrong feedback, expanded coaching, next-first flow and reload restoration. Artifact `10380265217` screens `00ci`/`00cj` were inspected. Local Chrome was unavailable. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Deployment | pass | PR #142 was squash merged as `0b93456fc400ff47b378c6e15b1384bc6187e8f2`; main CI `34925644900` and Pages `34925644352` succeeded. Public Chrome loaded runtime scripts at `?v=116`; live `data/shorts-levels.js` contained all four stable IDs and terms. |

Two documentation-head reruns then exposed a pre-existing test race: after reload, the script waited for the
feedback element but could read it before its text rendered, failing on different earlier card groups. The harness
now waits for non-empty feedback content. This is verification-only and does not change app behavior or storage.

Candidate inventory is 344 rows / 218 exact question-choice families (TOPIK I 108, TOPIK II 110). The
15 existing structural review candidates do not increase. These totals are not content approvals: the
generated inventory remains `approved: 0`, and only the four IDs above have this bounded AI review record.
