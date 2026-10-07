const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { console };
context.window = context;
vm.createContext(context);
for (const file of ['data/writing-curriculum.js', 'writing-curriculum-engine.js']) vm.runInContext(source(file), context);
const engine = context.HARUMAL_WRITING_ENGINE;
const data = context.HARUMAL_WRITING_DATA;
const anchor = Date.parse('2026-10-07T09:00:00Z');
const answer = '공원이 넓어서 여기에서 산책해요.';

function memoryStorage(initial) {
  const values = new Map(initial == null ? [] : [[engine.KEY, initial]]);
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
}
function open(storage, clock = () => anchor) { return engine.create(storage, data, clock); }
function importState(storage, active, incoming) {
  storage.setItem(engine.KEY, active.mergeImport(JSON.stringify(incoming)));
  return open(storage);
}
function ui(initial) {
  const screen = { dataset: {}, innerHTML: '', querySelector: () => null };
  const storage = memoryStorage(JSON.stringify(initial));
  const c = {
    console, S: { view: 'writingCourse', lang: 'ko' }, localStorage: storage,
    document: { getElementById: id => id === 'screen' ? screen : null, body: { classList: { add() {}, remove() {} } } },
    history: { state: {}, pushState() {}, replaceState() {} }, addEventListener() {}, scrollTo() {},
    setView(view) { c.S.view = view; c.render(); }, render() {}
  };
  c.window = c;
  vm.createContext(c);
  for (const file of ['data/writing-curriculum.js', 'writing-curriculum-engine.js', 'writing-curriculum.js']) vm.runInContext(source(file), c);
  return { c, screen, storage };
}
const decodeAttribute = value => value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
function exerciseHandlers(rendered, prefix) {
  const handlers = [...rendered.screen.innerHTML.matchAll(/onclick="([^"]*)"/g)].map(match => decodeAttribute(match[1]));
  for (const handler of handlers.filter(value => value.startsWith(prefix))) vm.runInContext(handler, rendered.c);
}

test('writing review: stale-tab navigation preserves another tab’s drafts and attempts', () => {
  const storage = memoryStorage(), first = open(storage), stale = open(storage);
  first.setDraft('I01', answer);
  first.submit('I01');
  first.setDraft('R02', '날씨가 좋아서 공원에 가요.');
  stale.route({ page: 'unit' });
  const state = open(storage).getState();
  assert.equal(state.attempts.length, 1);
  assert.equal(state.drafts.I01.text, answer);
  assert.equal(state.drafts.R02.text, '날씨가 좋아서 공원에 가요.');
});

test('writing review: stale-tab submit preserves earlier first evidence and creates a revision', () => {
  const storage = memoryStorage(), first = open(storage), stale = open(storage, () => anchor + 1000);
  first.submit('I01', answer);
  const result = stale.submit('I01', '공원이 넓어서 공원에서 산책해요.');
  assert.equal(result.attempt.mode, 'revision');
  const restored = open(storage);
  assert.equal(restored.getState().attempts.length, 2);
  assert.equal(restored.evidence().independent, 1);
});

test('writing review: stale-tab edits cannot erase another tab’s help exposure', () => {
  const storage = memoryStorage(), first = open(storage), stale = open(storage, () => anchor + 1000);
  first.help('I01', 'meaning');
  stale.setDraft('I01', answer);
  const result = stale.submit('I01');
  assert.equal(result.attempt.helpUsed, true);
  assert.equal(result.attempt.mode, 'practice');
  assert.equal(open(storage).draft('I01').helpOpened, true);
});

test('writing review: stale-tab help opening cannot overwrite another tab’s newer draft', () => {
  const storage = memoryStorage(), first = open(storage), stale = open(storage, () => anchor + 1000);
  first.setDraft('I01', answer);
  stale.help('I01', 'meaning');
  const draft = open(storage).draft('I01');
  assert.equal(draft.text, answer);
  assert.equal(draft.helpOpened, true);
});

test('writing review: newer imported draft text does not erase help and model exposure', () => {
  let time = anchor;
  const storage = memoryStorage(), active = open(storage, () => time);
  active.setDraft('I01', answer);
  active.help('I01', 'meaning');
  active.submit('R01', '일이 많아서 늦게 퇴근해요.');
  active.revealModel('R01');
  const incoming = JSON.parse(storage.getItem(engine.KEY));
  incoming.drafts.I01 = { text: '공원이 넓어서 공원에서 산책해요.', helpOpened: false, modelViewed: false, updatedAt: new Date(anchor + 1000).toISOString() };
  incoming.drafts.R01 = { text: '새 초고', helpOpened: false, modelViewed: false, updatedAt: new Date(anchor + 1000).toISOString() };
  const restored = importState(storage, active, incoming);
  assert.equal(restored.draft('I01').text, incoming.drafts.I01.text);
  assert.equal(restored.draft('I01').helpOpened, true);
  assert.equal(restored.draft('R01').modelViewed, true);
  assert.equal(restored.submit('I01').attempt.mode, 'practice');
});

test('writing review: importing two devices’ first answers counts one new item', () => {
  const leftStorage = memoryStorage(), left = open(leftStorage);
  const rightStorage = memoryStorage(), right = open(rightStorage, () => anchor + 1000);
  left.submit('I01', answer);
  right.submit('I01', '공원이 넓어서 공원에서 산책해요.');
  const restored = importState(leftStorage, left, right.getState());
  assert.equal(restored.getState().attempts.length, 2, 'both learner answers remain recoverable');
  assert.equal(restored.evidence().independent, 1, 'two devices cannot turn one item into two new items');
});

