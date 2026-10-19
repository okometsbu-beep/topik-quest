# Interrupted bootstrap recovery audit

Base: main v173, `5c3d179f73b279a744a45d3bab187ea6b146e524`.
Candidate: v174. Publication requires approval and exact-commit CI.

## Confirmed defect and repair

A public-browser session reported `Failed to load practice-sessions.js`. The ordered loader aborted before `learning-hub.js`, while the fallback announced recovery. Mock entry then remained on its preparation message. A normal reload restored the menu, consistent with a transient resource failure.

- Retry definite script network errors at most twice (three total attempts), keeping execution order and already-loaded scripts intact.
- Do not retry ambiguous timeouts in the same document: an in-flight script could execute late and duplicate wrappers.
- Exhausted failure or watchdog recovery now retains an honest, localized notice with a Reload button. Successful eventual boot removes it. Reload does not clear browser storage.
- No question, answer, explanation, audio, report endpoint, permissions, or persistent storage schema changes.

## Verification

- Baseline full release suite: 773 tests passed.
- Controlled Node regressions cover transient failure, persistent failure, timeout, ordered continuation, single execution, persistent notice, reload, and late success.
- New Chrome CI lane injects a connection reset for the actual dependency script (preload and service worker are excluded only in this fixture), then verifies recovery after one failure, bounded exhaustion, manual reload and preserved saved vocabulary. Existing lanes retain service-worker update coverage.
- Local Chromium cannot create its singleton socket (`Operation not permitted`); local browser checks are not claimed. Exact-commit CI remains the actual-browser gate.

## Bounded content audit

M03-II-R-33 has correct runtime repairs and four-language coaching. All 24 answer orders preserve the chosen locale across practice, game and review renderers. The legacy packed row is superseded by the verified repair payload and must not be audited as final runtime content. P01-I-L-01 and P01-II-R-28 partial coaching correctly retains generated English/Chinese feedback.

O09-II-L-41/42 share a valid 55.38-second MP3. FFmpeg finds a low-level pause at approximately 40.49–42.57 seconds; this does not establish an invalid recording or authorize an arbitrary trim. Audible/physical-device review remains open. No identical full-question/options groups with conflicting answer keys were found in the loaded bank. This bounded audit does not certify every question's semantics or establish that all possible defects are fixed.
