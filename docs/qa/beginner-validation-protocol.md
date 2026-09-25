# Japanese beginner validation protocol

Status: **ready for user approval; not started**. This document fixes the test contract for the
v135 learning renewal. It does not authorize recruitment, invitations, observation, recording,
or collection of learner data.

## Decision this test supports

Can a consenting Japanese-speaking complete beginner use the public MALBIT PWA to:

1. finish one appropriate Korean learning step without being directed through the UI;
2. understand the answer and use three taught travel expressions without a hint after 10 minutes;
3. find the next learning or review path; and
4. return at D1 and D7 and attempt the same recall path again?

This is a small product usability gate, not proof of population-wide learning effectiveness. Automated
browser runs, seeded QA records, maintainers, Korean speakers, and AI agents never count as participants.

## Approval boundary

Before the first participant is contacted, the user must explicitly approve all of the following in
one testing round:

- who may invite the testers and the invitation text;
- the consent notice and whether observation is remote or in person;
- the private location, access list, and deletion date for raw notes;
- any optional screen/audio recording (the default is **none**); and
- the D1/D7 reminder channel.

Until that approval, do not recruit, message, schedule, observe, create a form, collect contact details,
or enable analytics. Apple/Google accounts, store testing, microphones, and app permissions are outside
this protocol. A filled participant sheet, recording, contact detail, exact voice, exact score, or raw
Korean response must never be committed to this public repository or pasted into a public Issue/PR.
The approved inviter may keep the minimum contact detail needed for D1/D7 reminders, separately from
the result sheet, until the agreed deletion date; the facilitator and public report receive only codes.

Consent notice draft for Japanese review and user approval:

> MALBITの初回学習と復習の使いやすさを確認するテストです。参加は任意で、理由を伝えず
> いつでも中止できます。録音・録画は行いません。結果表には氏名や連絡先を書かず、参加者
> コード、所要時間、操作結果、10分後・翌日・7日後に思い出せた表現数だけを記録します。
> 公開するのは複数人をまとめた件数と不具合だけです。連絡先は承認された案内担当者だけが
> 次回確認のために保管し、承認された日までに削除します。同意しますか。

Do not treat this draft as approved or native-reviewed merely because it is in the repository.

## Participants and environments

- Full gate: at least 12 consenting adults whose first language is Japanese and who self-report no
  Korean study or only recognition of a few words. Report the screening wording and exclusions.
- One person contributes at most once to each denominator. Withdrawals and missed follow-ups stay
  visible; they are not silently replaced or counted as failures.
- Use the deployed production URL and a clean browser profile for first entry. Do not preload QA data.
- Completion evidence must include at least one physical iPhone/Safari and one physical
  Android/Chrome. Emulator evidence is reported separately and cannot satisfy this device gate.
- Record only participant code (`P01`–`P12`), session completion state, coarse device class
  (`iPhone`, `Android`, `other`), observed event times, allowed intervention codes, and aggregate
  task outcomes. Do not record name, email, account, IP address, exact location, demographic profile,
  advertising identifier, microphone audio, or personal free text.

## Fixed session script

The facilitator may say only: “한국어 학습 앱을 처음 사용한다고 생각하고 시작해 주세요.
막히면 평소처럼 행동해 주세요.” The approved Japanese equivalent may be read verbatim. Do not
name a button, explain the navigation, translate Korean, or reveal an answer.

### A. First learning success

1. Start at the public Home screen in Japanese with no saved MALBIT state.
2. Start the most appropriate learning path and complete one learning step.
3. Stop the first-success timer only when the learner has seen one Korean expression, made a response,
   received comprehensible result feedback, and can identify the next action.
4. Pass for this metric only when all four events occur within 10 minutes without a navigation/answer
   intervention. Reading the neutral opening script and resolving a product crash are not interventions;
   pointing to a control, translating, or explaining an answer are.

### B. Three-expression learning and 10-minute recall

1. Continue the same Travel learning path until three distinct target expressions have been taught.
   Record the stable content IDs; do not substitute an unreviewed generated item mid-round.
2. Ask the learner to explain why the chosen answer is right and, after any wrong choice, why that
   choice does not fit. Use only the app's feedback.
3. Begin a 10-minute interval after the third expression. The learner must not use MALBIT, notes, or a
   translation tool during the interval.
