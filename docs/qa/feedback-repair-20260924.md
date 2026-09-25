# User screenshot feedback repair — 2026-09-24

Baseline: main 5ae66838620f6ce822ae5a42330332d31dbe0578, product v131.

The user's two screenshots show graded Travel and TOPIK II Random Practice.
A single visible Travel choice after submission does not establish a single-choice question.
The route data has four options for the transit-card question.

## Confirmed causes and candidate fixes

- Travel success/recovery feedback stretches a decorative image behind text; later rules
  reduce tutor text to 8.5px. Shared feedback now uses semantic theme surfaces and 14px text.
- Random Practice returns the Korean source as a string and labels all strings reviewed.
  Korean now returns `original`, and the redundant translation panel is hidden.
- Reviewed translation input previously bypassed source-echo validation. It now uses the
  same validation as automatic translations. Missing translations remain unavailable.
- Machine coaching mentions both card tapping and destination selection regardless of
  the current task. The two machine missions now have separate contextual solving tips.
- Random Practice translation headings now inherit a theme-aware readable ink color.
- Transit-card feedback now distinguishes ticket buying, airport return and taxi waiting.
- The screenshot grammar sentence appears under four IDs. All four use a shared,
  four-language coach explaining future possibility + advance preparation, with distinct
  distractor feedback that follows shuffled choices. Original bank files are untouched.

## Still open — do not report all content repaired

- Bank-wide generic answer reasoning and distractor explanations need item-specific review.
- Travel generic distractor section, repeated rewards and result information need further work.
- Original banks, answer IDs, storage and progress are unchanged.
- Mobile four-width/two-theme before/after review, actual devices, CI and deployment pending.

Priority: finish these feedback defects before adding further Shorts inventory.

## Checkpoint and actual validation

- Local checkpoint `1865a91`; Linux Node v24.19.0: quick 116/116 and content 37/37.
  Tests include original-bank/storage contracts and shuffled feedback for the four IDs.
- Candidate browser navigation to `http://127.0.0.1:4173` failed with
  `net::ERR_BLOCKED_BY_CLIENT`. No mobile screenshots or visual pass claimed.
- A later HTTP smoke attempt failed with ECONNREFUSED; the earlier dev-server process
  was no longer reachable. This is not evidence of a production outage.
- Static coverage count: 2,144 bank entries, 70 with a coach, 2,074 without that layer;
  56 grammar_blank entries lack a coach. This counts coverage, not proven answer errors.
- No PR, merge, version bump or deployment. Live remains v131 product
  `fadd25392e75f055c6deebf026ec77b8d597c96b` at
  https://okometsbu-beep.github.io/topik-quest/ (not reverified this checkpoint).
- Candidate rollback: main `5ae66838620f6ce822ae5a42330332d31dbe0578`.
  Product rollback remains v130 `bfc3f89121f3477a964f474ec378391b3c37dbf8`.
- Next: inspect candidate at 320/375/390/430px in both themes in an authorized
  accessible browser environment; then continue item-specific audit. Actual iPhone,
  Android, native-language review and learner outcome testing remain unverified.

## Follow-up: formatted source echoes — 2026-09-24

- Latest remote main remains `5ae66838620f6ce822ae5a42330332d31dbe0578`;
  no open PR or PAUSE issue was returned. Continue the existing candidate, not a duplicate.
- Reproduced: `교통카드를 찍으세요!` was accepted as reviewed English/Chinese when
  source ended in a period; decomposed NFD Korean also bypassed Japanese detection.
- Added two behavior tests, observed both fail, then normalized comparison text to NFC
  and ignored punctuation/symbols/separators/control formatting for source-echo matching.
  Returned display strings and original Korean remain unchanged.
- Four echo variants × three targets × reviewed/automatic paths are checked. Valid
  translations, fallback to automatic after an invalid reviewed value, offline failure,
  Korean quotation in English, and zero translation calls for Korean are also checked.
- Candidate checkpoint `694a503`: quick 118/118, runtime v131/45 files/bank hashes pass.
  Server and smoke now run in one process lifetime: local HTTP 3 base + 45 runtime pass.
  This resolves the local server-lifetime smoke failure, not the cloud browser boundary.
- No new browser attempt, mobile pass, full release check, CI, PR or deploy this follow-up.
  Prior browser ERR_BLOCKED_BY_CLIENT remains unresolved; do not equate HTTP with visual QA.
- Existing production/rollback above unchanged. This is a syntactic echo guard, not
  proof that arbitrary translated text is complete or educationally correct.

## Mobile gate retry — 2026-09-25

- Latest remote main is still `5ae66838620f6ce822ae5a42330332d31dbe0578`;
  open issues contain only #76 and no open PR or `[AI 제어] PAUSE`.
- Confirmed the repository visual checker covers the Travel `q-ticket` route and
  Random Practice unanswered/graded/translation/coaching states at
  320/375/390/430px in light and dark themes.
- Actual command: `node scripts/check-travel-mobile.mjs`.
  It failed before starting the server or browser flow because no Chrome/Chromium
  executable exists in the current runtime. Searches of standard executable paths
  and browser caches found no usable binary.
- This is no new regression evidence and no pass. Cloud Browser previously rejected
  the local candidate URL; the local checker cannot currently substitute for it.
- No source change, full release check, version bump, PR, merge, CI or deployment.
  Candidate stays at `9912962`; production and rollback references above are unchanged.
- Safe next work remains item-specific read-only feedback auditing until an authorized
  environment with Chrome can run the required visual gate. Do not add Shorts to mask it.
