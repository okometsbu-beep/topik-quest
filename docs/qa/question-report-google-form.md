# Google Forms report connection — local v171

The user selected Google Forms with a private responses Sheet. The parent supplied the real public URL and six entry IDs; a read-only GET independently verified every ID and all seven issue choices on 2026-10-18. The existing local report UI is now connected. No form, Sheet, credentials or backend was created here; no deployment occurred.

The existing `harumalQuestionReportsV1` draft key, auto-save, copy/export fallback and `delivery: local-only` are preserved. The UI says that Google Forms requires an explicit submission; opening the form does not confirm receipt. It asks users not to enter names, email addresses, phone numbers or other personal information. All new notices and button text support Korean, Japanese, English and Chinese.

## Verified connection

The canonical URL is `https://docs.google.com/forms/d/e/1FAIpQLSfAZIfYDJNrts7cYkMgn2Qs8olDuDiNoSD0Qm3fVcMqLh_N_A/viewform` with `usp=pp_url`.

- ID: `entry.311034735`; issue kind: `entry.470693337`; body: `entry.386287803`.
- Version: `entry.79010159`; level: `entry.462473386`; section: `entry.678302029`.
- Required fields are ID, issue kind and body. The others are optional text fields.
- Seven exact choices: 정답 오류, 해설 오류, 오탈자, 번역 오류, 음성 오류, 그림·화면 오류, 기타.
- Response Sheet privacy and email-collection settings are Google-side settings, not enforceable by this adapter. Parent reported its separate test submission and private Sheet row verification.

The trusted default configuration is in `question-tools.js`, exposed as `window.HARUMAL_REPORT_FORM_CONFIG`. It contains only public URL/field metadata, with no secrets. Setting it to null disables opening. Unit fixtures for invalid configuration remain synthetic; production mapping has separate tests.

Values: ID is the stable source question ID; version is the current runtime string; level is `TOPIK I` or `TOPIK II`; section is `reading`, `listening`, `writing`, etc.; body is the user's text. New kind values are `correct_answer`, `explanation`, `typo`, `translation`, `audio`, `visual`, `other`, mapped to the seven Korean choices regardless of app language. Older `answer` (answer/explanation) and `content` (question/options) drafts are not migrated or guessed into narrower categories: their previous option remains selected, maps to 기타, and the prior category is prefixed to the prefilled body. The stored draft itself is unchanged.

## Behavior and checks

- Missing, unverified, malformed or duplicate field configuration keeps the open button disabled.
- Only canonical `https://docs.google.com/forms/d/.../viewform` destinations are accepted, with no credentials or alternate ports. Existing query/hash values are discarded before adding the verified prefill fields.
- URLSearchParams encodes multilingual text, ampersands, line breaks and other special characters. Only the requested report metadata and body are included; draft timestamps and unrelated learner records are excluded.
- A user click saves the current draft, then opens the prefilled form in a separate tab with no opener/referrer. The app performs no submission and cannot know whether the user submits externally.
- Encoded links over 8,000 characters are blocked with an explicit shortening/copy instruction. The draft is not truncated by link construction.
- Quick UI plus question-tools suite: 704 tests passed. A fresh temporary Chrome profile, separate from the user's normal signed-in browser, opened the actual app-generated link and verified all six values, including the selected 그림·화면 오류 radio option.
- One authorized synthetic submission was clicked in an isolated anonymous browser. Local confirmation polling was interrupted by navigation; the parent subsequently verified all six submitted values in the private response Sheet. No repeat submission was made. Existing Chrome login and account settings were untouched.
- Evidence: adjacent workspace `report-form-preparation/public-form-fields.json`, `anonymous-form-prefill.json`, `anonymous-submission-status.json`, and test/browser logs. The temporary browser was closed.
