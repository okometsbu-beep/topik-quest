# MALBIT compact handoff

This is the short continuity record for future work. Use it with `AGENTS.md`; do not reconstruct
these facts from conversation history or the large TOPIK source bundle.

## Current user priority · learning renewal v132

The user explicitly authorized a major product/marketing/UI update. v132 is deployed through
PR #174 at c4045c8358acbfb505c9df01d70dbaa3c5e026e3. Historical checkpoint `2073709`
restores the prior environment's lost v132 work: goal-led Home, correct TOPIK session resume,
eight localized Travel coaches, and answer-hidden phrase practice with persisted drafts and
24-hour unaided / 10-minute assisted recall. Existing modes and durable roots remain intact.
The prior screenshot translation/readability repairs are included. Full-bank pedagogy is not complete.
Linux Node 24.19.0: quick 122/122, content 37/37, full 138/138, v132 runtime45, original bank hashes pass.
Branch CI 36073840735 at 69e2ad4 passes Ubuntu/Node 22/Chrome mobile emulation; artifact
10839034278 contains 174 screens. Home and recall at all four widths/two themes, Travel feedback
and Random Practice were inspected. Final review corrected a false morphological rejection of
뿐더러 using the National Institute of Korean Language dictionary; the same reported item now
has a focused ko/ja browser gate. Final PR CI 36075457096 passes (177 screens; authored Japanese
grammar meaning/glosses inspected). Main CI 36075858880 and Pages 36075858066 succeed.
Public Chrome 1363×936 verifies v132/48 script versions, ko/ja Home and beginner CTA→Hangul.
It also exposes pre-existing wide-screen Travel clipping: full-viewport map inside 560px parents.
Production v133 removes only RPG parent max-width and adds wide-screen hit-testing.
Local 138/138/runtime and same-session HTTP base3/runtime45 pass. CI 36076470585
lost its Chrome target; not a pass. Run 36076910462 passes the unchanged product code; artifact
10839744095 has 179 screens. Both wide themes and mobile Travel visuals inspected; four-width
mobile/preservation gates pass. PR #175 final CI 36077342411 passed before squash
cbbd1b5615f374a70708e4dde07000d942a2e8cc; main CI 36077673880 and Pages 36077673424 succeed.
Live v133: 48 scripts, all six HUD/direction hit-tests, clicking and arrow-key movement, NPC
conversation→correct answer→hidden-model writing→draft reload→comparison→24h recall notice pass.
Production v134 fixes only the RPG global keyboard router: focused native controls keep Enter/Space,
while map Enter/E still performs interaction. PR #177 CI 36089328672 passes 138/138 plus Chrome;
artifact 10845017916 contains 179 screens. Squash c15309cda11259e6f190f6cd5be9f5a6e0ae60c5,
main CI 36089816552 and Pages 36089816437 succeed. Public Chrome verifies v134/48 scripts,
language Enter/Space and map-back Enter; four core live assets match main by SHA-256. The first PR CI 36089091135 failed because its CDP touch
emulation did not synthesize native button clicks; it is not a pass. The final gate directly asserts
that focused controls are not prevented or rerouted and that map shortcuts remain consumed.
Production v135 re-clamps the camera from the mounted full-bleed viewport immediately and after layout.
PR #179 CI 36117974374 passes 138/138 plus Chrome; artifact 10856190822 has 181 screens and the
1363×936 initial light/resumed dark frames have no uncovered edge. Squash
e57a7769861c7fe34b839335f356f6e62deaee47; main CI 36118461882 and Pages 36118461431 pass.
Live v135 HTTP passes base3/runtime45 and four core assets match main by SHA-256. Runs 36116613167
and 36117009893 correctly failed while the gap remained; run 36117342467 passed camera coverage but
lost its Chrome target twice later and is not a pass.
The synthetic QA flow is not a real learner result. Local and public HTTP checks are separate from browser interaction.
Whole-renewal rollback: v131 fadd25392e75f055c6deebf026ec77b8d597c96b. Narrow v135 rollback: v134.
See `docs/qa/learning-renewal-v132.md` and STATUS.
Native review, physical devices, and actual learner success/retention remain unverified.
`docs/qa/beginner-validation-protocol.md` now fixes the consent-safe execution contract: 12 adults,
10-minute first success, three-expression 10-minute/D1/D7 no-hint recall, next/review discovery,
physical iPhone/Android coverage, interventions, missing data, aggregate reporting, and a public-repo
raw-data ban. This is preparation only; no tester was contacted and no learner data was collected.
Starting the test requires explicit user approval of invitation/consent, private storage/access/deletion,
the D1/D7 reminder channel, and any recording (default none). Until then, continue only other safe #110
quality work and never substitute more question counts or synthetic users for learner evidence.

## Immediate user priority · #129

- Completed in v110 through PR #130. Product commit is `a0f852517ae72b3371ca9ab6c6fc3936c09ddda3`;
  v109 `b84e596129956e0e70328910c22917b9a8bfbb5c` is the rollback baseline.
- `writing-answers.js` defines schema 2 `{answers:{giyeok,nieun}}`, preserving `legacyText`.
  Labelled ㄱ/ㄴ strings split; unlabelled text stays in the first field with a migration notice.
- Owning core renders/binds two fields for 51/52, estimates each blank separately, and snapshots
  answers/model comparisons under existing `topikQuestV8.writingHistory` for Review.
- Product wrappers use per-field readiness; long-form 53/54 stays string-based.
- Recovery now counts `writingHistory` as durable core progress. A writing-only snapshot previously
  had zero weight and could be lost after an empty-core reset. Failing-then-passing coverage also
  verifies that a current writing history is not replaced by an older snapshot.
- Sep 12 follow-up: Node v24.19.0 focused 10/10, quick 95/95, full 110/110; local and live HTTP
  smoke pass base 3/runtime 45 at v110.
- Branch CI `34701329686` passed the repository's Linux Chrome gate at 320/375/390/430px in both themes:
  two keyed fields, touch input, independent save, reload restore, bounded score, split Review, and legacy notice.
  Artifact `10300595038` screenshots were inspected. This is emulation, not iPhone/Android hardware or real IME proof.
- PR and main CI `34702111845` passed. Its first main attempt lost the Chrome target; the unchanged rerun
  passed all 110 checks. Live public UI shows two labelled fields and preserves different ㄱ/ㄴ values after
  next/back navigation. Physical iPhone/Android and real IME remain unverified.

## Prior release history · 2026-09-23 (next-task notes below are historical)