test('writing review: a merged assisted first answer cannot leave an independent delay anchor', () => {
  const earlyStorage = memoryStorage(), early = open(earlyStorage);
  const lateStorage = memoryStorage(), late = open(lateStorage, () => anchor + 1000);
  early.help('I01', 'meaning');
  early.submit('I01', answer);
  late.submit('I01', '공원이 넓어서 공원에서 산책해요.');
  lateStorage.setItem(engine.KEY, late.mergeImport(JSON.stringify(early.getState())));
  const restored = open(lateStorage, () => anchor + engine.DAY * 2);
  assert.equal(restored.evidence().independent, 0);
  assert.equal(restored.delayedReady(), false);
  assert.equal(restored.eligible('D01'), false);
});

test('writing review: safe unknown fields survive migration, ordinary writes and backup merge', () => {
  const initial = {
    schema: 0,
    futureMetadata: { note: '<img src=x onerror=alert(1)>', retained: ['one', 'two'] },
    drafts: { R01: { text: '초고', updatedAt: new Date(anchor).toISOString(), futureAnnotation: { source: 'retained' } } },
    attempts: []
  };
  const storage = memoryStorage(JSON.stringify(initial)), active = open(storage, () => anchor + 1000);
  active.setDraft('R01', '수정한 초고');
  active.route({ page: 'unit' });
  const incoming = { schema: 1, otherMetadata: { retained: true }, drafts: {}, attempts: [] };
  const restored = importState(storage, active, incoming).getState();
  assert.deepEqual(JSON.parse(JSON.stringify(restored.futureMetadata)), initial.futureMetadata);
  assert.deepEqual(JSON.parse(JSON.stringify(restored.otherMetadata)), incoming.otherMetadata);
  assert.deepEqual(JSON.parse(JSON.stringify(restored.drafts.R01.futureAnnotation)), initial.drafts.R01.futureAnnotation);
});

test('writing review: invalid stored delay date never crashes or releases held-out content', () => {
  const initial = { schema: 1, firstIndependentAt: 'bad-date', route: { page: 'unit' } };
  const storage = memoryStorage(JSON.stringify(initial)), active = open(storage);
  assert.doesNotThrow(() => active.delayedAt());
  assert.equal(active.delayedReady(), false);
  assert.equal(active.eligible('D01'), false);
  assert.doesNotThrow(() => active.evidence());
  const rendered = ui(initial);
  assert.doesNotThrow(() => rendered.c.render());
});

test('writing review: malformed nested evaluation is quarantined without destroying the source', () => {
  const storage = memoryStorage(), active = open(storage);
  active.submit('I01', answer);
  const initial = active.getState();
  initial.attempts[0].evaluation = {};
  initial.route = { page: 'feedback', itemId: 'I01' };
  const rendered = ui(initial), original = rendered.storage.getItem(engine.KEY);
  assert.doesNotThrow(() => rendered.c.render());
  rendered.c.HARUMAL_WRITING.engine.route({ page: 'unit' });
  assert.equal(rendered.storage.getItem(engine.KEY), original, 'invalid original storage is retained read-only');
});

test('writing review: malformed draft help types cannot throw while opening support', () => {
  const initial = { schema: 1, drafts: { I01: { text: answer, helpTypes: { bad: true } } }, attempts: [] };
  const raw = JSON.stringify(initial), storage = memoryStorage(raw), active = open(storage);
  assert.doesNotThrow(() => active.help('I01', 'meaning'));
  assert.equal(storage.getItem(engine.KEY), raw, 'malformed known metadata is retained read-only');
});

test('writing review: imported attempt IDs cannot execute script through self-check controls', () => {
  const storage = memoryStorage(), active = open(storage);
  active.submit('I01', answer);
  const initial = active.getState();
  initial.attempts[0].id = "review');globalThis.__reviewExecuted=true;//";
  initial.route = { page: 'feedback', itemId: 'I01' };
  const rendered = ui(initial);
  rendered.c.render();
  exerciseHandlers(rendered, 'harumalWritingSelfCheck');
  assert.notEqual(rendered.c.__reviewExecuted, true);
});

test('writing review: imported item IDs cannot execute script through history controls', () => {
  const storage = memoryStorage(), active = open(storage);
  active.submit('I01', answer);
  const initial = active.getState();
  initial.attempts[0].itemId = "I01');globalThis.__reviewExecuted=true;//";
  initial.route = { page: 'records' };
  const rendered = ui(initial);
  rendered.c.render();
  exerciseHandlers(rendered, "harumalWritingGo('item'");
  assert.notEqual(rendered.c.__reviewExecuted, true);
});

test('writing review: learner text is escaped in drafts, feedback and history', () => {
  const hostileText = '<img src=x onerror="globalThis.__reviewExecuted=true">';
  const storage = memoryStorage(), active = open(storage);
  active.setDraft('I01', hostileText);
  active.submit('I01');
  for (const page of ['item', 'feedback', 'records']) {
    const initial = active.getState();
    initial.route = { page, itemId: 'I01' };
    const rendered = ui(initial);
    rendered.c.render();
    assert.doesNotMatch(rendered.screen.innerHTML, /<img src=x onerror=/);
    assert.match(rendered.screen.innerHTML, /&lt;img src=x onerror=/);
  }
});
