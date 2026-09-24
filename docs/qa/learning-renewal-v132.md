# v132 learning renewal candidate

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
Local checkpoint: 2073709. Linux Node v24.19.0: quick 122/122; content 37/37; full 137/137.
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

No PR, merge, or deployment yet. Production v131 fadd25392e75f055c6deebf026ec77b8d597c96b:
https://okometsbu-beep.github.io/topik-quest/
Candidate baseline: 5ae66838620f6ce822ae5a42330332d31dbe0578. Product rollback after v132: v131.
Physical iPhone/Android, native-language/educator review, actual first success and D1/D7 recall,
all-bank teaching quality, microphone behavior, and complete offline recovery remain unverified.
