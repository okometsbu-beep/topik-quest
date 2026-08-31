#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'artifacts','travel-mobile');
fs.mkdirSync(out,{recursive:true});
for(const file of fs.readdirSync(out))if(file.endsWith('.png'))fs.unlinkSync(path.join(out,file));
const chromePath=[process.env.CHROME_PATH,'/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].find(candidate=>candidate&&fs.existsSync(candidate));
assert.ok(chromePath,'Chrome/Chromium not found; set CHROME_PATH to the browser executable');
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,stdio:'ignore'});
const chromeArgs=['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--hide-scrollbars','--remote-debugging-address=127.0.0.1','--remote-debugging-port=9222',`--user-data-dir=/tmp/malbit-chrome-profile-${process.pid}`,'about:blank'];
const launchChrome=()=>spawn(chromePath,chromeArgs,{stdio:['ignore','ignore','inherit']});
let chrome=launchChrome();
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const json=async(url,options)=>{const response=await fetch(url,options);assert.ok(response.ok,`${url}: ${response.status}`);return response.json()};
async function waitFor(url){for(let i=0;i<300;i++){try{return await json(url)}catch(error){await sleep(100)}}throw new Error(`Timed out: ${url}`)}

let socket;
try{
  try{
    await waitFor('http://127.0.0.1:9222/json/version');
  }catch(firstStartError){
    chrome.kill('SIGTERM');
    await sleep(250);
    chrome=launchChrome();
    await waitFor('http://127.0.0.1:9222/json/version');
  }
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
  const evaluate=async expression=>{
    const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
    if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text||expression);
    return result.result.value;
  };
  const shot=async name=>{const result=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,name),Buffer.from(result.data,'base64'))};
  const setViewport=async(width,height)=>{
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true,screenWidth:width,screenHeight:height});
    await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
    await sleep(80);
  };
  const ready=async()=>{
    for(let i=0;i<100;i++){if(await evaluate(`document.readyState==='complete'&&!!window.MALBIT_TRAVEL&&!document.documentElement.classList.contains('tq-booting')`))return;await sleep(100)}
    throw new Error('MALBIT travel runtime did not become ready');
  };
  const tap=async(selector,index=0,delay=250)=>{
    const found=await evaluate(`(()=>{const el=document.querySelectorAll(${JSON.stringify(selector)})[${index}];if(!el||el.disabled)return false;el.scrollIntoView({block:'center',inline:'center',behavior:'auto'});return true})()`);
    assert.ok(found,`tap target missing or disabled: ${selector}[${index}]`);
    let point;
    for(let attempt=0;attempt<40;attempt++){
      point=await evaluate(`(()=>{const el=document.querySelectorAll(${JSON.stringify(selector)})[${index}];if(!el)return{visible:false};el.scrollIntoView({block:'center',inline:'center',behavior:'auto'});const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{visible:s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0,x:r.left+r.width/2,y:r.top+r.height/2,width:r.width,height:r.height,top:r.top,bottom:r.bottom}})()`);
      if(point.visible)break;
      await sleep(50);
    }
    assert.ok(point.visible,`tap target hidden: ${selector}[${index}]`);
    const viewport=await evaluate(`({width:innerWidth,height:innerHeight})`);
    assert.ok(point.x>=0&&point.x<=viewport.width&&point.y>=0&&point.y<=viewport.height,`tap target outside viewport: ${selector}[${index}]`);
    await send('Input.dispatchMouseEvent',{type:'mousePressed',x:point.x,y:point.y,button:'left',clickCount:1});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:point.x,y:point.y,button:'left',clickCount:1});
    await sleep(delay);
    return point;
  };
  const tapText=async(selector,label,delay=250)=>{
    const index=await evaluate(`[...document.querySelectorAll(${JSON.stringify(selector)})].findIndex(el=>el.textContent.trim()===${JSON.stringify(label)})`);
    assert.ok(index>=0,`tap label missing: ${selector} ${label}`);
    return tap(selector,index,delay);
  };
  const state=()=>evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1')||'null');return store?.episodes?.['route-001-airport-myeongdong']||null})()`);
  const tapUntilScene=async(selector,sceneId)=>{
    for(let attempt=0;attempt<3;attempt++){
      if((await state())?.sceneId===sceneId)return;
      await tap(selector,0,150);
      for(let wait=0;wait<20;wait++){
        if((await state())?.sceneId===sceneId)return;
        await sleep(50);
      }
    }
    assert.equal((await state())?.sceneId,sceneId,`tap did not enter scene: ${sceneId}`);
  };
  const assertFits=async label=>{
    const fit=await evaluate(`(()=>{const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const targets=[...document.querySelectorAll('.travelPrimary,.travelSecondary,.travelAnswer,.travelRoutes button,.travelBack,.travelLang,.travelListen button,.travelMyeongdongHead>button,.travelExchangeCard,.travelSentence button,.travelWordBank button,.travelQuantityPicker button,.travelBudgetActions button,.travelRpgDpad button,.travelRpgAction,.travelRpgDiscovery button')].filter(visible);const outside=targets.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(el=>({class:el.className,left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right)}));const bad=targets.filter(el=>el.getBoundingClientRect().height<43).map(el=>({class:el.className,h:Math.round(el.getBoundingClientRect().height)}));const overlaps=[];for(const container of document.querySelectorAll('.travelEndingBody,.travelMyeongdongCard')){const children=[...container.children].filter(el=>visible(el)&&getComputedStyle(el).position!=='absolute').sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);for(let i=1;i<children.length;i++){const a=children[i-1].getBoundingClientRect(),b=children[i].getBoundingClientRect();if(a.bottom>b.top+1)overlaps.push({a:children[i-1].className||children[i-1].tagName,b:children[i].className||children[i].tagName,amount:Math.round(a.bottom-b.top)})}}return{innerWidth,root:document.documentElement.scrollWidth,body:document.body.scrollWidth,bad,outside,overlaps}})()`);
    assert.ok(fit.root<=fit.innerWidth+1&&fit.body<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.root}/${fit.body}/${fit.innerWidth}`);
    assert.deepEqual(fit.bad,[],`${label}: touch target below 44px`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.overlaps,[],`${label}: flow elements overlap`);
  };
  const assertRpgFits=async(label,theme,expectedMap='airport-arrivals-map-v1.webp')=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector('.travelRpgCard'),viewport=document.querySelector('.travelRpgViewport'),board=document.querySelector('.travelRpgBoard'),player=document.querySelector('.travelRpgPlayer'),map=document.querySelector('.travelRpgMap'),topHud=document.querySelector('.travelRpgTopHud'),statusHud=document.querySelector('.travelRpgStatusHud'),objectiveHud=document.querySelector('.travelRpgObjectiveHud'),controlsHud=document.querySelector('.travelRpgControls');if(!root||!viewport||!board||!player||!map||!topHud||!statusHud||!objectiveHud||!controlsHud)return{missing:true};const rect=el=>{const r=el.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};const vr=rect(viewport),br=rect(board),pr=rect(player),rr=rect(root),hud=[topHud,statusHud,objectiveHud,controlsHud].map(rect),controls=[...root.querySelectorAll('.travelRpgBack,.travelRpgLang,.travelRpgDpad button,.travelRpgAction,.travelRpgDiscovery button')];const small=controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(el=>({class:el.className,width:Math.round(el.getBoundingClientRect().width),height:Math.round(el.getBoundingClientRect().height)}));const outside=controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1||r.top<vr.top-1||r.bottom>vr.bottom+1}).length;const copy=[...root.querySelectorAll('small,.travelRpgObjectiveHud b')].map(el=>parseFloat(getComputedStyle(el).fontSize)).filter(size=>size<9.9);const mapStyle=getComputedStyle(map),boardStyle=getComputedStyle(board);return{missing:false,theme:document.documentElement.dataset.theme,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,innerWidth,asymmetry:Math.abs(rr.left-(innerWidth-rr.right)),ratio:br.width/br.height,viewportShare:vr.height/innerHeight,boardCovers:br.left<=vr.left+1&&br.right>=vr.right-1&&br.top<=vr.top+1&&br.bottom>=vr.bottom-1,boardWidthRatio:br.width/vr.width,boardIsolation:boardStyle.isolation,boardDepth:boardStyle.zIndex,playerInside:pr.left>=vr.left-1&&pr.right<=vr.right+1&&pr.top>=vr.top-1&&pr.bottom<=vr.bottom+1,hudInside:hud.every(r=>r.left>=vr.left-1&&r.right<=vr.right+1&&r.top>=vr.top-1&&r.bottom<=vr.bottom+1),small,outside,copy,mapOpacity:mapStyle.opacity,mapFilter:mapStyle.filter,mapSrc:map.getAttribute('src')}})()`);
    const spriteFit=await evaluate(`(()=>{const viewport=document.querySelector('.travelRpgViewport'),board=document.querySelector('.travelRpgBoard'),player=document.querySelector('.travelRpgPlayer'),sprite=document.querySelector('.travelRpgSprite');if(!viewport||!board||!player||!sprite)return{missing:true};const vs=getComputedStyle(viewport),bs=getComputedStyle(board),ss=getComputedStyle(sprite),pr=player.getBoundingClientRect(),sr=sprite.getBoundingClientRect();return{missing:false,boardHeightRatio:board.getBoundingClientRect().height/viewport.getBoundingClientRect().height,columns:player.dataset.spriteColumns,rows:player.dataset.spriteRows,walkFps:player.dataset.walkFps,footAnchor:player.dataset.footAnchor,spriteImage:ss.backgroundImage,spriteSize:ss.backgroundSize,playerWidth:pr.width,playerHeight:pr.height,spriteWidth:sr.width,spriteHeight:sr.height,viewportBackground:vs.backgroundColor,boardHeight:bs.height}})()`);
    const depthFit=await evaluate(`(()=>{const ground=document.querySelector('.travelRpgGroundLayer'),actors=document.querySelector('.travelRpgActorLayer'),upper=document.querySelector('.travelRpgUpperLayer'),map=document.querySelector('.travelRpgMap'),player=document.querySelector('.travelRpgPlayer'),foregrounds=[...document.querySelectorAll('.travelRpgForeground')],store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store?.episodes?.['route-001-airport-myeongdong'],context=MALBIT_TRAVEL_RPG.contextForProgress(state?.packId,state?.exploration,state?.sceneId),source=map?.getAttribute('src');if(!ground||!actors||!upper||!map||!player||!context)return{missing:true};const collisions=(context.zone.foregrounds||[]).flatMap(item=>item.collision.map(point=>({id:item.id,x:point.x,y:point.y,walkable:MALBIT_TRAVEL_RPG.isWalkable(context.zone,point.x,point.y,state.sceneId)})));return{missing:false,contract:actors.dataset.depthContract,count:foregrounds.length,expected:(context.zone.foregrounds||[]).length,sameSource:foregrounds.every(item=>item.getAttribute('src')===source),opaque:foregrounds.every(item=>{const style=getComputedStyle(item);return style.opacity==='1'&&style.filter==='none'}),clipped:foregrounds.every(item=>getComputedStyle(item).clipPath.startsWith('polygon(')),depths:foregrounds.map(item=>Number(getComputedStyle(item).zIndex)),playerDepth:Number(getComputedStyle(player).zIndex),collisions}})()`);
    const environmentFit=await evaluate(`(()=>{const board=document.querySelector('.travelRpgBoard'),layer=document.querySelector('.travelRpgEnvironmentLayer'),lights=[...document.querySelectorAll('.travelRpgLight')],store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store?.episodes?.['route-001-airport-myeongdong'],context=MALBIT_TRAVEL_RPG.contextForProgress(state?.packId,state?.exploration,state?.sceneId);if(!board||!layer||!context)return{missing:true};const area=board.getBoundingClientRect().width*board.getBoundingClientRect().height,styles=lights.map(item=>{const rect=item.getBoundingClientRect(),style=getComputedStyle(item);return{id:item.dataset.lightId,kind:item.dataset.lightKind,coverage:rect.width*rect.height/area,opacity:Number(style.opacity),filter:style.filter,blend:style.mixBlendMode,background:style.backgroundImage,z:Number(style.zIndex)}});return{missing:false,contract:layer.dataset.effectContract,count:lights.length,expected:(context.zone.lights||[]).length,totalCoverage:styles.reduce((sum,item)=>sum+item.coverage,0),styles}})()`);
    const shadowFit=await evaluate(`(()=>{const board=document.querySelector('.travelRpgBoard'),layer=document.querySelector('.travelRpgShadowLayer'),player=document.querySelector('.travelRpgPlayer'),target=document.querySelector('.travelRpgTarget.character'),playerShadow=document.querySelector('.travelRpgShadow.player'),npcShadow=document.querySelector('.travelRpgShadow.npc');if(!board||!layer||!player||!playerShadow)return{missing:true};const style=el=>getComputedStyle(el);return{missing:false,order:[...board.children].map(el=>el.className),contract:layer.dataset.depthContract,count:document.querySelectorAll('.travelRpgShadow').length,hasNpc:Boolean(target),hasNpcShadow:Boolean(npcShadow),playerContact:[player.style.left,player.style.top,player.style.zIndex],playerShadowContact:[playerShadow.style.left,playerShadow.style.top,playerShadow.style.zIndex],npcContact:target?[target.style.left,target.style.top,target.style.zIndex]:null,npcShadowContact:npcShadow?[npcShadow.style.left,npcShadow.style.top,npcShadow.style.zIndex]:null,playerFoot:player.dataset.footAnchor,shadowFoot:playerShadow.dataset.footAnchor,shape:style(playerShadow).clipPath,background:style(playerShadow).backgroundColor,shadowFilter:style(playerShadow).filter,playerFilter:style(player).filter,npcFilter:target?style(target).filter:'none',transition:style(playerShadow).transitionDuration}})()`);
    const staminaFit=await evaluate(`(()=>{const hud=document.querySelector('.travelRpgStaminaHud'),objective=document.querySelector('.travelRpgObjectiveHud'),percent=document.querySelector('[data-rpg-stamina-percent]'),bar=document.querySelector('[data-rpg-stamina-bar]'),steps=document.querySelector('[data-rpg-stamina-steps]');if(!hud||!objective||!percent||!bar||!steps)return{missing:true};const h=hud.getBoundingClientRect(),o=objective.getBoundingClientRect(),store=JSON.parse(localStorage.getItem('malbitStoryV1')),stamina=store.episodes['route-001-airport-myeongdong'].exploration.stamina;return{missing:false,inside:h.left>=0&&h.right<=innerWidth,overlap:h.bottom>o.top+1,percent:percent.textContent.trim(),bar:parseFloat(getComputedStyle(bar).width)/parseFloat(getComputedStyle(bar.parentElement).width)*100,steps:steps.textContent.trim(),stored:stamina}})()`);
    const tileFit=await evaluate(`(()=>{const ground=document.querySelector('.travelRpgGroundLayer'),board=document.querySelector('.travelRpgBoard'),player=document.querySelector('.travelRpgPlayer'),npc=document.querySelector('.travelRpgTarget.character'),tiles=[...document.querySelectorAll('.travelRpgGroundLayer>.travelRpgTile')],markers=[...document.querySelectorAll('.travelRpgPoi,.travelRpgPortal,.travelRpgTarget.marker')],buttons=[...document.querySelectorAll('.travelRpgDpad button,.travelRpgAction')],store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store?.episodes?.['route-001-airport-myeongdong'],context=MALBIT_TRAVEL_RPG.contextForProgress(state?.packId,state?.exploration,state?.sceneId);if(!ground||!board||!player||!context)return{missing:true};const rect=el=>el?.getBoundingClientRect(),alpha=value=>{const slash=value.match(/\\/\\s*([\\d.]+)(%)?\\s*\\)/);if(slash)return Number(slash[1])/(slash[2]?100:1);const parts=(value.match(/[\\d.]+/g)||[]).map(Number);return value.startsWith('rgba')&&parts.length>3?parts[3]:1},pr=rect(player),nr=rect(npc),tilePixels=rect(board).width/context.zone.width;return{missing:false,count:tiles.length,expected:context.zone.width*context.zone.height,declared:Number(ground.dataset.tileCount),unique:new Set(tiles.map(tile=>tile.dataset.tileX+','+tile.dataset.tileY)).size,fullMapImages:document.querySelectorAll('img.travelRpgMap').length,terrain:tiles.every(tile=>tile.dataset.tileId&&tile.dataset.terrain&&['true','false'].includes(tile.dataset.walkable)),catalog:tiles.every(tile=>{const id=context.zone.tilemap.layers.ground[Number(tile.dataset.tileY)][Number(tile.dataset.tileX)],entry=context.zone.tilemap.palette[id];return tile.dataset.tileId===entry.id&&Number.isInteger(entry.atlasX)&&Number.isInteger(entry.atlasY)}),markerScale:markers.every(marker=>rect(marker).width>=tilePixels*.7&&rect(marker).width<=tilePixels*1.65),controlCount:buttons.length,controlText:buttons.map(button=>button.textContent.trim()),icons:buttons.filter(button=>button.querySelector(':scope>svg')).length,touch:buttons.map(button=>getComputedStyle(button).touchAction),alphas:buttons.map(button=>alpha(getComputedStyle(button).backgroundColor)),holds:[...document.querySelectorAll('.travelRpgDpad button')].every(button=>button.hasAttribute('onpointerdown')&&button.hasAttribute('onpointerup')&&button.hasAttribute('onpointercancel')),hasNpc:Boolean(npc),sameActor:npc?Math.abs(pr.width-nr.width)<1&&Math.abs(pr.height-nr.height)<1:true,npcAnimation:npc?getComputedStyle(npc.querySelector('img')).animationName:'none'}})()`);
    const controlGuardFit=await evaluate(`(()=>{const buttons=[...document.querySelectorAll('.travelRpgDpad button,.travelRpgAction')],blocked=(button,type)=>{const event=new Event(type,{bubbles:true,cancelable:true});return button.dispatchEvent(event)===false&&event.defaultPrevented};return{count:buttons.length,selection:buttons.map(button=>[getComputedStyle(button).userSelect,getComputedStyle(button).webkitUserSelect]),guarded:buttons.every(button=>['contextmenu','selectstart','dragstart'].every(type=>blocked(button,type))),iconEvents:buttons.every(button=>getComputedStyle(button.querySelector('svg')).pointerEvents==='none')}})()`);
    const koreanPropFit=await evaluate(`(()=>{const board=document.querySelector('.travelRpgBoard'),prop=document.querySelector('.travelRpgPoi.has-prop'),store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store?.episodes?.['route-001-airport-myeongdong'],context=MALBIT_TRAVEL_RPG.contextForProgress(state?.packId,state?.exploration,state?.sceneId),data=context?.zone?.pois?.find(item=>item.id==='cheongsachorong-welcome');if(!data)return{present:false};if(!board||!prop)return{present:true,missing:true};const image=prop.querySelector('img'),rect=image.getBoundingClientRect(),tile=board.getBoundingClientRect().width/context.zone.width,style=getComputedStyle(prop),imageStyle=getComputedStyle(image);return{present:true,missing:false,src:image.getAttribute('src'),width:rect.width/tile,height:rect.height/tile,opacity:style.opacity,filter:style.filter,imageFilter:imageStyle.filter,collisions:data.collision.map(point=>MALBIT_TRAVEL_RPG.isWalkable(context.zone,point.x,point.y,state.sceneId))}})()`);
    const performanceFit=await evaluate(`(()=>{const board=document.querySelector('.travelRpgBoard'),store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store?.episodes?.['route-001-airport-myeongdong'],context=MALBIT_TRAVEL_RPG.contextForProgress(state?.packId,state?.exploration,state?.sceneId),budget=context?.world?.performanceBudget;if(!board||!context||!budget)return{missing:true};return{missing:false,budget,boardNodes:board.querySelectorAll('*').length,groundTiles:board.querySelectorAll('.travelRpgGroundLayer>.travelRpgTile').length,upperTiles:board.querySelectorAll('.travelRpgUpperLayer .travelRpgTile').length,estimate:MALBIT_TRAVEL_RPG.performanceEstimate(context.zone)}})()`);
    assert.equal(fit.missing,false,`${label}: RPG map missing`);assert.equal(fit.theme,theme,`${label}: wrong theme`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow`);
    assert.ok(fit.asymmetry<=2,`${label}: asymmetric shell ${fit.asymmetry}`);assert.ok(Math.abs(fit.ratio-4/3)<.03,`${label}: map ratio ${fit.ratio}`);assert.ok(fit.viewportShare>.94,`${label}: map is not the full-screen primary surface ${fit.viewportShare}`);assert.equal(fit.hudInside,true,`${label}: HUD leaves map safe area`);
    assert.equal(fit.boardCovers,true,`${label}: camera board leaves an empty viewport edge`);assert.ok(fit.boardWidthRatio>1.55,`${label}: camera board width collapsed to ${fit.boardWidthRatio}`);assert.deepEqual([fit.boardIsolation,fit.boardDepth],['isolate','0'],`${label}: world depth can cover the HUD`);
    assert.equal(fit.playerInside,true,`${label}: player leaves camera`);assert.deepEqual(fit.small,[],`${label}: control below 44px`);assert.equal(fit.outside,0,`${label}: control leaves viewport`);assert.deepEqual(fit.copy,[],`${label}: copy below 10px`);
    assert.equal(fit.mapOpacity,'1');assert.equal(fit.mapFilter,'none');assert.ok(fit.mapSrc.endsWith(expectedMap),`${label}: wrong map ${fit.mapSrc}`);
    assert.equal(spriteFit.missing,false,`${label}: four-direction sprite missing`);assert.ok(Math.abs(spriteFit.boardHeightRatio-1.2)<.01,`${label}: vertical camera overscan ${spriteFit.boardHeightRatio}`);
    assert.deepEqual([spriteFit.columns,spriteFit.rows,spriteFit.walkFps],['8','4','12'],`${label}: sprite frame contract`);assert.equal(spriteFit.footAnchor,'0.5,0.9375');assert.match(spriteFit.spriteImage,/traveler-blue-4dir-v1\.png/);assert.equal(spriteFit.spriteSize,'800% 400%');
    assert.ok(spriteFit.playerHeight>=19&&spriteFit.playerHeight<=45,`${label}: traveler must stay near one tile, got ${spriteFit.playerHeight}px`);assert.ok(Math.abs(spriteFit.playerWidth/spriteFit.playerHeight-192/272)<.02,`${label}: traveler frame ratio ${spriteFit.playerWidth/spriteFit.playerHeight}`);assert.ok(Math.abs(spriteFit.spriteWidth-spriteFit.playerWidth)<1&&Math.abs(spriteFit.spriteHeight-spriteFit.playerHeight)<1,`${label}: sprite does not fill traveler frame`);
    assert.equal(depthFit.missing,false,`${label}: depth layers missing`);assert.equal(depthFit.contract,'foot-y',`${label}: actor depth is not foot anchored`);assert.equal(depthFit.count,depthFit.expected,`${label}: foreground data/render mismatch`);
    assert.ok(depthFit.count>=3,`${label}: representative foreground coverage missing`);assert.equal(depthFit.sameSource,true,`${label}: upper foreground must reuse the exact map art`);assert.equal(depthFit.opaque,true,`${label}: foreground uses opacity or theme paint`);assert.equal(depthFit.clipped,true,`${label}: foreground silhouette missing`);
    assert.ok(depthFit.depths.every(value=>value>0&&value<100)&&depthFit.playerDepth>0&&depthFit.playerDepth<100,`${label}: world depth escaped below the HUD`);assert.deepEqual(depthFit.collisions.filter(item=>item.walkable),[],`${label}: foreground collision mismatch`);
    assert.equal(environmentFit.missing,false,`${label}: environment light layer missing`);assert.equal(environmentFit.contract,'bounded-light');assert.equal(environmentFit.count,environmentFit.expected,`${label}: light data/render mismatch`);assert.ok(environmentFit.count>=3,`${label}: representative light coverage missing`);
    assert.ok(environmentFit.totalCoverage<.08,`${label}: environment light became a scene overlay ${environmentFit.totalCoverage}`);assert.deepEqual(environmentFit.styles.filter(item=>item.coverage<=0||item.coverage>=.04||item.opacity<=0||item.opacity>.65||item.filter!=='none'||item.blend!=='screen'||!item.background.includes('radial-gradient')||item.z!==1),[],`${label}: invalid bounded light style`);
    assert.equal(shadowFit.missing,false,`${label}: actor contact shadow missing`);assert.deepEqual(shadowFit.order,['travelRpgGroundLayer','travelRpgEnvironmentLayer','travelRpgShadowLayer','travelRpgActorLayer','travelRpgUpperLayer'],`${label}: world layer order`);
    assert.equal(shadowFit.contract,'foot-y');assert.equal(shadowFit.count,1+Number(shadowFit.hasNpc));assert.equal(shadowFit.hasNpcShadow,shadowFit.hasNpc,`${label}: NPC shadow presence mismatch`);assert.deepEqual(shadowFit.playerShadowContact,shadowFit.playerContact,`${label}: player shadow left the foot contact`);if(shadowFit.hasNpc)assert.deepEqual(shadowFit.npcShadowContact,shadowFit.npcContact,`${label}: NPC shadow left the foot contact`);
    assert.equal(shadowFit.shadowFoot,shadowFit.playerFoot);assert.match(shadowFit.shape,/polygon/);assert.match(shadowFit.background,/rgba?/);assert.deepEqual([shadowFit.shadowFilter,shadowFit.playerFilter,shadowFit.npcFilter],['none','none','none']);assert.ok(shadowFit.transition.split(',').every(value=>value.trim()==='0.11s'));
    assert.equal(staminaFit.missing,false,`${label}: stamina HUD missing`);assert.equal(staminaFit.inside,true,`${label}: stamina HUD leaves the viewport`);assert.equal(staminaFit.overlap,false,`${label}: stamina and objective overlap`);assert.equal(staminaFit.percent,`${staminaFit.stored.percent}%`);assert.ok(Math.abs(staminaFit.bar-staminaFit.stored.percent)<1,`${label}: stamina bar disagrees with saved stamina`);assert.match(staminaFit.steps,/\d[\d,]* \/ 10,000/);
    assert.equal(tileFit.missing,false,`${label}: semantic tile layer missing`);assert.deepEqual([tileFit.count,tileFit.declared,tileFit.unique],[tileFit.expected,tileFit.expected,tileFit.expected],`${label}: map must render one semantic node per tile`);assert.equal(tileFit.fullMapImages,0,`${label}: full-map image must not be painted`);assert.equal(tileFit.terrain,true,`${label}: tile terrain metadata missing`);assert.equal(tileFit.catalog,true,`${label}: rendered tile does not resolve through its catalog entry`);assert.equal(tileFit.markerScale,true,`${label}: world markers must scale with map tiles`);
    if(koreanPropFit.present){assert.equal(koreanPropFit.missing,false,`${label}: Korean prop missing`);assert.match(koreanPropFit.src,/cheongsachorong-welcome-prop-v1\.webp/);assert.ok(Math.abs(koreanPropFit.width-3)<.05&&Math.abs(koreanPropFit.height-4)<.05,`${label}: Korean prop lost its tile scale ${JSON.stringify(koreanPropFit)}`);assert.deepEqual([koreanPropFit.opacity,koreanPropFit.filter,koreanPropFit.imageFilter],['1','none','none']);assert.deepEqual(koreanPropFit.collisions,[false,false],`${label}: Korean prop collision mismatch`)}
    assert.equal(performanceFit.missing,false,`${label}: performance budget missing`);assert.equal(performanceFit.groundTiles,performanceFit.estimate.groundTiles);assert.equal(performanceFit.upperTiles,performanceFit.estimate.upperTiles);assert.ok(performanceFit.groundTiles<=performanceFit.budget.maxGroundTilesPerZone,`${label}: ground DOM budget exceeded`);assert.ok(performanceFit.upperTiles<=performanceFit.budget.maxUpperTilesPerZone,`${label}: upper DOM budget exceeded`);assert.ok(performanceFit.boardNodes<=performanceFit.budget.maxBoardDomNodes,`${label}: board DOM budget exceeded ${performanceFit.boardNodes}/${performanceFit.budget.maxBoardDomNodes}`);
    assert.deepEqual([tileFit.controlCount,tileFit.icons],[5,5],`${label}: drawn control icons missing`);assert.deepEqual(tileFit.controlText,['','','','',''],`${label}: controls must not use visible text`);assert.deepEqual(tileFit.touch,['none','none','none','none','none'],`${label}: controls must support press-and-hold`);assert.equal(tileFit.holds,true,`${label}: direction hold handlers missing`);assert.deepEqual(controlGuardFit,{count:5,selection:[['none','none'],['none','none'],['none','none'],['none','none'],['none','none']],guarded:true,iconEvents:true},`${label}: iOS hold opened selection, callout, or drag`);assert.ok(tileFit.alphas.every(value=>value<.75),`${label}: controls cover too much map ${tileFit.alphas}`);assert.equal(tileFit.sameActor,true,`${label}: NPC and player scale differ`);if(tileFit.hasNpc)assert.notEqual(tileFit.npcAnimation,'none',`${label}: NPC idle animation missing`);
  };
  const assertGameOverFits=async(label,theme)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector('.travelRpgGameOver'),art=document.querySelector('.travelRpgGameOverArt'),panel=document.querySelector('.travelRpgGameOverPanel'),buttons=[...document.querySelectorAll('.travelRpgGameOverPanel button')];if(!root||!art||!panel)return{missing:true};const r=root.getBoundingClientRect(),a=art.getBoundingClientRect(),p=panel.getBoundingClientRect(),style=getComputedStyle(art);return{missing:false,innerWidth,innerHeight,theme:document.documentElement.dataset.theme,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,rootHeight:r.height,artCovers:a.left<=r.left+1&&a.right>=r.right-1&&a.top<=r.top+1&&a.bottom>=r.bottom-1,artOpacity:style.opacity,artFilter:style.filter,artSrc:art.getAttribute('src'),panelInside:p.left>=0&&p.right<=innerWidth&&p.top>=0&&p.bottom<=innerHeight,panelSymmetry:Math.abs(p.left-(innerWidth-p.right)),buttonHeights:buttons.map(button=>button.getBoundingClientRect().height),tiny:[...panel.querySelectorAll('small,p,span')].map(el=>parseFloat(getComputedStyle(el).fontSize)).filter(size=>size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: game-over screen missing`);assert.equal(fit.theme,theme);assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow`);assert.ok(fit.rootHeight>=fit.innerHeight-1,`${label}: game-over is not full height`);assert.equal(fit.artCovers,true,`${label}: game-over art leaves an empty edge`);assert.deepEqual([fit.artOpacity,fit.artFilter],['1','none'],`${label}: game-over art is painted or filtered`);assert.match(fit.artSrc,/travel-stamina-game-over-v1\.webp/);assert.equal(fit.panelInside,true,`${label}: panel leaves viewport`);assert.ok(fit.panelSymmetry<=2,`${label}: panel is asymmetric`);assert.ok(fit.buttonHeights.length===2&&fit.buttonHeights.every(value=>value>=43),`${label}: game-over control below 44px`);assert.deepEqual(fit.tiny,[],`${label}: game-over copy below 10px`);
  };
  const assertThemeSurfaces=async(label,theme,rootSelector,tileSelector)=>{
    const themeFit=await evaluate(`(()=>{const root=document.querySelector(${JSON.stringify(rootSelector)});if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rgb=color=>(color.match(/[\\d.]+/g)||[]).slice(0,3).map(Number);const linear=value=>{const channel=value/255;return channel<=.04045?channel/12.92:Math.pow((channel+.055)/1.055,2.4)};const luminance=values=>.2126*linear(values[0])+.7152*linear(values[1])+.0722*linear(values[2]);const contrast=(a,b)=>{const first=luminance(a),second=luminance(b);return(Math.max(first,second)+.05)/(Math.min(first,second)+.05)};const tiles=[...root.querySelectorAll(${JSON.stringify(tileSelector)})].filter(visible).map(el=>{const style=getComputedStyle(el),background=rgb(style.backgroundColor),foreground=rgb(style.color);return{class:el.className,background:style.backgroundColor,foreground:style.color,brightness:background.length===3?background.reduce((sum,value)=>sum+value,0)/3:null,contrast:background.length===3&&foreground.length===3?contrast(background,foreground):null}});const canvas=rgb(getComputedStyle(document.body).backgroundColor);return{missing:false,theme:document.documentElement.dataset.theme,canvasBrightness:canvas.length===3?canvas.reduce((sum,value)=>sum+value,0)/3:null,tiles}})()`);
    assert.equal(themeFit.missing,false,`${label}: theme root missing`);assert.equal(themeFit.theme,theme,`${label}: expected ${theme} theme`);assert.ok(themeFit.tiles.length>0,`${label}: no theme surfaces inspected`);
    if(theme==='dark'){
      assert.ok(themeFit.canvasBrightness<80,`${label}: dark canvas stayed bright ${JSON.stringify(themeFit)}`);
      assert.deepEqual(themeFit.tiles.filter(row=>row.brightness===null||row.brightness<18||row.brightness>160),[],`${label}: mixed or near-black dark surface`);
    }else{
      assert.ok(themeFit.canvasBrightness>200,`${label}: light canvas stayed dark ${JSON.stringify(themeFit)}`);
      assert.deepEqual(themeFit.tiles.filter(row=>row.brightness===null||row.brightness<170),[],`${label}: mixed dark surface in light theme`);
    }
    assert.deepEqual(themeFit.tiles.filter(row=>row.contrast===null||row.contrast<3.5),[],`${label}: surface text contrast below 3.5`);
  };
  const assertShortsFits=async(label,theme)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector('.tqShortsScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('.shortsTop button,.shortsChoice,.shortsAction button,.malbitShortTools button,.malbitShortProposal>button')].filter(visible);const surfaces=[...root.querySelectorAll('.shortsCard')].filter(visible);const tiles=[...root.querySelectorAll('.shortsCard,.shortsChoice,.shortsFeedback,.malbitShortProposal')].filter(visible);const copy=[...root.querySelectorAll('.shortsInstruction,.shortsFeedback small,.doubleTapHint,.shortsSwipe,.malbitShortTools button,.malbitShortDaily,.malbitShortProposal small,.malbitShortProposal p')].filter(visible);const channels=color=>(color.match(/[\\d.]+/g)||[]).slice(0,3).map(Number);const card=document.querySelector('.shortsCard');return{missing:false,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,cardOverflow:card?card.scrollWidth-card.clientWidth:0,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<170),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Shorts root missing`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.ok(fit.cardOverflow<=1,`${label}: Shorts card content overflow ${fit.cardOverflow}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Shorts card`);
    await assertThemeSurfaces(label,theme,'.tqShortsScreen','.shortsCard,.shortsChoice,.shortsFeedback,.malbitShortProposal');
    assert.deepEqual(fit.tinyCopy,[],`${label}: Shorts copy below 10px`);
  };
  const assertRandomPracticeFits=async(label,theme)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector('.tqRandomPracticeScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const surfaces=[...root.querySelectorAll('.card')].filter(visible);const tiles=[...root.querySelectorAll('.card,.choice,.infinityBar div,.t1RandomTop .t1hud span,.hud span,.malbitQuestionTranslation,.malbitExplanationToggle,.malbitRandomExplanation.open .tqInlineExplanation')].filter(visible);const copy=[...root.querySelectorAll('.randomPracticeTop small,.infinityBar small,.t1hud span,.hud span,.instruction,.cat,.doubleTapHint,.t1TutorCoach small,.malbitQuestionTranslation small,.tqInlineAnswer small,.tqInlineExplanation h4,.counter')].filter(visible);const channels=color=>(color.match(/[\\d.]+/g)||[]).slice(0,3).map(Number);const card=root.querySelector('.card');return{missing:false,active:document.body.classList.contains('tq-random-practice-active'),innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,cardOverflow:card?card.scrollWidth-card.clientWidth:0,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<170),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Random Practice root missing`);
    assert.equal(fit.active,true,`${label}: Random Practice body contract inactive`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.ok(fit.cardOverflow<=1,`${label}: Random Practice card content overflow ${fit.cardOverflow}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: enabled touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Random Practice card`);
    await assertThemeSurfaces(label,theme,'.tqRandomPracticeScreen','.card,.choice,.infinityBar div,.t1RandomTop .t1hud span,.hud span,.malbitQuestionTranslation,.malbitExplanationToggle,.malbitRandomExplanation.open .tqInlineExplanation');
    assert.deepEqual(fit.tinyCopy,[],`${label}: Random Practice copy below 10px`);
  };
  const assertReviewFits=async(label,theme,retry=false)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector(${retry?"'#sheetBody.tqReviewRetrySheet'":"'.tqReviewScreen'"});if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const surfaces=[...root.querySelectorAll(${retry?"'.tqReviewQuestion,.tqReviewDeep'":"'.tqReviewHero,.tqReviewStats,.tqReviewFilters,.tqReviewItem,.tqReviewEmpty'"})].filter(visible);const tiles=[...root.querySelectorAll(${retry?"'.tqReviewQuestion,.tqReviewChoices .choice,.tqReviewDeep,.tqReviewChoiceAnalysis li'":"'.tqReviewStats>div,.tqReviewFilters button,.tqReviewItem,.tqReviewEmpty'"})].filter(visible);const copy=[...root.querySelectorAll(${retry?"'.reward small,.tqReviewQuestion>small,.tqReviewQuestion li,.tqTranslationToggle,.doubleTapHint,.tqReviewDeep h4,.tqReviewDeep blockquote,.tqReviewChoiceAnalysis span'":"'.tqReviewHero small,.tqReviewHero p,.tqReviewStats small,.tqReviewFilters button,.tqReviewBadge small,.tqReviewItem p,.tqReviewItem>div>small,.tqReviewEmpty p'"})].filter(visible);const channels=color=>(color.match(/[\\d.]+/g)||[]).slice(0,3).map(Number);return{missing:false,active:document.body.classList.contains('tq-review-active'),innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,rootOverflow:root.scrollWidth-root.clientWidth,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<170),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Review root missing`);
    assert.equal(fit.active,true,`${label}: Review body contract inactive`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.ok(fit.rootOverflow<=1,`${label}: Review content overflow ${fit.rootOverflow}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: enabled touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Review surface`);
    await assertThemeSurfaces(label,theme,retry?'#sheetBody.tqReviewRetrySheet':'.tqReviewScreen',retry?'.tqReviewQuestion,.tqReviewChoices .choice,.tqReviewDeep,.tqReviewChoiceAnalysis li':'.tqReviewStats>div,.tqReviewFilters button,.tqReviewItem,.tqReviewEmpty');
    assert.deepEqual(fit.tinyCopy,[],`${label}: Review copy below 10px`);
  };
  const assertGameFits=async(label,rootSelector,theme)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector(${JSON.stringify(rootSelector)});if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const surfaces=[...root.querySelectorAll('.tqGameArena,.t1GameLoadout,.tqGameStageList,.t1TrailBoard,.t1RunLoadout,.malbitBattleScreen>.card')].filter(visible);const tiles=[...root.querySelectorAll('.t1GameGear,.tqGameStage:not(.on),.t1RunSlot,.t1TrailNode.unknown')].filter(visible);const copy=[...root.querySelectorAll('.t1GameGear small,.t1RarityLegend span,.t1RunRule,.t1RunSlot small,.tqGameTts')].filter(visible);const channels=color=>(color.match(/[\d.]+/g)||[]).slice(0,3).map(Number);return{missing:false,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<110),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Game root missing`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: enabled touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Game surface`);
    await assertThemeSurfaces(label,theme,rootSelector,'.t1GameGear,.tqGameStage:not(.on),.t1RunSlot,.t1TrailNode.unknown');
    assert.deepEqual(fit.tinyCopy,[],`${label}: Game copy below 10px`);
  };
  const assertHomeFits=async(label,theme)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector('.tqHomeScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const surfaces=[...root.querySelectorAll(':scope>.t1level,.tqV9Hero,.tqV9Modes,.tqV9Utility,.tqV9Week')].filter(visible);const tiles=[...root.querySelectorAll('.tqV9Mode,.tqV9Utility button,.tqV9Week')].filter(visible);const copy=[...root.querySelectorAll('.tqV9Greeting small,.tqV9SectionHead span,.tqV9Mode small,.tqV9Utility small,.tqV9Week p,.tqV9Day small')].filter(visible);const channels=color=>(color.match(/[\d.]+/g)||[]).slice(0,3).map(Number);return{missing:false,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<170),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Home root missing`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: enabled touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Home surface`);
    await assertThemeSurfaces(label,theme,'.tqHomeScreen',':scope>.t1level,.tqV9Mode,.tqV9Utility button,.tqV9Week');
    assert.deepEqual(fit.tinyCopy,[],`${label}: Home copy below 10px`);
  };
  const assertBeginnerGrammarFits=async(label,theme)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector('.bgScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const surfaces=[...root.querySelectorAll(':scope>.bgHero,:scope>.bgMethod,:scope>.bgResume,:scope>.bgChapterIntro,:scope>.bgLessonList,:scope>.bgScope,:scope>.bgLessonHero,:scope>.bgFormula,:scope>.bgRuleCard,:scope>.bgExamples,:scope>.bgTrap,:scope>.bgDrill,:scope>.bgWriting,:scope>.bgLessonFinish,:scope>.bgLessonNav')].filter(visible);const copy=[...root.querySelectorAll('small,em,p,.bgMethod span,.bgVariant code')].filter(visible);return{missing:false,theme:document.documentElement.dataset.theme,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,screenOverflow:root.scrollWidth-root.clientWidth,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize),text:el.textContent.trim().slice(0,24)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: beginner grammar root missing`);
    assert.equal(fit.theme,theme,`${label}: expected ${theme} theme`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.ok(fit.screenOverflow<=1,`${label}: grammar content overflow ${fit.screenOverflow}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: enabled touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric grammar surface`);
    await assertThemeSurfaces(label,theme,'.bgScreen','.bgMethod,.bgChapterCard,.bgLessonRow,.bgScope,.bgFormula,.bgRuleCard,.bgExamples,.bgVariant,.bgDrill,.bgWriting,.bgLessonFinish');
    assert.deepEqual(fit.tinyCopy,[],`${label}: grammar copy below 10px`);
  };
  const openStoredShorts=async index=>{
    await evaluate(`(()=>{S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:2,activeLevel:2,levels:{1:{index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null},2:{index:${Number(index)},selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null}},daily:{}}))})()`);
    await send('Page.reload',{ignoreCache:true});await ready();
    for(let wait=0;wait<50;wait++){if(await evaluate(`!!document.querySelector('.shortsCard')`))return;await sleep(50)}
    throw new Error('Stored Shorts card did not render');
  };
  const submitShortsLabel=async label=>{
    const choiceIndex=await evaluate(`[...document.querySelectorAll('.shortsChoice span')].findIndex(node=>node.textContent.trim()===${JSON.stringify(label)})`);
    assert.ok(choiceIndex>=0,`Shorts answer missing: ${label}`);
    await tap('.shortsChoice',choiceIndex,120);await tap('.shortsChoice',choiceIndex,180);
    assert.ok(await evaluate(`!!document.querySelector('.shortsFeedback')`),'Shorts feedback must appear after submission');
  };
  const rpgPath=async(kind='scene',targetId='')=>evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store.episodes['route-001-airport-myeongdong'],match=MALBIT_TRAVEL_RPG.contextForProgress(state.packId,state.exploration,state.sceneId);if(!match)return null;const target=${JSON.stringify(kind)}==='scene'?match.anchor:${JSON.stringify(kind)}==='portal'?match.zone.portals.find(item=>item.id===${JSON.stringify(targetId)}):match.zone.pois.find(item=>item.id===${JSON.stringify(targetId)});if(!target)return null;const range=MALBIT_TRAVEL_RPG.interactionRange(match.zone),queue=[{x:state.exploration.x,y:state.exploration.y,path:[]}],seen=new Set([state.exploration.x+','+state.exploration.y]);while(queue.length){const current=queue.shift();if(Math.abs(current.x-target.x)+Math.abs(current.y-target.y)<=range)return current.path;for(const [direction,delta] of Object.entries(MALBIT_TRAVEL_RPG.directions)){const x=current.x+delta.x,y=current.y+delta.y,key=x+','+y;if(seen.has(key)||!MALBIT_TRAVEL_RPG.isWalkable(match.zone,x,y,state.sceneId))continue;seen.add(key);queue.push({x,y,path:[...current.path,direction]})}}return null})()`);
  const moveRpgTo=async(kind='scene',targetId='')=>{
    for(let wait=0;wait<30;wait++){if(!await evaluate(`MALBIT_TRAVEL_RPG_CUES?.active`))break;await sleep(20)}
    assert.equal(await evaluate(`MALBIT_TRAVEL_RPG_CUES?.active`),false,'previous interaction cue did not release movement controls');
    const path=await rpgPath(kind,targetId);assert.ok(Array.isArray(path),`RPG target unreachable: ${kind} ${targetId}`);
    const applied=await evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store.episodes['route-001-airport-myeongdong'],match=MALBIT_TRAVEL_RPG.contextForProgress(state.packId,state.exploration,state.sceneId);let progress=state.exploration;for(const direction of ${JSON.stringify(path)}){const result=MALBIT_TRAVEL_RPG.step(match.zone,progress,direction,state.sceneId);if(!result.moved)return false;progress=result.progress}state.exploration=progress;localStorage.setItem('malbitStoryV1',JSON.stringify(store));render();return true})()`);assert.equal(applied,true,`RPG path crossed a blocked tile: ${kind} ${targetId}`);await sleep(80);
    assert.equal(await evaluate(`document.querySelector('.travelRpgAction')?.disabled`),false,`RPG action disabled at ${kind} ${targetId}`);
  };
  const assertSmoothRpgMotion=async()=>{
    await evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store.episodes['route-001-airport-myeongdong'];state.exploration={...state.exploration,version:2,x:14,y:18,direction:'down'};localStorage.setItem('malbitStoryV1',JSON.stringify(store));render();window.__malbitSpriteNode=document.querySelector('.travelRpgSprite');window.__malbitShadowNode=document.querySelector('.travelRpgShadow.player');window.__malbitGroundNode=document.querySelector('.travelRpgGroundLayer')})()`);await sleep(50);
    const before=await evaluate(`(()=>{const viewport=document.querySelector('.travelRpgViewport'),board=document.querySelector('.travelRpgBoard'),player=document.querySelector('.travelRpgPlayer'),shadow=document.querySelector('.travelRpgShadow.player'),sprite=document.querySelector('.travelRpgSprite'),v=viewport.getBoundingClientRect(),b=board.getBoundingClientRect(),p=player.getBoundingClientRect(),s=getComputedStyle(sprite);return{left:b.left,top:b.top,playerLeft:player.style.left,playerTop:player.style.top,shadowLeft:shadow.style.left,shadowTop:shadow.style.top,duration:getComputedStyle(board).transitionDuration,idle:player.classList.contains('idle'),idleDuration:s.animationDuration,walkFps:player.dataset.walkFps,centerX:p.left+p.width*.5-(v.left+v.width*.5),centerY:p.top+p.height*.9375-(v.top+v.height*.5),background:s.backgroundImage}})()`);
    assert.equal(before.idle,true,'resting traveler must use the idle loop');assert.equal(before.idleDuration,'0.96s');assert.equal(before.walkFps,'12');assert.ok(Math.abs(before.centerX)<2&&Math.abs(before.centerY)<2,`interior camera must keep the foot anchor centered: ${JSON.stringify(before)}`);
    await evaluate(`malbitTravelStep('down')`);await sleep(70);
    const middle=await evaluate(`(()=>{const board=document.querySelector('.travelRpgBoard'),player=document.querySelector('.travelRpgPlayer'),shadow=document.querySelector('.travelRpgShadow.player'),sprite=document.querySelector('.travelRpgSprite'),b=board.getBoundingClientRect(),s=getComputedStyle(sprite),animation=sprite.getAnimations()[0],currentTime=animation?.currentTime;let frameA=s.backgroundPositionX,frameB=frameA;if(animation){animation.currentTime=10;frameA=getComputedStyle(sprite).backgroundPositionX;animation.currentTime=95;frameB=getComputedStyle(sprite).backgroundPositionX;animation.currentTime=currentTime}return{left:b.left,top:b.top,busy:MALBIT_TRAVEL_RPG_MOTION.busy,walking:player.classList.contains('walking'),direction:player.classList.contains('down'),animations:board.getAnimations().length,spriteAnimations:sprite.getAnimations().length,sameNode:window.__malbitSpriteNode===sprite,sameShadowNode:window.__malbitShadowNode===shadow,shadowContact:[shadow.style.left,shadow.style.top,shadow.style.zIndex],playerContact:[player.style.left,player.style.top,player.style.zIndex],shadowAnimations:shadow.getAnimations().length,duration:s.animationDuration,background:s.backgroundImage,frameA,frameB,opacity:s.opacity,filter:s.filter}})()`);
    assert.equal(middle.busy,true,'movement must stay active while interpolating');assert.equal(middle.walking,true,'player walk cycle missing');assert.equal(middle.direction,true,'movement must switch to a real down-facing row');assert.ok(middle.animations>0,'camera transition missing');assert.ok(middle.spriteAnimations>0,'12fps sprite animation missing');
    assert.equal(middle.sameNode,true,'walking must not replace the sprite DOM');assert.equal(middle.sameShadowNode,true,'walking must not replace the shadow DOM');assert.deepEqual(middle.shadowContact,middle.playerContact,'walking shadow must share the live foot contact');assert.ok(middle.shadowAnimations>0,'shadow must interpolate with the actor');assert.equal(middle.duration,'0.333333s');assert.equal(middle.background,before.background,'walking must keep one decoded sprite image');assert.equal(middle.opacity,'1');assert.equal(middle.filter,'none');
    assert.notEqual(middle.frameA,middle.frameB,'12fps walk frames did not advance between 10ms and 95ms');
    if(!fs.existsSync(path.join(out,'00ma-traveler-walk-down-12fps.png')))await shot('00ma-traveler-walk-down-12fps.png');
    for(let wait=0;wait<40;wait++){if(!await evaluate(`MALBIT_TRAVEL_RPG_MOTION.busy`))break;await sleep(20)}
    const after=await evaluate(`(()=>{const board=document.querySelector('.travelRpgBoard'),player=document.querySelector('.travelRpgPlayer'),shadow=document.querySelector('.travelRpgShadow.player'),b=board.getBoundingClientRect();return{left:b.left,top:b.top,busy:MALBIT_TRAVEL_RPG_MOTION.busy,playerLeft:player.style.left,playerTop:player.style.top,shadowLeft:shadow.style.left,shadowTop:shadow.style.top}})()`);
    assert.equal(after.busy,false);assert.notEqual(before.playerTop,after.playerTop,'player did not reach the next tile');assert.deepEqual([after.shadowLeft,after.shadowTop],[after.playerLeft,after.playerTop],'shadow did not settle at the player foot');
    assert.ok(Math.hypot(middle.left-before.left,middle.top-before.top)>0.5,'camera did not leave its start');assert.ok(Math.hypot(after.left-middle.left,after.top-middle.top)>0.5,'camera snapped directly to its end');
    assert.match(before.duration,/0\.16s/);
    await evaluate(`malbitTravelStep('right');malbitTravelStep('left');malbitTravelStep('right')`);
    assert.ok(await evaluate(`MALBIT_TRAVEL_RPG_MOTION.queued>=2`),'rapid input was not queued');
    for(let wait=0;wait<100;wait++){if(!await evaluate(`MALBIT_TRAVEL_RPG_MOTION.busy`))break;await sleep(20)}
    assert.equal(await evaluate(`MALBIT_TRAVEL_RPG_MOTION.busy`),false,'rapid movement queue did not finish');
    await evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store.episodes['route-001-airport-myeongdong'];state.exploration={...state.exploration,version:2,x:14,y:18,direction:'down'};localStorage.setItem('malbitStoryV1',JSON.stringify(store));render();window.__malbitSpriteNode=document.querySelector('.travelRpgSprite');window.__malbitGroundNode=document.querySelector('.travelRpgGroundLayer')})()`);await sleep(80);
    const frameTimes=await evaluate(`new Promise(resolve=>{const samples=[];let previous=0,count=0;const frame=now=>{if(previous)samples.push(now-previous);previous=now;count+=1;if(count===3)malbitTravelStep('down');if(count<48)requestAnimationFrame(frame);else resolve(samples)};requestAnimationFrame(frame)})`);
    const budget=await evaluate(`MALBIT_TRAVEL_RPG.worldByRoute('route-001-airport-myeongdong').performanceBudget`),sorted=[...frameTimes].sort((a,b)=>a-b),p95=sorted[Math.max(0,Math.ceil(sorted.length*.95)-1)],longFrames=frameTimes.filter(value=>value>budget.longFrameMs),longFrameRatio=longFrames.length/frameTimes.length;
    assert.ok(frameTimes.length>=45,'frame budget needs a representative movement sample');assert.ok(p95<=budget.maxP95FrameMs,`movement frame p95 ${p95.toFixed(2)}ms exceeds ${budget.maxP95FrameMs}ms`);assert.ok(longFrameRatio<=budget.maxLongFrameRatio,`movement long-frame ratio ${(longFrameRatio*100).toFixed(1)}% exceeds ${budget.maxLongFrameRatio*100}%`);
    fs.writeFileSync(path.join(out,'travel-performance-budget.json'),JSON.stringify({budget,sampleCount:frameTimes.length,p95FrameMs:Number(p95.toFixed(3)),longFrames:longFrames.length,longFrameRatio:Number(longFrameRatio.toFixed(4))},null,2));
    const holdBefore=(await state()).exploration.steps;await evaluate(`malbitTravelHoldStart({preventDefault(){},pointerId:9,currentTarget:{setPointerCapture(){}}},'right')`);await sleep(380);await evaluate(`malbitTravelHoldStop({preventDefault(){}})`);
    for(let wait=0;wait<40;wait++){if(!await evaluate(`MALBIT_TRAVEL_RPG_MOTION.busy`))break;await sleep(20)}
    const hold=await evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store.episodes['route-001-airport-myeongdong'];return{steps:state.exploration.steps,sameSprite:window.__malbitSpriteNode===document.querySelector('.travelRpgSprite'),sameGround:window.__malbitGroundNode===document.querySelector('.travelRpgGroundLayer'),notice:document.querySelector('.travelRpgToast')?.textContent||''}})()`);
    assert.ok(hold.steps-holdBefore>=2,`press-and-hold moved only ${hold.steps-holdBefore} tiles`);assert.equal(hold.sameSprite,true,'held movement replaced the sprite DOM');assert.equal(hold.sameGround,true,'held movement repainted the tilemap');assert.equal(hold.notice,'','blocked movement must stay silent');await sleep(180);assert.equal((await state()).exploration.steps,hold.steps,'movement continued after releasing the direction key');
  };
  const openRpgScene=async()=>{
    if(!await evaluate(`!!document.querySelector('.travelRpgCard')`))return false;
    await moveRpgTo('scene');await tap('.travelRpgAction',0,160);
    assert.equal(await evaluate(`!!document.querySelector('.travelRpgCard')`),false,'scene interaction must open the existing event card');
    return true;
  };
  const startFresh=async(seedMetrics=false)=>{
    await evaluate(`localStorage.removeItem('malbitStoryV1');${seedMetrics?"localStorage.setItem('malbitStoryV1',JSON.stringify({version:1,activePackId:'route-001-airport-myeongdong',episodes:{},metrics:{version:2,routeStarts:5,routeCompletions:4,myeongdongEntries:3,exchangeSessions:2,priceQuestStarts:4,priceQuestCompletions:3,priceQuestWrongSubmissions:2,priceQuestWalletTotal:180000}}));":''}S.lang='ja';S.view='home';save();render()`);
    let homeReady=false;
    for(let wait=0;wait<40;wait++){if(await evaluate(`!!document.querySelector('.tqV9Mode.travel img[src*="airport-map.webp"]')`)){homeReady=true;break}await sleep(50)}
    assert.ok(homeReady,'Travel entry must use generated art instead of emoji');
    let opened=false;
    if(seedMetrics){
      for(let attempt=0;attempt<3&&!opened;attempt++){
        if(await evaluate(`!!document.querySelector('.tqV9Mode.travel:not([disabled])')`))await tap('.tqV9Mode.travel');
        for(let wait=0;wait<20;wait++){if(await evaluate(`document.querySelector('.travelHubHead h1')?.textContent==='旅行モード'`)){opened=true;break}await sleep(50)}
      }
    }else{
      await evaluate(`malbitTravelOpen()`);
      for(let wait=0;wait<40;wait++){if(await evaluate(`document.querySelector('.travelHubHead h1')?.textContent==='旅行モード'`)){opened=true;break}await sleep(50)}
    }
    assert.ok(opened,'Travel entry must open the hub');
    assert.equal(await evaluate(`document.querySelector('.travelHubHead h1')?.textContent`),'旅行モード');
    if(seedMetrics){
      assert.equal(await evaluate(`document.querySelectorAll('.travelMetric').length`),7);
      assert.deepEqual(await evaluate(`[...document.querySelectorAll('.travelMetric b')].map(node=>node.textContent)`),['5','80%','75%','67%','75%','2','60,000旅ウォン']);
      assert.match(await evaluate(`document.querySelector('.travelMetricFeedback')?.textContent`),/完了率75%・誤答2回・完了後の平均60,000旅ウォン/);
      assert.match(await evaluate(`document.querySelector('.travelMetricFeedback')?.textContent`),/値段×個数、そのあと予算−合計/);
      assert.match(await evaluate(`document.querySelector('.travelMetrics>p')?.textContent`),/この端末内に数値だけを保存し、外部へ送信しません/);
      const metricFit=await evaluate(`(()=>{const card=document.querySelector('.travelMetrics'),grid=document.querySelector('.travelMetricsGrid'),feedback=document.querySelector('.travelMetricFeedback');return{card:card.scrollWidth-card.clientWidth,grid:grid.scrollWidth-grid.clientWidth,feedback:feedback.scrollWidth-feedback.clientWidth}})()`);
      assert.ok(metricFit.card<=1&&metricFit.grid<=1&&metricFit.feedback<=1,`local metrics overflow: ${JSON.stringify(metricFit)}`);
      await evaluate(`document.querySelector('.travelMetrics').scrollIntoView({block:'start',behavior:'auto'})`);
      await sleep(100);
      await shot('01b-local-metrics.png');
      await evaluate(`scrollTo({top:0,left:0,behavior:'auto'})`);
    }
    if(!fs.existsSync(path.join(out,'01a-travel-hub.png'))){
      await assertFits('Travel hub');
      await shot('01a-travel-hub.png');
    }
    await tapUntilScene('.travelEpisodeCard .travelPrimary','arrival');
    await assertSmoothRpgMotion();
    const captureRpgVisuals=!fs.existsSync(path.join(out,'00m-travel-rpg-light.png'));
    if(captureRpgVisuals){
      await evaluate(`malbitSetTheme('light')`);await sleep(120);
      for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRpgFits(`Travel RPG light ${width}px`,'light');await assertFits(`Travel RPG light ${width}px`)}
      await setViewport(390,844);await shot('00m-travel-rpg-light.png');
      await evaluate(`window.__travelCueLog=[];window.MALBIT_TRAVEL_CUE_HOOKS={sound:true,vibration:true,playSound:(name,detail)=>window.__travelCueLog.push({channel:'sound',name,kind:detail.kind,phase:detail.phase}),vibrate:(pattern,detail)=>window.__travelCueLog.push({channel:'vibration',pattern,kind:detail.kind,phase:detail.phase})}`);
      await moveRpgTo('poi','baggage-carousel');await tap('.travelRpgAction',0,120);
      assert.match(await evaluate(`document.querySelector('.travelRpgDiscovery')?.innerText`),/수하물 찾는 곳/);
      const discoveryCue=await evaluate(`(()=>{const shell=document.querySelector('.travelRpgShell'),map=document.querySelector('.travelRpgMap'),viewport=document.querySelector('.travelRpgViewport');return{active:MALBIT_TRAVEL_RPG_CUES.active,kind:shell?.dataset.cueKind,phase:shell?.dataset.cuePhase,busy:viewport?.getAttribute('aria-busy'),mapOpacity:getComputedStyle(map).opacity,mapFilter:getComputedStyle(map).filter,viewportOpacity:getComputedStyle(viewport).opacity,viewportFilter:getComputedStyle(viewport).filter,log:window.__travelCueLog}})()`);
      assert.deepEqual([discoveryCue.active,discoveryCue.kind,discoveryCue.phase,discoveryCue.busy],[true,'reward','reward','true']);assert.deepEqual([discoveryCue.mapOpacity,discoveryCue.mapFilter,discoveryCue.viewportOpacity,discoveryCue.viewportFilter],['1','none','1','none'],'cue must not flash or filter the scene');assert.ok(discoveryCue.log.some(item=>item.name==='investigation-open'));assert.ok(discoveryCue.log.some(item=>item.name==='reward-earned'));
      assert.equal((await state()).wallet,79200);await shot('00n-travel-rpg-investigation.png');await tap('.travelRpgDiscovery button',0,90);assert.equal(await evaluate(`MALBIT_TRAVEL_RPG_CUES.active`),false,'return cue must release controls');
      await moveRpgTo('poi','cheongsachorong-welcome');await tap('.travelRpgAction',0,120);
      assert.match(await evaluate(`document.querySelector('.travelRpgDiscovery')?.innerText`),/チョンサチョロンの歓迎飾り/);assert.match(await evaluate(`document.querySelector('.travelRpgDiscovery')?.innerText`),/歓迎の気持ち/);
      assert.equal((await state()).wallet,79400);await shot('00nw-cheongsachorong-welcome.png');await tap('.travelRpgDiscovery button',0,90);
      await tap('.travelRpgAction',0,120);assert.equal((await state()).wallet,79400,'Korean prop must never repay its discovery reward');await tap('.travelRpgDiscovery button',0,90);
      await moveRpgTo('portal','arrivals-to-transport');await tap('.travelRpgAction',0,140);
      assert.equal((await state()).exploration.zoneId,'icn-t1-transport-center');
      assert.match(await evaluate(`document.querySelector('.travelRpgMap')?.getAttribute('src')`),/airport-transport-center-map-v1\.webp/);
      assert.deepEqual(await evaluate(`(()=>({active:MALBIT_TRAVEL_RPG_CUES.active,kind:document.querySelector('.travelRpgShell')?.dataset.cueKind,phase:document.querySelector('.travelRpgShell')?.dataset.cuePhase,portalSounds:window.__travelCueLog.filter(item=>item.channel==='sound'&&item.kind==='portal').map(item=>item.name)}))()`),{active:true,kind:'portal',phase:'arrive',portalSounds:['portal-enter','portal-arrive']});
      for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRpgFits(`Transport center light ${width}px`,'light','airport-transport-center-map-v1.webp');await assertFits(`Transport center light ${width}px`)}
      await setViewport(390,844);
      await evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store.episodes['route-001-airport-myeongdong'];state.exploration={...state.exploration,version:2,x:22,y:24,direction:'up'};localStorage.setItem('malbitStoryV1',JSON.stringify(store));render()})()`);await sleep(80);
      const frontDepth=await evaluate(`(()=>({player:Number(getComputedStyle(document.querySelector('.travelRpgPlayer')).zIndex),kiosk:Number(getComputedStyle(document.querySelector('[data-foreground-id="center-map-kiosk"]')).zIndex)}))()`);
      assert.ok(frontDepth.player>frontDepth.kiosk,`player in front of kiosk has wrong depth: ${JSON.stringify(frontDepth)}`);await shot('00na-transport-center-front-depth.png');
      await evaluate(`malbitTravelStep('up')`);await sleep(260);
      assert.deepEqual({x:(await state()).exploration.x,y:(await state()).exploration.y},{x:22,y:24},'kiosk collision must stop the traveler at its visible base');
      await evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store.episodes['route-001-airport-myeongdong'];state.exploration={...state.exploration,version:2,x:22,y:14,direction:'down'};localStorage.setItem('malbitStoryV1',JSON.stringify(store));render()})()`);await sleep(80);
      const behindDepth=await evaluate(`(()=>({player:Number(getComputedStyle(document.querySelector('.travelRpgPlayer')).zIndex),kiosk:Number(getComputedStyle(document.querySelector('[data-foreground-id="center-map-kiosk"]')).zIndex)}))()`);
      assert.ok(behindDepth.player<behindDepth.kiosk,`player behind kiosk has wrong depth: ${JSON.stringify(behindDepth)}`);await shot('00nd-transport-center-behind-depth.png');
      await moveRpgTo('poi','transport-center-sign');await tap('.travelRpgAction',0,120);
      assert.match(await evaluate(`document.querySelector('.travelRpgDiscovery')?.innerText`),/「교통」は交通・移動手段/);
      assert.equal((await state()).wallet,79600);await shot('00nb-transport-sign-investigation.png');await tap('.travelRpgDiscovery button',0,90);
      await evaluate(`malbitSetTheme('dark')`);await sleep(120);
      for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRpgFits(`Transport center dark ${width}px`,'dark','airport-transport-center-map-v1.webp');await assertFits(`Transport center dark ${width}px`)}
      await setViewport(390,844);await shot('00o-transport-center-dark.png');
      await moveRpgTo('portal','transport-to-rail-concourse');await tap('.travelRpgAction',0,140);
      assert.equal((await state()).exploration.zoneId,'icn-t1-airport-rail-concourse');
      assert.match(await evaluate(`document.querySelector('.travelRpgMap')?.getAttribute('src')`),/airport-rail-concourse-map-v1\.webp/);
      for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRpgFits(`Airport rail concourse dark ${width}px`,'dark','airport-rail-concourse-map-v1.webp');await assertFits(`Airport rail concourse dark ${width}px`)}
      await setViewport(390,844);await shot('00oa-airport-rail-concourse-dark.png');
      await moveRpgTo('poi','boarding-direction-sign');await tap('.travelRpgAction',0,120);
      assert.match(await evaluate(`document.querySelector('.travelRpgDiscovery')?.innerText`),/「승차」は乗車、「방향」は方向/);
      assert.equal((await state()).wallet,79800);await shot('00ob-boarding-direction-sign.png');await tap('.travelRpgDiscovery button',0,90);
      await evaluate(`malbitSetTheme('light')`);await sleep(120);
      for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRpgFits(`Airport rail concourse light ${width}px`,'light','airport-rail-concourse-map-v1.webp');await assertFits(`Airport rail concourse light ${width}px`)}
      await setViewport(390,844);await shot('00oc-airport-rail-concourse-light.png');
      await moveRpgTo('portal','rail-concourse-to-transport');await tap('.travelRpgAction',0,140);
      assert.equal((await state()).exploration.zoneId,'icn-t1-transport-center');
      assert.match(await evaluate(`document.querySelector('.travelRpgMap')?.getAttribute('src')`),/airport-transport-center-map-v1\.webp/);
      await moveRpgTo('portal','transport-to-arrivals');await tap('.travelRpgAction',0,140);
      assert.equal((await state()).exploration.zoneId,'icn-t1-arrivals');
      assert.match(await evaluate(`document.querySelector('.travelRpgMap')?.getAttribute('src')`),/airport-arrivals-map-v1\.webp/);
      await setViewport(390,844);await evaluate(`malbitSetTheme('light')`);await sleep(100);
      const beforeExhaustion=await state();
      const retainedDiscoveries=[...beforeExhaustion.exploration.discoveries];
      await evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1')),state=store.episodes['route-001-airport-myeongdong'];state.exploration={...state.exploration,version:2,x:14,y:18,direction:'down',stamina:{version:1,maxSteps:10000,usedSteps:9999}};localStorage.setItem('malbitStoryV1',JSON.stringify(store));render()})()`);await sleep(80);
      assert.equal(await evaluate(`document.querySelector('[data-rpg-stamina-percent]')?.textContent.trim()`),'1%');
      const exhaustionStart=await state();
      await evaluate(`malbitTravelStep('down')`);await sleep(280);
      const exhausted=await state();
      assert.deepEqual({used:exhausted.exploration.stamina.usedSteps,remaining:exhausted.exploration.stamina.remainingSteps,percent:exhausted.exploration.stamina.percent,exhausted:exhausted.exploration.stamina.exhausted},{used:10000,remaining:0,percent:0,exhausted:true});
      assert.equal(exhausted.exploration.steps,exhaustionStart.exploration.steps+1,'the final valid tile must count exactly once');
      assert.equal(exhausted.clockMinutes,exhaustionStart.clockMinutes,'game over must not advance the story clock');
      for(const theme of ['light','dark']){
        await evaluate(`malbitSetTheme(${JSON.stringify(theme)})`);await sleep(100);
        for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertGameOverFits(`Travel stamina game over ${theme} ${width}px`,theme);await assertFits(`Travel stamina game over ${theme} ${width}px`)}
        await setViewport(390,844);await shot(theme==='light'?'00q-stamina-game-over-light.png':'00r-stamina-game-over-dark.png');
      }
      await tap('.travelRpgGameOverPanel .travelPrimary',0,140);
      const rested=await state();
      assert.equal(rested.exploration.stamina.percent,100);assert.equal(rested.exploration.stamina.exhausted,false);assert.equal(rested.clockMinutes,exhaustionStart.clockMinutes+60);assert.equal(rested.exploration.steps,exhausted.exploration.steps);assert.deepEqual(rested.exploration.discoveries,retainedDiscoveries);
      const restedSpawn=await evaluate(`(()=>{const world=MALBIT_TRAVEL_RPG.worldByRoute('route-001-airport-myeongdong'),zone=MALBIT_TRAVEL_RPG.zoneById(world,'icn-t1-arrivals');return zone.spawn})()`);
      assert.equal(rested.exploration.zoneId,'icn-t1-arrivals');assert.deepEqual({x:rested.exploration.x,y:rested.exploration.y},{x:restedSpawn.x,y:restedSpawn.y});
      await assertRpgFits('Travel stamina rested dark 390px','dark');await shot('00s-stamina-restored-dark.png');
      await evaluate(`malbitSetTheme('light')`);await sleep(80);
    }
    await openRpgScene();
    await tapUntilScene('.travelSceneCard .travelPrimary','q-hello');
    await openRpgScene();
    if(captureRpgVisuals){
      await evaluate(`malbitSetTheme('light')`);await sleep(120);
      for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertFits(`Travel event light ${width}px`)}
      const eventTheme=await evaluate(`(()=>{const card=document.querySelector('.travelQuestionCard'),style=getComputedStyle(card),surface=getComputedStyle(document.body).getPropertyValue('--travel-surface').trim(),rgb=(style.backgroundColor.match(/[0-9.]+/g)||[]).slice(0,3).map(Number);return{theme:document.documentElement.dataset.theme,bodyClass:document.body.className,surface,background:style.backgroundColor,brightness:rgb.length===3?rgb.reduce((sum,value)=>sum+value,0)/3:null,borderImage:style.borderImageSource}})()`);
      await setViewport(390,844);await shot('00p-travel-event-light.png');
      assert.equal(eventTheme.theme,'light');assert.match(eventTheme.bodyClass,/(^|\s)travel-active(\s|$)/);assert.equal(eventTheme.surface,'#fff');assert.ok(eventTheme.brightness>235,`light event card is unexpectedly dark: ${JSON.stringify(eventTheme)}`);assert.equal(eventTheme.borderImage,'none');
      await evaluate(`malbitSetTheme('dark')`);await sleep(100);
    }
    assert.equal(await evaluate(`document.querySelector('.travelDialogueLesson')?.dataset.dialogueStep`),'1');
    assert.equal(await evaluate(`document.querySelectorAll('.travelDialogueFlow span').length`),0,'airport dialogue translation must be hidden before request');
    if(captureRpgVisuals){await evaluate(`malbitSetTheme('light')`);await sleep(80);await assertFits('Airport NPC dialogue turn 1 light');await shot('00t-airport-dialogue-turn-1.png')}
    await tap('.travelDialogueNext');await tap('.travelDialogueNext');
    assert.equal((await state()).dialogues['q-hello'].step,3);
    await tap('.travelDialogueTools .travelTextButton');
    assert.equal(await evaluate(`document.querySelectorAll('.travelDialogueFlow span').length`),3,'requested translation must cover only visible turns');
    if(captureRpgVisuals){
      await shot('00u-airport-dialogue-requested-translation.png');
      await evaluate(`malbitSetTheme('dark')`);await sleep(80);
      for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertFits(`Airport NPC requested translation dark ${width}px`)}
      await setViewport(390,844);await shot('00ua-airport-dialogue-requested-translation-dark.png');
      await evaluate(`malbitSetTheme('light')`);await sleep(80);
      await send('Page.reload',{ignoreCache:true});await ready();
      for(let wait=0;wait<100&&await evaluate(`typeof window.malbitTravelStart!=='function'`);wait++)await sleep(50);
      await evaluate(`window.malbitTravelStart('route-001-airport-myeongdong',false)`);await sleep(100);await openRpgScene();
      assert.deepEqual(await evaluate(`(()=>({step:document.querySelector('.travelDialogueLesson')?.dataset.dialogueStep,support:document.querySelectorAll('.travelDialogueFlow span').length}))()`),{step:'3',support:3},'dialogue step and requested translation must survive reload');
    }
    await tap('.travelDialogueTools .travelTextButton');
    while(await evaluate(`!!document.querySelector('.travelDialogueNext')`))await tap('.travelDialogueNext');
    assert.equal(await evaluate(`document.querySelectorAll('.travelAnswer').length`),4);
    assert.equal(await evaluate(`document.querySelectorAll('.travelAnswerCopy small').length`),0,'keyword choices must stay Korean-only before grading');
  };
  const answer=async(index=0)=>{
    assert.equal(await evaluate(`document.querySelectorAll('.travelAnswer').length`),4);
    await tap('.travelAnswer',index);
    assert.equal(await evaluate(`document.querySelectorAll('.travelAnswer.selected').length`),1);
    await tap('.travelQuestionCard .travelPrimary');
    const active=await state();
    if(!active.answers[active.sceneId]&&await evaluate(`!!document.querySelector('.travelDialogueHint')`)){
      assert.ok(active.dialogues[active.sceneId].attempts>=1,'wrong keyword must advance the saved hint state');
      assert.equal(await evaluate(`document.querySelectorAll('.travelDialogueHint span').length`),0,'hint translation must remain requested-only');
      if(!fs.existsSync(path.join(out,'00v-airport-dialogue-hint.png')))await shot('00v-airport-dialogue-hint.png');
      await tap('.travelAnswer',0);await tap('.travelQuestionCard .travelPrimary');
    }
    return state();
  };
  const waitForQuestionTitle=async(expected)=>{
    for(let wait=0;wait<100;wait++){
      if(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent===${JSON.stringify(expected)}`))return expected;
      await sleep(50);
    }
    return evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`);
  };
  const nextQuestion=async()=>{
    await tap('.travelQuestionCard .travelPrimary');
    await openRpgScene();
    for(let i=0;i<20&&await evaluate('scrollY')>1;i++)await sleep(25);
    assert.ok(await evaluate('scrollY')<=1,'next scene must begin at the top instead of keeping the previous scroll position');
  };
  const clearAirport=async()=>{
    for(let mission=0;mission<3;mission++){await answer(0);await nextQuestion()}
    assert.equal((await state()).sceneId,'transport');
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('.travelRoutes button')].map(button=>button.disabled)`),[false,false,false]);
  };
  const runRoute=async(routeIndex,routeId,{reloadAtTransfer=false,taxiBackResume=false}={})=>{
    await startFresh();
    await clearAirport();
    if(routeId==='express')await shot('05-transport-choice.png');
    await tap('.travelRoutes button',routeIndex);
    assert.equal((await state()).route,routeId);
    await tap('.travelSceneCard .travelPrimary');
    const firstTitle=routeId==='taxi'?'運転手に行き先を伝えよう':'交通カードで改札を通ろう';
    assert.equal(await waitForQuestionTitle(firstTitle),firstTitle,'route question must finish rendering before verification');
    if(reloadAtTransfer){
      await send('Page.reload',{ignoreCache:true});
      let restored=false;
      for(let wait=0;wait<100;wait++){
        if(await evaluate(`document.readyState==='complete'&&!document.documentElement.classList.contains('tq-booting')&&document.querySelector('.travelQuestionCard h1')?.textContent===${JSON.stringify(firstTitle)}`)){restored=true;break}
        await sleep(100);
      }
      assert.ok(restored,'reload must restore the active Travel question before assertions continue');
      assert.equal((await state()).sceneId,'q-ticket');
      assert.equal(await waitForQuestionTitle(firstTitle),firstTitle);
    }
    if(routeId==='express')await shot('06-rail-transfer.png');
    if(routeId==='taxi')await shot('07-taxi-direct.png');
    await answer(0);await nextQuestion();
    if(routeId==='taxi')assert.equal(await waitForQuestionTitle('降りる場所を確認しよう'),'降りる場所を確認しよう');
    if(taxiBackResume){
      await tap('.travelBack');
      assert.equal(await evaluate(`document.querySelectorAll('.travelMap .travelStop').length`),2,'taxi route map must skip Seoul Station');
      assert.equal(await evaluate(`document.querySelector('.travelMap').style.getPropertyValue('--travel-stops')`),'2');
      await tap('.travelEpisodeCard .travelPrimary');
      assert.equal(await waitForQuestionTitle('降りる場所を確認しよう'),'降りる場所を確認しよう');
    }
    await answer(0);await nextQuestion();
    if(routeId==='taxi')assert.equal(await waitForQuestionTitle('運転手にお礼を伝えよう'),'運転手にお礼を伝えよう');
    await answer(0);await nextQuestion();
    const end=await state();
    assert.equal(end.completed,true);assert.equal(end.route,routeId);assert.equal(Object.keys(end.answers).length,6);
    const expected={'all-stop':91250,express:77900,taxi:11000}[routeId];
    assert.equal(end.wallet,expected,`${routeId} wallet balance`);
    assert.ok(end.inventory.includes('airportMap'));assert.ok(end.inventory.includes('transitCard'));assert.ok(end.inventory.includes('myeongdong-first-stamp'));
    await assertFits(`${routeId} ending`);
    return end;
  };

  await send('Page.enable');await send('Runtime.enable');await send('Log.enable');
  await setViewport(390,844);
  await send('Page.navigate',{url:'http://127.0.0.1:4173/?visual-check=travel'});await ready();
  await evaluate(`localStorage.clear();S.lang='ja';S.vocab=[{text:'여행',meanings:{ja:'旅行'},repetitions:3}];S.gameUnlock=17;S.gameAnswers={16:{clear:true}};save();localStorage.setItem('topikQuestTopik1GameV1',JSON.stringify({profiles:{1:{unlock:6}}}));localStorage.setItem('malbitWrongReviewV3',JSON.stringify({items:[{id:'M01-I-L-11'}]}));render()`);

  assert.ok(await evaluate(`!!document.querySelector('#malbitHomeVisualSystem')`),'Home visual system must load after compatibility layers');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertHomeFits(`Home light ${width}px`,'light')}
  await setViewport(390,844);await shot('00ea-home-light-theme.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertHomeFits(`Home dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00e-home-visual-contract.png');
  assert.equal(await evaluate(`document.querySelectorAll('.tqHomeScreen>.t1level button').length`),3,'Home must keep beginner, TOPIK I, and TOPIK II entries');
  await tap('.tqHomeScreen>.t1level button',2,120);
  assert.match(await evaluate(`document.querySelector('.tqHomeScreen>.t1level button.on')?.textContent`),/TOPIK II/);
  await tap('.tqHomeScreen>.t1level button',1,120);
  assert.match(await evaluate(`document.querySelector('.tqHomeScreen>.t1level button.on')?.textContent`),/TOPIK I/);

  await evaluate(`(()=>{localStorage.setItem('malbitBeginnerV1',JSON.stringify({known:['v:ㅏ'],legacyScore:7}));S.lang='ja';S.view='beginner';save();render()})()`);await sleep(220);
  assert.ok(await evaluate(`!!document.querySelector('.bgLaunch')`),'beginner grammar launch card missing');
  assert.equal(await evaluate(`MALBIT_BEGINNER_GRAMMAR_INTERNALS.lessonCount`),64);
  await tap('.bgLaunch',0,180);
  assert.equal(await evaluate(`document.querySelectorAll('.bgChapterCard').length`),9,'grammar catalog must show nine chapters');
  assert.equal(await evaluate(`document.querySelectorAll('.bgLessonRow').length`),5,'sentence chapter must show five lessons');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertBeginnerGrammarFits(`Beginner grammar catalog light ${width}px`,'light')}
  await setViewport(390,844);await shot('00ba-beginner-grammar-catalog-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertBeginnerGrammarFits(`Beginner grammar catalog dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bb-beginner-grammar-catalog-dark.png');

  await evaluate(`malbitGrammarLesson('copula')`);await sleep(120);
  assert.deepEqual(await evaluate(`({variants:document.querySelectorAll('.bgVariant').length,examples:document.querySelectorAll('.bgExample').length,canvas:!!document.querySelector('#malbitGrammarCanvas'),input:!!document.querySelector('#malbitGrammarAnswer')})`),{variants:2,examples:2,canvas:true,input:true},'grammar lesson must show rules, examples, typing, and handwriting');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertBeginnerGrammarFits(`Beginner grammar lesson dark ${width}px`,'dark')}
  await setViewport(390,844);await evaluate(`document.querySelector('.bgDrill').scrollIntoView({block:'start',behavior:'auto'})`);await sleep(80);await shot('00bc-beginner-grammar-drill.png');
  await evaluate(`(()=>{const input=document.querySelector('#malbitGrammarAnswer');input.value='학생예요';malbitGrammarDraft(input.value);malbitGrammarSubmit()})()`);await sleep(80);
  assert.ok(await evaluate(`document.querySelector('.bgFeedback.wrong')?.innerText.includes('학생이에요')`),'wrong form needs a model answer and coaching');
  await evaluate(`(()=>{const input=document.querySelector('#malbitGrammarAnswer');input.value='학생이에요';malbitGrammarDraft(input.value);malbitGrammarSubmit()})()`);await sleep(80);
  assert.ok(await evaluate(`!!document.querySelector('.bgFeedback.correct')`),'correct transformation feedback missing');
  const grammarUnitCount=await evaluate(`document.querySelectorAll('.bgUnitStrip button').length`);
  assert.equal(grammarUnitCount,5,'copula handwriting must cover every Hangul unit');
  for(let unit=0;unit<grammarUnitCount;unit++){
    const wrote=await evaluate(`(()=>{const canvas=document.querySelector('#malbitGrammarCanvas'),r=canvas.getBoundingClientRect(),point=(type,x,y)=>canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:1,pointerType:'touch',clientX:r.left+x,clientY:r.top+y}));point('pointerdown',r.width*.3,r.height*.3);point('pointermove',r.width*.7,r.height*.7);point('pointerup',r.width*.7,r.height*.7);return malbitGrammarWritingDone()})()`);
    assert.equal(wrote,true,`handwriting unit ${unit+1} did not save`);await sleep(60);
  }
  const beginnerProgress=await evaluate(`(()=>{const value=JSON.parse(localStorage.getItem('malbitBeginnerV1'));return{known:value.known,legacyScore:value.legacyScore,completed:value.grammarV1.completed,quiz:value.grammarV1.quizCorrect.copula,writing:value.grammarV1.writingDone.copula}})()`);
  assert.deepEqual(beginnerProgress,{known:['v:ㅏ'],legacyScore:7,completed:['copula'],quiz:true,writing:true},'grammar progress must nest without changing old beginner progress');
  await evaluate(`document.querySelector('.bgWriting').scrollIntoView({block:'start',behavior:'auto'})`);await sleep(80);await shot('00bd-beginner-grammar-handwriting-complete.png');
  await evaluate(`S.view='home';save();render()`);await sleep(180);

  await evaluate(`(()=>{MALBIT_REVIEW.record(1,'read','P01-I-R-09',-1,'random',{choiceOrder:[0,1,2,3]});MALBIT_REVIEW.record(2,'read','P01-II-R-06',-1,'random',{choiceOrder:[0,1,2,3]});S.lang='ja';S.view='review';save();render()})()`);await sleep(300);
  assert.ok(await evaluate(`!!document.querySelector('#malbitReviewVisualSystem')`),'Review visual system must load after compatibility layers');
  assert.equal(await evaluate(`document.querySelectorAll('.tqReviewItem').length`),2,'Review queue must show both seeded TOPIK levels');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertReviewFits(`Review queue light ${width}px`,'light')}
  await setViewport(390,844);await shot('00ja-review-queue-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertReviewFits(`Review queue dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00j-review-queue.png');
  await tap('.tqReviewFilters button',2,120);
  assert.equal(await evaluate(`document.querySelectorAll('.tqReviewItem').length`),1,'TOPIK II filter must narrow the queue');
  assert.equal(await evaluate(`document.querySelector('.tqReviewFilters button.on span')?.textContent`),'TOPIK II');
  assert.equal(await evaluate(`document.querySelector('.tqReviewFilters button.on b')?.textContent`),'1');
  await tap('.tqReviewFilters button',0,120);
  await evaluate(`openReviewRetry('2:read:P01-II-R-06')`);await sleep(180);
  assert.equal(await evaluate(`document.querySelectorAll('#tqReviewTranslation .tqReviewQuestion').length`),0,'Review translation stays closed until requested');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertReviewFits(`Review retry dark ${width}px`,'dark',true)}
  await setViewport(390,844);await shot('00k-review-retry.png');
  await tap('.tqTranslationToggle',0,120);
  for(let wait=0;wait<100&&!await evaluate(`!!document.querySelector('#tqReviewTranslation .tqReviewQuestion')`);wait++)await sleep(100);
  assert.ok(await evaluate(`document.querySelector('#tqReviewTranslation .tqReviewQuestion')?.innerText.length>20`),'Review must reveal a complete Japanese translation on request');
  const reviewAnswer=await evaluate(`MALBIT_BANK.present('P01-II-R-06',[0,1,2,3]).answerIndex`);
  await tap('.tqReviewChoices .choice',reviewAnswer,100);await tap('.tqReviewChoices .choice',reviewAnswer,350);
  for(let wait=0;wait<100&&!await evaluate(`!!document.querySelector('.tqReviewDeep .tqReviewChoiceAnalysis')`);wait++)await sleep(100);
  const reviewCoach=await evaluate(`document.querySelector('.tqReviewDeep')?.innerText`);
  assert.match(reviewCoach,/【正解の根拠】[\s\S]*【ひっかけ分析】[\s\S]*【タイプ別の解き方】/);
  assert.match(reviewCoach,/選択肢ごとの消去/);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertReviewFits(`Review graded coaching dark ${width}px`,'dark',true)}
  await setViewport(390,844);await evaluate(`document.querySelector('.tqReviewDeep').scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);await shot('00l-review-coaching.png');
  assert.deepEqual(await evaluate(`(()=>{const item=MALBIT_REVIEW.items()['2:read:P01-II-R-06'];return{active:item.active,retryCount:item.retryCount,wrongCount:item.wrongCount}})()`),{active:false,retryCount:1,wrongCount:1},'correct Review retry must resolve exactly one saved item');
  await tap('.tqReviewRetrySheet>.closeBtn',0,180);
  assert.equal(await evaluate(`document.querySelectorAll('.tqReviewItem').length`),1,'resolved item must leave the active queue after re-entry');
  assert.equal(await evaluate(`document.body.classList.contains('tq-review-active')`),true,'Review visual contract must survive sheet close and re-entry');
  await evaluate(`S.view='home';save();render()`);await sleep(180);

  await evaluate(`(()=>{S.lang='ja';save();localStorage.setItem('topikQuestExamLevel','1');t1OpenGameMap(1)})()`);
  for(let wait=0;wait<60;wait++){if(await evaluate(`!!document.querySelector('.tqGameHub')`))break;await sleep(50)}
  assert.ok(await evaluate(`!!document.querySelector('#malbitGameVisualSystem')`),'Game visual system must load after compatibility layers');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertGameFits(`Game hub light ${width}px`,'.tqGameHub','light')}
  await setViewport(390,844);await shot('00ca-game-hub-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertGameFits(`Game hub dark ${width}px`,'.tqGameHub','dark')}
  await setViewport(390,844);await shot('00c-game-hub-visual-contract.png');
  await evaluate(`t1StartGameStage(1)`);
  for(let wait=0;wait<60;wait++){if(await evaluate(`!!document.querySelector('.t1TrailScreen')`))break;await sleep(50)}
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertGameFits(`Game trail dark ${width}px`,'.t1TrailScreen','dark')}
  await setViewport(390,844);await shot('00d-game-trail-visual-contract.png');
  await evaluate(`S.view='home';save();render()`);await sleep(300);
  const durableBefore=await evaluate(`({vocab:JSON.parse(localStorage.getItem('topikQuestV8')).vocab,gameUnlock:JSON.parse(localStorage.getItem('topikQuestV8')).gameUnlock,game:localStorage.getItem('topikQuestTopik1GameV1'),review:localStorage.getItem('malbitWrongReviewV3')})`);

  await evaluate(`(()=>{S.lang='ja';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('malbitProductPrefsV1',JSON.stringify({listeningMode:'off'}));tqStartMode('random')})()`);await sleep(300);
  assert.ok(await evaluate(`!!document.querySelector('#malbitRandomPracticeVisualSystem')`),'Random Practice visual system must load after compatibility layers');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK I unanswered Random Practice light ${width}px`,'light')}
  await setViewport(390,844);await shot('00ga-random-practice-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK I unanswered Random Practice dark ${width}px`,'dark')}
  const topik1Answer=await evaluate(`(()=>{const session=JSON.parse(localStorage.getItem('topikQuestTopik1Session'));const id=session.ids[session.i];return MALBIT_BANK.present(id,session.choiceOrders[id]).answerIndex})()`);
  await tap('.choice',topik1Answer,100);await tap('.choice',topik1Answer,250);
  assert.equal(await evaluate(`document.querySelectorAll('.t1TutorCoach>div').length`),3,'TOPIK I feedback must keep evidence, selected-choice analysis, and a solving tip');
  assert.match(await evaluate(`document.querySelector('.t1TutorCoach')?.innerText`),/正解の根拠[\s\S]*選んだ選択肢の分析[\s\S]*解き方のコツ/);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK I graded Random Practice dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00g-random-practice-topik1-coaching.png');

  await evaluate(`(()=>{S.lang='ja';S.view='infinity';S.infinity={active:true,examLevel:2,count:0,graded:0,correct:0,writing:0,totalSec:0,targetSec:0,last:null,feedback:null,seenIds:[],current:{type:'read',id:956,bankId:'P01-II-R-06',choiceOrder:[0,1,2,3]}};save();render()})()`);await sleep(300);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK II unanswered Random Practice dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00h-random-practice-unanswered.png');
  const topik2Answer=await evaluate(`MALBIT_BANK.present('P01-II-R-06',[0,1,2,3]).answerIndex`);
  await tap('.choice',topik2Answer,100);await tap('.choice',topik2Answer,350);
  assert.ok(await evaluate(`!!document.querySelector('.malbitQuestionTranslation')`),'TOPIK II graded feedback must keep the full-question translation');
  await tap('.malbitExplanationToggle',0,180);
  const randomCoach=await evaluate(`document.querySelector('.malbitRandomExplanation')?.innerText`);
  assert.match(randomCoach,/【正解の根拠】[\s\S]*【ひっかけ分析】[\s\S]*【タイプ別の解き方】/);
  assert.match(randomCoach,/慣用句全体/);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK II graded Random Practice dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00i-random-practice-topik2-coaching.png');
  await evaluate(`S.infinity=null;S.view='home';save();render()`);await sleep(300);

  const curatedIndex=await evaluate(`window.MALBIT_SHORTS_DECKS[2].findIndex(item=>item.term==='갈피를 못 잡다')`);
  assert.ok(curatedIndex>=0,'new TOPIK II idiom must be in the curated Shorts deck');
  const curatedAnswer=await evaluate(`window.MALBIT_SHORTS_DECKS[2][${curatedIndex}].meaning.ja`);
  await openStoredShorts(curatedIndex);
  assert.ok(await evaluate(`!!document.querySelector('#malbitShortsVisualSystem')`),'Shorts visual system must load after compatibility layers');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`unanswered Shorts light ${width}px`,'light')}
  await setViewport(390,844);await shot('00fa-shorts-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`unanswered Shorts dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00f-shorts-visual-contract-unanswered.png');
  await submitShortsLabel(curatedAnswer);
  assert.match(await evaluate(`document.querySelector('.shortsFeedback small')?.innerText`),/【意味】[\s\S]*【文脈】[\s\S]*【覚え方】/);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`curated Shorts dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00a-shorts-idiom-coaching.png');

  const curatedLength=await evaluate(`window.MALBIT_SHORTS_DECKS[2].length`);
  const bankShortsIndex=await evaluate(`window.MALBIT_SHORTS_DECKS[2].length+window.MALBIT_BANK.shorts(2).findIndex(item=>item.bankId==='P01-II-R-06')`);
  const bankShortsAnswer=await evaluate(`(()=>{const item=window.MALBIT_BANK.shorts(2).find(entry=>entry.bankId==='P01-II-R-06');return item.choices[item.answerIndex]})()`);
  assert.ok(bankShortsIndex>=curatedLength,'new TOPIK II practice item must enter Shorts');
  await openStoredShorts(bankShortsIndex);await submitShortsLabel(bankShortsAnswer);
  const bankCoach=await evaluate(`document.querySelector('.shortsFeedback small')?.innerText`);
  assert.match(bankCoach,/【正解の根拠】[\s\S]*【ひっかけ分析】[\s\S]*【タイプ別の解き方】/);
  assert.match(bankCoach,/慣用句全体/);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`bank Shorts dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00b-shorts-type-coaching.png');

  await evaluate(`S.view='home';save();render()`);await sleep(1000);await shot('01-game-entry.png');
  await startFresh(true);
  assert.equal(await evaluate(`document.querySelector('.travelLang')?.textContent.trim()`),'🇯🇵','Travel Mode language control must remain a flag');
  await setViewport(375,667);
  const firstViewport=await evaluate(`(()=>{const first=document.querySelector('.travelAnswer').getBoundingClientRect();return{top:Math.round(first.top),bottom:Math.round(first.bottom),height:innerHeight,overflow:document.documentElement.scrollWidth-innerWidth}})()`);
  assert.ok(firstViewport.top<firstViewport.height-12,`first answer begins below the first mobile viewport: ${JSON.stringify(firstViewport)}`);
  assert.ok(firstViewport.overflow<=1,'small phone has horizontal overflow');
  const answerCopy=await evaluate(`(()=>{const el=document.querySelector('.travelAnswerCopy'),r=el.getBoundingClientRect(),s=getComputedStyle(el);return{width:Math.round(r.width),height:Math.round(r.height),background:s.backgroundColor,text:el.innerText}})()`);
  assert.ok(answerCopy.width>200&&answerCopy.height<48,`answer text must remain a readable row: ${JSON.stringify(answerCopy)}`);
  assert.match(answerCopy.background,/rgba\(0, 0, 0, 0\)|transparent/,'answer text must not inherit the number badge background');
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswerCopy small').length`),0,'answer translations must stay hidden before submission');
  await shot('02-first-question-375x667.png');
  await setViewport(390,844);await assertFits('first question');
  const beforeWrong=(await state()).clockMinutes;
  const wrong=await answer(1);
  assert.equal(wrong.answers['q-hello'].correct,false);assert.equal(wrong.clockMinutes-beforeWrong,4);assert.ok(!wrong.inventory.includes('airportMap'));
  assert.equal(await evaluate(`[...document.querySelectorAll('.travelAnswer')].filter(el=>getComputedStyle(el).display!=='none').length`),2,'wrong result should keep only the chosen and correct actions');
  assert.equal(await evaluate(`document.querySelector('.travelFeedback')?.classList.contains('bad')`),true);
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswerCopy small').length`),2,'only the chosen and correct translations may appear after a wrong answer');
  assert.equal(await evaluate(`document.querySelectorAll('.travelTutor>div').length`),3,'Travel feedback must teach evidence, distractor contrast, and a solving tip');
  assert.equal(await evaluate(`!!document.querySelector('.travelListen p')`),false,'answering must not force the transcript open');
  await shot('03-wrong-recovery.png');

  await startFresh();
  const correct=await answer(0);assert.equal(correct.answers['q-hello'].correct,true);assert.ok(correct.inventory.includes('airportMap'));
  assert.equal(await evaluate(`[...document.querySelectorAll('.travelAnswer')].filter(el=>getComputedStyle(el).display!=='none').length`),1,'correct result should collapse distractors');
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswerCopy small').length`),1,'only the correct translation may appear after a correct answer');
  assert.match(await evaluate(`document.querySelector('.travelFeedback b')?.textContent`),/2,000旅ウォン/);
  await shot('04-correct-reward.png');
  await nextQuestion();
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswers.hotspot img').length`),4);
  assert.equal(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`),'空港鉄道の標識を探せ');
  await assertFits('airport rail sign question');
  await evaluate(`window.__travelAudio={played:0,cancelled:0};window.MALBIT_TTS={play:()=>window.__travelAudio.played++,cancel:()=>window.__travelAudio.cancelled++}`);
  await tap('.travelListen>button:first-child');assert.equal(await evaluate(`window.__travelAudio.played`),1);
  await shot('04a-airport-rail-question.png');
  await answer(0);
  assert.match(await evaluate(`document.querySelector('.travelTutor')?.textContent`),/空港鉄道/);
  await shot('04b-airport-rail-coaching.png');
  await nextQuestion();assert.ok(await evaluate(`window.__travelAudio.cancelled`)>=1,'audio must stop when the scene changes');
  assert.equal(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`),'キオスクで明洞を探そう');
  assert.match(await evaluate(`document.querySelector('.travelContext')?.textContent`),/直通切符の券売機ではありません/);
  await assertFits('destination kiosk question');
  await shot('04c-destination-kiosk.png');
  await answer(0);
  assert.match(await evaluate(`document.querySelector('.travelTutor')?.textContent`),/最終目的地/);
  assert.match(await evaluate(`document.querySelector('.travelTutor')?.textContent`),/서울역/);
  await shot('04d-destination-coaching.png');

  await runRoute(0,'all-stop');
  await runRoute(1,'express',{reloadAtTransfer:true});
  await runRoute(2,'taxi',{taxiBackResume:true});
  await shot('08-myeongdong-arrival.png');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertFits(`ending ${width}px`)}
  await setViewport(390,844);
  await evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1'));store.episodes['route-001-airport-myeongdong'].clockMinutes=600;localStorage.setItem('malbitStoryV1',JSON.stringify(store));render()})()`);
  await tap('.travelEndingCard .travelSecondary');
  assert.match(await evaluate(`document.querySelector('.travelEpisodeCard .travelPrimary')?.textContent`),/明洞の次のクエストへ/);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertFits(`completed route CTA ${width}px`)}
  await setViewport(390,844);await shot('08a-completed-route-cta.png');
  await tap('.travelEpisodeCard .travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelMyeongdongHead h1')?.textContent`),/明洞トラベルハブ/);
  assert.equal(await evaluate(`document.querySelectorAll('.travelMyeongdongWorld .travelWorldBg,.travelMyeongdongWorld .travelWorldPlayer,.travelMyeongdongWorld .travelWorldNpc,.travelMyeongdongWorld .prop-myeongdongexchange').length`),4,'Myeongdong world must compose background, player, NPC, and exchange prop layers');
  assert.equal(await evaluate(`document.querySelectorAll('.travelExchangeCard').length`),4);
  assert.equal(await evaluate(`document.querySelectorAll('.travelExchangeCard img[src*="item-"]').length`),4,'exchange must use generated collectible art');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertFits(`Myeongdong hub ${width}px`)}
  await setViewport(390,844);await shot('09-myeongdong-hub-day.png');
  await tap('.travelEventCard .travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelQuestionNo span')?.textContent`),/NPC TALK/);
  for(let turn=1;turn<5;turn++){await tap('.travelMyeongdongCard>.travelPrimary');assert.match(await evaluate(`document.querySelector('.travelQuestionNo span')?.textContent`),new RegExp(`NPC TALK · ${turn+1}/5`))}
  await tap('.travelMyeongdongCard>.travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelQuestionNo span')?.textContent`),/FREE COMPOSE/);
  for(const token of ['저','는','일본','에서','왔어요.'])await tapText('.travelWordBank button',token);
  const beforeCreative=(await state()).wallet;
  await tap('.travelOrderActions .travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelCompositionPreview b')?.textContent`),/저는 일본에서 왔어요\./);
  assert.match(await evaluate(`document.querySelector('.travelCompositionFeedback b')?.textContent`),/300旅ウォン/);
  assert.equal((await state()).wallet-beforeCreative,300,'a meaningful non-canonical sentence earns a small one-time reward');
  assert.notEqual((await state()).myeongdong.quests['guide-directions'].completed,true,'partial reward must not silently mark the main quest complete');
  await tap('.travelOrderActions .travelTextButton');
  for(const token of ['명동','관광안내소','가','어디','에','있어요?'])await tapText('.travelWordBank button',token);
  assert.equal(await evaluate(`document.querySelector('.travelCompositionPreview b')?.textContent`),'명동 관광안내소가 어디에 있어요?');
  await tap('.travelOrderActions .travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelQuestionNo span')?.textContent`),/NPC QUEST CLEAR/);
  const hubQuest=await state();assert.equal(hubQuest.myeongdong.quests['guide-directions'].completed,true);assert.ok(hubQuest.inventory.includes('hangulStampPostcard'));
  await shot('10-word-order-clear.png');
  await tap('.travelHubResult .travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelEventCard h2')?.textContent`),/明洞駅の標識を完成させよう/);
  assert.equal(await evaluate(`document.querySelectorAll('.travelExchangeCard')[2].disabled`),true,'sign collectible stays locked before the sign mission');
  await tap('.travelEventCard .travelPrimary');
  await tap('.travelMyeongdongCard>.travelPrimary');
  await tap('.travelMyeongdongCard>.travelPrimary');
  await tap('.travelMyeongdongCard>.travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelQuestionNo span')?.textContent`),/SIGN BUILD/);
  assert.equal(await evaluate(`document.querySelectorAll('.travelWordBank button').length`),5,'sign challenge must offer three answers plus two decoys');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertFits(`Myeongdong sign build ${width}px`)}
  await setViewport(390,844);await shot('11-sign-build.png');
  await tap('.travelWordBank button',2);
  await tap('.travelWordBank button',0);
  await tap('.travelWordBank button',1);
  assert.deepEqual(await evaluate(`[...document.querySelectorAll('.travelSentence button')].map(button=>button.textContent.trim())`),['명','동','역']);
  assert.equal(await evaluate(`document.querySelectorAll('.travelWordBank button').length`),2,'decoy syllables must remain unused');
  await tap('.travelOrderActions .travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelQuestionNo span')?.textContent`),/SIGN QUEST CLEAR/);
  const signQuest=await state();assert.equal(signQuest.myeongdong.quests['myeongdong-station-sign'].completed,true);assert.ok(signQuest.inventory.includes('myeongdongExitBadge'));
  assert.match(await evaluate(`document.querySelector('.travelWorldSign')?.textContent`),/명동역/);
  await shot('12-sign-clear.png');
  await tap('.travelHubResult .travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelEventCard h2')?.textContent`),/旅ウォンでホットクを注文しよう/);
  await tap('.travelEventCard .travelPrimary');
  for(let turn=0;turn<5;turn++)await tap('.travelMyeongdongCard>.travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelQuestionNo span')?.textContent`),/PRICE READING/);
  assert.equal(await evaluate(`document.querySelectorAll('.travelMenuBoard [role="row"]').length`),3,'price board needs three Korean menu rows');
  assert.deepEqual(await evaluate(`[...document.querySelectorAll('.travelMenuBoard [role="row"]')].map(row=>row.textContent.trim())`),['호떡2,000旅ウォン','계란빵2,000旅ウォン','떡볶이4,000旅ウォン']);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertFits(`Myeongdong price budget ${width}px`)}
  await setViewport(390,844);await shot('13-menu-budget.png');
  const beforeSnack=(await state()).wallet;
  assert.equal((await evaluate(`malbitTravelMetrics()`)).priceQuestStarts,1);
  await tap('.travelBudgetActions .travelPrimary');
  assert.match(await evaluate(`document.querySelector('.travelFeedback.bad')?.textContent`),/もう1個/);
  assert.equal((await evaluate(`malbitTravelMetrics()`)).priceQuestWrongSubmissions,1);
  await tap('.travelQuantityPicker button',1);
  assert.match(await evaluate(`document.querySelector('.travelQuantityPicker output')?.textContent`),/4,000/);
  await tap('.travelBudgetActions .travelPrimary');
  const afterSnack=await state();
  assert.equal(beforeSnack-afterSnack.wallet,4000);
  assert.equal(afterSnack.myeongdong.quests['myeongdong-menu-budget'].quantity,2);
  assert.equal(afterSnack.spent.at(-1).kind,'street-food');
  assert.equal(afterSnack.spent.at(-1).currency,'travel-won');
  const priceMetrics=await evaluate(`malbitTravelMetrics()`);
  assert.equal(priceMetrics.priceQuestCompletions,1);
  assert.equal(priceMetrics.priceQuestCompletionRate,100);
  assert.equal(priceMetrics.priceQuestAverageWallet,afterSnack.wallet);
  assert.match(await evaluate(`document.querySelector('.travelQuestionNo span')?.textContent`),/MENU READING CLEAR/);
  await shot('14-menu-budget-clear.png');
  await tap('.travelHubResult .travelPrimary');
  const beforeCharm=(await state()).wallet;
  await tap('.travelExchangeCard',3);
  const afterCharm=await state();assert.equal(beforeCharm-afterCharm.wallet,5000);assert.ok(afterCharm.inventory.includes('namsanCharm'));
  assert.match(await evaluate(`document.querySelector('.travelPurchaseBurst')?.textContent`),/南山夜景チャーム/);
  await shot('15-collectible-exchange.png');
  await evaluate(`(()=>{const store=JSON.parse(localStorage.getItem('malbitStoryV1'));store.episodes['route-001-airport-myeongdong'].clockMinutes=1140;store.episodes['route-001-airport-myeongdong'].myeongdong.lastPurchase=null;localStorage.setItem('malbitStoryV1',JSON.stringify(store));render()})()`);
  assert.match(await evaluate(`document.querySelector('.travelEventCard h2')?.textContent`),/屋台で注文しよう/);
  assert.match(await evaluate(`document.querySelector('.travelWorldNpc')?.getAttribute('src')`),/npc-myeongdong-vendor\.webp/);
  assert.equal(await evaluate(`document.querySelectorAll('.travelExchangeCard')[1].disabled`),false,'evening must unlock the hotteok memory exchange');
  await tap('.travelExchangeCard',1);
  assert.ok((await state()).inventory.includes('hotteokMemory'));
  await shot('16-myeongdong-hub-evening.png');
  await send('Page.reload',{ignoreCache:true});await ready();await sleep(160);
  assert.equal((await state()).completed,true);assert.equal((await state()).route,'taxi');
  assert.ok(await evaluate(`document.body.innerText.includes('明洞トラベルハブ')`),'Myeongdong hub state must survive reload');
  assert.ok((await state()).inventory.includes('namsanCharm'),'hub collectibles must survive reload');

  const durableAfter=await evaluate(`({vocab:JSON.parse(localStorage.getItem('topikQuestV8')).vocab,gameUnlock:JSON.parse(localStorage.getItem('topikQuestV8')).gameUnlock,game:localStorage.getItem('topikQuestTopik1GameV1'),review:localStorage.getItem('malbitWrongReviewV3')})`);
  assert.deepEqual(durableAfter,durableBefore,'travel play must not alter vocabulary, game, or review records');
  assert.deepEqual(errors,[]);
  const screenshotCount=fs.readdirSync(out).filter(file=>file.endsWith('.png')).length;
  console.log(`mobile QA: 320/375/390/430px Home + Beginner Grammar + Game + Shorts + Random Practice + Review visual contracts, 9-chapter/64-lesson grammar catalog, transformation coaching, per-unit handwriting and preserved progress, Review queue/filter/retry/translation/type coaching/re-entry, TOPIK I/II random question/answer/type coaching, level re-entry, Shorts question/answer/instructor feedback + hit-tested Travel route + one-tap completed-route re-entry + NPC word order + Hangul sign build with decoys, day/evening events, travel-won exchange, reload/back-resume, durable records, screenshots=${screenshotCount}, errors=0`);
}finally{
  try{socket?.close()}catch(error){}
  chrome?.kill('SIGTERM');server.kill('SIGTERM');
}
