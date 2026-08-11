// MALBIT v23 · final interaction, accessibility and visual-quality pass.
(function(){
'use strict';

const LANG_INDEX={ko:0,ja:1,en:2,zh:3};
const FOCUS_VIEWS=new Set(['shorts','t1quiz','infinity','real','gameQ']);
let activeModal=null,lastFocused=null;

function L(ko,ja,en,zh){const lang=typeof S!=='undefined'?S?.lang:'ko';return [ko,ja,en,zh][LANG_INDEX[lang]??0]||ko}
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}}
function currentSession(){return read('topikQuestTopik1Session',null)}

function patchShorts(){
  if(S?.view!=='shorts')return;
  const saved=read('topikQuestShortsV1',{}),lv=Number(saved.activeLevel)||Number(localStorage.getItem('topikQuestExamLevel'))||1,p=saved.levels?.[lv]||saved.levels?.[String(lv)]||{};
  const status=document.querySelector('.shortsTop>span');
  if(status){const streak=Number(p.streak)||0;status.textContent=streak?`🔥 ${streak}`:Number(p.total)?L('다시 도전','もう一度','Try again','再次挑战'):L('첫 도전','初挑戦','First try','首次挑战');status.setAttribute('aria-label',streak?L(`${streak}문제 연속 정답`,`${streak}問連続正解`,`${streak} correct in a row`,`${streak}题连续答对`):status.textContent)}
  const bar=document.querySelector('.shortsProgress i');if(bar)bar.style.width=`${(Number(p.total)||0)%10*10}%`;
  document.querySelector('.shortsWord')?.setAttribute('lang','ko');
  document.querySelectorAll('.shortsCard .tqVocabCoach').forEach(x=>x.remove());
}

function patchFocusedQuiz(){
  if(S?.view!=='t1quiz')return;
  const session=currentSession(),attack=document.querySelector('.card .attack');
  if(attack)attack.textContent=attack.textContent.replace(/\s*›\s*›\s*$/,' ›');
  const hud=[...document.querySelectorAll('.t1hud span')].find(x=>/^🔥\s*0$/.test(x.textContent.trim()));
  if(hud)hud.textContent=L('첫 문제','最初の問題','First question','第一题');
  const exit=[...document.querySelectorAll('button')].find(x=>/^(종료|終了|Exit|退出)$/.test(x.textContent.trim()));
  if(exit)exit.setAttribute('aria-label',L('학습을 종료하고 홈으로','学習を終了してホームへ','Exit practice and return home','结束练习并返回首页'));
  const wrong=document.querySelector('.resultStrip.bad,.t1GameCombatNotice.bad');
  const explanation=document.querySelector('.tqInlineExplanation');
  if(wrong&&explanation&&!document.querySelector('.malbitDetailedReviewLink')&&session?.mode!=='game'){
    explanation.insertAdjacentHTML('afterend',`<button class="malbitDetailedReviewLink" onclick="setView('review')">${L('이 문제를 상세 복습에서 다시 풀기','この問題を詳しい復習でもう一度解く','Retry this question with detailed review','在详细复习中重做此题')} ›</button>`);
  }
}

