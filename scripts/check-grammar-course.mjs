import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),before=process.argv.includes('--before'),out=path.join(root,'artifacts/grammar-course'),baseline='037624aae3e373da02f476b8a2920ade7dd6319d';
fs.mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),port=4194,debug=9264,base=process.env.MALBIT_BASE_URL||`http://127.0.0.1:${port}`,version=fs.readFileSync(path.join(root,'site-patch.js'),'utf8').match(/const VERSION='(\d+)'/)[1];
const oldFiles=['learning-hub.js','legacy-core.js','topik1.js','random-practice-visual-system.js'];
const baselineFiles=new Map();
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.mp3':'audio/mpeg'};
const server=process.env.MALBIT_BASE_URL?null:http.createServer((req,res)=>{
 const url=new URL(req.url,base),name=decodeURIComponent(url.pathname);let body,type;
 if(name==='/qa-update.html'){body='<title>Update fixture</title>';type='text/html'}
 else if(name==='/qa-old-worker.js'){body=`self.addEventListener('install',e=>e.waitUntil(caches.open('malbit-v171').then(async c=>{for(const f of ${JSON.stringify(oldFiles)})await c.put('/'+f+'?v=171',await fetch('/qa-baseline/'+f))}).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.searchParams.get('v')==='171')e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});`;type='application/javascript';res.setHeader('Service-Worker-Allowed','/')}
 else if(name.startsWith('/qa-baseline/')){const f=name.slice(13);if(!oldFiles.includes(f)){res.writeHead(404);res.end();return}if(!baselineFiles.has(f))baselineFiles.set(f,execFileSync('git',['-c','safe.directory='+root.replaceAll('\\','/'),'show',baseline+':'+f],{cwd:root}));body=baselineFiles.get(f);type='application/javascript'}
 else {const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return}body=fs.readFileSync(file);type=mime[path.extname(file)]||'application/octet-stream'}
 res.writeHead(200,{'content-type':type,'cache-control':'no-store'});res.end(body);
});
if(server)await new Promise(r=>server.listen(port,'127.0.0.1',r));
const chrome=spawn(process.env.CHROME_PATH||(process.platform==='win32'?'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe':'google-chrome'),['--headless','--disable-gpu','--no-sandbox',`--remote-debugging-port=${debug}`,`--user-data-dir=${path.join(os.tmpdir(),'harumal-entry-qa-'+process.pid)}`,'about:blank'],{stdio:'ignore'});
let socket;
try{
 for(let i=0;i<100;i++){try{await fetch(`http://127.0.0.1:${debug}/json/version`);break}catch{await sleep(100)}}
 const target=await(await fetch(`http://127.0.0.1:${debug}/json/new?about:blank`,{method:'PUT'})).json();socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>socket.addEventListener('open',r,{once:true}));
 let serial=0;const pending=new Map(),errors=[];
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
 socket.addEventListener('message',async event=>{const m=JSON.parse(typeof event.data==='string'?event.data:await event.data.text());if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p?.reject(Error(m.error.message)):p?.resolve(m.result)}
  if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);

 });
 const run=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value};
 const viewport=async(w,h=844)=>{await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:true});await sleep(80)};
 const shot=async name=>{await sleep(150);const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(r.data,'base64'))};
 const ready=async()=>{for(let i=0;i<300;i++){try{if(await run(`!!window.HARUMAL_GRAMMAR&&!document.documentElement.classList.contains('tq-booting')&&!document.querySelector('.harumanIntro')`))return}catch{}await sleep(100)}throw Error('Boot timeout')};
 const reload=async()=>{const origin=await run('performance.timeOrigin');await send('Page.reload',{ignoreCache:true});for(let i=0;i<300;i++){try{if(await run('performance.timeOrigin')!==origin)break}catch{}await sleep(50)}await ready()};
 await send('Runtime.enable');await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});


 await send('Page.addScriptToEvaluateOnNewDocument',{source:`if(!localStorage.getItem('qaGrammarSeed')){localStorage.setItem('malbitBeginnerV1',JSON.stringify({known:['가'],grammarV1:{completed:['copula'],quizCorrect:{copula:true},writingDone:{copula:true}}}));localStorage.setItem('qaGrammarSeed','1')}`});
 await viewport(390);await send('Page.navigate',{url:base});await ready();
 const solve=async(one=false)=>{for(let i=0;i<30;i++){const stage=await run(`HARUMAL_GRAMMAR.getState().sessions[HARUMAL_GRAMMAR.getState().currentId].stage`);if(stage==='summary')return;const answered=await run(`(()=>{const state=HARUMAL_GRAMMAR.getState(),s=state.sessions[state.currentId],lesson=HARUMAL_GRAMMAR.course.lessons.find(l=>l.id===s.lessonId),a=HARUMAL_GRAMMAR_ENGINE.currentActivity(s,lesson);if(a.type==='text'){const input=document.getElementById('gcAnswer');input.value=a.accepted[0];input.dispatchEvent(new Event('input',{bubbles:true}))}else if(a.type==='choice'){[...document.querySelectorAll('[data-gc-action=choice]')].find(b=>b.dataset.value===String(a.answer)).click()}else{for(const token of a.answer)[...document.querySelectorAll('[data-gc-action=order]')].find(b=>{const t=(a.tokens||a.answer)[Number(b.dataset.index)];return (typeof t==='object'?t.id:t)===token&&!b.disabled}).click()}document.querySelector('[data-gc-action=submit]').click();return {role:a.role,type:a.type,mode:s.mode}})()`);if(answered.role==='construction')await shot(answered.mode==='review'?'delayed-construction-success':'new-sentence-success');await run(`document.querySelector('[data-gc-action=continue]').click()`);if(one)return}throw Error('lesson did not complete')};
 const beforeLegacy=await run(`localStorage.getItem('malbitBeginnerV1')`),rows=[];
 for(const lang of ['ko','ja','en','zh'])for(const width of [320,390,1280])for(const theme of ['light','dark']){
  await viewport(width);await run(`S.lang='${lang}';malbitSetTheme('${theme}');malbitOpenGrammar()`);
  assert.equal(await run('S.view'),'grammarCourse');assert.equal(await run('document.documentElement.scrollWidth>innerWidth'),false);
  await run(`document.querySelector('[data-gc-action=lesson][data-id=sentence-order]').click()`);assert.equal(await run('document.documentElement.scrollWidth>innerWidth'),false);
  assert.equal(await run(`!!document.querySelector('.gcInstruction')`),true);if(lang==='ja'&&width===390)await shot('reference-'+theme);
  rows.push({lang,width,theme});
 }
 await viewport(390);await run(`S.lang='ja';malbitSetTheme('light');malbitOpenGrammar();document.querySelector('[data-gc-action=lesson][data-id=sentence-order]').click();document.querySelector('[data-gc-action=start]').click()`);await shot('guided-assembly');await solve(true);await run(`var input=document.getElementById('gcAnswer');input.value='저는 한국어';input.dispatchEvent(new Event('input',{bubbles:true}))`);
 await reload();await run(`malbitOpenGrammar();document.querySelector('[data-gc-action=resume]').click()`);assert.equal(await run(`document.getElementById('gcAnswer').value`),'저는 한국어');
 await run(`document.querySelector('[data-gc-action=submit]').click()`);assert.equal(await run(`!!document.querySelector('.gcFeedback.wrong')`),true);await shot('specific-error');
 await run(`document.querySelector('[data-gc-action=retry]').click();document.querySelector('[data-gc-action=help]').click();var input=document.getElementById('gcAnswer');input.value='저는 한국어를 공부해요';input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-gc-action=submit]').click()`);assert.equal(await run(`!!document.querySelector('.gcFeedback.correct')`),true);await run(`document.querySelector('[data-gc-action=continue]').click()`);await solve();assert.equal(await run(`!!document.querySelector('.gcSummary')`),true);await shot('practice-summary');
 assert.equal(await run(`localStorage.getItem('malbitBeginnerV1')`),beforeLegacy);
 await run(`malbitOpenGrammar();document.querySelector('[data-gc-action=handwritingCatalog]').click()`);assert.equal(await run(`!!document.querySelector('.bgScreen')`),true);
 const lessonId=await run(`HARUMAL_GRAMMAR.course.lessons.find(l=>l.activities.some(a=>a.phase==='transfer')&&l.activities.some(a=>a.phase==='review'))?.id`);
 if(lessonId){
  await run(`malbitOpenGrammar();document.querySelector('[data-gc-action=lesson][data-id="${lessonId}"]').click();document.querySelector('[data-gc-action=start]').click()`);

  await solve();await run(`const originalNow=Date.now;Date.now=()=>originalNow()+25*60*60*1000;malbitOpenGrammar()`);for(let i=0;i<5;i++){if(await run(`HARUMAL_GRAMMAR_ENGINE.progress(HARUMAL_GRAMMAR.getState(),'${lessonId}',HARUMAL_GRAMMAR.course,Date.now()).retained`))break;await run(`malbitOpenGrammar();document.querySelector('[data-gc-action=review]').click()`);await solve()}
  assert.equal(await run(`HARUMAL_GRAMMAR_ENGINE.progress(HARUMAL_GRAMMAR.getState(),'${lessonId}',HARUMAL_GRAMMAR.course,Date.now()).status`),'retained');await shot('delayed-recall-summary');
 }
 const rewardBefore=await run('HARUMAL_REWARDS.getState().xp');
 await run(`malbitOpenGrammar();document.querySelector('[data-gc-action=sound]').click();document.querySelector('[data-gc-action=lesson][data-id=extended-past-experience]').click();document.querySelector('[data-gc-action=start]').click()`);assert.equal(await run('S.grammarCourseSound'),false);await solve();
 const rewardAfter=await run('HARUMAL_REWARDS.getState().xp');assert.equal(rewardAfter-rewardBefore,35,'first independent construction and course completion earn bounded milestones');await shot('skill-and-reward-summary');
 await run(`document.querySelector('[data-gc-action=restart]').click()`);await solve();assert.equal(await run('HARUMAL_REWARDS.getState().xp'),rewardAfter,'restarting the same point cannot farm XP');
 assert.equal(await run(`localStorage.getItem('malbitBeginnerV1')`),beforeLegacy);assert.equal(errors.length,0);
 console.log(JSON.stringify({layouts:rows,legacyPreserved:true,reloadDraft:true,retryHelp:true,optionalHandwriting:true,delayedReview:!!lessonId,errors}));
}finally{socket?.close();chrome.kill();server?.close()}
