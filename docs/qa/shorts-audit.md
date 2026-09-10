# S01 · Shorts inventory and review ledger

Baseline: v99 `b578466cdacf2e4e6fb30e37bbfd7be2fbf4eea2`, 2026-09-10.
Scope: #110 S01/C01 inventory tooling only. No question, selection algorithm, UI, storage or runtime change.

## Reproduce and maintain

Run `node scripts/audit-shorts.cjs --write`, then `node scripts/audit-shorts.cjs --check`
and `node --test tests/shorts-inventory.test.cjs`. The tests also run through `npm run check`.
The generated `shorts-inventory.json` executes the current bank adapter and actual `shortsOptions`
function in an isolated Node VM with empty synthetic storage. Bank choices use their canonical order;
runtime shuffling changes order, not the option set. It never reads learner records.
Source hashes are raw-file SHA-256; row content hashes fingerprint the data and selected choices.
Curated `SHORT-*` identifiers are audit-only, stable under reordering, NOT a migration of runtime indices.
After a source change regenerate the snapshot and reopen affected content reviews; do not auto-approve them.

## Structural inventory, not approved content

| Level | Curated | Bank-adapted | Total rows | Distinct question + choice sets | Redundant rows |
|---|---:|---:|---:|---:|---:|
| I | 48 | 124 | 172 | 84 | 88 |
| II | 54 | 62 | 116 | 78 | 38 |
| Total | 102 | 186 | 288 | 162 | 126 |

There are 30 exact duplicate groups (normalized question plus sorted Korean choices), with no
conflicting answer label detected inside those groups. This does NOT prove each answer is correct or unique
in meaning. 126 redundant rows are 43.75% of the deck; this is a corpus proportion, not measured user repeat rate.
Exact-text diversity is an upper bound on independently useful contexts, not 162 approved learning objectives.

| Level | Type | Rows | Distinct text/choices |
|---|---|---:|---:|
| I | curated word / grammar / expression | 22 / 14 / 12 | 22 / 14 / 12 |
| I | bank vocabulary_blank / grammar_blank / same_meaning | 42 / 44 / 38 | 14 / 16 / 6 |
| II | curated word / idiom / grammar | 19 / 14 / 21 | 19 / 14 / 21 |
| II | bank vocabulary_blank / grammar_blank / same_meaning | 4 / 30 / 28 | 4 / 12 / 8 |

- Example: `M01-I-R-44`, `M02-I-R-43`, `M04-I-R-45`, `M05-I-R-44`, `M06-I-R-43`,
  `M08-I-R-45`, `M09-I-R-44`, `M10-I-R-43`, `M12-I-R-45` repeat the meeting-ended/home question.
- 15 rows trigger a length or literal-markdown inspection flag. Question >60 characters and any choice
  >40 characters are screening thresholds only; neither establishes unsuitability or 5–15-second timing.
- Six terms contain `**`: `P01-I-R-25/26`, `P01-II-R-05/06/11/12`. Rendering uses escaped text;
  their individual live cards have not been visually inspected. Branch CI later visually confirmed literal
  stars on `P01-II-R-06`; the other five remain code-only candidates. No six-card UI fix is claimed.
- Same-answer groups are candidates for semantic review, not proof of duplication. Synonyms, alternate valid
  answers, unrelated distractors, target difficulty and decision steps need content review.
- Each row includes instruction prompt/shared instruction family, question/choice lengths, type, objective
  metadata, exact/candidate groups, language field presence and separate review states. Korean options in
  bank questions are intentionally Korean before grading; repeated Korean across UI languages is not a
  translation failure by itself. Field presence is not complete question/choice/explanation translation approval.

## Human/AI/content evidence contract

Current comprehensive content approvals: **0/288**; suitability, answers, explanations and ko/ja/en/zh
translation review: **unreviewed 288/288 each**. This ledger does not erase prior individual fixes; it does
not import them as full Shorts approvals without matching ID/content/version/surface evidence.
Actual learner timing/next-day recall: unmeasured. Physical iPhone/Android: unverified.

