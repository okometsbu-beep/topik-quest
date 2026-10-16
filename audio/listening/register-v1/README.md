# Pending listening-register correction pack

This directory is separate from the existing `audio/listening/v1` pack. It contains
reviewed generation inputs, sixty generated F1 MP3s, and their automated verification manifest.
There are 144 existing question IDs and 60 changed spoken strings. No question IDs,
options, answer keys, explanation payloads, old audio URLs or original bank bytes change.
The 20 contextual proposals covering 360 other questions are excluded.

## Review and activation

`content/listening-register-repairs-v1.json` is the exact correction source. Its review
record approves only a SHA-256-bound independent AI text review of the 60 replacements.
This is not native-speaker/teacher review, pronunciation assessment, or actual listening QA.

`data/listening-register-corrections-v1.js` exposes
`HARUMAL_LISTENING_REGISTER_CORRECTIONS.byId` with `originalScript`, `script`,
`reviewStatus`, `audioReady`, full-script hashes, and changed-utterance hashes. Every
`audioReady` flag and the overall `activationAllowed` flag remain false. This builder
does not activate corrections even if audio files subsequently appear.

Before later activation, integrate the exact new script catalog with the shared player,
verify every required new file and unchanged segment, and check the original-script
guard against the current question. A corrected script must never be mapped to the old
recording. Missing audio must remain a visible unavailable state rather than falling back
silently to a recording of the uncorrected script.

## Reproducible preparation

From the repository root:

1. `node scripts/build-listening-register-corrections.cjs` validates source hashes and
   rebuilds this corpus and the pending overlay. `--check` compares without writing.
2. Once the official model/helper and build dependencies have separately been approved
   and provisioned, the existing local pipeline accepts this corpus:
   `python scripts/generate-static-korean-voices.py --model-dir MODEL --helper-dir HELPER --output audio/listening/register-v1`
3. `python scripts/verify-listening-register-audio.py` decodes every expected new file,
   rejects old-audio substitution, and records hash, byte count, duration, peak and RMS.
   It fails if files are missing. `--allow-pending` writes an explicitly incomplete report
   during preparation; this is not a successful audio-generation or decoding claim.
4. Run `node --test tests/listening-register-corrections.test.cjs` and the content lane.

The existing generator uses local Supertonic 3, Korean, eight denoising steps, speed 1.0,
44.1 kHz mono MP3 at 64 kbit/s with the existing loudness normalization. It does not send
the authored scripts or learner data to a remote synthesis API.

The corpus is the preserved input snapshot from generation; the manifest records the current
output-verification state. The corpus includes exact source-ID coverage and ordered segments for each corrected
script. Newly generated segments use `audio/listening/register-v1`; unchanged turns retain
their verified `audio/listening/v1` URL. `retainedOriginalFiles` identifies old recordings
that must remain available to older clients.

Decoding verifies file integrity, duration and waveform properties. It does not establish
that the audible speech matches the script or sounds natural. Those checks remain separate.

## Current preparation status

New MP3s: 60 of 60, totaling 9,565,040 bytes. All decode, hash, duration, waveform, integrated
loudness and true-peak checks passed. Every generation-record hash matches the manifest.
No service activation or deployment has occurred. The runtime correction overlay remains off.

The exact approved model/helper artifacts and twelve hash-pinned wheels were provisioned in
a separate build-only virtual environment. No model or dependency is shipped with the static
site. `docs/qa/listening-audio-execution-v1.json` records the fixed revisions, verified input
hashes, sample and batch results. Actual listening, pronunciation and physical-device QA
remain unperformed. See `docs/qa/listening-register-repairs-v1.md` for details.
