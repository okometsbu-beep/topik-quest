// MALBIT v32 · compact expedition trail, 1–3 die, regular encounters, and ratio-safe combat art.
(function(){
'use strict';

const PREFS_KEY='malbitProductPrefsV1';
const SESSION_KEY='topikQuestTopik1Session';
const LANG_INDEX={ko:0,ja:1,en:2,zh:3};
let swipeStart=null;

function appState(){return typeof S!=='undefined'?S:null}
function L(ko,ja,en,zh){return[ko,ja,en,zh][LANG_INDEX[appState()?.lang]??0]||ko}
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(e){}}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function session(){return read(SESSION_KEY,null)}

function themeMode(){const value=read(PREFS_KEY,{}).theme;return['system','dark','light'].includes(value)?value:'system'}
function applyTheme(){
  const mode=themeMode(),darkSystem=window.matchMedia?.('(prefers-color-scheme: dark)').matches!==false,resolved=mode==='system'?(darkSystem?'dark':'light'):mode,root=document.documentElement;
  root.dataset.theme=resolved;root.dataset.themeMode=mode;root.style.colorScheme=resolved;
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=resolved==='dark'?'#071321':'#eef3fb';
  const scheme=document.querySelector('meta[name="color-scheme"]');if(scheme)scheme.content='dark light';
}
window.malbitSetTheme=mode=>{if(!['system','dark','light'].includes(mode))return;const prefs=read(PREFS_KEY,{});prefs.theme=mode;write(PREFS_KEY,prefs);applyTheme();if(typeof window.render==='function')window.render()};

function patchNavigationIcons(){
  const stats=document.getElementById('nav_stats')||document.getElementById('nav_speaking'),vocab=document.getElementById('nav_vocab');
  if(stats?.querySelector('b'))stats.querySelector('b').textContent='▥';
  if(vocab?.querySelector('b'))vocab.querySelector('b').textContent='▤';
}

function patchHome(){
  if(appState()?.view!=='home')return;
  document.querySelectorAll('.tqLongPressDiscovery,.tqVocabCoach').forEach(node=>node.remove());
  const hero=document.querySelector('.tqV9Hero'),level=document.querySelector('.tqHomeScreen>.t1level');
  if(hero&&level&&hero.nextElementSibling!==level)hero.after(level);
  document.querySelectorAll('.tqV9Modes button,.tqV9Utility button').forEach(button=>button.setAttribute('aria-label',button.textContent.replace(/\s+/g,' ').trim()));
}

function patchMore(){
  if(appState()?.view!=='more')return;
  const badge=document.querySelector('.malbitPageTitle>span'),version=window.__MALBIT_RUNTIME__?.version;if(badge&&version)badge.textContent=`v${version}`;
  if(document.querySelector('.malbitThemeSetting'))return;
  const settings=[...document.querySelectorAll('.malbitSetting')],language=settings.find(node=>/\uC571 \uC5B8\uC5B4|\u30A2\u30D7\u30EAの言語|App language|\u5E94\u7528\u8BED\u8A00/.test(node.textContent)),mode=themeMode();
  const html=`<section class="malbitSetting malbitThemeSetting"><h2>${L('화면 테마','画面テーマ','Appearance','显示主题')}</h2><p>${L('기기 설정을 따르거나 어두운·밝은 테마를 고정할 수 있어요.','端末設定に合わせるか、ダーク・ライトを固定できます。','Follow your device or lock MALBIT to dark or light mode.','跟随设备，或固定使用深色、浅色主题。')}</p><div class="malbitThemeGrid"><button class="${mode==='system'?'on':''}" onclick="malbitSetTheme('system')"><i>◐</i><span>${L('기기 설정','システム','System','跟随系统')}</span></button><button class="${mode==='dark'?'on':''}" onclick="malbitSetTheme('dark')"><i>☾</i><span>${L('어두운 테마','ダーク','Dark','深色')}</span></button><button class="${mode==='light'?'on':''}" onclick="malbitSetTheme('light')"><i>☀</i><span>${L('밝은 테마','ライト','Light','浅色')}</span></button></div></section>`;
  language?.insertAdjacentHTML('afterend',html);
}

function patchListeningNotice(){
  document.querySelectorAll('.audioHint').forEach(node=>{if(/\uB4F1록된|\u9332音音源|Uploaded recordings|\u4F18先播放/.test(node.textContent))node.remove()});
  document.querySelectorAll('.audioSource').forEach(node=>node.remove());
}

function patchGameHub(){
  if(appState()?.view!=='t1game')return;
  document.querySelectorAll('.tqGameHub .tqGameScene>.t1MonsterAvatar,.tqGameHub .t1MonsterSigil').forEach(node=>node.remove());
  document.querySelector('.tqGameMission>p')?.remove();
}

function patchMap(){
  const q=session();if(appState()?.view!=='t1quiz'||q?.mode!=='game'||q?.phase!=='map')return;
  document.querySelectorAll('.t1TrailFog,.t1MonsterSigil').forEach(node=>node.remove());
  const tool=document.querySelector('.malbitMapTools>span');if(tool)tool.textContent=L('원정 지도','遠征マップ','Expedition map','冒险地图');
  const eventCopy=document.querySelector('.t1TrailEvent p');if(eventCopy&&/암흑|暗闇|dark|\u9ED1\u6697/.test(eventCopy.textContent))eventCopy.textContent=L('지도를 보고 원하는 경로를 선택하세요.','地図を見て進みたいルートを選びましょう。','Study the map and choose your route.','查看地图并选择想走的路线。');
  const pawn=document.querySelector('.t1TrailPawn.moving');if(pawn&&!pawn.dataset.animated){pawn.dataset.animated='1';let path=[];try{path=JSON.parse(decodeURIComponent(pawn.dataset.path||''))}catch(e){}const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;if(!reduced&&path.length>1&&typeof pawn.animate==='function'){const frames=path.map(point=>({left:`${point.x}%`,top:`${point.y}%`})),motion=pawn.animate(frames,{duration:Math.max(650,(path.length-1)*210),easing:'linear',fill:'forwards'});motion.onfinish=()=>{pawn.style.left=`${pawn.dataset.targetX}%`;pawn.style.top=`${pawn.dataset.targetY}%`;motion.cancel()}}else requestAnimationFrame(()=>requestAnimationFrame(()=>{pawn.style.left=`${pawn.dataset.targetX}%`;pawn.style.top=`${pawn.dataset.targetY}%`}))}
  const toast=document.querySelector('.t1TrailToast');if(toast&&!toast.dataset.dismiss){toast.dataset.dismiss='1';setTimeout(()=>toast.remove(),3200)}
}

function patchBattle(){
  const q=session();if(appState()?.view!=='t1quiz'||q?.mode!=='game'||q?.phase!=='battle')return;
  const screen=document.getElementById('screen'),hud=screen?.querySelector(':scope>.t1hud'),battle=screen?.querySelector(':scope>.t1GameBattle'),timer=screen?.querySelector(':scope>.t1GameTimer');
  if(screen&&hud&&battle&&!screen.querySelector(':scope>.t1BattleSticky')){const sticky=document.createElement('section');sticky.className='t1BattleSticky';screen.insertBefore(sticky,hud);sticky.append(hud,battle);if(timer)sticky.append(timer)}
  const activeBattle=screen?.querySelector('.t1GameBattle.fx-player,.t1GameBattle.fx-enemy,.t1GameBattle.fx-shield');
  if(activeBattle&&!activeBattle.dataset.v27Fx){activeBattle.dataset.v27Fx='1';const fx=document.createElement('div'),kind=activeBattle.classList.contains('fx-player')?'player':activeBattle.classList.contains('fx-shield')?'shield':'enemy',impact=activeBattle.querySelector('.t1CombatImpact b')?.textContent||'';fx.className=`t1FullscreenCombatFx ${kind}`;fx.setAttribute('aria-hidden','true');fx.innerHTML=`<i></i><i></i><b>${escapeHtml(impact)}</b>`;screen.appendChild(fx);if(kind!=='shield'){document.documentElement.classList.remove('malbitScreenShake');void document.documentElement.offsetWidth;document.documentElement.classList.add('malbitScreenShake');setTimeout(()=>document.documentElement.classList.remove('malbitScreenShake'),720)}}
}

function randomQuestionState(){
  if(appState()?.view==='t1quiz'){
    const q=session();if(q?.mode!=='random'||!q.locked)return null;const id=q.ids?.[q.i],item=window.MALBIT_BANK?.byId(id)?window.MALBIT_BANK.present(String(id),q.choiceOrders?.[id]):(window.TOPIK1_QUESTIONS||[]).find(x=>String(x.id)===String(id));if(!item)return null;
    return{level:1,type:item.section==='listening'?'listen':'read',id:item.id,q:item,key:`t1:${id}:${q.total||0}`};
  }
  const state=appState();if(state?.view==='infinity'&&state.infinity?.feedback){const x=state.infinity.current,listen=typeof LS!=='undefined'?LS:[],read=typeof RW!=='undefined'?RW:[],item=x?.bankId&&window.MALBIT_BANK?window.MALBIT_BANK.present(x.bankId,x.choiceOrder):(x?.type==='listen'?listen[x.id-1]:read[x.id-1]);if(!item)return null;return{level:2,type:x.type,id:x.bankId||x.id,q:item,key:`t2:${x.type}:${x.bankId||x.id}:${state.infinity.count||0}`}}
  return null;
}

function originalQuestionText(state){
  const card=document.querySelector('.card'),q=state.q,parts=[];
  const instruction=card?.querySelector('.instruction')?.textContent.trim()||q.instruction||'';if(instruction)parts.push(instruction);
  if(state.type==='listen'&&q.script)parts.push(`${L('듣기 대본','聴解スクリプト','Listening transcript','听力原文')}:\n${q.script}`);
  const body=q.stem||q.prompt||'';if(body)parts.push(body);
  if(Array.isArray(q.choices)&&q.choices.length)parts.push(q.choices.map((choice,index)=>`${index+1}. ${String(choice).replace(/^[①②③④]\s*/,'')}`).join('\n'));
  return parts.filter(Boolean).join('\n\n');
}

async function translatedQuestion(state,source){
  const lang=appState()?.lang||'ko';if(lang==='ko')return source;
  const reviewed=window.MALBIT_REVIEWED_TRANSLATIONS?.[state.level]?.[state.type]?.[state.id]?.[lang];if(reviewed)return reviewed;
  if(typeof window.translateCached!=='function')return source;
  return window.translateCached(`random_whole_v24_${state.level}_${state.type}_${state.id}_${lang}`,source,'ko',lang);
}

async function localizedExplanation(state){
  const q=state.q,lang=appState()?.lang||'ko';let value=q.explanationI18n?.[lang]||q.explanationI18n?.ko||q.explanation||'';
  if(state.level===2&&window.MALBIT_LEARNING){value=state.type==='listen'?window.MALBIT_LEARNING.listeningExplanation(q):state.type==='read'?window.MALBIT_LEARNING.readingExplanation(q):value}
  if(lang!=='ko'&&!q.explanationI18n?.[lang]&&value&&typeof window.translateCached==='function')value=await window.translateCached(`random_reason_v24_${state.level}_${state.type}_${state.id}_${lang}`,value,'ko',lang);
  return value||L('정답의 근거를 본문과 선택지에서 다시 확인해 보세요.','本文と選択肢から正解の根拠を確認しましょう。','Review the passage and options for the evidence behind the answer.','请再次对照原文和选项，确认正确答案的依据。');
}

window.malbitToggleRandomExplanation=()=>{const panel=document.querySelector('.malbitRandomExplanation'),button=document.querySelector('.malbitExplanationToggle');if(!panel||!button)return;const open=!panel.classList.contains('open');panel.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));button.querySelector('span').textContent=open?L('해설 닫기','解説を閉じる','Hide explanation','收起解析'):L('해설 보기','解説を見る','Show explanation','查看解析')};

