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
vm.runInContext(read('data/question-bank-practice-v1.js'), context);
vm.runInContext(read('question-bank-engine.js'), context);
vm.runInContext(read('data/travel-pack-seoul-001.js'), context);
vm.runInContext(read('data/travel-myeongdong-hub.js'), context);

const bank = context.window.MALBIT_BANK;
const packs = context.window.MALBIT_TRAVEL_PACKS;
const hubs = context.window.MALBIT_TRAVEL_HUBS;
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
  const sprite=pack.skins[0].sprite;
  assert.equal(sprite.image,'assets/art/travel/rpg/traveler-blue-4dir-v1.png');
  assert.deepEqual({...sprite.layout},{columns:8,rows:4,cellWidth:192,cellHeight:272});
  assert.deepEqual({...sprite.directions},{down:0,left:1,right:2,up:3});
  assert.deepEqual({...sprite.states.walk},{start:4,frames:4,fps:12});
  assert.deepEqual({...sprite.states.idle},{start:0,frames:4,fps:4});
  assert.deepEqual({...sprite.footAnchor},{x:.5,y:.9375});
  const spritePng=fs.readFileSync(path.join(root,sprite.image));
  assert.equal(spritePng.subarray(1,4).toString(),'PNG');
  assert.equal(spritePng.readUInt32BE(16),sprite.layout.columns*sprite.layout.cellWidth);
  assert.equal(spritePng.readUInt32BE(20),sprite.layout.rows*sprite.layout.cellHeight);
  assert.ok([3,6].includes(spritePng[25]),'sprite PNG must use transparent palette or RGBA pixels');
  if(spritePng[25]===3)assert.ok(spritePng.includes(Buffer.from('tRNS')),'palette sprite must preserve transparency');
  assert.ok(spritePng.length<700000,'sprite must stay below the reliable static-asset delivery budget');

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

