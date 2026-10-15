# Haruman intro revision · v168

## Timing and media

- Both character videos are 540 × 540, 60 fps, 168 decoded frames and 2.800 seconds, with no audio stream. Local `ffprobe -count_frames` verifies these properties.
- The final animation revision uses 22 distinct drawings: nine original drawings and 13 added drawings, including ten added in the last revision. Its eight-direction body-view sequence repeats twice, continues during descent, and ends with a three-stage one-hand invitation. Direction lines, a three-frame head-crest delay, and eased motion remain part of the animation.
- Natural video completion starts a 300 ms whiteout, followed by a 1000 ms title stage (including its 250 ms entrance), then a 200 ms exit. Uninterrupted playback and presentation total 4.3 seconds, excluding loading or background pauses.
- The browser timing contract checks complete playback and bounds every post-video stage. It does not impose a wall-clock playback cutoff.

## Compatibility and safety

- Transparent WebM remains preferred; unsupported or opaque-alpha decoding falls back to the warm-white H.264 MP4. Local libvpx decoding verifies a transparent corner and opaque character pixels. Muted inline playback, proportional sizing, natural completion, and no skip control are retained.
- Autoplay/load errors and stalled playback retain their recovery behavior. Reduced motion, data saver, title-image text fallback, and background pause/resume remain supported.
- Existing `haruman-intro-v1.mp4` and `.webm` remain available for older cached scripts and open sessions. New runtime sources use v2.
- Service-worker exclusion of `/assets/video/` is unchanged. There is no mandatory media-cache expansion or learner-storage migration. Runtime release remains v168.

## Public assets

- `assets/video/haruman-intro-v2.mp4`: 291475 bytes; SHA-256 `15fee62c987d8ae265a466c63c16f0c29b8d8f88b9f92310cebe98a0656caccd`.
- `assets/video/haruman-intro-v2.webm`: 1015980 bytes; SHA-256 `bf3ef620a5667cd5bcaed9769a7b7297a95889e6b61f445bdc729276064af25b`.

## Verification status

- Final local `npm run check` passes: 576/576 tests, 170 JavaScript files parsed, v168 runtime with 69 ordered files, and valid bank hashes. Both v2 media hashes and sizes match the release assets.
- Local unit coverage includes exact 4.3-second timing, all presentation-stage interruptions, stale media failures, autoplay recovery, no skip, title fallback, cache exclusion and release asset hashes.
- Actual-browser verification of the final v2 assets and faster flow is pending. Required coverage remains four mobile widths, both themes, natural completion, title placement and delayed/slow no-skip playback.
- Physical iPhone/Android verification is not claimed.
