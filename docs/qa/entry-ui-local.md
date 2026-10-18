# Exam entry, intro lifecycle and question surface — local candidate

Base: `037624aae3e373da02f476b8a2920ade7dd6319d` (public v172).
Branch: `agent/unify-exam-intro`; included in the approved v173 release candidate.
Release version is 173; exact-commit CI, merge and Pages checks gate publication.

## Causes and changes

- The writing course's exam link, `tqStartMode('real')`, direct `realSetup`, saved `realSetup` / `t1setup` routes and inactive-exam fallbacks could still reach the old setup renderers. Normalize these routes before the base renderer and delegate both setup renderers to the existing shared mock menu. Full and section exams still use their original engines. Saved answers, timers, collections and learner records are not cleared.
- The intro had no document-level owner guard. The worker's `controllerchange` handler also reloaded the page without transferring intro completion. Replaying the baseline HTML/intro with an old worker reproduced two video starts across two documents. Keep one owner per document; wait for natural video/title/sound completion before the worker reload; consume a one-use, version-bound reload marker in the new document. A later ordinary refresh still plays once. The marker is session-only, with a history-state fallback preserving unrelated fields. Recovery and media cleanup remain idempotent; stale media errors cannot truncate the title stage.
- A late compact-layout CSS rule explicitly set the random question card's radius, border and padding to zero. Restore one outer surface with 20px corners, a subtle 1px theme border and 14–22px responsive padding. Keep the compact header and flat player; allow visible focus outlines instead of clipping the container.

## Verification

- Full local Node suite: 766 passed, zero failures. Runtime: v172, 97 ordered files; JS syntax checks passed.
- Existing question-experience browser checks: all result poses and real result flows; 1,204 transcripts without missing/mismatched entries; 474 visual derivatives without missing/overflowing SVGs; console errors zero.
- Existing TOPIK I/II random/coaching/mobile assertions passed without weakening their thresholds.
- `node scripts/check-entry-ui.mjs`: 48 locale/level/viewport/theme combinations (ko/ja/en/zh, I/II, 320/390/1280px, light/dark), long text, expanded reports, answered feedback, outer gutters and unclipped focus surface; seven full/section exam starts; saved legacy route reload and history checks in all four locales.
- Actual old-worker/cache update: two documents, one video start, two expected sound objects starting (character/title), consumed reload marker; later ordinary reload plays once again. Duplicate initialization, rapid clicks, pageshow/visibility events and Home routing do not restart a completed intro. Unit tests additionally cover background pause/resume, stale play promises, duplicate completion, recovery during title and storage failure.
- Before/after screenshots and JSON audits: ignored `artifacts/entry-ui/`. Baseline update evidence records two video starts / three sound starts; final evidence records one video start / two sound starts.

## Scope and limitations

No question/answer/audio/media payload changed. `docs/qa/shorts-inventory.json` only refreshes its generated `topik1.js` source hash after the entrypoint change.

Both supplied Library image downloads were attempted and retried through the supported helper. Windows metadata application failed with `AttributeError: module 'os' has no attribute 'setxattr'`; the supplied pixels were therefore not inspected locally. The described old page and zero-padding panel were independently reproduced from the public v172 app and captured before editing. No external image application was opened.

These are desktop Chrome mobile-viewport and local worker-update tests, not physical phone certification. An already-offline old installation must receive the new release to gain the fix. No external report was submitted.
