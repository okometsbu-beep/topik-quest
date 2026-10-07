const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const KEY = 'harumalWritingCurriculumV1';
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
const text = html => html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&');
const title = html => text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '');
const style = () => { const values = new Map(); return { setProperty: (key, value) => values.set(key, String(value)), removeProperty: key => values.delete(key), getPropertyValue: key => values.get(key) || '' }; };
const classList = () => { const names = new Set(); return { add: (...keys) => keys.forEach(key => names.add(key)), remove: (...keys) => keys.forEach(key => names.delete(key)), contains: key => names.has(key), toggle(key, force) { const yes = force == null ? !names.has(key) : force; if (yes) names.add(key); else names.delete(key); return yes; } }; };

function boot(locale = 'ko', seed = {}) {
  const values = new Map(Object.entries(seed)), events = {}, viewportEvents = {}, documentEvents = {}, frames = [];
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
  const nodes = Object.fromEntries(['wcSaveState', 'wcHelpState', 'wcInlineError'].map(id => [id, { textContent: '' }]));
  const screen = { innerHTML: '', dataset: {}, style: style(), classList: classList(), querySelector: () => null };
  const body = { style: style(), classList: classList() }, root = { style: style(), classList: classList(), clientHeight: 844 };
  let tick = 0;
  class FixedDate extends Date { constructor(...args) { super(...(args.length ? args : [Date.parse('2026-10-10T12:00:00Z') + tick++])); } static now() { return Date.parse('2026-10-10T12:00:00Z') + tick++; } }
  const add = target => (name, fn) => (target[name] ||= []).push(fn);
  const c = { console, Date: FixedDate, S: { view: 'writingCourse', lang: locale }, localStorage: storage, innerHeight: 844, innerWidth: 390,
    visualViewport: { height: 844, width: 390, offsetTop: 0, addEventListener: add(viewportEvents) },
    document: { body, documentElement: root, activeElement: null, getElementById: id => id === 'screen' ? screen : nodes[id] || null, querySelector: () => null, addEventListener: add(documentEvents) },
    history: { state: {}, replaceState(value) { this.state = plain(value); }, pushState(value) { this.state = plain(value); } },
    addEventListener: add(events), requestAnimationFrame: fn => { frames.push(fn); return frames.length; }, cancelAnimationFrame() {}, setTimeout: fn => { frames.push(fn); return frames.length; }, clearTimeout() {}, scrollTo() {}, scrollBy() {}, render() {},
    getComputedStyle: () => ({ display: 'block', visibility: 'visible', height: '80px', paddingBottom: '0px' }),
    setView(view) { c.S.view = view; c.render(); }
  };
  c.window = c; vm.createContext(c);
  for (const file of ['data/writing-curriculum.js', 'data/writing-curriculum-locales.js', 'writing-curriculum-i18n.js', 'writing-curriculum-engine.js', 'writing-curriculum.js']) vm.runInContext(read(file), c, { filename: file });
  return { c, E: c.HARUMAL_WRITING.engine, data: c.HARUMAL_WRITING_DATA, values, screen, events, viewportEvents, documentEvents, root, body,
    go(page, id = '') { c.harumalWritingGo(page, id); return screen.innerHTML; },
    flush() { let count = 0; while (frames.length && count++ < 100) frames.shift()(); assert.ok(count < 100, 'layout work settles'); }
  };
}

