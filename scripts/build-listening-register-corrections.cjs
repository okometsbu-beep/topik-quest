#!/usr/bin/env node
'use strict';
// A separate, pending-safe correction layer. Never rewrites original banks or audio.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));

function build(source, base, rows) {
  assert.equal(source.version, 1);
  assert.equal(source.activationAllowed, false, 'Activation requires separate reviewed audio integration.');
  assert.equal(source.utterances.length, 60);
  assert.equal(source.questions.length, 144);
  const reviewedTexts = source.utterances.slice().sort((a, b) => a.oldId.localeCompare(b.oldId)).map(row => [row.oldId, row.id, row.originalText, row.text]);
  assert.equal(hash(JSON.stringify(reviewedTexts)), source.reviewRecord.reviewedTextSha256, 'Text changed since independent review.');
  assert.equal(source.reviewRecord.status, source.reviewStatus);
  const originalRows = new Map(rows.map(row => [row[0], row]));
  const originals = new Map(base.corpus.map(row => [row.id, row]));
  const coverage = new Map(base.coverage.map(row => [row.id, row.script]));
  const replacements = new Map();
  for (const row of source.utterances) {
    assert.equal(hash(row.originalText).slice(0, 16), row.oldId);
    assert.equal(hash(row.text).slice(0, 16), row.id);
    assert.notEqual(row.id, row.oldId);
    assert.ok(!replacements.has(row.oldId), `Duplicate repair: ${row.oldId}`);
    assert.equal(originals.get(row.oldId)?.text, row.originalText);
    assert.deepEqual(row.originalVoices, originals.get(row.oldId).voices);
    assert.deepEqual([...row.sources].sort(), [...originals.get(row.oldId).sources].sort());
    assert.deepEqual(row.oldFiles, row.originalVoices.map(voice => `audio/listening/v1/${voice}/${row.oldId}.mp3`));
    if (row.castingCorrection) {
      assert.equal(source.castingReviewRecord.status, 'approved');
      assert.deepEqual(row.originalVoices, ['M1']);
      assert.deepEqual(row.voices, ['F1']);
      assert.deepEqual(row.castingCorrection.questionIds, row.sources);
      for (const id of row.sources) {
        const original = originalRows.get(id);
        assert.ok(original?.[7].includes('여자의 중심 생각'), `Missing female instruction: ${id}`);
        assert.equal(original[9].split('\n').length, 1);
        assert.equal(base.scripts[original[9]].length, 1);
        assert.equal(base.scripts[original[9]][0].voice, 'M1');
        assert.ok(source.castingReviewRecord.questionIds.includes(id));
      }
    } else assert.deepEqual(row.voices, row.originalVoices);
    replacements.set(row.oldId, row);
  }
  const byId = {}, scripts = {}, questionCoverage = [];
  for (const question of source.questions) {
    const row = originalRows.get(question.id);
    assert.ok(row, `Unknown original question: ${question.id}`);
    assert.equal(row[3], 'l');
    assert.equal(row[8], '', 'Unexpected passage requires a separate content review.');
    assert.equal(row[9], question.originalScript, question.id);
    assert.equal(coverage.get(question.id), question.originalScript);
    assert.equal(hash(question.originalScript), question.originalScriptSha256);
    assert.equal(hash(question.suggestedScript), question.suggestedScriptSha256);
    let corrected = question.originalScript;
    const utteranceHashes = [];
    for (const oldId of question.caseIds) {
      const repair = replacements.get(oldId);
      assert.ok(repair?.sources.includes(question.id), `Unmapped replacement: ${question.id}`);
      assert.equal(corrected.split(repair.originalText).length, 2, `Non-exact replacement: ${question.id}`);
      corrected = corrected.replace(repair.originalText, repair.text);
      for (const voice of repair.voices) utteranceHashes.push({ original: oldId, corrected: repair.id, originalVoice: repair.originalVoices[0], voice });
    }
    assert.equal(corrected, question.suggestedScript);
    const segments = base.scripts[question.originalScript].map(segment => {
      if (segment.pause) return { pause: segment.pause };
      const repair = replacements.get(segment.id);
      if (repair) {
        assert.ok(repair.sources.includes(question.id));
        assert.ok(repair.originalVoices.includes(segment.voice));
      }
      const voice = repair?.castingCorrection?.voice || segment.voice;
      return {
        id: repair?.id || segment.id,
        voice,
        text: repair?.text || originals.get(segment.id).text,
        file: `audio/listening/${repair ? 'register-v1' : 'v1'}/${voice}/${repair?.id || segment.id}.mp3`
      };
    });
    assert.ok(!byId[question.id], `Duplicate question: ${question.id}`);
    byId[question.id] = {
      originalScript: question.originalScript,
      script: corrected,
      audioReady: false,
      reviewStatus: source.reviewStatus,
      reviewScope: source.reviewRecord.scope,
      reviewedTextSha256: source.reviewRecord.reviewedTextSha256,
      originalScriptSha256: question.originalScriptSha256,
      scriptSha256: question.suggestedScriptSha256,
      utteranceHashes
    };
    scripts[corrected] = segments;
    questionCoverage.push({ id: question.id, originalScript: question.originalScript, script: corrected });
  }
  assert.deepEqual(new Set(source.utterances.flatMap(row => row.sources)), new Set(Object.keys(byId)));
  const corpus = source.utterances.map(({ id, text, voices, originalVoices, castingCorrection, sources, oldId, oldFiles }) => ({ id, text, voices, originalVoices, ...(castingCorrection ? { castingCorrection } : {}), sources, originalId: oldId, retainedOriginalFiles: oldFiles }));
  const spec = {
    version: 1,
    status: 'pending_generation_and_review',
    sourceCorpusSha256: source.sourceCorpusSha256,
    model: base.model,
    modelRevision: base.modelRevision,
    questionCount: questionCoverage.length,
    scriptCount: Object.keys(scripts).length,
    textCount: corpus.length,
    clipCount: corpus.reduce((sum, row) => sum + row.voices.length, 0),
    activationAllowed: false,
    corpus, coverage: questionCoverage, scripts
  };
  const overlay = { version: 1, audioReady: false, activationAllowed: false, reviewedTextSha256: source.reviewRecord.reviewedTextSha256, byId };
  return { spec, overlay };
}

