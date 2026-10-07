# HARUMAL writing flow and plain-language localization candidate

Date: 2026-10-07 (UTC)
Base: public v157, main `f8b565a74244b1f4f9f02e99433eb0f3f3a057ee`
Branch: `agent/harumal-writing-locales-v158`
Status: v158 release candidate. Publication authorized on 2026-10-07 at 11:29 UTC. Browser-rendered CI verification, merge, and live verification remain pending.

## Requested corrections

The supplied mobile screenshot showed Japanese hero copy and navigation beside Korean-only course menus, goal text, descriptions, and notes. The correction covers the writing area, its Learn entry, and every explanation-language choice: Korean, Japanese, English, and Simplified Chinese.

The follow-on request adds simpler wording, beginner/intermediate/advanced entry points, a guided question sequence, progressive stage unlocks, resumable work, and supporting Haruman illustrations.

## Implemented scope

- 278 UI-source entries plus 272 content-source entries, 549 unique source strings, each with four locale values
- Localized 14 map nodes, 12 exercise groups, 8 preparation checks, 37 problem instructions, six choices, feedback, records, errors, placeholders, and accessible labels
- Existing Korean task facts, written answers, practice forms, revision sentences, and model answers remain Korean. Meaning help uses the selected language; the P04 meaning probe keeps its neutral, non-answer-revealing help
- Persisted Korean evaluation messages are translated at display time, so changing languages does not rewrite evidence or learner text
- A compact language selector works within the writing screen
- The start screen presents three levels and one resume action. Only the first beginner cause-writing unit is available. Intermediate and advanced are explicitly in preparation; existing TOPIK II exam practice remains a separate option
- The first unit has 35 core questions in 11 consecutive stages. A separate two-question later-day review retains the minimum 24-hour plus new-local-date rule
- Submitting a question and choosing Continue records course progress. Completing a stage shows a short confirmation and the next stage. Opening menus alone never unlocks content
- Already-open stages stay open after errors, help use, reload, multi-tab updates, and backup merges. Course progress is not a language-mastery score
- A separate durable resume pointer keeps the question, draft, feedback phase, model/help history, and self-check state when learners browse the map, leave, or reload
- Existing records migrate additively. Old isolated drafts remain revisitable without claiming that intervening stages were completed
- Three decorative 512px RGBA WebP scenes are integrated: starting, unlocking, and returning another day. Their combined size is 99,614 bytes; no text or answers are drawn into the images

## Representative wording

| Prior wording | New Korean wording |
| --- | --- |
| 문장 속성 익히기 | 문장 만드는 법 익히기 |
| 고쳐 볼 초고 | 고쳐 쓸 문장 |
| 서술어의 형태와 호응 유지하기 | 문장 끝을 바꾸고 뜻 맞추기 |
| 목표 형태 확인 · 의미 미검토 | 배운 표현을 찾았어요 · 뜻은 아직 확인 전 |

These are plain-language editorial choices. No formal ASD-STE100 certification is claimed.

## Verification

- Full `npm run check`: 273/273 tests pass, including syntax and runtime checks
- Fast UI lane: 253/253 tests pass
- Runtime contract: one shared v158; 56 ordered runtime files; original bank hashes valid
- Syntax: all JavaScript files parse
- Focused localization/UI suite: 22 tests pass across four languages, including the guided journey, real rendered controls in the VM, exact draft/feedback resume, old feedback language switching, target-language retention, and no independent-model leaks
- Guided-state suite: 19 tests pass, including the complete 35-question path, stage confirmation, no premature unlock, repeat actions, 24-hour gating, assisted independent attempts, migration, multi-tab merge, backups, malformed storage, and clone safety
- Content-localization suite: four tests pass, covering every relevant data field and Korean source preservation
- Three additional interruption regressions cover browser Back from a stage review, leaving before the final confirmation, and the true next stage for migrated later work
- Existing writing behavior/content/review tests remain passing
- HTTP smoke passes against the local candidate: v158, four base files plus 56 runtime files
- New browser helper is integrated into the existing CI harness. It earns the first stage through real input, choice, Submit, and Continue controls; checks in-place language changes, exact saved bytes, real stage confirmation/unlock, route coverage and storage restoration; and prepares 80 focused captures across four languages, 320/390px widths, and light/dark themes. Map routes remain covered by DOM and overflow checks

## Still required before release

- Final aggregate check after the authorized version bump (run before commit)
- Actual browser execution and visual review of the new screens, staged completion, and translated long text. The prior cloud-browser localhost restriction has not been bypassed; the prepared browser tests are not claimed as executed
- Remote commit/PR checks, deployed version and asset verification if publication is authorized
- Physical iPhone/Android verification and native-language educator review remain unperformed

No learning-content bank, target sentence, grading regex, original storage root, external service, credential, or hosting provider was replaced.
