# Bootstrap recovery notice fix (v176 base)

Base: `main` v176, `778d7d40dbfd34d7a9d2a7651bcaae78b98cf1e4`.
Scope: re-port of the boot-recovery part of PR #244 onto current `main`. No version change; publication and the release version bump remain separate approval.

## Confirmed defect and repair

The ordered loader in `site-patch.js` stopped at the first failed dependency and the shell then announced `앱을 복구했습니다. 학습 기록은 그대로 유지됩니다.` even though the app had not finished loading. On a fresh browser profile with no saved data the same notice appeared, which made a failed boot look like a successful repair.

- Retry definite script network errors at most twice (three total attempts), keeping order and already-loaded scripts intact.
- Do not retry ambiguous timeouts in the same document: an in-flight script could execute late and duplicate wrappers.
- A failed or watchdog boot now keeps a persistent, localized notice saying the app could not finish loading, with a Reload button. A later successful boot removes the notice and its viewport listeners.
- The notice is sized and positioned against `visualViewport`, so it stays inside the visible area on a narrow mobile viewport and its button remains clickable.
- No question, answer, explanation, audio, report endpoint, permission, storage-key or persistent schema changes. Reload does not clear browser storage.

Already on `main` and not re-ported: the M03-II-R-33 / P01 locale coaching guard and its regression coverage (absorbed before v176). The `releaseVersion` in `content/original-release-scope.json` stays 176.

## Verification

- `node --test tests/bootstrap-recovery.test.cjs`: 8/8 pass. Covers transient retry with ordered continuation and single execution, bounded exhaustion, no timeout retry, persistent notice with working Reload, notice removal on late success, viewport sizing, and parsing of the browser geometry expression.
- `node scripts/check-bootstrap-recovery.mjs` with Chrome for Testing 158 headless on a `390x844` mobile viewport: transient failure recovered after 2 attempts with `HARUMAL_HUB` available and seeded vocabulary preserved; persistent failure stopped at 3 attempts without loading dependents; the notice stayed visible after 4.7 s, its Reload button was inside the visible viewport and hit-testable, and clicking it booted the app and removed the notice with saved vocabulary intact. No runtime exceptions were reported.
- The browser check is not wired into `Verify MALBIT` in this branch: the connected GitHub App is not allowed to modify `.github/workflows`. Proposed step, after `Install Japanese visual-check font`:
  `- run: node scripts/check-bootstrap-recovery.mjs` (with `actions/upload-artifact` for `artifacts/bootstrap-recovery/*.png`).
- Local limits: this environment cannot run the full `npm run check` release lane (media/asset history is not in the shallow checkout), so exact-commit GitHub Actions `Verify MALBIT` remains the release gate.
- Not verified: physical iOS/Android devices, real offline-to-online transitions on a phone, and screen-reader announcement timing.
