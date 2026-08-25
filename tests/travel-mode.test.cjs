const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const storage = new Map();
const context = {
  console,
  window: {},
  localStorage: {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key)
  }
};
context.window.window = context.window;
context.window.localStorage = context.localStorage;
vm.createContext(context);
for (let part = 1; part <= 4; part++) vm.runInContext(read(`data/question-bank-v1-part${part}.js`), context);
vm.runInContext(read('question-bank-engine.js'), context);
vm.runInContext(read('data/travel-pack-seoul-001.js'), context);

const bank = context.window.MALBIT_BANK;
const packs = context.window.MALBIT_TRAVEL_PACKS;
const languages = ['ko', 'ja', 'en', 'zh'];

function assertI18n(value, label) {
  for (const language of languages) assert.ok(String(value?.[language] || '').trim(), `${label}.${language} is missing`);
}

test('the first travel route is a complete, reachable six-question journey', () => {
  assert.equal(packs.length, 1);
  const pack = packs[0];
  assert.equal(pack.id, 'route-001-airport-myeongdong');
  assert.equal(pack.questionCount, 6);
  assert.equal(pack.scenes.filter(scene => scene.type === 'question').length, 6);
  assert.deepEqual(Array.from(pack.map.stops, stop => stop.id), ['airport-t1', 'seoul-station', 'myeongdong']);
  assert.deepEqual(Array.from(pack.map.stops, stop => stop.unlockAt), [0, 3, 6]);
  assert.deepEqual(Array.from(pack.skins, skin => skin.unlock), ['default', 'clear', 'perfect']);

  const ids = pack.scenes.map(scene => scene.id);
  assert.equal(new Set(ids).size, ids.length, 'scene IDs must be unique');
  const transport=pack.scenes.find(scene=>scene.id==='transport');
  assert.deepEqual(Array.from(transport.choices, choice=>choice.id),['all-stop','express','taxi']);
  assert.deepEqual(Array.from(transport.choices, choice=>choice.cost),[4750,18100,85000]);
  assert.equal(pack.startWallet+pack.questionReward*3,transport.choices[2].cost,'three successful airport missions should unlock the taxi branch exactly');
  for(const choice of transport.choices)assert.ok(pack.scenes.some(scene=>scene.id===choice.next),`${choice.id} branch must be reachable`);
  const taxiRide=pack.scenes.find(scene=>scene.id==='ride-taxi');
  const ticket=pack.scenes.find(scene=>scene.id==='q-ticket');
  const transfer=pack.scenes.find(scene=>scene.id==='q-transfer');
  const thanks=pack.scenes.find(scene=>scene.id==='q-thanks');
  assert.equal(taxiRide.stop,'airport-t1','taxi must not pretend to arrive at Seoul Station');
  assert.equal(ticket.routeVariants.taxi.stop,'airport-t1');
  assert.equal(ticket.routeVariants.taxi.question.bankId,'TRAVEL-A4-TAXI');
  assert.equal(transfer.routeVariants.taxi.stop,'myeongdong');
  assert.equal(transfer.routeVariants.taxi.question.bankId,'TRAVEL-A5-TAXI');
  assert.equal(thanks.routeVariants.taxi.title.ja,'運転手にお礼を伝えよう');
  assert.equal(pack.scenes.at(-1).type, 'ending');
});

