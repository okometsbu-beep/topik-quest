import assert from 'node:assert/strict';

// Synthetic local text in the disposable CI profile; never run against learner storage.
export async function verifyVocabularySelection({evaluate,tap,shot,setViewport,send,ready,sleep}){
 assert.equal(await evaluate(`['localhost','127.0.0.1','[::1]'].includes(location.hostname)`),true);
 const before=await evaluate(`({storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),state:JSON.stringify(S),theme:document.documentElement.dataset.theme,history:history.state})`);
 const fixture=async()=>{
  // Exercise the native event gate before creating a deterministic range. Range APIs
  // bypass selectstart, so selection/save alone cannot detect document-level blocking.
  assert.deepEqual(await evaluate(`(()=>{const p=document.createElement('p');p.className='selectable';p.textContent='불을 켠 채로';document.querySelector('#screen').prepend(p);const result={};for(const type of ['selectstart','contextmenu','copy']){const event=new Event(type,{bubbles:true,cancelable:true});p.firstChild.dispatchEvent(event);result[type]=event.defaultPrevented}p.remove();return result})()`),{selectstart:false,contextmenu:false,copy:false},'native learning-text events are not cancelled');
  await evaluate(`(()=>{S.vocab=[];setLang('ja');setView('home');const p=document.createElement('p');p.className='selectable';p.id='qaSelectedSentence';p.innerHTML='이전 문장입니다. 불을 <span id="qaRangeStart">켠 </span><strong id="qaRangeEnd">채로</strong> 잠이 들었어요. 다음 문장입니다.';document.querySelector('#screen').prepend(p);const range=document.createRange();range.setStart(document.querySelector('#qaRangeStart').firstChild,0);range.setEnd(document.querySelector('#qaRangeEnd').firstChild,2);const selection=getSelection();selection.removeAllRanges();selection.addRange(range)})()`);
  await sleep(350);assert.equal(await evaluate(`document.querySelector('#selectionBar').classList.contains('show')`),true,'native range exposes save action');
  await tap('#selectionBar button');assert.equal(await evaluate(`document.querySelector('#tqVocabPopup').classList.contains('open')`),true,'range save opens preview');
  assert.deepEqual(await evaluate(`(()=>{const p=document.querySelector('#tqVocabPopup');return{term:p.querySelector('.tqVocabInput').value,context:p.querySelector('.tqVocabContext').textContent}})()`),{term:'켠 채로',context:'原文の文脈 · 불을 켠 채로 잠이 들었어요.'});
 };
 let failed;
 try{
  for(const theme of ['light','dark'])for(const width of [320,390]){
   await setViewport(width,844);await evaluate(`malbitSetTheme('${theme}')`);await fixture();
   const fit=await evaluate(`(()=>{const p=document.querySelector('#tqVocabPopup section'),r=p.getBoundingClientRect();return{overflow:p.scrollWidth-p.clientWidth,left:r.left,right:r.right,screen:innerWidth,controls:[...p.querySelectorAll('button,input,select')].map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))}})()`);
   assert.ok(fit.overflow<=1&&fit.left>=-1&&fit.right<=fit.screen+1,`${width} ${theme} range preview fits`);assert.ok(fit.controls.every(r=>r.width>=43&&r.height>=43),'preview has usable controls');await shot(`vocab-range-preview-ja-${width}-${theme}.png`);
   await tap('.tqVocabAdd');const entry=await evaluate(`S.vocab[0]`);assert.equal(entry.text,'켠 채로');assert.equal(entry.inputOriginal,'켠 채로');assert.equal(entry.context,'불을 켠 채로 잠이 들었어요.');assert.equal(entry.type,'expression');assert.equal(await evaluate(`getSelection().toString()`),'');assert.equal(await evaluate(`document.querySelector('#selectionBar').classList.contains('show')`),false);
   await evaluate(`setView('vocab')`);await shot(`vocab-range-saved-ja-${width}-${theme}.png`);
  }
  await evaluate(`setView('home')`);await tap('.hubHomeHeader .harumalSettingsTrigger');
  await evaluate(`document.querySelector('#harumalSettingsDialog .malbitTtsSetting').closest('details').open=true`);
  const text=await evaluate(`document.querySelector('#harumalSettingsDialog .malbitTtsSetting').textContent`);assert.match(text,/Supertonic 3/);assert.doesNotMatch(text,/430\s*MB|230\s*MB|400\s*MB/);assert.equal(await evaluate(`!!window.MALBIT_NEURAL_TTS`),false,'no on-device model runtime');
  await evaluate(`document.querySelector('#harumalSettingsDialog .malbitTtsSetting').scrollIntoView({block:'center',behavior:'auto'})`);await sleep(80);await shot('listening-audio-settings-ja-390-dark.png');await tap('[data-hub-action="close-settings"]');
  console.log('Vocabulary range browser QA: inline exact selection, bounded sentence, preview/save, 320/390px light/dark and listening-only settings passed.');
 }catch(error){failed=error;throw error}finally{
  try{await evaluate(`(()=>{HARUMAL_HUB.closeSettings();MALBIT_VOCAB_SELECTION.clear();hideSelection();getSelection()?.removeAllRanges();document.querySelector('#tqVocabPopup')?.classList.remove('open');const saved=${JSON.stringify(before.storage)};for(const k of Object.keys(localStorage))if(!Object.hasOwn(saved,k))localStorage.removeItem(k);for(const[k,v]of Object.entries(saved))localStorage.setItem(k,v);S=JSON.parse(${JSON.stringify(before.state)});document.documentElement.dataset.theme=${JSON.stringify(before.theme)};history.replaceState(${JSON.stringify(before.history)},'')})()`);await send('Page.reload',{ignoreCache:true});await ready()}catch(error){if(!failed)throw error}
 }
}
