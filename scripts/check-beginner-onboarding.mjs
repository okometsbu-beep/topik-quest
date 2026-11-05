// Hosted Chrome regression in an isolated synthetic profile, never a learner's browser.
// Viewport emulation is not physical-phone or human learning/audio validation.
import {createBrowserReadiness} from './lib/browser-readiness.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'artifacts/beginner-onboarding');fs.mkdirSync(out,{recursive:true});
const port=4196,debug=9246,base=`http://127.0.0.1:${port}`;
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'harumal-beginner-qa-'));
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:'ignore'});
const chrome=spawn(process.env.CHROME_PATH||'google-chrome',['--headless','--disable-gpu','--no-sandbox','--disable-dev-shm-usage',`--remote-debugging-port=${debug}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let socket,launchError;chrome.on('error',error=>{launchError=error});server.on('error',error=>{launchError=error});
const report={qualification:'Synthetic isolated profile; emulated viewports, not physical-device, audio-quality or learner-effectiveness evidence.',cases:[],errors:[]};
try{
 let connected=false;
 for(let i=0;i<150;i++){if(launchError)throw launchError;try{const r=await fetch(`http://127.0.0.1:${debug}/json/version`);if(r.ok){connected=true;break}}catch{}await sleep(100)}
 assert.ok(connected,'Hosted Chrome did not start');
 const target=await(await fetch(`http://127.0.0.1:${debug}/json/new?about:blank`,{method:'PUT'})).json();
 socket=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
 let serial=0;const pending=new Map();
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error(`CDP timeout: ${method}`))},30000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}))});
 socket.addEventListener('message',async event=>{const m=JSON.parse(typeof event.data==='string'?event.data:await event.data.text());if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(m.error.message)):p.resolve(m.result)}if(m.method==='Runtime.exceptionThrown')report.errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text)});
 const run=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value};
 const {navigate}=createBrowserReadiness({send,run,label:'Beginner onboarding',predicate:`typeof S==='object'&&!!window.HARUMAL_HUB&&!!window.MALBIT_BEGINNER_GRAMMAR_REVIEW&&typeof malbitGrammarChip==='function'&&!document.documentElement.classList.contains('tq-booting')&&!document.querySelector('.harumanIntro')`});
 const click=selector=>run(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing control: '+${JSON.stringify(selector)});e.click()})()`);
 const shot=async name=>{await sleep(100);const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(r.data,'base64'))};
 const fits=async label=>assert.equal(await run('document.documentElement.scrollWidth>innerWidth+1'),false,label+' horizontal overflow');
 const grammar=()=>run(`JSON.parse(localStorage.getItem('malbitBeginnerV1')).grammarV1`);
 // A closed <details> can retain descendant layout rectangles while suppressing
 // their rendering. Geometry alone therefore does not establish visibility.
 const visibleLetters=()=>run(`[...document.querySelectorAll('.hbLetterCard')].filter(e=>!e.closest('details:not([open])')&&e.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})&&e.getBoundingClientRect().height>0).length`);

 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await navigate('Page.navigate',{url:base});
 for(const lang of ['ko','ja','en','zh'])for(const width of [320,390]){
  const label=`${lang}-${width}`;
  await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});
  // Seed only this disposable localhost profile. Preserve representative sibling records.
  await run(`localStorage.setItem('malbitBeginnerV1',JSON.stringify({known:['v:ㅏ','c:ㄱ'],readingV2:{index:2,completed:['tree'],confirmed:false},qaSentinel:{keep:'sibling'},grammarV1:{completed:['copula'],quizCorrect:{copula:true},writingDone:{copula:true},writingUnits:{copula:[0,1]},drafts:{topic:'한국어'},rewardAttempts:{copula:{sessionId:'qa-old',assisted:true}}}}));S.lang=${JSON.stringify(lang)};S.speaking={mode:'read',index:3,last:null};save();setView('home');scrollTo(0,0)`);
  assert.equal(await run(`document.querySelectorAll('.hubLanguageEntry button').length`),4);
  await click('.hubLanguageEntry summary');await click(`.hubLanguageEntry button[lang="${lang}"]`);
  assert.equal(await run('S.lang'),lang);await fits(label+' home');
  await run(`malbitBeginnerExpandLetters('vowels',false);malbitBeginnerExpandLetters('consonants',false);setView('beginner');malbitBeginnerTab('vowels');scrollTo(0,0)`);
  // Save evidence before asserting so an unexpected open state is diagnosable.
  await shot(label+'-hangul-collapsed');
  const collapsed=await run(`(()=>{const d=document.querySelector('.hbMoreLetters');return {open:d?.open,total:document.querySelectorAll('.hbLetterCard').length,inside:d?.querySelectorAll('.hbLetterCard').length}})()`);
  report.hangulDiagnostics??=[];report.hangulDiagnostics.push({label,...collapsed});
  assert.deepEqual(collapsed,{open:false,total:21,inside:15},label+' collapsed starter structure');
  assert.equal(await visibleLetters(),6,label+' visible starter letters');
  await click('.hbMoreLetters summary');await sleep(50);
  assert.equal(await run(`document.querySelector('.hbMoreLetters').open`),true,label+' expanded state');
  assert.equal(await visibleLetters(),21,label+' visible expanded letters');
  await fits(label+' expanded vowels');await shot(label+'-hangul');
  await click('.hbLessonContinue');
  assert.equal(await run(`document.querySelector('.v33BeginnerTabs .on').textContent.trim().startsWith('2.')`),true);
  await click('.hbLessonContinue');
  assert.equal(await run(`document.querySelector('.v33BeginnerTabs .on').textContent.trim().startsWith('3.')`),true);
  assert.deepEqual(await run(`[...document.querySelectorAll('.v33BeginnerTabs button')].map(e=>e.textContent.trim().slice(0,2))`),['1.','2.','3.','4.']);
  if(width===320&&['en','ja'].includes(lang)){
   await click('.v34WritingTab');
   assert.match(await run(`document.querySelector('.v35WritingPractice header small').textContent`),/STEP 4/);
   assert.ok(await run(`document.querySelector('.v35TraceHint').textContent.trim().length>0`));
   await fits(label+' tracing');await run(`document.querySelector('.v35WritingPractice').scrollIntoView()`);await shot(label+'-tracing');
  }
  await run(`malbitOpenGrammar();malbitGrammarLesson('sentence-order');scrollTo(0,0)`);
  assert.equal(await run(`document.querySelectorAll('[data-chip]').length`),3);
  if(lang!=='ko')assert.equal(await run(`/주어|목적어|동사/.test(document.querySelector('.bgFormula').textContent)`),false);
  await click('[data-chip="2"]');await click('.bgChunks button:last-child');
  assert.equal(await run(`!!document.querySelector('.bgFeedback[role="status"]:not(.wrong):not(.correct)')`),true);
  assert.equal((await grammar()).attempts?.['sentence-order']||0,0);
  await click('[data-chip="0"]');await click('[data-chip="1"]');await click('.bgChunks button:last-child');
  assert.equal(await run(`!!document.querySelector('.bgFeedback.wrong')`),true);
  assert.ok((await grammar()).reviewPending.includes('sentence-order'));
  await navigate('Page.reload',{ignoreCache:false});
  assert.equal(await run('S.lang'),lang);
  await run(`setView('review');scrollTo(0,0)`);
  assert.equal(await run(`document.querySelectorAll('[data-beginner-review="sentence-order"]').length`),1);
  await fits(label+' review');await shot(label+'-review');
  await click('[data-beginner-review="sentence-order"]');
  assert.equal(await run(`document.querySelector('.bgChipAnswer').textContent`),'공부해요 → 저는 → 한국어를');
  await click('[onclick="malbitGrammarChipReset()"]');
  await click('[data-chip="0"]');await click('[onclick="malbitGrammarChipUndo()"]');
  assert.equal(await run(`document.querySelector('[data-chip="0"]').disabled`),false);
  for(const i of [0,1,2])await click(`[data-chip="${i}"]`);
  await click('.bgChunks button:last-child');
  assert.equal(await run(`!!document.querySelector('.bgFeedback.correct')`),true);
  const progress=await grammar();assert.equal(progress.quizCorrect['sentence-order'],true);assert.equal(progress.reviewPending.includes('sentence-order'),false);assert.equal(progress.rewardAttempts['sentence-order'].assisted,true);
  assert.equal(progress.completed.includes('copula'),true);assert.deepEqual(progress.writingUnits.copula,[0,1]);assert.equal(progress.drafts.topic,'한국어');assert.equal(progress.rewardAttempts.copula.sessionId,'qa-old');
  const siblings=await run(`JSON.parse(localStorage.getItem('malbitBeginnerV1'))`);assert.deepEqual(siblings.known,['v:ㅏ','c:ㄱ']);assert.equal(siblings.readingV2.index,2);assert.deepEqual(siblings.qaSentinel,{keep:'sibling'});
  await fits(label+' grammar');await run(`document.querySelector('.bgDrill').scrollIntoView()`);await shot(label+'-correct');
  await run(`setView('review')`);assert.equal(await run(`document.querySelectorAll('[data-beginner-review="sentence-order"]').length`),0);
  // Stub playback only: this checks UI dispatch/state neutrality, not real audio.
  await run(`setView('speaking');window.__qaSpeechBefore=JSON.stringify(S.speaking);window.__qaTTS=MALBIT_TTS;window.__qaPhrases=[];window.MALBIT_TTS={play:text=>__qaPhrases.push(text)}`);
  assert.equal(await run(`document.querySelectorAll('[data-speaking-warmup]').length`),4);
  for(const i of [0,1,2,3])await click(`[data-speaking-warmup="${i}"]`);
  assert.deepEqual(await run('__qaPhrases'),['안녕하세요','감사합니다','네','아니요']);
  assert.equal(await run('JSON.stringify(S.speaking)===__qaSpeechBefore'),true);
  await run('window.MALBIT_TTS=__qaTTS');await fits(label+' speaking');
  report.cases.push({lang,width,passed:true});
 }
 assert.deepEqual(report.errors,[],'Unexpected runtime exceptions');report.passed=true;
 console.log(JSON.stringify(report,null,2));
}catch(error){report.passed=false;report.failure=error.stack;throw error}
finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));socket?.close();chrome.kill('SIGTERM');server.kill('SIGTERM');}