function patchRandomFeedback(){
  const state=randomQuestionState(),card=document.querySelector('.card');if(!state||!card||card.dataset.v24Feedback===state.key)return;card.dataset.v24Feedback=state.key;
  const strip=card.querySelector('.resultStrip'),inline=card.querySelector('.tqInlineExplanation'),detailed=card.querySelector('.malbitDetailedReviewLink');
  if(state.level===1&&strip){const correct=strip.classList.contains('good'),answer=Number(state.q.answerIndex)+1;strip.textContent=correct?L('정답입니다.','正解です。','Correct.','回答正确。'):L(`오답 · 정답은 ${answer}번입니다.`,`不正解 · 正解は${answer}番です。`,`Incorrect · The answer is option ${answer}.`,`答错 · 正确答案是第${answer}项。`)}
  const translation=document.createElement('section');translation.className='malbitQuestionTranslation';translation.dataset.key=state.key;translation.innerHTML=`<div><span>🌐</span><b>${L('문제 전체 번역','問題全体の翻訳','Full question translation','整题翻译')}</b><small>${L('문맥을 유지해 한 번에 읽어요','文脈を保ってまとめて読みます','Read as one context-preserving question','保留完整语境阅读')}</small></div><p>${L('번역을 준비하는 중…','翻訳を準備中…','Preparing translation…','正在准备翻译…')}</p>`;
  strip?.insertAdjacentElement('afterend',translation)||card.querySelector('.choices')?.insertAdjacentElement('afterend',translation);
  const panel=document.createElement('section');panel.className='malbitRandomExplanation';panel.innerHTML=`<div class="malbitExplanationLoading">${L('해설을 준비하는 중…','解説を準備中…','Preparing explanation…','正在准备解析…')}</div>`;
  const toggle=document.createElement('button');toggle.className='malbitExplanationToggle';toggle.type='button';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('onclick','malbitToggleRandomExplanation()');toggle.innerHTML=`<i>◉</i><span>${L('해설 보기','解説を見る','Show explanation','查看解析')}</span><b>⌄</b>`;
  translation.after(toggle,panel);
  if(inline){panel.replaceChildren(inline);if(detailed)panel.appendChild(detailed)}
  [...card.querySelectorAll('.closeBtn')].filter(button=>/\uD574설|\u89E3説|Explain|\u89E3析/.test(button.textContent)).forEach(button=>button.remove());
  const source=originalQuestionText(state);
  translatedQuestion(state,source).then(value=>{const node=translation.isConnected&&translation.dataset.key===state.key?translation.querySelector('p'):null;if(node)node.textContent=value}).catch(()=>{const node=translation.querySelector('p');if(node)node.textContent=source});
  if(!inline)localizedExplanation(state).then(value=>{const node=panel.querySelector('.malbitExplanationLoading');if(node){node.className='malbitExplanationBody';node.textContent=value}});
}

