const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { inventory, curatedId } = require('../scripts/audit-shorts.cjs');

test('Shorts audit covers the actual deck and keeps all content approvals unreviewed', () => {
  const report = inventory();
  assert.equal(report.summary.total, 312);
  assert.deepEqual(report.summary.byLevel, [{level:1,total:180,curated:56,bank:124},{level:2,total:132,curated:70,bank:62}]);
  assert.equal(new Set(report.rows.map(row => row.id)).size, 312);
  assert.equal(report.summary.approved, 0);
  assert.equal(report.summary.distinctQuestionChoiceSets, 186);
  assert.equal(report.summary.redundantRows, 126);
  assert.equal(report.summary.flagged, 15);
  assert.equal(report.exactDuplicateGroups.length, 30);
  assert.equal(report.conflictingAnswerGroups.length, 0);
  for (const row of report.rows) {
    assert.match(row.contentHash, /^[a-f0-9]{64}$/);
    assert.equal(row.overall, 'unreviewed');
    assert.equal(row.decisionSteps, null);
    assert.ok(row.answerIndex >= 0 && row.answerIndex < 4);
    for (const lang of ['ko','ja','en','zh']) {
      assert.equal(row.choices[lang].length, 4);
      assert.equal(row.translationReview[lang], 'unreviewed');
      const duplicate = new Set(row.choices[lang].map(x => x.normalize('NFKC').replace(/\s+/g, ' ').trim())).size !== 4;
      assert.equal(row.flags.includes(`duplicate-choice:${lang}`), duplicate);
    }
  }
});

test('Generated inventory stays current, deterministic and independent of learner storage', () => {
  const report = inventory();
  // VM arrays have different prototypes; compare the serialized audit contract.
  assert.equal(JSON.stringify(report), JSON.stringify(inventory()));
  assert.equal(JSON.stringify(report), JSON.stringify(JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/qa/shorts-inventory.json'), 'utf8'))));
  const item = {level:1,type:'word',term:'학교'};
  assert.equal(curatedId(item), curatedId({...item,index:999,meaning:{ja:'学校'}}));
  assert.notEqual(curatedId(item), curatedId({...item,level:2}));
  assert.equal(curatedId({...item,id:'S04-I-W-SCHOOL-01'}),'S04-I-W-SCHOOL-01');
});
