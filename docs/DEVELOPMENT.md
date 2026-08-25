# MALBIT development workflow

## Setup

MALBIT has no runtime or development dependencies beyond Node.js 22+ and a browser.

```bash
npm run check
npm run serve
```

The local server listens on `http://127.0.0.1:4173` by default. Set `PORT` to override it.
In a second terminal, `npm run smoke` verifies the release version and every runtime asset over HTTP.

## Work lanes

### Fast lane

Use for one UI bug or one bounded behavior change.

1. Locate the owner from `AGENTS.md` and search with `rg`.
2. Edit only the owning source and its focused test.
3. Run `npm run test:quick` and `npm run check:runtime`.
4. Verify the affected mobile flow locally.

Do not load or audit all question-bank payloads unless the change touches content or bank behavior.

### Content lane

Use for questions, answers, explanations, translations, difficulty, shuffling, or delivery pools.

1. Change the canonical source or the bank engine; never hand-edit generated parts.
2. Rebuild when canonical content changes.
3. Run `npm run test:content` and `npm run check:runtime`.
4. Spot-check the same item in every affected mode and language.

### Release lane

Use once after a coherent batch, not after every tiny intermediate edit.

1. Run `npm run version:bump` for public asset changes.
2. Run `npm run check`.
3. Run the local browser regression checklist below.
4. Commit to `agent/<description>`, push, open a PR, and merge to `main`.
5. Verify `https://okometsbu-beep.github.io/topik-quest/` reports the new version and loads without
   console errors on a returning-user session.

The deployment-level asset check is:

```bash
npm run smoke -- https://okometsbu-beep.github.io/topik-quest/
```

## Browser regression checklist

- Home opens without an onboarding or diagnostic gate.
- Bottom navigation reaches Home, Review, Statistics, Vocabulary, and More.
- TOPIK I and II Random Practice open the correct pool.
- Shorts can select, submit, show the current displayed answer number, and advance.
- Expedition can roll, move, enter battle, and return without a frozen screen.
- Travel Mode opens the Seoul map, resumes the current mission, reaches all three stops, equips an
  unlocked avatar look, and never shows a payment surface.
- Beginner handwriting accepts pointer input, rings on a match, and advances.
- Listening preference buttons remain clickable and persist after reload.
- Existing vocabulary, game, review, beginner, and Travel records survive reload and
  service-worker replacement. Run `node --test tests/storage-preservation.test.cjs` with the
  focused UI test whenever a storage root or import/reset path changes.

## Release version

Never change version strings independently. Use:

```bash
npm run version:bump
# or
npm run version:bump -- 42
```

The command updates `index.html`, every literal `?v=` URL in that file, `site-patch.js`, and `sw.js`
together. Tests derive the version dynamically, so a normal version bump does not require test edits.
