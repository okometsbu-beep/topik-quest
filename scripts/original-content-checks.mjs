import assert from 'node:assert/strict';

// Rendered checks for a disposable localhost Chrome profile only. These are not
// evidence until this function has run successfully in an actual browser.
export async function verifyOriginalContent({evaluate,tap,shot,setViewport,send,ready,sleep}){
 assert.equal(await evaluate(`['localhost','127.0.0.1','[::1]'].includes(location.hostname)`),true);
 const before=await evaluate(`({storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),state:JSON.stringify(S),theme:document.documentElement.dataset.theme})`);
 const fit=async label=>{
  const result=await evaluate(`(()=>{const root=document.querySelector('#originalContentQA')||document.querySelector('#screen');return{overflow:root.scrollWidth-root.clientWidth,targets:[...root.querySelectorAll('summary,select,button')].filter(e=>e.getBoundingClientRect().height>0).map(e=>{const r=e.getBoundingClientRect();return{w:r.width,h:r.height,l:r.left,r:r.right,label:e.getAttribute('aria-label')||e.textContent.trim()}}),images:[...root.querySelectorAll('img')].map(e=>({loaded:e.complete&&e.naturalWidth>0,alt:e.alt}))}})()`);
  assert.ok(result.overflow<=1,`${label}: no horizontal overflow`);
  assert.ok(result.targets.every(t=>t.w>=43&&t.h>=43&&t.l>=-1&&t.r<=innerWidthForCheck+1&&t.label),`${label}: readable 44px controls fit viewport`);
  assert.ok(result.images.every(i=>i.loaded&&i.alt),`${label}: actual image files decode and have alternatives`);
 };
 let innerWidthForCheck=390,failed;
 try{
  await evaluate(`t1ExitRandom();stopTimer();if(S.real)S.real.active=false;setView('home')`);
  for(const lang of ['ko','ja','en','zh'])for(const theme of ['light','dark'])for(const width of [320,390]){
   innerWidthForCheck=width;await setViewport(width,844);
   await evaluate(`setLang('${lang}');malbitSetTheme('${theme}');HARUMAL_HUB.openAreas('mock',1);HARUMAL_HUB.selectArea('listening');HARUMAL_HUB.chooseCollection('original12-v1')`);
   const availability=await evaluate(`({sets:MALBIT_BANK.mockSets(1,'original12-v1',S.lang),disabled:document.querySelector('[data-hub-action="start-mock"]').disabled,options:[...document.querySelector('[data-mock-set]').options].filter(o=>o.value!=='0').map(o=>({set:Number(o.value),disabled:o.disabled}))})`);
   assert.equal(availability.options.length,12);
   assert.equal(availability.disabled,!availability.sets.some(s=>s.ready));
   for(const option of availability.options)assert.equal(option.disabled,!availability.sets.find(s=>s.set===option.set).ready);
   await fit(`readiness ${lang} ${theme} ${width}`);await shot(`original-ready-${lang}-${theme}-${width}.png`);
   await evaluate(`(()=>{const host=document.createElement('article');host.id='originalContentQA';host.className='screen';host.style.cssText='position:fixed;inset:0;z-index:2147483000;max-width:none;width:auto;margin:0;padding:14px;background:var(--ui-canvas);color:var(--ui-ink);overflow:auto';document.body.append(host)})()`);
   for(const kind of ['listening','writing','legacy-writing','visual','neutral-visual','legacy-visual','legacy-notice']){
    await evaluate(`(()=>{const host=document.querySelector('#originalContentQA');if('${kind}'==='listening'){const q=MALBIT_BANK.present('O01-I-L-01');if(HARUMAL_TRANSCRIPTS.markup(q))throw Error('Unsubmitted transcript leaked');host.innerHTML=MALBIT_LEARNING.explanationBlock('listen',q)}else if(['writing','legacy-writing'].includes('${kind}')){const q=MALBIT_BANK.present('${kind}'==='writing'?'O01-II-W-53':'M01-II-W-53');host.innerHTML=MALBIT_LEARNING.questionVisual(q)+MALBIT_LEARNING.writingExplanationBlock(q)}else if('${kind}'==='legacy-notice'){const q=MALBIT_BANK.present('P01-I-R-05');host.innerHTML=MALBIT_LEARNING.questionVisual(q)}else{const q=MALBIT_BANK.present('${kind}'==='legacy-visual'?'M01-I-L-15':'${kind}'==='neutral-visual'?'O05-II-L-01':'O01-I-L-15',[2,0,3,1]);host.innerHTML=q.choices.map((choice,i)=>'<section><b>'+(i+1)+'</b>'+MALBIT_LEARNING.choiceContent(q,choice,i)+'</section>').join('')}host.querySelectorAll('details').forEach(d=>d.open=true);host.querySelectorAll('img').forEach(img=>img.loading='eager');host.scrollTop=0})()`);
    await evaluate(`Promise.all([...document.querySelectorAll('#originalContentQA img')].map(img=>img.decode()))`);await sleep(50);
    if(kind==='listening'){
     assert.equal(await evaluate(`!!document.querySelector('#originalContentQA ${lang==='ko'?'.listeningRecordedScript':'.listeningTranscriptBody'}[lang="${lang}"] mark')`),true);
     assert.equal(await evaluate(`!!document.querySelector('#originalContentQA [data-transcript-pending]')`),false);
    }
    if(['visual','neutral-visual'].includes(kind)){
     const visible=await evaluate(`(()=>{const host=document.querySelector('#originalContentQA');return{content:host.textContent+' '+[...host.querySelectorAll('[alt],[aria-label],[title]')].map(e=>[e.alt,e.getAttribute('aria-label'),e.title].filter(Boolean).join(' ')).join(' '),images:[...host.querySelectorAll('img')].map(e=>e.getAttribute('src'))}})()`);
     assert.doesNotMatch(visible.content,/(?:장면|그래프)\s*[가나다라]/u,'pre-submit visual names must not disclose stable keys');
     assert.equal(visible.images.length,4);
     if(kind==='neutral-visual')assert.ok(visible.images.every(src=>src.startsWith('assets/question-polish/original-neutral-')),'embedded stable labels use reviewed display derivatives');
    }
    if(kind==='writing')assert.equal(await evaluate(`!!document.querySelector('#originalContentQA table th[scope="col"]')&&!!document.querySelector('#originalContentQA .tqWritingRubric')`),true);
    if(kind==='legacy-writing')assert.equal(await evaluate(`document.querySelectorAll('#originalContentQA tbody tr').length`),5);
    await fit(`${kind} ${lang} ${theme} ${width}`);await shot(`original-${kind}-${lang}-${theme}-${width}.png`);
   }
   await evaluate(`document.querySelector('#originalContentQA').remove()`);
  }
  // Exercise the actual wrong-answer retry owner, including playback surviving
  // an answer-selection render and cancellation when its sheet closes.
  innerWidthForCheck=390;await setViewport(390,844);
  await evaluate(`setLang('ko');malbitSetTheme('light');malbitSetListeningMode('ask');MALBIT_REVIEW.record(1,'listen','O01-I-L-01',-1,'random',{choiceOrder:[2,0,3,1]});openReviewRetry('1:listen:O01-I-L-01')`);
  assert.equal(await evaluate(`document.querySelector('#malbitListeningDialog')?.classList.contains('open')`),true,'review retry asks for listening consent');
  await tap('#malbitListeningDialog .on');
  assert.equal(await evaluate(`document.querySelectorAll('#sheetBody .listeningPlayer').length`),1);
  assert.equal(await evaluate(`document.querySelectorAll('#sheetBody .listeningTranscript').length`),0);
  assert.equal(await evaluate(`document.querySelector('#sheetBody .tqTranslationToggle').disabled`),true);
  await tap('#sheetBody .listeningToggle');
  let metadataReady=false;for(let i=0;i<150;i++){metadataReady=await evaluate(`!document.querySelector('#sheetBody .listeningPlayer input').disabled`);if(metadataReady)break;await sleep(100)}
  assert.equal(metadataReady,true,'original retry loads actual recorded MP3 metadata');
  await tap('#sheetBody .tqReviewChoices .choice');
  assert.equal(await evaluate(`HARUMAL_LISTENING_PLAYER.busy('review:1:listen:O01-I-L-01')`),true);
  await shot('original-listening-retry-playing-ko-light-390.png');
  await evaluate(`closeReviewRetry()`);assert.equal(await evaluate(`HARUMAL_LISTENING_PLAYER.busy('review:1:listen:O01-I-L-01')`),false);
  await evaluate(`(()=>{openReviewRetry('1:listen:O01-I-L-01');const correct=MALBIT_BANK.present('O01-I-L-01',[2,0,3,1]).answerIndex;reviewSelect(correct);reviewSelect(correct)})()`);
  await sleep(50);assert.equal(await evaluate(`!!document.querySelector('#sheetBody .listeningTranscript mark')`),true);
  await shot('original-listening-retry-submitted-ko-light-390.png');await evaluate(`closeReviewRetry()`);
  // Exercise the real exam owner: selecting an answer cannot reveal the script;
  // all thirty listening reviews become available only after the final submit.
  innerWidthForCheck=390;await setViewport(390,844);
  await evaluate(`setLang('ko');malbitSetTheme('light');HARUMAL_HUB.openAreas('mock',1);HARUMAL_HUB.selectArea('listening');HARUMAL_HUB.chooseCollection('original12-v1');HARUMAL_HUB.chooseMockSet(1)`);
  await tap('[data-hub-action="start-mock"]');assert.equal(await evaluate('S.view'),'t1quiz');
  assert.equal(await evaluate(`document.querySelectorAll('#screen .listeningTranscript').length`),0);
  await evaluate(`openReviewRetry('1:listen:O01-I-L-01')`);assert.equal(await evaluate(`document.getElementById('overlay').classList.contains('open')`),false,'unfinished mock cannot open review feedback');
  const session=await evaluate(`JSON.parse(localStorage.getItem('topikQuestTopik1Session'))`);
  assert.equal(Object.keys(session.choiceOrders).length,30);
  await evaluate('t1Pick(0)');assert.equal(await evaluate(`document.querySelectorAll('#screen .listeningTranscript').length`),0);
  await send('Page.reload',{ignoreCache:true});await ready();
  assert.deepEqual(await evaluate(`JSON.parse(localStorage.getItem('topikQuestTopik1Session')).choiceOrders`),session.choiceOrders);
  await evaluate(`for(let i=0;i<30;i++)t1Next()`);assert.equal(await evaluate('S.view'),'t1result');
  assert.equal(await evaluate(`document.querySelectorAll('.t1CompletedListeningReview > details').length`),30);
  await evaluate(`document.querySelector('.t1CompletedListeningReview > details').open=true;document.querySelector('.t1CompletedListeningReview > details details').open=true;document.querySelector('.t1CompletedListeningReview').scrollIntoView()`);
  assert.equal(await evaluate(`!!document.querySelector('.t1CompletedListeningReview mark')`),true);await shot('original-topik1-submitted-review-ko-light-390.png');
  console.log('Original content rendered QA passed: four locales, two themes, 320/390px, actual SVG decoding, table and translated answer cues, readiness gates, and TOPIK I full-submit/reload choice-order flow.');
 }catch(error){failed=error;throw error}finally{
  try{await evaluate(`(()=>{document.querySelector('#originalContentQA')?.remove();stopTimer();window.stopListeningAudio?.();const saved=${JSON.stringify(before.storage)};for(const k of Object.keys(localStorage))if(!Object.hasOwn(saved,k))localStorage.removeItem(k);for(const[k,v]of Object.entries(saved))localStorage.setItem(k,v);S=JSON.parse(${JSON.stringify(before.state)});document.documentElement.dataset.theme=${JSON.stringify(before.theme)}})()`);await send('Page.reload',{ignoreCache:true});await ready()}catch(error){if(!failed)throw error}
 }
}
