# Harumal three-tab UI v161

## Approved scope

The user requested the agreed overall UI restructure and publication on 2026-10-09 KST. Their latest structure is Learn / Review / Vocabulary, compact status on the main screen, and settings behind a small gear and a bottom sheet. Explanation language moves into settings. Existing learner records and engines are preserved.

## Shipped structure

- Learn: compact activity Lv/XP/coin status; one start/resume action; selected stage; goal; secondary quick vocabulary and more-practice links.
- Course path: Hangul / Korean foundations / TOPIK I / TOPIK II intermediate / TOPIK II advanced. These organize existing content, not a claim that all curriculum content is newly complete or that stage choice certifies proficiency.
- Stage detail: actual available lessons and exam practice. TOPIK II intermediate/advanced share the existing bank. Advanced writing completeness is explicitly disclosed.
- Practice: quick vocabulary, basic grammar, writing, speaking/repetition, 11 selected guided examples, TOPIK I/II, travel, and Wordlight.
- Review: saved-word and travel-expression links above existing exam mistakes.
- Vocabulary: existing list, edit, practice and SRS functions; generated transparent diary illustration for empty state.
- Profile (status tap): real activity rewards, stats, stage/goal and free color customization. No fake coin shop or sticker purchase. Coins remain earned-only.
- Settings: language, target, appearance immediately visible; remaining genuine settings progressively disclosed. Close, Escape, backdrop and browser Back restore the underlying screen and focus. Settings do not navigate away from the learning screen.
- Shorts: vocabulary-only runtime selection. Grammar and sentence-equivalence items remain in their existing learning banks, not the fast vocabulary pool.
- Travel scene/finish Back routes fixed. Old More help references now refer to settings.

## Data and limitations

`harumalLearningPathV1` holds selected stage/goal/profile color only. It is included in durable recovery and backup. Existing activity ledger, vocabulary, writing, travel, wrong answers and legacy roots retain their identities. Returning users without the new key inherit their existing beginner/TOPIK preference. Interrupted TOPIK I uses the original session resume owner.

No login/cloud sync, coin spending, new speech scoring, free-text semantic scoring, or full newly authored advanced course is implied. Existing app privacy and permission flows remain. Illustration: original generated `assets/harumal/ui/vocab-diary-empty-v1.webp`, 512px transparent, 40KB. Existing approved Haruman character remains.

## Verification

Local and remote CI results, screenshot review, remote SHA and Pages verification are recorded in the release report after checks complete. Native device testing is not implied by emulated viewport screenshots.
