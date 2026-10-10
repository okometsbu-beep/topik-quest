const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('reviewed listening repairs are exact, idempotent, and preserve speaker labels', async () => {
  const { repairListeningScript, listeningScriptRepairs } = await import('../scripts/lib/listening-script-repairs.mjs');
  assert.equal(listeningScriptRepairs.length, 38, '28 earlier exact repairs plus ten v165 clip-aligned corrections');
  for (const { old, corrected } of listeningScriptRepairs) {
    assert.notEqual(old, corrected);
    assert.equal(repairListeningScript(old), corrected);
    assert.equal(repairListeningScript(corrected), corrected);
    assert.equal(repairListeningScript(`소라(한빛센터): ${old}`), `소라(한빛센터): ${corrected}`);
    assert.ok(!corrected.includes('. 같은 방법'));
    for (const m of corrected.matchAll(/([가-힣])([을를]) (?:조사해 보니|다룰 때)/g)) {
      assert.equal(m[2], (m[1].charCodeAt(0)-0xac00)%28 ? '을':'를');
    }
  }
  assert.equal(repairListeningScript('무관한 원문입니다.'), '무관한 원문입니다.');
});

test('generated listening bank contains corrected scripts and no known bad variants', async () => {
  const { listeningScriptRepairs } = await import('../scripts/lib/listening-script-repairs.mjs');
  const context=vm.createContext({window:{}});
  for(let n=1;n<=4;n++) vm.runInContext(fs.readFileSync(`data/question-bank-v1-part${n}.js`,'utf8'), context);
  const rows=context.window.MALBIT_QUESTION_BANK_PARTS.flat();
  assert.equal(rows.length,2088);
  const listening=rows.filter(r=>r[3]==='l');
  for(const {old,corrected} of listeningScriptRepairs) {
    assert.ok(!listening.some(r=>r[8].includes(old)||r[9].includes(old)), 'old script absent');
    assert.ok(listening.some(r=>r[9].includes(corrected)), 'corrected audio script included');
  }
});
