const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const LOCALES = ['ko', 'ja', 'en', 'zh'];
const KEY = 'harumalWritingCurriculumV1';
const NOW = Date.parse('2026-10-10T12:00:00Z');
const files = ['data/writing-curriculum.js', 'data/writing-curriculum-locales.js', 'writing-curriculum-i18n.js', 'writing-curriculum-engine.js', 'writing-curriculum.js'];
const plain = value => JSON.parse(JSON.stringify(value));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const decode = value => value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');

function boot(locale = 'ko', options = {}) {
  const values = options.values || new Map();
  if (options.initial != null) values.set(KEY, typeof options.initial === 'string' ? options.initial : JSON.stringify(options.initial));
  const storage = { getItem: key => values.get(key) ?? null, setItem(key, value) { if (options.writeError) throw new Error('quota'); values.set(key, String(value)); } };
  const events = {};
  const screen = { innerHTML: '', dataset: {}, querySelector() { return null; } };
  const nodes = Object.fromEntries(['wcSaveState','wcHelpState','wcInlineError'].map(id => [id, { textContent: '' }]));
  let tick = 0;
  class FixedDate extends Date { constructor(...args) { super(...(args.length ? args : [NOW + tick++])); } static now() { return NOW + tick++; } }
  const c = {
    console, Date: FixedDate, S: { view: 'writingCourse', lang: locale }, localStorage: storage,
    document: { getElementById: id => id === 'screen' ? screen : nodes[id] || null, body: { classList: { add() {}, remove() {} } } },
    history: { state: {}, replaceState(value) { this.state=plain(value); }, pushState(value) { this.state=plain(value); } }, addEventListener(name,listener) { events[name]=listener; }, scrollTo() {},
    requestAnimationFrame: fn => fn(), render() {}, setView(view) { c.S.view = view; c.render(); }
  };
  c.window = c;
  vm.createContext(c);
  for (const file of files) vm.runInContext(read(file), c, { filename: file });
  return { c, screen, nodes, values, storage, events, E: c.HARUMAL_WRITING.engine, data: c.HARUMAL_WRITING_DATA,
    go(page, id = '') { c.harumalWritingGo(page, id); return screen.innerHTML; },
    switchLocale(lang) { c.S.lang = lang; c.HARUMAL_WRITING.render(); return screen.innerHTML; }
  };
}