function randomNextButton(){if(!randomQuestionState())return null;return [...document.querySelectorAll('.card button')].find(button=>/\uB2E4음|\u6B21|Next|\u4E0B一题/.test(button.textContent)&&!button.disabled)||null}
document.addEventListener('touchstart',event=>{if(event.touches.length!==1||event.target.closest('button,input,textarea,select'))return;swipeStart={x:event.touches[0].clientX,y:event.touches[0].clientY,time:Date.now()}},{passive:true});
document.addEventListener('touchend',event=>{if(!swipeStart||event.changedTouches.length!==1)return;const end=event.changedTouches[0],dx=end.clientX-swipeStart.x,dy=end.clientY-swipeStart.y,elapsed=Date.now()-swipeStart.time;swipeStart=null;if(dx<-70&&Math.abs(dy)<55&&elapsed<900)randomNextButton()?.click()},{passive:true});

function removeSaveBanners(){document.querySelectorAll('.tqLongPressDiscovery,.tqVocabCoach').forEach(node=>node.remove())}
function postRender(){applyTheme();patchNavigationIcons();removeSaveBanners();patchHome();patchMore();patchListeningNotice();patchGameHub();patchMap();patchBattle();patchRandomFeedback()}

if(typeof window.render==='function'){
  const baseRender=window.render;window.render=function(){const out=baseRender.apply(this,arguments);postRender();requestAnimationFrame(postRender);return out};
}
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(themeMode()==='system')applyTheme()});
const cleanupObserver=new MutationObserver(()=>{removeSaveBanners();patchListeningNotice()});
cleanupObserver.observe(document.body,{subtree:true,childList:true});

