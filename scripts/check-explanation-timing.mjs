import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),before=process.argv.includes('--before'),out=path.join(root,'artifacts/entry-ui'),baseline='037624aae3e373da02f476b8a2920ade7dd6319d';
fs.mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),port=4190,debug=9260,base=process.env.MALBIT_BASE_URL||`http://127.0.0.1:${port}`,version=fs.readFileSync(path.join(root,'site-patch.js'),'utf8').match(/const VERSION='(\d+)'/)[1];
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
 const ready=async()=>{for(let i=0;i<300;i++){try{if(await run(`!!window.HARUMAL_PRACTICE&&!document.documentElement.classList.contains('tq-booting')&&!document.querySelector('.harumanIntro')`))return}catch{}await sleep(100)}throw Error('Boot timeout')};
 const reload=async()=>{const origin=await run('performance.timeOrigin');await send('Page.reload',{ignoreCache:true});for(let i=0;i<300;i++){try{if(await run('performance.timeOrigin')!==origin)break}catch{}await sleep(50)}await ready()};
 await send('Runtime.enable');await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});

 await viewport(390);await send('Page.navigate',{url:base});await ready();


 await run(`S.lang='ko';malbitSetTheme('light')`);
 const force=async id=>run(`(()=>{HARUMAL_PRACTICE.startRandom(2,'reading');const q=MALBIT_BANK.byId('${id}');S.infinity.current={type:'read',id:q.no,bankId:q.id,choiceOrder:[3,2,1,0]};delete S.infinity.questionTiming;S.infinity.feedback=null;stopTimer();render()})()`);
 await force('M02-II-R-40');await sleep(100);await shot('explanation-before-submit');
 assert.equal(await run(`document.querySelectorAll('.hqIdentity').length`),0);
 assert.equal(await run(`document.querySelectorAll('.hqEvidence').length`),0);
 const records=[];
 for(const correct of [true,false]){
  await force('M02-II-R-40');const started=await run('S.infinity.questionTiming.started');await sleep(1300);
  await run(`render()`);assert.equal(await run('S.infinity.questionTiming.started'),started);
  await sleep(1000);await run(`(()=>{const q=infinityCurrentQuestion(),i=${correct?'q.answerIndex':'(q.answerIndex+1)%4'};document.querySelector('[data-choice="'+i+'"]').click();document.querySelector('[data-choice="'+i+'"]').click()})()`);
  const fb=await run('({...S.infinity.feedback,timing:S.infinity.questionTiming})');assert.equal(fb.ok,correct);assert.ok(fb.sec>=2.2&&fb.sec<5);assert.equal(fb.sec,fb.timing.seconds);
  const count=await run('S.infinity.count');await run('submitInfinity();submitInfinity()');assert.equal(await run('S.infinity.count'),count);
  const event=await run(`JSON.parse(localStorage.getItem('malbitLearningEventsV1')).at(-1)`);assert.equal(event.duration,fb.sec);
  await run('malbitToggleRandomExplanation()');await sleep(650);
  const evidence=await run(`({marks:[...document.querySelectorAll('.hqEvidence')].map(x=>x.textContent),text:document.querySelector('.malbitRandomExplanation').textContent,buttons:document.querySelectorAll('.hqEvidenceNav button').length})`);
  assert.equal(evidence.marks.length,1);assert.equal(evidence.buttons,1);assert.equal(evidence.text.split(evidence.marks[0]).length-1,1);assert.ok(!evidence.text.includes('항상·모두'));
  const y=await run('scrollY');await run('malbitToggleRandomExplanation();malbitToggleRandomExplanation()');await sleep(250);assert.equal(await run('scrollY'),y);
  await shot(correct?'explanation-correct':'explanation-incorrect');await sleep(1000);assert.equal(await run('S.infinity.feedback.sec'),fb.sec);
  await run('nextInfinity()');await sleep(1100);await run(`document.querySelector('.choice').click();document.querySelector('.choice.selected').click()`);assert.ok(await run('S.infinity.feedback.sec>=1&&S.infinity.feedback.sec<3'));records.push({correct,seconds:fb.sec,eventSeconds:event.duration});
 }
 const insertion=[];
 for(const lang of ['ko','ja','en','zh'])for(const width of [320,390,1280])for(const theme of ['light','dark']){
  await viewport(width);await run(`S.lang='${lang}';malbitSetTheme('${theme}')`);await force('M01-II-R-18');await sleep(100);
  const row=await run(`(()=>{const box=document.querySelector('.hqInsertionSentence'),passage=document.querySelector('.hqInsertionPassage');return{box:box?.textContent,positions:[...document.querySelectorAll('.hqInsertionPosition')].map(x=>x.textContent),order:!!(box.compareDocumentPosition(passage)&Node.DOCUMENT_POSITION_FOLLOWING),overflow:document.documentElement.scrollWidth>innerWidth,preAnswer:document.querySelectorAll('.hqEvidence').length}})()`);
  assert.equal(row.positions.length,4);assert.equal(row.order,true);assert.equal(row.overflow,false);assert.equal(row.preAnswer,0);
  await run(`selected=infinityCurrentQuestion().answerIndex;submitInfinity();malbitToggleRandomExplanation()`);await sleep(150);assert.equal(await run(`document.querySelectorAll('.hqInsertionPosition.hqEvidence').length`),1);
  if(lang==='ko'&&width===390)await shot('insertion-'+theme);insertion.push({lang,width,theme,...row});
 }

 await viewport(390);await run(`S.lang='ko';HARUMAL_PRACTICE.startRandom(1,'reading')`);await sleep(1200);await run(`document.querySelector('.choice').click();document.querySelector('.choice.selected').click()`);
 const t1=await run(`JSON.parse(localStorage.getItem('topikQuestTopik1Session'))`);assert.ok(t1.answerSeconds[0]>=1);await sleep(1100);await run('t1Next()');await sleep(1100);await run(`document.querySelector('.choice').click();document.querySelector('.choice.selected').click()`);const t1next=await run(`JSON.parse(localStorage.getItem('topikQuestTopik1Session'))`);assert.ok(t1next.answerSeconds[1]>=1&&t1next.answerSeconds[1]<3);
 await run(`tqStartMode('shorts')`);await sleep(1200);await run('pickShorts(0);checkShorts()');const shorts=await run(`(()=>{const x=JSON.parse(localStorage.getItem('topikQuestShortsV1'));return x.levels[x.activeLevel]})()`);assert.ok(shorts.lastAnswerSeconds>=1);assert.equal((await run(`JSON.parse(localStorage.getItem('malbitLearningEventsV1')).at(-1)`)).duration,shorts.lastAnswerSeconds);
 await force('M02-II-R-40');await run(`MALBIT_LEARNING.showVocabCandidates('책을 책은 마음에 들었습니다. 읽었습니다. 123 (가)')`);
 const candidates=await run(`({rows:[...document.querySelectorAll('[data-vocab-candidate]')].map(x=>x.value),checked:document.querySelectorAll('[data-vocab-check]:checked').length})`);assert.ok(candidates.rows.includes('책'));assert.ok(candidates.rows.includes('마음에 들다'));assert.ok(!candidates.rows.includes('가'));assert.equal(await run(`document.querySelector('.tqVocabInput').closest('label').getBoundingClientRect().height`),0);await shot('vocab-candidates');
 await run(`document.querySelector('.tqVocabAdd').click()`);const vocab=await run('S.vocab');assert.ok(vocab.some(x=>x.text==='책'));assert.ok(vocab.some(x=>x.text==='마음에 들다'));assert.ok(!vocab.some(x=>x.text==='읽었습니다'));assert.ok(vocab.filter(x=>x.text==='책').length===1);
 await run(`MALBIT_LEARNING.showVocabCandidates('책을 읽었습니다.')`);const size=await run('S.vocab.length');await run(`document.querySelectorAll('[data-vocab-check]').forEach(x=>x.checked=false);document.querySelector('.tqVocabAdd').click()`);assert.equal(await run('S.vocab.length'),size);await run(`document.querySelector('.tqVocabCancel').click()`);assert.equal(await run('S.vocab.length'),size);
 // Two selected DOM areas: only selected words, no insertion badges or unselected content.
 await force('M01-II-R-18');const selection=await run(`(()=>{const a=document.querySelector('.hqInsertionPassage'),range=document.createRange();range.setStart(document.querySelector('.hqInsertionSentence'),0);range.setEnd(a,a.childNodes.length);getSelection().removeAllRanges();getSelection().addRange(range);return MALBIT_VOCAB_SELECTION.capture(getSelection())})()`);assert.ok(selection?.term);assert.ok(!/[㉠㉡㉢㉣]/.test(selection.term));

 // A restored attempt keeps its start, while answer/feedback remains frozen.
 await force('M02-II-R-40');const restoredStart=await run('S.infinity.questionTiming.started');await reload();assert.equal(await run('S.infinity.questionTiming.started'),restoredStart);await run(`selected=infinityCurrentQuestion().answerIndex;submitInfinity()`);assert.ok(await run('S.infinity.feedback.sec>1'));
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await force('M02-II-R-40');await run(`selected=infinityCurrentQuestion().answerIndex;submitInfinity();malbitToggleRandomExplanation()`);assert.equal(await run(`getComputedStyle(document.querySelector('.hqEvidence')).animationName`),'none');assert.equal(await run(`document.activeElement.classList.contains('hqEvidence')`),true);
 await run(`document.querySelector('.malbitRandomExplanation').scrollIntoView({block:'start'})`);await shot('explanation-panel');
 const listenId=await run(`MALBIT_BANK.items.find(x=>x.section==='listening'&&MALBIT_LEARNING.sourceEvidence(MALBIT_BANK.present(x.id)).length>1)?.id||'O12-II-L-22'`);
 await run(`(()=>{HARUMAL_PRACTICE.startRandom(2,'listening');const q=MALBIT_BANK.byId('${listenId}');S.infinity.current={type:'listen',id:q.no,bankId:q.id,choiceOrder:[0,1,2,3]};S.infinity.feedback=null;delete S.infinity.questionTiming;render()})()`);
 assert.equal(await run(`document.querySelectorAll('[data-recorded-transcript],.hqEvidence').length`),0);await sleep(1200);await run(`selected=infinityCurrentQuestion().answerIndex;submitInfinity();malbitToggleRandomExplanation()`);assert.ok(await run('S.infinity.feedback.sec>=1'));assert.ok(await run(`document.querySelectorAll('.hqEvidence').length>=1`));assert.equal(await run(`[...document.querySelectorAll('.hqEvidence')].every(x=>x.closest('[data-recorded-transcript]'))`),true);await shot('listening-evidence');

 for(const id of ['O01-II-R-39','O07-II-R-39','O12-II-R-39','O08-I-R-59']){
  await force(id);assert.equal(await run(`document.querySelectorAll('#screen .hqInsertionSentence').length`),1);assert.equal(await run(`document.querySelectorAll('#screen .hqInsertionPosition').length`),4);
  await run(`S.realAnswers={read:{},listen:{}};document.getElementById('screen').innerHTML=renderMCQ(MALBIT_BANK.present('${id}'),'read',true)`);assert.equal(await run(`document.querySelectorAll('#screen .hqInsertionSentence').length`),1);
  await run(`MALBIT_REVIEW.record(${id.includes('-II-')?2:1},'read','${id}',-1,'random');var retry=Object.values(MALBIT_REVIEW.items()).find(x=>x.id==='${id}');openReviewRetry(retry.key)`);assert.equal(await run(`document.querySelectorAll('#sheetBody .hqInsertionSentence').length`),1);assert.equal(await run(`document.querySelectorAll('#sheetBody .hqInsertionPosition').length`),4);await run('closeSheet()');
 }
 const audit=await run(`(()=>{let direct=0,listening=0,insertion=0,failed=[],requestedQuotes=0,unmatchedQuotes=0;for(const x of MALBIT_BANK.items){const q=MALBIT_BANK.present(x.id),e=MALBIT_LEARNING.sourceEvidence(q);if(e.length){direct++;if(q.section==='listening')listening++}if(q.section==='listening'){const record=HARUMAL_ORIGINAL_SUPPORT?.byId?.[q.bankId],turns=HARUMAL_TRANSCRIPTS.recordedTurns(q)||[];for(const cue of record?.transcripts?.ko?.evidence||[]){requestedQuotes++;if(!turns[cue.turnIndex]?.text.includes(cue.quote))unmatchedQuotes++}}if(/insertion/.test(x.itemType)){insertion++;if(!MALBIT_LEARNING.insertionParts(q))failed.push({id:x.id,prompt:x.prompt})}}return{total:MALBIT_BANK.items.length,direct,listening,insertion,failed,requestedQuotes,unmatchedQuotes}})()`);
 fs.writeFileSync(path.join(out,'explanation-timing.json'),JSON.stringify({records,insertion,audit,errors},null,2));console.log(JSON.stringify({records,audit,errors}));assert.deepEqual(errors,[]);
}finally{socket?.close();chrome.kill();server?.close()}
