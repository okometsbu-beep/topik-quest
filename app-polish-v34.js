// MALBIT v34 · reliable listening settings and repeatable Hangul handwriting.
(function(){
'use strict';

const PREFS_KEY='malbitProductPrefsV1';
const BEGINNER_KEY='malbitBeginnerV1';
const LANG_INDEX={ko:0,ja:1,en:2,zh:3};
const WRITE_TARGETS=[
  ['ㅏ','아','v:ㅏ'],['ㅓ','어','v:ㅓ'],['ㅗ','오','v:ㅗ'],['ㅜ','우','v:ㅜ'],['ㅡ','으','v:ㅡ'],['ㅣ','이','v:ㅣ'],['ㅑ','야','v:ㅑ'],['ㅕ','여','v:ㅕ'],['ㅛ','요','v:ㅛ'],['ㅠ','유','v:ㅠ'],
  ['ㄱ','가','c:ㄱ'],['ㄴ','나','c:ㄴ'],['ㄷ','다','c:ㄷ'],['ㄹ','라','c:ㄹ'],['ㅁ','마','c:ㅁ'],['ㅂ','바','c:ㅂ'],['ㅅ','사','c:ㅅ'],['ㅇ','아','c:ㅇ'],['ㅈ','자','c:ㅈ'],['ㅎ','하','c:ㅎ']
];
let writingActive=false,writingIndex=0,canvasState={canvas:null,ctx:null,drawing:false,ink:false};

function appState(){return typeof S!=='undefined'?S:null}
function L(ko,ja,en,zh){return[ko,ja,en,zh][LANG_INDEX[appState()?.lang]??0]||ko}
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){return false}}
function listeningMode(){const mode=read(PREFS_KEY,{}).listeningMode;return['on','off','ask'].includes(mode)?mode:'ask'}
function announce(message){if(typeof toast==='function')toast(message)}

function syncListeningButtons(){
  const grid=document.querySelector('.malbitListeningGrid');if(!grid)return;
  const active=listeningMode(),modes=['on','off','ask'];
  [...grid.querySelectorAll('button')].forEach((button,index)=>{
    const mode=modes[index];if(!mode)return;
    button.dataset.listeningMode=mode;button.disabled=false;button.style.pointerEvents='auto';
    button.classList.remove('on');if(mode===active)button.classList.add('on');
    button.setAttribute('aria-pressed',String(mode===active));
    button.onclick=event=>{event.preventDefault();event.stopPropagation();window.malbitSetListeningMode(mode)};
  })
}
window.malbitSetListeningMode=mode=>{
  if(!['on','off','ask'].includes(mode))return false;
  const value=read(PREFS_KEY,{});value.listeningMode=mode;if(!write(PREFS_KEY,value))return false;
  syncListeningButtons();
  announce(mode==='on'?L('듣기 문제를 포함합니다.','聴解問題を含めます。','Listening questions included.','已包含听力题。'):mode==='off'?L('듣기 문제를 제외합니다.','聴解問題を除外します。','Listening questions excluded.','已排除听力题。'):L('다음 학습을 시작할 때 다시 물어봅니다.','次回の学習開始時にもう一度確認します。','We will ask again next time.','下次学习时会再次询问。'));
  return true
};

