# Travel feedback item audit — 2026-09-25

Scope: the first Seoul route's six question scenes, including route-dependent taxi variants.
This is a source/data audit, not browser or learner evidence.

## Inventory and invariant check

- 9 presentation contexts use 8 distinct question payloads: `TRAVEL-A1`, `TRAVEL-A2`,
  `TRAVEL-A3`, `TRAVEL-A4`, `TRAVEL-A4-TAXI`, `TRAVEL-A5`, `TRAVEL-A5-TAXI`, and
  shared `TRAVEL-A6` in rail/taxi endings.
- A Node VM load of the actual pack found 0 invalid answer indices and 0 missing ko/ja/en/zh
  choice or explanation fields. This does not certify native-language quality.
- The defect is therefore not an absent answer key. It is the teaching structure after grading:
  most payloads give only correct-answer evidence, while `travelCoachMarkup` supplies generic
  distractor and method text that is not tied to each visible option.

## Per-context findings

| Context | What is already correct | Remaining defect | Required repair |
| --- | --- | --- | --- |
| `q-hello` / `TRAVEL-A1` | The localized explanation already contains decisive evidence, all three distractor meanings, and a reusable compound-word method. | The renderer places that whole text under “correct evidence”, then repeats generic distractor/method sections. The hierarchy is misleading and verbose. | Store/render the three parts separately; do not append generic coaching when item-specific coaching exists. |
| `q-station` / `TRAVEL-A2` | `공항철도` and `어디예요?` correctly identify the rail sign. | No specific rejection of taxi sign, airport map, or suitcase. The shared hotspot tip incorrectly uses `지하철역` as the keyword although this item is about `공항철도`. | Add three option-specific reasons and a sign/transport-name method based on `공항철도`. |
| `q-myeongdong` / `TRAVEL-A3` | The explanation distinguishes final destination `명동` from transfer point `서울역`; the candidate method correctly defines `최종 목적지`. | `인천공항` and `홍대입구` are not explained. | Cover all three alternatives: transfer point, departure point, and unrelated station. |
| rail `q-ticket` / `TRAVEL-A4` | The candidate distinguishes ticket purchase, airport return, and taxi waiting and gives a reusable `찍으세요`/`찍어요` method. | Required four-width/two-theme browser evidence is unavailable. The special case is also hard-coded in the renderer instead of question data. | Keep the teaching content, move it to item data, and visually verify before release. |
| taxi `q-ticket` / `TRAVEL-A4-TAXI` | `명동까지 가 주세요` correctly answers the driver's destination question. | The three alternatives are not individually rejected; the generic dialogue method cannot explain transfer instruction vs location question vs ticket request. | Explain each speech act and reuse the `어디까지` → destination + `까지 가 주세요` pattern. |
| rail `q-transfer` / `TRAVEL-A5` | `갈아타다` is correctly defined as changing trains/buses. | Wait, take a photo, and buy a ticket are not contrasted. The hotspot method again mentions `지하철역`, which is unrelated to the action distinction. | Contrast all four verbs and teach learners to match the imperative verb before the shared `여기에서 ...세요` frame. |
| taxi `q-transfer` / `TRAVEL-A5-TAXI` | `명동역에서 내려요` correctly supplies an alighting place. | Airport, transfer instruction, and ticket request are not individually rejected. | Match `어디에서 내려요?` with place + `에서 내려요`; explain each wrong speech act/location. |
| rail `q-thanks` / shared `TRAVEL-A6` | `감사합니다` is a polite thank-you. | Greeting, reassurance, and apology are not distinguished. | Explain the social function of every option and reuse a situation → speech-function method. |
| taxi `q-thanks` / shared `TRAVEL-A6` | The same answer remains correct after a safe arrival. | Shared generic feedback ignores the taxi-driver context, and the same three alternatives remain unexplained. | Reuse the option distinctions while rendering the taxi-specific evidence/context. |

## Repair boundary

The next implementation should replace renderer hard-coding with one structured item coach contract
(`evidence`, per-choice `traps`, `method`) in all eight payloads and render only the active payload's
localized content. Tests must cover every payload, both rail/taxi variants, shuffled/selected wrong
choices, and absence of the unrelated `지하철역` tip. Existing bank IDs, answers, route state, rewards,
inventory, and saved progress stay unchanged.

No PR, merge, version bump, CI, or deployment is authorized from this audit alone. The existing
candidate still requires 320/375/390/430px light/dark checks, console/touch/re-entry checks, and visual
inspection. Physical iPhone/Android, Japanese native review, and learner comprehension remain unverified.

