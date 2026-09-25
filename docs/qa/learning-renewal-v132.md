# v132 learning renewal release

## Scope and preservation

Direct user request: major product/marketing/UI renewal, including analogous screenshot defects.
Primary hypothesis: Japanese-speaking beginners can understand, use, and recall a Korean phrase.
Home now gives one primary learning action, mistakes/phrase recall, travel application, and TOPIK.
Wordlight, Shorts, vocabulary, speech, exams, settings and saved learning roots remain available.
No payment surface, account gate, external analytics, invitation, or API key is added.

Travel route: eight question payloads, nine rail/taxi contexts. Every payload has evidence,
three specific distractor reasons, a reusable method, and a model phrase in four explanation languages.
The renderer shows the learner's mistaken choice first; other distractors are expandable.
The new recall screen hides the model until reveal/submit and persists a 120-character draft.
Exact model comparison ignores punctuation/spacing/NFC only. Alternative wording is not marked
ungrammatical. Unaided model matches return after 24h; assisted/comparison practice after 10m.
Records stay under malbitStoryV1 and survive route replay; rewards/answers/routes are unchanged.

The prior screenshot fixes are carried forward: solid readable Travel feedback, translation source-echo
rejection, duplicate Korean translation suppression, and four matching grammar-question coaches.
This is not a claim of whole-bank explanation or native-language approval.

## Actual verification

Recovered environment lacked the previous 082517c/fb22900 objects; reconstructed from the issue record.
Local checkpoint: 2073709. Linux Node v24.19.0: quick 122/122; content 37/37; full 138/138.
84 JS syntax checks, v132/45 ordered runtime files, immutable original bank hashes pass.
Generated Shorts inventory hashes refreshed; counts and human approvals unchanged.
Meaningful regressions cover draft restoration, separate assisted/unaided history, duplicate submit,
alternate wording, HTML escaping, replay preservation, and TOPIK II interrupted-session resume.
Local HTTP smoke: v132, 3 base assets and 45 runtime files pass.
No local Chrome available. GitHub Actions Ubuntu/Node 22/Chrome run
https://github.com/okometsbu-beep/topik-quest/actions/runs/36073840735 at 69e2ad4 passes;
artifact 10839034278 contains 174 screenshots. Home and recall were visually inspected at
320/375/390/430px, light/dark; Travel correct/wrong feedback and Random Practice also inspected.
Touch, draft/reload/return, three Travel routes, preserved records and console checks pass.
Before evidence: production v131 public browser and baseline main artifact 10788332361.

Failures were not counted as passes: 36073107704 exposed the keyed review-store mismatch (fixed
using active Object.values entries); 36073307136 found an obsolete Travel-entry selector (updated
for the actual renewed entry). Visual inspection also caught the inherited 9px goal labels at 390px;
the existing compatibility rule now enforces 12px at every width. The later content-only correction
in 36074351199 required refreshing the deterministic generated inventory; counts/approvals unchanged.

Final content audit corrected the candidate's false claim that 길어질뿐더러 cannot attach.
The dictionary defines -ㄹ뿐더러 as adding another fact and permits attachment to vowel-final verbs:
https://krdict.korean.go.kr/eng/dicSearch/SearchView?ParaWordNo=74341&nation=eng
The four localized coaches now reject the additive meaning because this sentence requires advance
preparation for an anticipated situation. This is a contextual explanation, not a conjugation ban.
Failing-then-passing regression plus the exact reported item in ko/dark and ja/light were added;
final-head CI and those newly added screenshots must be inspected before merge.

## Release boundary

Released via PR #174, squash c4045c8358acbfb505c9df01d70dbaa3c5e026e3:
https://okometsbu-beep.github.io/topik-quest/
Final PR CI 36075457096, main CI 36075858880 and Pages 36075858066 succeed.
Candidate baseline: 5ae66838620f6ce822ae5a42330332d31dbe0578. Product rollback after v132: v131.
Physical iPhone/Android, native-language/educator review, actual first success and D1/D7 recall,
all-bank teaching quality, microphone behavior, and complete offline recovery remain unverified.

## Final screen findings

