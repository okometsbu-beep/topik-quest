# Legacy dialogue register repair

Scope: legacy LS 6 and 17 only, four spoken utterances. LS 6 response endings and Japanese dialogue translations match the polite register. LS 17 written summary choices, both answers, timing, IDs, and all unrelated prose remain unchanged.

The full before/after ledger is content/listening-dialogue-register-v1.json. Run node scripts/build-listening-dialogue-register.cjs to apply exact idempotent source repairs and rebuild the additive runtime catalog. Source drift fails closed. Run with --verify-audio after synthesis to verify the exact corpus digest, text digest, decoded clip status, duration, byte count and MP3 digest.

The original listening-audio.js and audio/listening/v1 assets are retained byte-for-byte, including old URLs. The new exact-script resolver delegates every other script to the existing resolver. Do not rebuild the historical v1 corpus with build-listening-audio: it is a historical baseline, while this release uses the separate dialogue-register-v1 corpus and additive catalog. A future deliberate baseline rebuild must account for this ledger and its retained old scripts.

Focused regression: node --test tests/listening-dialogue-register.test.cjs. Audio verification is a release prerequisite, not a claim of human pronunciation review.

## Audit and verification (2026-11-05)

- Starting production source: v174, commit 80159019fa328a7e03985cfcaa1e271a94bdd172. A source-ending audit covered 2,010 listening entries: 1,928 bank items, 80 legacy items and two growth items. It examined resolved segments in 1,026 multiline non-expert scripts. This was a text/catalog audit, not listening to every recording.
- Genuine conversational informal endings identified: legacy TOPIK II 6 (delivery) and 17 (side dishes). A broad initial expert-register candidate was superseded and is not included in this change. The 360 expert interview entries, lectures, quoted written examples, and polite exhortations remain unchanged.
- Exactly four stock-voice clips were generated with the previously used pinned official Supertonic model/helper and hash-pinned Python dependencies, in a separate build-only environment. No model, binary dependency, credential or private learner data is included in the public app.
- Model and helper licenses match the existing project notices. No external synthesis API or paid account was used. Exact generation inputs, seed, versions and artifact hashes are in audio/listening/dialogue-register-v1/generation-record.json.
- Four files total 172,997 bytes and 21.34 seconds. FFmpeg decode, finite samples, non-silence, peak, RMS and loudness checks passed. These checks do not prove correct pronunciation. Actual auditory review and physical-device playback remain unverified.
- Reversing the two exact before/after ledger records reconstructs the original legacy-data.js byte-for-byte. IDs, answer keys, timing, non-target questions, original catalog and old audio URLs are unchanged. LS17 written summary choices are retained.
- Browser fixture: tests/fixtures/listening-dialogue-register.html. Local cloud-browser access was unavailable: direct loopback refused and the supported preview route encountered browser URL-authority denial. No browser-control workaround was used. This fixture can be exercised by an authorized browser environment; it does not write learner progress.
- Final local release check: v175 / 102 ordered runtime files, 269 JavaScript syntax checks, original-source/audio gate, four-clip correction gate, and 810/810 automated tests passed. The v174-hardcoded migration fixture was updated to derive the current release version while retaining exact historical v173 worker bytes and cache/sentinel checks.
- Existing GitHub-hosted browser harness now includes complete playback of both corrected conversations through the shared player, asserting the four new URLs, female/male order and uninterrupted completion. Authoring/syntax are verified locally; the hosted execution result must be checked separately before publication.
