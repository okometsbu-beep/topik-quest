const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'data/shorts-levels.js'), 'utf8'), context);

test('TOPIK study library is complete, multilingual, and organized by level', () => {
  const decks = context.window.MALBIT_SHORTS_DECKS;
  assert.equal(decks[1].length, 36);
  assert.equal(decks[2].length, 42);
  assert.deepEqual([...new Set(decks[1].map(item => item.type))].sort(), ['expression', 'grammar', 'word']);
  assert.deepEqual([...new Set(decks[2].map(item => item.type))].sort(), ['grammar', 'idiom', 'word']);
  for (const level of [1, 2]) {
    assert.equal(new Set(decks[level].map(item => item.term)).size, decks[level].length, `TOPIK ${level} terms should be unique`);
    assert.ok(decks[level].every(item => item.term && item.example && ['ko', 'ja', 'en', 'zh'].every(lang => item.meaning[lang])));
  }
});

test('vocabulary screen exposes manual entry, search, filters, and save actions', () => {
  const source = fs.readFileSync(path.join(root, 'learning-features.js'), 'utf8');
  for (const handler of ['malbitAddManualVocab', 'malbitAddLibraryVocab', 'malbitSearchVocabLibrary', 'malbitSetVocabLibraryLevel', 'malbitSetVocabLibraryType']) {
    assert.match(source, new RegExp(`window\\.${handler}`));
  }
  assert.match(source, /TOPIK STUDY LIBRARY/);
  assert.match(source, /tqManualVocabTerm/);
  assert.doesNotMatch(source, /class="tqLongPressDiscovery"/);
});
