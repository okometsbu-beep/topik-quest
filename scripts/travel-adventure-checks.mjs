import assert from 'node:assert/strict';

// Synthetic interaction fixtures. These are browser regressions, never learner outcomes.
export async function verifyAdventure({evaluate,tap,shot,setViewport,send,ready,sleep}){
 const reload=async(ignoreCache=true)=>{const previous=await evaluate('performance.timeOrigin');await send('Page.reload',{ignoreCache});let changed=false;for(let i=0;i<100;i++){try{changed=await evaluate('performance.timeOrigin')!==previous}catch{}if(changed)break;await sleep(50)}assert.ok(changed,'reload must reach a new document');await ready();};
 const fit=async(label)=>{
  const result=await evaluate(`(()=>{const sc=document.querySelector('.adventureScreen');return{overflow:document.documentElement.scrollWidth-innerWidth,buttons:[...sc.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().height>0).every(b=>b.getBoundingClientRect().height>=44),nav:getComputedStyle(document.querySelector('.bottom')).display,active:document.querySelector('#nav_travel')?.getAttribute('aria-current'),images:[...sc.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0)}})()`);
  assert.ok(result.overflow<=1,`${label}: overflow ${result.overflow}`);assert.ok(result.buttons,`${label}: touch targets`);assert.notEqual(result.nav,'none');assert.equal(result.active,'page');assert.ok(result.images,`${label}: image load`);
 };
 await tap('#nav_travel');await sleep(200);
 assert.equal(await evaluate(`S.view`),'travel');
 assert.equal(await evaluate(`document.querySelectorAll('.advCourse').length`),2);
 for(const theme of ['light','dark']){await evaluate(`malbitSetTheme('${theme}')`);for(const width of [320,375,390,430]){await setViewport(width,844);await fit(`adventure hub ${theme} ${width}`);await shot(`adventure-hub-${width}-${theme}.png`)}}
 await setViewport(390,844);await tap('.advCourse .advPrimary',0);
 for(const theme of ['light','dark']){await evaluate(`malbitSetTheme('${theme}')`);for(const width of [320,375,390,430]){await setViewport(width,844);await fit(`dialogue ${theme} ${width}`)}await setViewport(390,844);await shot(`adventure-dialogue-${theme}.png`)}
 assert.equal(await evaluate(`document.querySelectorAll('.advLine').length`),1);assert.equal(await evaluate(`document.querySelectorAll('.advChoice').length`),0);
 await tap('.advDialogue .advPrimary');await tap('.advDialogue .advPrimary');await tap('.advDialogue .advPrimary');
 assert.equal(await evaluate(`document.querySelectorAll('.advLine').length`),3);assert.equal(await evaluate(`document.querySelectorAll('.advChoice small').length`),0);
 await tap('.advChoice',1);await tap('.advQuestion .advPrimary');
 assert.match(await evaluate(`document.querySelector('.advFeedback').innerText`),/15分遅れ/);
 assert.equal(await evaluate(`document.querySelector('.advFeedback [data-haruman]')?.dataset.haruman`),'retry');
 for(const theme of ['light','dark']){await evaluate(`malbitSetTheme('${theme}')`);for(const width of [320,375,390,430]){await setViewport(width,844);await fit(`retry mascot ${theme} ${width}`);await evaluate(`document.querySelector('.advFeedback').scrollIntoView({block:'start'})`);await shot(`haruman-retry-${width}-${theme}.png`)}}
 const storedBefore=await evaluate(`localStorage.getItem('malbitStoryV1')`);
 await reload();assert.equal(await evaluate(`localStorage.getItem('malbitStoryV1')`),storedBefore);
 assert.equal(await evaluate('S.view'),'travelAdventure','reload must restore the active adventure view');
 await tap('.advFeedback .advPrimary');await tap('.advChoice',2);await tap('.advQuestion .advPrimary');await tap('.advFeedback .advPrimary');
 assert.equal(await evaluate(`document.querySelector('.advTitle').textContent`),'忘れたかばん');
 await tap('#nav_home');await tap('#nav_travel');await tap('.advCourse .advPrimary',0);assert.equal(await evaluate(`document.querySelector('.advTitle').textContent`),'忘れたかばん');
 // All scenes at both levels use the real dialogue/choice handlers. One intentional miss is above.
 for(const level of [1,2]){
  await evaluate(`harumalAdventureStart(${level})`);
  const start=level===1?1:0;
  for(let index=start;index<4;index++){
   for(let i=0;i<3;i++)await tap('.advDialogue .advPrimary',0,30);
   if(level===2&&index===0){
    for(const theme of ['light','dark']){await evaluate(`malbitSetTheme('${theme}')`);for(const width of [320,375,390,430]){await setViewport(width,844);await fit(`II reply ${theme} ${width}`)}await evaluate(`document.querySelector('.advQuestion').scrollIntoView({block:'start'})`);await shot(`adventure-topik2-reply-${theme}.png`)}
    // Native Enter activation; no map key handler may intercept it.
    await send('Page.bringToFront');await evaluate(`document.querySelectorAll('.advChoice')[2].focus()`);assert.equal(await evaluate(`document.activeElement===document.querySelectorAll('.advChoice')[2]`),true,'reply button must own focus');
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    assert.equal(await evaluate(`document.querySelector('.advChoice.selected')?.textContent.trim().startsWith('3')`),true);
   }else{const answer=await evaluate(`HARUMAL_ADVENTURE_DATA.levels[${level}][${index}].answer`);await tap('.advChoice',answer,30)}
   await tap('.advQuestion .advPrimary',0,30);assert.ok(await evaluate(`!!document.querySelector('.advFeedback.success')`));
   if(index===0&&level===2){for(const theme of ['light','dark']){await evaluate(`malbitSetTheme('${theme}')`);await setViewport(390,844);await evaluate(`document.querySelector('.advFeedback').scrollIntoView({block:'start'})`);await shot(`adventure-evidence-${theme}.png`)}}
   await tap('.advFeedback .advPrimary',0,30);
  }
  assert.ok(await evaluate(`!!document.querySelector('.advFinish')`));
  assert.equal(await evaluate(`document.querySelector('.advFinish [data-haruman]')?.dataset.haruman`),'celebrate');
  if(level===2){for(const theme of ['light','dark']){await evaluate(`malbitSetTheme('${theme}')`);for(const width of [320,375,390,430]){await setViewport(width,844);await fit(`finish mascot ${theme} ${width}`);await shot(`haruman-finish-${width}-${theme}.png`)}}}

 }
 await tap('.advFinish .advPrimary');assert.equal(await evaluate(`document.querySelector('#advDraft').value`),'');
 assert.ok(!await evaluate(`document.querySelector('.advClue')`));
 await evaluate(`document.querySelector('#advDraft').value='예약표를 환불하겠습니다.';document.querySelector('#advDraft').dispatchEvent(new Event('input',{bubbles:true}))`);
 await reload();assert.equal(await evaluate(`document.querySelector('#advDraft').value`),'예약표를 환불하겠습니다.');
 for(const theme of ['light','dark']){await evaluate(`malbitSetTheme('${theme}')`);for(const width of [320,375,390,430]){await setViewport(width,844);await fit(`recall ${theme} ${width}`)}await setViewport(390,844);await shot(`adventure-recall-${theme}.png`)}
 await tap('.adventureScreen>.advPrimary');await tap('.advRecallActions .advSecondary');
 assert.equal(await evaluate(`JSON.parse(localStorage.getItem('malbitStoryV1')).adventureV1.levels[2].recall['ADV-II-01'].selfReportedRecall`),false);
 // Hard reload deliberately bypasses the worker; return to an ordinary visit before
 // asserting the installed PWA's offline behavior. Do not suppress request errors.
 await reload(false);
 assert.equal(await evaluate(`!!navigator.serviceWorker.controller`),true,'offline visit must be controlled');
 assert.equal(await evaluate(`(async()=> (await Promise.all(HARUMAN.emotions.map(e=>caches.match('assets/art/haruman/'+e+'-v1.webp')))).every(Boolean))()`),true,'all mascot cuts must be cached');
 // The previously visited scenes and packaged translations keep working when offline.
 await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
 for(const lang of ['ko','ja','en','zh']){await evaluate(`S.lang='${lang}';harumalAdventureStart(1)`);assert.ok(await evaluate(`!!document.querySelector('.advFinish')`));await sleep(100);assert.equal(await evaluate(`document.querySelector('.advFinish [data-haruman] img')?.naturalWidth`),320,'offline celebration image');await tap('.advFinish .advPrimary');assert.ok(await evaluate(`!!document.querySelector('#advDraft')`))}
 await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
 await evaluate(`S.lang='ja';setView('home')`);await setViewport(390,844);
}