// Deliberately do not excuse whole teaching screens. Only explicit Korean learning
// content, saved learner input, and the proper-name brand may retain Hangul.
function untranslatedKorean(html, permitted = []) {
  const stack = [], failures = [];
  const voids = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  for (const token of html.match(/<[^>]*>|[^<]+/g) || []) {
    if (/^<\//.test(token)) { const tag = token.match(/^<\/\s*([\w-]+)/)?.[1]?.toLowerCase(); const at = stack.map(x => x.tag).lastIndexOf(tag); if (at >= 0) stack.splice(at); continue; }
    if (token.startsWith('<')) {
      const tag = token.match(/^<\s*([\w-]+)/)?.[1]?.toLowerCase();
      if (!tag) continue;
      const learning = /\blang\s*=\s*["']ko["']/.test(token) || (tag === 'option' && /\bvalue=["']ko["']/.test(token));
      if (learning) assert.ok(!['section','header','main','details','button','fieldset'].includes(tag), 'whole UI containers cannot evade localization via lang=ko: ' + token);
      for (const attr of token.matchAll(/(?:aria-label|placeholder|title)\s*=\s*["']([^"']*)["']/g)) if (/[가-힣]/.test(decode(attr[1]))) failures.push('attribute: ' + decode(attr[1]));
      if (!voids.has(tag) && !/\/>$/.test(token)) stack.push({ tag, learning });
      continue;
    }
    if (stack.some(x => x.learning || ['script','style','textarea'].includes(x.tag))) continue;
    let text = decode(token).replace(/하루말/g, '').trim();
    for (const learningToken of permitted) text = text.split(learningToken).join('');
    if (/[가-힣]/.test(text)) failures.push(text);
  }
  return [...new Set(failures)];
}
function permittedKorean(env) {
  // Explicit target words quoted by an actual localized catalog entry are allowed.
  // This does not excuse unknown source prose or mark complete UI containers Korean.
  return [...new Set(Object.values(catalogEntries(env.c)).flatMap(entry => (entry[env.c.S.lang] || '').match(/[가-힣]+/g) || []))].sort((a,b) => b.length-a.length);
}
function localized(env, label) {
  if (env.c.S.lang !== 'ko') assert.deepEqual(untranslatedKorean(env.screen.innerHTML, permittedKorean(env)), [], `${env.c.S.lang} ${label}: untranslated learner-facing Korean`);
  assert.doesNotMatch(env.screen.innerHTML, /\b(?:undefined|null)\b(?=<)/, label + ': unresolved translation');
}
function seedMatureRecord(env) {
  const seed = env.c.HARUMAL_WRITING_ENGINE.create(env.storage, env.data, () => NOW - 49 * 60 * 60 * 1000);
  seed.submit('I01', '공원이 넓어서 여기에서 산책해요.');
  return env.E.getState();
}
function submit(env, id, text) {
  env.go('item', id);
  env.c.harumalWritingDraft(id, text);
  env.c.harumalWritingSubmit(id);
  return env.E.getState().attempts.at(-1);
}

function catalogEntries(c) {
  return Object.assign({}, c.HARUMAL_WRITING_CONTENT_I18N, c.HARUMAL_WRITING_UI_I18N);
}

test('writing localization: four complete catalogs and every declared data instruction are covered', () => {
  const env = boot(), entries = catalogEntries(env.c);
  assert.ok(Object.keys(entries).length > 150, 'full UI/content catalogs must be loaded');
  assert.equal(typeof env.c.HARUMAL_WRITING.localeText, 'function');
  for (const [source, entry] of Object.entries(entries)) {
    for (const locale of ['ja', 'en', 'zh']) {
      assert.equal(typeof entry[locale], 'string', `${locale}: ${source}`);
      assert.ok(entry[locale].trim(), `${locale}: blank translation for ${source}`);
      if (/[가-힣]/.test(source) && !(/[ぁ-ヿ]/.test(source) && locale === 'ja')) assert.notEqual(entry[locale], source, `${locale}: Korean fallback for ${source}`);
    }
    for (const locale of LOCALES) {
      env.c.S.lang = locale;
      const values = ['VALUE_0','VALUE_1','VALUE_2'];
      const expected = (locale === 'ko' ? (entry.ko ?? source) : entry[locale]).replace(/\{(\d+)\}/g, (_, index) => values[Number(index)] ?? '');
      assert.equal(env.c.HARUMAL_WRITING.localeText(source, ...values), expected, `${locale}: catalog lookup ${source}`);
    }
  }
  for (const match of read('writing-curriculum.js').matchAll(/\b(?:T|t)\(\s*('(?:\\.|[^'\\])*')/g)) {
    const source = vm.runInNewContext(match[1]);
    if (/[가-힣]/.test(source)) assert.ok(entries[source], 'direct interface source is missing from the catalog: ' + source);
  }
  const fields = new Set(['titleKo','summaryKo','prerequisiteNoteKo','helpKo','promptKo','labelKo','messageKo','incorrectMessageKo']);
  function visit(value, at = 'data') {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (fields.has(key) && child && /[가-힣]/.test(child)) assert.ok(entries[child], at + '.' + key + ': missing translation ' + child);
      if (child && typeof child === 'object') visit(child, at + '.' + key);
    }
  }
  visit(env.data);
  for (const item of env.data.items) {
    const helpSources = [item.support?.meaningJa, ...(item.facts || []).map(fact => item.id === 'P04' ? fact.ja : fact.ko), ...(item.support?.vocabulary || []).map(word => word.ko)].filter(Boolean);
    for (const source of helpSources) assert.ok(entries[source], item.id + ': meaning support must be available in all four languages: ' + source);
  }
  const raw = plain(env.data);
  env.c.S.lang = 'unsupported';
  assert.equal(env.c.HARUMAL_WRITING.localeText('성장 기록'), entries['성장 기록']?.en ?? '성장 기록', 'unsupported locale defaults safely to English');
  assert.deepEqual(plain(env.data), raw, 'locale lookup cannot mutate canonical learning content');
});

for (const locale of LOCALES) {
  test(`writing localization: ${locale} course, map, 14 nodes, unit, 12 groups, 37 prompts and exam routes`, () => {
    const env = boot(locale), originalData = plain(env.data);
    assert.equal(env.data.nodes.length, 14); assert.equal(env.data.groups.length, 12); assert.equal(env.data.items.length, 37);
    for (const page of ['course','map','unit','records']) { env.go(page); localized(env, page); }
    for (const node of env.data.nodes) { env.go('node', node.id); localized(env, node.id); }
    for (const level of ['beginner','intermediate','advanced']) { env.go('level', level); localized(env, 'level ' + level); }
    for (const group of env.data.groups) { env.go('stage-done', group.id); localized(env, group.id + ' stage done'); }
    for (const n of [51,52,53,54]) { env.go('exam', String(n)); localized(env, 'exam ' + n); }
    env.go('group', 'delayed-new'); localized(env, 'delayed locked');
    for (const i of env.data.items.filter(i => i.delayedOnly)) {
      assert.ok(i.facts.every(f => !env.screen.innerHTML.includes(escape(f.ko))), 'locked delayed group must not expose future facts');
      env.go('item', i.id); localized(env, i.id + ' locked');
      assert.ok(i.models.every(model => !env.screen.innerHTML.includes(escape(model))), 'locked item cannot leak an answer');
    }
    seedMatureRecord(env);
    for (const group of env.data.groups) { env.go('group', group.id); localized(env, group.id); }
    for (const i of env.data.items) {
      env.go('item', i.id); localized(env, i.id);
      for (const fact of i.facts) assert.ok(env.screen.innerHTML.includes(escape(fact.ko)), `${i.id}: Korean fact must remain Korean`);
      if (i.draftKo) assert.ok(env.screen.innerHTML.includes(escape(i.draftKo)), i.id + ': original Korean repair draft retained');
      if (i.evidence?.independent && i.id !== 'I01') {
        for (const model of i.models) assert.ok(!env.screen.innerHTML.includes(escape(model)), i.id + ': no model before first submission');
        assert.doesNotMatch(env.screen.innerHTML, /class="wcModel"/, i.id + ': no pre-submit model component');
      }
    }
    assert.deepEqual(plain(env.data), originalData, 'rendering all languages cannot translate learning facts in-place');
    assert.equal(env.E.getState().attempts.length, 1, 'visiting routes creates no evidence beyond fixture');
  });

  test(`writing localization: ${locale} feedback, revision, free/relation answers, models and records`, () => {
    const env = boot(locale); seedMatureRecord(env);
    const scenarios = [
      ['R01', '일이 많아요서 늦게 퇴근해요.', 'needs_practice'],
      ['R01', '일이 많아서 늦게 퇴근해요.', 'form_observed'],
      ['R02', '날씨가 좋기 때문에 공원에 가요.', 'alternative_form'],
      ['R03', '안녕하세요.', 'review_needed'],
      ['P01', '저는 도서관에서 공부해요.', 'components_observed'],
      ['I03', '카페가 조용해서 그곳에서 책을 읽어요.', 'saved'],
      ['P03', 'work', 'interpretation_observed'],
      ['P03', 'wrong', 'needs_practice'],
      ['D01', '영화가 재미있어서 다시 봐요.', 'form_observed']
    ];
    for (const [id, answer, status] of scenarios) {
      const attempt = submit(env, id, answer);
      assert.equal(attempt.evaluation.status, status, id + ': fixture status');
      localized(env, id + ' ' + status);
      for (const message of attempt.evaluation.messages) {
        const translated = env.c.HARUMAL_WRITING.localeText(message);
        if (locale !== 'ko') assert.notEqual(translated, message, locale + ': engine feedback translated at display time');
      }
      if (id === 'R01' && status === 'form_observed') assert.equal(attempt.mode, 'revision');
      assert.equal(attempt.evaluation.meaning, env.data.items.find(i => i.id === id).kind === 'relation' ? 'bounded_choice_only' : 'unreviewed');
      env.c.harumalWritingSelfCheck(attempt.id, 'checked'); localized(env, 'self-check');
      env.c.harumalWritingSelfCheck(attempt.id, 'needs_review'); localized(env, 'needs-review');
      env.c.harumalWritingModel(id); localized(env, id + ' model');
      for (const model of env.data.items.find(i => i.id === id).models) assert.ok(env.screen.innerHTML.includes(escape(model)), id + ': Korean model preserved');
    }
    env.go('records'); localized(env, 'populated records');
    env.go('course'); localized(env, 'course delayed-ready notice');
    env.go('unit'); localized(env, 'unit delayed-ready');
    assert.equal(env.E.evidence().meaningReviewed, 0, 'localization must not turn heuristic feedback into semantic mastery');
  });

  test(`writing localization: ${locale} attributes, empty submit, help, prerequisite and storage errors`, () => {
    const env = boot(locale);
    env.go('item', 'R01'); localized(env, 'input ARIA/placeholder');
    assert.match(env.screen.innerHTML, /placeholder="[^\"]+"/);
    assert.match(env.screen.innerHTML, /aria-label="[^\"]+"/);
    env.c.harumalWritingSubmit('R01');
    assert.ok(env.nodes.wcInlineError.textContent);
    env.c.harumalWritingHelp('R01','meaning');
    env.c.harumalWritingDraft('R01','내 초고를 보존해요.');
    for (const node of Object.values(env.nodes)) if (node.textContent && locale !== 'ko') assert.doesNotMatch(node.textContent, /[가-힣]/, 'dynamic status should follow current language');
    env.c.harumalWritingReady('past','needs_help'); env.go('item','R16'); localized(env, 'prerequisite gate');
    assert.doesNotMatch(env.screen.innerHTML, /id="wcAnswer"/);
    for (const initial of ['{broken', { schema: 99, keep: 'original' }]) {
      const error = boot(locale, { initial }); error.go('item','R01'); localized(error, 'storage read/newer error');
      assert.match(error.screen.innerHTML, /wcStorageWarning/);
      const original = error.values.get(KEY); error.c.harumalWritingDraft('R01','보존'); assert.equal(error.values.get(KEY), original);
      if (locale !== 'ko') assert.doesNotMatch(error.nodes.wcSaveState.textContent, /[가-힣]/);
    }
    const error = boot(locale, { writeError: true }); error.go('item','R01'); localized(error, 'storage quota warning');
    error.c.harumalWritingDraft('R01','보존');
    if (locale !== 'ko') assert.doesNotMatch(error.nodes.wcSaveState.textContent, /[가-힣]/);
  });
}

function clickRendered(env, handler) {
  const handlers = [...env.screen.innerHTML.matchAll(/onclick="([^"]*)"/g)].map(match => decode(match[1]));
  assert.ok(handlers.includes(handler), 'rendered control is available: ' + handler);
  vm.runInContext(handler, env.c);
}

for (const locale of LOCALES) test(`writing localization: ${locale} guided start, stage boundary and exact draft/feedback resume`, () => {
  let env = boot(locale);
  for (const level of ['intermediate','advanced']) {
    env.go('level',level); localized(env, level + ' planned');
    assert.doesNotMatch(env.screen.innerHTML, /id="wcAnswer"|class="wcChoices"/, 'planned levels do not fabricate exercises');
    assert.equal(env.E.getState().attempts.length,0);
  }
  env.go('course'); clickRendered(env,'harumalWritingBegin()'); localized(env,'guided first item');
  assert.deepEqual(plain(env.E.getState().route),{page:'item',itemId:'P01'});
  assert.match(env.screen.innerHTML,/wcGuidedProgress/);
  const firstAnswer = env.data.items.find(i=>i.id==='P01').models[0];
  env.c.harumalWritingDraft('P01',firstAnswer);
  env.go('course'); clickRendered(env,'harumalWritingResume()');
  assert.deepEqual(plain(env.E.getState().route),{page:'item',itemId:'P01'});
  assert.ok(env.screen.innerHTML.includes(escape(firstAnswer)),'course resume restores exact Korean draft');
  clickRendered(env,'harumalWritingExit()'); assert.equal(env.c.S.view,'learn');
  env = boot(locale,{values:env.values}); env.go('course'); clickRendered(env,'harumalWritingResume()');
  assert.deepEqual(plain(env.E.getState().route),{page:'item',itemId:'P01'});
  assert.equal(env.E.draft('P01').text,firstAnswer,'close/reload/reopen keeps exact draft');
  clickRendered(env,"harumalWritingSubmit('P01')"); localized(env,'guided first feedback');
  assert.deepEqual(plain(env.E.getState().route),{page:'feedback',itemId:'P01'});
  const firstAttempt = plain(env.E.getState().attempts[0]);
  env.go('course'); clickRendered(env,'harumalWritingResume()');
  assert.deepEqual(plain(env.E.getState().route),{page:'feedback',itemId:'P01'},'resume restores feedback rather than skipping the learner review');
  env = boot(locale,{values:env.values}); env.c.HARUMAL_WRITING.render(); localized(env,'reloaded guided feedback');
  assert.deepEqual(plain(env.E.getState().attempts[0]),firstAttempt);
  const initialGroup = env.data.groups.find(g=>g.id==='probe-basics');
  for (const id of initialGroup.itemIds) {
    const item = env.data.items.find(i=>i.id===id);
    if (id !== 'P01') {
      assert.deepEqual(plain(env.E.getState().route),{page:'item',itemId:id},'continue opens the next item in sequence');
      const answer = item.kind === 'relation' ? item.evaluation.correctChoiceId : item.models[0];
      env.c.harumalWritingDraft(id,answer); clickRendered(env,`harumalWritingSubmit('${id}')`);
      assert.deepEqual(plain(env.E.getState().route),{page:'feedback',itemId:id});
    }
    localized(env,id + ' guided feedback');
    clickRendered(env,`harumalWritingContinue('${id}')`);
    localized(env,id + ' guided continue');
  }
  assert.deepEqual(plain(env.E.getState().route),{page:'stage-done',groupId:'probe-basics'});
  assert.ok(env.E.guidedProgress().completedIds.includes('probe-basics'));
  assert.ok(!env.E.guidedProgress().unlockedIds.includes('form-aseo'),'stage-completion review remains before the next unlock');
  env.go('course'); clickRendered(env,'harumalWritingResume()');
  assert.deepEqual(plain(env.E.getState().route),{page:'stage-done',groupId:'probe-basics'},'completed-stage review resumes exactly');
  clickRendered(env,"harumalWritingContinue('probe-basics')"); localized(env,'first unlocked stage');
  assert.deepEqual(plain(env.E.getState().route),{page:'item',itemId:'R01'});
  assert.ok(env.E.guidedProgress().unlockedIds.includes('form-aseo'));
  assert.equal(env.E.getState().attempts.length,initialGroup.itemIds.length,'navigation and resume never duplicate learning attempts');
  assert.equal(env.E.evidence().meaningReviewed,0,'stage completion is a sequence marker, not semantic mastery');
});

test('writing localization: one Korean record switches language and reloads without rewriting evidence', () => {
  let env = boot('ko');
  const first = submit(env,'R01','일이 많아요서 늦게 퇴근해요.');
  env.c.harumalWritingSelfCheck(first.id,'checked');
  env.c.harumalWritingDraft('I02','의자가 편해서 여기에');
  const stored = env.values.get(KEY), state = plain(env.E.getState()), data = plain(env.data);
  for (const locale of ['ja','en','zh','ko']) {
    env.switchLocale(locale); localized(env, 'same saved feedback');
    assert.equal(env.values.get(KEY), stored, 'language rerender must not migrate or translate durable bytes');
    env = boot(locale, { values: env.values }); env.c.HARUMAL_WRITING.render(); localized(env, 'reload same feedback');
    assert.deepEqual(plain(env.E.getState()), state, 'all timestamps, IDs, drafts, help and evaluations survive language/reload');
    assert.deepEqual(plain(env.data), data);
    assert.equal(env.E.draft('I02').text, '의자가 편해서 여기에');
    assert.deepEqual(plain(env.E.getState().attempts[0].evaluation.messages), plain(first.evaluation.messages), 'engine keeps language-neutral evidence with original feedback source');
  }
});

test('writing localization: both catalogs load before writing UI and remain available offline', () => {
  const loader = read('site-patch.js'), worker = read('sw.js');
  for (const file of ['data/writing-curriculum-locales.js','writing-curriculum-i18n.js']) {
    assert.ok(loader.includes("'" + file + "'"), file + ': registered runtime asset');
    assert.ok(loader.indexOf("'" + file + "'") < loader.indexOf("'writing-curriculum.js'"), file + ': loaded before UI');
    assert.ok(worker.includes("'./" + file + "'"), file + ': cached for offline learning');
  }
});


test('writing navigation: browser Back restores guided stage controls after leaving for the menu',()=>{
 const env=boot('ja');env.c.harumalWritingBegin();
 for(const id of env.data.groups.find(g=>g.id==='probe-basics').itemIds){
  const i=env.data.items.find(i=>i.id===id);env.c.harumalWritingDraft(id,i.kind==='relation'?i.evaluation.correctChoiceId:i.models[0]);env.c.harumalWritingSubmit(id);env.c.harumalWritingContinue(id);
 }
 const completedEntry=plain(env.c.history.state);
 assert.equal(completedEntry.harumalWritingGuided,true);
 assert.equal(env.E.getState().route.page,'stage-done');
 env.go('course');assert.equal(env.E.guidedProgress().active,false);
 env.events.popstate({state:completedEntry});assert.equal(env.E.guidedProgress().active,true);
 env.c.harumalWritingContinue('probe-basics');
 assert.equal(env.E.getState().route.itemId,'R01');assert.ok(env.E.guidedProgress().unlockedIds.includes('form-aseo'));
 // Older history entries without the marker still have a usable explicit Continue.
 env.go('course');env.events.popstate({state:{harumalWritingRoute:{page:'stage-done',groupId:'probe-basics'}}});
 env.c.harumalWritingContinue('probe-basics');assert.equal(env.E.getState().route.itemId,'R01');
});


test('writing navigation: interrupted final stage review remains resumable until explicitly confirmed',()=>{
 const env=boot('ja');env.c.harumalWritingBegin();
 const groups=env.data.groups.filter(g=>!g.delayedOnly);
 for(const g of groups){
  for(const id of g.itemIds){const i=env.data.items.find(i=>i.id===id);env.c.harumalWritingDraft(id,i.kind==='relation'?i.evaluation.correctChoiceId:i.models[0]);env.c.harumalWritingSubmit(id);env.c.harumalWritingContinue(id)}
  if(g!==groups.at(-1))env.c.harumalWritingContinue(g.id);
 }
 assert.equal(env.E.guidedProgress().complete,true);assert.equal(env.E.getState().route.page,'stage-done');
 env.go('course');assert.match(env.screen.innerHTML,/harumalWritingResume\(\)/);
 env.c.harumalWritingBegin();assert.equal(env.E.getState().route.page,'stage-done');assert.equal(env.E.getState().route.groupId,'independent-new');
 env.go('course');env.c.harumalWritingResume();assert.equal(env.E.getState().route.groupId,'independent-new');
 env.c.harumalWritingContinue('independent-new');assert.ok(env.E.guidedProgress().confirmedStageIds.includes('independent-new'));assert.ok(env.E.guidedProgress().unlockedIds.includes('delayed-new'));
 assert.doesNotMatch(env.screen.innerHTML,/harumalWritingResume\(\)/);
});


test('writing navigation: migrated later-stage completion previews the actual next unfinished stage',()=>{
 const initial={schema:1,attempts:[],readiness:{},drafts:{I02:{text:'이어 쓸 문장',updatedAt:'2026-10-01T00:00:00Z'}},route:{page:'item',itemId:'I02'}};
 const env=boot('en',{initial});env.c.harumalWritingResume();
 for(let n=0;n<3;n++){const id=env.E.getState().route.itemId,i=env.data.items.find(i=>i.id===id);env.c.harumalWritingDraft(id,i.models[0]);env.c.harumalWritingSubmit(id);env.c.harumalWritingContinue(id)}
 assert.equal(env.E.getState().route.groupId,'independent-new');
 assert.ok(env.screen.innerHTML.includes(env.c.HARUMAL_WRITING.localeText(env.data.groups[0].titleKo)));
 env.c.harumalWritingContinue('independent-new');assert.equal(env.E.getState().route.itemId,'P01');
});


test('writing language selector restores keyboard focus after a language-triggered rerender',()=>{
 const env=boot('ja');let focused=0;
 env.c.document.activeElement={classList:{contains:name=>name==='wcLanguage'}};
 env.c.document.querySelector=selector=>selector==='.wcLanguage'?{focus(){focused++}}:null;
 env.c.malbitSetLanguage=lang=>{env.c.S.lang=lang;env.c.HARUMAL_WRITING.render()};
 env.go('item','P01');env.c.harumalWritingDraft('P01','계속 쓰는 문장');const before=env.values.get(KEY);
 env.c.harumalWritingLanguage('en');assert.equal(env.c.S.lang,'en');assert.equal(focused,1);
 env.c.harumalWritingLanguage('zh');assert.equal(env.c.S.lang,'zh');assert.equal(focused,2);
 assert.equal(env.values.get(KEY),before);assert.equal(env.E.getState().route.itemId,'P01');
});
