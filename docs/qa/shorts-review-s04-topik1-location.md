# S04 · TOPIK I everyday-location word Shorts pilot

Baseline: production v105 `4048d936c0159229557997be52ad35c11f60b7a3`; reviewed candidate v106.
Scope: four new TOPIK I word cards only. This is an AI content review plus automated/browser QA record,
not native-speaker approval, learner timing evidence, or approval of the other 304 Shorts rows.

## Reviewed learning contract

Each card asks one quick spatial-relation judgment using the number of reference points and distance:

- `건너편`: the opposite side across a road or open space
- `옆`: directly beside one reference point
- `사이`: between two reference points
- `근처`: the nearby area, not necessarily directly adjacent

The Korean terms and all four choice labels are short. Each reviewed example supplies a decisive spatial cue,
so only one option fits. Selected-choice feedback explains the chosen distinction before optional full coaching
maps all four and gives one reusable reference-point → distance method. Fixed choices are shuffled and restored
through the existing Shorts record.

| ID | Content hash | Decisive example |
|---|---|---|
| `S04-I-W-PLACE-01` | `aac74098555cb4ee6faae36ea0e83a6926e58ba8ad58a9a9a116ecfe31668993` | `은행은 길 건너편에 있어요.` |
| `S04-I-W-PLACE-02` | `36b51fde3a7e40713de98f06614fce27c2f59858032ee813a58aa12778a880af` | `약국은 병원 옆에 있어요.` |
| `S04-I-W-PLACE-03` | `3cf98f1a57e1c434536e188f7939312606e2a3e66e2f8d3b5b1800613ef732f4` | `화장실은 식당과 카페 사이에 있어요.` |
| `S04-I-W-PLACE-04` | `4e61543b636740a29b7de95260ef18abf54a0ec433f152adc069b85812c433e3` | `역 근처에 편의점이 있어요.` |

## Verdict and evidence boundary

| Gate | Result | Evidence / limitation |
|---|---|---|
| One quick judgment | designed-pass | One location word and four compact spatial meanings. Actual 5–15-second timing is unmeasured. |
| Unique answer | AI-reviewed pass | Across, directly beside, between two points, and nearby area are separated by each example. |
| Explanation | AI-reviewed pass | Concise selected-choice feedback plus decisive evidence, all four traps, and a reusable method in ko/ja/en/zh. |
| Translation | AI-reviewed pass | Meaning, choices, feedback, full example and coaching are bundled in ko/ja/en/zh; no network translation is needed. |
| Repeat/inventory | automated pass | Four stable IDs add four exact families with no new duplicate, structural flag, or conflicting-answer group. |
| Storage | automated pass | Existing `topikQuestShortsV1` and earlier IDs remain; cards are appended after existing TOPIK I rows. |
| Full local checks | pass | Node 22 `npm run check` passed 101/101. |
| Emulated mobile | pass | PR #125 CI `34615296081` covered 320/375/390/430px, light/dark, wrong-answer recovery, expanded coaching, next-first flow and reload restoration. Evidence: `00bm-shorts-topik1-location-wrong-light.png`, `00bn-shorts-topik1-location-full-dark.png`. |
| Human/learner/device | unverified | No native reviewer, consenting learner timing, delayed recall, or physical iPhone/Android evidence. |
| Overall | bounded pass | Automated, visual-emulation and AI content gates pass for these four IDs only; external human, timing and physical-device validation remains open. |

Inventory becomes 308 rows / 182 exact question-choice families (TOPIK I 92, TOPIK II 90). The 15 existing
structural review candidates do not increase. These totals are not content approvals: the generated inventory
remains `approved: 0`, and only the four IDs above have this bounded AI review record.
