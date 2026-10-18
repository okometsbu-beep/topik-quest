# Three reviewed question redraws — local v171

Applied O12-II-R-05 (table bag hook), O12-II-R-06 (retractable belt key reel), and O12-II-R-07 (adjustable display torso) through the existing `assets/question-polish/` catalog. Composition, material shading and structural details are improved. Functional direction arrows and all original text are retained. The original SVG files are untouched, as are question data, answer indexes and choices.

Reviewed source SVGs live in `content/question-visual-redraws/`, with source SHA-256 guards in `manifest.json`. `scripts/build-question-visual-polish.py` reproducibly generates all 474 derivatives: 471 preserve geometry and three are explicitly reviewed redraws. Its audit no longer falsely describes these three as preserving geometry. `--check` verifies exact generated output and original text equality.

Validation: quick UI suite plus question-tools coverage passed 697/697; runtime contract v171 with 97 ordered files; syntax check 248 files; original release gate 2088 reviewed/four-language items and 960 source-bound listening recordings. Browser evidence and preservation hashes are retained in the adjacent workspace `visual-redraw-review/` folder. No release-version bump or deployment was performed because this remains the existing local v171 candidate.

Recovery: original assets remain under `assets/original/`; exact pre-application derivative, catalog, generator, audit and handoff copies are in `visual-redraw-review/pre-application-backup/` outside the repository.

Library screenshot saving remains blocked at tool discovery (`Library prepare_uploads is not available`); no create/prepare, byte transfer or finalize request began. The current official helper was refreshed and retried once, with the same result. No direct-save fallback was used. No report backend or account configuration was created.