function beginnerProgress(){const p=read(BEGINNER_KEY,{known:[],quiz:0,correct:0,writing:{}});p.known=Array.isArray(p.known)?p.known:[];p.writing=p.writing&&typeof p.writing==='object'?p.writing:{};return p}
function target(){return WRITE_TARGETS[((writingIndex%WRITE_TARGETS.length)+WRITE_TARGETS.length)%WRITE_TARGETS.length]}
function writingPanel(){
  const p=beginnerProgress(),[letter,sound]=target(),count=Number(p.writing[letter])||0,total=Object.values(p.writing).reduce((sum,value)=>sum+(Number(value)||0),0);
  return `<section class="v34WritingPractice"><header><small>STEP 3 · HANDWRITING</small><h2>${L('손으로 한글을 익혀요','手でハングルを覚えよう','Learn Hangul by hand','用手练习韩文')}</h2><p>${L('연한 글자를 따라 손가락이나 펜으로 쓰고, 원하는 만큼 지우고 반복하세요.','薄い文字を指やペンでなぞり、何度でも消して繰り返せます。','Trace with a finger or pen, erase, and repeat as often as you like.','用手指或笔描写浅色字，可随时擦除并反复练习。')}</p></header><div class="v34WritingTarget"><button onclick="malbitBeginnerWritingNext(-1)" aria-label="${L('이전 글자','前の文字','Previous letter','上一个字')}">‹</button><button class="v34TargetSound" onclick="malbitBeginnerSpeak('${sound}')"><b>${letter}</b><span>${sound} · 🔊</span><small>${L(`${count}번 연습`,`練習 ${count}回`,`${count} practices`,`练习 ${count} 次`)}</small></button><button onclick="malbitBeginnerWritingNext(1)" aria-label="${L('다음 글자','次の文字','Next letter','下一个字')}">›</button></div><div class="v34WritingBoard"><span aria-hidden="true">${letter}</span><canvas id="malbitHangulCanvas" aria-label="${L(`${letter} 손글씨 연습장`,`${letter} 手書き練習`,`${letter} handwriting pad`,`${letter} 手写练习区`)}"></canvas></div><div class="v34WritingActions"><button onclick="malbitBeginnerWritingClear()">↺ ${L('지우고 다시 쓰기','消してもう一度','Clear and retry','清除重写')}</button><button class="done" onclick="malbitBeginnerWritingDone()">✓ ${L('한 번 썼어요','1回書きました','I wrote it once','写完一次')}</button></div><div class="v34WritingSummary"><b>${L(`총 ${total}번 썼어요`,`合計 ${total}回書きました`,`Written ${total} times total`,`累计书写 ${total} 次`)}</b><span>${L('횟수 제한 없이 계속 연습할 수 있어요.','回数制限なく練習できます。','Practice without a limit.','可不限次数继续练习。')}</span></div><div class="v34WritingTargets">${WRITE_TARGETS.map(([glyph,,id],index)=>`<button class="${index===writingIndex?'on':''}" onclick="malbitBeginnerChooseWrite(${index})"><b>${glyph}</b><small>${Number(p.writing[glyph])||0}</small></button>`).join('')}</div></section>`
}

