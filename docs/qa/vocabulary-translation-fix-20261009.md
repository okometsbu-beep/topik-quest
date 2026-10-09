# Vocabulary translation correction (local candidate)

## Confirmed faults
- The v160 reveal and editor paths submitted isolated terms and grammar notation to MyMemory, bypassing authored learning meanings.
- `translateCached` accepted service-error/source-echo output, cached it permanently, and did not check the requested output language. The new vocabulary path does not alter the shared translation behavior used by unrelated modes.
- Actual user examples included grammar fragments interpreted as ordinary words or sounds: 기만 하면 → chess sentence, 채로 → チェロ, 기에 → GYE. Grammar support is explanation-first, not a promise that any fragment has one literal translation.
- Long-press suffix stripping damaged lexical words (고양이 → 고양, 차이 → 차). It also stripped a user's explicitly corrected popup term a second time.
- A personal note could replace a selected-language meaning in the active saved-card renderer.

## Changes
- Purpose-named vocabulary translation owner: authored grammar/learning meanings before machine suggestions; matching source examples disambiguate learning senses. A bare authored entry is labelled as a meaning in its displayed study example, not a comprehensive dictionary definition.
- Machine output validates transport/status/quota/source echo/error messages/output script. New source-and-language-keyed cache ignores old cache namespace without clearing learner records.
- Saved unknown/manual meanings are not globally replaced. A Recheck meaning action prepares a replacement in the editor; Save is explicit. Positively identified cached service-error output is retained in `translationRecovery` before retry.
- Provenance separates grammar explanation, authored study example, machine suggestion, user-entered and unknown legacy meaning. Notes render separately.
- Long-press preserves verified lexical forms, only strips a suffix to a known stem, respects explicit popup edits, and retains original token/source context for newly saved entries.
- Native touch range selection is restored in selectable learning text, including inline markup. The preview preserves the exact selection and shows a local, bounded source sentence (maximum 700 characters) plus Word/Grammar/Phrase type. It does not capture an unrelated full page. Successful save clears the range snapshot.
- Seven screenshot grammar patterns have authored ja/en/zh explanations and Korean examples; ambiguous fragments retain their alternative analyses.
- Async editor responses cannot apply to another entry, term, language or closed editor.
- Corrected Japanese 닫다 from transitive+intransitive mixture to 閉める；閉店する. Source: https://krdict.korean.go.kr/jpn/dicSearch/SearchView?ParaWordNo=57289 . Regenerated structural Shorts inventory.

## Boundaries
- No model/provider/backend/payment integration, no credentials, no user-browser storage inspection, no blanket cache/storage wipe.
- MyMemory fallback is a labelled suggestion, not a guarantee of semantic correctness. Unsupported grammar notation asks for context rather than guessing a word translation.
- Existing saved semantic mistakes cannot reliably be distinguished from deliberate user edits; explicit recheck/save is required.
- Local code tests do not replace rendered mobile browser QA. Remote CI/browser checks and deployment remain pending publication approval.

## Verification
- `npm run check`: runtime v161 / 66 ordered assets, 135 JavaScript syntax checks, 382/382 tests pass.
- Focused translation/editor regressions: 20/20 pass after final button styling.
- Added coverage for all seven screenshot grammar patterns, target-language mismatch, source echo/service quota rejection, source-specific caching, manual meaning preservation, recoverable old failure output, lexical suffixes, exact selected range across inline markup, bounded sentence context, and legacy fallback safety.
- A screenshot cannot prove the user's active version. Dependency-load failure explicitly falls back to older UI; the legacy reveal now refuses unchecked new translation if the vocabulary helper is unavailable. The service worker's version-cache cleanup does not remove localStorage learner roots.
- Actual iOS selection handles and mobile rendering still require browser/device QA; no release or live success is claimed here.
