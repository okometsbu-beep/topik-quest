const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=file=>fs.readFileSync(file,'utf8');
function part(file,start,end){const s=source(file),a=s.indexOf(start),b=s.indexOf(end,a);assert.ok(a>=0&&b>a);return s.slice(a,b)}
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function boot(lang='ko'){
 const c={S:{lang},console,esc:escape,E:escape};c.window=c;c.ml=c.T=(ko,ja,en,zh)=>({ko,ja,en,zh}[c.S.lang]||en);
 c.MALBIT_EXPLANATIONS={topik2Writing:{51:{ko:'LEGACY WRONG GUIDE'}}};vm.createContext(c);
 vm.runInContext(part('learning-features.js','const I18N=','// ----- Persistent wrong-answer review -----'),c);
 c.MALBIT_LEARNING={authoredCoaching:c.authoredCoaching,visualChoice:c.visualChoice,questionVisual:c.questionVisual};
 vm.runInContext(part('topik1.js','function gameTutorMarkup(','async function fileAudio('),c);
 vm.runInContext(source('listening-transcripts.js'),c);
 vm.runInContext(part('learning-features.js','function reviewExamBlocked(){','function syncReviewRewardHelp('),c);
 vm.runInContext(part('learning-features.js','async function detailedReviewExplanation(','function activeReviewItems('),c);
 return c;
}
const options=['학교','도서관','병원','우체국'];
function question(order=[0,1,2,3]){return{bankId:'O01-I-L-01',id:1,section:'listening',script:'여자: 책을 빌립니다.',choices:order.map(i=>options[i]),answerIndex:order.indexOf(1),explanationI18n:{ko:'generated legacy-style summary'},coach:Object.fromEntries(['ko','ja'].map(lang=>[lang,{reason:`${lang} authored evidence`,trap:`${lang} authored trap`,strategy:`${lang} quick strategy`,choices:Object.fromEntries(options.map((x,i)=>[x,`${lang} option-${i} exact reason`]))}]))}}
const permutations=values=>values.length?values.flatMap((v,i)=>permutations(values.filter((_,j)=>i!==j)).map(rest=>[v,...rest])):[[]];
test('TOPIK I/II practice, mock explanation and wrong-review keep all authored options in displayed shuffle order',async()=>{
 for(const lang of ['ko','ja']){const c=boot(lang);for(const order of permutations([0,1,2,3])){
  const q=question(order),outputs=[c.explanationBlock('listen',q),c.gameTutorMarkup(q,0),await c.detailedReviewExplanation({type:'listen',level:1},q)];
  for(const html of outputs){assert.match(html,new RegExp(`${lang} authored evidence`));assert.match(html,new RegExp(`${lang} authored trap`));assert.match(html,new RegExp(`${lang} quick strategy`));assert.doesNotMatch(html,/generated legacy-style/);for(let i=0;i<4;i++)assert.ok(html.includes(`<b>${i+1}. ${options[order[i]]}</b><span>${lang} option-${order[i]} exact reason</span>`));assert.ok(html.includes(`<li class="right"><b>${q.answerIndex+1}. 도서관</b>`));}
 }}
});
test('EN/ZH show a clear original-language fallback without invented option reasons',()=>{
 for(const lang of ['en','zh']){const c=boot(lang),q=question();const html=c.authoredCoaching(q);assert.match(html,lang==='en'?/shown in Korean/:/韩语原文解析/);assert.match(html,/ko option-2 exact reason/);assert.doesNotMatch(html,/undefined|\[object Object\]/);q.coach[lang]={...q.coach.ko,reason:`${lang} authored`};assert.match(c.authoredCoaching(q),new RegExp(`${lang} authored`));assert.doesNotMatch(c.authoredCoaching(q),/shown in Korean|韩语原文解析/);}
});
test('authored writing avoids the legacy numeric-id explanation and escapes all content',()=>{
 const c=boot(),q={...question(),id:51,section:'writing',choices:[],answerIndex:null};q.coach.ko.reason='<script>unsafe()</script>';const html=c.writingExplanationBlock(q);assert.doesNotMatch(html,/LEGACY WRONG GUIDE|<script>/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/tqReviewChoiceAnalysis/);
 const bare={id:51,bankId:'O01-II-W-51',explanationI18n:{ko:'Original writing guide'}};assert.match(c.writingExplanationBlock(bare),/Original writing guide/);assert.doesNotMatch(c.writingExplanationBlock(bare),/LEGACY WRONG GUIDE/);
});
test('visual options map exact text, reject remote/traversal sources and preserve escaped alt text',()=>{
 const c=boot(),q=question([3,1,0,2]);q.visualOptions={kind:'options',byOption:Object.fromEntries(options.map((x,i)=>[x,{src:`assets/original/choice-${i}.svg`,alt:`<scene ${i}>"`}]))};q.visualPending=false;
 q.choices.forEach((choice,i)=>{const html=c.visualChoice(q,choice);assert.match(html,new RegExp(`choice-${[3,1,0,2][i]}\\.svg`));assert.match(html,/alt="&lt;scene \d&gt;&quot;"/)});
 for(const src of ['https://example.com/a.svg','//example.com/a.png','assets/../secret.svg','assets/%2e%2e/a.svg','javascript:alert(1)','assets/a.svg" onerror="alert(1)']){q.visualOptions.byOption['학교'].src=src;assert.equal(c.visualChoice(q,'학교'),'')}
 q.visualPending=true;assert.equal(c.visualChoice(q,'도서관'),'');assert.match(c.questionVisual(q),/준비 중/);
});
test('writing data table has an escaped caption, column headings and row headings',()=>{
 const c=boot(),q={visualPending:false,visualOptions:{kind:'table',caption:'<연도별 변화>',columns:['항목','2023','2025'],rows:[['도서관','30%','45%'],['기타','<10%','20%']]}};const html=c.questionVisual(q);assert.match(html,/<caption>&lt;연도별 변화&gt;<\/caption><thead>/);assert.equal((html.match(/scope="col"/g)||[]).length,3);assert.equal((html.match(/scope="row"/g)||[]).length,2);assert.match(html,/&lt;10%/);assert.doesNotMatch(html,/undefined|\[object Object\]/);
});

