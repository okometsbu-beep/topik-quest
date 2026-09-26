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
  const target=await json('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'});
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
  const waitForSelector=async selector=>{
    for(let i=0;i<100;i++){if(await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});return!!el&&(${JSON.stringify(selector)}!=='.shortsFeedbackSummary'||el.innerText.trim().length>0)})()`))return;await sleep(100)}
    throw new Error(`Timed out waiting for selector: ${selector}`);
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
  const assertTravelTopSafe=async label=>{
    const fit=await evaluate(`(()=>{const screen=document.querySelector('.travelScreen'),rpg=document.querySelector('.travelRpgScreen'),top=document.querySelector('.travelRpgTopHud'),back=document.querySelector('.travelRpgBack'),hub=document.querySelector('.travelHubHead');const rect=el=>el?(()=>{const r=el.getBoundingClientRect();return{top:r.top,bottom:r.bottom,left:r.left,right:r.right}})():null;return{scrollY,innerWidth,innerHeight,screen:rect(screen),rpg:rect(rpg),top:rect(top),back:rect(back),hub:rect(hub),bodyOverflow:getComputedStyle(document.body).overflowY}})()`);
    assert.ok(fit.scrollY<=1,`${label}: retained page scroll ${fit.scrollY}`);
    for(const [name,rect] of Object.entries({screen:fit.screen,rpg:fit.rpg,top:fit.top,back:fit.back,hub:fit.hub})){
      if(!rect)continue;
      assert.ok(rect.top>=-1,`${label}: ${name} clipped above viewport at ${rect.top}`);
      assert.ok(rect.left>=-1&&rect.right<=fit.innerWidth+1,`${label}: ${name} leaves viewport horizontally`);
    }
    if(fit.rpg)assert.equal(fit.bodyOverflow,'hidden',`${label}: RPG page must own and lock its viewport`);
  };
  const assertWideCameraCoverage=async label=>{
    const fit=await evaluate(`(()=>{const viewport=document.querySelector('.travelRpgViewport'),board=document.querySelector('.travelRpgBoard');if(!viewport||!board)return{missing:true};const vr=viewport.getBoundingClientRect(),br=board.getBoundingClientRect();return{missing:false,innerWidth,viewportClientWidth:viewport.clientWidth,viewport:{left:vr.left,right:vr.right,width:vr.width},board:{left:br.left,right:br.right,width:br.width,styleLeft:board.style.left},gaps:{left:Math.max(0,br.left-vr.left),right:Math.max(0,vr.right-br.right),top:Math.max(0,br.top-vr.top),bottom:Math.max(0,vr.bottom-br.bottom)}}})()`);
    assert.equal(fit.missing,false,`${label}: RPG camera missing`);
    assert.ok(Object.values(fit.gaps).every(gap=>gap<=1),`${label}: camera board leaves an empty viewport edge (${JSON.stringify(fit.gaps)})`);
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
    const fit=await evaluate(`(()=>{const root=document.querySelector('.tqShortsScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('.shortsTop button,.shortsChoice,.shortsAction button,.shortsExplanation summary,.malbitShortTools button,.malbitShortProposal>button')].filter(visible);const surfaces=[...root.querySelectorAll('.shortsCard')].filter(visible);const tiles=[...root.querySelectorAll('.shortsCard,.shortsChoice,.shortsFeedback,.shortsExplanation,.malbitShortProposal')].filter(visible);const copy=[...root.querySelectorAll('.shortsInstruction,.shortsFeedback small,.shortsExplanation summary,.shortsExplanation small,.doubleTapHint,.shortsSwipe,.malbitShortTools button,.malbitShortDaily,.malbitShortProposal small,.malbitShortProposal p')].filter(visible);const channels=color=>(color.match(/[\\d.]+/g)||[]).slice(0,3).map(Number);const card=document.querySelector('.shortsCard');return{missing:false,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,cardOverflow:card?card.scrollWidth-card.clientWidth:0,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<170),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Shorts root missing`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.ok(fit.cardOverflow<=1,`${label}: Shorts card content overflow ${fit.cardOverflow}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Shorts card`);
    await assertThemeSurfaces(label,theme,'.tqShortsScreen','.shortsCard,.shortsChoice,.shortsFeedback,.shortsExplanation,.malbitShortProposal');
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
  const assertWritingFits=async(label,theme,review=false)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector(${review?"'.writingReview'":"'.screen>.card'"});if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{left:Math.round(r.left),right:Math.round(r.right),top:Math.round(r.top),bottom:Math.round(r.bottom),width:Math.round(r.width),height:Math.round(r.height)}};const parts=[...root.querySelectorAll('.writingPart')].filter(visible),inputs=[...root.querySelectorAll('[data-writing-part]')].filter(visible),labels=[...root.querySelectorAll('.writingPart label,.writingPart h4')].filter(visible);return{missing:false,theme:document.documentElement.dataset.theme,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,parts:parts.map(rect),inputs:inputs.map(el=>({key:el.dataset.writingPart,...rect(el)})),labels:labels.map(el=>el.textContent.trim()),small:[...root.querySelectorAll('small')].filter(visible).map(el=>parseFloat(getComputedStyle(el).fontSize)).filter(size=>size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: writing surface missing`);assert.equal(fit.theme,theme,`${label}: expected ${theme} theme`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.equal(fit.parts.length,2,`${label}: writing must keep two visible answer sections`);
    assert.deepEqual(fit.labels.slice(0,2),['㉠（ㄱ）解答','㉡（ㄴ）解答'],`${label}: writing labels must identify both answers`);
    if(!review){
      assert.deepEqual(fit.inputs.map(row=>row.key),['giyeok','nieun'],`${label}: writing inputs must have independent keys`);
      assert.deepEqual(fit.inputs.filter(row=>row.left<-1||row.right>fit.innerWidth+1||row.height<44),[],`${label}: writing input outside viewport or below touch target`);
      assert.ok(fit.inputs[0].bottom<=fit.inputs[1].top,`${label}: writing inputs overlap`);
    }
    assert.deepEqual(fit.small,[],`${label}: writing copy below 10px`);
    await assertThemeSurfaces(label,theme,review?'.writingReview':'.screen>.card','.writingPart');
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
    const fit=await evaluate(`(()=>{const root=document.querySelector('.tqHomeScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const levels=[...root.querySelectorAll(':scope>.t1level button')].filter(visible);const surfaces=[...root.querySelectorAll(':scope>.t1level,.tqTodayLesson,.tqHomeReview,.tqTravelFeature,.tqV9Modes,.tqV9Utility,.tqV9Week')].filter(visible);const tiles=[...root.querySelectorAll('.tqV9Mode,.tqV9Utility button,.tqV9Week')].filter(visible);const copy=[...root.querySelectorAll('.tqV9Greeting small,.tqV9SectionHead span,.tqV9Mode small,.tqV9Utility small,.tqV9Week p,.tqV9Day small')].filter(visible);const channels=color=>(color.match(/[\d.]+/g)||[]).slice(0,3).map(Number);return{missing:false,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,levels:levels.map(el=>({...rect(el),text:el.textContent.trim(),labelVisible:el.matches('.v35BeginnerLevel')?visible(el.querySelector('b')):true})),outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<170),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Home root missing`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: enabled touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Home surface`);
    assert.equal(fit.levels.length,3,`${label}: Home learning-path selector must keep three choices`);
    assert.ok(Math.max(...fit.levels.map(row=>row.width))-Math.min(...fit.levels.map(row=>row.width))<=2,`${label}: learning-path choices must fill equal columns`);
    assert.equal(fit.levels[0].labelVisible,true,`${label}: beginner label must remain visible`);
    await assertThemeSurfaces(label,theme,'.tqHomeScreen',':scope>.t1level,.tqTodayLesson,.tqHomeReview,.tqTravelFeature,.tqV9Mode,.tqV9Utility button,.tqV9Week');
    assert.deepEqual(fit.tinyCopy,[],`${label}: Home copy below 10px`);
    assert.equal(await evaluate(`[...document.querySelectorAll('.tqHomeScreen>.t1level button')].every(el=>parseFloat(getComputedStyle(el).fontSize)>=12)`),true,`${label}: goal labels below 12px`);
  };
  const assertBeginnerGrammarFits=async(label,theme)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector('.bgScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const surfaces=[...root.querySelectorAll(':scope>.bgHero,:scope>.bgMethod,:scope>.bgResume,:scope>.bgChapterIntro,:scope>.bgLessonList,:scope>.bgScope,:scope>.bgLessonHero,:scope>.bgFormula,:scope>.bgRuleCard,:scope>.bgExamples,:scope>.bgTrap,:scope>.bgDrill,:scope>.bgWriting,:scope>.bgLessonFinish,:scope>.bgLessonNav')].filter(visible);const copy=[...root.querySelectorAll('small,em,p,.bgMethod span,.bgVariant code')].filter(visible);return{missing:false,theme:document.documentElement.dataset.theme,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,screenOverflow:root.scrollWidth-root.clientWidth,outside:controls.filter(el=>!el.closest('.bgChapterStrip,.bgUnitStrip')).filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize),text:el.textContent.trim().slice(0,24)})).filter(row=>row.size<9.9)}})()`);
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
  const openStoredShorts=async(index,examLevel=2)=>{
    const lv=Number(examLevel)===1?1:2;
    await evaluate(`(()=>{S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel',${JSON.stringify(String(lv))});localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:2,activeLevel:${lv},levels:{1:{index:${lv===1?Number(index):0},selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null},2:{index:${lv===2?Number(index):0},selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null}},daily:{}}))})()`);
    await send('Page.reload',{ignoreCache:true});await ready();
    for(let wait=0;wait<50;wait++){if(await evaluate(`!!document.querySelector('.shortsCard')`))return;await sleep(50)}
    throw new Error('Stored Shorts card did not render');
  };
  const openExhaustedShortsCycle=async(examLevel=1)=>{
    const lv=Number(examLevel)===1?1:2;
    const seeded=await evaluate(`(()=>{const lv=${lv},deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],identities=deck.map(item=>window.MALBIT_SHORTS_CYCLE.identity(item,lv)),families=[...new Set(identities.map(item=>item.family))],index=deck.findIndex(item=>item.bankId==='M01-I-R-44'),current=identities[index],blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:deck[index].bankId,cardId:current.id,familyId:current.family,recentIds:[current.id],recentFamilies:[current.family],cycleFamilies:families};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel',String(lv));localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:lv,levels:{1:lv===1?active:blank,2:lv===2?active:blank},daily:{}}));return{familyCount:families.length,currentFamily:current.family,currentId:current.id}})()`);
    assert.ok(seeded.familyCount>1,'S03 mobile proof needs more than one semantic family');
    await send('Page.reload',{ignoreCache:true});await ready();
    for(let wait=0;wait<50;wait++){if(await evaluate(`!!document.querySelector('.shortsCard')`))return seeded;await sleep(50)}
    throw new Error('Exhausted Shorts cycle did not render');
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
    // Camera placement clears its temporary transition override on the next frame.
    for(let wait=0;wait<40;wait++){if(await evaluate(`document.querySelector('.travelRpgBoard')?.style.transition!== 'none'`))break;await sleep(20)}
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
    for(let wait=0;wait<40;wait++){if(await evaluate(`!!document.querySelector('.tqTravelFeature img[src*="bg-airport-t1.webp"]')`)){homeReady=true;break}await sleep(50)}
    assert.ok(homeReady,'Travel entry must use generated art instead of emoji');
    let opened=false;
    if(seedMetrics){
      for(let attempt=0;attempt<3&&!opened;attempt++){
        if(await evaluate(`!!document.querySelector('.tqTravelFeature:not([disabled])')`))await tap('.tqTravelFeature');
        for(let wait=0;wait<20;wait++){if(await evaluate(`document.querySelector('.travelHubHead h1')?.textContent==='旅行モード'`)){opened=true;break}await sleep(50)}
      }
    }else{
      await evaluate(`scrollTo({top:42,left:0,behavior:'auto'})`);
      await evaluate(`malbitTravelOpen()`);
      for(let wait=0;wait<40;wait++){if(await evaluate(`document.querySelector('.travelHubHead h1')?.textContent==='旅行モード'`)){opened=true;break}await sleep(50)}
    }
    assert.ok(opened,'Travel entry must open the hub');
    await sleep(80);await assertTravelTopSafe('Travel hub after scrolled Home entry');
    assert.equal(await evaluate(`document.querySelector('.travelHubHead h1')?.textContent`),'旅行モード');
    assert.equal(await evaluate(`document.querySelector('.travelMetrics')?.open`),false,'local metrics must start collapsed');
    assert.equal(await evaluate(`!!(document.querySelector('.travelAvatar')?.compareDocumentPosition(document.querySelector('.travelMetrics'))&Node.DOCUMENT_POSITION_FOLLOWING)`),true,'learner-facing avatar must precede secondary metrics');
    if(seedMetrics){
      const summaryTarget=await tap('.travelMetricsSummary',0,100);
      assert.ok(summaryTarget.height>=43,'local metrics summary must remain a 44px touch target');
      assert.equal(await evaluate(`document.querySelector('.travelMetrics')?.open`),true,'local metrics must expand on demand');
      assert.equal(await evaluate(`document.querySelectorAll('.travelMetric').length`),7);
      assert.deepEqual(await evaluate(`[...document.querySelectorAll('.travelMetric b')].map(node=>node.textContent)`),['5','80%','75%','67%','75%','2','60,000旅ウォン']);
      assert.match(await evaluate(`document.querySelector('.travelMetricFeedback')?.textContent`),/完了率75%・誤答2回・完了後の平均60,000旅ウォン/);
      assert.match(await evaluate(`document.querySelector('.travelMetricFeedback')?.textContent`),/値段×個数、そのあと予算−合計/);
      assert.match(await evaluate(`document.querySelector('.travelMetrics>p')?.textContent`),/この端末内に数値だけを保存し、外部へ送信しません/);
      if(!fs.existsSync(path.join(out,'00bg-a07-metrics-light.png'))){
        for(const theme of ['light','dark']){
          await evaluate(`malbitSetTheme(${JSON.stringify(theme)})`);await sleep(100);await evaluate(`malbitTravelOpen()`);
          let themedMetricsReady=false;
          for(let wait=0;wait<40;wait++){if(await evaluate(`!!document.querySelector('.travelMetricsSummary')`)){themedMetricsReady=true;break}await sleep(50)}
          assert.ok(themedMetricsReady,`A07 ${theme} expanded metrics hub did not render`);
          await evaluate(`document.querySelector('.travelMetrics').open=true`);
          for(const width of [320,375,390,430]){
            await setViewport(width,width===320?700:844);
            const detailsFit=await evaluate(`(()=>{const card=document.querySelector('.travelMetrics'),summary=document.querySelector('.travelMetricsSummary');return{overflow:card.scrollWidth-card.clientWidth,left:card.getBoundingClientRect().left,right:card.getBoundingClientRect().right,summaryHeight:summary.getBoundingClientRect().height,borderImage:getComputedStyle(card).borderImageSource,width:innerWidth}})()`);
            assert.ok(detailsFit.overflow<=1&&detailsFit.left>=-1&&detailsFit.right<=detailsFit.width+1,`A07 ${theme} ${width}px expanded metrics overflow: ${JSON.stringify(detailsFit)}`);
            assert.ok(detailsFit.summaryHeight>=43,`A07 ${theme} ${width}px metrics summary below 44px`);
            assert.equal(detailsFit.borderImage,'none',`A07 ${theme} ${width}px metrics must use the semantic theme surface`);
            await assertFits(`A07 expanded Travel metrics ${theme} ${width}px`);
          }
          await setViewport(390,844);await evaluate(`document.querySelector('.travelMetrics').scrollIntoView({block:'center',behavior:'auto'})`);await sleep(80);
          await shot(`00b${theme==='light'?'g':'h'}-a07-metrics-${theme}.png`);
        }
        await evaluate(`malbitSetTheme('dark')`);await sleep(100);await evaluate(`malbitTravelOpen()`);await sleep(100);await evaluate(`document.querySelector('.travelMetrics').open=true`);await setViewport(390,844);
      }
      const metricFit=await evaluate(`(()=>{const card=document.querySelector('.travelMetrics'),grid=document.querySelector('.travelMetricsGrid'),feedback=document.querySelector('.travelMetricFeedback');return{card:card.scrollWidth-card.clientWidth,grid:grid.scrollWidth-grid.clientWidth,feedback:feedback.scrollWidth-feedback.clientWidth}})()`);
      assert.ok(metricFit.card<=1&&metricFit.grid<=1&&metricFit.feedback<=1,`local metrics overflow: ${JSON.stringify(metricFit)}`);
      await evaluate(`document.querySelector('.travelMetrics').scrollIntoView({block:'start',behavior:'auto'})`);
      await sleep(100);
      await shot('01b-local-metrics.png');
      await evaluate(`scrollTo({top:0,left:0,behavior:'auto'})`);
    }
    if(!seedMetrics){
      assert.match(await evaluate(`document.querySelector('.travelFirstAction')?.innerText||''`),/最初の行動/);
      assert.match(await evaluate(`document.querySelector('.travelFirstAction')?.innerText||''`),/入国ロビーミッション1/);
      assert.match(await evaluate(`document.querySelector('.travelFirstAction')?.innerText||''`),/空港スタッフと道を尋ねる/);
      if(!fs.existsSync(path.join(out,'00be-a07-first-action-light.png'))){
        for(const theme of ['light','dark']){
          await evaluate(`localStorage.removeItem('malbitStoryV1');S.lang='ja';S.view='home';save();render()`);
          await evaluate(`malbitSetTheme(${JSON.stringify(theme)})`);await sleep(100);await evaluate(`malbitTravelOpen()`);
          let themedActionReady=false;
          for(let wait=0;wait<40;wait++){if(await evaluate(`!!document.querySelector('.travelFirstAction')&&!!document.querySelector('.travelMetricsSummary')`)){themedActionReady=true;break}await sleep(50)}
          assert.ok(themedActionReady,`A07 ${theme} first-action hub did not render`);
          for(const width of [320,375,390,430]){
            await setViewport(width,width===320?700:844);
            const actionFit=await evaluate(`(()=>{const card=document.querySelector('.travelEpisodeCard'),brief=document.querySelector('.travelFirstAction'),cta=document.querySelector('.travelEpisodeCard .travelPrimary'),summary=document.querySelector('.travelMetricsSummary');const fit=el=>({overflow:el.scrollWidth-el.clientWidth,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,height:el.getBoundingClientRect().height});return{card:fit(card),brief:fit(brief),cta:fit(cta),summary:fit(summary),width:innerWidth}})()`);
            for(const [name,value] of Object.entries(actionFit))if(name!=='width'){
              assert.ok(value.overflow<=1,`A07 ${theme} ${width}px ${name} overflow: ${JSON.stringify(value)}`);
              assert.ok(value.left>=-1&&value.right<=actionFit.width+1,`A07 ${theme} ${width}px ${name} leaves viewport`);
            }
            assert.ok(actionFit.cta.height>=43&&actionFit.summary.height>=43,`A07 ${theme} ${width}px touch target below 44px`);
            await assertFits(`A07 first Travel action ${theme} ${width}px`);
          }
          await setViewport(390,844);
          await evaluate(`document.querySelector('.travelFirstAction').scrollIntoView({block:'center',behavior:'auto'})`);await sleep(80);
          await shot(`00b${theme==='light'?'e':'f'}-a07-first-action-${theme}.png`);
        }
        await evaluate(`localStorage.removeItem('malbitStoryV1');S.lang='ja';S.view='home';save();render()`);
        await evaluate(`malbitSetTheme('dark')`);await sleep(100);await evaluate(`malbitTravelOpen()`);
        let restoredActionReady=false;
        for(let wait=0;wait<40;wait++){if(await evaluate(`!!document.querySelector('.travelFirstAction')&&!!document.querySelector('.travelMetricsSummary')`)){restoredActionReady=true;break}await sleep(50)}
        assert.ok(restoredActionReady,'A07 fresh Travel hub did not restore after theme evidence');
        await setViewport(390,844);await evaluate(`scrollTo({top:0,left:0,behavior:'auto'})`);
      }
    }
    if(!fs.existsSync(path.join(out,'01a-travel-hub.png'))){
      await assertFits('Travel hub');
      await shot('01a-travel-hub.png');
    }
    await setViewport(1363,936);await evaluate(`malbitSetTheme('light')`);await sleep(100);
    await tapUntilScene('.travelEpisodeCard .travelPrimary','arrival');
    await evaluate(`malbitTravelStart('route-001-airport-myeongdong',false)`);
    let rpgReady=false;
    for(let wait=0;wait<40;wait++){if(await evaluate(`!!document.querySelector('.travelRpgViewport')`)){rpgReady=true;break}await sleep(50)}
    assert.ok(rpgReady,'fresh Travel route must render the RPG viewport after hub theme checks');
    await assertWideCameraCoverage('wide initial Travel RPG light');await shot('00renewal-wide-initial-camera-light.png');
    await evaluate(`malbitSetTheme('dark');malbitTravelBack();malbitTravelStart('route-001-airport-myeongdong',false)`);await sleep(100);
    await assertWideCameraCoverage('wide re-entry Travel RPG dark');await shot('00renewal-wide-reentry-camera-dark.png');
    await setViewport(390,844);
    const keyboardFit=await evaluate(`(()=>{const button=document.querySelector('.travelRpgLang'),menu=document.getElementById('flagMenu'),original=window.malbitTravelInteract;let interactions=0;window.malbitTravelInteract=()=>{interactions+=1};button.focus();const dispatch=(target,key)=>{const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});target.dispatchEvent(event);return event.defaultPrevented};const enterPrevented=dispatch(button,'Enter'),spacePrevented=dispatch(button,' '),buttonInteractions=interactions,focused=document.activeElement===button;button.click();const clickOpened=menu.classList.contains('open');flagMenu();const mapEnterPrevented=dispatch(document,'Enter'),mapEPrevented=dispatch(document,'e'),mapInteractions=interactions-buttonInteractions;window.malbitTravelInteract=original;return{focused,enterPrevented,spacePrevented,buttonInteractions,clickOpened,mapEnterPrevented,mapEPrevented,mapInteractions,menuOpen:menu.classList.contains('open')}})()`);
    assert.deepEqual(keyboardFit,{focused:true,enterPrevented:false,spacePrevented:false,buttonInteractions:0,clickOpened:true,mapEnterPrevented:true,mapEPrevented:true,mapInteractions:2,menuOpen:false},'RPG keyboard router must preserve focused controls while keeping map interaction shortcuts');
    await assertSmoothRpgMotion();
    await evaluate(`scrollTo({top:42,left:0,behavior:'auto'})`);await sleep(80);
    await assertTravelTopSafe('Travel RPG after legacy 42px scroll attempt');
    await setViewport(844,390);await assertTravelTopSafe('Travel RPG after landscape rotation');
    await setViewport(390,500);await assertTravelTopSafe('Travel RPG after keyboard-height viewport');
    await setViewport(390,844);await assertTravelTopSafe('Travel RPG after portrait restore');
    const captureRpgVisuals=!fs.existsSync(path.join(out,'00m-travel-rpg-light.png'));
    if(captureRpgVisuals){
      for(const theme of ['light','dark']){
        await evaluate(`malbitSetTheme('${theme}')`);await setViewport(1363,936);await sleep(120);
        const clipped=await evaluate(`([...document.querySelectorAll('.travelRpgTopHud button,.travelRpgDpad button')].filter(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return !hit||!el.contains(hit)}).map(el=>el.getAttribute('aria-label')||el.textContent))`);
        assert.deepEqual(clipped,[],`wide ${theme}: RPG controls clipped by the reading container`);
        await shot(`00renewal-wide-travel-${theme}.png`);
      }
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

  await send('Page.enable');await send('Runtime.enable');await send('Log.enable');await send('Network.enable');
  await setViewport(390,844);
  await send('Emulation.setLocaleOverride',{locale:'ja-JP'});
  await send('Network.setUserAgentOverride',{userAgent:await evaluate(`navigator.userAgent`),acceptLanguage:'ja-JP,ja;q=0.9,en;q=0.8'});
  await send('Page.navigate',{url:'http://127.0.0.1:4173/?visual-check=travel'});await ready();
  assert.equal(await evaluate(`S.lang`),'ja','a fresh Japanese browser must open in Japanese');
  assert.match(await evaluate(`document.querySelector('.tqV9Greeting h1')?.textContent||''`),/韓国語/,'the first Home heading must be localized before language-menu use');
  assert.match(await evaluate(`document.querySelector('.tqLessonStart')?.textContent||''`),/入門学習を始める/,'the first primary CTA must be localized before language-menu use');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);await assertHomeFits('fresh Japanese browser Home light','light');await shot('00renewal-home-ja-locale-first-visit-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);await assertHomeFits('fresh Japanese browser Home dark','dark');await shot('00renewal-home-ja-locale-first-visit-dark.png');
  await tap('.tqLessonStart',0,120);
  assert.equal(await evaluate(`S.view`),'beginner','fresh Japanese learner must enter the beginner course');
  await tap('.v33BeginnerTabs button',1,100);
  await tap('.v33LetterGrid button',0,100);
  assert.deepEqual(await evaluate(`(()=>{const value=JSON.parse(localStorage.getItem('malbitBeginnerV1'));return{activeTab:value.activeTab,known:value.known}})()`),{activeTab:'consonants',known:['c:ㄱ']},'the first learned consonant and its step must save together');
  await tap('.v33BeginnerTop>button',0,120);
  assert.match(await evaluate(`document.querySelector('.tqLessonStart')?.textContent||''`),/入門学習の続きから/,'the Home CTA must recognize saved beginner progress');
  await send('Page.reload',{ignoreCache:true});await ready();
  await waitForSelector('.tqLessonStart');
  assert.equal(await evaluate(`S.lang`),'ja','the Japanese explanation language must survive beginner re-entry');
  assert.match(await evaluate(`document.querySelector('.tqLessonStart')?.textContent||''`),/入門学習の続きから/,'reload must keep the beginner continuation CTA');
  await tap('.tqLessonStart',0,120);
  assert.equal(await evaluate(`S.view`),'beginner');
  assert.match(await evaluate(`document.querySelector('.v33BeginnerTabs button.on')?.textContent||''`),/子音/,'Continue must restore the interrupted consonant step');
  assert.match(await evaluate(`document.querySelector('.v33BeginnerHero p')?.textContent||''`),/1\/20/,'the learned-letter count must survive re-entry');
  assert.match(await evaluate(`document.querySelector('.v33LetterGrid button.learned')?.textContent||''`),/ㄱ/,'the learned consonant must remain marked');
  for(const theme of ['light','dark']){await evaluate(`malbitSetTheme('${theme}')`);await sleep(80);for(const width of [320,375,390,430]){
    await setViewport(width,width===320?700:844);
    const fit=await evaluate(`(()=>{const root=document.querySelector('.v33BeginnerScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible),small=controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(el=>el.textContent.trim().slice(0,20));return{missing:false,theme:document.documentElement.dataset.theme,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,small,active:root.querySelector('.v33BeginnerTabs button.on')?.textContent.trim(),learned:root.querySelector('.v33LetterGrid button.learned')?.textContent.includes('ㄱ')}})()`);
    assert.equal(fit.missing,false,`Japanese beginner re-entry ${theme} ${width}px: screen missing`);
    assert.equal(fit.theme,theme);assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`Japanese beginner re-entry ${theme} ${width}px: horizontal overflow`);
    assert.deepEqual(fit.small,[],`Japanese beginner re-entry ${theme} ${width}px: touch target below 44px`);
    assert.match(fit.active,/子音/);assert.equal(fit.learned,true);await shot(`00renewal-beginner-ja-reentry-${theme}-${width}.png`)
  }}
  await evaluate(`setView('home')`);await sleep(100);
  await evaluate(`localStorage.clear();S.lang='ja';S.vocab=[{text:'여행',meanings:{ja:'旅行'},repetitions:3}];S.gameUnlock=17;S.gameAnswers={16:{clear:true}};save();localStorage.setItem('topikQuestTopik1GameV1',JSON.stringify({profiles:{1:{unlock:6}}}));localStorage.setItem('malbitWrongReviewV3',JSON.stringify({items:[{id:'M01-I-L-11'}]}));render()`);

  assert.ok(await evaluate(`!!document.querySelector('#malbitHomeVisualSystem')`),'Home visual system must load after compatibility layers');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertHomeFits(`Home light ${width}px`,'light');await shot(`00renewal-home-light-${width}.png`)}
  await setViewport(390,844);await shot('00ea-home-light-theme.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertHomeFits(`Home dark ${width}px`,'dark');await shot(`00renewal-home-dark-${width}.png`)}
  await setViewport(390,844);await shot('00e-home-visual-contract.png');
  assert.equal(await evaluate(`document.querySelectorAll('.tqHomeScreen>.t1level button').length`),3,'Home must keep beginner, TOPIK I, and TOPIK II entries');
  assert.match(await evaluate(`document.querySelector('.tqHomeScreen>.t1level button.on')?.textContent`),/入門/,'a fresh learner must see Beginner as the selected path');
  assert.match(await evaluate(`document.querySelector('.tqTodayLesson h2')?.textContent`),/ハングルから始める韓国語/,'the primary lesson must name the visible beginner destination');
  assert.match(await evaluate(`document.querySelector('.tqLessonStart')?.textContent`),/入門学習を始める/);
  assert.equal(await evaluate(`localStorage.getItem('topikQuestExamLevel')`),null,'selecting beginner by default must not invent an exam level');
  await tap('.tqLessonStart',0,120);
  assert.equal(await evaluate(`S.view`),'beginner','fresh learner CTA must enter the beginner course');
  await evaluate(`setView('home')`);await sleep(100);
  await tap('.tqHomeScreen>.t1level button',2,120);
  assert.match(await evaluate(`document.querySelector('.tqHomeScreen>.t1level button.on')?.textContent`),/TOPIK II/);
  assert.deepEqual(await evaluate(`({level:localStorage.getItem('topikQuestExamLevel'),path:JSON.parse(localStorage.getItem('malbitProductPrefsV1')).learningPath})`),{level:'2',path:'topik2'});
  await tap('.tqHomeScreen>.t1level button',0,120);
  assert.equal(await evaluate(`S.view`),'beginner');
  assert.deepEqual(await evaluate(`({level:localStorage.getItem('topikQuestExamLevel'),path:JSON.parse(localStorage.getItem('malbitProductPrefsV1')).learningPath})`),{level:'2',path:'beginner'},'beginner must not overwrite the learner\'s saved TOPIK level');
  await evaluate(`setView('home')`);await sleep(100);await shot('00eb-home-beginner-path-dark.png');
  await tap('.tqHomeScreen>.t1level button',1,120);
  assert.match(await evaluate(`document.querySelector('.tqHomeScreen>.t1level button.on')?.textContent`),/TOPIK I/);
  await evaluate(`(()=>{const prefs=JSON.parse(localStorage.getItem('malbitProductPrefsV1')||'{}');prefs.listeningMode='off';localStorage.setItem('malbitProductPrefsV1',JSON.stringify(prefs));tqStartMode('random')})()`);await sleep(120);assert.equal(await evaluate(`S.view`),'t1quiz');
  await evaluate(`setView('home')`);await sleep(120);
  assert.match(await evaluate(`document.querySelector('.tqLessonStart')?.textContent`),/続きから学習/,'a matching interrupted TOPIK session must be resumable');
  await tap('.tqLessonStart',0,120);assert.equal(await evaluate(`S.view`),'t1quiz');
  await evaluate(`setView('home');tqSetLevel(2)`);await sleep(120);
  assert.doesNotMatch(await evaluate(`document.querySelector('.tqLessonStart')?.textContent`),/続きから学習/,'a TOPIK I session must not label the TOPIK II destination as resumable');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);await shot('00ec-home-topik2-path-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);

  // Synthetic QA fixtures: never counted as learner evidence.
  await evaluate(`(()=>{const pack=MALBIT_TRAVEL.packs[0];malbitTravelStart(pack.id,false);const key=MALBIT_TRAVEL.storageKey,store=JSON.parse(localStorage.getItem(key)),state=store.episodes[pack.id];state.sceneId='q-ticket';state.route='all-stop';state.answers['q-ticket']={selected:0,correct:true,earned:2000,bankId:'TRAVEL-A4'};localStorage.setItem(key,JSON.stringify(store));malbitTravelPracticeOpen()})()`);await sleep(100);
  for(const theme of ['light','dark']){await evaluate(`malbitSetTheme('${theme}')`);for(const width of [320,375,390,430]){
    await setViewport(width,width===320?700:844);
    const fit=await evaluate(`(()=>{const root=document.querySelector('.travelPractice');return{present:!!root,overflow:document.documentElement.scrollWidth>innerWidth+1,leaked:root?.textContent.includes('교통카드를 찍어요.'),small:[...root.querySelectorAll('button,input')].filter(el=>el.getBoundingClientRect().height<44).length}})()`);
    assert.deepEqual(fit,{present:true,overflow:false,leaked:false,small:0});await shot(`00renewal-recall-${theme}-${width}.png`);
  }}
  await tap('#travel-phrase',0,80);await send('Input.insertText',{text:'교통카드를 찍어요.'});await sleep(100);
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('#travel-phrase');
  assert.equal(await evaluate(`document.querySelector('#travel-phrase').value`),'교통카드를 찍어요.','recall draft survives reload');
  await tap('.travelPractice form button',0,100);assert.match(await evaluate(`document.querySelector('.travelPracticeResult').textContent`),/24時間/);await shot('00renewal-recall-compared-dark.png');
  await tap('.travelPractice .travelTextButton',0,100);assert.equal(await evaluate('S.view'),'travelPlay');
  await evaluate(`setView('home');document.querySelector('.tqExtraPractice').open=true`);await assertHomeFits('Home expanded dark','dark');await shot('00renewal-home-expanded-dark.png');

  await evaluate(`(()=>{S.lang='ja';localStorage.setItem('topikQuestExamLevel','2');beginReal('write')})()`);await sleep(180);
  assert.equal(await evaluate(`S.real?.phase`),'write','writing-only exam must enter the writing section');
  assert.equal(await evaluate(`S.real?.id`),51,'writing-only exam must begin at question 51');
  assert.equal(await evaluate(`document.querySelectorAll('[data-writing-part]').length`),2,'question 51 must render two independent inputs');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertWritingFits(`Writing question 51 light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bu-writing-two-blanks-light.png');
  await tap('[data-writing-part="giyeok"]',0,80);await send('Input.insertText',{text:'수업이 끝난 뒤에 만날까요?'});await sleep(100);
  assert.deepEqual(await evaluate(`JSON.parse(localStorage.getItem('topikQuestV8')).writing['51'].answers`),{giyeok:'수업이 끝난 뒤에 만날까요?',nieun:''},'typing in ㉠ must not write into ㉡');
  await tap('[data-writing-part="nieun"]',0,80);await send('Input.insertText',{text:'네, 도서관 앞에서 기다릴게요.'});await sleep(100);
  const writingSaved=await evaluate(`(()=>{const core=JSON.parse(localStorage.getItem('topikQuestV8')),pair=core.writing['51'];return{schema:pair.schema,answers:pair.answers,counters:[document.querySelector('#count-giyeok')?.textContent,document.querySelector('#count-nieun')?.textContent],score:writingEstimate()}})()`);
  assert.equal(writingSaved.schema,2,'writing pair must save the versioned two-answer schema');
  assert.deepEqual(writingSaved.answers,{giyeok:'수업이 끝난 뒤에 만날까요?',nieun:'네, 도서관 앞에서 기다릴게요.'},'both writing answers must save independently');
  assert.ok(writingSaved.counters.every(value=>/^\d+ · 自動保存$/u.test(value)),'each writing input must own an auto-save counter');
  assert.ok(writingSaved.score>0&&writingSaved.score<=10,'question 51 fields must contribute separately within their 10-point ceiling');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertWritingFits(`Writing question 51 dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bv-writing-two-blanks-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('[data-writing-part="giyeok"]');
  assert.deepEqual(await evaluate(`Object.fromEntries([...document.querySelectorAll('[data-writing-part]')].map(el=>[el.dataset.writingPart,el.value]))`),writingSaved.answers,'both writing inputs must restore after reload');
  await evaluate(`(()=>{rememberWriting(RW[50],'exam');save();S.view='review';render()})()`);await sleep(180);
  await evaluate(`document.querySelector('.writingReview details').open=true`);await sleep(80);
  assert.equal(await evaluate(`document.querySelectorAll('.writingReview .writingPart').length`),2,'Review must show ㉠ and ㉡ separately');
  assert.deepEqual(await evaluate(`[...document.querySelectorAll('.writingReview .writingPart')].map(part=>part.innerText.includes('수업이 끝난 뒤에 만날까요?')||part.innerText.includes('네, 도서관 앞에서 기다릴게요.'))`),[true,true],'Review must keep both saved answers');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await sleep(120);await evaluate(`document.querySelector('.writingReview details').open=true`);await assertWritingFits(`Writing review light ${width}px`,'light',true)}
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await sleep(120);await evaluate(`document.querySelector('.writingReview details').open=true`);await assertWritingFits(`Writing review dark ${width}px`,'dark',true)}
  await setViewport(390,844);await sleep(120);await evaluate(`document.querySelector('.writingReview details').open=true;document.querySelector('.writingReview').scrollIntoView({block:'start',behavior:'auto'})`);await sleep(80);await shot('00bw-writing-two-blanks-review-dark.png');
  await evaluate(`(()=>{S.real={active:true,mode:'write',phase:'write',id:51,mockSet:1,deadline:Date.now()+3000000,audioPlayed:{}};S.writing[51]='이전 통합 답안';S.view='real';save();render()})()`);await sleep(120);
  assert.deepEqual(await evaluate(`({notice:document.querySelector('.writingMigration')?.innerText,answers:Object.fromEntries([...document.querySelectorAll('[data-writing-part]')].map(el=>[el.dataset.writingPart,el.value]))})`),{notice:'以前の一体型答案を㉠に保存しました。2つの欄を確認して分けてください。',answers:{giyeok:'이전 통합 답안',nieun:''}},'an unlabelled legacy answer must stay in ㉠ with a migration notice');
  await evaluate(`S.view='home';save();render()`);await sleep(180);

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

  await evaluate(`malbitGrammarLesson('sentence-order')`);await sleep(120);
  assert.equal(await evaluate(`document.querySelectorAll('.bgExample')[1]?.querySelector('.bgExampleMeaning')?.innerText`),'私は図書館で本を読みます。','the Japanese translation field must contain the full sentence translation');
  assert.match(await evaluate(`document.querySelectorAll('.bgExample')[1]?.querySelector('.bgExampleNote')?.innerText`),/講師メモ[\s\S]*도서관에서[\s\S]*책을[\s\S]*읽어요/,'the word-order explanation must remain in a separate teacher note');
  assert.equal(await evaluate(`document.querySelectorAll('.bgExample')[1]?.querySelectorAll('.bgExampleNote').length`),1,'the example must render exactly one teaching note');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertBeginnerGrammarFits(`A05 grammar translation dark ${width}px`,'dark')}
  await setViewport(390,844);await evaluate(`document.querySelectorAll('.bgExample')[1]?.scrollIntoView({block:'center',behavior:'auto'})`);await sleep(80);await shot('00bc-a05-grammar-translation-dark.png');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertBeginnerGrammarFits(`A05 grammar translation light ${width}px`,'light')}
  await setViewport(390,844);await evaluate(`document.querySelectorAll('.bgExample')[1]?.scrollIntoView({block:'center',behavior:'auto'})`);await sleep(80);await shot('00bd-a05-grammar-translation-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);

  await evaluate(`document.querySelector('#malbitGrammarAnswer').scrollIntoView({block:'center',behavior:'auto'})`);await sleep(80);
  await tap('#malbitGrammarAnswer',0,80);await send('Input.insertText',{text:'저는 한국어'});await sleep(100);
  assert.deepEqual(await evaluate(`(()=>{const value=JSON.parse(localStorage.getItem('malbitBeginnerV1'));return{draft:value.grammarV1.drafts['sentence-order'],lastLesson:value.grammarV1.lastLesson,known:value.known,legacyScore:value.legacyScore}})()`),{draft:'저는 한국어',lastLesson:'sentence-order',known:['v:ㅏ'],legacyScore:7},'unfinished grammar draft must save without replacing older beginner progress');
  await evaluate(`setView('home')`);await sleep(100);
  await send('Page.reload',{ignoreCache:true});await ready();
  await evaluate(`tqSetLearningPath('beginner');setView('beginner')`);await sleep(120);await tap('.bgLaunch',0,120);await tap('.bgResume',0,120);
  assert.equal(await evaluate(`document.querySelector('#malbitGrammarAnswer')?.value`),'저는 한국어','Japanese beginner grammar draft must survive exit, reload, and course re-entry');
  for(const theme of ['light','dark']){await evaluate(`malbitSetTheme('${theme}')`);await sleep(80);for(const width of [320,375,390,430]){
    await setViewport(width,width===320?700:844);await assertBeginnerGrammarFits(`Beginner grammar draft re-entry ${theme} ${width}px`,theme);
    await evaluate(`document.querySelector('#malbitGrammarAnswer').scrollIntoView({block:'center',behavior:'auto'})`);await sleep(60);
    await shot(`00renewal-beginner-grammar-draft-${theme}-${width}.png`)
  }}
  assert.equal(await evaluate(`document.querySelector('#malbitGrammarAnswer')?.value`),'저는 한국어','viewport and theme changes must not clear the restored draft');

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

  await evaluate(`(()=>{S.lang='ko';S.view='review';save();render()})()`);await sleep(300);
  assert.deepEqual(await evaluate(`(()=>{const stats=[...document.querySelectorAll('.tqReviewStats>div')];return{queue:document.querySelectorAll('.tqReviewItem').length,value:stats[2]?.querySelector('b')?.textContent,label:stats[2]?.querySelector('small')?.textContent}})()`),{queue:0,value:'기록 없음',label:'해결률'},'empty Review history must not claim a perfect resolution rate');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertReviewFits(`Empty Review light ${width}px`,'light');await shot(`00iz-empty-review-light-${width}.png`)}
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertReviewFits(`Empty Review dark ${width}px`,'dark');await shot(`00iz-empty-review-dark-${width}.png`)}
  await evaluate(`(()=>{MALBIT_REVIEW.record(1,'read','P01-I-R-09',-1,'random',{choiceOrder:[0,1,2,3]});MALBIT_REVIEW.record(2,'read','P01-II-R-06',-1,'random',{choiceOrder:[0,1,2,3]});S.lang='ja';S.view='review';save();render()})()`);await sleep(300);
  assert.equal(await evaluate(`document.querySelectorAll('.tqReviewStats>div')[2]?.querySelector('b')?.textContent`),'0%','an unresolved Review queue must report its actual resolution rate');
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

  await evaluate(`(()=>{S.lang='ja';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('malbitProductPrefsV1',JSON.stringify({listeningMode:'off'}));tqStartMode('random');const q=JSON.parse(localStorage.getItem('topikQuestTopik1Session'));q.ids=['M11-I-R-37'];q.seenIds=['M11-I-R-37'];q.i=0;q.answers={};q.choiceOrders={'M11-I-R-37':[2,0,3,1]};q.score=0;q.total=0;q.streak=0;q.locked=false;localStorage.setItem('topikQuestTopik1Session',JSON.stringify(q))})()`);
  await send('Page.reload',{ignoreCache:true});await ready();
  for(let wait=0;wait<50&&!await evaluate(`!!document.querySelector('.tqRandomPracticeScreen')`);wait++)await sleep(50);
  assert.equal(await evaluate(`JSON.parse(localStorage.getItem('topikQuestTopik1Session')).ids[0]`),'M11-I-R-37','TOPIK I visual proof must use the reviewed entrance-guidance item');
  assert.ok(await evaluate(`!!document.querySelector('#malbitRandomPracticeVisualSystem')`),'Random Practice visual system must load after compatibility layers');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK I unanswered Random Practice light ${width}px`,'light')}
  await setViewport(390,844);await shot('00ga-random-practice-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK I unanswered Random Practice dark ${width}px`,'dark')}
  const topik1Answer=await evaluate(`(()=>{const session=JSON.parse(localStorage.getItem('topikQuestTopik1Session'));const id=session.ids[session.i];return MALBIT_BANK.present(id,session.choiceOrders[id]).answerIndex})()`);
  await evaluate(`window.__malbitOriginalTranslateCached=window.translateCached;window.translateCached=async(key,value)=>value`);
  await tap('.choice',topik1Answer,100);await tap('.choice',topik1Answer,250);
  assert.equal(await evaluate(`document.querySelectorAll('.t1TutorCoach>div').length`),3,'TOPIK I feedback must keep evidence, selected-choice analysis, and a solving tip');
  const entranceCoach=await evaluate(`document.querySelector('.t1TutorCoach')?.innerText`);
  assert.match(entranceCoach,/正解の根拠[\s\S]*誤答選択肢の分析[\s\S]*解き方のコツ/);
  assert.match(entranceCoach,/오른쪽 출입구를 이용해 주세요[\s\S]*金額・割引[\s\S]*申請・日時[\s\S]*紛失物・連絡先[\s\S]*-아\/어 주세요/,'rendered Japanese coaching must show decisive evidence, three distinct distractor cues, and the reusable ending method');
  assert.equal((entranceCoach.match(/오른쪽 출입구를 이용해 주세요/gu)||[]).length,1,'decisive evidence must not be duplicated across coaching sections');
  const unavailableTranslation=await evaluate(`(()=>{const card=document.querySelector('.malbitQuestionTranslation'),copy=card?.querySelector('p')?.textContent||'';return{status:card?.dataset.translationStatus,copy,hangul:/[\uac00-\ud7a3]/u.test(copy)}})()`);
  assert.deepEqual(unavailableTranslation,{status:'unavailable',copy:'この問題の全文翻訳は現在利用できません。韓国語の原文は上に表示されています。',hangul:false},'a Korean source fallback must be shown as unavailable, never as Japanese translation');
  await evaluate(`document.querySelector('.malbitQuestionTranslation')?.scrollIntoView({block:'center',inline:'center',behavior:'auto'})`);await sleep(100);
  await setViewport(390,844);await shot('00gb-random-practice-translation-unavailable.png');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK I graded Random Practice light ${width}px`,'light')}
  await setViewport(390,844);await shot('00gc-random-practice-topik1-coaching-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK I graded Random Practice dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00g-random-practice-topik1-coaching.png');
  await evaluate(`window.translateCached=window.__malbitOriginalTranslateCached;delete window.__malbitOriginalTranslateCached`);

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
  // The user's reported meeting-preparation item, rendered through the real Random Practice owner.
  for(const [lang,theme] of [['ko','dark'],['ja','light']]){
    await evaluate(`(()=>{S.lang='${lang}';S.view='infinity';S.infinity={active:true,examLevel:2,count:0,graded:0,correct:0,writing:0,totalSec:0,targetSec:0,last:null,feedback:null,seenIds:[],current:{type:'read',id:2,bankId:'M04-II-R-02',choiceOrder:[3,1,0,2]}};save();render();malbitSetTheme('${theme}')})()`);await sleep(200);
    const choice=await evaluate(`MALBIT_BANK.present('M04-II-R-02',[3,1,0,2]).answerIndex`);
    await tap('.choice',choice,100);await tap('.choice',choice,200);await tap('.malbitExplanationToggle',0,100);
    const copy=await evaluate(`document.querySelector('.malbitRandomExplanation')?.innerText`);
    assert.match(copy,/미리/u);assert.match(copy,/뿐더러/u);assert.match(copy,lang==='ko'?/사전 준비|사전 대비/u:/事前準備/u);
    if(lang==='ko')assert.equal(await evaluate(`(()=>{const el=document.querySelector('.malbitQuestionTranslation');return !!el&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'})()`),false,'Korean must not visibly duplicate the original as a translation');
    if(lang==='ja'){
      const translated=await evaluate(`({status:document.querySelector('.malbitQuestionTranslation').dataset.translationStatus,text:document.querySelector('.malbitQuestionTranslation p').innerText})`);
      assert.equal(translated.status,'reviewed');assert.match(translated.text,/会議が長引くことに備えて/u);assert.match(translated.text,/1\. 바람에 — 〜ことが原因で/u);assert.doesNotMatch(translated.text,/風の中/u);
      await evaluate(`document.querySelector('.malbitQuestionTranslation').scrollIntoView({block:'center',behavior:'auto'})`);await shot('00renewal-reported-translation-ja-light.png');
    }
    for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`reported meeting item ${theme} ${width}px`,theme)}
    await setViewport(390,844);await evaluate(`document.querySelector('.malbitRandomExplanation').scrollIntoView({block:'center',behavior:'auto'})`);await shot(`00renewal-reported-grammar-${lang}-${theme}.png`);
  }
  await evaluate(`S.lang='ja';malbitSetTheme('dark')`);

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

  const meetingShortsIndex=await evaluate(`window.MALBIT_SHORTS_DECKS[1].length+window.MALBIT_BANK.shorts(1).findIndex(item=>item.bankId==='M01-I-R-44')`);
  assert.ok(meetingShortsIndex>=await evaluate(`window.MALBIT_SHORTS_DECKS[1].length`),'reviewed meeting/home item must enter TOPIK I Shorts');
  await openStoredShorts(meetingShortsIndex,1);await submitShortsLabel('회의 전에 집에 들렀습니다.');await sleep(250);
  const meetingReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,details:details?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),proposal:!!document.querySelector('.malbitShortProposal'),tools:!!document.querySelector('.malbitShortTools'),exampleTranslation:!!document.querySelector('.malbitExampleTranslation'),nextText:next?.innerText,nextColor:getComputedStyle(next).color}})()`);
  assert.match(meetingReview.summary,/전에[\s\S]*時間順序が逆/u,'selected Japanese feedback must explain the before/after reversal');
  assert.equal(meetingReview.closed,true,'full meeting explanation must start collapsed');
  assert.equal(meetingReview.nextBeforeDetails,true,'Next question must precede the optional full explanation');
  assert.equal(meetingReview.proposal,false,'bank question must not show an unrelated curated vocabulary proposal');
  assert.equal(meetingReview.tools,false,'bank question must not inherit curated word tools from the same numeric index');
  assert.equal(meetingReview.exampleTranslation,false,'bank question must not start an unrelated curated example translation');
  assert.match(meetingReview.nextText,/次の問題/u,'Japanese Next label must remain visible');
  assert.ok(['rgb(255, 255, 255)','rgb(16, 37, 35)'].includes(meetingReview.nextColor),'Next label must use the theme-specific contrasting ink');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`meeting/home Shorts light ${width}px`,'light')}
  await setViewport(390,844);await shot('00ba-shorts-meeting-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【ひっかけ分析】[\s\S]*【タイプ別の解き方】/u,'expanded Japanese review must keep all three teaching stages');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`meeting/home expanded Shorts dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bb-shorts-meeting-full-dark.png');

  const timeAdverb=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-W-TIME-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,0,3,1],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(timeAdverb.id,'S04-I-W-TIME-01','reviewed time-adverb card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const timeBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(timeBefore.term,'벌써');assert.equal(timeBefore.cardId,timeAdverb.id);assert.equal(timeBefore.orderId,timeAdverb.id);
  assert.deepEqual(timeBefore.choiceOrder,[2,0,3,1]);
  assert.deepEqual(timeBefore.labels,['たった今','もう（予想より早く）','もうすぐ','まだ'],'fixed reviewed choices must keep the saved shuffle');
  await submitShortsLabel('まだ');
  const timeReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,detail:details?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(timeReview.summary,/아직[\s\S]*完了していない/u,'selected Japanese feedback must explain the specific 아직 trap');
  assert.match(timeReview.answer,/もう（予想より早く）/u);assert.equal(timeReview.closed,true);
  assert.equal(timeReview.nextBeforeDetails,true,'Next question must precede optional time-adverb coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'宿題をもう全部終えました。','reviewed Japanese example must render locally without a translation wait');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 time adverb light ${width}px`,'light')}
  await setViewport(390,844);await shot('00be-shorts-time-adverb-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 time adverb expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bf-shorts-time-adverb-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const timeRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(timeRestored.cardId,timeAdverb.id,'reviewed card ID must survive reload');
  assert.equal(timeRestored.orderId,timeAdverb.id,'reviewed choice-order ID must survive reload');
  assert.deepEqual(timeRestored.choiceOrder,[2,0,3,1],'saved reviewed choice order must survive reload');
  assert.equal(timeRestored.locked,true,'graded state must survive reload');
  assert.match(timeRestored.summary,/아직[\s\S]*完了していない/u,'selected Japanese feedback must survive reload');
  assert.match(timeRestored.answer,/もう（予想より早く）/u,'reviewed answer must survive reload');

  const locationWord=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-W-PLACE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,0,3,1],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(locationWord.id,'S04-I-W-PLACE-01','reviewed location card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const locationBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(locationBefore.term,'건너편');assert.equal(locationBefore.cardId,locationWord.id);assert.equal(locationBefore.orderId,locationWord.id);
  assert.deepEqual(locationBefore.choiceOrder,[2,0,3,1]);
  assert.deepEqual(locationBefore.labels,['二つの間','道・空間の向こう側','近く・周辺','すぐ隣・横'],'fixed location choices must keep the saved shuffle');
  await submitShortsLabel('すぐ隣・横');
  const locationReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(locationReview.summary,/옆[\s\S]*すぐ隣/u,'selected Japanese feedback must explain the specific beside trap');
  assert.match(locationReview.answer,/道・空間の向こう側/u);assert.equal(locationReview.closed,true);
  assert.equal(locationReview.nextBeforeDetails,true,'Next question must precede optional location coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'銀行は道の向こう側にあります。','reviewed Japanese location example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I location light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bm-shorts-topik1-location-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I location expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bn-shorts-topik1-location-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const locationRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(locationRestored.cardId,locationWord.id,'reviewed location ID must survive reload');
  assert.equal(locationRestored.orderId,locationWord.id,'reviewed location choice-order ID must survive reload');
  assert.deepEqual(locationRestored.choiceOrder,[2,0,3,1],'saved location choice order must survive reload');
  assert.equal(locationRestored.locked,true,'graded location state must survive reload');
  assert.match(locationRestored.summary,/옆[\s\S]*すぐ隣/u,'location selected feedback must survive reload');
  assert.match(locationRestored.answer,/道・空間の向こう側/u,'reviewed location answer must survive reload');

  const connector=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-W-LINK-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[1,3,0,2],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(connector.id,'S04-II-W-LINK-01','reviewed connector card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const connectorBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(connectorBefore.term,'따라서');assert.equal(connectorBefore.cardId,connector.id);assert.equal(connectorBefore.orderId,connector.id);
  assert.deepEqual(connectorBefore.choiceOrder,[1,3,0,2]);
  assert.deepEqual(connectorBefore.labels,['一方で；それに対して','ただし；ただ','したがって；そのため','そのうえ；さらに'],'fixed connector choices must keep the saved shuffle');
  await submitShortsLabel('ただし；ただ');
  const connectorReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,detail:details?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(connectorReview.summary,/다만[\s\S]*制限や条件/u,'selected Japanese feedback must explain the specific 다만 trap');
  assert.match(connectorReview.answer,/したがって；そのため/u);assert.equal(connectorReview.closed,true);
  assert.equal(connectorReview.nextBeforeDetails,true,'Next question must precede optional connector coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'大雨が降りました。したがって、試合は中止になりました。','reviewed Japanese connector example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II connector light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bg-shorts-topik2-connector-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II connector expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bh-shorts-topik2-connector-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const connectorRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(connectorRestored.cardId,connector.id,'reviewed connector ID must survive reload');
  assert.equal(connectorRestored.orderId,connector.id,'reviewed connector choice-order ID must survive reload');
  assert.deepEqual(connectorRestored.choiceOrder,[1,3,0,2],'saved connector choice order must survive reload');
  assert.equal(connectorRestored.locked,true,'graded connector state must survive reload');
  assert.match(connectorRestored.summary,/다만[\s\S]*制限や条件/u,'connector-specific Japanese feedback must survive reload');
  assert.match(connectorRestored.answer,/したがって；そのため/u,'reviewed connector answer must survive reload');

  const causeConcession=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-CAUSE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(causeConcession.id,'S04-II-G-CAUSE-01','reviewed cause-concession card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const causeBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(causeBefore.term,'-(으)ㄴ 탓에');assert.equal(causeBefore.cardId,causeConcession.id);assert.equal(causeBefore.orderId,causeConcession.id);
  assert.deepEqual(causeBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(causeBefore.labels,['事実に反する結果（～のに）','良い結果の原因（～おかげで）','悪い結果の原因（～せいで）','仮定しても結論維持（たとえ～ても）'],'fixed cause-concession choices must keep the saved shuffle');
  await submitShortsLabel('良い結果の原因（～おかげで）');
  const causeReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(causeReview.summary,/덕분에[\s\S]*良い結果/u,'selected Japanese feedback must explain the specific beneficial-cause trap');
  assert.match(causeReview.answer,/悪い結果の原因/u);assert.equal(causeReview.closed,true);
  assert.equal(causeReview.nextBeforeDetails,true,'Next question must precede optional cause-concession coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'準備が足りなかったせいで、発表に失敗しました。','reviewed Japanese cause example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II cause-concession light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bi-shorts-topik2-cause-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II cause-concession expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bj-shorts-topik2-cause-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const causeRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(causeRestored.cardId,causeConcession.id,'reviewed cause-concession ID must survive reload');
  assert.equal(causeRestored.orderId,causeConcession.id,'reviewed cause-concession choice-order ID must survive reload');
  assert.deepEqual(causeRestored.choiceOrder,[2,1,0,3],'saved cause-concession choice order must survive reload');
  assert.equal(causeRestored.locked,true,'graded cause-concession state must survive reload');
  assert.match(causeRestored.summary,/덕분에[\s\S]*良い結果/u,'cause-concession selected feedback must survive reload');
  assert.match(causeRestored.answer,/悪い結果の原因/u,'reviewed cause-concession answer must survive reload');

  const inferenceEvidence=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-INFER-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(inferenceEvidence.id,'S04-II-G-INFER-01','reviewed inference-evidence card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const inferenceBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(inferenceBefore.term,'-나 보다');assert.equal(inferenceBefore.cardId,inferenceEvidence.id);assert.equal(inferenceBefore.orderId,inferenceEvidence.id);
  assert.deepEqual(inferenceBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(inferenceBefore.labels,['事実だと強く確信（～に違いない）','可能性を残す（～かもしれない）','見える手掛かりから推測','自分の意志を理由に後を依頼'],'fixed inference-evidence choices must keep the saved shuffle');
  await submitShortsLabel('可能性を残す（～かもしれない）');
  const inferenceReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(inferenceReview.summary,/ㄹ지도 모르다[\s\S]*可能性/u,'selected Japanese feedback must explain the open-possibility trap');
  assert.match(inferenceReview.answer,/見える手掛かり/u);assert.equal(inferenceReview.closed,true);
  assert.equal(inferenceReview.nextBeforeDetails,true,'Next question must precede optional inference-evidence coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'事務所の明かりが消えているのを見ると、みんな退勤したようです。','reviewed Japanese inference example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II inference-evidence light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bk-shorts-topik2-inference-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II inference-evidence expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bl-shorts-topik2-inference-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const inferenceRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(inferenceRestored.cardId,inferenceEvidence.id,'reviewed inference-evidence ID must survive reload');
  assert.equal(inferenceRestored.orderId,inferenceEvidence.id,'reviewed inference-evidence choice-order ID must survive reload');
  assert.deepEqual(inferenceRestored.choiceOrder,[2,1,0,3],'saved inference-evidence choice order must survive reload');
  assert.equal(inferenceRestored.locked,true,'graded inference-evidence state must survive reload');
  assert.match(inferenceRestored.summary,/ㄹ지도 모르다[\s\S]*可能性/u,'inference-evidence selected feedback must survive reload');
  assert.match(inferenceRestored.answer,/見える手掛かり/u,'reviewed inference-evidence answer must survive reload');

  const reportedSpeech=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-REPORT-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(reportedSpeech.id,'S04-II-G-REPORT-01','reviewed reported-speech card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const reportedBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(reportedBefore.term,'-다고 하다');assert.equal(reportedBefore.cardId,reportedSpeech.id);assert.equal(reportedBefore.orderId,reportedSpeech.id);
  assert.deepEqual(reportedBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(reportedBefore.labels,['命令・依頼の伝達','質問の伝達','発言・事実の伝達','一緒にしようという提案の伝達'],'fixed reported-speech choices must keep the saved shuffle');
  await submitShortsLabel('質問の伝達');
  const reportedReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(reportedReview.summary,/-냐고 하다[\s\S]*尋ねた内容/u,'selected Japanese feedback must explain the reported-question trap');
  assert.match(reportedReview.answer,/発言・事実の伝達/u);assert.equal(reportedReview.closed,true);
  assert.equal(reportedReview.nextBeforeDetails,true,'Next question must precede optional reported-speech coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'ミンスさんは今日忙しいと言いました。','reviewed Japanese reported-speech example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II reported speech light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bo-shorts-topik2-reported-speech-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II reported speech expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bp-shorts-topik2-reported-speech-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const reportedRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(reportedRestored.cardId,reportedSpeech.id,'reviewed reported-speech ID must survive reload');
  assert.equal(reportedRestored.orderId,reportedSpeech.id,'reviewed reported-speech choice-order ID must survive reload');
  assert.deepEqual(reportedRestored.choiceOrder,[2,1,0,3],'saved reported-speech choice order must survive reload');
  assert.equal(reportedRestored.locked,true,'graded reported-speech state must survive reload');
  assert.match(reportedRestored.summary,/-냐고 하다[\s\S]*尋ねた内容/u,'reported-speech selected feedback must survive reload');
  assert.match(reportedRestored.answer,/発言・事実の伝達/u,'reviewed reported-speech answer must survive reload');

  const stateChange=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-STATE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(stateChange.id,'S04-II-G-STATE-01','reviewed state-change card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const stateChangeBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(stateChangeBefore.term,'-게 되다');assert.equal(stateChangeBefore.cardId,stateChange.id);assert.equal(stateChangeBefore.orderId,stateChange.id);
  assert.deepEqual(stateChangeBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(stateChangeBefore.labels,['動作が今進行中（～している）','性質・状態が～く／になる','状況の流れで～することになる','動作後の結果状態が続く'],'fixed state-change choices must keep the saved shuffle');
  await submitShortsLabel('性質・状態が～く／になる');
  const stateChangeReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(stateChangeReview.summary,/-아\/어지다[\s\S]*形容詞/u,'selected Japanese feedback must explain the quality-change trap');
  assert.match(stateChangeReview.answer,/状況の流れ/u);assert.equal(stateChangeReview.closed,true);
  assert.equal(stateChangeReview.nextBeforeDetails,true,'Next question must precede optional state-change coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'会社の事情で、来月から釜山で勤務することになりました。','reviewed Japanese state-change example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II state change light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bs-shorts-topik2-state-change-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II state change expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bt-shorts-topik2-state-change-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const stateChangeRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(stateChangeRestored.cardId,stateChange.id,'reviewed state-change ID must survive reload');
  assert.equal(stateChangeRestored.orderId,stateChange.id,'reviewed state-change choice-order ID must survive reload');
  assert.deepEqual(stateChangeRestored.choiceOrder,[2,1,0,3],'saved state-change choice order must survive reload');
  assert.equal(stateChangeRestored.locked,true,'graded state-change state must survive reload');
  assert.match(stateChangeRestored.summary,/-아\/어지다[\s\S]*形容詞/u,'state-change selected feedback must survive reload');
  assert.match(stateChangeRestored.answer,/状況の流れ/u,'reviewed state-change answer must survive reload');

  const conditionRelation=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-COND-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(conditionRelation.id,'S04-II-G-COND-01','reviewed condition card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const conditionBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(conditionBefore.term,'-거든');assert.equal(conditionBefore.cardId,conditionRelation.id);assert.equal(conditionBefore.orderId,conditionRelation.id);
  assert.deepEqual(conditionBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(conditionBefore.labels,['まだ決まっていない状況を仮定','前の条件を満たしてこそ後が可能','前のことが起きたら後の指示を実行','今の行動を続けると悪い結果になると警告'],'fixed condition choices must keep the saved shuffle');
  await submitShortsLabel('前の条件を満たしてこそ後が可能');
  const conditionReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(conditionReview.summary,/-아\/어야만[\s\S]*必ず満たして/u,'selected Japanese feedback must explain the necessary-condition trap');
  assert.match(conditionReview.answer,/前のことが起きたら後の指示を実行/u);assert.equal(conditionReview.closed,true);
  assert.equal(conditionReview.nextBeforeDetails,true,'Next question must precede optional condition coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'時間ができたら、この書類を確認してください。','reviewed Japanese condition example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II condition light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bz-shorts-topik2-condition-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II condition expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cb-shorts-topik2-condition-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const conditionRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(conditionRestored.cardId,conditionRelation.id,'reviewed condition ID must survive reload');
  assert.equal(conditionRestored.orderId,conditionRelation.id,'reviewed condition choice-order ID must survive reload');
  assert.deepEqual(conditionRestored.choiceOrder,[2,1,0,3],'saved condition choice order must survive reload');
  assert.equal(conditionRestored.locked,true,'graded condition state must survive reload');
  assert.match(conditionRestored.summary,/-아\/어야만[\s\S]*必ず満たして/u,'condition selected feedback must survive reload');
  assert.match(conditionRestored.answer,/前のことが起きたら後の指示を実行/u,'reviewed condition answer must survive reload');

  const completionExperience=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-COMPLETE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(completionExperience.id,'S04-II-G-COMPLETE-01','reviewed completion card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const completionBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(completionBefore.term,'-아/어 버리다');assert.equal(completionBefore.cardId,completionExperience.id);assert.equal(completionBefore.orderId,completionExperience.id);
  assert.deepEqual(completionBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(completionBefore.labels,['過去にした経験','長い過程の末の結果','すっかり完了する','前もってした状態'],'fixed completion choices must keep the saved shuffle');
  await submitShortsLabel('長い過程の末の結果');
  const completionReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(completionReview.summary,/끝에[\s\S]*長い/u,'selected Japanese feedback must explain the long-process-result trap');
  assert.match(completionReview.answer,/すっかり完了する/u);assert.equal(completionReview.closed,true);
  assert.equal(completionReview.nextBeforeDetails,true,'Next question must precede optional completion coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'たまっていた報告書を今日全部書き上げました。','reviewed Japanese completion example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II completion experience light ${width}px`,'light')}
  await setViewport(390,844);await shot('00ce-shorts-topik2-completion-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II completion experience expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cf-shorts-topik2-completion-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const completionRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(completionRestored.cardId,completionExperience.id,'reviewed completion ID must survive reload');
  assert.equal(completionRestored.orderId,completionExperience.id,'reviewed completion choice-order ID must survive reload');
  assert.deepEqual(completionRestored.choiceOrder,[2,1,0,3],'saved completion choice order must survive reload');
  assert.equal(completionRestored.locked,true,'graded completion state must survive reload');
  assert.match(completionRestored.summary,/끝에[\s\S]*長い/u,'completion selected feedback must survive reload');
  assert.match(completionRestored.answer,/すっかり完了する/u,'reviewed completion answer must survive reload');

  const judgmentConstraint=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-JUDGMENT-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(judgmentConstraint.id,'S04-II-G-JUDGMENT-01','reviewed judgment-constraint card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const judgmentBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(judgmentBefore.term,'-(으)ㄹ 수밖에 없다');assert.equal(judgmentBefore.cardId,judgmentConstraint.id);assert.equal(judgmentBefore.orderId,judgmentConstraint.id);
  assert.deepEqual(judgmentBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(judgmentBefore.labels,['～する必要がある','～する価値がある','ほかに方法がなく～するしかない','～する必要がない'],'fixed judgment choices must keep the saved shuffle');
  await submitShortsLabel('～する価値がある');
  const judgmentReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(judgmentReview.summary,/만하다[\s\S]*価値/u,'selected Japanese feedback must explain the worth-evaluation trap');
  assert.match(judgmentReview.answer,/ほかに方法がなく/u);assert.equal(judgmentReview.closed,true);
  assert.equal(judgmentReview.nextBeforeDetails,true,'Next question must precede optional judgment coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'終電がなくなり、タクシーに乗るしかありませんでした。','reviewed Japanese judgment example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II judgment constraint light ${width}px`,'light')}
  await setViewport(390,844);await shot('00ci-shorts-topik2-judgment-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II judgment constraint expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cj-shorts-topik2-judgment-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const judgmentRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(judgmentRestored.cardId,judgmentConstraint.id,'reviewed judgment ID must survive reload');
  assert.equal(judgmentRestored.orderId,judgmentConstraint.id,'reviewed judgment choice-order ID must survive reload');
  assert.deepEqual(judgmentRestored.choiceOrder,[2,1,0,3],'saved judgment choice order must survive reload');
  assert.equal(judgmentRestored.locked,true,'graded judgment state must survive reload');
  assert.match(judgmentRestored.summary,/만하다[\s\S]*価値/u,'judgment selected feedback must survive reload');
  assert.match(judgmentRestored.answer,/ほかに方法がなく/u,'reviewed judgment answer must survive reload');

  const planStage=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-PLAN-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(planStage.id,'S04-II-G-PLAN-01','reviewed plan-stage card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const planBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(planBefore.term,'-(으)ㄹ 생각이다');assert.equal(planBefore.cardId,planStage.id);assert.equal(planBefore.orderId,planStage.id);
  assert.deepEqual(planBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(planBefore.labels,['まだ決めずに考えている段階','話し合い・判断の後ですでに決めたこと','まだ確定していない本人の意向','日程・計画表で決まっている予定'],'fixed plan-stage choices must keep the saved shuffle');
  await submitShortsLabel('話し合い・判断の後ですでに決めたこと');
  const planReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(planReview.summary,/-기로 하다[\s\S]*すでに決めた/u,'selected Japanese feedback must explain the already-decided trap');
  assert.match(planReview.answer,/まだ確定していない本人の意向/u);assert.equal(planReview.closed,true);
  assert.equal(planReview.nextBeforeDetails,true,'Next question must precede optional plan-stage coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'卒業後は韓国で働こうと考えています。','reviewed Japanese plan-stage example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II plan stage light ${width}px`,'light')}
  await setViewport(390,844);await shot('00cm-shorts-topik2-plan-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II plan stage expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cn-shorts-topik2-plan-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const planRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(planRestored.cardId,planStage.id,'reviewed plan-stage ID must survive reload');
  assert.equal(planRestored.orderId,planStage.id,'reviewed plan-stage choice-order ID must survive reload');
  assert.deepEqual(planRestored.choiceOrder,[2,1,0,3],'saved plan-stage choice order must survive reload');
  assert.equal(planRestored.locked,true,'graded plan-stage state must survive reload');
  assert.match(planRestored.summary,/-기로 하다[\s\S]*すでに決めた/u,'plan-stage selected feedback must survive reload');
  assert.match(planRestored.answer,/まだ確定していない本人の意向/u,'reviewed plan-stage answer must survive reload');

  const politeInteraction=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-G-INTERACTION-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(politeInteraction.id,'S04-I-G-INTERACTION-01','reviewed polite-interaction card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const interactionBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(interactionBefore.term,'주세요');assert.equal(interactionBefore.cardId,politeInteraction.id);assert.equal(interactionBefore.orderId,politeInteraction.id);
  assert.deepEqual(interactionBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(interactionBefore.labels,['行動をしないよう丁寧に求める（～しないでください）','相手に行動を丁寧に求める（～してください）','物を求める丁寧な依頼（～をください）','一緒にする行動を提案する（～しましょうか）'],'fixed polite-interaction choices must keep the saved shuffle');
  await submitShortsLabel('相手に行動を丁寧に求める（～してください）');
  const interactionReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(interactionReview.summary,/-\(으\)세요[\s\S]*行動/u,'selected Japanese feedback must explain the action-request trap');
  assert.match(interactionReview.answer,/物を求める丁寧な依頼/u);assert.equal(interactionReview.closed,true);
  assert.equal(interactionReview.nextBeforeDetails,true,'Next question must precede optional polite-interaction coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'水を一本ください。','reviewed Japanese polite-interaction example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I polite interaction light ${width}px`,'light')}
  await setViewport(390,844);await shot('00cs-shorts-topik1-polite-interaction-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I polite interaction expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00ct-shorts-topik1-polite-interaction-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const interactionRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(interactionRestored.cardId,politeInteraction.id,'reviewed polite-interaction ID must survive reload');
  assert.equal(interactionRestored.orderId,politeInteraction.id,'reviewed polite-interaction choice-order ID must survive reload');
  assert.deepEqual(interactionRestored.choiceOrder,[2,1,0,3],'saved polite-interaction choice order must survive reload');
  assert.equal(interactionRestored.locked,true,'graded polite-interaction state must survive reload');
  assert.match(interactionRestored.summary,/-\(으\)세요[\s\S]*行動/u,'polite-interaction selected feedback must survive reload');
  assert.match(interactionRestored.answer,/物を求める丁寧な依頼/u,'reviewed polite-interaction answer must survive reload');

  const timeRelation=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-TIME-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(timeRelation.id,'S04-II-G-TIME-01','reviewed time-relation card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const relationBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(relationBefore.term,'-자마자');assert.equal(relationBefore.cardId,timeRelation.id);assert.equal(relationBefore.orderId,timeRelation.id);
  assert.deepEqual(relationBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(relationBefore.labels,['一つの動作が続く間に別の動作','最初の動作を終えてから次の動作','最初の動作の直後にすぐ続く','最初の動作より前にすること'],'fixed time-relation choices must keep the saved shuffle');
  await submitShortsLabel('最初の動作を終えてから次の動作');
  const relationReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(relationReview.summary,/-고 나서[\s\S]*終えてから/u,'selected Japanese feedback must explain the after-completion trap');
  assert.match(relationReview.answer,/最初の動作の直後/u);assert.equal(relationReview.closed,true);
  assert.equal(relationReview.nextBeforeDetails,true,'Next question must precede optional time-relation coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'家に着くとすぐ手を洗いました。','reviewed Japanese time-relation example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II time relation light ${width}px`,'light')}
  await setViewport(390,844);await shot('00cq-shorts-topik2-time-relation-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II time relation expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cr-shorts-topik2-time-relation-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const relationRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(relationRestored.cardId,timeRelation.id,'reviewed time-relation ID must survive reload');
  assert.equal(relationRestored.orderId,timeRelation.id,'reviewed time-relation choice-order ID must survive reload');
  assert.deepEqual(relationRestored.choiceOrder,[2,1,0,3],'saved time-relation choice order must survive reload');
  assert.equal(relationRestored.locked,true,'graded time-relation state must survive reload');
  assert.match(relationRestored.summary,/-고 나서[\s\S]*終えてから/u,'time-relation selected feedback must survive reload');
  assert.match(relationRestored.answer,/最初の動作の直後/u,'reviewed time-relation answer must survive reload');

  const formalRelation=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-RELATION-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(formalRelation.id,'S04-II-G-RELATION-01','reviewed formal-relation card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const formalBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(formalBefore.term,'-에 따르면');assert.equal(formalBefore.cardId,formalRelation.id);assert.equal(formalBefore.orderId,formalRelation.id);
  assert.deepEqual(formalBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(formalBefore.labels,['手段・経路を通じて得る・行う','基準・条件によって結果が変わる','調査・発表などの情報源','受け身文の動作主・公的な原因'],'fixed formal-relation choices must keep the saved shuffle');
  await submitShortsLabel('基準・条件によって結果が変わる');
  const formalReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(formalReview.summary,/-에 따라\(서\)[\s\S]*基準/u,'selected Japanese feedback must explain the varying-standard trap');
  assert.match(formalReview.answer,/調査・発表などの情報源/u);assert.equal(formalReview.closed,true);
  assert.equal(formalReview.nextBeforeDetails,true,'Next question must precede optional formal-relation coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'気象庁の発表によると、明日は雨です。','reviewed Japanese formal-relation example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II formal relation light ${width}px`,'light')}
  await setViewport(390,844);await shot('00cu-shorts-topik2-formal-relation-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II formal relation expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cv-shorts-topik2-formal-relation-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const formalRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(formalRestored.cardId,formalRelation.id,'reviewed formal-relation ID must survive reload');
  assert.equal(formalRestored.orderId,formalRelation.id,'reviewed formal-relation choice-order ID must survive reload');
  assert.deepEqual(formalRestored.choiceOrder,[2,1,0,3],'saved formal-relation choice order must survive reload');
  assert.equal(formalRestored.locked,true,'graded formal-relation state must survive reload');
  assert.match(formalRestored.summary,/-에 따라\(서\)[\s\S]*基準/u,'formal-relation selected feedback must survive reload');
  assert.match(formalRestored.answer,/調査・発表などの情報源/u,'reviewed formal-relation answer must survive reload');

  const degreeComparison=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-DEGREE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(degreeComparison.id,'S04-II-G-DEGREE-01','reviewed degree-comparison card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const degreeBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(degreeBefore.term,'-에 비해(서)');assert.equal(degreeBefore.cardId,degreeComparison.id);assert.equal(degreeBefore.orderId,degreeComparison.id);
  assert.deepEqual(degreeBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(degreeBefore.labels,['基準となる対象と同じ程度','基準となる対象に劣らない程度','基準となる対象と比べた差','結果から分かる非常に大きな程度'],'fixed degree-comparison choices must keep the saved shuffle');
  await submitShortsLabel('基準となる対象に劣らない程度');
  const degreeReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(degreeReview.summary,/-에 못지않게[\s\S]*劣らない/u,'selected Japanese feedback must explain the no-less-than trap');
  assert.match(degreeReview.answer,/基準となる対象と比べた差/u);assert.equal(degreeReview.closed,true);
  assert.equal(degreeReview.nextBeforeDetails,true,'Next question must precede optional degree-comparison coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'先月に比べて、今月の売上が増えました。','reviewed Japanese degree-comparison example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II degree comparison light ${width}px`,'light')}
  await setViewport(390,844);await shot('00cy-shorts-topik2-degree-comparison-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II degree comparison expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cz-shorts-topik2-degree-comparison-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const degreeRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(degreeRestored.cardId,degreeComparison.id,'reviewed degree-comparison ID must survive reload');
  assert.equal(degreeRestored.orderId,degreeComparison.id,'reviewed degree-comparison choice-order ID must survive reload');
  assert.deepEqual(degreeRestored.choiceOrder,[2,1,0,3],'saved degree-comparison choice order must survive reload');
  assert.equal(degreeRestored.locked,true,'graded degree-comparison state must survive reload');
  assert.match(degreeRestored.summary,/-에 못지않게[\s\S]*劣らない/u,'degree-comparison selected feedback must survive reload');
  assert.match(degreeRestored.answer,/基準となる対象と比べた差/u,'reviewed degree-comparison answer must survive reload');

  const scopeRelation=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-G-SCOPE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(scopeRelation.id,'S04-II-G-SCOPE-01','reviewed scope-relation card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const scopeBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(scopeBefore.term,'-을/를 제외하고');assert.equal(scopeBefore.cardId,scopeRelation.id);assert.equal(scopeBefore.orderId,scopeRelation.id);
  assert.deepEqual(scopeBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(scopeBefore.labels,['前の条件が結果に影響しない','前の人の役割を別の人が担う','全体から前の対象を除く','前の対象を代表例として含める'],'fixed scope-relation choices must keep the saved shuffle');
  await submitShortsLabel('前の人の役割を別の人が担う');
  const scopeReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(scopeReview.summary,/대신해[\s\S]*役割/u,'selected Japanese feedback must explain the substitution trap');
  assert.match(scopeReview.answer,/全体から前の対象を除く/u);assert.equal(scopeReview.closed,true);
  assert.equal(scopeReview.nextBeforeDetails,true,'Next question must precede optional scope-relation coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'月曜日を除いて毎日営業しています。','reviewed Japanese scope-relation example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II scope relation light ${width}px`,'light')}
  await setViewport(390,844);await shot('00dg-shorts-topik2-scope-relation-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II scope relation expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00dh-shorts-topik2-scope-relation-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const scopeRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(scopeRestored.cardId,scopeRelation.id,'reviewed scope-relation ID must survive reload');
  assert.equal(scopeRestored.orderId,scopeRelation.id,'reviewed scope-relation choice-order ID must survive reload');
  assert.deepEqual(scopeRestored.choiceOrder,[2,1,0,3],'saved scope-relation choice order must survive reload');
  assert.equal(scopeRestored.locked,true,'graded scope-relation state must survive reload');
  assert.match(scopeRestored.summary,/대신해[\s\S]*役割/u,'scope-relation selected feedback must survive reload');
  assert.match(scopeRestored.answer,/全体から前の対象を除く/u,'reviewed scope-relation answer must survive reload');

  const stanceAdverb=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-W-STANCE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(stanceAdverb.id,'S04-II-W-STANCE-01','reviewed stance-adverb card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const stanceBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(stanceBefore.term,'간신히');assert.equal(stanceBefore.cardId,stanceAdverb.id);assert.equal(stanceBefore.orderId,stanceAdverb.id);
  assert.deepEqual(stanceBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(stanceBefore.labels,['否定表現とともに「まったく・どうしても」','よりましな選択肢を選ぶ','苦労の末、かろうじて実現する','間に合わず、することができない'],'fixed stance-adverb choices must keep the saved shuffle');
  await submitShortsLabel('よりましな選択肢を選ぶ');
  const stanceReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(stanceReview.summary,/차라리[\s\S]*選択肢/u,'selected Japanese feedback must explain the alternative-choice trap');
  assert.match(stanceReview.answer,/苦労の末、かろうじて/u);assert.equal(stanceReview.closed,true);
  assert.equal(stanceReview.nextBeforeDetails,true,'Next question must precede optional stance-adverb coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'終電が出る直前に、かろうじて駅に着きました。','reviewed Japanese stance-adverb example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II stance adverb light ${width}px`,'light')}
  await setViewport(390,844);await shot('00dc-shorts-topik2-stance-adverb-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II stance adverb expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00dd-shorts-topik2-stance-adverb-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const stanceRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(stanceRestored.cardId,stanceAdverb.id,'reviewed stance-adverb ID must survive reload');
  assert.equal(stanceRestored.orderId,stanceAdverb.id,'reviewed stance-adverb choice-order ID must survive reload');
  assert.deepEqual(stanceRestored.choiceOrder,[2,1,0,3],'saved stance-adverb choice order must survive reload');
  assert.equal(stanceRestored.locked,true,'graded stance-adverb state must survive reload');
  assert.match(stanceRestored.summary,/차라리[\s\S]*選択肢/u,'stance-adverb selected feedback must survive reload');
  assert.match(stanceRestored.answer,/苦労の末、かろうじて/u,'reviewed stance-adverb answer must survive reload');

  const basicConnective=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-G-CONNECTIVE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(basicConnective.id,'S04-I-G-CONNECTIVE-01','reviewed basic-connective card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const connectiveBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(connectiveBefore.term,'-(으)면서');assert.equal(connectiveBefore.cardId,basicConnective.id);assert.equal(connectiveBefore.orderId,basicConnective.id);
  assert.deepEqual(connectiveBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(connectiveBefore.labels,['移動する目的を表す','前に理由を示し、後ろで判断・依頼をする','二つの動作が同時に進む','後ろの内容の背景・状況を先に示す'],'fixed basic-connective choices must keep the saved shuffle');
  await submitShortsLabel('前に理由を示し、後ろで判断・依頼をする');
  const connectiveReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(connectiveReview.summary,/\(으\)니까[\s\S]*理由/u,'selected Japanese feedback must explain the reason-request trap');
  assert.match(connectiveReview.answer,/二つの動作が同時/u);assert.equal(connectiveReview.closed,true);
  assert.equal(connectiveReview.nextBeforeDetails,true,'Next question must precede optional basic-connective coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'友達と話しながらコーヒーを飲みました。','reviewed Japanese basic-connective example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I basic connective light ${width}px`,'light')}
  await setViewport(390,844);await shot('00da-shorts-topik1-basic-connective-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I basic connective expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00db-shorts-topik1-basic-connective-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const connectiveRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(connectiveRestored.cardId,basicConnective.id,'reviewed basic-connective ID must survive reload');
  assert.equal(connectiveRestored.orderId,basicConnective.id,'reviewed basic-connective choice-order ID must survive reload');
  assert.deepEqual(connectiveRestored.choiceOrder,[2,1,0,3],'saved basic-connective choice order must survive reload');
  assert.equal(connectiveRestored.locked,true,'graded basic-connective state must survive reload');
  assert.match(connectiveRestored.summary,/\(으\)니까[\s\S]*理由/u,'basic-connective selected feedback must survive reload');
  assert.match(connectiveRestored.answer,/二つの動作が同時/u,'reviewed basic-connective answer must survive reload');

  const wearingAction=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-W-WEAR-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(wearingAction.id,'S04-I-W-WEAR-01','reviewed wearing-action card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const wearingBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(wearingBefore.term,'입다');assert.equal(wearingBefore.cardId,wearingAction.id);assert.equal(wearingBefore.orderId,wearingAction.id);
  assert.deepEqual(wearingBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(wearingBefore.labels,['帽子をかぶる','靴・靴下を履く','服を着る','手袋をはめる'],'fixed wearing-action choices must keep the saved shuffle');
  await submitShortsLabel('靴・靴下を履く');
  const wearingReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(wearingReview.summary,/신다[\s\S]*靴や靴下/u,'selected Japanese feedback must explain the footwear trap');
  assert.match(wearingReview.answer,/服を着る/u);assert.equal(wearingReview.closed,true);
  assert.equal(wearingReview.nextBeforeDetails,true,'Next question must precede optional wearing-action coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'寒かったので、厚いコートを着ました。','reviewed Japanese wearing-action example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I wearing action light ${width}px`,'light')}
  await setViewport(390,844);await shot('00de-shorts-topik1-wearing-action-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I wearing action expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00df-shorts-topik1-wearing-action-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const wearingRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(wearingRestored.cardId,wearingAction.id,'reviewed wearing-action ID must survive reload');
  assert.equal(wearingRestored.orderId,wearingAction.id,'reviewed wearing-action choice-order ID must survive reload');
  assert.deepEqual(wearingRestored.choiceOrder,[2,1,0,3],'saved wearing-action choice order must survive reload');
  assert.equal(wearingRestored.locked,true,'graded wearing-action state must survive reload');
  assert.match(wearingRestored.summary,/신다[\s\S]*靴や靴下/u,'wearing-action selected feedback must survive reload');
  assert.match(wearingRestored.answer,/服を着る/u,'reviewed wearing-action answer must survive reload');

  const transitAction=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-W-TRANSIT-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(transitAction.id,'S04-I-W-TRANSIT-01','reviewed transit-action card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const transitBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(transitBefore.term,'타다');assert.equal(transitBefore.cardId,transitAction.id);assert.equal(transitBefore.orderId,transitAction.id);
  assert.deepEqual(transitBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(transitBefore.labels,['別の路線・乗り物に乗り換える','乗り物から降りる','乗り物に乗る','道・川などを渡る'],'fixed transit-action choices must keep the saved shuffle');
  await submitShortsLabel('乗り物から降りる');
  const transitReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(transitReview.summary,/내리다[\s\S]*乗っていた/u,'selected Japanese feedback must explain the getting-off trap');
  assert.match(transitReview.answer,/乗り物に乗る/u);assert.equal(transitReview.closed,true);
  assert.equal(transitReview.nextBeforeDetails,true,'Next question must precede optional transit-action coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'家の前の停留所でバスに乗りました。','reviewed Japanese transit-action example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I transit action light ${width}px`,'light')}
  await setViewport(390,844);await shot('00di-shorts-topik1-transit-action-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I transit action expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00dj-shorts-topik1-transit-action-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const transitRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(transitRestored.cardId,transitAction.id,'reviewed transit-action ID must survive reload');
  assert.equal(transitRestored.orderId,transitAction.id,'reviewed transit-action choice-order ID must survive reload');
  assert.deepEqual(transitRestored.choiceOrder,[2,1,0,3],'saved transit-action choice order must survive reload');
  assert.equal(transitRestored.locked,true,'graded transit-action state must survive reload');
  assert.match(transitRestored.summary,/내리다[\s\S]*乗っていた/u,'transit-action selected feedback must survive reload');
  assert.match(transitRestored.answer,/乗り物に乗る/u,'reviewed transit-action answer must survive reload');

  const changeAdverb=await evaluate(`(()=>{const lv=2,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-II-W-CHANGE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','2');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:2,levels:{1:blank,2:active},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(changeAdverb.id,'S04-II-W-CHANGE-01','reviewed change-adverb card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const changeBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(changeBefore.term,'점차');assert.equal(changeBefore.cardId,changeAdverb.id);assert.equal(changeBefore.orderId,changeAdverb.id);
  assert.deepEqual(changeBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(changeBefore.labels,['長い期間にわたって続く','短い期間だけ一時的に現れる','時間の経過とともに少しずつ変化する','短時間で大きく変化する'],'fixed change-adverb choices must keep the saved shuffle');
  await submitShortsLabel('短い期間だけ一時的に現れる');
  const changeReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(changeReview.summary,/일시적으로[\s\S]*短い期間/u,'selected Japanese feedback must explain the temporary-change trap');
  assert.match(changeReview.answer,/時間の経過とともに少しずつ/u);assert.equal(changeReview.closed,true);
  assert.equal(changeReview.nextBeforeDetails,true,'Next question must precede optional change-adverb coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'最初は少なかったものの、利用者が次第に増えています。','reviewed Japanese change-adverb example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II change adverb light ${width}px`,'light')}
  await setViewport(390,844);await shot('00dk-shorts-topik2-change-adverb-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK II change adverb expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00dl-shorts-topik2-change-adverb-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const changeRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['2'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(changeRestored.cardId,changeAdverb.id,'reviewed change-adverb ID must survive reload');
  assert.equal(changeRestored.orderId,changeAdverb.id,'reviewed change-adverb choice-order ID must survive reload');
  assert.deepEqual(changeRestored.choiceOrder,[2,1,0,3],'saved change-adverb choice order must survive reload');
  assert.equal(changeRestored.locked,true,'graded change-adverb state must survive reload');
  assert.match(changeRestored.summary,/일시적으로[\s\S]*短い期間/u,'change-adverb selected feedback must survive reload');
  assert.match(changeRestored.answer,/時間の経過とともに少しずつ/u,'reviewed change-adverb answer must survive reload');

  const houseworkAction=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-W-HOUSEWORK-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(houseworkAction.id,'S04-I-W-HOUSEWORK-01','reviewed housework-action card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const houseworkBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(houseworkBefore.term,'청소하다');assert.equal(houseworkBefore.cardId,houseworkAction.id);assert.equal(houseworkBefore.orderId,houseworkAction.id);
  assert.deepEqual(houseworkBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(houseworkBefore.labels,['食後の食器を洗う','服などを洗濯する','部屋や場所を掃除する','材料を使って料理を作る'],'fixed housework-action choices must keep the saved shuffle');
  await submitShortsLabel('服などを洗濯する');
  const houseworkReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(houseworkReview.summary,/빨래하다[\s\S]*服やタオル/u,'selected Japanese feedback must explain the laundry trap');
  assert.match(houseworkReview.answer,/部屋や場所を掃除する/u);assert.equal(houseworkReview.closed,true);
  assert.equal(houseworkReview.nextBeforeDetails,true,'Next question must precede optional housework-action coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'お客さんが来る前に、リビングを掃除しました。','reviewed Japanese housework-action example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I housework action light ${width}px`,'light')}
  await setViewport(390,844);await shot('00dm-shorts-topik1-housework-action-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I housework action expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00dn-shorts-topik1-housework-action-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const houseworkRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(houseworkRestored.cardId,houseworkAction.id,'reviewed housework-action ID must survive reload');
  assert.equal(houseworkRestored.orderId,houseworkAction.id,'reviewed housework-action choice-order ID must survive reload');
  assert.deepEqual(houseworkRestored.choiceOrder,[2,1,0,3],'saved housework-action choice order must survive reload');
  assert.equal(houseworkRestored.locked,true,'graded housework-action state must survive reload');
  assert.match(houseworkRestored.summary,/빨래하다[\s\S]*服やタオル/u,'housework-action selected feedback must survive reload');
  assert.match(houseworkRestored.answer,/部屋や場所を掃除する/u,'reviewed housework-action answer must survive reload');

  const basicNegation=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-G-NEGATION-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(basicNegation.id,'S04-I-G-NEGATION-01','reviewed basic-negation card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const negationBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(negationBefore.term,'안');assert.equal(negationBefore.cardId,basicNegation.id);assert.equal(negationBefore.orderId,basicNegation.id);
  assert.deepEqual(negationBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(negationBefore.labels,['名詞の身分・分類ではない（～ではない）','能力・状況のためできない','動作・状態の単純な否定（～しない）','人・物・時間などがない／いない'],'fixed basic-negation choices must keep the saved shuffle');
  await submitShortsLabel('能力・状況のためできない');
  const negationReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(negationReview.summary,/못[\s\S]*能力や状況/u,'selected Japanese feedback must explain the inability trap');
  assert.match(negationReview.answer,/動作・状態の単純な否定/u);assert.equal(negationReview.closed,true);
  assert.equal(negationReview.nextBeforeDetails,true,'Next question must precede optional basic-negation coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'私は朝、コーヒーを飲みません。','reviewed Japanese basic-negation example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I basic negation light ${width}px`,'light')}
  await setViewport(390,844);await shot('00cw-shorts-topik1-basic-negation-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I basic negation expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cx-shorts-topik1-basic-negation-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const negationRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(negationRestored.cardId,basicNegation.id,'reviewed basic-negation ID must survive reload');
  assert.equal(negationRestored.orderId,basicNegation.id,'reviewed basic-negation choice-order ID must survive reload');
  assert.deepEqual(negationRestored.choiceOrder,[2,1,0,3],'saved basic-negation choice order must survive reload');
  assert.equal(negationRestored.locked,true,'graded basic-negation state must survive reload');
  assert.match(negationRestored.summary,/못[\s\S]*能力や状況/u,'basic-negation selected feedback must survive reload');
  assert.match(negationRestored.answer,/動作・状態の単純な否定/u,'reviewed basic-negation answer must survive reload');

  const basicTense=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-G-TENSE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(basicTense.id,'S04-I-G-TENSE-01','reviewed basic-tense card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const tenseBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(tenseBefore.term,'-아/어요');assert.equal(tenseBefore.cardId,basicTense.id);assert.equal(tenseBefore.orderId,basicTense.id);
  assert.deepEqual(tenseBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(tenseBefore.labels,['今している途中の動作','すでに終わった過去の出来事','今の習慣・繰り返し','これからする予定'],'fixed basic-tense choices must keep the saved shuffle');
  await submitShortsLabel('すでに終わった過去の出来事');
  const tenseReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(tenseReview.summary,/-았\/었어요[\s\S]*過去/u,'selected Japanese feedback must explain the completed-past trap');
  assert.match(tenseReview.answer,/今の習慣・繰り返し/u);assert.equal(tenseReview.closed,true);
  assert.equal(tenseReview.nextBeforeDetails,true,'Next question must precede optional basic-tense coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'私は毎朝7時に起きます。','reviewed Japanese basic-tense example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I basic tense light ${width}px`,'light')}
  await setViewport(390,844);await shot('00co-shorts-topik1-tense-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I basic tense expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cp-shorts-topik1-tense-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const tenseRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(tenseRestored.cardId,basicTense.id,'reviewed basic-tense ID must survive reload');
  assert.equal(tenseRestored.orderId,basicTense.id,'reviewed basic-tense choice-order ID must survive reload');
  assert.deepEqual(tenseRestored.choiceOrder,[2,1,0,3],'saved basic-tense choice order must survive reload');
  assert.equal(tenseRestored.locked,true,'graded basic-tense state must survive reload');
  assert.match(tenseRestored.summary,/-았\/었어요[\s\S]*過去/u,'basic-tense selected feedback must survive reload');
  assert.match(tenseRestored.answer,/今の習慣・繰り返し/u,'reviewed basic-tense answer must survive reload');

  const frequencyWord=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-W-FREQ-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(frequencyWord.id,'S04-I-W-FREQ-01','reviewed frequency card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const frequencyBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(frequencyBefore.term,'항상');assert.equal(frequencyBefore.cardId,frequencyWord.id);assert.equal(frequencyBefore.orderId,frequencyWord.id);
  assert.deepEqual(frequencyBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(frequencyBefore.labels,['時々；たまに','よく；頻繁に','いつも；毎回','否定とともに「まったく～ない」'],'fixed frequency choices must keep the saved shuffle');
  await submitShortsLabel('よく；頻繁に');
  const frequencyReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(frequencyReview.summary,/자주[\s\S]*高い頻度/u,'selected Japanese feedback must explain the high-frequency trap');
  assert.match(frequencyReview.answer,/いつも；毎回/u);assert.equal(frequencyReview.closed,true);
  assert.equal(frequencyReview.nextBeforeDetails,true,'Next question must precede optional frequency coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'私はいつも朝ご飯を食べます。','reviewed Japanese frequency example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I frequency light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bq-shorts-topik1-frequency-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I frequency expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00br-shorts-topik1-frequency-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const frequencyRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(frequencyRestored.cardId,frequencyWord.id,'reviewed frequency ID must survive reload');
  assert.equal(frequencyRestored.orderId,frequencyWord.id,'reviewed frequency choice-order ID must survive reload');
  assert.deepEqual(frequencyRestored.choiceOrder,[2,1,0,3],'saved frequency choice order must survive reload');
  assert.equal(frequencyRestored.locked,true,'graded frequency state must survive reload');
  assert.match(frequencyRestored.summary,/자주[\s\S]*高い頻度/u,'frequency selected feedback must survive reload');
  assert.match(frequencyRestored.answer,/いつも；毎回/u,'reviewed frequency answer must survive reload');

  const counterWord=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-W-COUNT-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(counterWord.id,'S04-I-W-COUNT-01','reviewed counter card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const counterBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(counterBefore.term,'명');assert.equal(counterBefore.cardId,counterWord.id);assert.equal(counterBefore.orderId,counterWord.id);
  assert.deepEqual(counterBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(counterBefore.labels,['瓶入りの物を数える助数詞（～本）','一般の物を数える助数詞（～個）','人を数える助数詞（～人）','本・冊子を数える助数詞（～冊）'],'fixed counter choices must keep the saved shuffle');
  await submitShortsLabel('一般の物を数える助数詞（～個）');
  const counterReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(counterReview.summary,/개[\s\S]*一般の物/u,'selected Japanese feedback must explain the general-object counter trap');
  assert.match(counterReview.answer,/人を数える/u);assert.equal(counterReview.closed,true);
  assert.equal(counterReview.nextBeforeDetails,true,'Next question must precede optional counter coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'教室に学生が二人います。','reviewed Japanese counter example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I counter light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bx-shorts-topik1-counter-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I counter expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00by-shorts-topik1-counter-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const counterRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(counterRestored.cardId,counterWord.id,'reviewed counter ID must survive reload');
  assert.equal(counterRestored.orderId,counterWord.id,'reviewed counter choice-order ID must survive reload');
  assert.deepEqual(counterRestored.choiceOrder,[2,1,0,3],'saved counter choice order must survive reload');
  assert.equal(counterRestored.locked,true,'graded counter state must survive reload');
  assert.match(counterRestored.summary,/개[\s\S]*一般の物/u,'counter selected feedback must survive reload');
  assert.match(counterRestored.answer,/人を数える/u,'reviewed counter answer must survive reload');

  const questionWord=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-W-QUESTION-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(questionWord.id,'S04-I-W-QUESTION-01','reviewed question-word card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const questionWordBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(questionWordBefore.term,'누구');assert.equal(questionWordBefore.cardId,questionWord.id);assert.equal(questionWordBefore.orderId,questionWord.id);
  assert.deepEqual(questionWordBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(questionWordBefore.labels,['時を尋ねる「いつ」','場所を尋ねる「どこ」','人を尋ねる「だれ」','値段・金額を尋ねる「いくら」'],'fixed question-word choices must keep the saved shuffle');
  await submitShortsLabel('場所を尋ねる「どこ」');
  const questionWordReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(questionWordReview.summary,/어디[\s\S]*場所/u,'selected Japanese feedback must explain the place-question trap');
  assert.match(questionWordReview.answer,/人を尋ねる「だれ」/u);assert.equal(questionWordReview.closed,true);
  assert.equal(questionWordReview.nextBeforeDetails,true,'Next question must precede optional question-word coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'あの人はだれですか。','reviewed Japanese question-word example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I question word light ${width}px`,'light')}
  await setViewport(390,844);await shot('00cc-shorts-topik1-question-word-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I question word expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cd-shorts-topik1-question-word-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const questionWordRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(questionWordRestored.cardId,questionWord.id,'reviewed question-word ID must survive reload');
  assert.equal(questionWordRestored.orderId,questionWord.id,'reviewed question-word choice-order ID must survive reload');
  assert.deepEqual(questionWordRestored.choiceOrder,[2,1,0,3],'saved question-word choice order must survive reload');
  assert.equal(questionWordRestored.locked,true,'graded question-word state must survive reload');
  assert.match(questionWordRestored.summary,/어디[\s\S]*場所/u,'question-word selected feedback must survive reload');
  assert.match(questionWordRestored.answer,/人を尋ねる「だれ」/u,'reviewed question-word answer must survive reload');

  const particleRole=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-G-PARTICLE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(particleRole.id,'S04-I-G-PARTICLE-01','reviewed particle-role card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const particleBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(particleBefore.term,'에');assert.equal(particleBefore.cardId,particleRole.id);assert.equal(particleBefore.orderId,particleRole.id);
  assert.deepEqual(particleBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(particleBefore.labels,['手段・方法（～で）','動作が行われる場所（～で）','移動の到着点（～へ／～に）','人である受け手（～に）'],'fixed particle-role choices must keep the saved shuffle');
  await submitShortsLabel('動作が行われる場所（～で）');
  const particleReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(particleReview.summary,/에서[\s\S]*動作/u,'selected Japanese feedback must explain the action-location particle trap');
  assert.match(particleReview.answer,/移動の到着点/u);assert.equal(particleReview.closed,true);
  assert.equal(particleReview.nextBeforeDetails,true,'Next question must precede optional particle-role coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'学校へ行きます。','reviewed Japanese particle example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I particle role light ${width}px`,'light')}
  await setViewport(390,844);await shot('00cg-shorts-topik1-particle-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I particle role expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00ch-shorts-topik1-particle-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const particleRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(particleRestored.cardId,particleRole.id,'reviewed particle-role ID must survive reload');
  assert.equal(particleRestored.orderId,particleRole.id,'reviewed particle-role choice-order ID must survive reload');
  assert.deepEqual(particleRestored.choiceOrder,[2,1,0,3],'saved particle-role choice order must survive reload');
  assert.equal(particleRestored.locked,true,'graded particle-role state must survive reload');
  assert.match(particleRestored.summary,/에서[\s\S]*動作/u,'particle-role selected feedback must survive reload');
  assert.match(particleRestored.answer,/移動の到着点/u,'reviewed particle-role answer must survive reload');

  const demonstrative=await evaluate(`(()=>{const lv=1,deck=[...window.MALBIT_SHORTS_DECKS[lv],...window.MALBIT_BANK.shorts(lv)],index=deck.findIndex(item=>item.id==='S04-I-W-DEMONSTRATIVE-01'),item=deck[index],identity=window.MALBIT_SHORTS_CYCLE.identity(item,lv),blank={index:0,selected:null,locked:false,total:0,score:0,streak:0,recent:[],orderId:null,choiceOrder:null,cardId:null,familyId:null,recentIds:[],recentFamilies:[],cycleFamilies:[],cycle:0,isReview:false},active={...blank,index,orderId:item.id,choiceOrder:[2,1,0,3],cardId:identity.id,familyId:identity.family,recentIds:[identity.id],recentFamilies:[identity.family],cycleFamilies:[identity.family]};S.lang='ja';S.view='shorts';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('topikQuestShortsV1',JSON.stringify({schema:3,activeLevel:1,levels:{1:active,2:blank},daily:{}}));return{index,id:identity.id}})()`);
  assert.equal(demonstrative.id,'S04-I-W-DEMONSTRATIVE-01','reviewed demonstrative card must have its explicit stable ID');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const demonstrativeBefore=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{term:document.querySelector('.shortsWord')?.textContent.trim(),labels:[...document.querySelectorAll('.shortsChoice span')].map(node=>node.textContent.trim()),cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder}})()`);
  assert.equal(demonstrativeBefore.term,'이것');assert.equal(demonstrativeBefore.cardId,demonstrative.id);assert.equal(demonstrativeBefore.orderId,demonstrative.id);
  assert.deepEqual(demonstrativeBefore.choiceOrder,[2,1,0,3]);
  assert.deepEqual(demonstrativeBefore.labels,['二人から遠い物（あれ）','聞き手の近く・話題の物（それ）','話し手の近くの物（これ）','複数から選ぶ物（どれ）'],'fixed demonstrative choices must keep the saved shuffle');
  await submitShortsLabel('聞き手の近く・話題の物（それ）');
  const demonstrativeReview=await evaluate(`(()=>{const summary=document.querySelector('.shortsFeedbackSummary'),details=document.querySelector('.shortsExplanation'),next=document.querySelector('.shortsAction button');return{summary:summary?.innerText,closed:details?!details.open:null,nextBeforeDetails:!!(next&&details&&(next.compareDocumentPosition(details)&Node.DOCUMENT_POSITION_FOLLOWING)),answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.match(demonstrativeReview.summary,/그것[\s\S]*聞き手/u,'selected Japanese feedback must explain the listener-near demonstrative trap');
  assert.match(demonstrativeReview.answer,/話し手の近くの物（これ）/u);assert.equal(demonstrativeReview.closed,true);
  assert.equal(demonstrativeReview.nextBeforeDetails,true,'Next question must precede optional demonstrative coaching');
  assert.equal(await evaluate(`document.querySelector('.malbitExampleTranslation')?.innerText`),'これは私が持っている傘です。','reviewed Japanese demonstrative example must render locally');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I demonstrative light ${width}px`,'light')}
  await setViewport(390,844);await shot('00ck-shorts-topik1-demonstrative-wrong-light.png');
  await evaluate(`malbitSetTheme('dark');const details=document.querySelector('.shortsExplanation');details.open=true;details.scrollIntoView({block:'start',behavior:'auto'})`);await sleep(100);
  assert.match(await evaluate(`document.querySelector('.shortsExplanation')?.innerText`),/【正解の根拠】[\s\S]*【誤答の罠】[\s\S]*【再利用できる解き方】/u);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`S04 TOPIK I demonstrative expanded dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00cl-shorts-topik1-demonstrative-full-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsFeedbackSummary');
  const demonstrativeRestored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,orderId:state.orderId,choiceOrder:state.choiceOrder,locked:state.locked,summary:document.querySelector('.shortsFeedbackSummary')?.innerText,answer:document.querySelector('.shortsFeedback p')?.innerText}})()`);
  assert.equal(demonstrativeRestored.cardId,demonstrative.id,'reviewed demonstrative ID must survive reload');
  assert.equal(demonstrativeRestored.orderId,demonstrative.id,'reviewed demonstrative choice-order ID must survive reload');
  assert.deepEqual(demonstrativeRestored.choiceOrder,[2,1,0,3],'saved demonstrative choice order must survive reload');
  assert.equal(demonstrativeRestored.locked,true,'graded demonstrative state must survive reload');
  assert.match(demonstrativeRestored.summary,/그것[\s\S]*聞き手/u,'demonstrative selected feedback must survive reload');
  assert.match(demonstrativeRestored.answer,/話し手の近くの物（これ）/u,'reviewed demonstrative answer must survive reload');

  const exhausted=await openExhaustedShortsCycle(1);
  await evaluate(`nextShorts()`);await sleep(180);
  const cycled=await evaluate(`(()=>{const saved=JSON.parse(localStorage.getItem('topikQuestShortsV1')),state=saved.levels['1']||saved.levels[1];return{schema:saved.schema,cycle:state.cycle,isReview:state.isReview,cardId:state.cardId,familyId:state.familyId,term:document.querySelector('.shortsWord')?.textContent.trim(),badge:document.querySelector('.shortsReviewBadge')?.textContent.trim()}})()`);
  assert.equal(cycled.schema,3,'Shorts cycle must persist schema 3');
  assert.equal(cycled.cycle,1,'exhaustion must start the first review cycle');
  assert.equal(cycled.isReview,true,'intentional repeat must persist as review');
  assert.notEqual(cycled.familyId,exhausted.currentFamily,'cycle wrap must not immediately repeat the current semantic family');
  assert.match(cycled.badge,/間隔復習/u,'Japanese review marker must be visible');
  await evaluate(`malbitSetTheme('light')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`cycled Shorts light ${width}px`,'light')}
  await setViewport(390,844);await shot('00bc-shorts-spaced-review-light.png');
  await evaluate(`malbitSetTheme('dark')`);await sleep(100);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`cycled Shorts dark ${width}px`,'dark')}
  await setViewport(390,844);await shot('00bd-shorts-spaced-review-dark.png');
  await send('Page.reload',{ignoreCache:true});await ready();await waitForSelector('.shortsWord');
  const restored=await evaluate(`(()=>{const state=JSON.parse(localStorage.getItem('topikQuestShortsV1')).levels['1'];return{cardId:state.cardId,term:document.querySelector('.shortsWord')?.textContent.trim(),badge:document.querySelector('.shortsReviewBadge')?.textContent.trim()}})()`);
  assert.equal(restored.cardId,cycled.cardId,'reload must restore the same stable Shorts card');
  assert.equal(restored.term,cycled.term,'reload must not drift to the old numeric index');
  assert.match(restored.badge,/間隔復習/u,'reload must preserve the review disclosure');

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
  let restoredHub=false;
  for(let wait=0;wait<100;wait++){
    if(await evaluate(`document.body.innerText.includes('明洞トラベルハブ')`)){restoredHub=true;break}
    await sleep(100);
  }
  assert.ok(restoredHub,'Myeongdong hub state must survive reload');
  assert.ok((await state()).inventory.includes('namsanCharm'),'hub collectibles must survive reload');

  const durableAfter=await evaluate(`({vocab:JSON.parse(localStorage.getItem('topikQuestV8')).vocab,gameUnlock:JSON.parse(localStorage.getItem('topikQuestV8')).gameUnlock,game:localStorage.getItem('topikQuestTopik1GameV1'),review:localStorage.getItem('malbitWrongReviewV3')})`);
  assert.deepEqual(durableAfter,durableBefore,'travel play must not alter vocabulary, game, or review records');
  assert.deepEqual(errors,[]);
  // HARUMAL: exercise the new information architecture through real controls.
  for(const theme of ['light','dark']){
    await evaluate(`malbitSetTheme('${theme}');setLang('ja');setView('home')`);
    for(const width of [320,375,390,430]){
      await setViewport(width,844);
      for(const view of ['home','learn','more','review','vocab','speaking']){
        if(view==='vocab'||view==='speaking'){await tap(view==='vocab'?'#nav_more':'#nav_learn');await tap(".harumalCourse[onclick=\"setView('"+view+"')\"]")}else await tap('#nav_'+view);
        const fit=await evaluate(`({overflow:document.documentElement.scrollWidth>innerWidth+1,nav:[...document.querySelectorAll('.nav button')].map(b=>({h:b.getBoundingClientRect().height,w:b.getBoundingClientRect().width})),active:document.querySelector('.nav [aria-current="page"]')?.id,brand:document.title})`);
        assert.equal(fit.overflow,false,`HARUMAL ${view} ${theme} ${width} overflow`);
        assert.equal(fit.active,'nav_'+(view==='vocab'?'more':view==='speaking'?'learn':view));
        assert.ok(fit.nav.length===5&&fit.nav.every(b=>b.h>=44&&b.w>=44));
        assert.ok(fit.brand.startsWith('하루말'));
        assert.deepEqual(await evaluate(`[...document.querySelectorAll('.nav button span')].map(el=>el.textContent)`),['今日','学ぶ','旅','復習','マイ']);
        await evaluate('scrollTo(0,0)');
        await shot(`harumal-${view}-${theme}-${width}.png`);
      }
    }
  }
  assert.deepEqual(errors,[],'Harumal navigation must not add console errors');
  const screenshotCount=fs.readdirSync(out).filter(file=>file.endsWith('.png')).length;
  console.log(`mobile QA: 320/375/390/430px Home + Beginner Grammar + split Writing + Game + Shorts + Random Practice + Review visual contracts, two-field Writing input/save/reload/score/review/migration, 9-chapter/64-lesson grammar catalog, transformation coaching, per-unit handwriting and preserved progress, Review queue/filter/retry/translation/type coaching/re-entry, TOPIK I/II random question/answer/type coaching, level re-entry, Shorts question/answer/instructor feedback + hit-tested Travel route + one-tap completed-route re-entry + NPC word order + Hangul sign build with decoys, day/evening events, travel-won exchange, reload/back-resume, durable records, screenshots=${screenshotCount}, errors=0`);
}finally{
  try{socket?.close()}catch(error){}
  chrome?.kill('SIGTERM');server.kill('SIGTERM');
}
