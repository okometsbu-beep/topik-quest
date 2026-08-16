// MALBIT question bank engine v1
(function () {
  'use strict';

  const partRows = Array.isArray(window.MALBIT_QUESTION_BANK_PARTS) ? window.MALBIT_QUESTION_BANK_PARTS.flat() : null;
  const raw = window.MALBIT_QUESTION_BANK_RAW || (partRows ? { version: 1, total: partRows.length, rows: partRows } : null);
  if (!raw || !Array.isArray(raw.rows) || raw.total !== raw.rows.length) {
    console.error('[MALBIT bank] data missing');
    return;
  }

  const SECTION = { l: 'listening', r: 'reading', w: 'writing' };
  const DIFFICULTY = { e: 'easy', m: 'medium', h: 'hard', v: 'very_hard' };
  const RANK = { easy: 1, medium: 2, hard: 3, very_hard: 4 };
  const SYMBOLS = ['①', '②', '③', '④'];
  const SHORT_TYPES = new Set(['vocabulary_blank', 'grammar_blank', 'same_meaning']);
  const NOISY_PROBLEM_HEADER = /^\s*[<〈《][^>〉》\n]{1,100}(?:문장|대화|글)[>〉》]\s*(?:\r?\n|$)/gmu;
  const cleanProblemText = (value) => String(value || '').replace(NOISY_PROBLEM_HEADER, '').trim();
  const ITEM_GROUPS = {
    response: '응답', follow_up: '응답', follow_up_response: '응답', place_identification: '장소',
    topic_identification: '중심', picture_selection: '그림 선택', content_match: '내용', detail_match: '세부',
    long_content_match: '긴 글', reason_purpose: '목적', long_reason: '긴 대화', speaker_purpose: '목적',
    speaker_action: '세부', speaking_method: '말하기 방식', vocabulary_blank: '어휘·문법',
    grammar_blank: '어휘·문법', same_meaning: '어휘', sign_purpose: '표지·안내',
    notice_mismatch: '표지·안내', short_content_match: '짧은 글', main_idea: '중심 내용',
    advanced_main_idea: '중심 내용', main_idea_advanced: '중심 내용', blank_inference: '빈칸',
    sentence_order: '순서', sentence_insertion: '문장 삽입', sentence_insertion_long: '문장 삽입',
    paired_passage: '긴 글', paired_long_passage: '긴 글', practical_text: '실용문',
    practical_information: '실용문', medium_passage_pair: '긴 글', long_passage_pair: '긴 글',
    final_passage_pair: '긴 글', paired_vocabulary_main: '어휘', paired_idiom_main: '숙어',
    narrative_detail: '세부', headline_interpretation: '제목', passage_detail: '세부',
    author_stance: '태도', long_detail_pair: '긴 글', long_inference_pair: '긴 글',
    academic_reasoning: '학술 추론'
  };

  const rows = raw.rows;
  const items = rows.map((row) => ({
    id: row[0], set: Number(row[1]), level: Number(row[2]), section: SECTION[row[3]], no: Number(row[4]),
    itemType: row[5], difficulty: DIFFICULTY[row[6]], difficultyRank: RANK[DIFFICULTY[row[6]]] || 1,
    instruction: cleanProblemText(row[7]), passage: cleanProblemText(row[8]), script: cleanProblemText(row[9]), prompt: cleanProblemText(row[10]), options: row[11],
    answerIndex: row[3] === 'w' ? null : Number(row[12]), acceptedAnswer: row[3] === 'w' ? row[12] : null,
    explanationKo: row[13], explanationJa: row[14], targetSkills: row[15] || [], visual: row[16],
    model: row[17], rubric: row[18], stimulusGroup: row[19] || null
  }));
  const byId = new Map(items.map((item) => [item.id, item]));
  const identity = Object.freeze([0, 1, 2, 3]);

  function cleanOrder(order, count = 4) {
    if (!Array.isArray(order) || order.length !== count) return [...Array(count).keys()];
    const next = order.map(Number);
    return new Set(next).size === count && next.every((value) => value >= 0 && value < count) ? next : [...Array(count).keys()];
  }
  function shuffledOrder(count = 4) {
    const order = [...Array(count).keys()];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    if (count > 1 && order.every((value, index) => value === index)) order.push(order.shift());
    return order;
  }
  function freshOrder(id) {
    const item = byId.get(String(id));
    if (!item || item.section === 'writing') return [];
    const key = `malbitBankAnswerSlot:${item.id}`;
    let previous = item.answerIndex;
    try { const saved = Number(localStorage.getItem(key)); if (Number.isInteger(saved) && saved >= 0) previous = saved; } catch (error) {}
    let order = shuffledOrder(item.options.length), slot = order.indexOf(item.answerIndex), tries = 0;
    while (slot === previous && tries++ < 16) { order = shuffledOrder(item.options.length); slot = order.indexOf(item.answerIndex); }
    if (slot === previous) { order.push(order.shift()); slot = order.indexOf(item.answerIndex); }
    try { localStorage.setItem(key, String(slot)); } catch (error) {}
    return order;
  }
  function recommendedSeconds(item) {
    const chars = `${item.passage || ''}${item.script || ''}${item.prompt || ''}${(item.options || []).join('')}`.length;
    const base = item.section === 'listening' ? 35 : item.section === 'writing' ? (item.no <= 52 ? 180 : item.no === 53 ? 600 : 1800) : 32;
    return Math.max(base, Math.round(base + Math.max(0, chars - 55) * (item.section === 'listening' ? .22 : .16) + item.difficultyRank * 5));
  }
  function present(idOrItem, order) {
    const item = typeof idOrItem === 'string' ? byId.get(idOrItem) : idOrItem;
    if (!item) return null;
    const writing = item.section === 'writing';
    const choiceOrder = writing ? [] : cleanOrder(order, item.options.length);
    const choices = writing ? [] : choiceOrder.map((index) => item.options[index]);
    const answerIndex = writing ? null : choiceOrder.indexOf(item.answerIndex);
    return {
      id: item.id, bankId: item.id, sourceId: item.no, mockSet: item.set, section: item.section,
      itemType: item.itemType, difficulty: item.difficulty, difficultyRank: item.difficultyRank,
      group: ITEM_GROUPS[item.itemType] || item.targetSkills[0] || item.section,
      instruction: item.instruction, stem: item.passage, passage: item.passage, prompt: item.prompt,
      script: item.script, choices, answerIndex, answer: answerIndex == null ? item.acceptedAnswer : SYMBOLS[answerIndex],
      explanation: item.explanationKo, explanationKo: item.explanationKo, explanationJa: item.explanationJa,
      explanationI18n: { ko: item.explanationKo, ja: item.explanationJa }, targetSkills: item.targetSkills,
      visualOptions: item.visual, visualPending: !!item.visual, model: item.model, rubric: item.rubric,
      stimulusGroup: item.stimulusGroup, choiceOrder, recommendedSec: recommendedSeconds(item)
    };
  }
  function filter(options = {}) {
    const level = Number(options.level) === 1 ? 1 : 2;
    const sections = options.sections ? new Set(options.sections) : null;
    const difficulties = options.difficulties ? new Set(options.difficulties) : null;
    const excluded = new Set((options.exclude || []).map(String));
    return items.filter((item) => item.level === level
      && (!sections || sections.has(item.section))
      && (!difficulties || difficulties.has(item.difficulty))
      && (!options.mcqOnly || item.section !== 'writing')
      && (!options.noVisual || !item.visual)
      && !excluded.has(item.id));
  }
  function choose(list) { return list.length ? list[Math.floor(Math.random() * list.length)] : null; }
  function readRecent(key) {
    try { const value = JSON.parse(localStorage.getItem(`malbitBankRecent:${key}`) || '[]'); return Array.isArray(value) ? value.map(String) : []; }
    catch (error) { return []; }
  }
  function remember(key, id, limit = 240) {
    if (!key || !id) return;
    try {
      const next = readRecent(key).filter((value) => value !== String(id));
      next.push(String(id));
      localStorage.setItem(`malbitBankRecent:${key}`, JSON.stringify(next.slice(-limit)));
    } catch (error) {}
  }
  function draw(options = {}) {
    const recentKey = options.recentKey || '';
    const excluded = new Set([...(options.exclude || []).map(String), ...readRecent(recentKey)]);
    let pool = filter({ ...options, exclude: [...excluded] });
    if (!pool.length) pool = filter({ ...options, exclude: options.exclude || [] });
    const item = choose(pool);
    if (item && recentKey) remember(recentKey, item.id, options.recentLimit || 240);
    return item;
  }
  function mock(level, set, section) {
    return items.filter((item) => item.level === Number(level) && item.set === Number(set) && (!section || item.section === section))
      .sort((a, b) => a.no - b.no);
  }
  function nextMockSet(level) {
    const key = `malbitNextMockSet:${Number(level) === 1 ? 1 : 2}`;
    let previous = 0;
    try { previous = Number(localStorage.getItem(key)) || 0; } catch (error) {}
    const next = previous % 12 + 1;
    try { localStorage.setItem(key, String(next)); } catch (error) {}
    return next;
  }
  function stageDifficulties(level, stage) {
    const n = Math.max(1, Math.min(7, Number(stage) || 1));
    if (Number(level) === 1) return [
      ['easy'], ['easy', 'medium'], ['medium'], ['medium', 'hard'], ['hard'], ['hard'], ['hard']
    ][n - 1];
    return [
      ['medium'], ['medium', 'hard'], ['hard'], ['hard', 'very_hard'], ['very_hard'], ['very_hard'], ['very_hard']
    ][n - 1];
  }
  function gamePool(level, stage, exclude = []) {
    let pool = filter({ level, sections: ['listening', 'reading'], difficulties: stageDifficulties(level, stage), mcqOnly: true, noVisual: true, exclude });
    if (pool.length < 20) pool = filter({ level, sections: ['listening', 'reading'], mcqOnly: true, noVisual: true, exclude });
    return pool;
  }
  function shorts(level) {
    const maxChars = Number(level) === 1 ? 150 : 180;
    return items.filter((item) => item.level === Number(level) && SHORT_TYPES.has(item.itemType) && item.section !== 'writing'
      && !item.visual && `${item.passage}${item.prompt}`.length <= maxChars)
      .map((item) => ({
        type: item.itemType === 'grammar_blank' ? 'grammar' : 'word', bankId: item.id,
        term: [item.passage, item.prompt].filter(Boolean).join('\n'), choices: item.options,
        answerIndex: item.answerIndex, explanationKo: item.explanationKo, explanationJa: item.explanationJa,
        difficulty: item.difficulty, targetSkills: item.targetSkills
      }));
  }
  function toTopik2Legacy(item) {
    const q = present(item, identity);
    if (item.section === 'listening') return {
      ...q, id: item.no, prompt: item.prompt, choices: item.options, answerIndex: item.answerIndex,
      answer: SYMBOLS[item.answerIndex], script: item.script, instruction: item.instruction,
      recommendedSec: recommendedSeconds(item), scriptJa: '', bankId: item.id
    };
    if (item.section === 'writing') return {
      ...q, id: item.no, section: 'writing', stem: [item.passage, item.prompt].filter(Boolean).join('\n\n'),
      model: item.model || '', min: item.no <= 52 ? 3 : item.no === 53 ? 180 : 500,
      max: item.no <= 52 ? 100 : item.no === 53 ? 300 : 800, bankId: item.id
    };
    return {
      ...q, id: item.no, stem: [item.passage, item.prompt].filter(Boolean).join('\n\n'), choices: item.options,
      answerIndex: item.answerIndex, answer: SYMBOLS[item.answerIndex], categoryKo: q.group,
      categoryJa: q.group, translation: '', grammar: item.targetSkills.join(' · '), vocab: '',
      why: item.explanationJa || item.explanationKo, bankId: item.id
    };
  }
  function activateTopik2Set(set, listeningTarget, readingWritingTarget) {
    if (!Array.isArray(listeningTarget) || !Array.isArray(readingWritingTarget)) return false;
    const listening = mock(2, set, 'listening').map(toTopik2Legacy);
    const reading = mock(2, set, 'reading').map(toTopik2Legacy);
    const writing = mock(2, set, 'writing').map(toTopik2Legacy);
    if (listening.length !== 50 || reading.length !== 50 || writing.length !== 4) return false;
    listeningTarget.splice(0, listeningTarget.length, ...listening);
    readingWritingTarget.splice(0, readingWritingTarget.length, ...reading, ...writing);
    return true;
  }

  window.MALBIT_BANK = Object.freeze({
    version: raw.version, total: items.length, items, byId: (id) => byId.get(String(id)) || null,
    present, filter, draw, remember, readRecent, mock, nextMockSet, gamePool, stageDifficulties,
    shorts, shuffledOrder, freshOrder, cleanOrder, recommendedSeconds, activateTopik2Set,
    stats: Object.freeze({ total: items.length, topik1: items.filter((item) => item.level === 1).length, topik2: items.filter((item) => item.level === 2).length })
  });
})();
