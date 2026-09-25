const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('startup opens the app directly without onboarding or level diagnostics', () => {
  const product = read('product-polish.js');
  const growth = read('product-growth.js');
  assert.doesNotMatch(product, /function showOnboarding|setTimeout\(showOnboarding/);
  assert.doesNotMatch(growth, /function startDiagnostic|function renderDiagnostic|diagnosticPending.*startDiagnostic/);
  assert.match(growth, /function retireStartupGates\(\)/);
});

test('a fresh visit follows a supported browser language without replacing saved learner state', () => {
  const vm = require('node:vm');
  const source = read('legacy-core.js');
  const startup = source.slice(0, source.indexOf('function save()')) + '\nthis.__state=S;this.__default=DEFAULT;';
  const boot = ({languages = [], language = '', stored = null} = {}) => {
    const context = {
      document: {getElementById() {}},
      navigator: {languages, language},
      localStorage: {getItem: key => key === 'topikQuestV8' ? stored : null},
    };
    vm.createContext(context);
    vm.runInContext(startup, context);
    return JSON.parse(JSON.stringify({state: context.__state, defaults: context.__default}));
  };

  assert.equal(boot({languages: ['ja-JP', 'en-US'], language: 'ja-JP'}).state.lang, 'ja');
  assert.equal(boot({languages: ['fr-FR'], language: 'fr-FR'}).state.lang, 'ko', 'unsupported locales retain the existing Korean fallback');

  const saved = boot({
    languages: ['ja-JP'],
    language: 'ja-JP',
    stored: JSON.stringify({lang: 'zh', gameUnlock: 17, vocab: [{text: '여행'}]}),
  }).state;
  assert.equal(saved.lang, 'zh', 'an explicit saved language wins over browser preference');
  assert.equal(saved.gameUnlock, 17);
  assert.deepEqual(saved.vocab, [{text: '여행'}]);
});

test('Home keeps beginner and TOPIK selection independent and routes one explicit primary lesson', () => {
  const topik = read('topik1.js');
  const beginner = read('app-polish-v35.js');
  assert.match(topik, /localStorage\.getItem\(LEVEL\)==='2'\?2:1/, 'an absent exam level must not default a new learner to TOPIK II');
  assert.match(topik, /return'beginner'/, 'a learner without a saved path starts at beginner');
  assert.match(topik, /prefs\.learningPath=path/, 'the active learning path is stored inside the portable preferences root');
  assert.match(topik, /if\(path==='beginner'\)return setView\('beginner'\)/, 'the Home primary CTA must follow the visible beginner path');
  assert.match(topik, /matchingSession=.*Number\(session\.examLevel\|\|1\)===lv/, 'only a session for the selected TOPIK level may be resumed');
  assert.match(topik, /const continueLabel=beginnerPath/, 'the CTA label is derived from the same path as its destination');
  assert.match(beginner, /tqSetLearningPath==='function'.*tqSetLearningPath\('beginner'\)/, 'the beginner selector records its path without rewriting the exam level');
  assert.doesNotMatch(beginner, /setItem\('topikQuestExamLevel'.*beginner/, 'beginner must not overwrite the saved TOPIK level');
});

test('bottom navigation routes are rendered and guarded against a frozen screen', () => {
  const index = read('index.html');
  const topik1 = read('topik1.js');
  const polish = read('app-polish-v22.js');
  for (const view of ['home', 'review', 'vocab', 'more']) {
    assert.match(index, new RegExp(`setView\\('${view}'\\)`));
  }
  assert.match(topik1, /setView\('stats'\)/);
  assert.match(polish, /\[MALBIT navigation\]/);
  assert.match(polish, /intro&&intro\.textContent!==introText/);
  assert.doesNotMatch(polish, /#malbitOnboarding,#malbitDiagnostic/);
});

test('one release version reaches returning mobile users', () => {
  const index = read('index.html');
  const bootstrap = read('site-patch.js');
  const worker = read('sw.js');
  const versions = [index.match(/const appVersion='(\d+)'/)?.[1], bootstrap.match(/const VERSION='(\d+)'/)?.[1], worker.match(/const VERSION='(\d+)'/)?.[1]];
  assert.ok(versions.every(Boolean));
  assert.equal(new Set(versions).size, 1);
  assert.match(bootstrap, /'app-polish-v35\.js'/);
  assert.match(bootstrap, /'data\/beginner-grammar-v1\.js'/);
  assert.match(bootstrap, /'beginner-grammar\.js'/);
  assert.match(read('index.html'), /swReloadKey=`malbitSwReloadV\$\{appVersion\}`/);
  assert.match(read('index.html'), /register\(`\.\/sw\.js\?v=\$\{appVersion\}`/);
  assert.match(read('index.html'), /if\(!navigator\.serviceWorker\.controller\)/);
  const product = read('product-polish.js');
  assert.doesNotMatch(product, /serviceWorker\.register/);
  assert.match(read('index.html'), /site-patch\.js\?v=\$\{appVersion\}/);
  assert.match(product, /function appVersion\(\).*__MALBIT_RUNTIME__/);
  assert.match(product, /<span>v\$\{html\(appVersion\(\)\)\}<\/span>/);
  for (const file of ['app-polish-v22.js', 'app-polish-v24.js']) {
    assert.match(read(file), /badge.*__MALBIT_RUNTIME__/);
    assert.doesNotMatch(read(file), /badge\.textContent='v\d+'/);
  }
});

test('multilingual explanations follow the displayed choice order in every mode', () => {
  const engine = read('question-bank-engine.js');
  const topik1 = read('topik1.js');
  const learning = read('learning-features.js');
  assert.match(engine, /explain:\s*explanationPack/);
  assert.match(engine, /choiceExplanationsI18n/);
  assert.match(topik1, /BANK\.explain\(item\.bankId,set\.correct,set\.items\.map/);
  assert.match(learning, /q\?\.bankId&&q\.explanationI18n\?\.\[lang\]/);
  assert.match(learning, /reason=q\.explanationI18n\?\.\[lang\]/);
});

test('v34 makes listening choices interactive and adds handwriting practice', () => {
  const v34 = read('app-polish-v34.js');
  assert.match(v34, /button\.onclick=event=>/);
  assert.match(v34, /aria-pressed/);
  assert.match(v34, /malbitSetListeningMode=mode/);
  assert.match(v34, /malbitHangulCanvas/);
  assert.match(v34, /pointerdown/);
  assert.match(v34, /malbitBeginnerWritingDone/);
  assert.match(v34, /grid-template-columns:repeat\(4,1fr\)/);
});

test('v35 unifies beginner level and expands recognized handwriting practice', () => {
  const v35 = read('app-polish-v35.js');
  assert.match(v35, /v35ThreeLevels/);
  assert.match(v35, /v33BeginnerLaunch\{display:none/);
  assert.match(v35, /v35SingleLanguage/);
  assert.match(v35, /words:\[/);
  assert.match(v35, /vocab:\[/);
  assert.match(v35, /sentences:\[/);
  assert.match(v35, /scoreCurrentPad/);
  assert.match(v35, /playDing/);
  assert.match(v35, /setTimeout\(advanceWriting,720\)/);
});

test('beginner grammar loads after handwriting and keeps one beginner progress root', () => {
  const bootstrap = read('site-patch.js');
  const grammar = read('beginner-grammar.js');
  const dataIndex = bootstrap.indexOf("'data/beginner-grammar-v1.js'");
  const handwritingIndex = bootstrap.indexOf("'app-polish-v35.js'");
  const grammarIndex = bootstrap.indexOf("'beginner-grammar.js'");
  assert.ok(dataIndex >= 0 && handwritingIndex >= 0 && grammarIndex >= 0);
  assert.ok(dataIndex < grammarIndex);
  assert.ok(handwritingIndex < grammarIndex);
  assert.match(grammar, /BEGINNER_KEY='malbitBeginnerV1'/);
  assert.match(grammar, /value\.grammarV1=/);
  assert.doesNotMatch(grammar, /localStorage\.clear/);
});

test('v33 supplies theme, listening, stable trail, language and beginner affordances', () => {
  const v33 = read('app-polish-v33.js');
  assert.match(v33, /MALBIT_LISTENING_ENABLED/);
  assert.match(v33, /malbitSetListeningMode/);
  assert.match(v33, /patchStatsLanguage/);
  assert.match(v33, /tqReviewScreen\{background:#071321/);
  assert.match(v33, /t1TrailRoute\{height:774px.*overflow:hidden/);
  assert.match(v33, /t1TrailToast\{position:fixed/);
  assert.match(v33, /HANGUL START/);
  assert.match(v33, /qno\{box-sizing:border-box/);
});

test('goal-led home follows the selected path and preserves interrupted TOPIK II practice',()=>{
  const vm=require('node:vm'),source=read('topik1.js');
  const homeSource=source.slice(source.lastIndexOf('home=function(sc){'),source.indexOf('\nfunction renderSetup',source.lastIndexOf('home=function(sc){')));
  const actionSource=source.slice(source.indexOf('window.tqHomeContinue=()=>{'),source.indexOf('\nconst css=',source.indexOf('window.tqHomeContinue=()=>{')));
  for(const language of ['ko','ja','en','zh'])for(const path of ['beginner','topik1','topik2']){
    const c={S:{lang:language},learningPath:()=>path,level:()=>1,shortsStats:()=>({weekCount:0,week:[]}),restore:()=>null,beginnerStarted:()=>false,navActive(){},setProgress(){},syncStatsNav(){},LANGS:{[language]:{flag:'🌐'}},T:(...a)=>a[['ko','ja','en','zh'].indexOf(language)],setView:v=>c.destination=v,open:v=>c.destination=v,startPractice:()=>c.destination='t1quiz',startRandomPractice:()=>c.destination='infinity'};
    c.MALBIT_REVIEW={items:()=>({pending:{active:true},done:{active:false}})};c.window=c;vm.createContext(c);vm.runInContext(homeSource+'\n'+actionSource,c);const sc={};c.home(sc);assert.equal((sc.innerHTML.match(/class="tqLessonStart"/g)||[]).length,1);
    for(const item of ['tqTravelFeature','tqHomeReview','tqExtraPractice',"tqStartMode('real')","tqStartMode('game')","tqStartMode('shorts')"])assert.ok(sc.innerHTML.includes(item));
    assert.doesNotMatch(sc.innerHTML,/undefined|NaN|STAGE|tqV9Ring/);c.tqHomeContinue();assert.equal(c.destination,path==='beginner'?'beginner':path==='topik1'?'t1quiz':'infinity');
    if(path==='topik2'){c.S.infinity={active:true,examLevel:2};c.startRandomPractice=()=>{throw Error('must resume, not replace')};c.tqHomeContinue();assert.equal(c.destination,'infinity');}
  }
});
