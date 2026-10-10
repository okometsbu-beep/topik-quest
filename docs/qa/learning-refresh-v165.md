# v165 learning feedback refresh candidate

## Scope

- Symmetric settings gear with a fixed square icon/hit area; four real SVG language flags with accessible localized names and selected state.
- Theme-token cleanup for settings and learner controls, retaining separate correct/error treatments.
- Settings sample uses existing Supertonic 3 F1/M1 `0b2c5059104c9824.mp3` recordings and displays their exact transcript, `주말에 뭐 했어요?`. No new runtime TTS model, server or credentials. A separate offline correction pass regenerated ten existing Supertonic 3 dialogue clips and aligned their exact scripts; see `docs/qa/listening-grammar-audio-v165.md`.
- Short reading keeps honest device speech and exact saved speed without a popup. Full listening-question transport and exam semantics remain. Repeated requests, navigation and settings dismissal cancel stale playback.
- Beginner inventory: 14 basic + 5 double consonants; 10 basic + 11 further vowels. Letter names and syllable sound examples are separate. Names were checked against the [National Institute of Korean Language reference](https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=5573&mn_id=62); “basic/further vowels” avoids incorrectly equating the teaching groups with phonological monophthongs/diphthongs.
- Four construction examples cover right-side, below, compound-vowel and final-consonant placement. Twelve generated picture words support selected-language glosses and self-confirmed reading, with no pronunciation grading claim.
- Existing learner roots, quiz/correct totals, handwriting, grammar and other modes remain preserved. New beginner records nest under the existing beginner root.
- Short-form explanation review and shared question-bank evidence corrections are recorded in their dedicated audit report. Do not equate structural scans with semantic review of every bank item.

## Verification

- Pre-change quick suite: 408/408 passed.
- Focused audio suite: 48/48 passed; settings/hub UI: 22/22 passed.
- Integrated audio/settings/storage focused suite: 50/50 passed; final UI/audio/beginner/storage focused pass: 69/69.
- Final local `npm run check` passed: v165 runtime contract and bank hashes, 164 JavaScript syntax checks, 536/536 tests. Remote Chrome and screenshot review remain pending; see exact commit CI.
- Corrected audio: all 373 physical MP3s decode and pass waveform checks; 363 are active and ten old URLs are retained only for compatibility. The 353 unchanged active clips retain their original SHA-256. Human listening review is not implied.
- Local Chromium launch was attempted and denied by `socket() ... Operation not permitted`; no permission bypass was attempted. Browser checks run through the repository's existing GitHub Actions Chrome harness.
- New browser coverage includes real F1/M1 MP3 completion plus corrected-recording decode/progress, exact 0.73 speed, playback cancellation, no short-read popup, four-language light/dark settings, complete Hangul inventory, name/example distinction, syllable building, picture reading, reload/idempotence and legacy progress retention. The exact reported 중단 card is covered in Japanese and Korean, including separate labelled example coaching.
- Physical iOS/Android, human listening/pronunciation judgement and semantic review of every generated bank item remain separate, unverified checks.

## Artwork

Original generated 4×3 sprite, 1448×1086. Source/provenance and cell mapping: `assets/art/beginner/README.md`.

## Release safety

Draft PR only until parent review. Cloudflare translation remains disabled; no credential or security configuration changes. No learner data reset or backfilled correctness/rewards.
