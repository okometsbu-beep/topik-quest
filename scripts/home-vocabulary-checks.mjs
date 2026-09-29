import assert from 'node:assert/strict';
export async function verifyHomeVocabulary({evaluate,tap,shot,setViewport,send,ready,sleep}){
 const fit=async label=>{
  const r=await evaluate(`(()=>{const h=document.querySelector('#today-lesson-title'),art=document.querySelector('.harumalLessonArt');return{overflow:document.documentElement.scrollWidth>innerWidth+1,title:h?.getBoundingClientRect().width,card:document.querySelector('.tqTodayLesson')?.clientWidth,artBottom:art?.getBoundingClientRect().bottom,titleTop:h?.getBoundingClientRect().top,flags:[...document.querySelectorAll('.tqLang,#flagBtn')].filter(x=>x.getBoundingClientRect().width).map(x=>({text:x.textContent,label:x.getAttribute('aria-label')}))}})()`);
  assert.equal(r.overflow,false,label+' overflow');
  if(r.title){assert.ok(r.title>r.card*.75,label+' full-width title');assert.ok(r.artBottom<=r.titleTop,label+' mascot above title')}
  for(const flag of r.flags){assert.ok(['🇰🇷','🇯🇵','🇺🇸','🇨🇳'].includes(flag.text),label+' flag');assert.ok(flag.label,label+' accessible language name')}
 };
 for(const lang of ['ko','ja','en','zh'])for(const theme of ['light','dark'])for(const width of [320,375,390,430]){
  await setViewport(width,844);await evaluate(`setLang('${lang}');malbitSetTheme('${theme}');tqSetLearningPath('beginner');setView('home')`);
  await fit(lang+theme+width);await shot(`refresh-home-${lang}-${theme}-${width}.png`);
  assert.equal(await evaluate(`!!document.querySelector('#nav_vocab')&&!document.querySelector('#nav_travel')`),true);
  await tap('.harumalShortsLaunch');assert.equal(await evaluate('S.view'),'shorts');await tap('.shortsTop>button');
  await tap('.tqTravelFeature');assert.equal(await evaluate('S.view'),'travel');await tap('#nav_vocab');
  await evaluate(`S.vocab=[{text:'학교',ja:'学校',meanings:{ja:'学校',en:'school',zh:'学校'},dueAt:123,interval:3},{text:'사과',ja:'りんご',meanings:{ja:'りんご',en:'apple',zh:'苹果'},dueAt:456,interval:2}];save();render()`);
  await tap('.harumalVocabTabs button');await fit('test '+lang+theme+width);await shot(`refresh-test-${lang}-${theme}-${width}.png`);
  for(const view of ['learn','review','more','vocab']){await evaluate(`setView('${view}')`);await fit(view+lang+theme+width);if(width===320)await shot(`refresh-${view}-${lang}-${theme}-${width}.png`)}
  await tap('#nav_home');
 }
 await evaluate(`setLang('ko');malbitSetTheme('dark');setView('vocab');harumalVocabTestStart()`);
 const before=await evaluate('JSON.stringify(S.vocab)');
 await tap('#vocabTestAnswer');await send('Input.insertText',{text:'학'});
 await send('Page.reload');await ready();
 assert.equal(await evaluate(`document.querySelector('#vocabTestAnswer')?.value`),'학','draft restores after reload');
 await evaluate(`harumalVocabTestDraft(S.vocabExam.items[0].term);render()`);await tap('.harumalTestPrimary');
 await tap('#vocabTestAnswer');await send('Input.insertText',{text:'틀린 답'});await tap('.harumalTestPrimary');
 assert.equal(await evaluate(`document.querySelector('.harumalTestResult>b').textContent`),'1 / 2');await shot('refresh-test-results.png');
 await tap('.harumalVocabTest>.harumalTestPrimary');assert.equal(await evaluate('S.vocabExam.items.length'),1);
 assert.equal(await evaluate('JSON.stringify(S.vocab)'),before,'test preserves existing SRS fields');
 assert.equal(await evaluate(`(()=>{const e=new Event('contextmenu',{bubbles:true,cancelable:true});document.querySelector('#vocabTestAnswer').dispatchEvent(e);return e.defaultPrevented})()`),true);
 for(const view of ['learn','review','more','vocab']){await evaluate(`setView('${view}')`);await fit(view);await shot(`refresh-${view}-dark.png`)}
 await tap('#nav_home');await tap('.tqLang');await shot('refresh-language-menu.png');
 await evaluate(`document.querySelector('#flagMenu').classList.remove('show')`);
 // Reduced motion skips decoding/downloading even outside the recent-launch window.
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await evaluate(`sessionStorage.removeItem('harumalIntroSeenV1')`);
 await send('Page.reload',{ignoreCache:true});await ready();await shot('refresh-loading-reduced.png');
 assert.equal(await evaluate(`document.querySelector('.harumanIntro')===null`),true);
 assert.equal(await evaluate(`performance.getEntriesByType('resource').some(e=>e.name.includes('/assets/video/'))`),false);
 await send('Emulation.setEmulatedMedia',{features:[]});
 await sleep(80);
}
