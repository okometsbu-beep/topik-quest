# Staged grammar course

## Scope and content honesty

The course is a searchable, freely browsable progression. Prerequisites are recommendations, not locks. Counts come from lessons actually loaded by the runtime. The original 64 grammar IDs and original drills remain available. Their old completion records migrate to **practiced**, never to demonstrated retention.

Expansion packs contain original explanations and contextual exercises. A target is counted as extended only when it has both a transfer activity and a separately authored review activity. An inventory proposal is not a completed lesson. The National Institute of Korean Language's 336-entry reference informs coverage planning; this course does not claim an audited one-to-one mapping, official TOPIK certification, or exhaustive coverage.

## Runtime ownership

- `data/beginner-grammar-v1.js`: unchanged original 64 identities and content.
- `data/grammar-course-*.js`: authored content packs, exported as `HARUMAL_GRAMMAR_PACK_*` arrays.
- `data/grammar-course.js`: combines loaded packs, preserves existing IDs, derives stages and honest counts.
- `grammar-course-engine.js`: pure validation, grading, session transitions, merge, recommendation and review scheduling.
- `grammar-course.js` / `.css`: reference, practice, retry, resume, search and optional handwriting UI.

Load reviewed packs before the adapter. Include every runtime asset in the offline shell. Content under review must not be described as available merely because its file exists.

## Evidence of learning

A lesson starts with explicit meaning, use, form, register and contrast, including worked transformations. Choice, token order and short typed activities use authored answer keys and accepted variants. Feedback explains the particular option or formation; it is not an automated semantic score.

Introduced, practiced and retained are distinct. Completion of the initial practice is not retention. Retention requires a separate authored review after at least 24 hours, with correct unaided first responses. Help, revealed references, wrong attempts and retries remain evidence. Review intervals progress through 1, 3, 7, 14 and 30 days. Legacy lessons without an authored review remain practiced until supplemented.

Handwriting is optional. Its existing route and progress remain available, but handwriting completion is not required to practice grammar. No paid service, speech-recognition endpoint or synthetic pronunciation score is involved.

## Storage contract

`harumalGrammarCourseV1` is a separate durable portable root. Existing `malbitBeginnerV1.grammarV1` is read for migration and never rewritten by the new course. Session drafts and attempts survive reload; merging unions evidence rather than overwriting another tab's progress. Malformed stored data is left intact and the UI warns instead of silently erasing it. Backup imports validate the new root and merge it through the engine.

## Quality gates

- Unit tests cover migration, grading, retry/help, delayed recall, state merging, durable drafts and UI integration.
- Content tests verify localized instructional fields, distinct transfer/review contexts, answer keys, option feedback, stable IDs and acyclic resolvable prerequisites.
- Independent semantic review is still required: structural tests cannot prove a Korean sentence is natural or that distractors have exactly one correct answer.
- `scripts/check-grammar-course.mjs` exercises real Chromium layouts in four languages, three viewport widths and both themes, saved drafts, optional handwriting, error feedback and delayed review. Browser results must be reported separately from VM tests.

## Release state

This work is a review candidate on a separate branch. Deployment remains on hold pending the user's review. The loader-recovery PR #244 is independent and must not be implicitly merged by this feature.

## Independent content review record

- Foundations: reviewed separately from the writer; corrected register for proposals, ㄹ-deletion explanation, target-answer leaks, result-state recall and misleading confirmation distractor rationale before runtime inclusion.
- Events: reviewed all 23 lesson form/use/contrast sections and all 92 answer contexts; corrected embedded-question answer leakage and an inconsistent 위해서 condition. Quotation wording checked against [NIKL's explanation of -냐고 and -느냐고](https://www.korean.go.kr/front/mcfaq/mcfaqView.do?mcfaq_seq=8650&mn_id=182): shortened -냐고 is also accepted, not simply a nonstandard replacement. Required classroom drill forms should be described as the explicitly requested full form.
- Review is bounded to the authored content, not a certification of complete coverage. New packs and later edits still require their own check.

## Construction and motivation checkpoint

The expanded sequence adds one clearly displayed-model assembly and one newly authored, constrained full-sentence construction per target. There are 208 targets and 1,188 activities: the earlier 772 exercises, 208 authored constructions and 208 model assemblies derived from existing examples. The model is explicitly visible for supported assembly; it is never counted as independent construction. Later reviews include the earlier construction with its answer hidden, alongside the separately authored recall task. That is spaced reuse, not a claim that the scenario is unseen.

The skill display separates supported assembly, form-building, independent sentence construction, contextual selection and delayed recall. Independent construction requires a correct first attempt without help. Retrying an exposed answer remains useful practice but does not manufacture independent evidence.

Motivating feedback uses existing Haruman art and the existing activity ledger. A lesson can earn one initial-practice milestone, one independent-construction milestone, and at most five delayed-recall milestones. Reward identities are per lesson and milestone, not per random session, so restarting cannot farm them. Imported/restored completions never retroactively mint rewards. No lives, penalties or streak pressure are added. Sound follows global mute and a course toggle; reduced-motion disables the short reward animation.

Short text grading checks explicitly supplied words and endings against authored accepted variants. It does not evaluate arbitrary free writing or conversational competence. The 208 constructions received independent semantic/localization review before this checkpoint.