const style=document.createElement('style');
style.textContent=`
  .nav button b{filter:none!important;color:inherit!important;font-family:inherit!important;font-size:19px}
  .tqHomeScreen>.t1level{margin:12px 0 0!important}.tqV9Hero,.tqV9Hero h2,.tqV9Hero p,.tqV9Hero b,.tqV9Hero small,.tqV9Hero span{color:#fff!important}.tqV9HeroBottom{width:100%!important}.tqV9HeroBottom h2,.tqV9HeroBottom p{max-width:72%}.tqV9HeroBottom p,.tqV9Ring small{color:#cad8ea!important}.tqV9Continue{width:100%!important;min-height:52px;font-size:13px!important}
  .tqV9Modes .tqV9Mode{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center!important;padding:14px 8px}.tqV9Mode i{margin:0 auto}.tqV9Mode b{margin-top:12px!important}.tqV9Mode small{text-align:center}
  .tqV9Utility button{min-height:96px;display:flex!important;flex-direction:column;justify-content:center;align-items:center;gap:7px!important;border:0!important;text-align:center!important;box-shadow:0 12px 25px rgba(0,0,0,.18)}.tqV9Utility button:first-child{background:linear-gradient(145deg,#d45b22,#ff8a3d)!important}.tqV9Utility button:last-child{background:linear-gradient(145deg,#cf356f,#f56399)!important}.tqV9Utility i{font-size:25px!important}.tqV9Utility span,.tqV9Utility b,.tqV9Utility small{text-align:center!important;color:#fff!important}.tqV9Utility b{font-size:12px!important}.tqV9Utility small{opacity:.82}
  .tqLongPressDiscovery,.tqVocabCoach{display:none!important}.audioSource:empty,.audioSource{display:none!important}
  .malbitThemeGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.malbitThemeGrid button{display:grid;place-items:center;gap:4px;border:1px solid #304c6e;border-radius:13px;padding:10px 5px;background:#132b48;color:#aebfd5;font-size:8px;font-weight:900}.malbitThemeGrid button i{font-style:normal;font-size:17px}.malbitThemeGrid button.on{border-color:#6d91ff;background:#214c91;color:#fff;box-shadow:0 0 0 2px rgba(105,145,255,.12)}
  html[data-theme="dark"] body.tq-stats-active,html[data-theme="dark"] body.tq-stats-active .app{background:#071321!important}html[data-theme="dark"] .bottom{background:rgba(7,16,29,.98)!important;border-color:#1d3552!important;box-shadow:0 -12px 30px rgba(0,0,0,.22)!important}html[data-theme="dark"] .nav button{color:#8096b3!important}html[data-theme="dark"] .nav button.active{background:#142c4b!important;color:#a8c6ff!important}html[data-theme="dark"] .malbitStats{background:linear-gradient(180deg,#0a1a2e,#071321)!important;color:#f4f8ff!important}html[data-theme="dark"] .malbitStats .malbitStatGrid article,html[data-theme="dark"] .malbitStats .malbitPace,html[data-theme="dark"] .malbitStats .malbitSkills{border-color:#29415f!important;background:#0e2037!important;color:#f4f8ff!important;box-shadow:none!important}html[data-theme="dark"] .malbitStats .malbitPace span{background:#132b48!important}html[data-theme="dark"] .malbitStats .malbitStatGrid small,html[data-theme="dark"] .malbitStats .malbitPace small,html[data-theme="dark"] .malbitStats .malbitSkills small,html[data-theme="dark"] .malbitStats .malbitSectionTitle>span{color:#91a6c2!important}html[data-theme="dark"] .malbitStats .malbitEmptyCompact{border-color:#34506f;color:#91a6c2}html[data-theme="dark"] .malbitStats .malbitPageTitle>button{background:#10233d!important;border-color:#2b4464!important}
  html[data-theme="light"] body,html[data-theme="light"] .app{background:#eef3fb!important;color:#162239!important}html[data-theme="light"] body.tq-home-active .app,html[data-theme="light"] body.tq-home-active{background:radial-gradient(circle at 90% 3%,#d7e7ff,transparent 35%),#eef3fb!important;color:#162239!important}html[data-theme="light"] body.tq-home-active .bottom,html[data-theme="light"] .bottom{background:rgba(249,251,255,.97)!important;border-color:#dbe4f0!important;box-shadow:0 -12px 30px rgba(44,62,91,.08)!important}html[data-theme="light"] .nav button{color:#7b8ba2!important}html[data-theme="light"] .nav button.active{background:#dfe9f8!important;color:#2868d8!important}html[data-theme="light"] .tqHomeLogo,html[data-theme="light"] .tqV9Greeting h1{color:#17243a!important}html[data-theme="light"] .tqStreak,html[data-theme="light"] .tqLang{background:#fff!important;border-color:#dbe4ef!important;color:#1b2b43!important}html[data-theme="light"] .tqHomeScreen>.t1level{background:#fff!important;border-color:#dce5f0!important}html[data-theme="light"] .tqHomeScreen>.t1level button{color:#74849a!important}html[data-theme="light"] .tqHomeScreen>.t1level button.on{color:#fff!important}html[data-theme="light"] .tqV9Week{background:#fff!important;border-color:#dce5f0!important;color:#18253b!important}html[data-theme="light"] .tqV9Day i{background:#edf2f8!important}html[data-theme="light"] .malbitMoreScreen{color:#17243a!important}html[data-theme="light"] .malbitSetting,html[data-theme="light"] .malbitHelp{background:#fff!important;border-color:#dce5ef!important}html[data-theme="light"] .malbitSetting p,html[data-theme="light"] .malbitHelp p,html[data-theme="light"] .malbitHelp ul{color:#6e7d93!important}html[data-theme="light"] .malbitLangGrid button,html[data-theme="light"] .malbitChoiceRow button,html[data-theme="light"] .malbitMixGrid button,html[data-theme="light"] .malbitThemeGrid button{background:#f1f5fa;color:#40516a;border-color:#d9e2ed}html[data-theme="light"] .malbitLangGrid button.on,html[data-theme="light"] .malbitChoiceRow button.on,html[data-theme="light"] .malbitMixGrid button.on,html[data-theme="light"] .malbitThemeGrid button.on{background:#e3edff;color:#2355aa;border-color:#5f88e8}html[data-theme="light"] .malbitPageTitle h1{color:#17243a!important}html[data-theme="light"] .malbitStats{background:#eef3fb!important;color:#18243b!important}html[data-theme="light"] .malbitStats .malbitStatGrid article,html[data-theme="light"] .malbitStats .malbitPace,html[data-theme="light"] .malbitStats .malbitSkills{background:#fff!important;color:#18243b!important}
  .tqGameHub .tqGameScene>.tqGameHeroSvg{left:50%!important;right:auto!important;bottom:10px!important;width:184px!important;height:220px!important;transform:translateX(-50%);z-index:3}.tqGameHub .tqGameSpeech{max-width:62%;right:12px}.tqGameMission{padding-top:16px!important}.tqGameMission h2{margin-bottom:16px!important;color:#fff!important}.tqGameMission>p{display:none!important}.t1GameLoadout .t1GameGear{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center!important}.t1GameGear i{margin:0 auto}.t1GameGear b,.t1GameGear small{text-align:center}.t1GameMetaRow{gap:8px}.t1RunCurrencies{display:flex;gap:6px}.t1RunCurrencies span,.t1TrailStats span,.t1hud span{display:inline-flex;align-items:center;gap:5px}.malbitGoldCoin{display:inline-grid;place-items:center;width:17px;height:17px;border-radius:50%;border:1px solid #ffdc64;background:radial-gradient(circle at 32% 28%,#fff6ac 0 11%,#ffd13d 12% 42%,#d99508 65%,#8c5600 100%);color:#9a6100!important;font-style:normal;font-size:0;box-shadow:inset 0 0 0 2px rgba(126,72,0,.22),0 0 8px rgba(255,194,36,.25)}.malbitGoldCoin:after{content:'★';font-size:8px;color:#9b6200}.malbitWordlight{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:7px;background:radial-gradient(circle,#fff 0 8%,#a7eaff 19%,#7a82ff 48%,#6037bb 70%,transparent 72%);color:#fff!important;font-style:normal;font-size:13px;text-shadow:0 0 5px #fff;filter:drop-shadow(0 0 5px #8cc8ff);animation:malbitSpark 1.8s ease-in-out infinite}.t1Health{color:#ff4967!important;font-size:13px;letter-spacing:1px;text-shadow:0 0 8px rgba(255,73,103,.24)}
  .t1TrailGrid{height:980px!important;border-radius:23px;background:linear-gradient(rgba(4,14,28,.08),rgba(4,14,28,.16)),url('assets/art/malbit-stage-map.webp') center/cover no-repeat!important;box-shadow:inset 0 0 30px rgba(1,7,16,.42)}.t1TrailPath{opacity:.42}.t1TrailPath line{stroke:#83b8d7!important;stroke-width:2!important;stroke-dasharray:1.5 3!important}.t1TrailNode{width:37px!important;height:37px!important;font-size:13px!important;background:rgba(8,30,49,.88)!important;backdrop-filter:blur(3px)}.t1TrailNode small{width:15px!important;height:15px!important;font-size:6px!important}.t1TrailNode.current{box-shadow:0 0 0 5px rgba(255,201,72,.18),0 8px 18px rgba(0,0,0,.42)!important}.t1TrailFog{display:none!important}.t1TrailPawn{position:absolute;z-index:8;display:block;width:48px;height:66px;transform:translate(-50%,-78%);transition:left .82s cubic-bezier(.2,.78,.18,1),top .82s cubic-bezier(.2,.78,.18,1);pointer-events:none;filter:drop-shadow(0 8px 8px rgba(0,0,0,.55))}.t1TrailPawn:after{content:'';position:absolute;left:50%;bottom:2px;width:27px;height:9px;border-radius:50%;background:rgba(0,0,0,.42);transform:translateX(-50%);z-index:-1}.t1TrailPawn img{width:100%;height:100%;object-fit:contain}.malbitMapTools>span:before{content:'✦ ';color:#7eb8ff}
  .t1BattleSticky{position:sticky;top:0;z-index:35;margin:0 -14px 10px;padding:8px 14px 10px;background:linear-gradient(180deg,rgba(7,21,40,.99),rgba(7,21,40,.93));border-bottom:1px solid #294b70;backdrop-filter:blur(14px);box-shadow:0 13px 24px rgba(0,0,0,.24)}.t1BattleSticky .t1hud{margin:0 0 8px;overflow-x:auto;scrollbar-width:none}.t1BattleSticky .t1hud::-webkit-scrollbar{display:none}.t1GameBattle{grid-template-columns:124px 1fr!important;min-height:132px!important;padding:7px 12px!important;overflow:visible!important}.t1GameBattle .t1MonsterAvatar{width:122px!important;height:122px!important;aspect-ratio:1}.t1GameBattle .tqGameMonsterArt{width:122px!important;height:122px!important;background-size:400% 200%!important}.t1BattleCopy{min-width:0}.t1BattleCopy b{font-size:12px!important}.t1BattleCopy small{font-size:8px!important;line-height:1.45}.t1BattleSticky .t1GameTimer{margin:8px 0 0}.t1FullscreenCombatFx{position:fixed;z-index:220;inset:0;pointer-events:none;overflow:hidden;animation:v24ScreenFade .78s ease-out both}.t1FullscreenCombatFx:before{content:'';position:absolute;inset:0}.t1FullscreenCombatFx.player:before{background:radial-gradient(circle at 63% 31%,rgba(255,249,171,.72),transparent 23%),linear-gradient(125deg,transparent 40%,rgba(255,255,255,.8) 48%,transparent 54%)}.t1FullscreenCombatFx.enemy:before{background:radial-gradient(circle at center,transparent 35%,rgba(255,33,73,.58) 100%);box-shadow:inset 0 0 55px #ff2349}.t1FullscreenCombatFx.shield:before{background:radial-gradient(circle at 50% 40%,rgba(103,159,255,.52),transparent 38%)}.t1FullscreenCombatFx i{position:absolute;left:16%;top:42%;width:75%;height:7px;border-radius:99px;background:#fff;box-shadow:0 0 10px #fff,0 0 28px #ffe66f;transform:rotate(-27deg)}.t1FullscreenCombatFx i:nth-child(2){top:48%;transform:rotate(24deg)}.t1FullscreenCombatFx.enemy i,.t1FullscreenCombatFx.shield i{display:none}.t1FullscreenCombatFx b{position:absolute;left:50%;top:25%;transform:translateX(-50%);font-size:42px;color:#fff7bd;text-shadow:0 4px 0 #a62e4c,0 0 24px #ff557a}.t1FullscreenCombatFx.enemy b{color:#ffd2dc}.t1FullscreenCombatFx.shield b{color:#dce8ff;text-shadow:0 4px 0 #38538f,0 0 24px #73a4ff}
  .t1TrailGrid{height:720px!important;background:linear-gradient(rgba(4,14,28,.04),rgba(4,14,28,.12)),url('assets/art/malbit-stage-map.webp') center/100% 100% no-repeat!important}.t1TrailPath{opacity:.16!important}.t1TrailNode{width:31px!important;height:31px!important;font-size:11px!important;border-width:1px!important;background:rgba(7,27,45,.82)!important}.t1TrailNode small{display:none!important}.t1TrailPawn{width:42px!important;height:58px!important}.t1TrailAction{position:relative;padding-top:2px!important}.t1TrailEvent,.t1LastRoll{display:none!important}.t1TrailToast{position:absolute;z-index:24;left:0;right:0;bottom:calc(100% + 8px);display:flex;align-items:center;gap:9px;min-height:44px;border:1px solid rgba(113,164,220,.58);border-radius:15px;padding:9px 12px;background:rgba(7,25,45,.94);color:#eef6ff;box-shadow:0 14px 34px rgba(0,0,0,.38);backdrop-filter:blur(13px);animation:malbitTrailToast 3.2s ease both}.t1TrailToast i{display:grid;place-items:center;width:28px;height:28px;border-radius:9px;background:#173a5f;color:#ffd267;font-style:normal}.t1TrailToast span{font-size:9px;font-weight:900;line-height:1.4}.t1DiceButton{display:grid!important;grid-template-columns:49px 1fr;align-items:center;gap:9px;min-height:64px;margin-top:0!important;padding:8px 13px!important;text-align:left!important}.t1DiceButton:disabled{opacity:1!important}.t1TrailRollVisual{display:grid;place-items:center}.t1DiceButton .t1TrailDice{width:42px;height:42px;margin:0}.t1DiceButton .t1TrailDice i{font-size:32px}.t1TrailRollCopy b,.t1TrailRollCopy small{display:block}.t1TrailRollCopy b{font-size:12px}.t1TrailRollCopy small{margin-top:3px;color:rgba(255,255,255,.78);font-size:8px}.t1DiceButton.landed{background:linear-gradient(135deg,#168c77,#31b58c)!important;box-shadow:0 0 0 4px rgba(54,220,169,.1),0 12px 28px rgba(11,111,91,.3)!important}
  .t1MonsterAvatar{border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;padding:0!important;overflow:visible!important}.tqGameMonsterArt{display:block!important;width:100%!important;height:100%!important;background:none!important;object-fit:contain!important;object-position:center bottom!important;aspect-ratio:auto!important}.t1GameBattle{grid-template-columns:minmax(112px,140px) 1fr!important;gap:8px!important;border-radius:22px!important}.t1GameBattle .t1MonsterAvatar{width:100%!important;height:136px!important;aspect-ratio:auto!important}.t1GameBattle .tqGameMonsterArt{width:100%!important;height:100%!important;background:none!important}.t1BattleCopy{align-self:center}.t1EnemyHealth{margin:6px 0 5px;color:var(--enemy-heart,#a77cff);font-size:16px;font-weight:1000;letter-spacing:2px;line-height:1;text-shadow:0 0 10px color-mix(in srgb,var(--enemy-heart,#a77cff) 55%,transparent)}.t1TrailSceneCopy .t1EnemyHealth{display:inline-block;margin:0;font-size:11px;letter-spacing:1px}.t1GameResultArt>.t1MonsterAvatar{right:8%!important;width:155px!important;height:148px!important}.t1GameResultArt .tqGameMonsterArt{width:100%!important;height:100%!important;object-fit:contain!important}.t1GameResultArt{overflow:visible!important}
  .malbitQuestionTranslation{margin-top:13px;border:1px solid #cbdcf5;border-radius:18px;padding:13px;background:linear-gradient(145deg,#eaf3ff,#f8fbff);color:#17243a}.malbitQuestionTranslation>div{display:grid;grid-template-columns:28px 1fr;column-gap:7px}.malbitQuestionTranslation>div>span{grid-row:1/3;display:grid;place-items:center;width:28px;height:28px;border-radius:9px;background:#d8e8ff}.malbitQuestionTranslation b{font-size:12px;color:#285ea9}.malbitQuestionTranslation small{font-size:8px;color:#70839d}.malbitQuestionTranslation p{white-space:pre-wrap;margin:11px 0 0!important;border-top:1px solid #d7e4f6;padding-top:10px;color:#263951!important;font-size:11px!important;line-height:1.65!important}.malbitExplanationToggle{width:100%;display:grid;grid-template-columns:25px 1fr auto;align-items:center;gap:7px;margin-top:9px;border:1px solid #314c70;border-radius:14px;padding:11px;background:#122a47;color:#fff;text-align:left;font-size:10px;font-weight:950}.malbitExplanationToggle i{font-style:normal;color:#72a6ff}.malbitExplanationToggle b{font-size:15px}.malbitExplanationToggle[aria-expanded="true"] b{transform:rotate(180deg)}.malbitRandomExplanation{display:none}.malbitRandomExplanation.open{display:block}.malbitRandomExplanation>.tqInlineExplanation,.malbitExplanationBody{margin-top:8px!important}.malbitExplanationBody{border:1px solid #cfe0f5;border-radius:16px;padding:13px;background:#f7fbff;color:#263951;font-size:11px;line-height:1.65}.malbitExplanationLoading{margin-top:8px;border-radius:14px;padding:12px;background:#edf3fb;color:#718199;font-size:9px}.malbitRandomExplanation .malbitDetailedReviewLink{margin-bottom:2px}
  @keyframes malbitSpark{50%{transform:rotate(12deg) scale(1.12);filter:drop-shadow(0 0 9px #a9e8ff) brightness(1.2)}}@keyframes v24ScreenFade{0%{opacity:0}22%{opacity:1}100%{opacity:0}}@keyframes malbitTrailToast{0%{opacity:0;transform:translateY(8px) scale(.98)}10%,68%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-7px)}}@keyframes malbitWholeScreenShake{0%,100%{transform:none}10%{transform:translate3d(-7px,2px,0) rotate(-.35deg)}22%{transform:translate3d(8px,-3px,0) rotate(.35deg)}34%{transform:translate3d(-6px,3px,0)}47%{transform:translate3d(6px,-2px,0)}61%{transform:translate3d(-4px,1px,0)}76%{transform:translate3d(3px,-1px,0)}}html.malbitScreenShake body{animation:malbitWholeScreenShake .62s cubic-bezier(.36,.07,.19,.97) both;overflow-x:hidden}
  @media(max-width:380px){.tqV9HeroBottom h2,.tqV9HeroBottom p{max-width:78%}.t1TrailGrid{height:660px!important}.t1GameBattle{grid-template-columns:108px 1fr!important}.t1GameBattle .t1MonsterAvatar{height:126px!important}.t1RunCurrencies{gap:3px}.t1RunCurrencies span{padding:5px 6px!important}}
  @media(prefers-reduced-motion:reduce){.malbitWordlight{animation:none}.t1TrailPawn{transition:none}.t1FullscreenCombatFx,.t1TrailToast,html.malbitScreenShake body{animation-duration:.01ms}}
`;
document.head.appendChild(style);
applyTheme();postRender();
})();
