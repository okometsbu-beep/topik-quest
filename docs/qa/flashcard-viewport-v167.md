# Flashcard viewport candidate v167

## Scope

- Lock document scrolling only while the flashcard screen or its result is active.
- Hide the global top and bottom navigation during this focused activity. Keep its own accessible Back control; exiting restores the ordinary shell and retains the session.
- Fit the deck, hint, full-text control and grading buttons inside the visual viewport, including safe-area padding and browser-toolbar height changes. Use two columns for short landscape screens.
- Keep horizontal pointer gestures distinct from vertical/diagonal movement. Allow pinch zoom without page panning. Preserve card stack, 3D flip, feedback stamps in Korean/Japanese/English/Chinese, sounds and reduced-motion support.
- Clamp unusually long card content rather than allowing touch scrolling on the swipe surface. The explicit, keyboard-accessible full-text dialog contains all original text and is the only scrollable surface; meanings remain hidden until the card is revealed. Closing returns focus to its trigger.
- No saved vocabulary, SRS scheduling or typed-quiz changes. Existing flashcard persistence stays separate.

## Verification

- Local quick lane: 492 tests passed.
- Local full release check: 553 tests passed, runtime v167, syntax validation passed.
- Unit regressions cover idempotent viewport locking, VisualViewport resize/offset, listener cleanup, restoration on alternate navigation and exit, later render-owner bypass, and back-forward-cache viewport/return position, and vertical-first gesture rejection.
- Expanded browser harness covers both faces at 390×844, 320×568, 375×667 and 667×375 in four languages and two themes; vertical/diagonal rejection; slow swipes and short fast flicks; full-text dialog touch scrolling and return; results; saved state; reduced motion; screenshot and actual browser-motion video capture.
- Independent review caught and corrected short-portrait result-grid precedence, width-cap precedence, later render-owner lock leaks, and return-scroll/bfcache restoration. Final static review passed.
- Local Chromium remains blocked by OS socket EPERM. Browser checks, screenshots and video remain pending authorized remote CI execution. No physical iOS Safari test has been performed.

## Publication status

Prepared from main `7e9ff5c844ecdbc18ab783af47140ca6d5074c1b` on `agent/flashcard-viewport-v167`. No remote upload, merge or deployment is implied by local checks. Inspect remote mobile evidence before release.
