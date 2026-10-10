const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');

const repairs = import('../scripts/build-question-bank.mjs');
const context = vm.createContext({ window: {} });
for (let part = 1; part <= 4; part++) {
  vm.runInContext(fs.readFileSync(`data/question-bank-v1-part${part}.js`, 'utf8'), context);
}
const rows = JSON.parse(JSON.stringify(context.window.MALBIT_QUESTION_BANK_PARTS.flat()));
const audioRepairPlan = JSON.parse(fs.readFileSync('docs/qa/generated-korean-audio-repairs-v165.json', 'utf8'));
const unpack = row => ({
  id: row[0], mock_set: row[1], level: row[2] === 1 ? 'TOPIK I' : 'TOPIK II',
  section: { l: 'listening', r: 'reading', w: 'writing' }[row[3]], question_no: row[4],
  item_type: row[5], difficulty: { e: 'easy', m: 'medium', h: 'hard', v: 'very_hard' }[row[6]],
  instruction: row[7], passage: row[8], audio_script: row[9], prompt: row[10], options: row[11],
  answer: row[3] === 'w' ? row[12] : row[12] + 1, explanation_ko: row[13],
  explanation_ja: row[14], target_skills: row[15], visual_asset_prompt: row[16],
  model_answer: row[17], rubric: row[18], stimulus_group: row[19]
});

test('particle helper selects final-syllable batchim, including the ㄹ + 로 exception', async () => {
  const { withKoreanParticle } = await repairs;
  const examples = [
    ['학교', '은', '학교는'], ['책', '는', '책은'],
    ['원격 근무', '을', '원격 근무를'], ['학교 급식', '를', '학교 급식을'],
    ['지역 화폐', '이', '지역 화폐가'], ['생활 체육', '가', '생활 체육이'],
    ['수리 문화', '과', '수리 문화와'], ['수면과 학습', '와', '수면과 학습과'],
    ['서울', '으로', '서울로'], ['길', '로', '길로'],
    ['학교', '으로', '학교로'], ['집', '로', '집으로']
  ];
  for (const [noun, particle, expected] of examples) assert.equal(withKoreanParticle(noun, particle), expected);
  for (const noun of ['', 'ABC', '123']) assert.throws(() => withKoreanParticle(noun, '은'));
  assert.throws(() => withKoreanParticle('학교', 'not-a-particle'));
});

test('all 44 reviewed template noun slots use the common helper without rewriting Korean stems/endings', async () => {
  const { generatedNounPhrases, repairGeneratedParticles, withKoreanParticle } = await repairs;
  assert.equal(generatedNounPhrases.length, 44);
  assert.equal(new Set(generatedNounPhrases).size, 44);
  for (const noun of generatedNounPhrases) {
    for (const particle of ['은', '는', '을', '를', '이', '가', '과', '와', '으로', '로']) {
      assert.equal(repairGeneratedParticles(`“${noun}${particle} 테스트”`), `“${withKoreanParticle(noun, particle)} 테스트”`);
    }
  }
  const nonParticles = '있는, 없는, 맞는, 받는, 겪는, 지은, 평가, 전문가, 참가, 증가, 가까이';
  assert.equal(repairGeneratedParticles(nonParticles), nonParticles);
  assert.equal(repairGeneratedParticles('원격 근무을 둘러싼 논의. 지역 화폐은 정책 평가와 관계가 없다.'),
    '원격 근무를 둘러싼 논의. 지역 화폐는 정책 평가와 관계가 없다.');
  assert.equal(repairGeneratedParticles('자료에 따르면 전자책 대출 건수은 증가했다. 사진 찍기을 시작했다.'),
    '자료에 따르면 전자책 대출 건수는 증가했다. 사진 찍기를 시작했다.');
});

test('four scene families retain their keys and describe only the dialogue-supported action', async () => {
  const { pictureSelectionRepairs } = await repairs;
  const scenes = rows.filter(row => row[5] === 'picture_selection');
  assert.equal(scenes.length, 24);
  assert.equal(pictureSelectionRepairs.length, 4);
  for (const rule of pictureSelectionRepairs) {
    const family = scenes.filter(row => row[9].includes(rule.evidence));
    assert.equal(family.length, 6, rule.evidence);
    for (const row of family) {
      assert.equal(row[11][row[12]], rule.options[0][1], row[0]);
      assert.deepEqual(row[16], row[11], `${row[0]} visual descriptions match choice order`);
      assert.doesNotMatch(row[11].join(' '), /남자|여자/u, `${row[0]} does not infer gender from names`);
      assert.match(row[13], /(?:상황|장면|의도)/u);
      assert.equal(row[13], `정답은 ${row[12] + 1}입니다. ${rule.ko}`);
      assert.equal(row[14], `正解は${row[12] + 1}番です。${rule.ja}`);
    }
  }
});