function patchGameHub(){
  if(S?.view!=='t1game')return;
  const mission=document.querySelector('.tqGameMission>p'),meta=mission?.querySelector('.t1MonsterMeta');
  if(mission&&meta&&mission.firstChild)mission.firstChild.textContent=L('48칸의 불규칙한 길과 네 번의 갈림길을 6면 주사위로 탐험합니다. 상점·보물·함정과 안개를 지나 보스를 쓰러뜨리세요.','48マスの不規則な道と4つの分岐を6面サイコロで探索。店・宝・罠・霧を越えてボスを倒そう。','Explore a 48-space irregular trail with four forks and a six-sided die. Survive shops, treasure, traps, and fog to defeat the boss.','用六面骰探索48格不规则路线与四处岔路，穿过商店、宝箱、陷阱和迷雾击败首领。');
  const slots=[
    {icon:'🗡️',name:L('무기 슬롯','武器スロット','Weapon slot','武器栏')},
    {icon:'🛡️',name:L('방어구 슬롯','防具スロット','Armor slot','防具栏')},
    {icon:'🧿',name:L('부적 슬롯','お守りスロット','Charm slot','护符栏')}
  ];
  document.querySelectorAll('.t1GameLoadout .t1GameGear:not(.on)').forEach((node,i)=>{const slot=slots[i];if(!slot)return;const icon=node.querySelector('i'),name=node.querySelector('b'),desc=node.querySelector('small');if(icon)icon.textContent=slot.icon;if(name)name.textContent=slot.name;if(desc)desc.textContent=L('원정에서 발견할 수 있어요','遠征中に見つかります','Find it during an expedition','可在冒险中发现')});
  const legend=document.querySelector('.t1RarityLegend');
  if(legend&&!legend.previousElementSibling?.classList.contains('malbitRarityTitle'))legend.insertAdjacentHTML('beforebegin',`<div class="malbitRarityTitle"><b>${L('아이템 등급','アイテム等級','Item rarity','道具稀有度')}</b><small>${L('상점·보물 등장 확률','店・宝での出現率','Shop & treasure odds','商店与宝箱出现概率')}</small></div>`);
  const world=document.querySelector('.tqGameWorldNav');
  if(world){world.querySelectorAll('button').forEach(x=>x.remove());world.classList.add('compact')}
  const disclaimer=document.querySelector('.tqGameTts');
  if(disclaimer)disclaimer.innerHTML=`<i>●</i> ${L('독자 제작 문제와 몬스터 아트를 사용하는 비공식 TOPIK 대비 앱이며 시험 주관기관과 관련이 없습니다','独自制作の問題とモンスターアートを使用する非公式TOPIK対策アプリで、試験主催機関とは関係ありません','An independent TOPIK prep app with original questions and monster art; not affiliated with the exam administrator','使用原创题目与怪物美术的非官方TOPIK备考应用，与考试主办机构无关')}`;
}

function patchReview(){
  if(S?.view!=='review')return;
  const intro=document.querySelector('.tqReviewHero p');
  if(intro)intro.textContent=L('문제의 핵심 근거와 각 선택지를 확인하고, 다시 맞히면 해결 처리됩니다.','問題の根拠と各選択肢を確認し、解き直して正解すると解決済みになります。','Check the key evidence and every option; a correct retry marks the question resolved.','查看关键依据与每个选项，重做答对后即标记为已掌握。');
  const stats=document.querySelectorAll('.tqReviewStats>div');
  if(stats.length>=3){const active=Number(document.querySelector('.tqReviewHero strong')?.childNodes?.[0]?.textContent)||0,mastered=Number(stats[1].querySelector('b')?.textContent)||0,total=active+mastered,rate=total?Math.round(mastered/total*100):100;stats[2].querySelector('b').textContent=`${rate}%`;stats[2].querySelector('small').textContent=L('해결률','解決率','Resolution rate','掌握率')}
  if(S.lang==='ko')document.querySelectorAll('.tqTranslationToggle').forEach(x=>x.hidden=true);
}

function patchStats(){
  if(S?.view!=='stats')return;
  const settings=document.querySelector('.malbitPageTitle>button');if(settings)settings.setAttribute('aria-label',L('학습 설정 열기','学習設定を開く','Open learning settings','打开学习设置'));
  const streak=document.querySelector('.malbitStatsHero p');
  if(streak&&/🔥\s*0/.test(streak.textContent))streak.textContent=L('오늘 첫 문제를 기다리고 있어요','今日の最初の問題を待っています','Your first question is ready','今日第一题已准备好');
  const events=read('malbitLearningEventsV1',[]),rec=document.querySelector('.malbitRecommendation');
  if(Array.isArray(events)&&events.length&&rec&&/숏츠|ショーツ|Shorts|短题/.test(rec.querySelector('h2')?.textContent||'')){
    const recent=[...events].reverse().find(x=>x.correct===false)||events[events.length-1],skill=recent?.skill||'mixed';
    const names={listening:L('듣기','聴解','listening','听力'),reading:L('읽기','読解','reading','阅读'),writing:L('쓰기','作文','writing','写作'),grammar:L('문법','文法','grammar','语法'),vocab:L('어휘','語彙','vocabulary','词汇'),word:L('단어','単語','vocabulary','单词')},name=names[skill]||L('종합','総合','mixed','综合');
    rec.querySelector('h2').textContent=L(`${name} 진단을 2문제로 완성해 보세요.`,`${name}の診断をあと2問で完成させましょう。`,`Complete your ${name} baseline with 2 more questions.`,`再做2题完成${name}诊断。`);
    const button=rec.querySelector('button');if(button)button.setAttribute('onclick',`malbitStartRecommendation('${skill}')`);
  }
}

