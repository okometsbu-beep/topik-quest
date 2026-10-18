import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),before=process.argv.includes('--before'),out=path.join(root,'artifacts/entry-ui'),baseline='037624aae3e373da02f476b8a2920ade7dd6319d';
fs.mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),port=4189,debug=9259,base=process.env.MALBIT_BASE_URL||`http://127.0.0.1:${port}`,version=fs.readFileSync(path.join(root,'site-patch.js'),'utf8').match(/const VERSION='(\d+)'/)[1];
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

 await run(`S.lang='ja';malbitSetTheme('light');setView('realSetup');scrollTo(0,0)`);
 const legacy=await run(`!!document.querySelector('.examModeHero')`);await shot(before?'exam-before':'exam-after');
 await run(`HARUMAL_PRACTICE.startRandom(2,'listening');stopTimer();scrollTo(0,0)`);
 const surface=await run(`(()=>{const e=document.querySelector('#screen .card'),s=getComputedStyle(e);return {radius:s.borderRadius,padding:s.padding,border:s.borderWidth,background:s.backgroundColor,overflow:s.overflow}})()`);await shot(before?'panel-before':'panel-after');
 console.log(JSON.stringify({legacy,surface,errors}));
 if(!before){
  assert.equal(legacy,false);assert.ok(parseFloat(surface.radius)>=16);assert.ok(parseFloat(surface.padding)>=14);assert.equal(surface.overflow,'visible');
  const rows=[];
  for(const lang of ['ko','ja','en','zh'])for(const level of [1,2])for(const width of [320,390,1280])for(const theme of ['light','dark']){
   await viewport(width);await run(`S.lang='${lang}';malbitSetTheme('${theme}');tqSetLevel(${level});tqStartMode('real');stopTimer()`);
   const route=await run(`({view:S.view,old:!!document.querySelector('.examModeHero,.t1setup'),areas:[...document.querySelectorAll('[data-area]')].map(e=>e.dataset.area),overflow:document.documentElement.scrollWidth>innerWidth})`);
   assert.equal(route.view,'mockAreas');assert.equal(route.old,false);assert.ok(route.areas.includes('full'));assert.equal(route.areas.includes('writing'),level===2);assert.equal(route.overflow,false);
   await run(`HARUMAL_PRACTICE.startRandom(${level},'listening');stopTimer();var card=document.querySelector('#screen .card');card.querySelector('.stem')?.append(document.createTextNode(' '+${JSON.stringify('A long practice sentence with an uninterrupted identifier: ')}+'x'.repeat(120)));var report=card.querySelector('.hqReport');if(report)report.open=true;card.querySelector('button')?.focus()`);
   const panel=await run(`(()=>{const e=document.querySelector('#screen .card'),s=getComputedStyle(e),r=e.getBoundingClientRect();return{padding:parseFloat(s.paddingLeft),radius:parseFloat(s.borderRadius),overflow:s.overflow,pageOverflow:document.documentElement.scrollWidth>innerWidth,children:[...e.querySelectorAll('.hqIdentity,.listeningPlayer,.choices,.hqReport')].map(x=>{const b=x.getBoundingClientRect();return{left:b.left-r.left,right:r.right-b.right}})}})()`);
   assert.ok(panel.padding>=14);assert.ok(panel.radius>=16);assert.equal(panel.overflow,'visible');assert.equal(panel.pageOverflow,false);for(const child of panel.children){assert.ok(child.left>=panel.padding-1);assert.ok(child.right>=panel.padding-1)}
   if(lang==='ja'&&level===2&&[320,390,1280].includes(width))await shot(`panel-${width}-${theme}`);
   await run(`document.querySelector('#screen .choice')?.click();document.querySelector('#screen .choice')?.click();stopTimer()`);assert.equal(await run('document.documentElement.scrollWidth>innerWidth'),false);
   rows.push({lang,level,width,theme,old:false,overflow:false});
  }
  // Real start/answer state survives routing aliases, history and reload.
  for(const level of [1,2])for(const area of level===1?['full','listening','reading']:['full','listening','reading','writing']){
   await run(`HARUMAL_HUB.openAreas('mock',${level});HARUMAL_HUB.selectArea('${area}');HARUMAL_HUB.startMock();stopTimer()`);
   const active=await run('HARUMAL_PRACTICE.getActive()');assert.equal(active.level,level);assert.equal(active.area,area);assert.equal(active.mode,'mock');
  }
  await run(`S.lang='ja';setView('home');harumalWritingOpenExam()`);assert.equal(await run('S.view'),'mockAreas');
  await run(`setView('home');realSetup(document.getElementById('screen'))`);assert.equal(await run('S.view'),'mockAreas');
  for(const lang of ['ko','ja','en','zh'])for(const route of ['realSetup','t1setup']){
   const saved=await run(`(()=>{S.lang='${lang}';S.view='${route}';save();return JSON.stringify({real:S.real,answers:S.realAnswers,vocab:S.vocab,writing:S.writing})})()`);
   await reload();assert.equal(await run('S.view'),'mockAreas');assert.equal(await run(`JSON.stringify({real:S.real,answers:S.realAnswers,vocab:S.vocab,writing:S.writing})`),saved);
   await run(`history.pushState({harumalReturnView:'${route}'},'');history.pushState({harumalReturnView:'home'},'');history.back()`);await sleep(120);assert.equal(await run(`!!document.querySelector('.examModeHero,.t1setup')`),false);await run('history.forward()');await sleep(120);
  }
  // Actual old-worker -> current worker update, including the automatic reload.
  await send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{if(location.pathname!=='/')return;const bump=k=>sessionStorage.setItem(k,String(Number(sessionStorage.getItem(k)||0)+1));bump('qa-entry-documents');const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(!this.dataset.qaCounted&&(this.id==='harumanIntroVideo'||this.src.includes('/haruman-intro-v3-'))){this.dataset.qaCounted='1';bump(this.id==='harumanIntroVideo'?'qa-entry-videos':'qa-entry-sounds')}return play.apply(this,arguments)};})()`});
  await send('Page.navigate',{url:base+'/qa-update.html'});await sleep(300);
  const old=await run(`(async()=>{for(const k of ['qa-entry-documents','qa-entry-videos','qa-entry-sounds','harumalIntroReloadV1','malbitSwReloadV${version}'])sessionStorage.removeItem(k);const reg=await navigator.serviceWorker.register('/qa-old-worker.js',{scope:'/'});for(let i=0;i<200;i++){if(navigator.serviceWorker.controller?.scriptURL.endsWith('/qa-old-worker.js')&&(await caches.open('malbit-v171')).keys)return {controller:navigator.serviceWorker.controller.scriptURL,entries:(await(await caches.open('malbit-v171')).keys()).length};await new Promise(r=>setTimeout(r,50))}throw Error('old worker not active')})()`);assert.equal(old.entries,oldFiles.length);
  await send('Page.navigate',{url:base});
  for(let i=0;i<600;i++){try{if(await run(`Number(sessionStorage.getItem('qa-entry-documents'))===2&&!!window.HARUMAL_HUB&&!document.documentElement.classList.contains('tq-booting')&&!document.querySelector('.harumanIntro')`))break}catch{}if(i===599)throw Error('worker update/reload timeout');await sleep(100)}
  const update=await run(`({documents:Number(sessionStorage.getItem('qa-entry-documents')),videos:Number(sessionStorage.getItem('qa-entry-videos')),sounds:Number(sessionStorage.getItem('qa-entry-sounds')),worker:navigator.serviceWorker.controller.scriptURL,marker:sessionStorage.getItem('harumalIntroReloadV1'),view:S.view})`);
  assert.equal(update.documents,2);assert.equal(update.videos,1);assert.ok(update.sounds<=2);assert.match(update.worker,/sw.js/);assert.equal(update.marker,null);
  await run(`S.view='realSetup';render();setView('home');window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));document.dispatchEvent(new Event('visibilitychange'));for(let i=0;i<8;i++)document.body.click()`);assert.equal(await run(`Number(sessionStorage.getItem('qa-entry-videos'))`),1);
  await run(`(async()=>{const s=await(await fetch('haruman-intro.js?v=${version}')).text();(0,eval)(s);(0,eval)(s)})()`);assert.equal(await run(`Number(sessionStorage.getItem('qa-entry-videos'))`),1);
  await reload();assert.equal(await run(`Number(sessionStorage.getItem('qa-entry-videos'))`),2,'ordinary refresh can play once again');
  fs.writeFileSync(path.join(out,'worker-update.json'),JSON.stringify(update,null,2));
  fs.writeFileSync(path.join(out,'matrix.json'),JSON.stringify({cases:rows,consoleErrors:errors},null,2));assert.deepEqual(errors,[]);
  console.log(JSON.stringify({matrixCases:rows.length,examStarts:7,restoreCases:8,consoleErrors:errors.length}));
 }
}finally{socket?.close();chrome.kill();server?.close()}