Keep manual review records separately from the generated JSON, keyed by `id + contentHash`:

| Required field | Rule |
|---|---|
| Objective / decision steps / repeated instruction | One goal and one judgment; record reasoning, not only length |
| Suitability / answer / explanation / each language | unreviewed → in-review → pass, needs-fix or blocked; include evidence |
| Explanation | Decisive phrase → selected and other distractor traps → reusable procedure |
| Translation | Passage, prompt, all options, explanation and hints; preserve negation/time/conditions; no answer leakage |
| Review provenance | Separate structural automation, AI content review, human language review and consenting learner evidence |
| Mobile | Width/theme/state and evidence; never infer unseen cards from one screenshot |
| Overall | No pass unless all required content/language checks pass for this exact content hash |

## Live exploration and gaps

Remote Chrome, 1363×936, light theme, 2026-09-10: Home → Shorts → Japanese → meeting/home question →
deliberately choose “회의 전에 집에 들렀습니다.” twice → wrong feedback → Next → curated “빌리다”.
Viewed unanswered and graded screenshots. The selected answer is marked wrong and the after-meeting answer
correct; next navigation works. These are synthetic QA interactions, not learner success/timing evidence.

Observed review candidates (no production fixes in S01):
- Graded Japanese feedback uses a generic subject/tense/negation checklist rather than explicitly contrasting
  the selected “전에” with “후에”. This nine-ID duplicate family is a bounded S02/C03 pilot candidate.
- A “교환하다” first-study save proposal appears under that unrelated meeting question. Record as a
  context-mismatch candidate; determine its owner and intended behavior before changing saved vocabulary.
- The full feedback is expanded before the Next button; text ordering plus repeated instructions should be
  checked at four mobile widths in S02, not shortened blindly. No full Japanese translation control observed
  on this card; completeness remains unreviewed, distinct from the existing Random Practice translation fix.
- Observed console errors were Chrome-extension metadata messages, not attributed to the app.

This exploration is desktop, NOT mobile emulation. Branch CI can provide four-width/two-theme regression
screenshots; its sampled fixtures cannot certify all 288 cards. No offline/audio/physical-device claims.

Branch Verify [34432220146](https://github.com/okometsbu-beep/topik-quest/actions/runs/34432220146)
passed full 89/89 and the existing mobile suite (73 screenshots, app errors 0). On its Linux Chrome
390px captures, directly reviewed `00fa-shorts-light.png`, `00f-shorts-visual-contract-unanswered.png`,
`00a-shorts-idiom-coaching.png`, `00b-shorts-type-coaching.png` (artifact `10134939643`). The suite checks
320/375/390/430px containment; this review is not physical-device or every-width screenshot inspection.
Unanswered light/dark cards are readable. Graded cards extend below the first viewport, and `P01-II-R-06`
shows literal `**` rather than the requested underline. These are existing S02 audit findings, not fixed
by this tooling-only change. One curated screenshot says example translation is loading; recovery was not
visually inspected, so no automatic-translation success is inferred. Post-merge results belong in #110.

## Next small task and quantity decision

S02 pilot: review the meeting/home exact-duplicate family and its selected-distractor explanation/short
feedback route; keep original bank IDs/content and learner history intact. Then continue other flagged
families and S03 stable-ID/semantic-group repeat prevention. P0/clear wrong answers still take priority.

S04 planning floor of 140 different suitable questions per level is not met by current distinct-text counts:
even if every existing distinct set passed, at least **56 I + 62 II** additional distinct sets would be needed.
Actual deficit is unknown until suitability/translation review; 140 is neither a cap nor the requested final
expansion target. Do not count duplicate wording or option shuffles as new questions.
Sep 13: inventory plus bounded review pilot/throughput; Sep 27: S02/S03; Oct 11: reviewed expansion;
Oct 18: S05 exposure audit. 5–15 seconds is a design target, never a forced timer or a measured result.
The Nov 17 conditional release goal must move if review capacity or external approvals are insufficient.
