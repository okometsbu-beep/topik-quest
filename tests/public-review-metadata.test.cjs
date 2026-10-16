'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { projectReviewMetadata } = require('../scripts/public-review-metadata.cjs');
const { contentHash } = require('../scripts/build-legacy-answer-repairs.cjs');
const root = path.resolve(__dirname, '..');
const json = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

test('public reviewer projection preserves QA state and semantic content while removing nested task identifiers', () => {
  const source = { id: 'fixture', prompt: 'Keep this exact sentence.', qa: { status: 'approved', contentSha256: 'a'.repeat(64), reviewer: 'review_private_fixture', finalHashVerifiedBy: 'review_hash_fixture', checks: { answerUnique: true }, inherited: { reviewer: 'author_private_fixture' }, blindReviewer: 'review_blind_fixture' } };
  const projected = projectReviewMetadata(source);
  assert.equal(contentHash(projected), contentHash(source));
  assert.equal(projected.qa.status, 'approved');
  assert.equal(projected.qa.contentSha256, source.qa.contentSha256);
  assert.deepEqual(projected.qa.checks, source.qa.checks);
  for (const value of [projected.qa.reviewer, projected.qa.finalHashVerifiedBy, projected.qa.inherited.reviewer]) assert.equal(value, 'independent-content-review');
  assert.equal(projected.qa.blindReviewer, 'independent-blind-review');
  assert.equal(source.qa.reviewer, 'review_private_fixture', 'private input must not be mutated');
  assert.deepEqual(projectReviewMetadata(projected), projected);
  assert.equal(projectReviewMetadata({ independentReviewer: 'review_visual_fixture' }, 'independent-visual-review').independentReviewer, 'independent-visual-review');
});

test('public core and legacy projection retains every approved content hash', async () => {
  const { reviewHash } = await import('../scripts/build-original-exams.mjs');
  for (const [file, hash] of [['content/original-exams-v1.json', reviewHash], ['content/legacy-answer-repairs-v1.json', contentHash], ['content/legacy-question-visuals-v1.json', contentHash]]) {
    for (const item of json(file).items) assert.equal(hash(item), item.qa.contentSha256, item.id);
  }
});

test('public content, runtime data, audio metadata and docs contain no task reviewer names or private paths', () => {
  let checked = 0;
  for (const folder of ['content', 'data', 'audio', 'docs']) {
    for (const entry of fs.readdirSync(path.join(root, folder), { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !/\.(?:json|js|md|txt|svg|html)$/.test(entry.name)) continue;
      const file = path.join(entry.parentPath, entry.name);
      const text = fs.readFileSync(file, 'utf8');
      assert.doesNotMatch(text, /\b(?:review|complete|implement)_[a-z][a-z0-9_]+\b|\/(?:workspace|agent_notes|user_notes|home|Users|root)\/|codex:\/\//, path.relative(root, file));
      checked++;
    }
  }
  assert.ok(checked > 100);
});

test('anonymous casting review retains only the exact approved incidental-character exception', () => {
  const review = json('audio/listening/original-v9/gender-reference-review.json');
  assert.equal(review.status, 'approved');
  assert.equal(review.reviewer, 'independent-content-review');
  assert.equal(review.items.length, 1);
  const item = review.items[0];
  assert.equal(item.id, 'O08-II-L-48');
  assert.equal(item.gender, '남자');
  assert.equal(item.classification, 'incidental_character_not_speaker');
  assert.equal(item.sourceContentSha256, '7893d31ebdf4ee7f42e18fd0ef29b0d2019e0dcc60d7f2c99c313f676069576c');
  assert.equal(item.sourceScriptSha256, 'f43d2d3612cac0936ab1f7c381bdfe1949ca591340b4b088b42d0f7fb91cc954');
  assert.equal(item.promptSha256, '0ab8684cc490b42d8cd47a21175fb203e407be119d2fde1cfec2ed633ffa3bb4');
  assert.equal(item.instructionSha256, '77cadef6c90b3025b49b16e6407f2e424df204147936147e8c9af17485227c3d');
});
