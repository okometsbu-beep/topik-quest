# Haruman intro revision · v168

## Timing and media

- Both character videos are 540 × 540, 60 fps, 168 decoded frames and 2.800 seconds, with no audio stream. Local `ffprobe -count_frames` verifies these properties.
- The final animation revision uses 26 distinct drawings: three original drawings and 23 added drawings, including 13 added in the last revision. It aligns the initial sleep-to-wake turn from left through back-left to back. Two eight-direction body-view cycles follow, then the grounded turn to front and three-stage one-hand invitation. The renderer records 152 unique frames and 16 intentional sleep-repeat frames.
- Compression now starts during ascent at frame 54 and reaches the compact front pose by frame 60, before the apex at frame 69. Small four-point sparkles appear behind the character and disappear before contact. The two view cycles end at frames 73 and 98; authored angle phases are sequencing controls, not physical 3D measurements.
- Final renderer and encoded-WebM QA cover all 168 frames: maximum floor penetration is 1 px, character silhouettes have no detached alpha components exceeding 4 px, no character frame touches or clips the canvas edge, and minimum head/crest clearance is 30 px. Separate small sparkle components are intentional. Encoded character bounds differ from render measurements by at most 1 px.
- Natural video completion starts a 300 ms whiteout, followed by a 1000 ms title stage (including its 250 ms entrance), then a 200 ms exit. Uninterrupted playback and presentation total 4.3 seconds, excluding loading or background pauses.
- The browser timing contract checks complete playback and bounds every post-video stage. It does not impose a wall-clock playback cutoff.

## Compatibility and safety

- Transparent WebM remains preferred; unsupported or opaque-alpha decoding falls back to the warm-white H.264 MP4. Local libvpx decoding verifies a transparent corner and opaque character pixels. Muted inline playback, proportional sizing, natural completion, and no skip control are retained.
- Autoplay/load errors and stalled playback retain their recovery behavior. Reduced motion, data saver, title-image text fallback, and background pause/resume remain supported.
- Existing `haruman-intro-v1.mp4` and `.webm` remain available for older cached scripts and open sessions. New runtime sources use v2.
- Service-worker exclusion of `/assets/video/` is unchanged. There is no mandatory media-cache expansion or learner-storage migration. Runtime release remains v168.

## Public assets

- `assets/video/haruman-intro-v2.mp4`: 294280 bytes; SHA-256 `7ba8d8bd17780082d709e6060b75a229ec75bd4561b57b855b2bc7fc52cf72f1`.
- `assets/video/haruman-intro-v2.webm`: 897823 bytes; SHA-256 `bab21e4462a05b2b45b26956b63de1c63918d51b1d9f2102b96ca210668f16c3`.

## Verification status

- Final local `npm run check` passes: 576/576 tests, 170 JavaScript files parsed, v168 runtime with 69 ordered files, and valid bank hashes. Both v2 media hashes and sizes match the release assets.
- Local unit coverage includes exact 4.3-second timing, all presentation-stage interruptions, stale media failures, autoplay recovery, no skip, title fallback, cache exclusion and release asset hashes.
- Actual-browser verification of the final v2 assets and faster flow is pending. Required coverage remains four mobile widths, both themes, natural completion, title placement and delayed/slow no-skip playback.
- Physical iPhone/Android verification is not claimed.
