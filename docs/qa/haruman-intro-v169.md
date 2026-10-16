# Haruman intro artwork and optional sound · v169

## Scope

- Follow-up intro artwork includes closed eyes and small limb-pose variations during rotation, responsive hair motion, and a slightly diagonal spin axis. Final V8 frame/decoding QA passes all 168 frames, with no clipped or detached character parts, floor penetration at most 1 px and minimum sparkle clearance 10.78 px.
- Character videos remain 540 × 540, 60 fps, 168 frames and 2.800 seconds. Natural completion starts the unchanged 300 ms whiteout, 1000 ms title and 200 ms exit.
- New v3 media filenames prevent reuse of cached v168 media. Prior v1/v2 videos remain available; a compatibility test pins the v168 video hashes.
- Home/practice UI, learner state, rewards, question banks and existing navigation are unchanged. Shell, bootstrap and service-worker versions move together to v169.

## Optional audio behavior

- Silent video is still the reliable autoplay path. Separate character and title MP3 effects are optional and never own playback completion or presentation timers.
- The browser may reject audible autoplay. Rejection, loading failure, or late decode leaves the intro progressing silently. Existing page clicks may retry at the current media/stage offset; no sound button or new preference is added.
- Character sound follows actual playback position/rate and stops during video or audio buffering. Title sound begins on actual title-stage entry after natural video completion, not on a fixed launch timer.
- Backgrounding pauses all intro audio. Resumption uses the remaining stage position. Stale play promises cannot resume sound over another stage or Home; disposal pauses, releases sources and removes the interaction listener.
- Videos and intro SFX stay outside the mandatory service-worker cache. Reduced-motion and data-saver bypasses do not create audio players.
- There is no existing global app SFX volume/mute preference; browser/device output controls remain authoritative. First-visit audible autoplay is not guaranteed. See [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay/) and [WebKit video policy](https://webkit.org/blog/6784/new-video-policies-for-ios/).

## Release assets

- `assets/video/haruman-intro-v3.mp4`: 297089 bytes; SHA-256 `e77976bb23a2894abbe71ca30fac105f7fe522bdb89c2817598118fcc1be5d51`.
- `assets/video/haruman-intro-v3.webm`: 920340 bytes; SHA-256 `acba198d4c3f7da5776be11f85d88f63bae8c9b3d8e65e9d457626aa0a864435`.
- Local frame-count probes confirm both video-only assets are 540 × 540, 60 fps, 168 frames and 2.800 seconds.
- `assets/audio/haruman-intro-v3-character.mp3`: 91436 bytes; SHA-256 `4301c0024249f1cd878b7f9abe2571f74aeb173680a9e7ee5976f2f86f77b2c1`.
- `assets/audio/haruman-intro-v3-title.mp3`: 39980 bytes; SHA-256 `5a4e0d7a64abbf7a43cf0b5e440f3a248027fd9c20e7b8bd279419839deaf12b`.
- Both effects are the fixed B+FX candidate authorized for deployment, not a claim of subjective sound-quality acceptance. Earlier rejected candidates are excluded.
- Character audio decodes to 134400 stereo frames at 48 kHz (2.800 s), retaining the initial 0.667 s silence. Title audio decodes to 57600 stereo frames (1.200 s), including the 0.200 s exit-stage tail. MP3 container padding does not extend the animation.
- Audio and effects were generated with original synthesis/DSP for this task. No third-party samples, impulse-response recordings or external sound-library license are incorporated.

## Verification

- Focused unit coverage includes optional-audio denial/failure/pending playback, current-position retry, video/audio buffering, direct pause, source fallback, stale promises, stage interruptions, cleanup and untouched v168 compatibility assets.
- Existing natural-video and title timing gates, no-skip control, four mobile widths and both themes remain unchanged.
- Local `npm run check` passes 599 tests, 170 JavaScript syntax checks and the v169 contract for 69 ordered runtime files. All 46 focused intro tests pass, including the 1.2-second title tail, one-cue playback and Home cleanup.
- Exact-commit actual-browser audio evidence remains a pre-merge release gate. Synthetic denied/delayed audio cases are distinguished from real decoded playback.
- Physical iPhone/Android playback and speaker output are not claimed.
