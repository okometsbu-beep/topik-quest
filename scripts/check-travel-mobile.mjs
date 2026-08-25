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
  const tap=async(selector,index=0,delay=170)=>{
    const found=await evaluate(`(()=>{const el=document.querySelectorAll(${JSON.stringify(selector)})[${index}];if(!el||el.disabled)return false;el.scrollIntoView({block:'center',inline:'center',behavior:'auto'});return true})()`);
    assert.ok(found,`tap target missing or disabled: ${selector}[${index}]`);
    await sleep(50);
    const point=await evaluate(`(()=>{const el=document.querySelectorAll(${JSON.stringify(selector)})[${index}],r=el.getBoundingClientRect(),s=getComputedStyle(el);return{visible:s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0,x:r.left+r.width/2,y:r.top+r.height/2,width:r.width,height:r.height,top:r.top,bottom:r.bottom}})()`);
    assert.ok(point.visible,`tap target hidden: ${selector}[${index}]`);
    const viewport=await evaluate(`({width:innerWidth,height:innerHeight})`);
    assert.ok(point.x>=0&&point.x<=viewport.width&&point.y>=0&&point.y<=viewport.height,`tap target outside viewport: ${selector}[${index}]`);
    await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:point.x,y:point.y,radiusX:2,radiusY:2,force:1,id:1}]});
    await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await sleep(delay);
    return point;
  };
  const state=()=>evaluate(`JSON.parse(localStorage.getItem('malbitStoryV1')).episodes['route-001-airport-myeongdong']`);
  const assertFits=async label=>{
    const fit=await evaluate(`({innerWidth,root:document.documentElement.scrollWidth,body:document.body.scrollWidth,bad:[...document.querySelectorAll('.travelPrimary,.travelAnswer,.travelRoutes button,.travelBack,.travelLang,.travelListen button')].filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&r.height<43}).map(el=>({class:el.className,h:el.getBoundingClientRect().height}))})`);
    assert.ok(fit.root<=fit.innerWidth+1&&fit.body<=fit.innerWidth+1,`${label}: horizontal overflow ${fit.root}/${fit.body}/${fit.innerWidth}`);
    assert.deepEqual(fit.bad,[],`${label}: touch target below 44px`);
  };
  const startFresh=async()=>{
    await evaluate(`localStorage.removeItem('malbitStoryV1');S.lang='ja';S.view='game';save();render()`);
    assert.ok(await evaluate(`!!document.querySelector('.tqV9Mode.travel img[src*="airport-map.webp"]')`),'Travel entry must use generated art instead of emoji');
    await tap('.tqV9Mode.travel');
    assert.equal(await evaluate(`document.querySelector('.travelHubHead h1')?.textContent`),'旅行モード');
    await tap('.travelEpisodeCard .travelPrimary');
    assert.equal((await state()).sceneId,'arrival');
    await tap('.travelSceneCard .travelPrimary');
    assert.equal((await state()).sceneId,'q-hello');
  };
  const answer=async(index=0)=>{
    assert.equal(await evaluate(`document.querySelectorAll('.travelAnswer').length`),4);
    await tap('.travelAnswer',index);
    assert.equal(await evaluate(`document.querySelectorAll('.travelAnswer.selected').length`),1);
    await tap('.travelQuestionCard .travelPrimary');
    return state();
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
    const firstTitle=await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`);
    if(routeId==='taxi')assert.equal(firstTitle,'運転手に行き先を伝えよう');
    else assert.equal(firstTitle,'交通カードで改札を通ろう');
    if(reloadAtTransfer){
      await send('Page.reload',{ignoreCache:true});await ready();await sleep(160);
      assert.equal((await state()).sceneId,'q-ticket');
      assert.equal(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`),firstTitle);
    }
    if(routeId==='express')await shot('06-rail-transfer.png');
    if(routeId==='taxi')await shot('07-taxi-direct.png');
    await answer(0);await nextQuestion();
    if(routeId==='taxi')assert.equal(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`),'降りる場所を確認しよう');
    if(taxiBackResume){
      await tap('.travelBack');
      assert.equal(await evaluate(`document.querySelectorAll('.travelMap .travelStop').length`),2,'taxi route map must skip Seoul Station');
      assert.equal(await evaluate(`document.querySelector('.travelMap').style.getPropertyValue('--travel-stops')`),'2');
      await tap('.travelEpisodeCard .travelPrimary');
      assert.equal(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`),'降りる場所を確認しよう');
    }
    await answer(0);await nextQuestion();
    if(routeId==='taxi')assert.equal(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`),'運転手にお礼を伝えよう');
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
  const durableBefore=await evaluate(`({vocab:JSON.parse(localStorage.getItem('topikQuestV8')).vocab,gameUnlock:JSON.parse(localStorage.getItem('topikQuestV8')).gameUnlock,game:localStorage.getItem('topikQuestTopik1GameV1'),review:localStorage.getItem('malbitWrongReviewV3')})`);

  await evaluate(`S.view='game';save();render()`);await shot('01-game-entry.png');
  await startFresh();
  await setViewport(375,667);
  const firstViewport=await evaluate(`(()=>{const first=document.querySelector('.travelAnswer').getBoundingClientRect();return{top:Math.round(first.top),bottom:Math.round(first.bottom),height:innerHeight,overflow:document.documentElement.scrollWidth-innerWidth}})()`);
  assert.ok(firstViewport.top<firstViewport.height-12,`first answer begins below the first mobile viewport: ${JSON.stringify(firstViewport)}`);
  assert.ok(firstViewport.overflow<=1,'small phone has horizontal overflow');
  await shot('02-first-question-375x667.png');
  await setViewport(390,844);await assertFits('first question');
  const beforeWrong=(await state()).clockMinutes;
  const wrong=await answer(1);
  assert.equal(wrong.answers['q-hello'].correct,false);assert.equal(wrong.clockMinutes-beforeWrong,4);assert.ok(!wrong.inventory.includes('airportMap'));
  assert.equal(await evaluate(`[...document.querySelectorAll('.travelAnswer')].filter(el=>getComputedStyle(el).display!=='none').length`),2,'wrong result should keep only the chosen and correct actions');
  assert.equal(await evaluate(`document.querySelector('.travelFeedback')?.classList.contains('bad')`),true);
  assert.equal(await evaluate(`!!document.querySelector('.travelListen p')`),false,'answering must not force the transcript open');
  await shot('03-wrong-recovery.png');

  await startFresh();
  await evaluate(`window.__travelAudio={played:0,cancelled:0};window.MALBIT_TTS={play:()=>window.__travelAudio.played++,cancel:()=>window.__travelAudio.cancelled++}`);
  await tap('.travelListen>button:first-child');assert.equal(await evaluate(`window.__travelAudio.played`),1);
  const correct=await answer(0);assert.equal(correct.answers['q-hello'].correct,true);assert.ok(correct.inventory.includes('airportMap'));
  assert.equal(await evaluate(`[...document.querySelectorAll('.travelAnswer')].filter(el=>getComputedStyle(el).display!=='none').length`),1,'correct result should collapse distractors');
  assert.match(await evaluate(`document.querySelector('.travelFeedback b')?.textContent`),/2,000旅ウォン/);
  await shot('04-correct-reward.png');
  await nextQuestion();assert.ok(await evaluate(`window.__travelAudio.cancelled`)>=1,'audio must stop when the scene changes');
  assert.equal(await evaluate(`document.querySelectorAll('.travelAnswers.hotspot img').length`),4);
  await answer(0);await nextQuestion();
  assert.equal(await evaluate(`document.querySelector('.travelQuestionCard h1')?.textContent`),'券売機に目的地を入れよう');
  assert.match(await evaluate(`document.querySelector('.travelContext')?.textContent`),/機械に話しかけるのではなく/);

  await runRoute(0,'all-stop');
  await runRoute(1,'express',{reloadAtTransfer:true});
  await runRoute(2,'taxi',{taxiBackResume:true});
  await shot('08-myeongdong-arrival.png');
  await send('Page.reload',{ignoreCache:true});await ready();await sleep(160);
  assert.equal((await state()).completed,true);assert.equal((await state()).route,'taxi');
  assert.ok(await evaluate(`document.body.innerText.includes('ROUTE CLEAR')`),'completed route must survive reload');

  const durableAfter=await evaluate(`({vocab:JSON.parse(localStorage.getItem('topikQuestV8')).vocab,gameUnlock:JSON.parse(localStorage.getItem('topikQuestV8')).gameUnlock,game:localStorage.getItem('topikQuestTopik1GameV1'),review:localStorage.getItem('malbitWrongReviewV3')})`);
  assert.deepEqual(durableAfter,durableBefore,'travel play must not alter vocabulary, game, or review records');
  assert.deepEqual(errors,[]);
  console.log('travel mobile QA: 375x667 + 390x844, real touch input, wrong recovery, all-stop/express/taxi, reload/back-resume, durable records, screenshots=8, errors=0');
}finally{
  try{socket?.close()}catch(error){}
  chrome.kill('SIGTERM');server.kill('SIGTERM');
}
