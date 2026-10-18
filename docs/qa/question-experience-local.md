> Historical local-candidate evidence; v172 additionally connects the verified Google report form and applies three reviewed object redraws. See the current HANDOFF and dedicated report/redraw notes.

# Question experience — local v171 candidate

This work is uncommitted and unpublished. It builds on the existing complete-collection candidate; it does not replace its content or audio.

## Implemented

- Permanent bank IDs remain unchanged. Shared identity presentation resolves TOPIK level, area, source set and question number from the bank, independent of session position and shuffle. Items without a source set receive no fabricated set. IDs can be copied. TOPIK I/II practice, mocks, writing, Shorts and review expose this identity.
- The question footer provides an issue category, text, automatic ID/version/area, local save and copy. Drafts persist per permanent ID across reloads and modes. Storage and clipboard failures have explicit recovery UI. There is no report collection endpoint: no report is claimed received or sent.
- Submitted listening explanations show actual recording-catalog segment text, separated by speaker. Reviewed translations remain available in ko/ja/en/zh. Active mocks and unsubmitted questions remain locked. Browser audit: all 1,204 listening entries in the current runtime bank have a recording transcript; missing and segment mismatches are both zero. This verifies metadata binding, not audible correctness.
- 474 SVG display derivatives cover the original, neutral-choice and legacy question asset directories. Source SVG bytes, text, numbers and drawing geometry remain intact. Shading and font fallback are refined. Two measured overflowing lines have smaller display font sizes. Every derivative loads, with no text outside its viewBox in local Chrome. Shared table styling improves headings, row separation and numeric reading. This is a consistent display refinement, not a claim that every illustration has been individually redrawn.
- Random practice has one compact heading/count and a thin progress bar. Redundant stat cards, duplicate mode headings and source-number badges are removed from this surface; score and time are retained in results. Audio controls retain playback, stop, seek and speed selection; static technical guidance is omitted.
- TOPIK I/II random results use a native centered dialog with dimmed inert background, viewport limits, internal scrolling, focus containment, Escape, scroll lock and focus restoration. Empty writing statistics are omitted. Four existing approved Haruman poses map to perfect / at least 80% / at least 50% / lower accuracy. No new image generation or paid service was used. Displayed score is clearly the accuracy percentage; learner grading/rewards remain unchanged.

## Verification

- Final full suite: 754 passed, zero failures. Final focused checks: 23 passed. Deterministic Shorts inventory was regenerated, old bottom-sheet assertions were updated, and a private handoff identifier was removed from the previous public QA note.
- Dedicated browser QA covers 375/390/430px light/dark, save/reload, quota failure, clipboard failure with selectable fallback, submitted transcripts, all score poses, native modal centering/Escape/focus, actual TOPIK I and II answer-to-result flows, and same-area restart.
- All 36 unique table materials retain exact cell text at 320/390px (72 checks). Centered results also fit 320x568 and 375x667 with internal scrolling.
- Representative 390px listening view: first choice begins at y=375px; no horizontal overflow or visible duplicated statistics. Local browser exceptions: zero.
- Existing quick-practice browser lane passes, including ten-question completion/restart in both levels. Existing original-content lane passes in four locales/two themes at 320/390px, including source visuals, tables, translated answer cues, mock submission and reload. Remote exact-commit CI has not run.

## Remaining decisions and limits

- For server collection, choose a receiving form or a free collection endpoint. The current feature is honest local save/copy only.
- Actual listening and physical iPhone/Android testing remain pending. The known 2.06-second low-level pause is unchanged. All existing audio and original image bytes remain intact.
- Browser emulation and technical transcript matching do not certify pronunciation, speech meaning, font rendering on every device or subjective illustration quality.
- No commit, push, PR, merge, installation, paid service or deployment was performed.
