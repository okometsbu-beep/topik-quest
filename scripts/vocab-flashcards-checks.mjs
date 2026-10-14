import assert from 'node:assert/strict';
export async function verifyVocabFlashcards({evaluate,tap,shot,setViewport,send,ready,sleep,record}){
 const before=await evaluate(`({state:JSON.stringify(S),storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),theme:document.documentElement.dataset.theme})`);
 const fit=async()=>assert.equal(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),true,'no horizontal overflow');
 const swipe=async(dx,dy=0)=>{const p=await evaluate(`(()=>{const el=document.getElementById('vocabFlashcard');el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});for(let i=1;i<=6;i++){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:p.x+dx*i/6,y:p.y+dy*i/6}]});await sleep(25)}await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(600)};
 try{
  await evaluate(`S.lang='ja';S.vocab=[{text:'학교',ja:'学校',manual:true,interval:9,note:'Keep me'},{text:'사과',meanings:{ja:'りんご'},interval:4},{text:'미등록'}];setView('vocab');malbitSetVocabPageMode('saved')`);
  assert.equal(await evaluate(`document.querySelectorAll('.hfEntry').length`),1);
  await shot('flashcards-entry-ja.png');
  await evaluate(`malbitSetVocabPageMode('library')`);assert.equal(await evaluate(`document.querySelectorAll('.hfEntry').length`),0);
  await evaluate(`malbitSetVocabPageMode('saved')`);await tap('.hfEntry .hfPrimary');
  assert.equal(await evaluate(`S.vocabFlashcards.items.length`),2);
  const words=await evaluate(`JSON.stringify(S.vocab)`);
  for(const theme of ['light','dark'])for(const width of [320,390]){
   await setViewport(width,844);await evaluate(`malbitSetTheme('${theme}')`);await fit();await shot(`flashcards-front-${theme}-${width}.png`);
   await tap('#vocabFlashcard',0,650);await fit();await shot(`flashcards-back-${theme}-${width}.png`);await tap('#vocabFlashcard',0,650);
  }
  await setViewport(390,844);await tap('#vocabFlashcard',0,650);await swipe(105);
  assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),1);assert.equal(await evaluate(`S.vocabFlashcards.revealed`),false,'swipe click must not reveal next card');
  await send('Page.reload',{ignoreCache:true});await ready();assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),1);
  await evaluate(`harumalFlashcardsResume()`);await tap('#vocabFlashcard',0,650);await swipe(-105);
  assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),2);await shot('flashcards-result-ja.png');
  await tap('.hfResult .hfPrimary');assert.equal(await evaluate(`S.vocabFlashcards.items.length`),1);assert.equal(await evaluate(`JSON.stringify(S.vocab)`),words);
  await tap('#flashcardSound');assert.equal(await evaluate(`S.vocabFlashcardSound`),false);
  await tap('#vocabFlashcard',0,650);await tap('.hfKnown',0,600);await evaluate(`harumalFlashcardsExit();harumalFlashcardsStart('manual')`);assert.equal(await evaluate(`S.vocabFlashcards.items.length`),1);
  await evaluate(`S.vocabFlashcards.items[0].meaning='日本語の長い意味を確認します。'.repeat(35);S.vocabFlashcards.revealed=true;render()`);await setViewport(320,844);await fit();await shot('flashcards-long-meaning-320.png');
  const scrollBefore=await evaluate(`(()=>{const el=document.querySelector('.hfMeaningScroll');const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height*.8,top:el.scrollTop,overflow:el.scrollHeight>el.clientHeight}})()`);assert.equal(scrollBefore.overflow,true);
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:scrollBefore.x,y:scrollBefore.y}]});for(let i=1;i<=5;i++){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:scrollBefore.x,y:scrollBefore.y-i*14}]});await sleep(35)}await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(150);
  assert.ok(await evaluate(`document.querySelector('.hfMeaningScroll').scrollTop>0`),'long meaning scrolls inside card');assert.equal(await evaluate(`S.vocabFlashcards.revealed`),true);
  await tap('.hfMeaningScroll .hfCardWord');assert.equal(await evaluate(`S.vocabFlashcards.revealed`),true,'tapping long meaning text must not unexpectedly flip');
  await tap('.hfKnown',0,600);assert.equal(await evaluate(`scrollY`),0,'long meaning completion returns to top of result');
  await evaluate(`S.vocab=[];setView('vocab')`);assert.equal(await evaluate(`document.querySelector('.hfEntry .hfPrimary').disabled`),true);await shot('flashcards-empty-ja.png');
  await evaluate(`S.lang='en';S.vocab=[{text:'학교',meanings:{en:'school'},manual:true}];harumalFlashcardsStart('manual')`);await fit();await shot('flashcards-en-320.png');
  await evaluate(`S.vocab=[{text:'길고 긴 한국어 표현을 끝까지 읽을 수 있어요. '.repeat(15),ja:'長い韓国語の表現'}];harumalFlashcardsStart('all')`);await fit();assert.equal(await evaluate(`document.querySelector('.hfTermScroll').scrollHeight>document.querySelector('.hfTermScroll').clientHeight`),true);await shot('flashcards-long-term-320.png');
  // A real screen recording of the shipped interaction, not a drawn simulation.
  await setViewport(390,844);await evaluate(`S.lang='ja';malbitSetTheme('light');S.vocab=[{text:'설레다',ja:'心がときめく'},{text:'꾸준하다',ja:'こつこつ続ける'},{text:'여유',ja:'心のゆとり'},{text:'다정하다',ja:'優しくて温かい'},{text:'나아가다',ja:'前へ進む'}];harumalFlashcardsStart('all')`);
  assert.equal(await evaluate(`document.querySelectorAll('.hfUnderCard').length`),2);
  assert.equal(await evaluate(`(()=>{const nav=document.querySelector('.nav,.bottomNav,#nav');const buttons=[...document.querySelectorAll('.hfActions button')];return buttons.every(el=>el.getBoundingClientRect().bottom<innerHeight-78)})()`),true,'all action controls stay above bottom navigation without scrolling');
  await shot('flashcards-physical-deck-light.png');
  if(record)await record('flashcards-motion',async()=>{
   await sleep(800);await tap('#vocabFlashcard',0,650);await sleep(300);
   const p=await evaluate(`(()=>{const r=document.getElementById('vocabFlashcard').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
   await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});
   for(let i=1;i<=5;i++){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:p.x+i*7,y:p.y}]});await sleep(80)}
   await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(700);
   assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),0,'short drag springs back without grading');
   await swipe(135);await sleep(450);await tap('#vocabFlashcard',0,650);await sleep(350);await swipe(-135);await sleep(900);
   assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),2);
  });
  await evaluate(`malbitSetTheme('dark');harumalFlashcardsStart('all')`);await shot('flashcards-physical-deck-dark.png');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await tap('#vocabFlashcard',0,80);await tap('.hfKnown',0,80);assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),1);await send('Emulation.setEmulatedMedia',{features:[]});
  console.log('Flashcard mobile checks passed: entry, filters, tap/swipe, reload, duplicate-click guard, retry, mute, themes, 320/390, long/empty/one word, unchanged vocabulary.');
 }finally{await evaluate(`localStorage.clear();for(const [k,v] of Object.entries(${JSON.stringify(before.storage)}))localStorage.setItem(k,v);Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,JSON.parse(${JSON.stringify(before.state)}));document.documentElement.dataset.theme=${JSON.stringify(before.theme)};render()`)}
}