function sessionBoot(){
 const c={S:{writing:{saved:'keep'},real:{saved:'keep'}},Q:{saved:'keep'},Date,toast(){c.notices++},notices:0,stopListeningAudio(){},clearQ(){c.Q=null},save(){},saveQ(){},render(){},open(){},T:x=>x,ml:x=>x,pool:()=>[{id:'sample'}],activateTopik2BankSet(...args){c.activation=args},BANK:{nextMockSet:()=>3,mockSets:(level,collectionId)=>Array.from({length:12},(_,i)=>({set:i+1,ready:i===2}))}};c.window=c;c.MALBIT_BANK=c.BANK;vm.createContext(c);
 for(const [file,start] of [['topik1.js','window.t1Begin='],['legacy-core.js','function beginReal(']])vm.runInContext(source(file).split('\n').find(line=>line.startsWith(start)),c);
 return c;
}
test('explicit mock collection and set are persisted while old calls remain legacy',()=>{
 const c=sessionBoot();c.t1Begin('reading',{collectionId:'original12-v1',mockSet:3});assert.equal(c.Q.collectionId,'original12-v1');assert.equal(c.Q.mockSet,3);c.beginReal('write',{collectionId:'original12-v1',mockSet:3});assert.equal(c.S.real.collectionId,'original12-v1');assert.equal(c.S.real.mockSet,3);assert.equal(c.activation[1],'original12-v1');c.t1Begin('full');assert.equal(c.Q.collectionId,'legacy-original-v1');c.beginReal('full');assert.equal(c.S.real.collectionId,'legacy-original-v1');
});
test('unready or unknown original sets cannot clear progress, create timers or start section exams',()=>{
 const c=sessionBoot();for(const kind of ['full','reading','listening'])assert.equal(c.t1Begin(kind,{collectionId:'original12-v1',mockSet:2}),false);for(const kind of ['full','read','listen','write'])assert.equal(c.beginReal(kind,{collectionId:'original12-v1',mockSet:2}),false);assert.equal(c.Q.saved,'keep');assert.equal(c.S.real.saved,'keep');assert.equal(c.S.writing.saved,'keep');assert.equal(c.activation,undefined);delete c.BANK.mockSets;assert.equal(c.t1Begin('full',{collectionId:'original12-v1'}),false);assert.equal(c.beginReal('full',{collectionId:'original12-v1'}),false);c.t1Begin('full');assert.equal(c.Q.collectionId,'legacy-original-v1');c.beginReal('full');assert.equal(c.S.real.collectionId,'legacy-original-v1');
});
test('saved set restoration and TOPIK I pool forward collection with a legacy default',()=>{
 const c=sessionBoot();c.BANK.mock=(...args)=>{c.poolArgs=args;return[]};vm.runInContext(part('topik1.js','function pool(k){','function shuffle('),c);c.Q={mockSet:7,collectionId:'original12-v1'};c.pool('reading');assert.deepEqual(c.poolArgs,[1,7,'reading','original12-v1']);delete c.Q.collectionId;c.pool('listening');assert.equal(c.poolArgs[3],'legacy-original-v1');
 const legacy=source('legacy-core.js');assert.match(legacy,/activateTopik2BankSet\(r\.mockSet,r\.collectionId\|\|'legacy-original-v1',r\.choiceOrders\)/);assert.match(legacy,/collectionId:S\.real\.collectionId\|\|'legacy-original-v1'/);assert.match(source('learning-features.js'),/activateTopik2BankSet\(S\.lastResult\.mockSet,S\.lastResult\.collectionId\|\|'legacy-original-v1',S\.lastResult\.choiceOrders\)/);
});

