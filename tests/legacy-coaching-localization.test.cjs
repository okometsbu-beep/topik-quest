const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const read = file => fs.readFileSync(file, 'utf8');
function part(file, start, end) {
  const source = read(file), from = source.indexOf(start), to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `${file}: renderer extraction boundaries`);
  return source.slice(from, to);
}
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
function boot() {
  const c = { console, S: { lang: 'ko' }, localStorage: { getItem: () => null, setItem() {} }, esc: escape, E: escape };
  c.window = c;
  c.ml = c.T = (ko, ja, en, zh) => ({ ko, ja, en, zh }[c.S.lang] || ko);
  vm.createContext(c);
  for (const file of [
    ...[1, 2, 3, 4].map(n => `data/question-bank-v1-part${n}.js`),
    'data/question-bank-practice-v1.js', 'data/explanations-i18n.js',
    'data/legacy-answer-repairs-v1.js', 'question-bank-engine.js'
  ]) vm.runInContext(read(file), c);
  vm.runInContext(part('learning-features.js', 'const I18N=', '// ----- Persistent wrong-answer review -----'), c);
  c.MALBIT_LEARNING = { authoredCoach: c.authoredCoach, authoredCoaching: c.authoredCoaching };
  vm.runInContext(part('topik1.js', 'function explainText(', 'async function fileAudio('), c);
  vm.runInContext(part('learning-features.js', 'function reviewExamBlocked(){', 'function syncReviewRewardHelp('), c);
  vm.runInContext(part('learning-features.js', 'async function detailedReviewExplanation(', 'function activeReviewItems('), c);
  return c;
}
const permutations = values => values.length
  ? values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index)).map(rest => [value, ...rest]))
  : [[]];

test('M03-II-R-33 keeps reviewed selected-locale coaching in every shuffle and rendering path', async () => {
  const c = boot();
  for (const lang of ['ko', 'ja', 'en', 'zh']) {
    c.S.lang = lang;
    for (const order of permutations([0, 1, 2, 3])) {
      const q = c.MALBIT_BANK.present('M03-II-R-33', order);
      const htmls = [
        c.explanationBlock('read', q), c.gameTutorMarkup(q, 0),
        await c.detailedReviewExplanation({ type: 'read', level: 2 }, q)
      ];
      for (const html of htmls) {
        for (const field of ['reason', 'trap', 'strategy']) assert.ok(html.includes(escape(q.coach[lang][field])), `${lang}: ${field}`);
        for (const choice of q.choices) assert.ok(html.includes(escape(q.coach[lang].choices[choice])), `${lang}: ${choice}`);
        assert.ok(html.includes(`<li class="right"><b>${q.answerIndex + 1}. ${escape(q.choices[q.answerIndex])}</b>`));
        if (lang !== 'en') assert.ok(!html.includes(escape(q.coach.en.reason)), `${lang}: no English substitution`);
        assert.doesNotMatch(html, /shown in Korean|韩语原文解析/);
      }
    }
  }
});

test('partial P01 source coaching does not override existing English or Chinese explanations', async () => {
  const c = boot();
  for (const lang of ['en', 'zh']) {
    c.S.lang = lang;
    for (const id of ['P01-I-L-01', 'P01-II-R-28']) {
      const q = c.MALBIT_BANK.present(id, [0, 1, 2, 3]), type = q.section === 'listening' ? 'listen' : 'read';
      assert.equal(c.authoredCoaching(q), '');
      const htmls = [c.explanationBlock(type, q), c.gameTutorMarkup(q, 0), await c.detailedReviewExplanation({ type, level: id.includes('-II-') ? 2 : 1 }, q)];
      assert.ok(htmls[0].includes(escape(q.explanationI18n[lang])));
      for (const html of htmls) {
        assert.ok(!html.includes(escape(q.coach.ko.reason)), `${id}/${lang}: no partial Korean override`);
        assert.doesNotMatch(html, /shown in Korean|韩语原文解析/);
      }
    }
  }
});
