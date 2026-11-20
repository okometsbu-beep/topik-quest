# Writing S01–S06: full units, local expansion 2026-11-20

Baseline: `main` e66d6d3 (v179). Scope: the six sentence-foundation nodes S01–S06. The
cause-writing unit S07, its guided stage machine, storage keys and screens are unchanged.

## What changed

Each foundation node used to expose two groups and three items (two practice, one independent).
Each node now runs the same stage skeleton as S07, in this order:

| Stage | Group suffix | Items per node | Design |
| --- | --- | --- | --- |
| form | `-practice` | 2 | the node's form drill (existing items kept) |
| mixed | `-mixed` | 2 | the same form on unseen facts |
| variation | `-vary` | 2 | one condition changed (tense, subject or negation) |
| correction | `-repair` | 2 | a wrong draft is shown; only the wrong part is fixed |
| expansion | `-expand` | 1 | one more piece of information is added |
| independent | `-independent` | 2 | first answer without a model (existing item + one new) |
| delayed | `-delayed` | 1 | later-day item, released by the existing 24-hour rule |

Totals: 42 foundation groups (7 per node), 72 foundation items (12 per node), up from 12 groups
and 18 items. Curriculum totals are now 54 groups and 109 items; S07 keeps its 12 groups and
37 items in the same order, and `engine.guidedProgress()` still covers S07 only.

## Content rules

- Facts stay Korean and are the only source of the sentence; `fact.ko` is never translated in
  place. Japanese meaning support, vocabulary and prompts are separate fields.
- Every item keeps at least one teacher model. Models are hidden before the first submission of
  independent and delayed items.
- Automatic checks list only observable components (a word, a particle, an ending, a modifier)
  plus the polite ending. Feedback names the missing component through the node's existing hint;
  it never declares the meaning correct or the ability mastered. Forbidden checks reject an
  explicit reason link and a second sentence, which keeps the node inside its own scope.
- Repair items keep the original draft on screen (`draftKo`); the learner rewrites the sentence
  rather than starting from nothing.
- Delayed items carry `heldOut` and `newContext`, keep facts that appear in no same-day item, and
  stay closed until 24 hours have passed and the local date has changed.

## Localization

- 160 new content-catalogue sources and 17 new interface strings, each with ko/ja/en/zh. The
  content inventory is now 484 unique sources with 485 catalogue keys (the extra key is the
  retained legacy P01 feedback string).
- `tests/writing-content-locales.test.cjs` walks every node, group, item, fact, word, prompt and
  feedback message and requires all four languages. `tests/writing-localization.test.cjs` renders
  the course, map, every node unit, every group and every item in all four locales and fails on
  any leftover untranslated Korean outside allowed learning tokens.
- Translations were authored with the content. No native-speaker review of the new Japanese,
  English or Chinese strings has been performed.

## Verification

- `node --test tests/writing-*.test.cjs`: 118 passing, 0 failing. New coverage in
  `tests/writing-foundation-units.test.cjs` checks the seven-stage order per node, the item
  minimum, independent and delayed evidence, repair drafts, model answers against their own
  component checks, the unit page stage links and order, delayed gating, and that finishing a
  foundation item does not start or move the S07 guided course.
- `npm run check` on Node 22: runtime contract, syntax (279 files), original source gate,
  dialogue register and the full suite pass (852 tests) after the copy changes below were
  applied.

## Limits

- Stage order is presented on the unit page and each stage explains itself, but foundation
  units are not gated step by step; a learner can open any stage, as with the previous
  foundation sub-units. Only the delayed item is time-gated. The S07 guided machine was not
  generalized in this release.
- The regex checks accept a bounded set of forms. A natural alternative wording can return
  "needs review"; that message says so and points to the missing component instead of grading
  the sentence.
- Nobody reviewed the new items or translations pedagogically or listened to anything; the
  records still separate practice, independent, delayed and self-check evidence and never
  certify meaning or mastery.
