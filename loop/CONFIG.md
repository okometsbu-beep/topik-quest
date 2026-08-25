# MALBIT autonomous loop configuration

This repository uses a standalone ChatGPT Scheduled task with the connected GitHub repository. It
does not require WSL, a permanently running PC, a client-side API key, or `loop.sh`.

## Runtime

- Repository: `okometsbu-beep/topik-quest`
- Production: `https://okometsbu-beep.github.io/topik-quest/`
- Time zone: `Asia/Seoul`
- Schedule: every day at `00:00`, `06:00`, `12:00`, and `18:00`
- Session policy: start a fresh standalone session for every run
- Work limit: exactly one bounded task and at most one pull request per run
- Model: use the scheduled task's current default model; do not add an OpenAI API key to GitHub

## Control surface

- New work: open a GitHub issue whose title starts with `[AI 지시]`.
- Highest priority: start the title with `[AI 지시][긴급]`.
- Skip automated work: open an issue titled `[AI 제어] PAUSE`.
- Resume automated work: close the open `[AI 제어] PAUSE` issue.
- Permanently stop the schedule: disable or delete the task in ChatGPT Scheduled.
- Roll back production: open an issue titled `[AI 지시][긴급] 마지막 배포 되돌리기`.

GitHub issues are public in this public repository. Never put passwords, keys, personal data, or
unreleased business information in an issue.

## Deployment boundary

Passing changes are merged to `main`, which deploys GitHub Pages. Apple App Store and Google Play
publishing remain outside the loop until signing, store accounts, review tracks, and rollback
procedures exist. A scheduled loop must never invent or expose store credentials.