function main() {
  const source = json('content/listening-register-repairs-v1.json');
  assert.equal(hash(read('audio/listening/v1/corpus.json')), source.sourceCorpusSha256, 'Original corpus changed; re-audit before rebuilding.');
  assert.equal(hash(read('audio/listening/v1/manifest.json')), source.sourceManifestSha256, 'Original manifest changed; re-audit before rebuilding.');
  const context = {}; context.window = context; vm.createContext(context);
  for (let i = 1; i <= 4; i++) vm.runInContext(read(`data/question-bank-v1-part${i}.js`), context);
  const { spec, overlay } = build(source, json('audio/listening/v1/corpus.json'), JSON.parse(JSON.stringify(context.MALBIT_QUESTION_BANK_PARTS.flat())));
  const outputs = {
    'audio/listening/register-v1/corpus.json': JSON.stringify(spec, null, 2) + '\n',
    'data/listening-register-corrections-v1.js': '// Generated by scripts/build-listening-register-corrections.cjs. Text reviewed; audio pending. Activation is disabled.\n(function(){\n"use strict";\nconst data=' + JSON.stringify(overlay) + ';\nfor(const item of Object.values(data.byId)){for(const hashes of item.utteranceHashes)Object.freeze(hashes);Object.freeze(item.utteranceHashes);Object.freeze(item);}\nObject.freeze(data.byId);window.HARUMAL_LISTENING_REGISTER_CORRECTIONS=Object.freeze(data);\n})();\n'
  };
  for (const [file, contents] of Object.entries(outputs)) {
    if (process.argv.includes('--check')) assert.equal(read(file), contents, `Stale generated correction file: ${file}`);
    else { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), contents); }
  }
  console.log(`Listening register corrections: ${spec.questionCount} unchanged IDs, ${spec.clipCount} repair clips, runtime activation disabled.`);
}
if (require.main === module) main();
module.exports = { build };
