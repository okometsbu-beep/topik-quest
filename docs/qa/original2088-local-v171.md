# Complete original collection: local v171 candidate

Baseline: main dd8df05bec1d7e97e03cbd251a88693cfc9f35c3 (v170). This candidate is local, uncommitted, and unpublished.

## Integrated

- Current importer accepts all 2,088 independently approved items: TOPIK I 840 and TOPIK II 1,248. Four-language support builds with zero unmatched entries. The full source gate finds all 12 sets ready at each level in ko/ja/en/zh and 960 source-matched listening mappings.
- V10 adds 230 questions, 167 scripts and 428 MP3. Existing audio packs, intro and v170 legacy coaching repairs remain. The current adapter and ordered loader add V10 without replacing their existing behavior.
- Release scope now uses complete mode with strict full-count validation, source hashes and exact locale readiness. Runtime/cache is v171, with 97 ordered files after the question-experience additions.
- 336 approved SVG sources and 24 original tables are present. Neutral choice regeneration checks 60 option-picture questions, 240 source images and 104 exact-label derivatives.
- Existing 1,668 question objects have no non-QA changes. All 2,452 existing image/audio/video files and all 428 new MP3 retain exact bytes. Windows worktree newline conversion was reversed only where CRLF was the sole difference from HEAD; audio metadata required no rebind afterward.

## Verification and limits

- Bundle ZIP byte sizes, SHA-256, CRC, safe paths and independent extraction pass. The bundled verifier passes all 777 payload files (778 archive entries including the file manifest).
- V10 corpus/catalog --check, full original source gate, runtime, syntax and HTTP smoke pass.
- Public attribution correction and a recursive identity/path regression resolve the previous public metadata failure. Final full suite: 746 tests passed, zero failures.
- Regression tests cover both engines, every choice permutation, persisted answers, review/retry, stale-source rejection, legacy behavior and storage preservation. All 960 listening questions are checked in all four locales for pre-submission/active-mock suppression and post-submission reviewed transcript/evidence rendering.
- Actual local Chrome opens new set 12 in TOPIK I and TOPIK II. V10 samples reach playback completion. Default 0.85 and selectable/persisted 0.75 work. New TOPIK II SVG options decode, explanations remain locked during the exam, and the sampled 390px view has no horizontal overflow. Captured console errors: zero. The subsequent full local functional browser lanes also pass; see the local browser verification section below.
- No local ffmpeg/ffprobe was available. MP3 bytes and existing technical manifest provenance were validated; full decoding/loudness was not remeasured locally.

## Correction and remaining review requirements

1. Resolved: the supplied attribution-only patch corrects two core attribution fields, 150 support author fields and dependent hashes. The old full-source hash is invalid. Reimported source/support and V10 chain validate. Recursive local scanning also found 53 QA-only reviewer fields in old V2/V6 snapshots; these were projected to a generic review marker and all dependent chains regenerated. Synthesis texts, casting, ordered mappings and MP3 remain unchanged. V1 frozen bytes remain intact. The strengthened privacy regression stays active.
2. Actual listening review remains false. O09-II-L-41/42 share audio/listening/original-v10/F1/800786a0a81d1d16.mp3 with the supplied 2.06-second low-level pause at 40.50–42.56 seconds in a 55.3349-second clip. Its bytes remain unchanged. Pronunciation, spoken meaning, speaker distinction and physical-device playback are unverified.
3. Remote exact-commit browser CI (including MP4 encoding) and eventual served-version verification remain pending. All local functional browser lanes have completed. No push, PR, commit, merge or deployment was performed for this candidate.

## Local browser verification completed 2026-10-16

- Original content, quick practice, full mobile, home/vocabulary, v170 intro baseline and Korean street tiles pass. Full mobile covers playback controls, four locales, light/dark themes, responsive layouts, writing, growth lessons, navigation and storage preservation. Synthetic translation fallback is checked; live provider availability is not certified.
- Flashcards pass in all four locales/two themes at 390x844, 320x568, 375x667 and 667x375, including both faces, drag rejection, swipes/flicks, dialog scrolling, reload/retry, mute, reduced motion and navigation restoration. The default run failed only because ffmpeg is absent. An explicit HARUMAL_QA_FRAMES_ONLY=1 rerun retained 202 actual browser frames and passed all remaining assertions; no MP4 encoding success is claimed. Default CI still requires encoding.
- Test harnesses now resolve disposable Chrome profiles through os.tmpdir() on Windows. Product content and recordings were not changed for this QA. Local environment: Windows, Node 24.19.0, Chrome 155.0.8059.80. Remote CI uses Ubuntu, Node 22, Noto CJK fonts and ffmpeg, so local success is not remote exact-commit CI certification.
- Actual listening remains pending. A self-contained HTML containing five representative samples, scripts and seven unchanged MP3 files is available through the separate private handoff. The known pause remains unchanged.