- Source of truth: [release blueprint #110](https://github.com/okometsbu-beep/topik-quest/issues/110).
  It supersedes #76 map expansion until core learning quality gates pass. A01–A12 remain audit findings,
  not resolved items; existing feature/visual checks do not certify translation or teaching accuracy.
- Production v131 appends four bounded TOPIK I housework-action cards (`청소하다`, `빨래하다`,
  `설거지하다`, `요리하다`) without changing earlier IDs, the original bank, or Shorts storage.
  Production inventory is 404 rows / 278 exact families (I 140, II 138), with 126 redundant rows,
  30 duplicate groups, 15 structural candidates, 0 answer conflicts, and 0 approvals. Local focused
  vocabulary+inventory checks pass 34/34, content checks pass 37/37, and the full release check passes
  131/131 with the v131 45-file runtime contract. PR #172 evidence CI `35745761618` passes Linux
  Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching, next-first
  flow, and reload restoration. Artifact `10702339056` screens `00dm`/`00dn` were inspected. Final PR
  CI `35746609645` passed. PR #172 was squash merged as
  `fadd25392e75f055c6deebf026ec77b8d597c96b`; main CI `35747146849` and Pages
  `35747145718` succeeded. Live HTTP smoke reports v131 with 3 base + 45 runtime files, the four
  core assets match main, and all four new IDs are present. Public cloud Chrome verified Japanese
  wrong-answer feedback, the next CTA, and reload restoration. Physical devices, native review,
  learner timing, D1/D7 recall, audio, and full offline recovery remain unverified. Ledger:
  `docs/qa/shorts-review-s04-topik1-housework-actions.md`; product rollback is v130
  `bfc3f89121f3477a964f474ec378391b3c37dbf8`. With no new P0 or clear answer error, the next
  bounded task is a four-card TOPIK II shortage review because it has fewer reviewed exact sets
  (I 140, II 138).
- Production v130 appends four bounded TOPIK II change-adverb cards (`점차`, `일시적으로`,
  `지속적으로`, `급격히`) without changing earlier IDs, the original bank, or Shorts storage.
  Production inventory is 400 rows / 274 exact families (I 136, II 138), with 126 redundant rows,
  30 duplicate groups, 15 structural candidates, 0 answer conflicts, and 0 approvals. Local focused
  vocabulary+inventory checks pass 33/33, content checks pass 36/36, and the full release check passes
  130/130 with the v130 45-file runtime contract. PR #170 evidence CI `35682292167` passes Linux Chrome
  320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching, next-first flow,
  and reload restoration. Artifact `10675775494` screens `00dk`/`00dl` were inspected. Final PR CI
  `35683030397` passed. PR #170 was squash merged as `bfc3f89121f3477a964f474ec378391b3c37dbf8`;
  main CI `35683433183` and Pages `35683432875` succeeded. Live HTTP returns 200, and
  `index.html`, `site-patch.js`, `sw.js`, and `data/shorts-levels.js` hashes match main with all four
  new IDs present. Physical devices, native review, learner timing, D1/D7 recall, audio, and full
  offline recovery remain unverified. Ledger: `docs/qa/shorts-review-s04-topik2-change-adverbs.md`;
  product rollback is v129
  `8a33bd6025243187d3f569e3ddd85f432ed4cc94`.
- Production v124 separates an explicit comparison baseline (`-에 비해(서)`), a degree not inferior
  to the reference (`-에 못지않게`), equal degree (`-만큼`), and an extreme degree demonstrated by
  a result (`-(으)ㄹ 정도로`). It appends four stable IDs without changing the original bank or
  Shorts storage schema. Production inventory is 376 rows / 250 exact families (I 124,
  II 126), with 126 redundant rows, 30 duplicate groups, 15 structural flags, and 0 approvals.
  Node 24 focused vocabulary+inventory checks pass 27/27, content checks 30/30, and the full release
  check 124/124 with the v124 45-file runtime contract. Local Chrome/Chromium is unavailable. PR #158
  evidence CI `35434058774` passes Linux Chrome 320/375/390/430px light/dark, selected-wrong feedback,
  expanded coaching, next-first flow, and reload restoration. Artifact `10581702595` screens
  `00cy`/`00cz` were inspected. Final PR CI `35434477757` passed on an unchanged failed-job rerun after
  its first Chrome target closed. PR #158 was squash merged as `10bb264f48b75754c10456f33236d3352f6ba5a0`;
  main CI `35434734289` and Pages `35434733945` succeeded. Live HTTP smoke reports v124 with 3 base +
  45 runtime files. Public Chrome rendered the Japanese `-만큼` card, submitted a deliberate wrong answer,
  restored locked feedback after reload, and exposed the detailed evidence, traps, and reusable method.
  `index.html`, `site-patch.js`, `sw.js`, and `data/shorts-levels.js` hashes match main. Product rollback is
  v123 `cdefae5b00748f2df360f99050d66ea0c079495d`. The bounded ledger is
  `docs/qa/shorts-review-s04-topik2-degree-comparison.md`; native review,
  learner timing/recall, physical devices, audio, and full offline recovery remain unverified.
- v111 adds four TOPIK I counters: `명` for people, `개` for general objects,
  `병` for bottles, and `권` for books/notebooks. The bounded ledger is
  `docs/qa/shorts-review-s04-topik1-counters.md`. Node 24 content 17/17, inventory 2/2, and full
  release checks 111/111 pass. PR #132 final CI `34735351694` passes the same 111/111 plus Linux Chrome
  emulation at 320/375/390/430px in light/dark, selected-wrong feedback, expanded coaching and reload
  restoration. Artifact `10311116003` screenshots `00bx`/`00by` were inspected. The first attempt ended
  on external HTTP 429 and the second on an existing non-deterministic reload assertion; neither reproduced
  on the successful unchanged run. PR #132 was squash merged; main CI `34735492655` passed unchanged on
  rerun after its first Chrome target closed, and Pages `34735492297` succeeded. Live HTTP smoke reports
  v111 with 3 base + 45 runtime files; the four IDs and `data/shorts-levels.js` hash match main.
- Latest #110 instruction: C01–C06 content quality, first applied as S01–S05 Shorts, outranks A08/#76.
  S01 adds `docs/qa/shorts-audit.md`, generated ID/content-hash inventory and `scripts/audit-shorts.cjs`.
  Production v128 has 392 runtime rows but only 266 distinct question-choice sets (I 132, II 134),
  retaining 30 duplicate groups and 15 structural review candidates. Comprehensive content approvals
  remain 0/392, not 392 passed questions.
  Production v126 appends four stable TOPIK II stance-adverb IDs for `간신히`, `차라리`, `도무지`,
  and `미처`. It has 384 runtime rows / 258 exact sets (I 128, II 130), while the existing
  126 redundant rows, 30 duplicate groups, 15 structural candidates, and 0 approvals remain unchanged.
  Local focused checks pass 29/29, content 32/32, and full release 126/126. PR #162 CI `35501505213`
  passes Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching,
  next-first flow, and reload restoration. Artifact `10602636471` screens `00dc`/`00dd` were inspected.
  Final CI `35501808421`, main CI `35502032804`, and Pages `35502032361` passed. Live HTTP smoke and
  public-browser verification passed; product rollback was v125.
  Production v127 appends four stable TOPIK I wearing-action IDs for `입다`, `신다`, `쓰다`, and
  `끼다`. It has 388 runtime rows / 262 exact sets (I 132, II 130), while the existing
  126 redundant rows, 30 duplicate groups, 15 structural candidates, and 0 approvals remain unchanged.
  Local focused checks pass 30/30, content 33/33, and full release 127/127 with the v127 45-file
  runtime contract. PR #164 CI `35518597198` passes Linux Chrome 320/375/390/430px light/dark,
  Japanese wrong-answer feedback, expanded coaching, next-first flow, and reload restoration. Artifact
  `10606903965` screens `00de`/`00df` were inspected. Final CI `35518989721`, main CI `35519244108`,
  and Pages `35519243649` passed. PR #164 was squash merged as
  `b1d9140dc9b06ecfd63bbf92dfbdaf8d056a9ac5`. Live HTTP and four core-asset hash checks passed;
  product rollback is v126.
  Production v128 appends four stable TOPIK II scope-relation IDs for `-을/를 제외하고`,
  `-을/를 대신해(서)`, `-에 관계없이`, and `-을/를 비롯해(서)`. It has 392 runtime rows / 266
  exact sets (I 132, II 134), while the existing 126 redundant rows, 30 duplicate groups, 15 structural
  candidates, and 0 approvals remain unchanged. Local focused checks pass 31/31, content 34/34, and
  full release 128/128 with the v128 45-file runtime contract. PR #166 evidence CI `35556820642` and
  final CI `35557160438` pass Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback,
  expanded coaching, next-first flow, and reload restoration. Artifact `10621001103` screens `00dg`/`00dh`
  were inspected. PR #166 was squash merged as `6840bd478937ebb524f59ec8b68c203f41a1fb46`;
  main CI `35557469515` and Pages `35557469072` passed. Live HTTP, four core-asset hash checks, and
  public-browser verification passed; product rollback is v127. Production v129 adds four bounded
  TOPIK I transit-action sets at `8a33bd6025243187d3f569e3ddd85f432ed4cc94`; PR #168 final CI,
  main CI, Pages, live smoke, core-asset hashes, and public-browser verification passed. Product rollback
  is v128, and the next bounded task is a four-card TOPIK II shortage review.
  Audit-only curated IDs must NOT replace saved numeric indices without the S03 migration contract.
- Production v123 extends the bounded S04 lane with four TOPIK I basic-negation cards (`안`, `못`,
  `아니에요`, `없어요`). It uses stable IDs, fixed choice-specific ko/ja/en/zh feedback, bundled
  examples, and evidence→traps→negation-role coaching. Production inventory is 372 rows / 246 exact
  families (I 124, II 122), with 15 structural flags unchanged. Node 24 focused vocabulary+inventory
  26/26, content 29/29, full release 123/123, and the v123 45-file runtime contract pass. PR #156 CI
  `35417933793` covers 320/375/390/430px Linux Chrome light/dark, selected-wrong feedback, expanded
  coaching, next-first flow, and reload restoration. Artifact `10576448286` screens `00cw`/`00cx` were
  inspected; final PR CI `35418170909` also passed. PR #156 was squash merged as
  `cdefae5b00748f2df360f99050d66ea0c079495d`; main CI `35418404159` and Pages `35418403561`
  succeeded. Live HTTP smoke reports v123 with 3 base + 45 runtime files. Public Chrome rendered the
  Japanese `없어요` card, submitted a deliberate `못` error, restored locked feedback after reload,
  and exposed the detailed evidence, traps, and reusable method. `index.html`, `site-patch.js`, `sw.js`,
  and `data/shorts-levels.js` hashes match main. Local Chrome/Chromium and physical devices remain
  unavailable. Product rollback is v122 `16048fd8f67700f96575d85119614a0db3e8a9cc`. The bounded ledger
  is `docs/qa/shorts-review-s04-topik1-basic-negation.md`.
- Production v121 extends the bounded S04 lane with four TOPIK I polite-interaction cards that
  distinguish an item request, positive action request, prohibition, and shared suggestion. It uses
  stable IDs, fixed choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→speech-goal
  coaching. Production inventory is 364 rows / 238 exact families (I 120, II 118), with 15 structural
  flags unchanged. Its bounded ledger is `docs/qa/shorts-review-s04-topik1-polite-interaction.md`.
- Production v122 extends the bounded S04 lane with four TOPIK II formal-relation marker cards. It uses
  stable IDs, fixed choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→noun-role
  coaching. Production inventory is 368 rows / 242 exact families (I 120, II 122), with 15 structural
  flags unchanged. Its bounded ledger is `docs/qa/shorts-review-s04-topik2-formal-relation.md`.
- S03 v101 (PR #120) migrates schema-2 numeric Shorts progress to stable card/family IDs without
  replacing `topikQuestShortsV1`. It cycles 162 exact question-choice families before intentional repeats,
  prioritizes newly added families, avoids the current/recent family, and labels exhausted-cycle items as review.
  Original 288 rows, answers, mock placement and all learner roots remain unchanged. Node quick 83/83 and PR CI
  `34494776380` passed; direct Linux Chrome evidence covers 320/375/390/430px light/dark, cycle exhaustion,
  visible Japanese review disclosure and reload restoration.
- S04 v102 adds four TOPIK I time-adverb cards with explicit stable IDs, fixed reviewed choice sets,
  concise selected-choice feedback and optional evidence→traps→method coaching in ko/ja/en/zh. Inventory and
  automated/AI review details are in `docs/qa/shorts-review-s04-time.md`; human review and learner timing stay open.
  Local Node v24 and branch CI `34532452034` pass 97/97; that CI also covers Linux Chrome emulation at
  320/375/390/430px in both themes, concise wrong-answer recovery, expanded coaching and reload restoration.
  Bundled ko/ja/en/zh examples render without network translation. Physical devices remain unverified.
- S04 v103 adds four TOPIK II connective-adverb cards for result, contrast, addition and limiting
  condition. Each uses one short relation judgment, fixed reviewed choices, choice-specific ko/ja/en/zh feedback,
  bundled full examples, and evidence→traps→method coaching. The bounded review ledger is
  `docs/qa/shorts-review-s04-topik2-linkers.md`. Local Node 22 and PR #122 CI `34557440568` pass 98/98;
  that CI also covers 320/375/390/430px Linux Chrome emulation in both themes, selected-wrong feedback,
  expanded coaching and reload restoration. Physical devices and learner timing remain unverified.
- S04 v104 adds four TOPIK II cause/concession grammar cards that distinguish bad cause, beneficial cause,
  actual contrary result, and hypothetical concession. Each uses one short two-axis judgment, fixed reviewed choices,
  choice-specific ko/ja/en/zh feedback, bundled full examples, and evidence→traps→method coaching. The bounded review
  ledger is `docs/qa/shorts-review-s04-topik2-cause-concession.md`. Focused inventory checks pass 8/8,
  content checks 11/11, and local Node 22 plus PR #123 CI `34583234297` full release checks pass 99/99.
  That CI covers 320/375/390/430px Linux Chrome emulation in both themes, selected-wrong feedback,
  expanded coaching, next-first flow, and reload restoration. Physical devices and learner timing are unverified.
- S04 v105 adds four TOPIK II inference/evidence grammar cards that separate an observed-clue guess,
  open possibility, strong certainty, and speaker intention followed by a request. Each has a stable ID, fixed
  choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→method coaching. The bounded review
  ledger is `docs/qa/shorts-review-s04-topik2-inference-evidence.md`. Focused checks pass 9/9, local Node 22 and
  PR #124 CI `34586448188` pass 100/100. That CI covers 320/375/390/430px Linux Chrome emulation in both themes,
  selected-wrong feedback, expanded coaching, next-first flow and reload restoration. Physical devices,
  native-language review and learner timing remain unverified.
- S04 v106 adds four TOPIK I everyday-location word cards that distinguish across a road, directly
  beside one place, between two places, and the nearby area. Each has a stable ID, fixed choice-specific
  ko/ja/en/zh feedback, bundled examples, and evidence→traps→reference-point/distance coaching. The bounded
  review ledger is `docs/qa/shorts-review-s04-topik1-location.md`. Focused data and inventory checks pass 10/10,
  while local Node 22 and PR #125 CI `34615296081` full checks pass 101/101. That CI covers 320/375/390/430px
  Linux Chrome emulation in both themes, selected-wrong feedback, expanded coaching, next-first flow and reload
  restoration. Physical devices, native-language review and learner timing remain unverified.
- S04 v107 adds four TOPIK II reported-speech grammar cards that distinguish statements/facts,
  questions, commands/requests, and suggestions to act together. Each has a stable ID, fixed choice-specific
  ko/ja/en/zh feedback, bundled examples, and evidence→traps→original-sentence-function coaching. The bounded
  review ledger is `docs/qa/shorts-review-s04-topik2-reported-speech.md`. Focused data/inventory checks pass
  11/11, content checks pass 14/14, and local Node 22 plus PR #126 CI `34647756064` full release checks
  pass 102/102. That CI rerun covers 320/375/390/430px Linux Chrome emulation in both themes,
  selected-wrong feedback, expanded coaching, next-first flow and reload restoration.
  Physical devices, native-language review and learner timing remain unverified.
- S04 v108 adds four TOPIK I frequency-adverb cards that separate every time, high frequency,
  some occasions, and zero degree/frequency with a negative expression. Each has a stable ID, fixed
  choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→frequency-scale coaching.
  The bounded review ledger is `docs/qa/shorts-review-s04-topik1-frequency.md`. Focused data/inventory checks
  pass 12/12, content checks pass 15/15, and local Node 22 plus PR #127 CI `34669739020` full release checks
  pass 103/103. That CI covers 320/375/390/430px Linux Chrome emulation in both themes, selected-wrong
  feedback, expanded coaching, next-first flow and reload restoration.
  Physical devices, native-language review and learner timing remain unverified.
- S04 v109 added four TOPIK II state/change grammar cards that separate a circumstance-led new action,
  adjective quality change, action in progress, and the remaining result state of a completed action. Each has a
  stable ID, fixed choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→state-function
  coaching. The bounded review ledger is `docs/qa/shorts-review-s04-topik2-state-change.md`. Focused data and
  inventory checks pass 13/13, content checks pass 16/16, and local Node 24 full checks pass 104/104.
  PR #128 CI `34671148823` rerun also passes 104/104 and covers 320/375/390/430px Linux Chrome
  emulation in both themes, selected-wrong feedback, expanded coaching, next-first flow and reload restoration.
  Its first attempt ended only on an unrelated external-resource HTTP 429; the unchanged rerun passed.
  Physical devices, native-language review and learner timing remain unverified.
- S04 v112 adds four TOPIK II condition-relation grammar cards that distinguish an actual-event
  condition followed by a request, a necessary prerequisite, an undecided supposition, and a warning about
  continuing behavior. Each has a stable ID, fixed choice-specific ko/ja/en/zh feedback, bundled examples,
  and evidence→traps→following-clause coaching. The bounded review ledger is
  `docs/qa/shorts-review-s04-topik2-conditions.md`. Focused data checks pass 13/13 and inventory checks pass 2/2;
  full release checks pass 112/112. PR #134 final CI `34765253730` passes the same checks plus Linux Chrome
  emulation at 320/375/390/430px in light/dark, selected-wrong feedback, expanded coaching and reload
  restoration. Artifact `10320915051` screenshots `00bz`/`00cb` were inspected. PR #134 was squash merged as
  `b42d0759a6b98c363f77f6ac72be527e742e8707`; main CI `34765463888` and Pages `34765463632` succeeded.
  Live HTTP smoke reports v112 with 3 base + 45 runtime files, and the four IDs plus
  `data/shorts-levels.js` and `site-patch.js` hashes match main. Local Chrome was unavailable; this evidence is CI
  emulation, not physical iPhone/Android. Product rollback is v111
  `5cbb6773f9cb78c6ab4bd6791165841126038707`.
- S04 v113 adds four TOPIK I question-word cards that distinguish a person, a place, a day/time,
  and a price/amount. Each has a stable ID, fixed choice-specific ko/ja/en/zh feedback, bundled examples,
  and evidence→traps→target-category coaching. The bounded ledger is
  `docs/qa/shorts-review-s04-topik1-question-words.md`. Node 24 content checks pass 19/19 and full release
  checks pass 113/113. PR #136 CI `34783191274` passes the same 113/113 plus Linux Chrome emulation at
  320/375/390/430px in light/dark, selected-wrong feedback, expanded coaching, next-first flow and reload
  restoration. Artifact `10325594505` screens `00cc`/`00cd` were inspected. Final PR CI `34783447830`
  also passed. PR #136 was squash merged as `71c749eb02868d0dd72bb378bfbe34ca0f9c34ff`;
  main CI `34783696587` passed on unchanged rerun after its first Chrome target closed, and Pages
  `34783696240` succeeded. Live HTTP smoke reports v113 with 3 base + 45 runtime files; the four IDs plus
  `data/shorts-levels.js` and `site-patch.js` hashes match main. Product rollback is v112
  `b42d0759a6b98c363f77f6ac72be527e742e8707`.
- v114 adds four TOPIK II completion/experience grammar cards that distinguish total completion,
  a final result after a long process, past experience, and preparation completed and kept ready. Stable IDs,
  fixed choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→post-action coaching are
  recorded in `docs/qa/shorts-review-s04-topik2-completion-experience.md`. Node 24 focused content checks pass
  20/20, inventory checks pass 2/2, and full release checks pass 114/114. PR #138 CI `34826401968` unchanged
  rerun passes 320/375/390/430px Linux Chrome light/dark, selected-wrong feedback, expanded coaching,
  next-first flow and reload restoration with 104 screenshots and zero browser errors. The first attempt stopped
  at the pre-existing state-change reload assertion before the new cards; artifact `10339933219` screens
  `00ce`/`00cf` from the unchanged passing run were inspected. Final PR CI `34827184679` also passed;
  PR #138 was squash merged as `655f8715fc080a9e14b7cea00d34b0a0911a099c`. Main CI `34827681146`
  and Pages `34827680006` succeeded. Live HTTP smoke reports v114 with 3 base + 45 runtime files; all
  four IDs plus `data/shorts-levels.js` and `site-patch.js` hashes match main. Product rollback is v113
  `71c749eb02868d0dd72bb378bfbe34ca0f9c34ff`. Physical devices, native-language review and learner
  timing are unverified.
- Production v115 adds four TOPIK I particle-role cards that distinguish a movement destination, an action
  location, a means or method, and a human recipient. Stable IDs, fixed choice-specific ko/ja/en/zh feedback,
  bundled examples, and evidence→traps→verb-plus-noun-role coaching are recorded in
  `docs/qa/shorts-review-s04-topik1-particles.md`. Node 24 content checks pass 21/21, inventory checks pass
  2/2, and full release checks pass 115/115. PR #140 final CI `34861683365` passes 320/375/390/430px Linux
  Chrome emulation in both themes, selected-wrong feedback, expanded coaching, next-first flow and reload
  restoration. Artifact `10354814262` screens `00cg`/`00ch` were inspected. An earlier concurrent push run
  failed only at the unrelated Travel 390x844 step while the unchanged PR run passed; the final run with the
  particle-specific visual contract passed. PR #140 was squash merged as
  `05e84b401330074bf3432339859169cc156d6357`; main CI `34862095120` and Pages `34862094068`
  succeeded. Live HTTP smoke reports v115 with 3 base + 45 runtime files, and all four IDs plus
  `data/shorts-levels.js` and `site-patch.js` hashes match main. Product rollback is v114
  `655f8715fc080a9e14b7cea00d34b0a0911a099c`. Physical devices, native-language review and learner
  timing are unverified.
- Production v116 adds four TOPIK II action judgment/constraint cards that distinguish no remaining
  alternative, worth doing, required action, and unnecessary action. Stable IDs, fixed choice-specific
  ko/ja/en/zh feedback, bundled examples, and evidence→traps→action-judgment coaching are recorded in
  `docs/qa/shorts-review-s04-topik2-judgment-constraint.md`. Node 24 content checks pass 22/22 and inventory
  checks pass 2/2, and full release checks pass 116/116. PR #142 final CI `34925330780` passes
  320/375/390/430px Linux Chrome light/dark, selected-wrong feedback, expanded coaching, next-first flow
  and reload restoration. Artifact `10380265217` screens `00ci`/`00cj` were inspected. Two earlier
  documentation-head attempts raced by finding an earlier card's restored feedback element before its text
  rendered; the verification harness now waits for non-empty content. PR #142 was squash merged as
  `0b93456fc400ff47b378c6e15b1384bc6187e8f2`; main CI `34925644900` and Pages `34925644352`
  succeeded. A cache-bypassed public Chrome load used runtime scripts at `?v=116`; the public
  `data/shorts-levels.js` contained all four IDs and terms. Product rollback is v115
  `05e84b401330074bf3432339859169cc156d6357`. Local Chrome, physical devices, native-language review,
  learner timing and delayed recall remain unverified.
- Production v117 adds four TOPIK I
  demonstrative cards for `이것·그것·저것·어느 것`, mapping speaker-near, listener-near/already-mentioned,
  far-from-both, and choose-among-many to Japanese `これ·それ·あれ·どれ`. Stable IDs, fixed
  choice-specific ko/ja/en/zh feedback, bundled examples, and evidence→traps→object-relation coaching are
  recorded in `docs/qa/shorts-review-s04-topik1-demonstratives.md`. Focused vocabulary and generated-inventory
  checks pass 20/20, content checks pass 23/23, and the full Node 24 release check passes 117/117. Production
  inventory is 348 rows / 222 exact sets, with no increase to 126 redundant rows,
  30 duplicate groups, 15 structural flags, or zero answer conflicts. PR #144 CI `34986620849` passes
  117/117; its 320/375/390/430px Linux Chrome
  light/dark run also covers selected-wrong feedback, expanded coaching, next-first flow and reload restoration.
  Artifact `10403494820` screens `00ck`/`00cl` were inspected. The prior run `34986362108` stopped before
  browser checks because the connector upload truncated the generated inventory JSON; replacing that blob
  with exact local bytes made the remote and locally checked trees identical. Final evidence-only PR CI
  `34987279723` also passed. PR #144 was squash merged as
  `a14dd083f3afd64142990ae1d829df985cbf8db3`; main CI `34987826662` and Pages `34987825941`
  succeeded. Live uses `?v=117`, loads 3 base + 45 runtime files, exposes the four stable IDs, and matches
  main SHA-256 for `data/shorts-levels.js`, `site-patch.js`, and `sw.js`. Product rollback is v116
  `0b93456fc400ff47b378c6e15b1384bc6187e8f2`. Physical devices, native-language review, learner timing,
  delayed recall, audio and full offline recovery remain unverified.
  Quantity alone is not progress, and a new P0 or clear
  wrong answer takes precedence. At least 28 I / 30 II additional distinct sets remain even before suitability review for the 140/level
  planning floor; this is not the final expansion target. Timing 5–15 seconds is unmeasured and never forced.
- Production v118 adds four TOPIK II plan-stage cards separating considering, personal intention,
  an already-made decision, and a fixed schedule. Focused content 24/24, inventory 2/2, and full release
  118/118 pass on Node 24. PR #146 final CI `35051427873` passes the same checks plus
  320/375/390/430px Linux Chrome light/dark, selected-wrong feedback, expanded coaching, next-first flow,
  and reload restoration. Artifact `10429495520` screens `00cm`/`00cn` were inspected. PR #146 was
  squash merged as `5d7b03c73c21276523b8c56d00d7e0d347b0fea3`; main CI `35051754654` and
  Pages `35051754080` succeeded. A cache-bypassed public Chrome load uses `?v=118`, exposes all four
  stable IDs, and matches main SHA-256 for `data/shorts-levels.js`, `site-patch.js`, and `sw.js`.
  Product rollback is v117 `a14dd083f3afd64142990ae1d829df985cbf8db3`. Physical devices,
  native-language review, learner timing, and delayed recall remain unverified. The bounded ledger is
  `docs/qa/shorts-review-s04-topik2-plan-stage.md`.
- Production v119 adds four TOPIK I basic-tense cards. They separate a repeated present habit, completed past action,
  action in progress, and future plan using `매일 아침·어제·지금·내일` as decisive cues. Production inventory is 356 rows / 230
  exact sets (I 116, II 114) with no new duplicate, structural flag, or answer conflict. Node 24 focused
  vocabulary+inventory 22/22, content 25/25, full release 119/119, and v119 runtime 45-file checks pass.
  PR #148 CI `35203602934` passes the same checks plus 320/375/390/430px Linux Chrome light/dark,
  selected-wrong feedback, expanded coaching, next-first flow, and reload restoration. Artifact `10489585088`
  screens `00co`/`00cp` were inspected. Final PR CI `35204050921` passed on unchanged retry after the existing
  Travel Chrome target closed once. PR #148 was squash merged as `584b42f86b062eb18932aac541ed2ffcfc3b723d`;
  main CI `35204749013` and Pages `35204747120` succeeded. Live HTTP smoke reports v119 with 3 base + 45
  runtime files. Public Chrome entered Shorts, submitted a wrong answer, and restored locked feedback after reload;
  the four IDs are public and `index.html`, `site-patch.js`, `sw.js`, and `data/shorts-levels.js` hashes match main.
  Product rollback is v118 `5d7b03c73c21276523b8c56d00d7e0d347b0fea3`. The bounded ledger is
  `docs/qa/shorts-review-s04-topik1-basic-tense.md`. Physical devices, native-language review, learner timing,
  delayed recall, audio, and full offline recovery remain unverified. Do not treat added quantity as educational approval.
- Production v120 adds four TOPIK II time-relation cards separating immediate succession, a later action after
  completion, overlapping actions, and an action before its reference event. Production inventory is 360 rows / 234
  exact sets (I 116, II 118), with no new duplicate, structural flag, or answer conflict. Node 24 focused
  vocabulary+inventory 23/23, content 26/26, full release 120/120, and v120 runtime 45-file checks pass.
  PR #150 CI `35275144430` covers 320/375/390/430px Linux Chrome light/dark, selected-wrong feedback,
  expanded coaching, next-first flow, and reload restoration. Artifact `10520142804` screens `00cq`/`00cr`
  were inspected; final PR CI `35275712725` also passed. PR #150 was squash merged as
  `ab8fa3e8803d904310ba49c811a9b4e9f764a0ab`; main CI `35276178355` and Pages `35276177552`
  succeeded. Live v120 loads 3 base + 45 runtime files, exposes all four stable IDs, and restores locked
  wrong-answer feedback after reload. Product rollback is v119 `584b42f86b062eb18932aac541ed2ffcfc3b723d`.
  The bounded ledger is `docs/qa/shorts-review-s04-topik2-time-relation.md`. Physical devices,
  native-language review, learner timing, delayed recall, audio, and full offline recovery remain unverified.
- Production v121 adds four TOPIK I polite-interaction cards separating an item request, positive action request,
  prohibition, and shared suggestion. Production inventory is 364 rows / 238 exact sets (I 120, II 118), with
  no new duplicate, structural flag, or answer conflict. Node 24 focused vocabulary+inventory 24/24, content
  27/27, full release 121/121, and v121 runtime 45-file checks pass. PR #152 CI `35328201976` covers
  320/375/390/430px Linux Chrome light/dark, selected-wrong feedback, expanded coaching, next-first flow,
  and reload restoration. Artifact `10539553980` screens `00cs`/`00ct` were inspected; final PR CI
  `35328740574` also passed. PR #152 was squash merged as
  `4ab4628791d4524f6f9cb88b813a84e010bbe922`; main CI `35329196677` and Pages `35329196286`
  succeeded. Public Chrome loads v121 scripts, renders TOPIK I Shorts choices, and exposes all four stable IDs
  in `data/shorts-levels.js?v=121`. Product rollback is v120
  `ab8fa3e8803d904310ba49c811a9b4e9f764a0ab`. The bounded ledger is
  `docs/qa/shorts-review-s04-topik1-polite-interaction.md`. Physical devices, native-language review,
  learner timing, delayed recall, audio, and full offline recovery remain unverified.
- Production v122 adds four TOPIK II formal-relation marker cards separating information source, varying
  standard, means/channel, and passive agent/formal cause. Production inventory is 368 rows / 242 exact sets
  (I 120, II 122), with no new duplicate, structural flag, or answer conflict. Node 24 focused
  vocabulary+inventory 25/25, content 28/28, full release 122/122, and v122 runtime 45-file checks pass.
  PR #154 CI `35360830953` covers 320/375/390/430px Linux Chrome light/dark, selected-wrong feedback,
  expanded coaching, next-first flow, and reload restoration. Artifact `10554394352` screens `00cu`/`00cv`
  were inspected; final PR CI `35361581234` also passed. PR #154 was squash merged as
  `16048fd8f67700f96575d85119614a0db3e8a9cc`. Main CI `35362016106` passed on an unchanged failed-job
  rerun after the existing Travel 390×844 browser step failed once; Pages `35362015443` succeeded.
  Public Chrome loads v122 with 3 base + 45 runtime scripts, exposes all four stable IDs, and restores locked
  Japanese wrong-answer feedback after reload. The public `index.html` hash matches main. Product rollback is
  v121 `4ab4628791d4524f6f9cb88b813a84e010bbe922`. The bounded ledger is
  `docs/qa/shorts-review-s04-topik2-formal-relation.md`. Physical devices, native-language review,
  learner timing, delayed recall, audio, and full offline recovery remain unverified.
- Current one task after checking new P0 and clear wrong-answer reports: review one bounded four-card
  TOPIK I missing-type set, because its 124 distinct sets trail TOPIK II's 126. Do not treat added
  quantity as educational approval.
- Follow start → understand → recall/speak/write → review → next learning for Japanese beginners, and
  passage evidence → specific distractor traps → reusable solving method for TOPIK I/II.
- 2026 draft gates: Sep 13 audit/scope/dependencies; Sep 27 core flow/P0/P1/backup; Oct 11 teaching,
  language, review and one RPG course; Oct 18 freeze/RC; Oct 19–Nov 2 real beta; Nov 2–15 review buffer.
  Nov 17 is conditional first public release, Dec 1 a fallback review date, not a promised approval.
- Report evidence and gaps at each weekly gate. #110's 12-person beta targets (10 first-step successes,
  9 next/review discoveries) are small-sample goals, never QA-seed statistics or industry benchmarks.
  Actual day-1/day-7 recall, real iPhone/Android evidence, and approved post-release 14-day stability remain open.
- Autonomous publishing is GitHub Pages only. Store accounts/payment/identity, signing keys, external
  tester invitations, personal-data collection, store submission and publication need separate owner approval.
  Stop on PAUSE. Only pause the recurring loop for owner stop, all-work blockage, or completed #110 gates.
- Current-pass checks, documentation PR/merge and live verification belong in #110's progress comment.
  Unseen states and unrun tests must remain unverified, including corpus-wide translation completeness,
  corpus-wide explanation and grammar correctness, A06/A07 physical-mobile reproduction, actual iPhone/Android, audio, offline recovery,
  and real learner delayed recall. Corpus-wide grammar-translation correctness remains unverified beyond A05.

## Stable product state

- Production is a dependency-free static PWA in `okometsbu-beep/topik-quest`, hosted on GitHub
  Pages. It must remain usable without login.
- Browser progress is local-first. Existing storage keys, saved questions, vocabulary, review
  intervals, game state, and settings are compatibility contracts.
- The runtime bank contains 2,144 original practice items: the immutable 2,088-item generated bank
  plus 56 type-focused items in `data/question-bank-practice-v1.js`. Generated bank parts are build
  output and must not be opened or edited for non-content work.
- Travel Mode is an independent Seoul learning-adventure below Game Mode and cannot overwrite a
  timed mock exam. Its first route is Incheon Airport T1 → Seoul Station → Myeongdong.
- Travel scenes compose generated pixel-art backgrounds, player skins, NPCs, props/rewards, and UI
  tiles as separate layers. Do not bake characters into backgrounds or replace travel art with emoji;
  keep localized and accessible text as HTML above the generated surfaces.
- Travel exploration uses `data/travel-map-seoul-v1.js` for world/district/zone/collision/POI/portal data
  and the DOM-free `travel-rpg-engine.js` for movement. Add Seoul one verified zone and portal at a time;
  never duplicate the engine inside a route pack or draw the whole city as one untestable canvas.
- The first spatial slice has separate Incheon Airport T1 Arrivals, Transport Center, and Airport Railroad
  Concourse zones joined by bidirectional portal connections. Player zone, position, facing, steps, and discovery IDs are stored
  under the existing route episode's `exploration` field in `malbitStoryV1`; rewards are one-time.
- Beginner missions follow situation → action → visible world reaction → reward or recoverable time
  cost. The first route varies the input as dialogue, sign hotspot, and ticket-machine action instead
  of presenting six visually identical worksheets.
- Hangul Start keeps its existing reading and recognized-handwriting progress in `malbitBeginnerV1` and
  adds grammar only under the nested `grammarV1` field. `data/beginner-grammar-v1.js` owns a reviewed
  9-chapter, 64-lesson absolute-beginner course covering word order, particles, tense, speech endings,
  negation, connective endings, modifiers, 받침-dependent selection, contraction, honorifics, counters,
  and major irregular conjugations. Every lesson must show the condition and contrasting form branches,
  original examples, a common trap, a typed transformation drill, and per-Hangul-unit handwriting; both
  practices are required for completion. Keep Korean/Japanese/English/Chinese coaching in the data owner.
- Before grading, Travel answer choices expose Korean only; the selected and correct translations are
  revealed afterward. NPC quests use multi-turn dialogue, and free composition accepts a reviewed set
  of meaningful non-canonical sentences for a limited smaller reward.
- The first airport NPC lesson saves a five-turn Korean exchange, requested-only translation, the first
  wrong keyword, and two progressive hint stages inside the existing route episode. Re-entry resumes the
  same turn; a hinted resolution remains an honest missed first attempt for score and review.
- Arrivals owns one independent 3×4-tile cheongsachorong welcome prop. Its two collision cells are declared
  with the visual, its investigation teaches `어서 오세요` without treating `어서` as a hurry command,
  and its 200-travel-won reward is idempotent under the existing discovery contract.
- Bank, Game, and Travel explanations follow evidence → distractor/selected-choice analysis → reusable
  type-solving tip. TOPIK II writing uses separate short-fill, expository-fill, graph-summary, and essay
  plans. Game battle rendering must not force `scrollIntoView` or smooth page scrolling.
- Myeongdong follow-ups now progress from free NPC composition to Hangul sign building and a Korean
  price-board budget quest. The budget quest uses only game travel won, records one idempotent
  `street-food` spend under `malbitStoryV1`, and states that stall prices can vary.
- Travel Mode keeps privacy-free local funnel counters under `malbitStoryV1.metrics`: route starts,
  first completions, first Myeongdong entries, first collectible-exchange sessions, and the Myeongdong
  price quest's starts, first clears, pre-clear wrong submissions, and aggregate wallet-after-clear.
  The on-device Travel card shows derived rates and average remaining travel won; no event, identifier,
  timestamp, device detail, or counter leaves the browser.
- Travel UI follows the saved system/light/dark preference. Do not force `colorScheme`, paint a whole mode
  bright, or use a near-black placeholder tile as scenery. Map art stays unfiltered while cards, controls,
  text, borders, and focus states use theme tokens. Every UI change must pass both Travel themes plus
  320/375/390/430px containment, symmetry, 44px touch-target, console, and durable-storage checks.
- Travel zones use a 48×36, 25px tile contract. Every ground cell references an explicit catalog entry
  with atlas coordinates, terrain, walkability, and layer; the browser paints individual tiles and never
  a full-map `<img>`. Legacy 12×9 saved coordinates migrate once to version 2 without changing the storage key.
- `data/travel-tiles-korean-street-v1.js` owns the first reusable Seoul streetscape catalog independently
  from the airport migration maps. Its 4×4 WebP atlas contains 16 64px source tiles for sidewalks, roads,
  straight curb boundaries, crosswalks, tactile paving, and lane marks. Every entry declares terrain,
  walkability, orientation, ground layer, and four edge materials; a non-playable 12×8 fixture is the
  mobile seam/theme gate and must not be added to `world.zones` as a shortcut.
- Purpose-named corner and junction sibling catalogs extend that foundation without changing the airport
  world. The corner sheet owns four inner and four outer turns; the junction sheet owns four oriented T
  centers, four cross variants, approaches, and a 20×12 all-entry fixture. T centers expose three road
  exits plus one closed sidewalk edge, while cross centers expose four traversable exits.
- The building-entrance sibling catalog owns thresholds, stairs, step-free ramps, and transparent upper
  facades. A separate decoration sibling catalog owns 16 text-free signs, awnings, planters, and street
  details. Every decoration declares its actor baseline, upper occlusion, and collision footprint; only
  seven floor-standing props block one cell. Both catalogs remain isolated from playable airport zones.
- `data/travel-block-korean-street-v1.js` composes a non-playable 12×10 Seoul block using only IDs from
  the five reusable catalogs. Its validator resolves each catalog-owned edge, walkability, upper baseline,
  and collision footprint; it rejects unknown IDs, broken named routes, invalid ports, and footprint drift.
- The same owner composes isolated 12×10 blocks east-to-west, north-to-south, and as a four-block
  2×2 grid. Its adjacency validator rejects
  overlapping blocks, mismatched full seams, reused or non-adjacent ports, non-opposing directions,
  different materials, non-walkable endpoints, incomplete internal links, and reused external exit
  coordinates while keeping every fixture out of playable zones.
- Travel movement keeps the live tile and sprite DOM in place for a 110ms player step and 160ms camera
  follow. Pointer-held SVG direction controls repeat until release, blocked movement stops silently, and
  reduced-motion devices settle immediately without map opacity, filter, or brightness changes. The five
  map controls and their SVG children suppress iOS callout, selection, and drag while ordinary learning
  copy remains selectable.
- Travel exploration stores a versioned 10,000-step stamina record inside the existing episode
  `exploration` field. Only successful movement spends stamina; blocked input is free and exhausted input
  is ignored. At 0%, a separate unfiltered 4:3 rest-lounge image owns the full-height game-over screen.
  One-hour rest resets only stamina and position to the current zone spawn while retaining discoveries,
  rewards, route answers, wallet, inventory, and lifetime exploration steps.
- The default `traveler-blue` skin owns one optimized transparent 8×4 sprite sheet. Rows are
  down/left/right/up; columns 0–3 are a 4fps idle loop and 4–7 are a 12fps walk loop. Every frame uses
  the same `.5,.9375` foot anchor and one preloaded image URL, so movement must not swap `src`, opacity,
  filter, or brightness. Player and visible NPC containers share the same near-one-tile scale; NPC art
  has an idle loop. Clear/perfect reward skins intentionally keep the prior static fallback.
- Travel exploration is map-first: the 4:3 world stays aspect-correct at full viewport height, the camera
  follows both axes around interior tiles with 1.2× vertical overscan, and location, objective, travel
  status, D-pad, and interaction controls are compact overlays. Viewport resizing snaps camera bounds
  before restoring movement interpolation so no empty edge flashes. Investigation copy expands only
  while a discovery is open.
- Travel zones declare upper-foreground silhouettes, object baselines, and collision cells together.
  Ground, foot-depth actors, and upper foreground render as separate DOM layers; signs, kiosks, ticket
  gates, machines, and planters reuse exact pixels from the unfiltered map rather than a dark overlay.
  The entire world is an isolated stacking context below HUD controls, so scaled Y-depth cannot cover UI.
- Player and visible NPC contact shadows render in their own layer between ground and actors. Each
  shadow shares the actor's foot coordinate and depth, stays the same DOM node through movement, and
  uses a small bounded pixel oval instead of a baked image filter or scene-wide dark paint.
- Each Travel zone can declare bounded lamp, screen, or window highlights with position, size, color,
  and strength. They render in a separate environment layer between ground and contact shadows;
  validation rejects out-of-bounds effects, opacity above 0.65, and mobile coverage large enough to
  become a scene-wide tint. The original map, actors, and foreground remain unfiltered.
- Travel world data owns the mobile performance budget: at most 1,728 ground tiles, 256 upper tiles,
  and 2,048 live board DOM nodes per zone. The real-Chrome movement probe samples 47 animation frames
  and rejects p95 above 34ms or more than 15% of frames above 50ms.
- Travel exploration exposes one reusable cue plan for portal enter/arrive, investigation discovery,
  first reward, NPC entry, and return. Each 70–220ms state animates only the active control, marker,
  reward text, or location HUD; the map and viewport never receive opacity, brightness, or filter
  animation. `MALBIT_TRAVEL_CUE_HOOKS` is an opt-in adapter boundary: sound and vibration callbacks are
  ignored unless their individual booleans are explicitly enabled, and reduced-motion settles at once.
- Game Mode now uses semantic spacing, type, surface, border, and accent tokens through the purpose-named
  `game-visual-system.js` final owner. Equipment, rarity, stage, run-slot, and map-node tiles follow the
  saved system/light/dark preference and must stay readable rather than near-black. CI checks both themes
  at 320/375/390/430px for symmetry, overflow, 44px controls, 10px copy, contrast, and screenshot evidence.
- Home uses the same semantic contract through `home-visual-system.js`. The hero remains scenic, while
  level controls, Quick Practice, full mock, speaking, weekly-goal, and bottom-navigation surfaces resolve
  to white cards only in light mode and navy surfaces in dark mode. CI rejects a mixed light/dark shell.
- Shorts uses `shorts-visual-system.js` as the final visual owner for question, choice, graded feedback,
  instructor coaching, and save-proposal surfaces. All use the shared theme tokens; CI checks light and dark
  unanswered/graded cards at all four widths while preserving coaching and the existing progress root.
- Random Practice uses `random-practice-visual-system.js` as the final visual owner for both TOPIK I and II
  headers, stats, questions, choices, graded states, translations, and expandable coaching. These resolve
  through the same light/dark surface and state tokens; CI checks both themes without changing stored sessions
  or the Japanese evidence → distractor → type-solving structure.
- Review uses `review-visual-system.js` as the final visual owner for its TOPIK I/II filter, queue, retry sheet,
  requested translation, graded state, and detailed option elimination. Queue and sheet surfaces follow the
  selected theme; CI checks both themes, resolution, and re-entry while preserving `malbitWrongReviewV3`.
- The old Story Mode is retired from product UI. Travel Mode deliberately keeps the legacy
  `malbitStoryV1` root and scene IDs so saved answers, clears, and best scores migrate in place.
- `storage-guard.js` keeps a last-known-good `malbitRecoverySnapshotV1` of durable learner roots.
  Backup import is additive for keys missing from old files; only the explicit full-reset action
  may clear the recovery snapshot.
- Vocabulary cards open `vocab-editor.js` for multilingual meanings, simple Korean definitions,
  examples/translations, origins, notes, TTS, source, and review metadata.
- Vocabulary automatic fill preserves manual edits. `MALBIT_AI_ADAPTER` is only a safe integration
  boundary; the current static app has no generative-AI server or provider key.

## Known gaps and deferred work (audit defects are tracked in #110)

- No account or cloud sync: clearing browser storage or changing devices does not carry progress.
- Real AI-generated examples and etymology require a server-side endpoint. The current fallback uses
  reviewed local data and automatic translation where available.
- TTS defaults to an optional zero-fee local neural pack: ten Supertonic 3 voices, learner-friendly
  `0.82` speed, an explicit one-time ~230 MB download, and no text upload or client API key. The
  pack is lazy, separately cached, removable, and falls back to ranked device voices if absent or
  unsupported. Mobile and low-memory browsers never initialize the large ONNX sessions because the
  fp16 CPU path can exceed mobile tab memory; they use device TTS and can remove an existing pack.
  All voice and speed controls stay in the single detailed More-screen setting.
- A returning GitHub Pages tab can briefly show the previous release while its service worker swaps;
  closing and reopening the tab completes the update without deleting progress.
- Travel has static bounded highlights but no weather or time-varying environment effects yet. Future
  effects must reuse the independent environment layer and must never simulate night with a black scene overlay.
- The cue contract currently owns airport exploration interactions. Myeongdong dialogue/reward screens
  still need to adopt the same states; no audio files or persistent sound/vibration controls ship yet.
- Current airport tile catalogs migrate the existing three backgrounds into explicit per-cell atlas entries.
  The reusable Korean street foundation now covers straight segments, typed inner and outer curb corners,
  T/cross junctions, building entrances, decorative upper layers, one validated block, and east-west,
  north-south, plus 2×2 neighboring-block compositions. An isolated Seoul street zone data contract is
  deferred behind #110 core learning gates; these fixtures are not playable Seoul learning progress.
  Other NPCs still need the keyword-learning contract, and the cheongsachorong is only the first Korean
  investigation object.

## Execution defaults

- A request to explain, review, or plan is read-only.
- A request to modify means implement and verify locally.
- A request that explicitly includes deployment means: one version bump for public asset changes after the coherent batch (none for docs-only changes),
  full check, mobile flow check, branch/PR, CI, merge, and live smoke.
- The connected GitHub integration can publish without GitHub CLI. Do not ask the user to install
  `gh` merely because it is absent inside a temporary workspace.
- Autonomous development uses a standalone GitHub-connected ChatGPT Scheduled task at Asia/Seoul
  00:00, 06:00, 12:00, and 18:00. Durable instructions live in `loop/PROMPT.md`, product intent in
  `docs/DESIGN.md`, current state in `docs/STATUS.md`, and phone input in `[AI 지시]` GitHub Issues.
- Each autonomous pass handles one bounded task and at most one PR. Passing changes may deploy to
  GitHub Pages; App Store and Google Play publishing stay disabled until signed release lanes exist.
- Payment UX is quarantined. Until a separate monetization discussion and explicit user approval,
  do not add prices, purchase/subscription buttons, paid locks, Premium/Plus labels, upsells, external
  payment links, or placeholder stores anywhere in the app.
- Ignore `TOPIK_public_sources_bundle*.zip` unless the requested change actually concerns question
  content, provenance, or rebuilding the bank.

## Compact task packet

Before editing, reduce each request internally to four lines: outcome, owning files, acceptance
check, and whether release is requested. If those are inferable, proceed without a clarification
round trip.