function patchMore(){
  if(S?.view!=='more')return;
  const badge=document.querySelector('.malbitPageTitle>span');if(badge)badge.textContent='v23';
  const reminderTime=document.querySelector('.malbitToggleRow input[type="time"]');if(reminderTime)reminderTime.setAttribute('aria-label',L('복습 알림 시간','復習通知の時刻','Review reminder time','复习提醒时间'));
  if(typeof window.MALBIT_ACCOUNT_ADAPTER?.signIn!=='function')document.querySelector('.malbitAccountCard')?.remove();
  if(typeof window.MALBIT_BILLING_ADAPTER?.startCheckout!=='function')document.querySelector('.malbitPlusCard')?.remove();
  if(typeof window.MALBIT_ANALYTICS_ADAPTER?.track!=='function'){
    [...document.querySelectorAll('.malbitSetting')].find(x=>/제품 개선 분석|製品改善の分析|Product improvement analytics|产品改进分析/.test(x.textContent))?.remove();
  }
}

function patchCommon(){
  document.querySelectorAll('.malbitPageTitle small').forEach(x=>x.hidden=true);
  document.querySelectorAll('.vocab-token[role],.vocab-token[aria-label]').forEach(x=>{x.removeAttribute('role');x.removeAttribute('aria-label')});
  const languageLabel=L('설명 언어 바꾸기','説明言語を変更','Change explanation language','更改解析语言');
  document.getElementById('flagBtn')?.setAttribute('aria-label',languageLabel);document.querySelector('.tqLang')?.setAttribute('aria-label',languageLabel);
  const backLabel=L('이전 화면으로','前の画面へ','Back','返回上一页');document.querySelectorAll('.shortsTop>button,.tqGameNav>button,.t1TrailTop>button').forEach(x=>x.setAttribute('aria-label',backLabel));
  document.querySelectorAll('.malbitVocabActions .remove,.vocabActions .delete').forEach(x=>x.setAttribute('aria-label',L('단어장에서 삭제','単語帳から削除','Remove from vocabulary','从单词本删除')));
  document.querySelectorAll('.malbitShortProposal .dismiss').forEach(x=>x.setAttribute('aria-label',L('저장 제안 닫기','保存提案を閉じる','Dismiss save suggestion','关闭收藏建议')));
  const focus=FOCUS_VIEWS.has(S?.view),bottom=document.querySelector('.bottom');
  document.body.classList.toggle('malbitFocusMode',focus);
  if(bottom){bottom.inert=focus||!!activeModal;bottom.setAttribute('aria-hidden',String(focus||!!activeModal))}
}

function visibleModal(){
  return document.querySelector('#malbitOnboarding,#malbitDiagnostic,#tqVocabPopup.open,#overlay.open,.resultCurtain.open,.resultCurtain.show');
}

function focusables(root){return [...root.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(x=>!x.hidden&&x.getClientRects().length)}

function syncModal(){
  const modal=visibleModal(),app=document.querySelector('.app'),bottom=document.querySelector('.bottom'),flag=document.getElementById('flagMenu');
  if(modal!==activeModal){
    if(modal){lastFocused=document.activeElement instanceof HTMLElement?document.activeElement:null;requestAnimationFrame(()=>{const target=focusables(modal)[0]||modal;target.setAttribute?.('tabindex',target.getAttribute?.('tabindex')||'-1');target.focus?.({preventScroll:true})})}
    else if(lastFocused?.isConnected){requestAnimationFrame(()=>lastFocused.focus?.({preventScroll:true}));lastFocused=null}
    activeModal=modal;
  }
  const blocked=!!modal;
  if(app){app.inert=blocked;app.setAttribute('aria-hidden',String(blocked))}
  if(flag){flag.inert=blocked;flag.setAttribute('aria-hidden',String(blocked))}
  if(bottom){const focus=FOCUS_VIEWS.has(S?.view);bottom.inert=blocked||focus;bottom.setAttribute('aria-hidden',String(blocked||focus))}
  document.body.classList.toggle('malbitModalOpen',blocked);
}

function postRender(){
  patchShorts();patchFocusedQuiz();patchGameHub();patchReview();patchStats();patchMore();patchCommon();syncModal();
}

document.addEventListener('keydown',event=>{
  const modal=visibleModal();if(!modal)return;
  if(event.key==='Escape'){
    if(modal.id==='overlay'&&typeof window.closeSheet==='function')window.closeSheet();
    else if(modal.id==='tqVocabPopup')modal.querySelector('.tqVocabBackdrop')?.click();
    event.preventDefault();return;
  }
  if(event.key!=='Tab')return;const list=focusables(modal);if(!list.length)return;const first=list[0],last=list[list.length-1];if(event.shiftKey&&document.activeElement===first){last.focus();event.preventDefault()}else if(!event.shiftKey&&document.activeElement===last){first.focus();event.preventDefault()}
});

const observer=new MutationObserver(()=>{syncModal();if(S?.view==='review')patchReview()});
observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});