PR CI 36074805842 at 0f97d2e passed; artifact 10840166037 has 176 screens.
The ko screenshot confirmed the duplicate original is not visible (its hidden layout anchor remains).
The ja screenshot exposed automatic translation of grammatical 바람에 as 風の中で. Merge was held.
All four preparation-item IDs now use authored ja/en/zh sentence meanings labelled as the completed
correct sentence, with Korean expression glosses rebuilt in the actual shuffled order. No unsupported
mapping is invented. This avoids machine translation for those items. Native/editorial approval of
the entire bank is still not asserted. Regression covers all four IDs × three languages, shuffled
alignment, no wind mistranslation, and no automatic call; full local check now passes 138/138.
Final PR CI 36075457096 at f51a8b84fb1d3db364c6edcbab56e9c16f8038f7 passed before merge.
Artifact 10840396345 has 177 screens; the corrected Japanese sentence/gloss panel and grammar
coach were inspected. This supersedes the earlier pending-final-head notes.

## Public verification and bounded v133 follow-up · 2026-09-25

Public Chrome 1363×936: v132 and 48 versioned scripts, ko/ja Home, no broken Home images,
and beginner CTA→Hangul confirmed. Direct shell HTTP to public Pages timed out at 12 seconds;
do not confuse local HTTP smoke with a live shell/hash pass.
Public Travel exposed six clipped HUD/direction buttons: DOM centers hit the body instead of
their buttons. The map uses viewport width while .app/.travelScreen retain max-width:560px.
Those rules were unchanged in v132; the prior v131 desktop UI was not separately reproduced.
v133 only releases the RPG parents' max-width, adds a failing-then-passing source regression,
and tests actual elementFromPoint hits at 1363×936 in both themes before existing four-width
mobile gates. Local full 138/138 and runtime v133 pass. First CI 36076470585 terminated its
Chrome target after 38 screens; this is not visual approval. Branch agent/v133-wide-travel-20260925
subsequently passed CI 36076910462 with the same product code. Artifact 10839744095 has 179 screens;
1363×936 light/dark HUD/direction buttons and mobile Travel were directly inspected. Existing
320/375/390/430px × light/dark checks and preservation checks pass. Final PR/deployment verification
then completed: PR #175 CI 36077342411 passed; squash cbbd1b5615f374a70708e4dde07000d942a2e8cc.
Main CI 36077673880 and Pages 36077673424 succeed. Public v133 confirms 48 scripts at v133,
six HUD/direction button centers hittable, click/arrow movement, NPC dialogue→correct answer→
answer-hidden writing→draft reload restoration→model comparison→24h recall notice. This is
synthetic QA, not actual learner evidence. Local v133 HTTP base3/runtime45 passes with server/check
in one process session; cross-session attempts lost the dev server and returned ECONNREFUSED.
Public shell HTTP remains a network timeout; no live byte/hash pass is claimed.
Known separate accessibility follow-up: the pre-existing RPG global Enter handler prevents native
activation of focused map/language buttons. Pointer controls and arrow movement are verified, not
all keyboard use. Next bounded repair must add a focused activation regression.
Narrow rollback: v132 c4045c8; whole-update rollback: v131 fadd253.

## Wide camera closure · v135 · 2026-09-25

Public v134 exposed a separate P1: at 1363×936, initial and resumed Travel entry used the 720px
fallback camera before the full-bleed viewport existed, leaving about 208px uncovered on the right.
v135 recomputes from the mounted viewport and re-clamps on the next animation frame. The regression
measures all four board edges before movement on light initial entry and dark saved re-entry, then
runs the existing 320/375/390/430px light/dark, touch, keyboard, route, tile and console gates.

PR #179 final CI 36117974374 passes 138/138 plus Chrome. Artifact 10856190822 contains 181 screens;
the two new 1363×936 frames were inspected and have no blank edge. Runs 36116613167 and 36117009893
correctly failed while the gap remained. Run 36117342467 passed the new camera gate but later lost
its Chrome target on both attempts; it is retained as failure, not approval. Squash
e57a7769861c7fe34b839335f356f6e62deaee47; main CI 36118461882 and Pages 36118461431 pass.
Public HTTP smoke reports v135, base 3 plus 45 runtime assets. index.html, site-patch.js, sw.js and
travel-mode.js match main by SHA-256. Narrow rollback is v134
c15309cda11259e6f190f6cd5be9f5a6e0ae60c5. Physical devices, native/educator review and actual
learner first success/D1/D7 retention remain unverified; synthetic browser QA is not learner evidence.
