#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'artifacts','travel-mobile');
fs.mkdirSync(out,{recursive:true});
const chromePath=[process.env.CHROME_PATH,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].find(candidate=>candidate&&fs.existsSync(candidate));
assert.ok(chromePath,'Chrome/Chromium not found; set CHROME_PATH to the browser executable');
const serverPort=4174,debugPort=9224;
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:String(serverPort)},stdio:'ignore'});
const chromeArgs=['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--hide-scrollbars','--remote-debugging-address=127.0.0.1',`--remote-debugging-port=${debugPort}`,`--user-data-dir=/tmp/malbit-street-tiles-${process.pid}`,'about:blank'];
const launchChrome=()=>spawn(chromePath,chromeArgs,{stdio:['ignore','ignore','inherit']});
let chrome=launchChrome(),socket;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const json=async(url,options)=>{const response=await fetch(url,options);assert.ok(response.ok,`${url}: ${response.status}`);return response.json()};
async function waitFor(url){for(let i=0;i<300;i++){try{return await json(url)}catch(error){await sleep(100)}}throw new Error(`Timed out: ${url}`)}

try{
  try{await waitFor(`http://127.0.0.1:${debugPort}/json/version`)}catch(firstStartError){chrome.kill('SIGTERM');await sleep(250);chrome=launchChrome();await waitFor(`http://127.0.0.1:${debugPort}/json/version`)}
  const target=await json(`http://127.0.0.1:${debugPort}/json/new?http://127.0.0.1:${serverPort}/tests/fixtures/korean-street-tiles.html`,{method:'PUT'});
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  let id=0;const pending=new Map(),errors=[];
  socket.addEventListener('message',async event=>{
    const message=JSON.parse(typeof event.data==='string'?event.data:await event.data.text());
    if(message.id&&pending.has(message.id)){const handlers=pending.get(message.id);pending.delete(message.id);message.error?handlers.reject(new Error(message.error.message)):handlers.resolve(message.result)}
    if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text||'runtime exception');
    if(message.method==='Log.entryAdded'&&message.params.entry.level==='error')errors.push(message.params.entry.text);
  });
  const send=(method,params={})=>new Promise((resolve,reject)=>{const callId=++id;pending.set(callId,{resolve,reject});socket.send(JSON.stringify({id:callId,method,params}))});
  const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text||expression);return result.result.value};
  const setViewport=async(width,height)=>{await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true,screenWidth:width,screenHeight:height});await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});await sleep(80)};
  const shot=async name=>{const result=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});fs.writeFileSync(path.join(out,name),Buffer.from(result.data,'base64'))};
  await send('Page.enable');await send('Runtime.enable');await send('Log.enable');await setViewport(390,844);
  await send('Page.navigate',{url:`http://127.0.0.1:${serverPort}/tests/fixtures/korean-street-tiles.html?theme=light`});
  for(let i=0;i<100&&!await evaluate(`document.readyState==='complete'&&window.__MALBIT_STREET_FIXTURE_READY__===true`);i++)await sleep(50);
  assert.equal(await evaluate(`window.__MALBIT_STREET_FIXTURE_READY__===true`),true,'street fixture did not become ready');
  const image=await evaluate(`(()=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(new Error('atlas image failed'));image.src='../../assets/art/travel/rpg/korean-street-basic-atlas-v1.webp'}))()`);
  assert.deepEqual(image,{width:256,height:256},'street atlas must remain a 4x4 sheet of 64px source tiles');
  for(const theme of ['light','dark']){
    await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);await sleep(60);
    for(const width of [320,375,390,430]){
      await setViewport(width,width===320?700:844);
      const fit=await evaluate(`(()=>{const board=document.querySelector('.streetFixtureBoard'),tiles=[...document.querySelectorAll('.streetFixtureTile')],swatches=[...document.querySelectorAll('.streetFixtureSwatch')],rect=board.getBoundingClientRect(),tileRects=tiles.map(tile=>tile.getBoundingClientRect()),horizontalGaps=tileRects.flatMap((current,index)=>index%12===11?[]:[Math.abs(current.right-tileRects[index+1].left)]),verticalGaps=tileRects.flatMap((current,index)=>index>=84?[]:[Math.abs(current.bottom-tileRects[index+12].top)]),maxSeam=Math.max(0,...horizontalGaps,...verticalGaps),aligned=maxSeam<.15,styleOk=[...tiles,...swatches].every(tile=>{const style=getComputedStyle(tile);return style.opacity==='1'&&style.filter==='none'&&style.backgroundImage.includes('korean-street-basic-atlas-v1.webp')&&style.backgroundSize==='400% 400%'});return{theme:document.documentElement.dataset.theme,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,ratio:rect.width/rect.height,tiles:tiles.length,swatches:swatches.length,unique:new Set(swatches.map(tile=>tile.dataset.tileId)).size,aligned,maxSeam,styleOk,worldLoaded:Boolean(window.MALBIT_TRAVEL_WORLDS),fixturePurpose:window.MALBIT_TRAVEL_TILE_FIXTURES[0].purpose}})()`);
      assert.equal(fit.theme,theme);assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${theme} ${width}px: horizontal overflow`);assert.ok(Math.abs(fit.ratio-1.5)<.01,`${theme} ${width}px: fixture ratio changed`);
      assert.deepEqual([fit.tiles,fit.swatches,fit.unique],[96,16,16],`${theme} ${width}px: catalog/fixture cells missing`);assert.equal(fit.aligned,true,`${theme} ${width}px: tile seam gap ${fit.maxSeam}px`);assert.equal(fit.styleOk,true,`${theme} ${width}px: atlas art was filtered or resized inconsistently`);assert.equal(fit.worldLoaded,false,'the fixture must stay independent from playable airport zones');assert.equal(fit.fixturePurpose,'isolated-validation-only');
    }
    await setViewport(390,844);await shot(theme==='light'?'00x-korean-street-tiles-light.png':'00y-korean-street-tiles-dark.png');
  }
  await send('Page.navigate',{url:`http://127.0.0.1:${serverPort}/tests/fixtures/korean-street-corners.html?theme=light`});
  for(let i=0;i<100&&!await evaluate(`document.readyState==='complete'&&window.__MALBIT_STREET_CORNERS_READY__===true`);i++)await sleep(50);
  assert.equal(await evaluate(`window.__MALBIT_STREET_CORNERS_READY__===true`),true,'street corner fixture did not become ready');
  const cornerImage=await evaluate(`(()=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(new Error('corner atlas image failed'));image.src='../../assets/art/travel/rpg/korean-street-corners-atlas-v1.webp'}))()`);
  assert.deepEqual(cornerImage,{width:256,height:256},'corner atlas must remain a 4x4 sheet of 64px source tiles');
  for(const theme of ['light','dark']){
    await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);await sleep(60);
    for(const width of [320,375,390,430]){
      await setViewport(width,width===320?700:844);
      const fit=await evaluate(`(()=>{const board=document.querySelector('.cornerFixtureBoard'),tiles=[...document.querySelectorAll('.cornerFixtureTile')],swatches=[...document.querySelectorAll('.cornerFixtureSwatch')],specimens=[...document.querySelectorAll('.cornerFixtureTile[data-specimen]')],rect=board.getBoundingClientRect(),tileRects=tiles.map(tile=>tile.getBoundingClientRect()),horizontalGaps=tileRects.flatMap((current,index)=>index%12===11?[]:[Math.abs(current.right-tileRects[index+1].left)]),verticalGaps=tileRects.flatMap((current,index)=>index>=84?[]:[Math.abs(current.bottom-tileRects[index+12].top)]),maxSeam=Math.max(0,...horizontalGaps,...verticalGaps),aligned=maxSeam<.15,styleOk=[...tiles,...swatches].every(tile=>{const style=getComputedStyle(tile);return style.opacity==='1'&&style.filter==='none'&&style.backgroundImage.includes('korean-street-corners-atlas-v1.webp')&&style.backgroundSize==='400% 400%'});return{theme:document.documentElement.dataset.theme,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,ratio:rect.width/rect.height,tiles:tiles.length,swatches:swatches.length,unique:new Set(swatches.map(tile=>tile.dataset.tileId)).size,specimens:specimens.length,specimenKinds:[...new Set(specimens.map(tile=>tile.dataset.specimen))].sort(),aligned,maxSeam,styleOk,worldLoaded:Boolean(window.MALBIT_TRAVEL_WORLDS),fixturePurpose:window.MALBIT_TRAVEL_TILE_FIXTURES[1].purpose}})()`);
      assert.equal(fit.theme,theme);assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${theme} ${width}px: corner fixture horizontal overflow`);assert.ok(Math.abs(fit.ratio-1.5)<.01,`${theme} ${width}px: corner fixture ratio changed`);
      assert.deepEqual([fit.tiles,fit.swatches,fit.unique],[96,16,16],`${theme} ${width}px: corner catalog/fixture cells missing`);assert.equal(fit.specimens,2);assert.deepEqual(fit.specimenKinds,['inner','outer']);assert.equal(fit.aligned,true,`${theme} ${width}px: corner tile seam gap ${fit.maxSeam}px`);assert.equal(fit.styleOk,true,`${theme} ${width}px: corner atlas art was filtered or resized inconsistently`);assert.equal(fit.worldLoaded,false,'the corner fixture must stay independent from playable airport zones');assert.equal(fit.fixturePurpose,'isolated-90-degree-validation-only');
    }
    await setViewport(390,844);await shot(theme==='light'?'00z-korean-street-corners-light.png':'00za-korean-street-corners-dark.png');
  }
  assert.deepEqual(errors,[]);
  console.log('street tile QA: basic + corner sibling atlases, 32 catalog entries, isolated 12x8 fixtures, 320/375/390/430px, light/dark, aligned seams, errors=0');
}finally{
  try{socket?.close()}catch(error){}
  chrome?.kill('SIGTERM');server.kill('SIGTERM');
}