test('travel Korean and Japanese guidance stays faithful to the real route context', () => {
  const scenes = Object.fromEntries(packs[0].scenes.map(scene => [scene.id, scene]));
  const station = scenes['q-station'];
  const destination = scenes['q-myeongdong'];
  const thanks = scenes['q-thanks'];
  assert.equal(station.question.script, '공항철도가 어디예요?');
  assert.equal(station.question.prompt, '공항철도가 어디예요?');
  assert.match(station.question.explanationI18n.ja, /空港鉄道/);
  assert.match(station.question.explanationI18n.ja, /이\/가 어디예요\?/);
  assert.equal(destination.title.ja, 'キオスクで明洞を探そう');
  assert.match(destination.context.ja, /直通切符の券売機ではありません/);
  assert.match(destination.question.explanationI18n.ja, /最終目的地/);
  assert.match(destination.question.explanationI18n.ja, /서울역.*途中駅/);
  assert.equal(thanks.question.choices.find(choice => choice.ko === '미안합니다.').ja, 'すみません。');

  const hub = hubs[0];
  assert.match(hub.events.daytime.explanation.ko, /명동 관광안내소가 어디에 있어요\?/);
  assert.match(hub.events.daytime.explanation.ja, /「가」/);
  assert.match(hub.events.daytime.explanation.ja, /「어디에 있어요\?」/);
  assert.match(hub.events.stationSign.conversation.at(-1).support.ja, /ハングル音節ブロック/);
  assert.match(hub.events.stationSign.instruction.ja, /ハングル音節ブロック/);
  assert.equal(hub.events.menuBudget.conversation.at(-1).korean, '좋아요. 5,000원으로 몇 개까지 살 수 있는지 계산해 볼까요?');
  assert.equal(hub.events.menuBudget.conversation.at(-1).support.ja, 'では、5,000ウォンで何個まで買えるか計算してみましょう。');
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

test('Myeongdong hub is a layered, localized, time-aware learning game extension', () => {
  assert.equal(hubs.length,1);
  const hub=hubs[0];
  assert.equal(hub.routeId,packs[0].id);
  assert.deepEqual(Object.keys(hub.events),['daytime','evening','stationSign','menuBudget']);
  assert.equal(hub.events.daytime.interaction,'free-compose');
  assert.equal(hub.events.evening.interaction,'free-compose');
  assert.deepEqual(Array.from(hub.events.daytime.answer),['명동','관광안내소','가','어디','에','있어요?']);
  assert.deepEqual(Array.from(hub.events.evening.answer),['호떡','한','개','주세요.']);
  assert.ok(hub.events.daytime.tokens.length>=20,'day dialogue needs a broad word and particle bank');
  assert.ok(hub.events.evening.tokens.length>=15,'evening dialogue needs varied order vocabulary');
  assert.ok(hub.events.daytime.accepted.length>=4&&hub.events.evening.accepted.length>=4,'meaningful alternative sentences need partial-reward rules');
  assert.equal(hub.events.stationSign.interaction,'sign-build');
  assert.deepEqual(Array.from(hub.events.stationSign.answer),['명','동','역']);
  assert.ok(hub.events.stationSign.tokens.length>hub.events.stationSign.answer.length,'sign build needs decoy syllables');
  for(const syllable of hub.events.stationSign.answer)assert.ok(hub.events.stationSign.tokens.includes(syllable),`sign token ${syllable} is missing`);
  assert.equal(hub.events.menuBudget.interaction,'price-budget');
  assert.equal(hub.events.menuBudget.budget,5000);
  assert.equal(hub.events.menuBudget.targetQuantity,2);
  assert.deepEqual(Array.from(hub.events.menuBudget.menu,item=>[item.name,item.price]),[['호떡',2000],['계란빵',2000],['떡볶이',4000]]);
  assert.ok(hub.events.menuBudget.menu.find(item=>item.id===hub.events.menuBudget.targetItem),'budget target must exist on the menu');
  assert.equal(hub.events.menuBudget.menu.find(item=>item.id===hub.events.menuBudget.targetItem).price*hub.events.menuBudget.targetQuantity,4000);
  assert.deepEqual(Array.from(hub.exchange,item=>item.cost),[2000,3000,3500,5000]);
  assert.deepEqual(Array.from(hub.exchange,item=>item.unlock),['always','evening','sign','quest']);
  for(const field of ['title','subtitle','location'])assertI18n(hub[field],`hub.${field}`);
  for(const event of Object.values(hub.events)){
    for(const field of ['badge','title','speaker','dialogue','instruction','prompt','success','explanation'])assertI18n(event[field],`hub.${event.id}.${field}`);
    assert.ok(event.conversation.length>=3,`${event.id} should exchange several NPC/player turns before the task`);
    for(const [index,turn] of event.conversation.entries()){assert.ok(turn.korean,`${event.id}.conversation.${index}.korean is missing`);assertI18n(turn.support,`${event.id}.conversation.${index}.support`)}
  }
  for(const item of hub.exchange){assertI18n(item.name,`hub.${item.id}.name`);assertI18n(item.detail,`hub.${item.id}.detail`)}
  for(const [group,assets] of Object.entries(hub.assets))for(const [key,file] of Object.entries(assets)){
    assert.ok(fs.existsSync(path.join(root,file)),`hub ${group}.${key} is missing`);
    assert.ok(fs.statSync(path.join(root,file)).size>1000,`hub ${group}.${key} must be generated art`);
  }
  assert.equal(hub.sources.length,4);
  for(const source of hub.sources)assert.match(source.url,/^https:\/\//);
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
  assert.ok(bootstrap.indexOf("'data/travel-map-seoul-v1.js'") < bootstrap.indexOf("'travel-rpg-engine.js'"));
  assert.ok(bootstrap.indexOf("'travel-rpg-engine.js'") < bootstrap.indexOf("'travel-mode.js'"));
  assert.match(bootstrap,/preloadImage\('assets\/art\/travel\/rpg\/traveler-blue-4dir-v1\.png'\)/);
  assert.ok(bootstrap.indexOf("'question-bank-engine.js'") < bootstrap.indexOf("'travel-mode.js'"));
  assert.ok(bootstrap.indexOf("'topik1.js'") < bootstrap.indexOf("'travel-mode.js'"));
  assert.match(runtime, /const STORAGE_KEY='malbitStoryV1'/);
  assert.match(runtime, /MALBIT_REVIEW\?\.record/);
  assert.match(runtime, /function cleanScript/);
  assert.match(runtime, /function resetViewport/);
  assert.match(runtime, /function resetTransient/);
  assert.match(runtime, /function normalizeMetrics/);
  assert.match(runtime, /window\.malbitTravelMetrics/);
  assert.match(runtime, /window\.malbitTravelStep/);
  assert.match(runtime, /window\.malbitTravelInteract/);
  assert.match(runtime, /state\.exploration=RPG\.normalizeProgress/);
  assert.doesNotMatch(runtime, /document\.documentElement\.style\.colorScheme='dark'/);
  assert.match(runtime, /localOnly:true/);
  assert.doesNotMatch(runtime, /navigator\.sendBeacon|XMLHttpRequest|\bfetch\s*\(/);
  assert.match(runtime, /function compositionResult/);
  assert.match(runtime, /partialReward/);
  assert.match(runtime, /window\.LANGS\?\.\[lang\(\)\]\?\.flag/);
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
  vm.runInContext(read('data/question-bank-practice-v1.js'), runtime);
  vm.runInContext(read('question-bank-engine.js'), runtime);
  vm.runInContext(read('data/travel-pack-seoul-001.js'), runtime);
  vm.runInContext(read('data/travel-myeongdong-hub.js'), runtime);
  runtime.MALBIT_REVIEW = { record: (...args) => reviews.push(args) };
  vm.runInContext(read('travel-mode.js'), runtime);

  runtime.malbitTravelOpen();
  assert.equal(runtime.S.view, 'travel');
  assert.match(screen.innerHTML, /여행모드/);
  assert.match(screen.innerHTML, /서울역/);
  assert.match(screen.innerHTML, /내 여행자/);
  assert.match(screen.innerHTML, /이 기기의 여행 기록/);
  assert.match(screen.innerHTML, /외부로 전송하지 않습니다/);
  assert.equal(runtime.malbitTravelMetrics().routeStarts,0);
  assert.equal(runtime.malbitTravelMetrics().priceQuestStarts,0);
  assert.equal(runtime.malbitTravelMetrics().priceQuestCompletionRate,null);
  assert.match(screen.innerHTML,/가격 퀘스트 완료율/);
  assert.match(screen.innerHTML,/기록이 쌓이면 여기서 연습 요령을 알려드려요/);
  assert.match(screen.innerHTML,/가격 × 개수 → 예산 − 합계/);
  runtime.malbitTravelStart('route-001-airport-myeongdong', false);
  assert.match(screen.innerHTML, /한국 여행이 시작됐다/);
  assert.equal(runtime.malbitTravelMetrics().routeStarts,1);
  assert.equal(runtime.malbitTravelMetrics().completionRate,0);
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
  assert.equal(completedStore.metrics.routeStarts,1);
  assert.equal(completedStore.metrics.routeCompletions,1);
  assert.equal(runtime.malbitTravelMetrics().completionRate,100);
  assert.equal(runtime.malbitTravelMetrics().myeongdongEntryRate,0);

  completed.clockMinutes=600;
  const storeAtMyeongdong=JSON.parse(runtimeStorage.get('malbitStoryV1'));
  storeAtMyeongdong.episodes[pack.id]=completed;
  runtimeStorage.set('malbitStoryV1',JSON.stringify(storeAtMyeongdong));
  const beforeHubWallet=completed.wallet;
  runtime.malbitTravelBack();
  assert.match(screen.innerHTML,/명동 다음 퀘스트/);
  runtime.malbitTravelContinue(pack.id);
  assert.match(screen.innerHTML,/명동 여행 허브/);
  assert.match(screen.innerHTML,/게임 재화 전용 · 결제 없음/);
  assert.equal(runtime.malbitTravelMetrics().myeongdongEntries,1);
  assert.equal(runtime.malbitTravelMetrics().myeongdongEntryRate,100);
  assert.equal(runtime.malbitTravelMetrics().collectibleExchangeRate,0);
  assert.match(screen.innerHTML,/여행안내원에게 길을 묻자/);
  runtime.malbitTravelTalk();
  assert.match(screen.innerHTML,/NPC TALK/);
  assert.match(screen.innerHTML,/NPC TALK · 1\/5/);
  runtime.malbitTravelOrderStart();
  assert.match(screen.innerHTML,/FREE COMPOSE · NPC TALK/);
  for(const index of [6,7,12,14,15,16])runtime.malbitTravelOrderAdd(index);
  runtime.malbitTravelOrderSubmit();
  const afterHubQuest=JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(afterHubQuest.myeongdong.quests['guide-directions'].completed,true);
  assert.equal(afterHubQuest.wallet,beforeHubWallet+2500);
  assert.ok(afterHubQuest.inventory.includes('hangulStampPostcard'));
  assert.match(screen.innerHTML,/NPC QUEST CLEAR/);
  runtime.malbitTravelMyeongdongOpen();
  assert.match(screen.innerHTML,/명동역 표지판을 완성하자/);
  runtime.malbitTravelTalk();
  runtime.malbitTravelOrderStart();
  assert.match(screen.innerHTML,/SIGN BUILD · HANGUL/);
  for(const index of [2,0,3])runtime.malbitTravelOrderAdd(index);
  runtime.malbitTravelOrderSubmit();
  const afterSignQuest=JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(afterSignQuest.myeongdong.quests['myeongdong-station-sign'].completed,true);
  assert.equal(afterSignQuest.wallet,beforeHubWallet+4300);
  assert.ok(afterSignQuest.inventory.includes('myeongdongExitBadge'));
  assert.match(screen.innerHTML,/SIGN QUEST CLEAR/);
  assert.match(screen.innerHTML,/명동역/);
  runtime.malbitTravelMyeongdongOpen();
  assert.match(screen.innerHTML,/여행 원으로 호떡을 주문하자/);
  runtime.malbitTravelTalk();
  runtime.malbitTravelOrderStart();
  assert.equal(runtime.malbitTravelMetrics().priceQuestStarts,1);
  runtime.malbitTravelBudgetSubmit();
  assert.equal(runtime.malbitTravelMetrics().priceQuestWrongSubmissions,1);
  runtime.malbitTravelBudgetChange(1);
  runtime.malbitTravelBudgetSubmit();
  const afterBudget=JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(afterBudget.wallet,beforeHubWallet+300);
  assert.equal(runtime.malbitTravelMetrics().priceQuestCompletions,1);
  assert.equal(runtime.malbitTravelMetrics().priceQuestCompletionRate,100);
  assert.equal(runtime.malbitTravelMetrics().priceQuestAverageWallet,afterBudget.wallet);
  runtime.malbitTravelOrderStart();
  runtime.malbitTravelBudgetSubmit();
  runtime.malbitTravelBudgetChange(1);
  runtime.malbitTravelBudgetSubmit();
  const afterBudgetReplay=JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(afterBudgetReplay.wallet,afterBudget.wallet,'replaying a cleared price quest must not spend again');
  assert.equal(runtime.malbitTravelMetrics().priceQuestStarts,1);
  assert.equal(runtime.malbitTravelMetrics().priceQuestCompletions,1);
  assert.equal(runtime.malbitTravelMetrics().priceQuestWrongSubmissions,1,'replay mistakes must not skew the first-clear funnel');
  assert.equal(runtime.malbitTravelMetrics().priceQuestWalletTotal,afterBudget.wallet);
  runtime.malbitTravelMyeongdongOpen();
  runtime.malbitTravelBuy('namsanCharm');
  const afterExchange=JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(afterExchange.wallet,beforeHubWallet-4700);
  assert.ok(afterExchange.inventory.includes('namsanCharm'));
  assert.equal(afterExchange.spent.at(-1).currency,'travel-won');
  assert.match(screen.innerHTML,/여행 가방에 저장/);
  assert.equal(runtime.malbitTravelMetrics().myeongdongEntries,1,'reopening the hub must not double-count one route');
  assert.equal(runtime.malbitTravelMetrics().exchangeSessions,1);
  assert.equal(runtime.malbitTravelMetrics().collectibleExchangeRate,100);
  runtime.S.lang='ja';
  runtime.malbitTravelOpen();
  assert.match(screen.innerHTML,/この記録からの学習ヒント/);
  assert.match(screen.innerHTML,/計算を2段階に分けると、ミスを減らせます/);
  assert.match(screen.innerHTML,new RegExp(`完了率100%・誤答1回・完了後の平均${afterBudget.wallet.toLocaleString('en-US')}旅ウォン`));
  runtime.S.lang='ko';

  runtime.malbitTravelBack();
  runtime.malbitTravelStart(pack.id, false);
  const resumed = JSON.parse(runtimeStorage.get('malbitStoryV1')).episodes[pack.id];
  assert.equal(resumed.completed, true, 'viewing a result must not reset a completed case');
  assert.match(screen.innerHTML, /ROUTE CLEAR/);

  runtime.malbitTravelRestart(pack.id);
  assert.equal(runtime.malbitTravelMetrics().routeStarts,2);
  assert.equal(runtime.malbitTravelMetrics().routeCompletions,1);
  assert.equal(runtime.malbitTravelMetrics().completionRate,50);
  assert.equal(runtime.malbitTravelMetrics().myeongdongEntryRate,100);
  assert.equal(runtime.malbitTravelMetrics().collectibleExchangeRate,100);
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
