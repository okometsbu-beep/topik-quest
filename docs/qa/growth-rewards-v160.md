# HARUMAL growth practice and activity rewards · v160

## Product scope

- Existing Home / Learn / Words / Review / My navigation and all older learning modes remain.
- Home has a separate Today's Challenge. Learn has opt-in TOPIK, grammar, writing and travel growth entries; the grammar, writing and travel hubs also link to their selected lessons.
- Shorts stays its existing rapid question flow. It does not embed the longer growth lesson or link to it from a question.
- Timed exams keep answers and hints hidden before submission. Submitted TOPIK results can open type-focused growth practice.
- Original Haruman transparent poses remain the only companion art.

## Authored growth content

11 original paired mini-lessons (22 tasks) cover vocabulary/notice meaning, grammar contrast, listening, multi-condition matching, gist with evidence, inference with evidence, sentence order, insertion, table comparison, constrained writing and travel dialogue. This is a bounded initial library, not hand-authored coverage of the entire existing question bank.

Guidance, prompts, token definitions, hints and explanations follow the selected Korean, Japanese, English or Chinese interface language. Korean learning stimuli and answer choices remain Korean.

Each session records its first answer, requested help, retries and the new-context result separately. An assisted success earns activity rewards but is not reported as independent performance or language mastery. In the notice prototype, `교육 이수자만 입장 가능` distinguishes education completion from merely applying. The new `예약자만 입장 가능` context checks transfer of `만`; it does not establish vocabulary mastery of `이수자`.

Interaction patterns include sorting people by conditions, pairing claims and evidence, ordering sentence cards, choosing an insertion gap, comparing table values, typing a tightly bounded target sentence and following a dialogue branch. Free writing, pronunciation and open-ended semantic correctness are not automatically certified.

## Reward contract

| Event | XP | Coins |
| --- | ---: | ---: |
| Easy correct answer | 10 | 2 |
| Normal / medium correct answer | 15 | 3 |
| Hard correct answer | 25 | 5 |
| Very hard correct answer | 40 | 8 |
| Growth learn-stage completion | 20 | 4 |
| Growth transfer-stage completion | 30 | 6 |

A correct growth task and its completed stage are separate, disclosed awards. Difficulty uses the existing question metadata. For a source without difficulty metadata, the fallback is normal. Cumulative XP for activity level L is `50 × (L−1) × L`: level 2 starts at 100 XP, level 3 at 300 XP and level 4 at 600 XP. The status explicitly says this is an activity level, not a Korean-proficiency or TOPIK certificate.

Awards use source, persisted session and question/stage-slot identities. Repeat submission, re-entry and refresh reuse those identities; an explicit new practice can create another eligible session. Existing completed learner history is not backfilled.

Coins are local activity currency reserved for future profile decorations and vocabulary-diary stickers. This release has no shop, payment, purchase button or exchange into existing Expedition gold / Travel won.

## Storage and recovery

The app remains browser-local, with no account or cross-device sync. `harumalRewardsV1` contains the event ledger; independent immutable `harumalRewardsEvent:` entries protect awards from a cross-tab aggregate overwrite. Displayed totals derive from the union of event identities, not a trusted mutable balance. `harumalGrowthLearningV1` owns growth sessions. Existing vocabulary, learning, review, travel, game and settings roots remain intact.

Backup export includes reward events and growth sessions. Import merges identities rather than adding imported totals, so importing the same file twice cannot mint duplicate currency. Existing recovery snapshots include the new roots. Storage failure or a corrupt/newer incompatible record produces a warning and preserves the original record. Browser data deletion still removes local progress; this is not a server-secured economy.

## Verification record

- Base: main `730cfa54e203c739513f7edbf4c46360dd7e344f`, v159.
- Implementation runs in the dot cloud workspace; no user desktop dependency.
- Cloud local HTTP server started. Local Chromium launch was denied by the sandbox (`socket() failed: Operation not permitted`); the denied launch was not retried or escalated.
- Release requires the final full Node check and a draft-PR GitHub Actions Chrome/mobile run before merge to production, then exact commit/Pages/version/asset checks and public browser interaction checks.
- Final localized cloud Node check passed 355/355 tests: 128 JavaScript files parsed, v160 with 62 ordered runtime files, unchanged original bank hashes. Focused independent review rechecked concurrency, corruption, reward identity, assistance, repeated-item evidence and old-audio completion.
- Local HTTP smoke passed v160 with 4 base + 62 runtime files. The server and fetch ran in one execution scope because separate shell invocations do not share the loopback listener.
- Remote browser run IDs, commit and live results will be recorded after verification. Browser emulation is not a physical iPhone/Android test.
