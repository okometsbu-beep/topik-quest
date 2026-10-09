# Harumal Cloudflare vocabulary adapter — prepared, NOT deployed

Checked against Cloudflare documentation 2026-10-09. This folder is local preparation only. No account, API token, OAuth grant, binding or endpoint has been created. Live model quality has NOT been verified.

## Contract and privacy
- Browser keeps reviewed grammar/deck meanings first. Otherwise sends selected text exactly, its bounded public learning sentence, kind and target language (ja/en/zh). Never the whole vocabulary notebook, user notes or profile.
- Input text is untrusted data, not instructions. Output is a structured draft: meaning, explanation, alternative senses, Korean example, example translation, uncertainty. It still needs learner review; schema/language checks are not semantic correctness guarantees.
- The built-in bridge compares exact term/context against loaded public lesson data, not source labels. An unmatched or manual entry gets an explicit warning. A localized modal previews exactly what will be sent and requires a Translate click before loading Turnstile and sending. This is per-request approval, not standing permission. Email/URL/phone-like input is blocked client-side before transmission as an additional conservative safeguard; it is not a full privacy detector.
- No selected-text logging, persistent server cache, IP-based identity or credentials in client code. Turnstile receives its verification token; model receives only bounded learning text. Provider processing still applies.
- Errors, quota, timeout, malformed JSON, language mismatch and uncertainty do not save a meaning or fall back to MyMemory. Existing saved/manual meanings and progress are untouched. New context-sensitive cache is separate from old cache. Stale responses cannot overwrite edits.

## Before enabling (requires owner action / explicit approval)
1. User creates/verifies free Cloudflare account at the official signup linked from https://developers.cloudflare.com/workers-ai/get-started/dashboard/ . Do not ask for a password or API token in chat.
2. Verify **Workers Free**, no paid plan, no prepaid AI Gateway credits. Free quota is 10,000 neurons/account/day; resets 00:00 UTC. This is NOT unlimited. On Free, operations fail when exhausted. Paid upgrades can incur charges: this code cannot inspect/prevent an account-level future upgrade.
3. Obtain action-time permission for the Worker AI binding and any authentication grant or new persistent credentials. Prefer user-operated dashboard deployment over broad API tokens. If CLI is used, scope to this account's Workers deployment plus only required AI/Turnstile capabilities; do not request zone, DNS or unrelated account access. Never place secrets in this public repo.
4. Create a Turnstile widget scoped to the public app hostname, configure action `vocabulary`, put its secret only in the Worker's secret store (`TURNSTILE_SECRET`). Credential creation/configuration requires action-time approval/secure handoff. No production bypass. Do not use testing keys on the public endpoint.
5. Confirm a unique rate-limit namespace on this account. Current setting is 12 attempts/minute per Cloudflare location, shared across this app. This is intentionally conservative for a no-login app. CORS is NOT authentication; scripts can spoof Origin. Turnstile is therefore mandatory. Locality/eventual consistency mean this binding is NOT a global cost cap. The Free account quota is the spending boundary.
6. Deploy Worker only after approval, enable its verified workers.dev route, set `ENABLED=true`, `FREE_PLAN_VERIFIED=true`; keep observation logs off. No KV/D1/paid storage required. AI binding is server-only. Do not put REST API keys in GitHub Pages.
7. Test actual provider with seven reported grammar cases, several homographs and every target language. Confirm rate/quota/error paths and review semantics manually before publication. Request timeout stops waiting but may not cancel already-started AI inference.
8. Set the verified endpoint and real public Turnstile site key in `window.MALBIT_TRANSLATION_CONFIG` (enabled, endpoint, turnstileSitekey). The localized consent/preview modal, exact public-content matching and Turnstile loading are implemented in vocabulary-translation.js. No placeholder URL is sent. No script loads until the learner approves the preview. Optional injected verifyPublicEntry/getTurnstileToken hooks exist for contract testing only; do not bypass production approval. Do not set enabled until end-to-end tests pass.
9. Run all release checks; bump shared asset version once with other ongoing changes; deploy public frontend only with publication approval.

## Tests and limitations
`node --test tests/cloudflare-vocabulary.test.cjs tests/vocabulary-translation.test.cjs` uses mocked AI/verification, not live quality evidence. Full release tests belong to the parent release work. No deployment credentials are needed for these tests.

Sources:
- https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/
- https://developers.cloudflare.com/workers-ai/configuration/bindings/
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
