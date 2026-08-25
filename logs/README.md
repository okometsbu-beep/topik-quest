# Autonomous run logs

The durable run log lives in GitHub, not a local machine:

1. ChatGPT Scheduled keeps each fresh run and its status.
2. A `[AI 지시]` issue keeps the request, result, checks, deployment URL, and rollback point.
3. The pull request keeps the exact code diff, CI result, commits, and merge record.
4. `docs/STATUS.md` keeps only the latest compact state and next task.

Do not copy full chat transcripts or CI output into this directory. Repeated giant logs make every
future session spend tokens reading history instead of improving MALBIT.