if(typeof render==='function'){
  const baseRender=render;
  render=function(){const out=baseRender.apply(this,arguments);postRender();requestAnimationFrame(postRender);return out};
}

const style=document.createElement('style');
style.textContent=`
  .tqGameMonsterArt{display:block;width:100%;height:100%;background-image:url('assets/art/malbit-monsters-atlas.webp');background-repeat:no-repeat;background-size:400% 200%;background-position:var(--sprite-x) var(--sprite-y);filter:drop-shadow(0 12px 15px rgba(0,0,0,.34));transform-origin:50% 80%}
  .tqGameHeroSvg{display:block;overflow:visible}.tqGameHeroSvg>img{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 10px 12px rgba(0,0,0,.28));pointer-events:none}
  .t1MonsterAvatar.is-hurt .tqGameMonsterArt{filter:brightness(1.12) saturate(.9) drop-shadow(0 0 15px var(--monster-accent))}.t1MonsterAvatar.is-critical .tqGameMonsterArt{filter:saturate(.65) brightness(.82) drop-shadow(0 8px 12px rgba(0,0,0,.4))}.t1MonsterAvatar.is-dead .tqGameMonsterArt{filter:grayscale(.85) brightness(.58);transform:rotate(8deg) translateY(8px)}
  .tqV9HeroImage{object-position:center center}.tqV9HeroShade{background:linear-gradient(90deg,rgba(4,12,27,.78) 0%,rgba(4,12,27,.26) 55%,rgba(4,12,27,.08) 100%),linear-gradient(0deg,rgba(4,12,27,.9),transparent 64%)!important}.tqV9HeroBottom{width:70%}
  .malbitFocusMode{padding-bottom:0}.malbitFocusMode .bottom{display:none}.malbitFocusMode .malbitGameDock{bottom:calc(10px + env(safe-area-inset-bottom))}.malbitModalOpen{overflow:hidden}
  .malbitPageTitle small[hidden]{display:none}.malbitStats{margin:0 -13px -28px;padding:16px 13px 32px;background:linear-gradient(180deg,#0a1a2e,#071321);color:#18243b}.malbitStats .malbitPageTitle h1{color:#fff}.malbitStats .malbitPageTitle>button{min-width:44px;min-height:44px}.malbitStats .malbitPageTitle{margin-top:0}
  .malbitDetailedReviewLink{width:100%;margin-top:9px;border:1px solid #cbdaf2;border-radius:13px;padding:11px;background:#edf4ff;color:#315b99;font-size:9px;font-weight:950}
  .tqGameWorldNav.compact{display:block;margin:16px 2px 9px;padding:10px 12px;border-bottom:1px solid #294868}.tqGameWorldNav.compact b{display:block;text-align:left}.malbitRarityTitle{display:flex;align-items:center;justify-content:space-between;margin:13px 3px 6px}.malbitRarityTitle b{font-size:11px}.malbitRarityTitle small{color:#7892b3;font-size:7px}.t1RarityLegend{margin-top:0}.t1GameGear:not(.on) i{font-size:18px;color:#8299b7}
  .t1TrailGrid{height:920px!important}.t1TrailNode>span{line-height:1}.t1TrailNode{font-size:15px}.t1MonsterSigil{font-size:12px;background:rgba(7,21,40,.88);color:#fff;border-color:var(--monster-accent)}
  .t1GameBattle .tqGameMonsterArt{filter:drop-shadow(0 6px 8px rgba(0,0,0,.32))}.t1GameResultArt .tqGameMonsterArt{height:140px}
  .shortsTop>span{min-width:62px;text-align:center;font-size:9px}.shortsProgress i{transition:width .25s ease}.shortsCard .tqVocabCoach{display:none!important}
  @media(max-width:380px){.t1TrailGrid{height:840px!important}.tqV9HeroBottom{width:76%}.tqV9HeroImage{object-position:58% center}}
  @media(prefers-reduced-motion:reduce){.tqGameMonsterArt{transition:none!important}.t1MonsterAvatar.is-dead .tqGameMonsterArt{transform:none}}
`;
document.head.appendChild(style);
postRender();
})();
