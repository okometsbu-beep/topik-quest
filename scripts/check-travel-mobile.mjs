#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'artifacts','travel-mobile');
fs.mkdirSync(out,{recursive:true});
const chromePath=process.env.CHROME_PATH||'/usr/bin/google-chrome';
assert.ok(fs.existsSync(chromePath),`Chrome not found at ${chromePath}`);
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,stdio:'ignore'});
const chrome=spawn(chromePath,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--hide-scrollbars','--remote-debugging-address=127.0.0.1','--remote-debugging-port=9222',`--user-data-dir=/tmp/malbit-chrome-profile-${process.pid}`,'about:blank'],{stdio:['ignore','ignore','inherit']});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const json=async(url,options)=>{const response=await fetch(url,options);assert.ok(response.ok,`${url}: ${response.status}`);return response.json()};
async function waitFor(url){for(let i=0;i<150;i++){try{return await json(url)}catch(error){await sleep(100)}}throw new Error(`Timed out: ${url}`)}

let socket;
try{
  await waitFor('http://127.0.0.1:9222/json/version');
  const target=await json('http://127.0.0.1:9222/json/new?http://127.0.0.1:4173',{method:'PUT'});
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  let id=0;const pending=new Map();const errors=[];
  socket.addEventListener('message',async event=>{
    const message=JSON.parse(typeof event.data==='string'?event.data:await event.data.text());
    if(message.id&&pending.has(message.id)){const handlers=pending.get(message.id);pending.delete(message.id);message.error?handlers.reject(new Error(message.error.message)):handlers.resolve(message.result)}
    if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text||'runtime exception');
    if(message.method==='Log.entryAdded'&&message.params.entry.level==='error')errors.push(message.params.entry.text);
  });
  const send=(method,params={})=>new Promise((resolve,reject)=>{const callId=++id;pending.set(callId,{resolve,reject});socket.send(JSON.stringify({id:callId,method,params}))});
  const evaluate=async expression=>(await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true})).result.value;
  const shot=async name=>{const result=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,name),Buffer.from(result.data,'base64'))};
  await send('Page.enable');await send('Runtime.enable');await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true,screenWidth:390,screenHeight:844});
  await send('Page.navigate',{url:'http://127.0.0.1:4173/?visual-check=travel'});
  for(let i=0;i<80;i++){if(await evaluate(`document.readyState==='complete'&&!!window.MALBIT_TRAVEL`))break;await sleep(100)}
  assert.equal(await evaluate(`document.readyState`),'complete');
  await evaluate(`localStorage.clear();S.lang='ja';save();render();malbitTravelOpen();malbitTravelStart('route-001-airport-myeongdong',true)`);
  await sleep(250);await shot('01-airport-start.png');
  assert.equal(await evaluate(`document.querySelector('.travelSceneCard h1')?.textContent`),'韓国旅行が始まった！');
  assert.deepEqual(await evaluate(`({w:innerWidth,h:innerHeight})`),{w:390,h:844});
  const layers=await evaluate(`({background:document.querySelector('.travelWorldBg')?.getAttribute('src'),player:document.querySelector('.travelWorldPlayer')?.getAttribute('src'),npc:document.querySelector('.travelWorldNpc')?.getAttribute('src'),props:[...document.querySelectorAll('.travelWorldProp')].map(image=>image.getAttribute('src')),wallet:JSON.parse(localStorage.getItem('malbitStoryV1')).episodes['route-001-airport-myeongdong'].wallet,primary:getComputedStyle(document.querySelector('.travelPrimary')).backgroundImage})`);
  assert.match(layers.background,/bg-airport-t1\.webp$/);assert.match(layers.player,/avatar-traveler-blue\.webp$/);assert.match(layers.npc,/npc-airport-guide\.webp$/);assert.ok(layers.props.some(file=>/suitcase\.webp$/.test(file)));assert.equal(layers.wallet,79000);assert.match(layers.primary,/ui-button-primary\.webp/);
  await evaluate(`document.querySelector('.travelPrimary').click()`);
  await sleep(200);await shot('02-dialogue-action.png');
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswers.dialogue .travelAnswer').length`),4);
  assert.match(await evaluate(`getComputedStyle(document.querySelector('.travelAnswer')).backgroundImage`),/ui-tile-answer\.webp/);
  await evaluate(`document.querySelectorAll('.travelAnswer')[0].click();document.querySelector('.travelPrimary').click()`);await sleep(220);await shot('03-dialogue-world-reaction.png');
  const firstResult=await evaluate(`({success:document.querySelector('.travelWorld')?.classList.contains('is-success'),reward:document.querySelector('.travelWorldReward')?.textContent,item:document.querySelector('.travelWorldItem')?.textContent,inventory:JSON.parse(localStorage.getItem('malbitStoryV1')).episodes['route-001-airport-myeongdong'].inventory})`);
  assert.ok(firstResult.success);assert.match(firstResult.reward,/2,000원/);assert.ok(firstResult.item);assert.ok(firstResult.inventory.includes('airportMap'));
  await evaluate(`document.querySelector('.travelPrimary').click()`);await sleep(180);await shot('04-sign-hotspot.png');
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswers.hotspot .travelAnswer').length`),4);
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswers.hotspot .travelAnswer img').length`),4);
  const signPositions=await evaluate(`(['railsign','taxisign'].map(name=>{const rect=document.querySelector('.prop-'+name)?.getBoundingClientRect();return rect&&{left:Math.round(rect.left),top:Math.round(rect.top)}}))`);
  assert.ok(signPositions.every(Boolean));assert.notDeepEqual(signPositions[0],signPositions[1],'rail and taxi signs must occupy separate world-layer positions');
  await evaluate(`document.querySelectorAll('.travelAnswer')[0].click();document.querySelector('.travelPrimary').click();document.querySelector('.travelPrimary').click()`);
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswers.machine .travelAnswer').length`),4);
  await evaluate(`document.querySelectorAll('.travelAnswer')[0].click();document.querySelector('.travelPrimary').click();document.querySelector('.travelPrimary').click()`);
  await sleep(200);await shot('05-transport-choice.png');
  const transport=await evaluate(`({title:document.querySelector('.travelSceneCard h1')?.textContent,wallet:JSON.parse(localStorage.getItem('malbitStoryV1')).episodes['route-001-airport-myeongdong'].wallet,disabled:[...document.querySelectorAll('.travelRoutes button')].map(button=>button.disabled),heights:[...document.querySelectorAll('.travelRoutes button')].map(button=>Math.round(button.getBoundingClientRect().height))})`);
  assert.equal(transport.title,'どうやって明洞へ行く？');assert.equal(transport.wallet,85000);assert.deepEqual(transport.disabled,[false,false,false]);assert.ok(transport.heights.every(height=>height>=84));
  await evaluate(`document.querySelectorAll('.travelRoutes button')[1].click();document.querySelector('.travelPrimary').click()`);
  for(let i=0;i<3;i++)await evaluate(`document.querySelectorAll('.travelAnswer')[0].click();document.querySelector('.travelPrimary').click();document.querySelector('.travelPrimary').click()`);
  await sleep(250);await shot('06-myeongdong-arrival.png');
  const ending=await evaluate(`({clear:document.body.innerText.includes('ROUTE CLEAR'),title:document.querySelector('.travelEndingCard h1')?.textContent,state:JSON.parse(localStorage.getItem('malbitStoryV1')).episodes['route-001-airport-myeongdong']})`);
  assert.ok(ending.clear);assert.equal(ending.title,'完璧な初入国');assert.equal(ending.state.completed,true);assert.equal(ending.state.route,'express');assert.equal(ending.state.wallet,77900);assert.ok(ending.state.inventory.includes('airportMap'));assert.ok(ending.state.inventory.includes('transitCard'));assert.ok(ending.state.inventory.includes('myeongdong-first-stamp'));
  assert.deepEqual(errors,[]);
  console.log(`travel mobile visual: 390x844, 6 screenshots, layered world, dialogue/hotspot/machine, route=${ending.state.route}, wallet=${ending.state.wallet}, errors=0`);
}finally{
  try{socket?.close()}catch(error){}
  chrome.kill('SIGTERM');server.kill('SIGTERM');
}
