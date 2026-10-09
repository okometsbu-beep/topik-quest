import assert from 'node:assert/strict';

// Runs only in the existing disposable CI browser, never against learner data.
export async function verifyGrowthLearning({evaluate,tap,shot,setViewport,send,ready,sleep}){
 assert.equal(await evaluate(`['localhost','127.0.0.1','[::1]'].includes(location.hostname)`),true);
 assert.equal(await evaluate(`!!window.HARUMAL_GROWTH&&!!window.HARUMAL_REWARDS`),true,'growth and reward runtimes loaded');
 const original=await evaluate(`({storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),state:JSON.stringify(S),history:history.state,theme:document.documentElement.dataset.theme})`);
 const current=()=>evaluate('HARUMAL_GROWTH.status().current');
 const totals=()=>evaluate(`(()=>{const s=HARUMAL_REWARDS.getState();return{xp:s.xp,coins:s.coins,events:s.events.length}})()`);
 const click=(action,attrs='')=>tap(`#harumalGrowthRoot [data-growth-action="${action}"]${attrs}`,0,45);
 const choice=(value,field)=>click('select',`${field!==undefined?`[data-field="${field}"]`:''}[data-value="${value}"]`);
 const enterGrowth=async()=>{await evaluate(`HARUMAL_HUB.openPractice()`);await tap('[data-hub-action="growth"]',0,80)};
 const phase=()=>evaluate(`document.querySelector('#harumalGrowthRoot')?.dataset.stage`);
 const checkFits=async label=>{
  const fit=await evaluate(`(()=>{const root=document.querySelector('#harumalGrowthRoot'),page=root?.querySelector('.growthPage');if(!root||root.hidden||!page)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'};const controls=[...root.querySelectorAll('button,textarea')].filter(visible);return{missing:false,width:innerWidth,overflow:root.scrollWidth-root.clientWidth,body:document.documentElement.scrollWidth-innerWidth,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left< -1||r.right>innerWidth+1}).map(el=>el.className),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.height<43||r.width<43}).map(el=>({class:el.className,height:el.getBoundingClientRect().height,width:el.getBoundingClientRect().width})),images:[...root.querySelectorAll('.growthMascot img')].map(img=>({src:img.getAttribute('src'),loaded:img.complete&&img.naturalWidth>0})),background:getComputedStyle(page).backgroundColor}})()`);
  assert.equal(fit.missing,false,label+' visible root');assert.ok(fit.overflow<=1&&fit.body<=1,label+' overflow');assert.deepEqual(fit.outside,[],label+' horizontal containment');assert.deepEqual(fit.small,[],label+' 44px controls');
  for(const img of fit.images){assert.match(img.src,/assets\/art\/haruman\/[a-z-]+-v2\.webp$/);if(!img.loaded){await sleep(100);assert.equal(await evaluate(`[...document.querySelectorAll('#harumalGrowthRoot .growthMascot img')].every(img=>img.complete&&img.naturalWidth>0)`),true,label+' original mascot loaded')}}
 };
 const beginRecipe=async id=>{
  await click('hub');await click('filter','[data-value="all"]');
  const existing=await evaluate(`(()=>{const card=[...document.querySelectorAll('#harumalGrowthRoot .growthLessonCard')].find(el=>el.querySelector('[data-recipe="${id}"]')||[...el.querySelectorAll('[data-session]')].some(el=>HARUMAL_GROWTH.getState().sessions[el.dataset.session]?.recipeId==='${id}'));const button=card?.querySelector('button');return button?{growthAction:button.getAttribute('data-growth-action'),recipe:button.getAttribute('data-recipe'),session:button.getAttribute('data-session')}:null})()`);
  assert.ok(existing,'recipe card '+id);
  if(existing.growthAction==='start')await click('start',`[data-recipe="${id}"]`);
  else{await click('resume',`[data-session="${existing.session}"]`);assert.equal(await phase(),'summary',id+' prior run finished');await click('repeat',`[data-recipe="${id}"]`)}
  assert.equal(await phase(),'orientation');await click('begin');assert.equal(await phase(),'learn');
 };
 const answerTask=async q=>{
  if(q.kind==='listen'){await click('help','[data-help="transcript"]');await choice(q.answer,'')}
  else if(['choice','insert'].includes(q.kind))await choice(q.answer);
  else if(q.kind==='pair'||q.kind==='table')for(const row of q.rows)await choice(row.answer,row.id);
  else if(q.kind==='sort')for(const card of q.cards)await choice(card.answer,card.id);
  else if(q.kind==='evidence'){await choice(q.answer.claim,'claim');await choice(q.answer.evidence,'evidence')}
  else if(q.kind==='order')for(const value of q.answer)await click('order-add',`[data-value="${value}"]`);
  else if(q.kind==='dialogue'){await choice(q.answer.first,'first');await choice(q.answer.second,'second')}
  else if(q.kind==='text'){await tap('#growthDraft',0,30);await send('Input.insertText',{text:q.accepted[0]});assert.equal(await evaluate(`document.querySelector('#growthDraft').value`),q.accepted[0])}
  else assert.fail('unsupported authored kind '+q.kind);
  await click('submit');
 };
 let failure;
 try{
  await evaluate(`stopTimer();setLang('ko');malbitSetTheme('light');setView('home')`);await setViewport(320,844);
  assert.match(await evaluate(`document.querySelector('.harumalCompactStatus').textContent`),/Lv\./);await shot('growth-home-status-320-light.png');
  await enterGrowth();await beginRecipe('meaning');
  const initial=await totals(),sessionId=(await current()).id;
  await choice('junho','');await click('submit');assert.deepEqual(await totals(),initial,'wrong answer earns nothing');
  await click('help','[data-help="isoo"]');await click('help','[data-help="man"]');await checkFits('320px wrong+help');await shot('growth-notice-320-light-wrong-help.png');
  await click('retry');await choice('minji','');
  await evaluate(`(()=>{const button=document.querySelector('#harumalGrowthRoot [data-growth-action="submit"]');button.click();button.click()})()`);
  assert.equal(await phase(),'learn-complete');assert.equal((await current()).records.learn.attempts.length,2);
  const learnt=await totals();assert.equal(learnt.xp-initial.xp,30);assert.equal(learnt.coins-initial.coins,6);assert.equal(learnt.events-initial.events,2);
  assert.equal(await evaluate(`HARUMAL_GROWTH_ENGINE.summary(HARUMAL_GROWTH.status().current).learn.assisted`),true);
  await checkFits('320px completion');await shot('growth-notice-320-light-learned.png');
  await send('Page.reload',{ignoreCache:true});await ready();assert.equal((await current()).id,sessionId);assert.equal(await phase(),'learn-complete');assert.deepEqual(await totals(),learnt,'reload does not regrant');
  await click('continue');await choice('sora','');await click('submit');assert.equal(await phase(),'summary');
  assert.equal(await evaluate(`HARUMAL_GROWTH_ENGINE.summary(HARUMAL_GROWTH.status().current).transfer.independent`),true);
  const done=await totals();assert.equal(done.xp-initial.xp,70);assert.equal(done.coins-initial.coins,14);assert.equal(done.events-initial.events,4);
  assert.match(await evaluate(`document.querySelector('#harumalGrowthRoot').textContent`),/‘이수자’를 새 문맥에서 안다는 뜻은 아니/);
  await checkFits('320px summary');await shot('growth-notice-320-light-summary.png');
  await evaluate(`history.back()`);await sleep(100);assert.equal(await evaluate(`document.querySelector('#harumalGrowthRoot').hidden`),true,'browser Back closes growth');
  await enterGrowth();assert.equal(await phase(),'summary');assert.deepEqual(await totals(),done,'back/re-entry does not regrant');
  await click('close');await sleep(100);
  // Active timed exam and Shorts have no growth/hint entry; existing navigation remains.
  await evaluate(`tqSetLevel(1);tqStartMode('shorts')`);assert.equal(await evaluate(`document.querySelectorAll('#screen [data-growth-entry]').length`),0);
  assert.equal(await evaluate(`document.querySelector('.shortsCard')!==null`),true);
  await evaluate(`setView('home');t1Begin('reading')`);if(await evaluate(`!!document.querySelector('#malbitListeningDialog.open')`))await tap('#malbitListeningDialog .off',0,60);assert.equal(await evaluate(`S.view`),'t1quiz','exam starts after the existing listening availability prompt');const beforeExam=await totals();
  assert.equal(await evaluate(`document.querySelectorAll('#screen [data-growth-entry]').length`),0);
  assert.equal(await evaluate(`document.querySelector('#harumalGrowthRoot')?.hidden!==false`),true);
  assert.deepEqual(await totals(),beforeExam,'exam entry produces no reward');await evaluate(`stopTimer();setView('home')`);
  await enterGrowth();
  const recipes=await evaluate(`HARUMAL_GROWTH_DATA.recipes`);
  for(const recipe of recipes){
   if(recipe.id==='meaning')continue;
   await beginRecipe(recipe.id);const before=await totals();await answerTask(recipe.learn);assert.equal(await phase(),'learn-complete',recipe.id+' learning completion');await click('continue');
   await checkFits(recipe.id+' task 320');await shot(`growth-${recipe.id}-320-light-task.png`);
   await answerTask(recipe.transfer);assert.equal(await phase(),'summary',recipe.id+' transfer completion');
   const after=await totals();assert.equal(after.events-before.events,4,recipe.id+' exactly two answer + two stage grants');const tiers={easy:[10,2],medium:[15,3],hard:[25,5],very_hard:[40,8]};const lr=tiers[recipe.learn.difficulty]||tiers.medium,tr=tiers[recipe.transfer.difficulty]||tiers.medium;assert.equal(after.xp-before.xp,lr[0]+tr[0]+50,recipe.id+' exact difficulty XP');assert.equal(after.coins-before.coins,lr[1]+tr[1]+10,recipe.id+' exact difficulty coins');
   await checkFits(recipe.id+' summary');
  }
  // Repeat is a new rewarded practice, not a fabricated unseen-item success.
  const beforeRepeat=await totals();await beginRecipe('meaning');assert.notEqual((await current()).id,sessionId);
  await answerTask(recipes.find(r=>r.id==='meaning').learn);await click('continue');await answerTask(recipes.find(r=>r.id==='meaning').transfer);
  assert.equal((await totals()).events-beforeRepeat.events,4);
  for(const theme of ['light','dark'])for(const width of [320,390]){
   await evaluate(`malbitSetTheme('${theme}')`);await setViewport(width,844);await checkFits(`${width} ${theme} summary`);await shot(`growth-summary-${width}-${theme}.png`);
   await click('hub');await checkFits(`${width} ${theme} hub`);await shot(`growth-hub-${width}-${theme}.png`);
   await click('resume',`[data-session="${(await evaluate(`Object.values(HARUMAL_GROWTH.getState().sessions).filter(s=>s.recipeId==='meaning').sort((a,b)=>b.createdAt-a.createdAt)[0].id`))}"]`);
  }
  // Every guidance surface follows the selected language without changing Korean targets or evidence.
  await beginRecipe('meaning');await click('help','[data-help="isoo"]');await click('help','[data-help="man"]');
  for(const lang of ['ja','en','zh','ko']){
   const beforeLanguage=await evaluate(`JSON.stringify(HARUMAL_GROWTH.getState())`),beforeBalance=await totals();
   await evaluate(`setLang('${lang}');HARUMAL_GROWTH.refreshLanguage()`);
   assert.equal(await evaluate(`JSON.stringify(HARUMAL_GROWTH.getState())`),beforeLanguage,lang+' locale switch must not alter growth evidence');assert.deepEqual(await totals(),beforeBalance,lang+' locale switch earns no rewards');
   const expected=await evaluate(`({prompt:HARUMAL_GROWTH.getLessonText('GL-MEAN-L','prompt','${lang}'),definition:HARUMAL_GROWTH.getLessonText('GL-MEAN-L','tokens.isoo','${lang}')})`);
   const visible=await evaluate(`document.querySelector('#harumalGrowthRoot').textContent`);assert.ok(visible.includes(expected.prompt)&&visible.includes(expected.definition),lang+' actual prompt and definition match selected language');assert.match(visible,/교육 이수자만 입장 가능/,'Korean stimulus stays Korean');
   for(const width of [320,390]){await setViewport(width,844);await checkFits(`${lang} ${width} localized help`);await shot(`growth-guidance-${lang}-${width}.png`)}
  }
  await answerTask(recipes.find(r=>r.id==='meaning').learn);await click('continue');await answerTask(recipes.find(r=>r.id==='meaning').transfer);
  for(const lang of ['ja','en','zh']){
   const beforeLanguage=await evaluate(`JSON.stringify(HARUMAL_GROWTH.getState())`);await evaluate(`setLang('${lang}');HARUMAL_GROWTH.refreshLanguage()`);assert.equal(await evaluate(`JSON.stringify(HARUMAL_GROWTH.getState())`),beforeLanguage);
   const expected=await evaluate(`HARUMAL_GROWTH.getLessonText('GL-MEAN-T','explain','${lang}')`);assert.ok((await evaluate(`document.querySelector('#harumalGrowthRoot').textContent`)).includes(expected),lang+' localized explanation');await checkFits(lang+' final explanation');await shot(`growth-explanation-${lang}-390.png`);
  }
  await evaluate(`setLang('ko');HARUMAL_GROWTH.refreshLanguage()`);
  await click('close');await sleep(100);await evaluate(`setView('profile')`);
  const profileStatus=await evaluate(`(()=>{const root=document.querySelector('#screen.hubProfile .harumalCompactStatus'),state=HARUMAL_REWARDS.getState(),level=HARUMAL_REWARDS.levelInfo(state.xp);return{exists:!!root,actual:{coins:root?.querySelector('.hubCoins b')?.textContent?.trim(),level:root?.querySelector('.hubStatusMain b')?.textContent?.trim(),xp:root?.querySelector('progress')?.value,maxXp:root?.querySelector('progress')?.max},expected:{coins:'◉ '+state.coins,level:'Lv. '+level.level,xp:level.currentXp,maxXp:level.nextXp}}})()`);
  assert.equal(profileStatus.exists,true,'profile compact reward status exists');
  assert.deepEqual(profileStatus.actual,profileStatus.expected,'profile coins, level and XP match reward ledger');
  await shot('growth-activity-status-390-dark.png');
  // Backup merge is idempotent and the level boundary is based on activity XP.
  await evaluate(`window.__growthBackup=HARUMAL_REWARDS.exportState()`);const beforeImport=await totals();
  await evaluate(`HARUMAL_REWARDS.mergeImport(window.__growthBackup);HARUMAL_REWARDS.mergeImport(window.__growthBackup)`);assert.deepEqual(await totals(),beforeImport);
  assert.deepEqual(await evaluate(`[99,100,299,300].map(x=>HARUMAL_REWARDS.levelInfo(x).level)`),[1,2,2,3]);
  console.log('Growth browser QA: 11 paired lessons, varied interactions, wrong/help/retry, correct/transfer, XP+coin tiers, repeated submit, reload/Back/re-entry, new session, exam/Shorts separation, status, backup dedupe, four-language guidance/evidence preservation, 320/390px two themes passed.');
 }catch(error){failure=error;throw error}finally{
  try{
   await evaluate(`(()=>{HARUMAL_GROWTH.close(false);stopTimer();const saved=${JSON.stringify(original.storage)};for(const k of Object.keys(localStorage))if(!Object.hasOwn(saved,k))localStorage.removeItem(k);for(const[k,v]of Object.entries(saved))localStorage.setItem(k,v);S=JSON.parse(${JSON.stringify(original.state)});document.documentElement.dataset.theme=${JSON.stringify(original.theme)};history.replaceState(${JSON.stringify(original.history)},'');delete window.__growthBackup})()`);
   await send('Page.reload',{ignoreCache:true});await ready();
  }catch(error){if(!failure)throw error}
 }
}
