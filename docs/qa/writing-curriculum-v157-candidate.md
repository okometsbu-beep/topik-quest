# HARUMAL writing corner · v157 release candidate

Date: 2026-10-07
Base: `7e8fc7df22f11d80fe739a910fb5fdda70372ec2` (main, v156)
Publication authorized on 2026-10-07. This candidate follows the existing branch/PR/CI/GitHub Pages release path; completion evidence will be recorded after deployment.

## Implemented scope

- Learn → “한 문장부터 쓰기” opens the complete S01–S12 / D01–D02 competency map. Future drills are explicitly marked as being prepared. S07 contains only the first cause-and-result unit.
- 37 items in 12 groups: 6 prerequisite probes, 9 form drills, 6 mixed whole-sentence tasks, 6 time/subject/negation variations, 4 repairs, 1 information expansion, 3 independent tasks and 2 held-out delayed tasks.
- Korean learner tasks and optional Japanese meaning/vocabulary support. Each form lesson uses its actual predicate. Models are separate from prompts, and independent tasks do not display target conjugations before submission.
- Declared prerequisite gaps route to targeted preparation. Readiness self-reports are not mastery evidence. Probe interpretation, supported practice, revisions, first independent answers, delayed answers, form observations, and meaning self-checks remain separate.
- New-context delayed items require a canonical first independent answer, at least 24 elapsed hours and a later local calendar date. Repeated items do not create new independent/delayed evidence.
- Drafts, help/model exposure, first answers, revisions, route and self-check history persist locally under a new additive storage key. Existing roots are unchanged; the new key is included in recovery and export/import. Cross-tab operations and backup merge preserve histories and monotonic help exposure. Corrupt/newer records are quarantined without overwriting their original bytes.
- All free-text meaning remains unreviewed. Rules check limited components, allow reviewed variants, and never claim an AI/perfect/official grade. Free writing can continue without being marked wrong or semantically mastered.
- Existing 51–54 practice remains reachable from each application stage. PBT targets are consistently Q53 200–300 and Q54 600–700. Approximate character count includes spaces, excludes line breaks, and is explicitly distinguished from manuscript-grid cells. Short random-practice submission thresholds remain labeled practice thresholds.
- Existing HARUMAL theme variables, original Haruman mascot poses and approved small scenario artwork are reused. Five source PNGs were optimized to 480px WebP assets (about 182 KiB total). Main navigation, vocabulary, favorites and existing learner data were not replaced.

## Verification completed

- `npm run check`: 228/228 tests passed; runtime v157 / 54 ordered files; syntax check 106 JS files; generated question-bank hashes valid
- 38 new writing-specific checks: content 8, engine/UI/offline/recovery 16, independent safety review 14
- All 53 supplied model/variant examples passed bounded component/form checks without semantic certification
- Local HTTP smoke: 4 base + 54 runtime files; all new writing CSS/data/engine/UI/art URLs returned successfully
- Service-worker VM tests verify install assets and offline versioned lookup; these are not a real-browser offline end-to-end test
- Source and DOM-stub checks cover navigation, Back/Forward state, Close, draft restore, repeat submits, XSS, malformed storage, imports, help exposure, delayed release and preservation of legacy data
- `git diff --check` clean
- Remote main rechecked unchanged at the base SHA before packaging

The generated Shorts inventory was regenerated only because its source-hash ledger includes question-bank-engine.js, which changed for the PBT ranges. Shorts content and totals did not change.

## Required before publication

1. Browser/mobile visual and interactive verification has not yet passed at the local-candidate stage. The supported cloud browser returned `ERR_BLOCKED_BY_CLIENT` for the local preview. No alternate browser route, direct Chromium/CDP/Playwright route or security bypass was used.
2. Compare rendered screens to the three approved design boards at 320, 375, 390 and 430px, light and dark. Verify real keyboard/input space, artwork, text wrapping, focus, Back/Close, reload and real offline service-worker behavior.
3. Exercise the full existing PBT writing counter and exam route in a browser.
4. This release uses the latest GitHub main as the source of truth. Desktop-only changes are excluded at the user's direction.
5. Verify the exact merged commit, successful Pages deployment, and the public app before claiming release completion.

Physical-device behavior, educator review of learner-produced answers, and actual spaced-retention outcomes remain unverified. Full-course completion and mastery are not claimed.
