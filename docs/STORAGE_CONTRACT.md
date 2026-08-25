# MALBIT learner-record contract

Browser data is user-owned product state. A release may change code and visuals, but it must not
silently replace, rename, or clear a learner's records.

## Durable roots

| Root | Record |
| --- | --- |
| `topikQuestV8` | vocabulary, TOPIK II progress, writing, game answers, current preferences |
| `topikQuestShortsV1` | Shorts progress |
| `topikQuestTopik1GameV1` | TOPIK I Expedition progress |
| `malbitWrongReviewV3` | wrong-answer review |
| `malbitBeginnerV1` | Hangul beginner and handwriting |
| `malbitStoryV1` | Travel Mode route, best score, stamps, unlocked/equipped avatar looks |
| `malbitProductPrefsV1`, `malbitTtsPrefsV1` | learning and voice settings |
| analytics/onboarding roots in `storage-guard.js` | local product history and setup choices |

`malbitStoryV1` is intentionally named after the retired mode. Renaming it would strand existing
progress, so Travel Mode treats the name as a permanent compatibility API.

## Recovery behavior

`storage-guard.js` writes `malbitRecoverySnapshotV1`, a last-known-good copy of durable roots.
It excludes the disposable translation cache. On startup it restores a durable root only when the
current value is missing or malformed, or when the core record is suspiciously empty while the
snapshot contains real vocabulary or game progress.

The explicit **Reset all progress** action clears the recovery snapshot before deleting records.
No update, service-worker replacement, navigation change, or backup import may do so.

## Import behavior

An imported progress file replaces only roots present in that file. Roots added by a newer release
remain untouched when importing an older file. A recovery snapshot is captured immediately before
and after import.

## Change checklist

1. Keep existing root names and nested learner fields.
2. When a schema must change, read the old value, migrate in place, and keep a rollback path.
3. Add an old-value fixture to `tests/storage-preservation.test.cjs`.
4. Run the focused storage test and the full release check.
5. Verify a returning mobile session with populated vocabulary, game, review, and Travel records.
