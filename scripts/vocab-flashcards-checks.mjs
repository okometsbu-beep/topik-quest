import assert from 'node:assert/strict';
export async function verifyVocabFlashcards({evaluate,tap,shot,setViewport,send,ready,sleep}){
 const before=await evaluate(`({state:JSON.stringify(S),storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),theme:document.documentElement.dataset.theme})`);
 const fit=async()=>assert.equal(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),true,'no horizontal overflow');
 const swipe=async(dx,dy=0)=>{const p=await evaluate(`(()=>{const el=document.getElementById('vocabFlashcard');el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});for(let i=1;i<=6;i++){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:p.x+dx*i/6,y:p.y+dy*i/6}]});await sleep(25)}await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(250)};
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
   await tap('#vocabFlashcard');await fit();await shot(`flashcards-back-${theme}-${width}.png`);await tap('#vocabFlashcard');
  }
  await setViewport(390,844);await tap('#vocabFlashcard');await swipe(105);
  assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),1);assert.equal(await evaluate(`S.vocabFlashcards.revealed`),false,'swipe click must not reveal next card');
  await send('Page.reload',{ignoreCache:true});await ready();assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),1);
  await evaluate(`harumalFlashcardsResume()`);await tap('#vocabFlashcard');await swipe(-105);
  assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),2);await shot('flashcards-result-ja.png');
  await tap('.hfResult .hfPrimary');assert.equal(await evaluate(`S.vocabFlashcards.items.length`),1);assert.equal(await evaluate(`JSON.stringify(S.vocab)`),words);
  await tap('#flashcardSound');assert.equal(await evaluate(`S.vocabFlashcardSound`),false);
  await tap('#vocabFlashcard');await tap('.hfKnown');await evaluate(`harumalFlashcardsExit();harumalFlashcardsStart('manual')`);assert.equal(await evaluate(`S.vocabFlashcards.items.length`),1);
  await evaluate(`S.vocabFlashcards.items[0].meaning='日本語の長い意味を確認します。'.repeat(35);S.vocabFlashcards.revealed=true;render()`);await setViewport(320,844);await fit();await shot('flashcards-long-meaning-320.png');await tap('.hfKnown');assert.equal(await evaluate(`scrollY`),0,'long meaning completion returns to top of result');
  await evaluate(`S.vocab=[];setView('vocab')`);assert.equal(await evaluate(`document.querySelector('.hfEntry .hfPrimary').disabled`),true);await shot('flashcards-empty-ja.png');
  await evaluate(`S.lang='en';S.vocab=[{text:'학교',meanings:{en:'school'},manual:true}];harumalFlashcardsStart('manual')`);await fit();await shot('flashcards-en-320.png');
  console.log('Flashcard mobile checks passed: entry, filters, tap/swipe, reload, duplicate-click guard, retry, mute, themes, 320/390, long/empty/one word, unchanged vocabulary.');
 }finally{await evaluate(`localStorage.clear();for(const [k,v] of Object.entries(${JSON.stringify(before.storage)}))localStorage.setItem(k,v);Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,JSON.parse(${JSON.stringify(before.state)}));document.documentElement.dataset.theme=${JSON.stringify(before.theme)};render()`)}
}
