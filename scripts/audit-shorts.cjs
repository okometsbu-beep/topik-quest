#!/usr/bin/env node
// Read-only runtime inventory. Presence/length checks never certify teaching quality.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const languages = ['ko', 'ja', 'en', 'zh'];
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const normalize = value => String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
const curatedId = item => `SHORT-${item.level}-${hash([item.type, item.term]).slice(0, 16)}`;

function inventory() {
  const sources = ['data/shorts-levels.js', ...[1, 2, 3, 4].map(n => `data/question-bank-v1-part${n}.js`),
    'data/question-bank-practice-v1.js', 'data/explanations-i18n.js', 'question-bank-engine.js', 'topik1.js'];
  const context = { window: {}, console, localStorage: { getItem: () => null, setItem: () => {} } };
  vm.createContext(context);
  for (const file of sources.slice(0, -1)) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  // Execute the actual selector, not a separately maintained copy of its algorithm.
  const source = fs.readFileSync(path.join(root, 'topik1.js'), 'utf8');
  const start = source.indexOf('function shortsOptions('), end = source.indexOf('function shortType(', start);
  if (start < 0 || end < 0) throw new Error('Shorts selector changed: review audit extraction');
  context.SH = { activeLevel: 1, levels: {} };
  context.BANK = context.window.MALBIT_BANK;
  context.shortsDeck = lv => [...context.window.MALBIT_SHORTS_DECKS[lv], ...context.BANK.shorts(lv)];
  vm.runInContext(source.slice(start, end), context);
  const rows = [];
  for (const level of [1, 2]) {
    const deck = context.shortsDeck(level);
    deck.forEach((item, index) => {
      const selected = context.shortsOptions(index, level);
      const original = item.bankId ? context.BANK.byId(item.bankId) : null;
      const choices = Object.fromEntries(languages.map(lang => [lang, selected.items.map(x => item.bankId ? x.label : x.meaning[lang] || x.meaning.ko)]));
      const flags = [];
      for (const lang of languages) {
        if (new Set(choices[lang].map(normalize)).size !== 4) flags.push(`duplicate-choice:${lang}`);
      }
      if (/\*\*/.test(item.term)) flags.push('literal-markdown-in-escaped-term');
      const questionChars = [...item.term].length;
      const maxChoiceChars = Object.fromEntries(languages.map(lang => [lang, Math.max(...choices[lang].map(x => [...x].length))]));
      if (questionChars > 60) flags.push('review-question-length');
      if (Math.max(...Object.values(maxChoiceChars)) > 40) flags.push('review-choice-length');
      rows.push({
        id: item.bankId || curatedId(item), runtimeIndex: index, level,
        source: item.bankId ? 'bank' : 'curated', type: original?.itemType || item.type,
        instructionPrompt: original?.prompt || null,
        sharedInstructionKey: item.bankId ? 'bank-best-answer' : 'curated-closest-meaning',
        repeatedInstructionReview: 'unreviewed',
        objective: original?.targetSkills || null, objectiveReview: 'unreviewed',
        contentHash: hash({ item, choices }), question: item.term, choices,
        answerIndex: selected.correct, questionChars, maxChoiceChars,
        exactGroup: hash([normalize(item.term), choices.ko.map(normalize).sort()]).slice(0, 16),
        // Candidate grouping only: same answer does not establish semantic duplication.
        answerGroup: hash([level, item.type, normalize(choices.ko[selected.correct])]).slice(0, 16),
        explanationFieldPresent: Object.fromEntries(languages.map(lang => [lang, !!item.explanationI18n?.[lang]])),
        meaningFieldPresent: Object.fromEntries(languages.map(lang => [lang, !!item.meaning?.[lang]])),
        flags, decisionSteps: null, suitability: 'unreviewed', answerReview: 'unreviewed',
        explanationReview: 'unreviewed', translationReview: Object.fromEntries(languages.map(lang => [lang, 'unreviewed'])),
        humanReview: 'unreviewed', learnerTiming: 'unmeasured', mobileReview: 'unverified', overall: 'unreviewed'
      });
    });
  }
  const group = key => Object.values(rows.reduce((out, row) => {
    (out[row[key]] ||= []).push(row.id); return out;
  }, {})).filter(ids => ids.length > 1);
  return {
    schemaVersion: 1,
    note: 'Generated structural inventory, not a content approval ledger. IDs for curated rows are audit-only, not a storage migration. Manual verdicts belong in a separate ID + contentHash review record; never edit this generated file.',
    sourceHashes: Object.fromEntries(sources.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')])),
    summary: { total: rows.length, byLevel: [1, 2].map(level => ({ level, total: rows.filter(x => x.level === level).length,
      curated: rows.filter(x => x.level === level && x.source === 'curated').length,
      bank: rows.filter(x => x.level === level && x.source === 'bank').length })),
      distinctQuestionChoiceSets: new Set(rows.map(x => x.exactGroup)).size,
      redundantRows: rows.length - new Set(rows.map(x => x.exactGroup)).size,
      flagged: rows.filter(x => x.flags.length).length, reviewed: 0, approved: 0 },
    conflictingAnswerGroups: group('exactGroup').filter(ids => new Set(rows.filter(x => ids.includes(x.id)).map(x => normalize(x.choices.ko[x.answerIndex]))).size > 1),
    exactDuplicateGroups: group('exactGroup'), sameAnswerCandidateGroups: group('answerGroup'), rows
  };
}
module.exports = { inventory, curatedId, normalize };
if (require.main === module) {
  const result = inventory(), output = path.join(root, 'docs/qa/shorts-inventory.json');
  // One generated row per line keeps corpus diffs reviewable without a 22k-line dump.
  const { rows, ...metadata } = result;
  const serialized = JSON.stringify(metadata, null, 2).slice(0, -2) + ',\n  "rows": [\n' + rows.map(row => '    ' + JSON.stringify(row)).join(',\n') + '\n  ]\n}\n';
  if (process.argv.includes('--write')) {
    fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, serialized);
  } else if (process.argv.includes('--check')) {
    if (fs.readFileSync(output, 'utf8') !== serialized) throw new Error('Shorts inventory stale; regenerate with --write');
  }
  console.log(JSON.stringify(result.summary));
}