function submit(env, id, answer) {
  const item = env.E.itemById(id), value = answer ?? (item.kind === 'relation' ? item.evaluation.correctChoiceId : item.models[0]);
  env.c.harumalWritingDraft(id, value); env.c.harumalWritingSubmit(id);
  return env.E.getState().attempts.filter(attempt => attempt.itemId === id).at(-1);
}
function finishStage(env, group) {
  for (const id of group.itemIds) { submit(env, id); env.c.harumalWritingContinue(id); }
  assert.deepEqual(plain(env.E.getState().route), { page: 'stage-done', groupId: group.id });
}
function finishCore(env) {
  env.c.harumalWritingBegin();
  for (const group of env.data.groups.filter(group => !group.delayedOnly)) { finishStage(env, group); env.c.harumalWritingContinue(group.id); }
  assert.equal(env.E.guidedProgress().complete, true);
}
function evidence(env) {
  const s = env.E.getState();
  return plain({ attempts: s.attempts, drafts: s.drafts, readiness: s.readiness, firstIndependentAt: s.firstIndependentAt, guided: s.guided });
}
function assertPrimary(html, action) {
  assert.match(html, /class="[^"]*\bwcPrimaryAction\b/);
  assert.equal((html.match(/class="[^"]*\bwcPrimaryAction\b/g) || []).length, 1, 'one fixed action per task');
  assert.ok(html.includes(`onclick="${action}"`), `primary action ${action} exists`);
}

test('P01 observes simple and positive progressive present forms without claiming meaning mastery', () => {
  const env = boot(), item = env.E.itemById('P01');
  for (const answer of ['저는 도서관에서 공부해요.', '도서관에서 공부를 해요.', '저는 도서관에서 공부하고 있어요.', '도서관에서 공부를 하고 있어요.', '도서관에서\n공부하고 있어요']) {
    const result = env.c.HARUMAL_WRITING_ENGINE.evaluate(item, answer);
    assert.equal(result.status, 'components_observed', answer);
    assert.equal(result.meaning, 'unreviewed', answer);
  }
  for (const answer of ['도서관에서 공부 안 해요.', '도서관에서 공부하지 않아요.', '도서관에서 공부 못 해요.', '도서관에 공부해요.', '도서관에서 공부했어요.']) {
    assert.notEqual(env.c.HARUMAL_WRITING_ENGINE.evaluate(item, answer).status, 'components_observed', answer);
  }
});

