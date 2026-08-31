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
  await send('Page.navigate',{url:`http://127.0.0.1:${serverPort}/tests/fixtures/korean-street-junctions.html?theme=light`});
  for(let i=0;i<100&&!await evaluate(`document.readyState==='complete'&&window.__MALBIT_STREET_JUNCTIONS_READY__===true`);i++)await sleep(50);
  assert.equal(await evaluate(`window.__MALBIT_STREET_JUNCTIONS_READY__===true`),true,'street junction fixture did not become ready');
  const junctionImage=await evaluate(`(()=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(new Error('junction atlas image failed'));image.src='../../assets/art/travel/rpg/korean-street-junctions-atlas-v1.webp'}))()`);
  assert.deepEqual(junctionImage,{width:256,height:256},'junction atlas must remain a 4x4 sheet of 64px source tiles');
  for(const theme of ['light','dark']){
    await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);await sleep(60);
    for(const width of [320,375,390,430]){
      await setViewport(width,width===320?700:844);
      const fit=await evaluate(`(()=>{const board=document.querySelector('.junctionFixtureBoard'),tiles=[...document.querySelectorAll('.junctionFixtureTile')],swatches=[...document.querySelectorAll('.junctionFixtureSwatch')],specimens=[...document.querySelectorAll('.junctionFixtureTile[data-specimen]')],rect=board.getBoundingClientRect(),tileRects=tiles.map(tile=>tile.getBoundingClientRect()),horizontalGaps=tileRects.flatMap((current,index)=>index%20===19?[]:[Math.abs(current.right-tileRects[index+1].left)]),verticalGaps=tileRects.flatMap((current,index)=>index>=220?[]:[Math.abs(current.bottom-tileRects[index+20].top)]),maxSeam=Math.max(0,...horizontalGaps,...verticalGaps),aligned=maxSeam<.15,styleOk=[...tiles,...swatches].every(tile=>{const style=getComputedStyle(tile);return style.opacity==='1'&&style.filter==='none'&&style.backgroundImage.includes('korean-street-junctions-atlas-v1.webp')&&style.backgroundSize==='400% 400%'});return{theme:document.documentElement.dataset.theme,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,ratio:rect.width/rect.height,tiles:tiles.length,swatches:swatches.length,unique:new Set(swatches.map(tile=>tile.dataset.tileId)).size,specimens:specimens.length,specimenKinds:[...new Set(specimens.map(tile=>tile.dataset.specimen))].sort(),aligned,maxSeam,styleOk,worldLoaded:Boolean(window.MALBIT_TRAVEL_WORLDS),fixturePurpose:window.MALBIT_TRAVEL_TILE_FIXTURES[2].purpose}})()`);
      assert.equal(fit.theme,theme);assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${theme} ${width}px: junction fixture horizontal overflow`);assert.ok(Math.abs(fit.ratio-20/12)<.01,`${theme} ${width}px: junction fixture ratio changed`);
      assert.deepEqual([fit.tiles,fit.swatches,fit.unique],[240,16,16],`${theme} ${width}px: junction catalog/fixture cells missing`);assert.equal(fit.specimens,5);assert.deepEqual(fit.specimenKinds,['cross','t']);assert.equal(fit.aligned,true,`${theme} ${width}px: junction tile seam gap ${fit.maxSeam}px`);assert.equal(fit.styleOk,true,`${theme} ${width}px: junction atlas art was filtered or resized inconsistently`);assert.equal(fit.worldLoaded,false,'the junction fixture must stay independent from playable airport zones');assert.equal(fit.fixturePurpose,'isolated-all-entry-junction-validation-only');
    }
    await setViewport(390,844);await shot(theme==='light'?'00zb-korean-street-junctions-light.png':'00zc-korean-street-junctions-dark.png');
  }
  await send('Page.navigate',{url:`http://127.0.0.1:${serverPort}/tests/fixtures/korean-street-building-entrances.html?theme=light`});
  for(let i=0;i<100&&!await evaluate(`document.readyState==='complete'&&window.__MALBIT_STREET_BUILDING_ENTRANCES_READY__===true`);i++)await sleep(50);
  assert.equal(await evaluate(`window.__MALBIT_STREET_BUILDING_ENTRANCES_READY__===true`),true,'street building entrance fixture did not become ready');
  const entranceImage=await evaluate(`(()=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(new Error('building entrance atlas image failed'));image.src='../../assets/art/travel/rpg/korean-street-building-entrances-atlas-v1.webp'}))()`);
  assert.deepEqual(entranceImage,{width:256,height:256},'building entrance atlas must remain a 4x4 sheet of 64px source tiles');
  for(const theme of ['light','dark']){
    await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);await sleep(60);
    for(const width of [320,375,390,430]){
      await setViewport(width,width===320?700:844);
      const fit=await evaluate(`(()=>{const board=document.querySelector('.entranceFixtureBoard'),tiles=[...document.querySelectorAll('.entranceFixtureTile')],swatches=[...document.querySelectorAll('.entranceFixtureSwatch')],uppers=[...document.querySelectorAll('.entranceUpperSample')],specimens=[...document.querySelectorAll('.entranceFixtureTile[data-specimen]')],rect=board.getBoundingClientRect(),tileRects=tiles.map(tile=>tile.getBoundingClientRect()),horizontalGaps=tileRects.flatMap((current,index)=>index%4===3?[]:[Math.abs(current.right-tileRects[index+1].left)]),verticalGaps=tileRects.flatMap((current,index)=>index>=8?[]:[Math.abs(current.bottom-tileRects[index+4].top)]),maxSeam=Math.max(0,...horizontalGaps,...verticalGaps),aligned=maxSeam<.15,allArt=[...tiles,...swatches,...uppers],styleOk=allArt.every(tile=>{const style=getComputedStyle(tile);return style.opacity==='1'&&style.filter==='none'&&style.backgroundImage.includes('korean-street-building-entrances-atlas-v1.webp')&&style.backgroundSize==='400% 400%'}),baselineOk=uppers.every(tile=>tile.dataset.layer==='upper'&&tile.dataset.baseline==='40'&&getComputedStyle(tile,'::after').borderTopWidth==='2px');return{theme:document.documentElement.dataset.theme,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,ratio:rect.width/rect.height,tiles:tiles.length,swatches:swatches.length,unique:new Set(swatches.map(tile=>tile.dataset.tileId)).size,uppers:uppers.length,specimens:specimens.length,specimenKinds:[...new Set(specimens.map(tile=>tile.dataset.specimen))].sort(),walkable:tiles.every(tile=>tile.dataset.walkable==='true'),stepFreeKinds:[...new Set(tiles.filter(tile=>tile.dataset.stepFree==='true').map(tile=>tile.dataset.kind))].sort(),aligned,maxSeam,styleOk,baselineOk,worldLoaded:Boolean(window.MALBIT_TRAVEL_WORLDS),fixturePurpose:window.MALBIT_TRAVEL_TILE_FIXTURES[3].purpose}})()`);
      assert.equal(fit.theme,theme);assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${theme} ${width}px: building entrance fixture horizontal overflow`);assert.ok(Math.abs(fit.ratio-4/3)<.01,`${theme} ${width}px: building entrance fixture ratio changed`);
      assert.deepEqual([fit.tiles,fit.swatches,fit.unique,fit.uppers,fit.specimens],[12,16,16,4,3],`${theme} ${width}px: building entrance catalog/fixture cells missing`);assert.deepEqual(fit.specimenKinds,['ramp','steps','threshold']);assert.equal(fit.walkable,true);assert.deepEqual(fit.stepFreeKinds,['ramp','threshold']);assert.equal(fit.aligned,true,`${theme} ${width}px: building entrance tile seam gap ${fit.maxSeam}px`);assert.equal(fit.styleOk,true,`${theme} ${width}px: building entrance atlas art was filtered or resized inconsistently`);assert.equal(fit.baselineOk,true,`${theme} ${width}px: upper-layer baseline marker changed`);assert.equal(fit.worldLoaded,false,'the building entrance fixture must stay independent from playable airport zones');assert.equal(fit.fixturePurpose,'isolated-building-entry-baseline-validation-only');
    }
    await setViewport(390,844);await shot(theme==='light'?'00zd-korean-building-entrances-light.png':'00ze-korean-building-entrances-dark.png');
  }
  await send('Page.navigate',{url:`http://127.0.0.1:${serverPort}/tests/fixtures/korean-street-decor-upper.html?theme=light`});
  for(let i=0;i<100&&!await evaluate(`document.readyState==='complete'&&window.__MALBIT_STREET_DECOR_UPPER_READY__===true`);i++)await sleep(50);
  assert.equal(await evaluate(`window.__MALBIT_STREET_DECOR_UPPER_READY__===true`),true,'street decoration upper fixture did not become ready');
  const decorImage=await evaluate(`(()=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(new Error('street decoration atlas image failed'));image.src='../../assets/art/travel/rpg/korean-street-decor-upper-atlas-v1.webp'}))()`);
  assert.deepEqual(decorImage,{width:256,height:256},'street decoration atlas must remain a 4x4 sheet of 64px source tiles');
  for(const theme of ['light','dark']){
    await evaluate(`document.documentElement.dataset.theme=${JSON.stringify(theme)}`);await sleep(60);
    for(const width of [320,375,390,430]){
      await setViewport(width,width===320?700:844);
      const fit=await evaluate(`(()=>{const board=document.querySelector('.decorFixtureBoard'),cells=[...document.querySelectorAll('.decorFixtureCell')],tiles=[...document.querySelectorAll('.decorFixtureTile')],swatches=[...document.querySelectorAll('.decorFixtureSwatch')],rect=board.getBoundingClientRect(),allArt=[...tiles,...swatches],styleOk=allArt.every(tile=>{const style=getComputedStyle(tile);return style.opacity==='1'&&style.filter==='none'&&style.backgroundImage.includes('korean-street-decor-upper-atlas-v1.webp')&&style.backgroundSize==='400% 400%'}),baselineOk=cells.every(cell=>Number(cell.dataset.baseline)>=40&&Number(cell.dataset.baseline)<=56&&getComputedStyle(cell,'::before').borderTopWidth==='2px');return{theme:document.documentElement.dataset.theme,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,ratio:rect.width/rect.height,cells:cells.length,swatches:swatches.length,unique:new Set(swatches.map(tile=>tile.dataset.tileId)).size,categories:[...new Set(cells.map(cell=>cell.dataset.category))].sort(),blocked:cells.filter(cell=>cell.dataset.blocks==='true').length,clear:cells.filter(cell=>cell.dataset.blocks==='false').length,styleOk,baselineOk,worldLoaded:Boolean(window.MALBIT_TRAVEL_WORLDS),fixturePurpose:window.MALBIT_TRAVEL_TILE_FIXTURES[4].purpose}})()`);
      assert.equal(fit.theme,theme);assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${theme} ${width}px: street decoration fixture horizontal overflow`);assert.ok(Math.abs(fit.ratio-1)<.01,`${theme} ${width}px: street decoration fixture ratio changed`);
      assert.deepEqual([fit.cells,fit.swatches,fit.unique,fit.blocked,fit.clear],[16,16,16,7,9],`${theme} ${width}px: street decoration catalog/footprint cells missing`);assert.deepEqual(fit.categories,['awning','planter','sign','street-detail']);assert.equal(fit.styleOk,true,`${theme} ${width}px: street decoration atlas art was filtered or resized inconsistently`);assert.equal(fit.baselineOk,true,`${theme} ${width}px: decoration baseline marker changed`);assert.equal(fit.worldLoaded,false,'the street decoration fixture must stay independent from playable airport zones');assert.equal(fit.fixturePurpose,'isolated-decor-baseline-collision-validation-only');
    }
    await setViewport(390,844);await shot(theme==='light'?'00zf-korean-street-decor-upper-light.png':'00zg-korean-street-decor-upper-dark.png');
  }
  assert.deepEqual(errors,[]);
  console.log('street tile QA: basic + corner + junction + building entrance + decoration upper sibling atlases, 80 catalog entries, isolated fixtures, 320/375/390/430px, light/dark, aligned seams, upper baseline and collision footprint, errors=0');
}finally{
  try{socket?.close()}catch(error){}
  chrome?.kill('SIGTERM');server.kill('SIGTERM');
}
