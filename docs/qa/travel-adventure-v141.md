# v141 · Scene-led Seoul adventure · #195

User-requested conversion: travel opens a dialogue adventure, not a walking RPG. The first
course contains four scenes per level, airport → train → Seoul Station → lodging. Older
journeys remain in the collapsed archive when their records exist. No map expansion is planned.

## Content review boundary

All eight scenarios, schedules and booking conditions are original learning fiction. They are
not current transport advice, official TOPIK items, or a calibrated claim of exam difficulty.
TOPIK I targets elementary practical reading; TOPIK II targets intermediate inference and
conditions. This is not coverage of every TOPIK II level or question type.

| Stable ID | Judgment required | Answer, 1-based | Decisive constraint |
| --- | --- | --- | --- |
| ADV-I-01 | Departure vs arrival deadline | 3 | 13:55 arrives before 14:00; 14:15 does not |
| ADV-I-02 | Match color and contents | 1 | Blue bag with two books, no umbrella |
| ADV-I-03 | Current route vs usual route | 4 | Exit 2 closed; Exit 3, turn right |
| ADV-I-04 | Request an available service | 2 | Room at 15:00; bag storage available before check-in |
| ADV-II-01 | Deadline plus ticket validity | 3 | 14:50 arrival fits; express ticket cannot be reused |
| ADV-II-02 | Infer a polite request's purpose | 1 | Clear the doors for alighting passengers |
| ADV-II-03 | Limit the scope of an exception | 4 | Exit 4 stairs closed; lift explicitly remains open |
| ADV-II-04 | Room type vs room, date-limited benefit | 2 | Move rooms; breakfast excluded on extra date |

Each item has Korean dialogue, optional Japanese/English/Chinese translations, four replies,
decisive evidence, three distinct distractor explanations and a reusable reading strategy.
Choice translations stay hidden until submission. A wrong reply requires reconsideration;
it does not unlock the next scene or award currency. All attempts remain recorded.

## State and compatibility

- Additive `malbitStoryV1.adventureV1`: independent level progress, dialogue position, response,
  attempt history and recall drafts. Existing `episodes`, avatars, inventory, wallet and metrics
  are left in place. The 2,088-item bank and IDs are unchanged.
- Recovery snapshots and exports already include the travel root. Importing a pre-adventure
  backup now retains `adventureV1` when that field is absent; an explicitly supplied adventure
  backup restores that supplied record.
- Recall is a self-assessment, not automatic grammar grading or measured retention. “Needed
  help” schedules 10 minutes; “recalled myself” schedules 24 hours. No audio is recorded.
- New owners: `data/travel-adventure-seoul-v1.js`, `travel-adventure.js`, `travel-adventure.css`.
  Old engine and records remain compatible through the explicit archive route.

## Verification

- Node 22: full suite and unchanged bank hashes are required. Focused tests cover dialogue gates,
  all eight answers, per-level isolation, wrong-answer retry, double submission, escaped drafts,
  selected recall prompt after a fresh runtime, malformed storage and older backup import.
- Headless Chrome on GitHub Ubuntu: 320/375/390/430px × light/dark, touch targets, overflow,
  loaded images, native Enter response, both courses through completion, wrong reply then
  retry, hard reload, Home/back/re-entry, and a recall draft after reload.
- Packaged Korean/Japanese/English/Chinese screens are exercised with network disconnected
  after assets have loaded, then connection is restored. Cold offline installation is not claimed.
- `scripts/travel-adventure-checks.mjs` runs the new default before the previous course tests
  switch explicitly to the archive. Those synthetic fixtures are not learner statistics.
- The shared mobile runner now waits for a new document's runtime after reload. Initial failed
  candidate runs exposed a stale inventory source hash and browser-driver navigation/Enter
  issues; those failures are not counted as passing runs.
- Physical iPhone/Android, native Japanese educator review, real first-session completion and
  10-minute/D1/D7 retention remain unverified. No testers were invited or personal data collected.

Final CI, screenshots, deployment commit and live checks are recorded in
[Issue #195](https://github.com/okometsbu-beep/topik-quest/issues/195).
Live target: https://okometsbu-beep.github.io/topik-quest/.
Rollback: v140 main `adef36a5565a4260f8545ea6c7c2e6ee0fd7c255`.

Next: check unaided recall and course suitability with approved real learners; do not claim
that higher difficulty or a larger question count has improved learning without that evidence.
