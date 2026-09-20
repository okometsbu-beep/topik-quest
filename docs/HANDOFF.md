# MALBIT compact handoff

This is the short continuity record for future work. Use it with `AGENTS.md`; do not reconstruct
these facts from conversation history or the large TOPIK source bundle.

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

## Current release priority · 2026-09-20

- Source of truth: [release blueprint #110](https://github.com/okometsbu-beep/topik-quest/issues/110).
  It supersedes #76 map expansion until core learning quality gates pass. A01–A12 remain audit findings,
  not resolved items; existing feature/visual checks do not certify translation or teaching accuracy.
- Production is v126 at `39e2ac7d305d5e5acbfdd8308bf1075994c00d1c` (PR #162), adding four
  bounded TOPIK II stance-adverb cards separating narrow success after difficulty, a less-bad alternative,
  emphatic negation, and an action missed in time. Production inventory is 384 rows / 258 exact families
  (I 128, II 130); local focused vocabulary+inventory checks pass 29/29, content checks 32/32, and the
  full release check 126/126 with the v126 45-file runtime contract. PR #162 evidence CI `35501505213`
  and final CI `35501808421` cover Linux Chrome 320/375/390/430px light/dark, selected-wrong feedback,
  expanded coaching, next-first flow, and reload restoration. Artifact `10602636471` screens `00dc`/`00dd`
  were inspected. Main CI `35502032804` and Pages `35502032361` succeeded. Live HTTP smoke reports v126
  with 3 base + 45 runtime files; public Chrome verified Japanese `도무지`, a deliberate `미처` error,
  detailed coaching, and reload restoration. `index.html`, `site-patch.js`, `sw.js`, and
  `data/shorts-levels.js` hashes match main. Local Chrome/Chromium and physical devices remain unavailable.
  TOPIK II writing 51/52 keeps the v110 separate labelled ㄱ/ㄴ fields through input, scoring, save,
  Review, recovery, and compatible legacy migration. Product rollback is v125
  `91923d31206dfbe8695f5348050ab9834dafc478`.
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
  Production v126 has 384 runtime rows but only 258 distinct question-choice sets (I 128, II 130),
  retaining 30 duplicate groups and 15 structural review candidates. Comprehensive content approvals
  remain 0/384, not 384 passed questions.
  Production v126 appends four stable TOPIK II stance-adverb IDs for `간신히`, `차라리`, `도무지`,
  and `미처`. It has 384 runtime rows / 258 exact sets (I 128, II 130), while the existing
  126 redundant rows, 30 duplicate groups, 15 structural candidates, and 0 approvals remain unchanged.
  Local focused checks pass 29/29, content 32/32, and full release 126/126. PR #162 CI `35501505213`
  passes Linux Chrome 320/375/390/430px light/dark, Japanese wrong-answer feedback, expanded coaching,
  next-first flow, and reload restoration. Artifact `10602636471` screens `00dc`/`00dd` were inspected.
  Final CI `35501808421`, main CI `35502032804`, and Pages `35502032361` passed. Live HTTP smoke and
  public-browser verification passed; product rollback is v125. The next bounded review target is TOPIK I,
  which has fewer distinct sets (128) than TOPIK II (130).
  Candidate v127 appends four stable TOPIK I wearing-action IDs for `입다`, `신다`, `쓰다`, and
  `끼다`. The candidate has 388 runtime rows / 262 exact sets (I 132, II 130), while the existing
  126 redundant rows, 30 duplicate groups, 15 structural candidates, and 0 approvals remain unchanged.
  Local focused checks pass 30/30, content 33/33, and full release 127/127 with the v127 45-file
  runtime contract. PR mobile evidence, final CI, merge, Pages, and public-browser gates remain;
  production and rollback remain v126.
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
- 2026 draft gates: Sep 13 audit/scope/dependencies; Sep 27 core flow/P0/P1/backup; Oct 1