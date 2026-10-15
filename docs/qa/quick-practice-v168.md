# Quick practice navigation · v168

## Approved scope

- Four equal Home cards, in order: 단계별 학습, 숏츠 문제, 랜덤 문제, 모의고사.
- Home uses a light sage surface. Random and mock area choices share a distinct, light blue-gray surface; dark theme has corresponding readable colors.
- Entire area cards are buttons with chevrons; there are no nested Start controls.
- TOPIK I offers Listening and Reading. TOPIK II also offers Writing (exam formats 51–54).
- The existing learning path, continuation, travel, speaking, growth, game, review, vocabulary, rewards and saved progress remain reachable. Course continuation is inside Step-by-step learning.

## Session behavior

- Random sessions contain ten questions from the selected level and area. The existing grading, review and reward owners remain authoritative.
- TOPIK II uses a preselected ID queue. TOPIK I uses its existing adaptive question selection restricted to the selected area. Restart, Next and reload preserve area scope.
- Explicit listening selection overrides the mixed-practice listening exclusion for this session, without modifying the preference.
- Mock area selection opens a readiness screen. Only the confirmed Start creates the exam deadline. Full mocks remain available as a secondary choice.
- Selecting the TOPIK level for practice does not change the learning course.

## Verification

- Focused unit tests cover equal menu order, eligibility, course preference isolation, readiness, ten-question completion, exact area filtering, restart/back, mock metadata, legacy mixed flows and repeated submission protection.
- Existing runtime, storage preservation, rewards, vocabulary flashcard, learning and content suites remain enabled.
- The Chrome harness adds actual rendered screenshot coverage for four locales, light/dark themes, and widths 320, 390 and 1280. It checks all five random areas and seven mock configurations, full-card click targets, reload, navigation, readiness/timers and unchanged learner evidence.
- CI runs the focused quick-practice lane first, then the existing flashcard and full mobile regression lanes. Screenshots are uploaded as quick-practice and existing mobile artifacts.
- Prior-production Home comparison screenshots are from the successful v167 main workflow 38528439415 (commit dd98abffc93c050fdb030afc1307304279069e59).
- Physical iPhone/Android hardware is not part of this verification. Remote Chrome mobile emulation is reported separately from physical-device testing.

## Release and rollback

All shell/runtime/cache versions are 168. Publish through a reviewed branch PR and verify its exact commit CI before merging. Verify Pages completion and live asset hashes after deployment. Rollback is the v168 PR revert, returning to v167 dd98abffc93c050fdb030afc1307304279069e59.
