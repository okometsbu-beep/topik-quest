const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const storage = new Map();
const context = {
  console,
  window: {},
  localStorage: {
    getItem: (key) => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key)
  }
};
context.window.window = context.window;
context.window.localStorage = context.localStorage;
vm.createContext(context);
for (let part = 1; part <= 4; part++) vm.runInContext(fs.readFileSync(`data/question-bank-v1-part${part}.js`, 'utf8'), context);
vm.runInContext(fs.readFileSync('question-bank-engine.js', 'utf8'), context);

const bank = context.window.MALBIT_BANK;
assert.ok(bank, 'question bank engine should initialize');
assert.equal(bank.total, 2088);
assert.equal(bank.stats.topik1, 840);
assert.equal(bank.stats.topik2, 1248);

for (let set = 1; set <= 12; set++) {
  assert.equal(bank.mock(1, set, 'listening').length, 30, `TOPIK I listening set ${set}`);
  assert.equal(bank.mock(1, set, 'reading').length, 40, `TOPIK I reading set ${set}`);
  assert.equal(bank.mock(2, set, 'listening').length, 50, `TOPIK II listening set ${set}`);
  assert.equal(bank.mock(2, set, 'reading').length, 50, `TOPIK II reading set ${set}`);
  assert.equal(bank.mock(2, set, 'writing').length, 4, `TOPIK II writing set ${set}`);
}

const source = bank.byId('M01-I-L-01');
const displayed = bank.present(source, [2, 0, 3, 1]);
assert.deepEqual(Array.from(displayed.choiceOrder), [2, 0, 3, 1]);
assert.equal(displayed.choices[displayed.answerIndex], source.options[source.answerIndex]);
assert.notEqual(displayed.answerIndex, source.answerIndex, 'answer index should move when choices are shuffled');
const firstOrder = bank.freshOrder(source.id);
const firstSlot = firstOrder.indexOf(source.answerIndex);
const secondOrder = bank.freshOrder(source.id);
const secondSlot = secondOrder.indexOf(source.answerIndex);
assert.notEqual(firstSlot, source.answerIndex, 'first randomized encounter should move the original answer slot');
assert.notEqual(secondSlot, firstSlot, 'the same item should use a different answer slot on its next encounter');

for (const level of [1, 2]) {
  const used = [];
  for (let stage = 1; stage <= 7; stage++) {
    const pool = bank.gamePool(level, stage, used);
    assert.ok(pool.length >= 20, `game pool should be populated for TOPIK ${level}, stage ${stage}`);
    assert.ok(pool.every((item) => item.level === level && item.section !== 'writing' && !item.visual));
    const picked = pool.slice(0, Math.min(12, pool.length));
    assert.ok(picked.every((item) => !used.includes(item.id)), 'game pool must exclude used IDs');
    used.push(...picked.map((item) => item.id));
  }
  assert.equal(new Set(used).size, used.length, `TOPIK ${level} expedition IDs should not repeat`);
}

context.window.MALBIT_LISTENING_ENABLED = () => false;
for (const level of [1, 2]) {
  const silentPool = bank.gamePool(level, 3, []);
  assert.ok(silentPool.length >= 20, `silent game pool should be populated for TOPIK ${level}`);
  assert.ok(silentPool.every((item) => item.section === 'reading'), 'listening-off game pool must contain reading only');
}
delete context.window.MALBIT_LISTENING_ENABLED;

assert.equal(bank.shorts(1).length, 108);
assert.equal(bank.shorts(2).length, 48);

const listening = [], readingWriting = [];
assert.equal(bank.activateTopik2Set(7, listening, readingWriting), true);
assert.equal(listening.length, 50);
assert.equal(readingWriting.length, 54);
assert.equal(listening[0].bankId, 'M07-II-L-01');
assert.equal(readingWriting[50].bankId, 'M07-II-W-51');

assert.ok(bank.items.every((item) => item.explanationKo && item.explanationJa));
const noisyProblemHeader = /^\s*[<〈《][^>〉》\n]{2,120}[>〉》]\s*(?:\r?\n|$)/u;
assert.ok(bank.items.every((item) => [item.instruction, item.passage, item.script, item.prompt]
  .every((value) => !noisyProblemHeader.test(String(value || '')))), 'generated problem headers should be removed');
console.log('question-bank.test: 2,088 items, clean prompts, 12 mock sets, shuffle, difficulty pools, and no-repeat policies passed');