function point(event,canvas){const rect=canvas.getBoundingClientRect();return{x:event.clientX-rect.left,y:event.clientY-rect.top}}
function initWritingCanvas(){
  const canvas=document.getElementById('malbitHangulCanvas');if(!canvas)return;
  const rect=canvas.getBoundingClientRect(),size=Math.max(240,Math.round(rect.width||300)),dpr=Math.min(Number(window.devicePixelRatio)||1,2),ctx=canvas.getContext('2d');
  if(!ctx)return;canvas.width=Math.round(size*dpr);canvas.height=Math.round(size*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=Math.max(7,size*.027);ctx.strokeStyle='#4e8cff';canvasState={canvas,ctx,drawing:false,ink:false};
  const start=event=>{event.preventDefault();canvasState.drawing=true;canvasState.ink=true;canvas.setPointerCapture?.(event.pointerId);const p=point(event,canvas);ctx.beginPath();ctx.moveTo(p.x,p.y)};
  const move=event=>{if(!canvasState.drawing)return;event.preventDefault();const events=event.getCoalescedEvents?.()||[event];for(const sample of events){const p=point(sample,canvas);ctx.lineTo(p.x,p.y)}ctx.stroke()};
  const end=event=>{if(!canvasState.drawing)return;event.preventDefault();canvasState.drawing=false;ctx.closePath();canvas.releasePointerCapture?.(event.pointerId)};
  canvas.addEventListener('pointerdown',start,{passive:false});canvas.addEventListener('pointermove',move,{passive:false});canvas.addEventListener('pointerup',end,{passive:false});canvas.addEventListener('pointercancel',end,{passive:false})
}
window.malbitBeginnerWritingClear=()=>{const {canvas,ctx}=canvasState;if(!canvas||!ctx)return;ctx.clearRect(0,0,canvas.width,canvas.height);canvasState.ink=false};
window.malbitBeginnerWritingDone=()=>{
  if(!canvasState.ink){announce(L('먼저 연한 글자를 따라 써 보세요.','まず薄い文字をなぞってください。','Trace the letter first.','请先描写浅色字。'));return false}
  const p=beginnerProgress(),[letter,,knownId]=target();p.writing[letter]=(Number(p.writing[letter])||0)+1;if(!p.known.includes(knownId))p.known.push(knownId);write(BEGINNER_KEY,p);announce(L(`${letter}를 ${p.writing[letter]}번 썼어요.`,`${letter}を${p.writing[letter]}回書きました。`,`You wrote ${letter} ${p.writing[letter]} times.`,`${letter} 已写 ${p.writing[letter]} 次。`));window.render?.();return true
};
window.malbitBeginnerWritingNext=delta=>{writingIndex=(writingIndex+Number(delta||0)+WRITE_TARGETS.length)%WRITE_TARGETS.length;window.render?.()};
window.malbitBeginnerChooseWrite=index=>{writingIndex=Math.max(0,Math.min(WRITE_TARGETS.length-1,Number(index)||0));window.render?.()};

function installBeginnerTab(){
  const base=window.malbitBeginnerTab;if(typeof base!=='function'||base.__v34)return;
  const wrapped=tab=>{if(tab==='writing'){writingActive=true;window.render?.();return}writingActive=false;return base(tab)};wrapped.__v34=true;window.malbitBeginnerTab=wrapped
}
function patchBeginnerWriting(){
  if(appState()?.view!=='beginner'){writingActive=false;return}
  const tabs=document.querySelector('.v33BeginnerTabs'),tip=document.querySelector('.v33BeginnerTip');if(!tabs||!tip)return;
  const buttons=[...tabs.querySelectorAll('button')];if(buttons[2])buttons[2].textContent=L('4. 읽기','4. 読み','4. Reading','4. 阅读');
  let writing=tabs.querySelector('.v34WritingTab');if(!writing){writing=document.createElement('button');writing.className='v34WritingTab';writing.textContent=L('3. 쓰기','3. 書き','3. Writing','3. 书写');writing.onclick=()=>window.malbitBeginnerTab('writing');tabs.insertBefore(writing,buttons[2]||null)}
  if(!writingActive){writing.classList.remove('on');return}
  [...tabs.querySelectorAll('button')].forEach(button=>button.classList.remove('on'));writing.classList.add('on');
  let node=tabs.nextElementSibling;while(node&&node!==tip){const next=node.nextElementSibling;node.remove();node=next}
  const holder=document.createElement('div');holder.className='v34WritingHolder';holder.innerHTML=writingPanel();tip.parentNode.insertBefore(holder,tip);(window.requestAnimationFrame||window.setTimeout)(initWritingCanvas,0)
}
function patchVersion(){const badge=document.querySelector('.malbitPageTitle>span');if(badge&&/^v\d+$/i.test(badge.textContent.trim()))badge.textContent='v34'}
function afterRender(){installBeginnerTab();syncListeningButtons();patchBeginnerWriting();patchVersion()}
if(typeof window.render==='function'){const base=window.render;window.render=function(){const result=base.apply(this,arguments);afterRender();return result}}

const style=document.createElement('style');style.textContent=`
  .malbitListeningGrid button{appearance:none!important;pointer-events:auto!important;touch-action:manipulation!important;border:1px solid #365576!important;border-radius:15px!important;background:#132b48!important;color:#b9cbe1!important;box-shadow:none!important;cursor:pointer!important}.malbitListeningGrid button.on{border-color:#79a0ff!important;background:linear-gradient(145deg,#2858a8,#244985)!important;color:#fff!important;box-shadow:0 0 0 3px rgba(100,145,255,.18)!important}.malbitListeningGrid button:active{transform:scale(.97)}.malbitListeningGrid button:focus-visible{outline:3px solid #91b2ff;outline-offset:2px}
  .v33BeginnerTabs{grid-template-columns:repeat(4,1fr)!important}.v34WritingPractice{border:1px solid #2d4b6d;border-radius:23px;padding:14px;background:#0e2138}.v34WritingPractice header small{color:#77a9f4;font-size:7px;font-weight:950;letter-spacing:.13em}.v34WritingPractice header h2{margin:5px 0;font-size:16px}.v34WritingPractice header p{margin:0;color:#96aac4;font-size:9px;line-height:1.5}.v34WritingTarget{display:grid;grid-template-columns:42px 1fr 42px;align-items:center;gap:7px;margin:12px 0}.v34WritingTarget>button{border:1px solid #335477;border-radius:14px;min-height:46px;background:#142d4b;color:#fff;font-size:23px}.v34TargetSound{display:grid!important;grid-template-columns:auto 1fr auto!important;align-items:center;gap:9px;padding:7px 12px!important;text-align:left}.v34TargetSound b{font-size:25px}.v34TargetSound span{font-size:10px;font-weight:900}.v34TargetSound small{color:#8fa9c9;font-size:7.5px}.v34WritingBoard{position:relative;width:min(100%,390px);aspect-ratio:1;margin:auto;overflow:hidden;border:2px solid #355a7e;border-radius:25px;background:linear-gradient(90deg,transparent calc(50% - .5px),rgba(108,145,184,.24) 50%,transparent calc(50% + .5px)),linear-gradient(transparent calc(50% - .5px),rgba(108,145,184,.24) 50%,transparent calc(50% + .5px)),#f7fbff;box-shadow:inset 0 0 25px rgba(42,70,105,.12)}.v34WritingBoard>span{position:absolute;inset:0;display:grid;place-items:center;color:#d5deea;font-size:clamp(140px,52vw,220px);font-weight:800;line-height:1;pointer-events:none;user-select:none}.v34WritingBoard canvas{position:absolute;z-index:2;inset:0;width:100%;height:100%;touch-action:none;user-select:none}.v34WritingActions{display:grid;grid-template-columns:1fr 1.25fr;gap:7px;margin-top:9px}.v34WritingActions button{border:1px solid #365676;border-radius:14px;padding:11px 6px;background:#152f4d;color:#dbe9fb;font-size:8.5px;font-weight:950}.v34WritingActions button.done{border:0;background:linear-gradient(135deg,#397cf0,#765ce9);color:#fff}.v34WritingSummary{display:flex;align-items:center;justify-content:space-between;gap:7px;margin:10px 0 6px;color:#e5f0ff}.v34WritingSummary b{font-size:9px}.v34WritingSummary span{color:#8fa7c5;font-size:7px;text-align:right}.v34WritingTargets{display:grid;grid-auto-flow:column;grid-template-rows:repeat(2,44px);grid-auto-columns:44px;gap:6px;overflow-x:auto;padding:3px 1px 7px;scrollbar-width:none}.v34WritingTargets::-webkit-scrollbar{display:none}.v34WritingTargets button{position:relative;border:1px solid #2f4e70;border-radius:13px;background:#122b48;color:#dce9f9}.v34WritingTargets button.on{border-color:#79a0ff;background:#2858a8;color:#fff}.v34WritingTargets b{font-size:17px}.v34WritingTargets small{position:absolute;right:3px;bottom:2px;color:#91aed0;font-size:6px}
  html[data-theme="light"] .malbitListeningGrid button{border-color:#d3deec!important;background:#f1f5fa!important;color:#40516a!important}html[data-theme="light"] .malbitListeningGrid button.on{border-color:#5f88e8!important;background:#e3edff!important;color:#2355aa!important}html[data-theme="light"] .v34WritingPractice{border-color:#d7e2ef;background:#fff;color:#17243a;box-shadow:0 8px 22px rgba(40,57,82,.06)}html[data-theme="light"] .v34WritingPractice header p{color:#687b94}html[data-theme="light"] .v34WritingTarget>button,html[data-theme="light"] .v34WritingActions button,html[data-theme="light"] .v34WritingTargets button{border-color:#d5e0ec;background:#eef4fb;color:#233650}html[data-theme="light"] .v34WritingTargets button.on{border-color:#5f88e8;background:#e3edff;color:#2355aa}html[data-theme="light"] .v34WritingSummary{color:#233650}
  @media(max-width:390px){.v33BeginnerTabs button{font-size:7px!important}.v34WritingPractice{padding:11px}.v34TargetSound small{display:none}.v34WritingActions{grid-template-columns:1fr}}
`;
document.head.appendChild(style);installBeginnerTab();afterRender();
})();