test('travel graphics use generated background, avatar, NPC, prop, and UI layers', () => {
  const pack=packs[0];
  assert.deepEqual(Object.keys(pack.assets),['backgrounds','avatars','npcs','props','ui']);
  for(const [group,assets] of Object.entries(pack.assets)){
    assert.ok(Object.keys(assets).length>0,`${group} asset registry must not be empty`);
    for(const [key,file] of Object.entries(assets)){
      const absolute=path.join(root,file);
      assert.ok(fs.existsSync(absolute),`${group}.${key} is missing: ${file}`);
      assert.ok(fs.statSync(absolute).size>1000,`${group}.${key} must be a real generated image`);
    }
  }
  for(const scene of pack.scenes){
    for(const [variantId,visual] of [['base',scene],...Object.entries(scene.routeVariants||{})]){
      const world=visual.world||scene.world,choiceAssets=visual.choiceAssets===null?[]:(visual.choiceAssets||scene.choiceAssets||[]);
      assert.ok(world,`${scene.id}.${variantId} needs a composited world`);
      assert.ok(pack.assets.backgrounds[world.background],`${scene.id}.${variantId} background is not registered`);
      if(world.npc)assert.ok(pack.assets.npcs[world.npc],`${scene.id}.${variantId} NPC is not registered`);
      for(const prop of world.props||[])assert.ok(pack.assets.props[prop],`${scene.id}.${variantId}.${prop} is not registered`);
      for(const prop of choiceAssets)assert.ok(pack.assets.props[prop],`${scene.id}.${variantId}.${prop} choice art is not registered`);
    }
  }
  assert.deepEqual(Array.from(pack.scenes.filter(scene=>scene.type==='question').slice(0,3),scene=>scene.interaction),['dialogue','hotspot','machine']);
});

test('travel questions are complete original beginner items with one verified answer', () => {
  const pack = packs[0];
  for (const scene of pack.scenes.filter(item => item.type === 'question')) {
    for(const [variantId,content] of [['base',scene],...Object.entries(scene.routeVariants||{})]){
      const question=content.question||scene.question;
      assert.ok(question,`${scene.id}.${variantId} must provide a beginner question`);
      assert.equal(question.level,pack.level,`${question.bankId} should match the episode level`);
      assert.notEqual(question.section,'writing');
      assert.equal(question.choices.length,4);
      assert.ok(Number.isInteger(question.answerIndex)&&question.answerIndex>=0&&question.answerIndex<4);
      for(const choice of question.choices)assertI18n(choice,`${scene.id}.${variantId}.choice`);
      assertI18n(question.explanationI18n,`${scene.id}.${variantId}.explanation`);
      assertI18n(content.instruction||scene.instruction,`${scene.id}.${variantId}.instruction`);
      assertI18n(content.success||scene.success,`${scene.id}.${variantId}.success`);
      assertI18n(content.recovery||scene.recovery,`${scene.id}.${variantId}.recovery`);
    }
  }
});

test('travel UI copy is complete in Korean, Japanese, English, and Chinese', () => {
  const pack = packs[0];
  for (const field of ['title', 'subtitle', 'description', 'duration']) assertI18n(pack[field], `pack.${field}`);
  for (const scene of pack.scenes) {
    assertI18n(scene.location, `${scene.id}.location`);
    assertI18n(scene.title, `${scene.id}.title`);
    if (scene.support) assertI18n(scene.support, `${scene.id}.support`);
    if (scene.context) assertI18n(scene.context, `${scene.id}.context`);
    for (const choice of scene.choices || []) {
      assertI18n(choice.label, `${scene.id}.${choice.id}.label`);
      assertI18n(choice.detail, `${scene.id}.${choice.id}.detail`);
      if(choice.title)assertI18n(choice.title, `${scene.id}.${choice.id}.title`);
    }
    if (scene.clue) {
      assertI18n(scene.clue.label, `${scene.id}.clue.label`);
      assertI18n(scene.clue.detail, `${scene.id}.clue.detail`);
    }
    for(const [variantId,variant] of Object.entries(scene.routeVariants||{})){
      for(const field of ['location','title','context','instruction','success','recovery'])if(variant[field])assertI18n(variant[field],`${scene.id}.${variantId}.${field}`);
    }
  }
  for (const [key, ending] of Object.entries(pack.endings)) {
    assertI18n(ending.title, `ending.${key}.title`);
    assertI18n(ending.detail, `ending.${key}.detail`);
  }
  for (const stop of pack.map.stops) assertI18n(stop.name, `stop.${stop.id}.name`);
  for (const skin of pack.skins) assertI18n(skin.name, `skin.${skin.id}.name`);
});