4. Present the same three situation prompts without Korean text or model answers, in a fixed order
   chosen before the round. Count an expression as independently recalled when its intended meaning
   is conveyed with the target expression; spacing, punctuation, and harmless pronunciation variation
   do not fail it. Record `0`–`3`, not a voice recording or transcript.
5. After scoring, allow the learner to open MALBIT and find the relevant review or next-learning route.
   Pass the discovery metric when the correct route is reached within two minutes without facilitator
   navigation help. The two-minute rule is an operational usability threshold, not an industry standard.

Frozen v1 targets follow the route the learner selected; the facilitator does not steer the choice:

| Route | Stable IDs | Fixed Japanese situation prompts | Target expressions |
|---|---|---|---|
| rail | `TRAVEL-A2`, `TRAVEL-A4`, `TRAVEL-A5` | 空港鉄道の場所を尋ねてください。 / 改札で交通カードをタッチする動作を言ってください。 / ここで乗り換えるよう案内してください。 | `공항철도가 어디예요?` / `교통카드를 찍어요.` / `여기에서 갈아타세요.` |
| taxi | `TRAVEL-A2`, `TRAVEL-A4-TAXI`, `TRAVEL-A5-TAXI` | 空港鉄道の場所を尋ねてください。 / タクシーの運転手に明洞まで行ってほしいと伝えてください。 / 明洞駅で降りると伝えてください。 | `공항철도가 어디예요?` / `명동까지 가 주세요.` / `명동역에서 내려요.` |

The prompt order stays as listed. The Korean targets are scoring references and are never shown during
recall. A content correction requires a new protocol commit before another participant is tested.

### C. D1 and D7

- Run the same three no-hint situation prompts at 20–28 hours and again 6–8 days after the first
  session, before review. Record `0`–`3` recalled expressions and whether the learner then independently
  reaches review.
- If a follow-up is outside its window, mark it `missed/outside window`; never backfill or infer a score.
- Product defects, network failures, facilitator help, and voluntary withdrawal use separate reason
  codes so they are not disguised as learning failures.

## Result sheet and reason codes

Keep the filled sheet only in the approved private location. One row per participant:

`code | consent | device class | first success seconds | first success pass | interventions | immediate rationale | 10m recall 0-3 | review found | D1 recall 0-3 | D1 review | D7 recall 0-3 | D7 review | reason code`

Allowed reason codes: `none`, `product-defect`, `network`, `facilitator-help`, `missed-window`,
`withdrawn`. Add a new code to the protocol before using it; do not put identifying narrative in the
sheet.

## Predeclared reporting and release gate

- Report denominators for every metric, not just percentages. The #110 product goal is at least
  **10/12** first-learning successes and **9/12** learners finding next learning/review.
- Report the distribution of 10-minute, D1, and D7 recall scores plus missed/withdrawn counts. #110
  does not set a numeric recall pass threshold, so this round must not invent one after seeing results.
- Break out physical iPhone and Android observations without publishing any participant-level row.
- List each reproducible product defect separately with screen/state, severity, learning impact, and
  anonymized aggregate frequency. Do not quote a participant if it could identify them.
- A gate failure reopens the smallest relevant product task. It does not justify lowering the target,
  excluding inconvenient results, adding fake participants, or expanding the map/question count.
- Public reporting is limited to aggregate counts, protocol version/commit, production version,
  device-class coverage, known sample limits, and linked fixes. Raw data deletion must be confirmed on
  the approved date.

## Ready-to-run checklist

- [x] Product target and metrics fixed against #110.
- [x] Intervention, timing, device, missing-data, and public-reporting rules fixed.
- [x] No-PII/default-no-recording data minimization fixed.
- [ ] User approval for invitation, consent, private storage/access/deletion, reminder channel, and any recording.
- [ ] At least 12 eligible participants have individually consented.
- [ ] Physical iPhone/Safari and Android/Chrome coverage scheduled.
- [x] Route-specific stable Travel IDs and Japanese situation prompts frozen for protocol v1.
- [ ] Test production version and rollback point recorded immediately before the first session.

The unchecked items are real external dependencies. Until they are satisfied, the correct status is
`protocol ready / learner evidence unverified`, not beta started or learning outcome passed.
