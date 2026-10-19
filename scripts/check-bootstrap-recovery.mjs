import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),before=process.argv.includes('--before'),out=path.join(root,'artifacts/bootstrap-recovery'),baseline='037624aae3e373da02f476b8a2920ade7dd6319d';
fs.mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),port=4193,debug=9263,base=process.env.MALBIT_BASE_URL||`http://127.0.0.1:${port}`,version=fs.readFileSync(path.join(root,'site-patch.js'),'utf8').match(/const VERSION='(\d+)'/)[1];
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


 let failures=0,attempts=0;
 socket.addEventListener('message',async event=>{const m=JSON.parse(typeof event.data==='string'?event.data:await event.data.text());if(m.method!=='Fetch.requestPaused')return;attempts++;if(failures>0){failures--;await send('Fetch.failRequest',{requestId:m.params.requestId,errorReason:'ConnectionReset'})}else await send('Fetch.continueRequest',{requestId:m.params.requestId})});
 await send('Network.setBypassServiceWorker',{bypass:true});
 await send('Fetch.enable',{patterns:[{urlPattern:'*practice-sessions.js*',requestStage:'Request'}]});
 // Exclude just this preload so the failure targets the ordered executable load.
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{if(navigator.serviceWorker)navigator.serviceWorker.register=async()=>{throw Error('Service worker excluded from dependency fault fixture')};const append=HTMLHeadElement.prototype.appendChild;HTMLHeadElement.prototype.appendChild=function(n){if(n.tagName==='LINK'&&n.rel==='preload'&&n.href.includes('practice-sessions.js'))return n;return append.call(this,n)};if(!localStorage.getItem('qaRecoverySeed')){localStorage.setItem('topikQuestV8',JSON.stringify({lang:'ja',vocab:[{text:'복구',meaning:'recovery',note:'saved before failure'}]}));localStorage.setItem('qaRecoverySeed','1')}})()`});
 const preserved=async()=>assert.equal(await run(`S.vocab.some(v=>v.text==='복구'&&v.note==='saved before failure')`),true);
 const waitFor=async expression=>{for(let i=0;i<300;i++){if(await run(expression))return;await sleep(100)}throw Error('condition timeout: '+expression)};
 await viewport(390);failures=1;await send('Page.navigate',{url:base});await ready();
 assert.equal(attempts,2);assert.equal(await run('!!window.HARUMAL_HUB'),true);await preserved();
 await run(`HARUMAL_HUB.openAreas('mock',2)`);assert.equal(await run('S.view'),'mockAreas');await shot('transient-retry-ready');
 // Use a fresh document without the service worker, so the network fault is real.
 await run(`(async()=>{for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister();for(const k of await caches.keys())if(k.startsWith('malbit-'))await caches.delete(k)})()`);
 failures=9;attempts=0;await send('Page.navigate',{url:base+'?qa=persistent'});
 await waitFor(`!!document.querySelector('#malbitBootRecovery button')`);
 assert.equal(attempts,3);assert.equal(await run('!!window.HARUMAL_HUB'),false);await preserved();
 const notice=await run(`document.getElementById('malbitBootRecovery').textContent`);assert.ok(notice.includes('読み込めません'));await sleep(4700);assert.equal(await run(`!!document.getElementById('malbitBootRecovery')`),true);await shot('persistent-failure-reload');
 const recoveryGeometry=await run(`(()=>{const b=document.querySelector('#malbitBootRecovery button'),n=b.parentElement,r=b.getBoundingClientRect(),s=getComputedStyle(n),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {x:r.x,y:r.y,width:r.width,height:r.height,viewport:{width:innerWidth,height:innerHeight,visualWidth:visualViewport.width,visualHeight:visualViewport.height},display:s.display,visibility:s.visibility,opacity:s.opacity,position:s.position,bottom:s.bottom,hit:hit?.outerHTML?.slice(0,200),clickable:hit===b||b.contains(hit)}})()`);console.log(JSON.stringify({recoveryGeometry}));assert.equal(recoveryGeometry.clickable,true,'Recovery button must be visibly reachable, not merely in the DOM');assert.ok(recoveryGeometry.x>=0&&recoveryGeometry.x+recoveryGeometry.width<=recoveryGeometry.viewport.visualWidth,'Recovery button must fit the visible viewport width');assert.ok(recoveryGeometry.y>=0&&recoveryGeometry.y+recoveryGeometry.height<=recoveryGeometry.viewport.visualHeight,'Recovery button must fit the visible viewport');
 failures=0;attempts=0;await send('Input.dispatchMouseEvent',{type:'mousePressed',x:recoveryGeometry.x+recoveryGeometry.width/2,y:recoveryGeometry.y+recoveryGeometry.height/2,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:recoveryGeometry.x+recoveryGeometry.width/2,y:recoveryGeometry.y+recoveryGeometry.height/2,button:'left',clickCount:1});await ready();assert.equal(await run('!!window.HARUMAL_HUB'),true);assert.equal(await run(`!!document.getElementById('malbitBootRecovery')`),false);await preserved();await shot('reload-recovered');
 assert.equal(errors.length,0);console.log(JSON.stringify({transientAttempts:2,persistentAttempts:3,reloadRecovered:true,savedVocabulary:true,errors}));
}finally{socket?.close();chrome.kill();server?.close()}