test('TOPIK II random feedback supplies authored inline content to the existing collapsible final owner',()=>{
 const c=boot(),q=question();c.renderInfMCQ=()=>'<article><div class="resultStrip"></div><button class="primary" style="margin-top:10px">Next</button></article>';c.S.infinity={feedback:null};vm.runInContext(part('learning-features.js',"if(typeof renderInfMCQ==='function'){","if(typeof renderRandomWriting==='function'){"),c);assert.doesNotMatch(c.renderInfMCQ(q,'listen'),/tqInlineExplanation/);c.S.infinity.feedback={ok:true};const html=c.renderInfMCQ(q,'listen');assert.match(html,/tqInlineExplanation/);assert.match(html,/ko option-3 exact reason/);assert.ok(html.indexOf('ko quick strategy')<html.indexOf('<button class="primary"'));assert.match(source('app-polish-v24.js'),/if\(inline\)\{panel\.replaceChildren\(inline\)/);
});
test('standalone question image is local-only and escapes caption and alt text',()=>{
 const c=boot(),q={visualOptions:{kind:'image',src:'assets/original/notice.svg',alt:'<notice>"',caption:'<caption>'},visualPending:false};const html=c.questionVisual(q);assert.match(html,/src="assets\/original\/notice.svg"/);assert.match(html,/alt="&lt;notice&gt;&quot;"/);assert.match(html,/<figcaption>&lt;caption&gt;<\/figcaption>/);q.visualOptions.src='https://example.com/notice.svg';assert.equal(c.questionVisual(q),'');q.visualPending=true;assert.match(c.questionVisual(q),/준비 중/);
});

test('authored writing rubric is self-check guidance, never a score guarantee, with explicit locale fallback',()=>{
 const c=boot('ja'),q={...question(),section:'writing',id:51,choices:[],rubric:{score:10,note:'같은 기능도 허용',criteria:['문맥 확인','<형식 확인>']}};let html=c.writingExplanationBlock(q);assert.match(html,/公式採点や得点予測ではありません/);assert.match(html,/韓国語の原文/);assert.match(html,/&lt;형식 확인&gt;/);assert.doesNotMatch(html,/10점|10点|10 points|undefined|\[object Object\]/);q.rubric.ja={note:'同じ機能の表現も可能',criteria:['文脈を確認','形式を確認']};html=c.writingExplanationBlock(q);assert.match(html,/同じ機能の表現も可能/);assert.doesNotMatch(html,/韓国語の原文/);
 for(const lang of ['en','zh']){c.S.lang=lang;html=c.writingExplanationBlock(q);assert.match(html,lang==='en'?/not official grading or a score prediction/:/不是正式评分或分数预测/);assert.match(html,lang==='en'?/Korean original/:/韩语原文/)}
});

test('new TOPIK I results disclose accuracy conversion in every locale without changing legacy scoring',()=>{
 const c=boot(),screen={};c.restore=()=>{};c.gradeText=()=> 'practice';c.Q={mode:'real',collectionId:'original12-v1',result:{lt:30,lc:15,ls:50,rt:40,rc:20,rs:50,total:100,wrong:[]}};vm.runInContext(part('topik1.js','function renderResult(sc){','const baseRender=render;'),c);
 for(const [lang,needle] of [['ko','학습용 정답률 환산'],['ja','学習用の正答率換算'],['en','Study score based on accuracy'],['zh','按正确率换算的学习分数']]){c.S.lang=lang;c.renderResult(screen);assert.ok(screen.innerHTML.includes(needle));assert.match(screen.innerHTML,/100<small> \/ 200<\/small>/)}
 delete c.Q.collectionId;c.renderResult(screen);assert.doesNotMatch(screen.innerHTML,/t1StudyScoreNote/);assert.match(screen.innerHTML,/100<small> \/ 200<\/small>/);
});

test('new collection missing translations reports pending without forced Korean or Japanese coaching',()=>{for(const lang of ['en','zh']){const c=boot(lang),q={...question(),collectionId:'original12-v1'};let html=c.explanationBlock('listen',q);assert.match(html,/tqAuthoredPending/);assert.doesNotMatch(html,/ko authored|ja authored|ko option|ja option/);q.section='writing';q.rubric={note:'원문 기준',criteria:['원문 항목']};html=c.writingExplanationBlock(q);assert.match(html,/tqAuthoredPending/);assert.doesNotMatch(html,/원문 기준|원문 항목|ko authored|ja authored/)}});
