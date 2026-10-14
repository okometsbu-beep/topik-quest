import assert from 'node:assert/strict';

export async function verifyVocabFlashcards({evaluate,tap,shot,setViewport,send,ready,sleep,record}){
 const before=await evaluate(`({state:JSON.stringify(S),storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),theme:document.documentElement.dataset.theme})`);
 const viewports=[[390,844],[320,568],[375,667],[667,375]];
 const fit=async()=>assert.equal(await evaluate(`document.documentElement.scrollWidth<=innerWidth+1`),true,'no horizontal overflow');
 const shell=()=>evaluate(`(()=>{const style=el=>{const s=getComputedStyle(el);return{display:s.display,overflowX:s.overflowX,overflowY:s.overflowY,position:s.position,touchAction:s.touchAction}};return{root:style(document.documentElement),body:style(document.body),chrome:[...document.querySelectorAll('.top,.bottom')].map(style)}})()`);
 const locked=async()=>{
  const state=await evaluate(`(()=>{const root=document.documentElement,body=document.body;return{root:root.classList.contains('hfActive'),body:body.classList.contains('hfActive'),chrome:[...document.querySelectorAll('.top,.bottom')].map(el=>getComputedStyle(el).display),width:root.scrollWidth,height:root.scrollHeight,x:scrollX,y:scrollY,viewport:{width:innerWidth,height:innerHeight}}})()`);
  assert.equal(state.root,true,'flashcards lock the html viewport');
  assert.equal(state.body,true,'flashcards lock the body viewport');
  assert.ok(state.chrome.length>=2,'global top and bottom chrome exist');
  assert.ok(state.chrome.every(display=>display==='none'),'global top and bottom chrome are hidden during flashcards');
  assert.ok(state.width<=state.viewport.width+1,'flashcards do not expand document width');
  assert.ok(state.height<=state.viewport.height+1,'flashcards do not expand document height');
  assert.equal(state.x,0,'flashcards do not scroll the document horizontally');
  assert.equal(state.y,0,'flashcards do not scroll the document vertically');
 };
 const flashcardFit=async(label)=>{
  await locked();
  const layout=await evaluate(`(()=>{const selectors=['.hfScreen','.hfHeader','.hfHeader .hfIconButton','.hfProgress','.hfScreen progress','.hfDeckStage','#vocabFlashcard','#hfHint','.hfDetailsButton','.hfActions',...Array.from({length:3},(_,i)=>'.hfActions button:nth-child('+(i+1)+')')];const rect=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height,display:s.display,visibility:s.visibility,touchAction:s.touchAction}};return{width:innerWidth,height:innerHeight,rects:selectors.map(selector=>({selector,...(document.querySelector(selector)?rect(document.querySelector(selector)):{missing:true})})),scrollable:[...document.querySelectorAll('#vocabFlashcard,#vocabFlashcard *')].filter(el=>['auto','scroll'].includes(getComputedStyle(el).overflowY)).map(el=>el.className)}})()`);
  for(const r of layout.rects){
   assert.equal(r.missing,undefined,`${label}: ${r.selector} exists`);
   assert.ok(r.width>0&&r.height>0&&r.display!=='none'&&r.visibility!=='hidden',`${label}: ${r.selector} is visible`);
   assert.ok(r.x>=-1&&r.y>=-1&&r.right<=layout.width+1&&r.bottom<=layout.height+1,`${label}: ${r.selector} fits the viewport: ${JSON.stringify(r)}`);
  }
  const card=layout.rects.find(r=>r.selector==='#vocabFlashcard'),actions=layout.rects.find(r=>r.selector==='.hfActions');
  assert.equal(card.touchAction,'pinch-zoom',`${label}: card gestures prevent page panning while preserving pinch zoom`);
  assert.deepEqual(layout.scrollable,[],`${label}: no internal card scrollers`);
  assert.ok(card.bottom<=actions.y+1||actions.bottom<=card.y+1||card.right<=actions.x+1||actions.right<=card.x+1,`${label}: grading controls do not overlap the card in portrait or landscape`);
  assert.equal(await evaluate(`[...document.querySelectorAll('#vocabFlashcard .hfTermScroll,#vocabFlashcard .hfMeaningScroll')].every(el=>{const s=getComputedStyle(el);return s.overflowY==='hidden'&&Number(s.webkitLineClamp)>0})`),true,`${label}: full term and meaning are explicitly clamped on the card`);
 };
 const resultFit=async(label)=>{
  await locked();
  const result=await evaluate(`(()=>{const buttons=[...document.querySelectorAll('.hfResult button')];return{complete:document.querySelector('.hfComplete')!==null,buttons:buttons.map(el=>{const r=el.getBoundingClientRect();return{text:el.textContent,width:r.width,height:r.height,x:r.x,y:r.y,right:r.right,bottom:r.bottom,fits:r.width>0&&r.height>0&&r.x>=-1&&r.y>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1}})}})()`);
  assert.equal(result.complete,true,`${label}: completion retains a scoped result viewport`);
  assert.ok(result.buttons.length>=2,`${label}: result controls exist`);
  for(const button of result.buttons)assert.equal(button.fits,true,`${label}: result control fits the viewport: ${JSON.stringify(button)}`);
 };
 // Touches begin in the visible card without scrollIntoView masking layout failures.
 const drag=async(dx,dy=0,{selector='#vocabFlashcard',steps=6,delay=35,flick=false,settle=600}={})=>{
  const p=await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)}),r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  const started=Date.now()/1000;
  const dispatch=(type,points,index)=>send('Input.dispatchTouchEvent',{type,touchPoints:points,...(flick?{timestamp:started+index*.008}:{})});
  await dispatch('touchStart',[p],0);
  for(let i=1;i<=steps;i++){
   await dispatch('touchMove',[{x:p.x+dx*i/steps,y:p.y+dy*i/steps}],i);
   if(delay)await sleep(delay);
  }
  await dispatch('touchEnd',[],steps+1);await sleep(settle);
 };
 const position=()=>evaluate(`({x:scrollX,y:scrollY,root:document.documentElement.scrollTop,body:document.body.scrollTop,screen:document.querySelector('.hfScreen')?.scrollTop||0})`);
 const rejectedDrag=async(dx,dy,label)=>{
  const prior=await evaluate(`({answers:JSON.stringify(S.vocabFlashcards.answers),revealed:S.vocabFlashcards.revealed})`),scroll=await position();
  await drag(dx,dy);
  assert.deepEqual(await evaluate(`({answers:JSON.stringify(S.vocabFlashcards.answers),revealed:S.vocabFlashcards.revealed})`),prior,`${label}: drag neither grades nor flips`);
  assert.deepEqual(await position(),scroll,`${label}: drag does not scroll the document or flashcard screen`);
  assert.equal(await evaluate(`[...document.querySelectorAll('#vocabFlashcard,.hfTermScroll,.hfMeaningScroll')].every(el=>el.scrollTop===0)`),true,`${label}: drag does not scroll inside the card`);
 };
 const checkDetails=async(label,revealed)=>{
  const prior=await evaluate(`({answers:JSON.stringify(S.vocabFlashcards.answers),revealed:S.vocabFlashcards.revealed})`),scroll=await position();
  await tap('.hfDetailsButton');
  const details=await evaluate(`(()=>{const d=document.querySelector('.hfDetails'),body=d?.querySelector('.hfDetailBody'),close=d?.querySelector('.hfDetailClose'),item=S.vocabFlashcards.items[S.vocabFlashcards.answers.length];const fits=el=>{if(!el)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1};return{open:d?.open,modal:d?.matches(':modal'),term:body?.querySelector('h2')?.textContent,meaning:body?.querySelector('p')?.textContent,expectedTerm:item.term,expectedMeaning:item.meaning,scrollable:!!body&&body.scrollHeight>body.clientHeight+1,overflow:body&&getComputedStyle(body).overflowY,fits:fits(d)&&fits(body)&&fits(close)}})()`);
  assert.equal(details.open,true,`${label}: full text opens a native dialog`);
  assert.equal(details.modal,true,`${label}: the dialog is modal`);
  assert.equal(details.term,details.expectedTerm,`${label}: full Korean text is preserved`);
  assert.equal(details.meaning,revealed?details.expectedMeaning:undefined,`${label}: meaning appears only after reveal`);
  assert.equal(details.fits,true,`${label}: dialog and close control fit the viewport`);
  assert.equal(details.scrollable,true,`${label}: long full text overflows the detail body`);
  assert.ok(['auto','scroll'].includes(details.overflow),`${label}: only the detail body scrolls`);
  await shot(`flashcards-details-${label}.png`);
  await drag(0,-90,{selector:'.hfDetailBody',delay:35,settle:300});
  assert.ok(await evaluate(`document.querySelector('.hfDetailBody').scrollTop>0`),`${label}: full text scrolls by touch`);
  assert.deepEqual(await position(),scroll,`${label}: dialog scrolling does not move the page`);
  assert.deepEqual(await evaluate(`({answers:JSON.stringify(S.vocabFlashcards.answers),revealed:S.vocabFlashcards.revealed})`),prior,`${label}: full text scrolling does not grade or flip`);
  await tap('.hfDetailClose');
  assert.equal(await evaluate(`document.querySelector('.hfDetails')===null`),true,`${label}: explicit close removes the dialog`);
  assert.equal(await evaluate(`document.activeElement?.classList.contains('hfDetailsButton')`),true,`${label}: closing returns focus to the full-text control`);
  await flashcardFit(label+'-closed');
  await tap('.hfDetailsButton');
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});
  await sleep(150);
  assert.equal(await evaluate(`document.querySelector('.hfDetails')===null`),true,`${label}: Escape also closes full text`);
  assert.deepEqual(await evaluate(`({answers:JSON.stringify(S.vocabFlashcards.answers),revealed:S.vocabFlashcards.revealed})`),prior,`${label}: closing full text preserves the card state`);
 };
 try{
  await setViewport(390,844);
  await evaluate(`S.lang='ja';setView('home')`);
  const initialHomeShell=await shell();
  await evaluate(`S.lang='ja';S.vocab=[{text:'학교',ja:'学校',manual:true,interval:9,note:'Keep me'},{text:'사과',meanings:{ja:'りんご'},interval:4},{text:'미등록'}];setView('vocab');malbitSetVocabPageMode('saved')`);
  assert.equal(await evaluate(`document.querySelectorAll('.hfEntry').length`),1);
  await shot('flashcards-entry-ja.png');
  await evaluate(`malbitSetVocabPageMode('library')`);assert.equal(await evaluate(`document.querySelectorAll('.hfEntry').length`),0);
  await evaluate(`malbitSetVocabPageMode('saved')`);
  const initialShell=await shell();
  await tap('.hfEntry .hfPrimary');
  assert.equal(await evaluate(`S.vocabFlashcards.items.length`),2);
  const words=await evaluate(`JSON.stringify(S.vocab)`);
  await flashcardFit('initial-ja');
  await rejectedDrag(0,-100,'front vertical');
  await rejectedDrag(85,100,'front diagonal');
  await tap('#vocabFlashcard',0,650);
  await rejectedDrag(0,100,'back vertical');
  await rejectedDrag(-105,90,'back diagonal');
  await drag(105,0,{delay:80});
  assert.deepEqual(await evaluate(`S.vocabFlashcards.answers`),[true],'slow right swipe grades known');
  assert.equal(await evaluate(`S.vocabFlashcards.revealed`),false,'swipe click must not reveal next card');
  await send('Page.reload',{ignoreCache:true});await ready();
  assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),1);
  await evaluate(`harumalFlashcardsResume()`);await flashcardFit('resumed-ja');
  await tap('#vocabFlashcard',0,650);await drag(-105,0,{delay:80});
  assert.deepEqual(await evaluate(`S.vocabFlashcards.answers`),[true,false],'slow left swipe grades revisit');
  await resultFit('initial-ja');await shot('flashcards-result-ja.png');
  await tap('.hfResult .hfPrimary');assert.equal(await evaluate(`S.vocabFlashcards.items.length`),1);
  assert.equal(await evaluate(`JSON.stringify(S.vocab)`),words,'sessions preserve saved vocabulary and scheduling');
  assert.equal(await evaluate(`document.getElementById('flashcardSound')===null`),true,'card-specific sound toggle is removed');
  await evaluate(`S.vocabFlashcardSound=false;save()`);
  assert.equal(await evaluate(`HARUMAL_FLASHCARDS.soundEnabled()`),false,'stored sound preference is still respected');
  await tap('#vocabFlashcard',0,650);await tap('.hfKnown',0,600);
  await evaluate(`harumalFlashcardsExit()`);
  assert.equal(await evaluate(`document.querySelector('html.hfActive,body.hfActive')===null`),true,'exit removes both viewport lock classes');
  assert.deepEqual(await shell(),initialShell,'exit restores ordinary shell styles and top/bottom navigation');
  await evaluate(`harumalFlashcardsStart('manual')`);assert.equal(await evaluate(`S.vocabFlashcards.items.length`),1);
  await evaluate(`harumalFlashcardsExit();S.vocab=[];setView('vocab')`);
  assert.equal(await evaluate(`document.querySelector('.hfEntry .hfPrimary').disabled`),true);await shot('flashcards-empty-ja.png');

  // Restore the original reading position only after the tall destination is rendered.
  // Start directly so the tap helper cannot scroll the entry button into view first.
  await evaluate(`S.lang='ja';S.vocab=Array.from({length:50},(_,i)=>({text:'저장한 표현 '+(i+1),ja:'保存した表現 '+(i+1),manual:true,interval:i+1}));setView('vocab');malbitSetVocabPageMode('saved');window.scrollTo({top:350,behavior:'instant'})`);
  await sleep(80);
  const entryScroll=await evaluate(`scrollY`),tallWords=await evaluate(`JSON.stringify(S.vocab)`),tallShell=await shell();
  assert.ok(entryScroll>0,'saved vocabulary fixture has a nonzero reading position');
  await evaluate(`harumalFlashcardsStart('all')`);await flashcardFit('scrolled-entry');
  await evaluate(`harumalFlashcardsExit()`);await sleep(80);
  assert.equal(await evaluate(`scrollY`),entryScroll,'exit restores the original position after rendering the tall saved-word page');
  assert.equal(await evaluate(`document.querySelector('html.hfActive,body.hfActive')===null`),true,'scrolled-page exit removes both viewport locks');
  assert.deepEqual(await shell(),tallShell,'scrolled-page exit restores its original shell');
  assert.equal(await evaluate(`JSON.stringify(S.vocab)`),tallWords,'scroll restoration preserves all saved vocabulary');
  await shot('flashcards-exit-restored-scroll.png');
  // General view navigation must restore the same position, not just the exit button.
  await evaluate(`window.scrollTo({top:470,behavior:'instant'})`);await sleep(80);
  const resumeScroll=await evaluate(`scrollY`);
  assert.ok(resumeScroll>0,'resume fixture retains a nonzero reading position');
  await evaluate(`harumalFlashcardsResume()`);await flashcardFit('scrolled-resume');
  await evaluate(`setView('vocab')`);await sleep(80);
  assert.equal(await evaluate(`scrollY`),resumeScroll,'general navigation restores the saved page position after resume');
  assert.deepEqual(await shell(),tallShell,'general navigation releases the viewport lock and restores shell styles');

  // Both card faces must fit real short, tall and landscape viewports in every locale/theme.
  const fixture=[{text:'설레다',meanings:{ja:'心がときめく',en:'Feel excited',zh:'心动'}},{text:'꾸준하다',meanings:{ja:'こつこつ続ける',en:'Be consistent',zh:'坚持不懈'}},{text:'여유',meanings:{ja:'心のゆとり',en:'Room to breathe',zh:'从容'}}];
  for(const lang of ['ko','ja','en','zh'])for(const theme of ['light','dark'])for(const [width,height] of viewports){
   const label=`${lang}-${theme}-${width}x${height}`;
   await setViewport(width,height);
   await evaluate(`S.lang=${JSON.stringify(lang)};malbitSetTheme(${JSON.stringify(theme)});S.vocab=${JSON.stringify(fixture)};harumalFlashcardsStart('all')`);
   await flashcardFit(label+'-front');await shot(`flashcards-front-${label}.png`);
   await tap('#vocabFlashcard',0,650);await flashcardFit(label+'-back');await shot(`flashcards-back-${label}.png`);
   await rejectedDrag(0,-65,label+' vertical');
   await rejectedDrag(65,-65,label+' diagonal');
   await evaluate(`S.vocabFlashcards.answers=[true,false,true];S.vocabFlashcards.revealed=false;S.vocabFlashcards.finishedAt=Date.now();render()`);
   await resultFit(label);await shot(`flashcards-result-${label}.png`);
  }

  // Long text stays clamped on the card; its explicit dialog is the sole scroll surface.
  for(const [width,height] of viewports){
   const label=`${width}x${height}`;
   await setViewport(width,height);
   await evaluate(`S.lang='ja';malbitSetTheme('light');S.vocab=[{text:'길고 긴 한국어 표현을 끝까지 읽을 수 있어요. '.repeat(15),ja:'日本語の長い意味を最後まで確認します。'.repeat(35)}];harumalFlashcardsStart('all')`);
   await flashcardFit('long-term-'+label);await shot(`flashcards-long-term-${label}.png`);
   await rejectedDrag(0,-70,'long term '+label);await checkDetails('term-'+label,false);
   await tap('#vocabFlashcard',0,650);await flashcardFit('long-meaning-'+label);await shot(`flashcards-long-meaning-${label}.png`);
   await rejectedDrag(65,-65,'long meaning '+label);await checkDetails('meaning-'+label,true);
   await drag(width===375?-105:105,0,{delay:80});
   assert.deepEqual(await evaluate(`S.vocabFlashcards.answers`),[width!==375],`${label}: closing full text restores real swipe grading`);
   await resultFit('long-text-'+label);
   await shot(`flashcards-result-${label}.png`);
  }

  await setViewport(390,844);
  await evaluate(`S.lang='ja';malbitSetTheme('light');S.vocab=${JSON.stringify(fixture)};harumalFlashcardsStart('all')`);
  await tap('#vocabFlashcard',0,650);await drag(44,0,{steps:2,delay:0,flick:true});
  assert.deepEqual(await evaluate(`S.vocabFlashcards.answers`),[true],'short, fast right flick grades known');
  assert.equal(await evaluate(`S.vocabFlashcards.revealed`),false,'right flick does not reveal the next card');
  await tap('#vocabFlashcard',0,650);await drag(-44,0,{steps:2,delay:0,flick:true});
  assert.deepEqual(await evaluate(`S.vocabFlashcards.answers`),[true,false],'short, fast left flick grades revisit');
  assert.equal(await evaluate(`S.vocabFlashcards.revealed`),false,'left flick does not reveal the next card');

  // A real screen recording of the shipped interaction, not a drawn simulation.
  await evaluate(`S.vocab=[{text:'설레다',ja:'心がときめく'},{text:'꾸준하다',ja:'こつこつ続ける'},{text:'여유',ja:'心のゆとり'},{text:'다정하다',ja:'優しくて温かい'},{text:'나아가다',ja:'前へ進む'}];harumalFlashcardsStart('all')`);
  assert.equal(await evaluate(`document.querySelectorAll('.hfUnderCard').length`),2);
  await flashcardFit('physical-deck-light');await shot('flashcards-physical-deck-light.png');
  if(record)await record('flashcards-motion',async()=>{
   await sleep(800);await tap('#vocabFlashcard',0,650);await sleep(300);
   await rejectedDrag(35,0,'short slow drag');await rejectedDrag(0,-80,'recorded vertical drag');
   await drag(135,0,{delay:80});await sleep(450);await tap('#vocabFlashcard',0,650);
   await drag(-44,0,{steps:2,delay:0,flick:true});await sleep(900);
   assert.deepEqual(await evaluate(`S.vocabFlashcards.answers`),[true,false]);
   await flashcardFit('recorded-deck');
  });
  await evaluate(`malbitSetTheme('dark');harumalFlashcardsStart('all')`);await flashcardFit('physical-deck-dark');await shot('flashcards-physical-deck-dark.png');
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await tap('#vocabFlashcard',0,80);await tap('.hfKnown',0,80);
  assert.equal(await evaluate(`S.vocabFlashcards.answers.length`),1);await flashcardFit('reduced-motion');
  await send('Emulation.setEmulatedMedia',{features:[]});
  for(const destination of ['travel','writingCourse']){
   await evaluate(`harumalFlashcardsStart('all');setView('${destination}')`);
   assert.equal(await evaluate(`document.querySelector('html.hfActive,body.hfActive')===null`),true,`${destination}: later render owners do not retain flashcard locks`);
  }
  await evaluate(`harumalFlashcardsStart('all');setView('home')`);
  assert.equal(await evaluate(`document.querySelector('html.hfActive,body.hfActive,.hfDetails')===null`),true,'navigation also removes the flashcard viewport and dialog');
  assert.deepEqual(await shell(),initialHomeShell,'navigation restores the original home shell, including intentionally hidden chrome');
  await fit();
  console.log('Flashcard mobile checks passed: fixed viewport, restored navigation, all four locales/two themes at 390x844, 320x568, 375x667 and 667x375, both faces, vertical/diagonal rejection, slow swipes/flicks, full-text dialog scrolling, reload, retry, mute, reduced motion and unchanged vocabulary.');
 }finally{
  await send('Emulation.setEmulatedMedia',{features:[]});
  await evaluate(`document.querySelector('.hfDetails')?.close();localStorage.clear();for(const [k,v] of Object.entries(${JSON.stringify(before.storage)}))localStorage.setItem(k,v);Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,JSON.parse(${JSON.stringify(before.state)}));document.documentElement.dataset.theme=${JSON.stringify(before.theme)};render()`);
 }
}