test('Travel Mode is independent from Full Mock and wired into the ordered runtime', () => {
  const topik = read('topik1.js');
  const bootstrap = read('site-patch.js');
  const runtime = read('travel-mode.js');

  assert.match(topik, /mode==='travel'/);
  assert.match(topik, /class="tqV9Mode travel"/);
  assert.match(topik, /<button onclick="tqStartMode\('real'\)">[\s\S]{0,500}전체 모의고사/);
  assert.match(topik, /class="tqV9Mode travel" onclick="tqStartMode\('travel'\)"/);
  assert.ok(bootstrap.indexOf("'data/travel-pack-seoul-001.js'") < bootstrap.indexOf("'travel-mode.js'"));
  assert.ok(bootstrap.indexOf("'question-bank-engine.js'") < bootstrap.indexOf("'travel-mode.js'"));
  assert.ok(bootstrap.indexOf("'topik1.js'") < bootstrap.indexOf("'travel-mode.js'"));
  assert.match(runtime, /const STORAGE_KEY='malbitStoryV1'/);
  assert.match(runtime, /MALBIT_REVIEW\?\.record/);
  assert.match(runtime, /function cleanScript/);
  assert.match(runtime, /function resetViewport/);
  assert.match(runtime, /function resetTransient/);
  assert.match(runtime, /travelAnswers \$\{h\(interaction\)\} \$\{answer\?'answered'/);
  assert.match(runtime, /replace\(\/\(\^\|\\n\)\[\^:\\n\]/);
  assert.match(runtime, /S\.view==='travel'\|\|S\.view==='travelPlay'/);
  assert.match(runtime, /S\.view==='story'\|\|S\.view==='storyPlay'/);
  assert.doesNotMatch(topik, /스토리모드|ストーリーモード|Story Mode|故事模式/);
});

test('the travel runtime can complete, resume, replay, and record a wrong answer', () => {
  const runtimeStorage = new Map();
  const classes = new Set();
  const screen = { className: 'screen', innerHTML: '' };
  const reviews = [];
  const runtime = {
    console,
    S: { lang: 'ko', view: 'home' },
    localStorage: {
      getItem: key => runtimeStorage.has(key) ? runtimeStorage.get(key) : null,
      setItem: (key, value) => runtimeStorage.set(key, String(value)),
      removeItem: key => runtimeStorage.delete(key)
    },
    document: {
      body: {
        classList: {
          toggle: (name, on) => on ? classes.add(name) : classes.delete(name),
          remove: (...names) => names.forEach(name => classes.delete(name))
        }
      },
      documentElement: { style: {} },
      getElementById: id => id === 'screen' ? screen : null,
      querySelector: () => null
    },
    renderShell: () => {},
    navActive: () => {},
    hideSelection: () => {},
    flagMenu: () => {},
    toast: () => {},
    confirm: () => true,
    speechSynthesis: { cancel: () => {}, getVoices: () => [], speak: () => {} },
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance(value) { this.text = value; }
  };
  runtime.window = runtime;
  runtime.render = () => { screen.innerHTML = 'base'; };
  runtime.setView = view => { runtime.S.view = view; runtime.render(); };
  vm.createContext(runtime);
  for (let part = 1; part <= 4; part++) vm.runInContext(read(`data/question-bank-v1-part${part}.js`), runtime);
  vm.runInContext(read('question-bank-engine.js'), runtime);
  vm.runInContext(read('data/travel-pack-seoul-001.js'), runtime);
  runtime.MALBIT_REVIEW = { record: (...args) => reviews.push(args) };
  vm.runInContext(read('travel-mode.js'), runtime);

  runtime.malbitTravelOpen();
  assert.equal(runtime.S.view, 'travel');
  assert.match(screen.innerHTML, /여행모드/);
  assert.match(screen.innerHTML, /서울역/);
  assert.match(screen.innerHTML, /내 여행자/);
  runtime.malbitTravelStart('route-001-airport-myeongdong', false);
  assert.match(screen.innerHTML, /한국 여행이 시작됐다/);
  runtime.malbitTravelNext();
  assert.match(screen.innerHTML, /MISSION 1 \/ 6/);
  runtime.malbitTravelToggleTranscript();
  assert.match(screen.innerHTML, /안녕하세요/);

  const pack = runtime.MALBIT_TRAVEL_PACKS[0];
  let guard = 0;
  while (guard++ < 30) {
    const store = JSON.parse(runtimeStorage.get('malbitStoryV1'));
    const state = store.episodes[pack.id];
    const scene = pack.scenes.find(item => item.id === state.sceneId);
    if (scene.type === 'ending') break;
    if (scene.type === 'narrative') runtime.malbitTravelNext();
    else if (scene.type === 'choice') runtime.malbitTravelChoose(scene.choices[0].id);
    else if (scene.type === 'question') {
      if (!state.answers[scene.id]) {
        const question = scene.question;
        runtime.malbitTravelSelect(question.answerIndex);
        runtime.malbitTravelSubmit();
      }
      runtime.malbitTravelNext();
    }
  }
  const completed = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(completed.completed, true);
  assert.equal(completed.bestScore, 6);
  assert.equal(Object.keys(completed.answers).length, 6);
  assert.equal(completed.route,'all-stop');
  assert.equal(completed.wallet,91250,'starter budget, six rewards, all-stop fare, and one perfect bonus are balanced');
  assert.ok(completed.inventory.includes('airportMap'));
  assert.ok(completed.inventory.includes('transitCard'));
  assert.ok(completed.inventory.includes('myeongdong-first-stamp'));
  assert.match(screen.innerHTML, /ROUTE CLEAR/);
  const completedStore = JSON.parse(runtimeStorage.get('malbitStoryV1'));
  assert.ok(completedStore.avatar.unlocked.includes('seoul-sunset'));
  assert.ok(completedStore.avatar.unlocked.includes('hanbok-night'));

  runtime.malbitTravelBack();
  runtime.malbitTravelStart(pack.id, false);
  const resumed = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(resumed.completed, true, 'viewing a result must not reset a completed case');
  assert.match(screen.innerHTML, /ROUTE CLEAR/);

  runtime.malbitTravelRestart(pack.id);
  runtime.malbitTravelNext();
  const replay = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.ok(replay.inventory.includes('airportMap'),'restart keeps earned collection items');
  assert.ok(replay.inventory.includes('transitCard'),'restart keeps earned collection items');
  assert.ok(replay.inventory.includes('myeongdong-first-stamp'),'restart keeps the route stamp');
  const firstScene = pack.scenes.find(item => item.id === replay.sceneId);
  const firstQuestion = firstScene.question;
  const beforeWrongClock=replay.clockMinutes;
  runtime.malbitTravelSelect((firstQuestion.answerIndex + 1) % 4);
  runtime.malbitTravelSubmit();
  const afterWrong=JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(afterWrong.clockMinutes-beforeWrongClock,4,'a wrong action is recoverable but costs four minutes');
  assert.equal(afterWrong.answers[firstScene.id].itemReward,null,'a missed mission does not grant its item twice');
  assert.equal(reviews.length, 1);
  assert.equal(reviews[0][4], 'travel');
  assert.equal(JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id].bestScore, 6, 'replay keeps the best score');
});

test('legacy Story view and progress migrate without changing the storage root', () => {
  const source=read('travel-mode.js');
  assert.match(source, /const STORAGE_KEY='malbitStoryV1'/);
  assert.match(source, /Compatibility aliases/);
  assert.match(source, /malbitStoryOpen=window\.malbitTravelOpen/);
  assert.match(source, /S\.view=S\.view==='storyPlay'\?'travelPlay':'travel'/);
});
