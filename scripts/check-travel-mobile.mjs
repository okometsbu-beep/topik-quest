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
    for(let i=0;i<100;i++){if(await evaluate(`document.readyState==='complete'&&!!window.MALBIT_TRAVEL`))return;await sleep(100)}
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
    const fit=await evaluate(`(()=>{const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const targets=[...document.querySelectorAll('.travelPrimary,.travelSecondary,.travelAnswer,.travelRoutes button,.travelBack,.travelLang,.travelListen button,.travelMyeongdongHead>button,.travelExchangeCard,.travelSentence button,.travelWordBank button,.travelQuantityPicker button,.travelBudgetActions button')].filter(visible);const outside=targets.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(el=>({class:el.className,left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right)}));const bad=targets.filter(el=>el.getBoundingClientRect().height<43).map(el=>({class:el.className,h:Math.round(el.getBoundingClientRect().height)}));const overlaps=[];for(const container of document.querySelectorAll('.travelEndingBody,.travelMyeongdongCard')){const children=[...container.children].filter(el=>visible(el)&&getComputedStyle(el).position!=='absolute').sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);for(let i=1;i<children.length;i++){const a=children[i-1].getBoundingClientRect(),b=children[i].getBoundingClientRect();if(a.bottom>b.top+1)overlaps.push({a:children[i-1].className||children[i-1].tagName,b:children[i].className||children[i].tagName,amount:Math.round(a.bottom-b.top)})}}return{innerWidth,root:document.documentElement.scrollWidth,body:document.body.scrollWidth,bad,outside,overlaps}})()`);
    assert.ok(fit.root<=fit.innerWidth+1&&fit.body<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.root}/${fit.body}/${fit.innerWidth}`);
    assert.deepEqual(fit.bad,[],`${label}: touch target below 44px`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.overlaps,[],`${label}: flow elements overlap`);
  };
  const assertShortsFits=async label=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector('.tqShortsScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('.shortsTop button,.shortsChoice,.shortsAction button,.malbitShortTools button,.malbitShortProposal>button')].filter(visible);const surfaces=[...root.querySelectorAll('.shortsCard')].filter(visible);const tiles=[...root.querySelectorAll('.shortsCard,.shortsChoice,.shortsFeedback,.malbitShortProposal')].filter(visible);const copy=[...root.querySelectorAll('.shortsInstruction,.shortsFeedback small,.doubleTapHint,.shortsSwipe,.malbitShortTools button,.malbitShortDaily,.malbitShortProposal small,.malbitShortProposal p')].filter(visible);const channels=color=>(color.match(/[\\d.]+/g)||[]).slice(0,3).map(Number);const card=document.querySelector('.shortsCard');return{missing:false,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,cardOverflow:card?card.scrollWidth-card.clientWidth:0,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<170),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Shorts root missing`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.ok(fit.cardOverflow<=1,`${label}: Shorts card content overflow ${fit.cardOverflow}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Shorts card`);
    assert.deepEqual(fit.darkTiles,[],`${label}: dark Shorts learning tile`);
    assert.deepEqual(fit.tinyCopy,[],`${label}: Shorts copy below 10px`);
  };
  const assertRandomPracticeFits=async label=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector('.tqRandomPracticeScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const surfaces=[...root.querySelectorAll('.card')].filter(visible);const tiles=[...root.querySelectorAll('.card,.choice,.infinityBar div,.t1RandomTop .t1hud span,.hud span,.malbitQuestionTranslation,.malbitExplanationToggle,.malbitRandomExplanation.open .tqInlineExplanation')].filter(visible);const copy=[...root.querySelectorAll('.randomPracticeTop small,.infinityBar small,.t1hud span,.hud span,.instruction,.cat,.doubleTapHint,.t1TutorCoach small,.malbitQuestionTranslation small,.tqInlineAnswer small,.tqInlineExplanation h4,.counter')].filter(visible);const channels=color=>(color.match(/[\\d.]+/g)||[]).slice(0,3).map(Number);const card=root.querySelector('.card');return{missing:false,active:document.body.classList.contains('tq-random-practice-active'),innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,cardOverflow:card?card.scrollWidth-card.clientWidth:0,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<170),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Random Practice root missing`);
    assert.equal(fit.active,true,`${label}: Random Practice body contract inactive`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.ok(fit.cardOverflow<=1,`${label}: Random Practice card content overflow ${fit.cardOverflow}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: enabled touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Random Practice card`);
    assert.deepEqual(fit.darkTiles,[],`${label}: dark Random Practice learning tile`);
    assert.deepEqual(fit.tinyCopy,[],`${label}: Random Practice copy below 10px`);
  };
  const assertReviewFits=async(label,retry=false)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector(${retry?"'#sheetBody.tqReviewRetrySheet'":"'.tqReviewScreen'"});if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const surfaces=[...root.querySelectorAll(${retry?"'.tqReviewQuestion,.tqReviewDeep'":"'.tqReviewHero,.tqReviewStats,.tqReviewFilters,.tqReviewItem,.tqReviewEmpty'"})].filter(visible);const tiles=[...root.querySelectorAll(${retry?"'.tqReviewQuestion,.tqReviewChoices .choice,.tqReviewDeep,.tqReviewChoiceAnalysis li'":"'.tqReviewStats>div,.tqReviewFilters button,.tqReviewItem,.tqReviewEmpty'"})].filter(visible);const copy=[...root.querySelectorAll(${retry?"'.reward small,.tqReviewQuestion>small,.tqReviewQuestion li,.tqTranslationToggle,.doubleTapHint,.tqReviewDeep h4,.tqReviewDeep blockquote,.tqReviewChoiceAnalysis span'":"'.tqReviewHero small,.tqReviewHero p,.tqReviewStats small,.tqReviewFilters button,.tqReviewBadge small,.tqReviewItem p,.tqReviewItem>div>small,.tqReviewEmpty p'"})].filter(visible);const channels=color=>(color.match(/[\\d.]+/g)||[]).slice(0,3).map(Number);return{missing:false,active:document.body.classList.contains('tq-review-active'),innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,rootOverflow:root.scrollWidth-root.clientWidth,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<170),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Review root missing`);
    assert.equal(fit.active,true,`${label}: Review body contract inactive`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.ok(fit.rootOverflow<=1,`${label}: Review content overflow ${fit.rootOverflow}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: enabled touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Review surface`);
    assert.deepEqual(fit.darkTiles,[],`${label}: dark Review learning tile`);
    assert.deepEqual(fit.tinyCopy,[],`${label}: Review copy below 10px`);
  };
  const assertGameFits=async(label,rootSelector)=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector(${JSON.stringify(rootSelector)});if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const surfaces=[...root.querySelectorAll('.tqGameArena,.t1GameLoadout,.tqGameStageList,.t1TrailBoard,.t1RunLoadout,.malbitBattleScreen>.card')].filter(visible);const tiles=[...root.querySelectorAll('.t1GameGear,.tqGameStage:not(.on),.t1RunSlot,.t1TrailNode.unknown')].filter(visible);const copy=[...root.querySelectorAll('.t1GameGear small,.t1RarityLegend span,.t1RunRule,.t1RunSlot small,.tqGameTts')].filter(visible);const channels=color=>(color.match(/[\d.]+/g)||[]).slice(0,3).map(Number);return{missing:false,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<110),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Game root missing`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: enabled touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Game surface`);
    assert.deepEqual(fit.darkTiles,[],`${label}: near-black Game tile`);
    assert.deepEqual(fit.tinyCopy,[],`${label}: Game copy below 10px`);
  };
  const assertHomeFits=async label=>{
    const fit=await evaluate(`(()=>{const root=document.querySelector('.tqHomeScreen');if(!root)return{missing:true};const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0};const rect=el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height)}};const controls=[...root.querySelectorAll('button:not(:disabled)')].filter(visible);const surfaces=[...root.querySelectorAll(':scope>.t1level,.tqV9Hero,.tqV9Modes,.tqV9Utility,.tqV9Week')].filter(visible);const tiles=[...root.querySelectorAll('.tqV9Mode,.tqV9Utility button,.tqV9Week')].filter(visible);const copy=[...root.querySelectorAll('.tqV9Greeting small,.tqV9SectionHead span,.tqV9Mode small,.tqV9Utility small,.tqV9Week p,.tqV9Day small')].filter(visible);const channels=color=>(color.match(/[\d.]+/g)||[]).slice(0,3).map(Number);return{missing:false,innerWidth,rootWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,outside:controls.filter(el=>{const r=el.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).map(rect),small:controls.filter(el=>{const r=el.getBoundingClientRect();return r.width<43||r.height<43}).map(rect),offCenter:surfaces.filter(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.right))>2}).map(el=>{const r=el.getBoundingClientRect();return{class:el.className,left:Math.round(r.left),rightGap:Math.round(innerWidth-r.right)}}),darkTiles:tiles.map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor,rgb:channels(getComputedStyle(el).backgroundColor)})).filter(row=>row.rgb.length===3&&row.rgb.reduce((sum,value)=>sum+value,0)/3<170),tinyCopy:copy.map(el=>({class:el.className,size:parseFloat(getComputedStyle(el).fontSize)})).filter(row=>row.size<9.9)}})()`);
    assert.equal(fit.missing,false,`${label}: Home root missing`);
    assert.ok(fit.rootWidth<=fit.innerWidth+1&&fit.bodyWidth<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.rootWidth}/${fit.bodyWidth}/${fit.innerWidth}`);
    assert.deepEqual(fit.outside,[],`${label}: interactive element leaves viewport`);
    assert.deepEqual(fit.small,[],`${label}: enabled touch target below 44px`);
    assert.deepEqual(fit.offCenter,[],`${label}: asymmetric Home surface`);
    assert.deepEqual(fit.darkTiles,[],`${label}: dark Home learning tile`);
    assert.deepEqual(fit.tinyCopy,[],`${label}: Home copy below 10px`);
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
    await tapUntilScene('.travelSceneCard .travelPrimary','q-hello');
  };
  const answer=async(index=0)=>{
    assert.equal(await evaluate(`document.querySelectorAll('.travelAnswer').length`),4);
    await tap('.travelAnswer',index);
    assert.equal(await evaluate(`document.querySelectorAll('.travelAnswer.selected').length`),1);
    await tap('.travelQuestionCard .travelPrimary');
    return state();
  };
  const waitForQuestionTitle=async(expected)=>{
    for(let wait=0;wait<40;wait++){
      if(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent===${JSON.stringify(expected)}`))return expected;
      await sleep(50);
    }
    return evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`);
  };
  const nextQuestion=async()=>{
    await tap('.travelQuestionCard .travelPrimary');
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
        if(await evaluate(`document.readyState==='complete'&&document.querySelector('.travelQuestionCard h1')?.textContent===${JSON.stringify(firstTitle)}`)){restored=true;break}
        await sleep(100);
      }
      assert.ok(restored,'reload must restore the active Travel question before assertions continue');
      assert.equal((await state()).sceneId,'q-ticket');
      assert.equal(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`),firstTitle);
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
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertHomeFits(`Home ${width}px`)}
  await setViewport(390,844);await shot('00e-home-visual-contract.png');
  assert.equal(await evaluate(`document.querySelectorAll('.tqHomeScreen>.t1level button').length`),3,'Home must keep beginner, TOPIK I, and TOPIK II entries');
  await tap('.tqHomeScreen>.t1level button',2,120);
  assert.match(await evaluate(`document.querySelector('.tqHomeScreen>.t1level button.on')?.textContent`),/TOPIK II/);
  await tap('.tqHomeScreen>.t1level button',1,120);
  assert.match(await evaluate(`document.querySelector('.tqHomeScreen>.t1level button.on')?.textContent`),/TOPIK I/);

  await evaluate(`(()=>{MALBIT_REVIEW.record(1,'read','P01-I-R-09',-1,'random',{choiceOrder:[0,1,2,3]});MALBIT_REVIEW.record(2,'read','P01-II-R-06',-1,'random',{choiceOrder:[0,1,2,3]});S.lang='ja';S.view='review';save();render()})()`);await sleep(300);
  assert.ok(await evaluate(`!!document.querySelector('#malbitReviewVisualSystem')`),'Review visual system must load after compatibility layers');
  assert.equal(await evaluate(`document.querySelectorAll('.tqReviewItem').length`),2,'Review queue must show both seeded TOPIK levels');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertReviewFits(`Review queue ${width}px`)}
  await setViewport(390,844);await shot('00j-review-queue.png');
  await tap('.tqReviewFilters button',2,120);
  assert.equal(await evaluate(`document.querySelectorAll('.tqReviewItem').length`),1,'TOPIK II filter must narrow the queue');
  assert.equal(await evaluate(`document.querySelector('.tqReviewFilters button.on span')?.textContent`),'TOPIK II');
  assert.equal(await evaluate(`document.querySelector('.tqReviewFilters button.on b')?.textContent`),'1');
  await tap('.tqReviewFilters button',0,120);
  await evaluate(`openReviewRetry('2:read:P01-II-R-06')`);await sleep(180);
  assert.equal(await evaluate(`document.querySelectorAll('#tqReviewTranslation .tqReviewQuestion').length`),0,'Review translation stays closed until requested');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertReviewFits(`Review retry ${width}px`,true)}
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
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertReviewFits(`Review graded coaching ${width}px`,true)}
  await setViewport(390,844);await shot('00l-review-coaching.png');
  assert.deepEqual(await evaluate(`(()=>{const item=MALBIT_REVIEW.items()['2:read:P01-II-R-06'];return{active:item.active,retryCount:item.retryCount,wrongCount:item.wrongCount}})()`),{active:false,retryCount:1,wrongCount:1},'correct Review retry must resolve exactly one saved item');
  await tap('.tqReviewRetrySheet>.closeBtn',0,180);
  assert.equal(await evaluate(`document.querySelectorAll('.tqReviewItem').length`),1,'resolved item must leave the active queue after re-entry');
  assert.equal(await evaluate(`document.body.classList.contains('tq-review-active')`),true,'Review visual contract must survive sheet close and re-entry');
  await evaluate(`S.view='home';save();render()`);await sleep(180);

  await evaluate(`(()=>{S.lang='ja';save();localStorage.setItem('topikQuestExamLevel','1');t1OpenGameMap(1)})()`);
  for(let wait=0;wait<60;wait++){if(await evaluate(`!!document.querySelector('.tqGameHub')`))break;await sleep(50)}
  assert.ok(await evaluate(`!!document.querySelector('#malbitGameVisualSystem')`),'Game visual system must load after compatibility layers');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertGameFits(`Game hub ${width}px`,'.tqGameHub')}
  await setViewport(390,844);await shot('00c-game-hub-visual-contract.png');
  await evaluate(`t1StartGameStage(1)`);
  for(let wait=0;wait<60;wait++){if(await evaluate(`!!document.querySelector('.t1TrailScreen')`))break;await sleep(50)}
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertGameFits(`Game trail ${width}px`,'.t1TrailScreen')}
  await setViewport(390,844);await shot('00d-game-trail-visual-contract.png');
  await evaluate(`S.view='home';save();render()`);await sleep(300);
  const durableBefore=await evaluate(`({vocab:JSON.parse(localStorage.getItem('topikQuestV8')).vocab,gameUnlock:JSON.parse(localStorage.getItem('topikQuestV8')).gameUnlock,game:localStorage.getItem('topikQuestTopik1GameV1'),review:localStorage.getItem('malbitWrongReviewV3')})`);

  await evaluate(`(()=>{S.lang='ja';save();localStorage.setItem('topikQuestExamLevel','1');localStorage.setItem('malbitProductPrefsV1',JSON.stringify({listeningMode:'off'}));tqStartMode('random')})()`);await sleep(300);
  assert.ok(await evaluate(`!!document.querySelector('#malbitRandomPracticeVisualSystem')`),'Random Practice visual system must load after compatibility layers');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK I unanswered Random Practice ${width}px`)}
  const topik1Answer=await evaluate(`(()=>{const session=JSON.parse(localStorage.getItem('topikQuestTopik1Session'));const id=session.ids[session.i];return MALBIT_BANK.present(id,session.choiceOrders[id]).answerIndex})()`);
  await tap('.choice',topik1Answer,100);await tap('.choice',topik1Answer,250);
  assert.equal(await evaluate(`document.querySelectorAll('.t1TutorCoach>div').length`),3,'TOPIK I feedback must keep evidence, selected-choice analysis, and a solving tip');
  assert.match(await evaluate(`document.querySelector('.t1TutorCoach')?.innerText`),/正解の根拠[\s\S]*選んだ選択肢の分析[\s\S]*解き方のコツ/);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK I graded Random Practice ${width}px`)}
  await setViewport(390,844);await shot('00g-random-practice-topik1-coaching.png');

  await evaluate(`(()=>{S.lang='ja';S.view='infinity';S.infinity={active:true,examLevel:2,count:0,graded:0,correct:0,writing:0,totalSec:0,targetSec:0,last:null,feedback:null,seenIds:[],current:{type:'read',id:956,bankId:'P01-II-R-06',choiceOrder:[0,1,2,3]}};save();render()})()`);await sleep(300);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK II unanswered Random Practice ${width}px`)}
  await setViewport(390,844);await shot('00h-random-practice-unanswered.png');
  const topik2Answer=await evaluate(`MALBIT_BANK.present('P01-II-R-06',[0,1,2,3]).answerIndex`);
  await tap('.choice',topik2Answer,100);await tap('.choice',topik2Answer,350);
  assert.ok(await evaluate(`!!document.querySelector('.malbitQuestionTranslation')`),'TOPIK II graded feedback must keep the full-question translation');
  await tap('.malbitExplanationToggle',0,180);
  const randomCoach=await evaluate(`document.querySelector('.malbitRandomExplanation')?.innerText`);
  assert.match(randomCoach,/【正解の根拠】[\s\S]*【ひっかけ分析】[\s\S]*【タイプ別の解き方】/);
  assert.match(randomCoach,/慣用句全体/);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertRandomPracticeFits(`TOPIK II graded Random Practice ${width}px`)}
  await setViewport(390,844);await shot('00i-random-practice-topik2-coaching.png');
  await evaluate(`S.infinity=null;S.view='home';save();render()`);await sleep(300);

  const curatedIndex=await evaluate(`window.MALBIT_SHORTS_DECKS[2].findIndex(item=>item.term==='갈피를 못 잡다')`);
  assert.ok(curatedIndex>=0,'new TOPIK II idiom must be in the curated Shorts deck');
  const curatedAnswer=await evaluate(`window.MALBIT_SHORTS_DECKS[2][${curatedIndex}].meaning.ja`);
  await openStoredShorts(curatedIndex);
  assert.ok(await evaluate(`!!document.querySelector('#malbitShortsVisualSystem')`),'Shorts visual system must load after compatibility layers');
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`unanswered Shorts ${width}px`)}
  await setViewport(390,844);await shot('00f-shorts-visual-contract-unanswered.png');
  await submitShortsLabel(curatedAnswer);
  assert.match(await evaluate(`document.querySelector('.shortsFeedback small')?.innerText`),/【意味】[\s\S]*【文脈】[\s\S]*【覚え方】/);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`curated Shorts ${width}px`)}
  await setViewport(390,844);await shot('00a-shorts-idiom-coaching.png');

  const curatedLength=await evaluate(`window.MALBIT_SHORTS_DECKS[2].length`);
  const bankShortsIndex=await evaluate(`window.MALBIT_SHORTS_DECKS[2].length+window.MALBIT_BANK.shorts(2).findIndex(item=>item.bankId==='P01-II-R-06')`);
  const bankShortsAnswer=await evaluate(`(()=>{const item=window.MALBIT_BANK.shorts(2).find(entry=>entry.bankId==='P01-II-R-06');return item.choices[item.answerIndex]})()`);
  assert.ok(bankShortsIndex>=curatedLength,'new TOPIK II practice item must enter Shorts');
  await openStoredShorts(bankShortsIndex);await submitShortsLabel(bankShortsAnswer);
  const bankCoach=await evaluate(`document.querySelector('.shortsFeedback small')?.innerText`);
  assert.match(bankCoach,/【正解の根拠】[\s\S]*【ひっかけ分析】[\s\S]*【タイプ別の解き方】/);
  assert.match(bankCoach,/慣用句全体/);
  for(const width of [320,375,390,430]){await setViewport(width,width===320?700:844);await assertShortsFits(`bank Shorts ${width}px`)}
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
  await evaluate(`window.__travelAudio={played:0,cancelled:0};window.MALBIT_TTS={play:()=>window.__travelAudio.played++,cancel:()=>window.__travelAudio.cancelled++}`);
  await tap('.travelListen>button:first-child');assert.equal(await evaluate(`window.__travelAudio.played`),1);
  const correct=await answer(0);assert.equal(correct.answers['q-hello'].correct,true);assert.ok(correct.inventory.includes('airportMap'));
  assert.equal(await evaluate(`[...document.querySelectorAll('.travelAnswer')].filter(el=>getComputedStyle(el).display!=='none').length`),1,'correct result should collapse distractors');
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswerCopy small').length`),1,'only the correct translation may appear after a correct answer');
  assert.match(await evaluate(`document.querySelector('.travelFeedback b')?.textContent`),/2,000旅ウォン/);
  await shot('04-correct-reward.png');
  await nextQuestion();assert.ok(await evaluate(`window.__travelAudio.cancelled`)>=1,'audio must stop when the scene changes');
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswers.hotspot img').length`),4);
  assert.equal(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`),'空港鉄道の標識を探せ');
  await assertFits('airport rail sign question');
  await shot('04a-airport-rail-question.png');
  await answer(0);
  assert.match(await evaluate(`document.querySelector('.travelTutor')?.textContent`),/空港鉄道/);
  await shot('04b-airport-rail-coaching.png');
  await nextQuestion();
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
  console.log(`mobile QA: 320/375/390/430px Home + Game + Shorts + Random Practice + Review visual contracts, Review queue/filter/retry/translation/type coaching/re-entry, TOPIK I/II random question/answer/type coaching, level re-entry, Shorts question/answer/instructor feedback + hit-tested Travel route + one-tap completed-route re-entry + NPC word order + Hangul sign build with decoys, day/evening events, travel-won exchange, reload/back-resume, durable records, screenshots=${screenshotCount}, errors=0`);
}finally{
  try{socket?.close()}catch(error){}
  chrome?.kill('SIGTERM');server.kill('SIGTERM');
}
