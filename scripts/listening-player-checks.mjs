import assert from 'node:assert/strict';

// Disposable CI profile only. Actual shipped MP3s, never synthetic learner records.
export async function verifyListeningPlayer({evaluate,tap,shot,setViewport,sleep}){
 assert.equal(await evaluate(`['localhost','127.0.0.1','[::1]'].includes(location.hostname)`),true);
 const original=await evaluate(`({lang:S.lang,theme:document.documentElement.dataset.theme,prefs:localStorage.getItem('malbitTtsPrefsV1')})`);
 const wait=async(expression,label)=>{for(let i=0;i<150;i++){if(await evaluate(expression))return;await sleep(100)}assert.fail(label)};
 try{
  await evaluate(`(()=>{const host=document.createElement('div');host.id='listeningPlayerQA';host.style.cssText='position:fixed;inset:0;z-index:2147483000;padding:12px;background:var(--ui-canvas);overflow:auto';document.body.append(host);window.__qaPlayerDraw=()=>host.innerHTML=HARUMAL_LISTENING_PLAYER.markup('__qaPlayerStart()','qa-dialogue');window.__qaPlayerStart=()=>{if(HARUMAL_LISTENING_PLAYER.busy('qa-dialogue'))return HARUMAL_LISTENING_PLAYER.cancel();window.__qaPlayerResult=null;HARUMAL_LISTENING_PLAYER.play({key:'qa-dialogue',script:LS[0].script,onResult:r=>window.__qaPlayerResult=r})};__qaPlayerDraw()})()`);
  await setViewport(320,844);await tap('#listeningPlayerQA .listeningToggle');
  await wait(`!document.querySelector('#listeningPlayerQA input').disabled`,'real dialogue metadata must enable study seeking');
  await sleep(1100);
  const progress=await evaluate(`({position:Number(document.querySelector('#listeningPlayerQA input').value),total:Number(document.querySelector('#listeningPlayerQA input').max),label:document.querySelector('#listeningPlayerQA .listeningToggle').textContent})`);
  assert.ok(progress.position>0&&progress.total>progress.position,'real MP3 advances within cumulative duration');assert.match(progress.label,/정지|停止|Stop/);
  for(const value of [.75,1,1.25,1.5]){await evaluate(`HARUMAL_LISTENING_PLAYER.setRate(${value})`);assert.equal(await evaluate(`Number(document.querySelector('#listeningPlayerQA select').value)`),value)}
  await evaluate(`HARUMAL_LISTENING_PLAYER.seek(Number(document.querySelector('#listeningPlayerQA input').max))`);
  await wait(`!!window.__qaPlayerResult`,'seek end settles');assert.equal(await evaluate(`__qaPlayerResult.heard`),false,'seeking cannot manufacture hearing');
  await tap('#listeningPlayerQA .listeningToggle');await sleep(200);await tap('#listeningPlayerQA .listeningToggle');
  assert.equal(await evaluate(`__qaPlayerResult.cancelled`),true);assert.equal(await evaluate(`Number(document.querySelector('#listeningPlayerQA input').value)`),0);
  for(const theme of ['light','dark'])for(const width of [320,390])for(const lang of ['ko','ja','en','zh']){
   await setViewport(width,844);await evaluate(`S.lang='${lang}';document.documentElement.dataset.theme='${theme}';__qaPlayerDraw()`);
   const fit=await evaluate(`(()=>{const root=document.querySelector('#listeningPlayerQA');return{overflow:root.scrollWidth-root.clientWidth,controls:[...root.querySelectorAll('button:not([hidden]),select,input')].filter(e=>e.getBoundingClientRect().height>0).map(e=>({height:e.getBoundingClientRect().height,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,label:e.getAttribute('aria-label')||e.textContent.trim()}))}})()`);
   assert.ok(fit.overflow<=1,`${lang} ${width} ${theme}: no overflow`);assert.ok(fit.controls.every(c=>c.height>=44&&c.left>=0&&c.right<=width&&c.label),`${lang} ${width} ${theme}: named 44px controls`);await shot(`listening-${lang}-${width}-${theme}.png`);
  }
 }finally{
  await evaluate(`HARUMAL_LISTENING_PLAYER.cancel();document.querySelector('#listeningPlayerQA')?.remove();delete window.__qaPlayerDraw;delete window.__qaPlayerStart;delete window.__qaPlayerResult;S.lang=${JSON.stringify(original.lang)};document.documentElement.dataset.theme=${JSON.stringify(original.theme)};${original.prefs===null?"localStorage.removeItem('malbitTtsPrefsV1')":`localStorage.setItem('malbitTtsPrefsV1',${JSON.stringify(original.prefs)})`}`);
 }
 console.log('Listening browser QA: real MP3 progress, stop/reset, seek evidence, four speeds and 16 localized mobile layouts passed.');
}
