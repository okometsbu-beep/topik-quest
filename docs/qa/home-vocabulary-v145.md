# Home and saved-word tests · v145

User-requested UI batch. Does not change original question IDs or claim learning efficacy.

- Nav: Today / Learn / Words / Review / My. Travel stays on Home; Shorts is directly visible.
- Flags are inline vectors with localized accessible button names.
- Home title uses the entire card width; mascot has a separate metadata row. All cuts retain alpha with a thin edge on dark surfaces.
- `vocab-test.js`: prompt from an existing saved meaning; ko UI uses Japanese meanings. Missing meanings and duplicate terms excluded. Up to ten words, NFC/whitespace normalization, exact saved expression scoring, no synonym claim. Draft and attempt live inside the existing portable core root. No SRS schedule mutations.
- `app-touch.js`: callout/selection/clipboard suppression plus stationary input hold blur. Physical Safari behavior still needs verification; ordinary typing and custom vocabulary holds are retained.
- Loading uses the original approved static cut animated with CSS as a temporary substitute. The previously generated MP4 and revised sheet were found but downloads returned HTTP 502. **Original frame animation integration remains open.** No artificial loading delay; honors reduced motion.

## Evidence

Local Node24 and Chromium153 with Noto CJK, 320/375/390/430px, both themes and four languages. Focused browser lane captures105 images and checks title/mascot separation, horizontal fit, nav, actual touch clicks, test input via browser, reload, result, retry, and reduced motion. Fixtures are synthetic and never represent learners.

Quick145/145; focused unit and storage tests pass. Full local check first160/161: generated Shorts inventory's topik1.js source hash was stale after Home edits. Regeneration changes only that hash; inventory check then passes. CI confirms the full161/161 automated checks. Two mobile attempts stopped after125 captures at an explicit reload with a destroyed CDP context; ready() now retries only expected navigation-context errors within its existing bounded wait. Assertions and screenshot coverage are unchanged. Final full mobile CI remains the release gate.

Before screenshots were captured from v144. Home32 candidate screenshots were reviewed in four contact sheets; selected vocabulary and exam images were opened at original mobile size. Remaining captures are automated evidence, not claimed individually reviewed. Device Safari, Android and native long-press/IME are unverified.

![Home, Chromium 390px dark](screenshots/home-v145-dark.png)
![Vocabulary exam, Chromium 320px light](screenshots/vocab-test-v145-light.png)

Production target: https://okometsbu-beep.github.io/topik-quest/ . Rollback: v144 `d4647c8da2af6caf35a39e4d91bd0b605c41f524`. Final deployment/run/commit evidence is recorded in Issue #110.