test('five action families distinguish a request or intention from completed/ongoing execution', async () => {
  const { speakerActionRepairs } = await repairs;
  const actions = rows.filter(row => row[5] === 'speaker_action');
  assert.equal(actions.length, 60);
  assert.equal(speakerActionRepairs.length, 5);
  for (const rule of speakerActionRepairs) {
    const family = actions.filter(row => row[9].includes(rule.evidence));
    assert.equal(family.length, 12, rule.evidence);
    assert.equal(new Set(family.map(row => row[1])).size, 12);
    for (const row of family) {
      assert.equal(row[11][row[12]], rule.corrected, row[0]);
      assert.equal(row[7], '다음을 듣고 대화 상황으로 가장 알맞은 것을 고르십시오.');
      assert.equal(row[10], '대화에 나타난 상황으로 가장 알맞은 것을 고르십시오.');
      assert.equal(row[13], `정답은 ${row[12] + 1}입니다. ${rule.ko}`);
      assert.equal(row[14], `正解は${row[12] + 1}番です。${rule.ja}`);
    }
  }
});

test('regeneration preserves all 2,088 IDs, ordering, taxonomy and keys with only 21 reviewed audio-script changes', () => {
  assert.equal(rows.length, 2088);
  const audioRepairs = new Map(audioRepairPlan.script_repairs.flatMap(repair => repair.question_ids.map(id => [id, repair])));
  assert.equal(audioRepairs.size, 21);
  const signature = rows.map(row => {
    const repair = audioRepairs.get(row[0]);
    if (repair) assert.equal(row[9], repair.corrected, `${row[0]} uses precisely the reviewed audio correction`);
    // Normalize only the authorized corrections back to the pre-review text;
    // all other scripts and every stable key must still match the old signature.
    return [row[0], row[1], row[2], row[3], row[4], row[5], row[6], repair ? repair.old : row[9], row[12]];
  });
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(signature)).digest('hex'),
    '7f1aac55a89f37d4b1bccc12740eb1df1506d417770655283e3e9c4d09ec75dd');
  for (const row of rows.filter(row => row[3] !== 'w')) assert.equal(new Set(row[11]).size, 4, row[0]);
  const manifest = JSON.parse(fs.readFileSync('data/question-bank-manifest.json', 'utf8'));
  assert.equal(manifest.total_items, 2088);
  assert.ok(manifest.source_provenance, 'manifest identifies imported versus reconstructed source provenance');
  for (const output of manifest.outputs) {
    const bytes = fs.readFileSync(output.file);
    assert.equal(bytes.length, output.bytes);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), output.sha256);
  }
});

test('ten bounded audio source repairs match the corpus handoff and remain idempotent', async () => {
  const { repairListeningScript } = await import('../scripts/lib/listening-script-repairs.mjs');
  const { repairGeneratedParticles } = await repairs;
  assert.equal(audioRepairPlan.corpus_repairs.length, 10);
  assert.equal(audioRepairPlan.hobby_semantic_repair.question_ids.length, 12);
  for (const repair of audioRepairPlan.corpus_repairs) {
    assert.equal(repairListeningScript(repair.old), repair.corrected, repair.old_id);
    assert.equal(repairListeningScript(repair.corrected), repair.corrected, repair.old_id);
    assert.equal(crypto.createHash('sha256').update(repair.corrected).digest('hex').slice(0, 16), repair.new_id);
  }
  for (const row of rows.filter(row => row[3] === 'l')) assert.equal(repairGeneratedParticles(row[9]), row[9], row[0]);
});

test('the source repairs are idempotent for every generated row and leave no known malformed written noun slots', async () => {
  const { repairGeneratedKoreanItem, repairGeneratedParticles } = await repairs;
  for (const row of rows) {
    const item = unpack(row);
    assert.deepEqual(repairGeneratedKoreanItem(item), item, row[0]);
    const written = [row[7], row[10], row[11], row[13], row[14], row[16], row[17], row[18]];
    if (row[3] !== 'l') written.push(row[8]);
    assert.deepEqual(repairGeneratedParticles(written), written, row[0]);
  }
});
