const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('learning-features.js','utf8');
function boot(lang='en'){
 const body={innerHTML:''},deep={innerHTML:'',className:''},classes=new Set(),overlay={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)}};
 const values=new Map(),calls={plays:[],cancel:0,refresh:0,translations:0,resolved:0},q={bankId:'O01-I-L-01',id:'O01-I-L-01',script:'비공개 대본. 내일 세 시에 만나요.',prompt:'남자가 할 일은 무엇입니까?',choices:['예약한다','전화한다','방문한다','기다린다'],answerIndex:2};
 const item={key:'k',id:q.id,level:1,type:'listen',wrongCount:1};
 const c={S:{lang},console,REVIEW_KEY:'review',REVIEW:{items:{k:item}},reviewAttempt:null,document:{getElementById:id=>({sheetBody:body,overlay,tqReviewDeep:deep}[id]||null)},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},reviewQuestion:()=>q,text:(...v)=>v[{ko:0,ja:1,en:2,zh:3}[lang]],esc:s=>String(s??'').replace(/[&<>]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[x])),cleanChoice:s=>s,questionVisual:()=>'',visualChoice:(_q,c)=>`<img alt="${c}" src="option.svg">`,recordReviewWrong(){},saveReview(){},enhance(){},render(){},closeSheet(){classes.delete('open')},toast:m=>calls.toast=m,resolveReview:()=>calls.resolved++,answerNumber:q=>q.answerIndex+1,authoredCoach:()=>true,explanationBlock:()=>'<b>ANSWER COACHING</b>',translateCached:async()=>{calls.translations++;return 'TRANSLATED SECRET'},fetch:async()=>({ok:true})};
 c.window=c;c.HARUMAL_LISTENING_PLAYER={busy:()=>false,cancel:()=>calls.cancel++,refresh:()=>calls.refresh++,markup:(_action,key)=>`<button data-review-audio="${key}" onclick="playReviewListening()">Play audio</button>`,play:config=>{calls.plays.push(config);return config}};
 vm.createContext(c);vm.runInContext(source.slice(source.indexOf('function visualOnlyChoices('),source.indexOf('function visualChoice(')),c);vm.runInContext(source.slice(source.indexOf('function choiceContent('),source.indexOf('function questionVisual(')),c);vm.runInContext(fs.readFileSync('listening-transcripts.js','utf8'),c);vm.runInContext(source.slice(source.indexOf('function localizedReviewType('),source.indexOf('if(typeof renderInfMCQ===')),c);
 return{c,q,item,body,deep,values,calls,classes};
}
test('listening retry has playback and exactly one image per selectable option without showing its script',()=>{
 for(const lang of ['ko','ja','en','zh']){const e=boot(lang);e.c.openReviewRetry('k');assert.match(e.body.innerHTML,/data-review-audio="review:k"/);assert.doesNotMatch(e.body.innerHTML,/비공개 대본|내일 세 시/);assert.match(e.body.innerHTML,/tqTranslationToggle" disabled/);assert.equal((e.body.innerHTML.match(/src="option.svg"/g)||[]).length,4);assert.equal((e.body.innerHTML.match(/onclick="reviewSelect\(/g)||[]).length,4);assert.equal(e.calls.refresh,1);}
});
test('retry playback uses the exact question script and explicit device fallback, stopping on close or another retry',()=>{
 const e=boot();e.c.openReviewRetry('k');const config=e.c.playReviewListening();assert.equal(config.script,e.q.script);assert.equal(config.key,'review:k');assert.equal(config.legacy,null);assert.equal(config.once,false);assert.equal(config.forceDevice,false);assert.equal(config.isCurrent(),true);config.onDevice();assert.equal(e.calls.plays.at(-1).forceDevice,true);
 e.c.closeReviewRetry();assert.equal(config.isCurrent(),false);assert.equal(e.c.reviewAttempt,null);assert.ok(e.calls.cancel>=2);e.c.openReviewRetry('k');assert.equal(config.isCurrent(),false);
});
test('legacy retry fetches only its own level/id and stops a stale HEAD lookup',async()=>{
 const e=boot();delete e.q.bankId;e.q.id=5;e.q.sourceId=7;e.item.level=2;e.c.openReviewRetry('k');const config=e.c.playReviewListening(),urls=[];e.c.fetch=async(url,opts)=>{urls.push(url);assert.equal(opts.method,'HEAD');return{ok:url.endsWith('.m4a')}};assert.equal(await config.legacy({isCurrent:()=>true}),'audio/topik2/q007.m4a');assert.deepEqual(urls,['audio/topik2/q007.mp3','audio/topik2/q007.m4a']);
 let current=true;urls.length=0;e.c.fetch=async url=>{urls.push(url);current=false;return{ok:true}};assert.equal(await config.legacy({isCurrent:()=>current}),null);assert.equal(urls.length,1);
});
test('submitting a listening retry stops audio and makes feedback available only after the second tap',async()=>{
 const e=boot();e.c.openReviewRetry('k');e.c.reviewSelect(2);assert.equal(e.c.reviewAttempt.locked,false);assert.doesNotMatch(e.body.innerHTML,/resultStrip/);const cancellations=e.calls.cancel;e.c.reviewSelect(2);await Promise.resolve();assert.equal(e.c.reviewAttempt.locked,true);assert.equal(e.calls.cancel,cancellations+1);assert.match(e.body.innerHTML,/resultStrip good/);assert.match(e.deep.innerHTML,/ANSWER COACHING/);
});
test('unfinished TOPIK I and II mocks block retry opening, submission, playback, translation and feedback',async()=>{
 for(const level of [1,2]){const e=boot();e.c.openReviewRetry('k');e.c.reviewAttempt.locked=true;if(level===1)e.values.set('topikQuestTopik1Session',JSON.stringify({mode:'real',result:null}));else e.c.S.real={active:true};
  e.c.toggleReviewTranslation();assert.equal(e.c.reviewAttempt.showTranslation,false);assert.equal(await e.c.translatedReviewParts(e.item,e.q),null);assert.equal(await e.c.detailedReviewExplanation(e.item,e.q),'');await e.c.loadReviewTranslation();assert.equal(e.calls.translations,0);e.c.playReviewListening();assert.equal(e.calls.plays.length,0);e.c.reviewSelect(2);assert.equal(e.calls.resolved,0);e.c.renderReviewRetry();assert.match(e.body.innerHTML,/Submit the entire mock/);assert.doesNotMatch(e.body.innerHTML,/대본|ANSWER|correct|TRANSLATED/);e.c.openReviewRetry('k');assert.match(e.calls.toast,/Submit the entire mock/);
 }
});
test('stale translation and explanation promises cannot paint a different retry or an active exam',async()=>{
 const e=boot();e.c.openReviewRetry('k');const old=e.c.reviewAttempt;old.locked=true;old.showTranslation=true;let done;e.c.translatedReviewParts=()=>new Promise(resolve=>done=resolve);const loading=e.c.loadReviewTranslation();e.c.openReviewRetry('k');done({fullText:'OLD SECRET'});await loading;assert.equal(e.c.reviewAttempt.translation,null);assert.equal(old.translation,null);assert.doesNotMatch(e.body.innerHTML,/OLD SECRET/);
 let finish;e.c.detailedReviewExplanation=()=>new Promise(resolve=>finish=resolve);e.c.reviewAttempt.locked=true;e.c.renderReviewRetry();e.c.S.real={active:true};finish('OLD ANSWER');await Promise.resolve();assert.doesNotMatch(e.deep.innerHTML,/OLD ANSWER/);
});
test('generic overlay close and a newly active mock invalidate retry audio ownership',()=>{const e=boot();e.c.openReviewRetry('k');const config=e.c.playReviewListening();e.classes.delete('open');assert.equal(config.isCurrent(),false);e.classes.add('open');e.c.S.real={active:true};assert.equal(config.isCurrent(),false)});

test('partial legacy reading coaching retains detailed strategy and every option explanation',async()=>{
 const e=boot('ja');e.item.type='read';e.item.level=2;
 e.q.stem='Passage evidence';e.q.explanationI18n={ja:'Evidence, trap, and solving strategy'};
 e.q.choiceExplanationsI18n={ja:['first reason','second reason','correct reason','fourth reason']};
 const coach={reason:'Short evidence',trap:'Short trap'};e.c.authoredCoach=()=>coach;
 const html=await e.c.detailedReviewExplanation(e.item,e.q);
 assert.match(html,/class="tqReviewDeep"/);assert.match(html,/Evidence, trap, and solving strategy/);
 assert.equal((html.match(/<li class=/g)||[]).length,4);
 for(const reason of ['first reason','second reason','fourth reason'])assert.ok(html.includes(reason));
 coach.strategy='Authored strategy';coach.choices=Object.fromEntries(e.q.choices.map(choice=>[choice,'Authored choice reason']));
 assert.equal(await e.c.detailedReviewExplanation(e.item,e.q),'<b>ANSWER COACHING</b>');
 e.c.S.real={active:true};assert.equal(await e.c.detailedReviewExplanation(e.item,e.q),'');
});
