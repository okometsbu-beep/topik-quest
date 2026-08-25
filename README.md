# MALBIT · 말빛

An independent Korean-learning game and unofficial TOPIK I & II practice app.

## Current build
- Original question bank with 2,088 items across 12 complete mock sets: TOPIK I listening 360 / reading 480, TOPIK II listening 600 / writing 48 / reading 600
- Difficulty-aware delivery in Shorts, Random Practice, full mock exams, review, and Expedition battles; regular monsters draw from lower tiers while elites and bosses draw progressively harder items
- Persistent Expedition no-repeat history and per-encounter answer shuffling, including a guaranteed change to the correct option's displayed position on a repeat encounter
- TOPIK I listening and reading practice (70 questions)
- TOPIK II reading, writing and listening practice
- Separate TOPIK I and TOPIK II Shorts decks, progress, and same-category distractors, using concise equivalents in the selected UI language
- Level-locked Random Practice: TOPIK I uses only its listening/reading pool; TOPIK II uses its listening/reading/writing pool
- Full timed mock-exam mode
- Standalone Story Mode, separate from the full mock exam, with a six-question first case, clue collection, save/resume, replay, best-score retention, and wrong-answer review integration
- Shared TOPIK I & II Wordlight Expedition loop with an animated six-sided die, roughly 55 irregular spaces per stage, four route forks, fog of war, traps, treasure, space-only shops, and animated combat feedback
- Roguelite run economy: monsters award gold and Wordlight, treasure can drop currency or gear, shops offer three weighted-rarity items, gear starts empty, and death wipes all run currency and equipment
- Difficulty- and passage-length-aware game timers with a 20% overall time increase
- One-tap selection and second-tap submission for multiple-choice questions
- Persistent wrong-answer review queue with double-tap retries, full-question translation, and detailed evidence, grammar, vocabulary, and distractor explanations
- Reviewed question-specific inline explanations in Korean / Japanese / English / Chinese, including TOPIK II writing guidance
- Context-aware long-press vocabulary capture with particle/conjugation cleanup, incomplete-fragment rejection, and review tools
- Per-word vocabulary detail editing for multilingual meanings, Korean definitions, examples and translations, word origins, notes, source metadata, and review history; safe AI adapters never expose provider keys in the static client
- Completion-only learning metrics (opening a mode does not count), daily goals, pace statistics, skill accuracy, and a recommended next action
- Adaptive TOPIK II Random Practice that introduces writing gradually, supports listening/reading-only and writing-focus mixes, and validates writing before submission
- Spaced-repetition Vocabulary with due dates, Hard/Good/Easy scheduling, pronunciation, editable save forms, and a guided first card
- Mobile route reset and a viewport-sized expedition map with automatic current-position focus, keeping dice and branch actions within reach
- Direct startup without a blocking onboarding gate, plus settings/help/privacy disclosures, full progress export/import/reset, and installable PWA metadata
- Context-reviewed translation for the TOPIK I “세 시 / 네 시” listening item, plus whole-question translation to avoid fragment mistranslation
- A lightweight browser-local profile that preserves the learner's existing language, level, and progress
- Explicit enter/select/submit/complete learning events, with external product analytics disabled until the learner opts in
- Fixed bottom dice/route controls, automatic battle-card focus, and current-space map centering for one-handed game play
- Honest account, backup, notification, support, terms, and privacy surfaces with no payment or upsell UI
- A first-Shorts vocabulary save prompt with next-day review scheduling and option-specific review reasons grounded in each passage or transcript

## Roadmap
- Separate content packs under `data/topik1` and `data/topik2`
- More authored Story Mode case packs using the reusable `story-mode.js` scene engine
- Listening audio under `audio/topik1` and `audio/topik2`
- Expandable monster, stage and UI assets

The public site is intended to run from GitHub Pages without a Vercel runtime dependency.

`MALBIT` is the product brand; `TOPIK` appears only to describe exam preparation. This is an independent, unofficial study project using original practice questions and assets, and it is not affiliated with the official exam administrator. See [IP_DESIGN_NOTES.md](IP_DESIGN_NOTES.md) for the clean-room game-design boundary and [BRAND_CLEARANCE.md](BRAND_CLEARANCE.md) for the preliminary naming review.

The repository and GitHub Pages URL retain the legacy `topik-quest` slug so existing links and local progress continue to work.

## Development

```bash
npm run check
npm run serve
```

Start with [`AGENTS.md`](AGENTS.md) for the change-routing contract, then use
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) for
the runtime map, fast/content/release lanes, cache rules, and browser regression checklist.

Release versions are synchronized across the page bootstrap and service worker with
`npm run version:bump`; do not edit those values independently.

## Autonomous development

MALBIT can run a fresh GitHub-connected development pass at 00:00, 06:00, 12:00, and 18:00
(Asia/Seoul) without WSL or an always-on PC. Each pass follows [`loop/PROMPT.md`](loop/PROMPT.md),
does one bounded task, opens at most one PR, waits for CI, deploys passing changes to GitHub Pages,
and rolls back a failed live release.

- Add work from a phone with the **MALBIT AI 작업 지시** GitHub Issue template.
- Put `[긴급]` after `[AI 지시]` when it must run first.
- Open `[AI 제어] PAUSE` to make scheduled passes no-op; close it to resume work.
- Disable the task in ChatGPT Scheduled for a complete stop.
- Read [`loop/CONFIG.md`](loop/CONFIG.md) for controls and deployment boundaries.
- Read [`docs/STATUS.md`](docs/STATUS.md) for the current result and the next single task.

Issues in this public repository are public. Never paste credentials or private information into
the control surface. GitHub Pages is the only automatic production target until signed store release
lanes and rollback procedures exist.

Migration trigger: parser fix 2026-08-09.