test('probe headings match current action, separate sentences, choices and yesterday in every locale', () => {
  for (const locale of ['ko', 'ja', 'en', 'zh']) {
    const env = boot(locale), headings = {};
    const generic = text(env.c.HARUMAL_WRITING.localeText('두 사실의 뜻을<br>그대로 이어 써요'));
    for (const id of ['P01', 'P02', 'P03', 'P04', 'P05', 'P06']) {
      headings[id] = title(env.go('item', id));
      assert.ok(headings[id], `${locale} ${id}: heading exists`);
      assert.notEqual(headings[id], generic, `${locale} ${id}: does not say to join two sentences`);
      assert.equal(/class="wcChoices"/.test(env.screen.innerHTML), ['P03', 'P04', 'P05'].includes(id));
      assert.equal(/id="wcAnswer"/.test(env.screen.innerHTML), ['P01', 'P02', 'P06'].includes(id));
    }
    assert.notEqual(headings.P01, headings.P02, `${locale}: one current action and two separate sentences have distinct headings`);
    assert.notEqual(headings.P02, headings.P03, `${locale}: choosing a meaning is a different task`);
    assert.notEqual(headings.P01, headings.P06, `${locale}: yesterday has its own heading`);
    assert.match(env.go('item', 'P02'), new RegExp(env.c.HARUMAL_WRITING.localeText(env.E.itemById('P02').promptKo).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.equal(title(env.go('item', 'R01')), generic, `${locale}: real reason-joining task retains its appropriate heading`);
  }
});

test('one primary action follows item, feedback and earned stage completion without premature unlocks', () => {
  const env = boot(); env.c.harumalWritingBegin();
  assertPrimary(env.screen.innerHTML, "harumalWritingSubmit('P01')");
  submit(env, 'P01', '저는 도서관에서 공부하고 있어요.');
  assertPrimary(env.screen.innerHTML, "harumalWritingContinue('P01')");
  assert.equal(env.E.guidedProgress().unlockedIds.includes('form-aseo'), false);
  env.c.harumalWritingContinue('P01');
  for (const id of env.data.groups[0].itemIds.slice(1)) { submit(env, id); env.c.harumalWritingContinue(id); }
  assertPrimary(env.screen.innerHTML, "harumalWritingContinue('probe-basics')");
  assert.equal(env.E.guidedProgress().unlockedIds.includes('form-aseo'), false);
  env.c.harumalWritingContinue('probe-basics');
  assert.equal(env.E.getState().route.itemId, 'R01');
  assert.equal(env.E.guidedProgress().unlockedIds.includes('form-aseo'), true);
});

test('feedback keeps uncertainty visible while the long repeated explanation starts collapsed', () => {
  for (const locale of ['ko', 'ja', 'en', 'zh']) for (const [id, answer] of [['P01', '도서관에서 공부하고 있어요.'], ['R01', '일이 많아요서 늦게 퇴근해요.'], ['P03', 'work']]) {
    const env = boot(locale); env.go('item', id); submit(env, id, answer);
    const html = env.screen.innerHTML, details = html.match(/<details\b([^>]*\bwcAssessmentDetails\b[^>]*)>([\s\S]*?)<\/details>/);
    assert.ok(details, `${locale} ${id}: expandable assessment explanation`);
    assert.doesNotMatch(details[1], /\bopen(?:\s|=|$)/, `${locale} ${id}: not expanded by default`);
    assert.match(details[2], /<summary\b/);
    assert.match(html.replace(details[0], ''), /class="[^"]*\bwcAssessmentNote\b[^\"]*"[^>]*>[^<]+</, `${locale} ${id}: short notice is outside the disclosure`);
    assert.ok(details[2].includes(env.c.HARUMAL_WRITING.localeText('자동 규칙 확인, 자기점검, 사람의 의미 검토를 구분해요. 전체 문장의 정답이나 숙달 판정이 아니에요.')));
    assert.equal(env.E.evidence().meaningReviewed, 0);
  }
});

test('completed-course last answer opens the actual latest attempt rather than the statistics page', () => {
  const env = boot('en'); finishCore(env);
  const latest = submit(env, 'P01', '저는 지금 도서관에서 공부하고 있어요.');
  env.go('course'); const before = evidence(env);
  assert.match(env.screen.innerHTML, /harumalWritingLastAnswer\(\)/);
  env.c.harumalWritingLastAnswer();
  assert.deepEqual(plain(env.E.getState().route), { page: 'answer', attemptId: latest.id });
  assert.ok(env.screen.innerHTML.includes(latest.text));
  assert.ok(env.screen.innerHTML.includes(`data-attempt-id="${latest.id}"`));
  assert.doesNotMatch(env.screen.innerHTML, /class="wcEvidenceCards"/);
  assert.deepEqual(evidence(env), before, 'reviewing a saved answer does not alter progress or evidence');
});

test('exact saved-answer route survives new revisions, locale switches, reload and browser Back', () => {
  const env = boot(); env.c.harumalWritingBegin();
  const first = submit(env, 'P01', '도서관에서 공부해요.');
  env.go('course'); const pointer = plain(env.E.guidedProgress().route);
  env.go('answer', first.id);
  const route = plain(env.E.getState().route);
  const newer = env.E.submit('P01', '저는 지금 도서관에서 공부하고 있어요.').attempt;
  for (const locale of ['ja', 'en', 'zh', 'ko']) {
    env.c.S.lang = locale; env.c.HARUMAL_WRITING.render();
    assert.ok(env.screen.innerHTML.includes(first.text));
    assert.ok(!env.screen.innerHTML.includes(newer.text), `${locale}: answer route must not drift to the latest revision`);
    assert.deepEqual(plain(env.E.getState().route), route);
  }
  const saved = Object.fromEntries(env.values), restored = boot('en', saved);
  restored.c.render();
  assert.deepEqual(plain(restored.E.getState().route), route);
  assert.ok(restored.screen.innerHTML.includes(first.text));
  restored.go('records');
  // Use the real public history property, not a guessed item route.
  for (const listener of restored.events.popstate || []) listener({ state: { harumalWritingRoute: route, harumalWritingGuided: false } });
  assert.deepEqual(plain(restored.E.getState().route), route);
  assert.ok(restored.screen.innerHTML.includes(first.text));
  assert.deepEqual(plain(restored.E.guidedProgress().route), pointer);
  assert.equal(restored.E.getState().attempts.length, 2);
});

test('saved-answer review escapes learner text and safely handles missing IDs', () => {
  const env = boot(), malicious = '</p><img src=x onerror=alert(1)>';
  const attempt = env.E.submit('P01', malicious).attempt;
  env.go('answer', attempt.id);
  assert.doesNotMatch(env.screen.innerHTML, /<img src=x/);
  assert.match(env.screen.innerHTML, /&lt;img/);
  const before = evidence(env);
  env.go('answer', 'missing-attempt');
  assert.doesNotMatch(env.screen.innerHTML, />undefined<|>null</);
  assert.deepEqual(evidence(env), before);
});

test('visual viewport resize and focus hooks keep layout responsive without writing learner records', () => {
  const env = boot(); env.go('item', 'P01');
  assert.equal(typeof env.c.HARUMAL_WRITING.updateActionLayout, 'function');
  assert.ok(env.viewportEvents.resize?.length, 'real visualViewport resize listener registered');
  assert.ok((env.documentEvents.focusin || env.events.focusin)?.length, 'focus listener registered');
  const bar = { getBoundingClientRect: () => ({ height: 78 }) };
  let inputTop = 500;
  const input = { tagName: 'TEXTAREA', getBoundingClientRect: () => ({ top: inputTop, bottom: inputTop + 180, height: 180 }) };
  env.screen.querySelector = selector => selector === '.wcPrimaryAction' ? bar : null;
  env.c.document.querySelector = selector => selector === '.bottom' ? { getBoundingClientRect: () => ({ top: 760, height: 84 }) } : null;
  env.c.scrollBy = options => { inputTop -= options.top; };
  env.c.HARUMAL_WRITING.render(); env.flush();
  const before = env.values.get(KEY);
  env.c.HARUMAL_WRITING.updateActionLayout();
  assert.equal(env.screen.style.getPropertyValue('--wc-action-bottom'), '92px', 'normal action leaves room for navigation');
  assert.ok(parseFloat(env.screen.style.getPropertyValue('--wc-action-space')) >= 170, 'normal scroll space includes action and navigation');
  env.c.document.activeElement = input;
  env.c.visualViewport.height = 420;
  for (const listener of env.viewportEvents.resize) listener();
  env.flush();
  assert.equal(env.body.classList.contains('wcKeyboardOpen'), true);
  assert.equal(env.screen.style.getPropertyValue('--wc-action-bottom'), '432px', 'action clears the keyboard inset');
  assert.ok(parseFloat(env.screen.style.getPropertyValue('--wc-action-space')) >= 432 + 78, 'short lessons need scroll space for both the overlaid keyboard and action bar');
  assert.ok(inputTop >= 0 && inputTop + 180 <= 420 - 78 - 8, 'typing stays above the action');
  env.c.document.activeElement = null;
  for (const listener of env.documentEvents.focusout || []) listener();
  env.flush();
  assert.equal(env.body.classList.contains('wcKeyboardOpen'), false, 'keyboard-specific navigation hiding ends on blur');
  assert.equal(env.screen.style.getPropertyValue('--wc-action-bottom'), '92px');
  assert.equal(env.values.get(KEY), before, 'viewport layout changes never modify learner storage');
});

test('stylesheet reserves scroll space, fixes the action above navigation and does not truncate the language label', () => {
  const css = read('writing-curriculum.css');
  assert.match(css, /\.wcPrimaryAction[^{}]*\{[^}]*position\s*:\s*fixed/);
  assert.match(css, /--wc-action-bottom/);
  assert.match(css, /--wc-action-space/);
  assert.match(css, /scroll-padding-(?:bottom|block-end)/);
  assert.match(css, /wcKeyboardOpen[^{}]*\.(?:nav|bottom)[^{}]*\{[^}]*(?:display\s*:\s*none|visibility\s*:\s*hidden)/);
  assert.match(css, /\.wcLanguage[^{}]*\{[^}]*(?:flex(?:-shrink)?\s*:\s*0|width\s*:)/);
  const env = boot('en');
  assert.match(env.go('course'), /value="en" selected>English<\/option>/);
});
