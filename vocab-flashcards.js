// Saved vocabulary flashcards. Session snapshots never modify words or SRS scheduling.
(function(){
'use strict';
const L=(ko,ja,en,zh)=>({ko,ja,en,zh}[S.lang]||en);
const H=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let feedback='',audioContext=null,gesture=null,suppressClick=false;
function pool(scope='all'){
 const words=(Array.isArray(S.vocab)?S.vocab:[]).filter(v=>scope!=='manual'||v.manual===true);
 return window.HARUMAL_VOCAB_TEST.pool(words,S.lang);
}
function session(){const a=S.vocabFlashcards;return a?.version===1&&Array.isArray(a.items)&&a.items.length&&Array.isArray(a.answers)&&a.answers.length<=a.items.length?a:null}
function active(){const a=session();return S.view==='vocabFlashcards'&&a&&a.answers.length<a.items.length?a:null}
function start(items,scope){
 if(!items.length)return;
 const shuffled=items.map(x=>({...x}));for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}
 S.vocabFlashcards={version:1,items:shuffled,answers:[],revealed:false,scope,startedAt:Date.now()};feedback='';save();setView('vocabFlashcards');window.scrollTo?.({top:0,behavior:'auto'});
}
function soundEnabled(){return S.vocabFlashcardSound!==false&&S.muted!==true&&S.soundEnabled!==false}
function sound(correct){
 if(!soundEnabled())return;
 try{
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  audioContext=audioContext||new AC();if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
  const now=audioContext.currentTime;
  (correct?[523.25,659.25,783.99]:[294,220]).forEach((hz,i)=>{
   const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),at=now+i*.075;
   oscillator.type='sine';oscillator.frequency.value=hz;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.075,at+.012);gain.gain.exponentialRampToValueAtTime(.001,at+.16);
   oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start(at);oscillator.stop(at+.18);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()};
  });
 }catch(_){} // Audio failure must never block learning.
}
function focusCard(){document.getElementById('vocabFlashcard')?.focus({preventScroll:true})}
window.harumalFlashcardsStart=scope=>start(pool(scope),scope==='manual'?'manual':'all');
window.harumalFlashcardsResume=()=>{if(session()){feedback='';setView('vocabFlashcards');window.scrollTo?.({top:0,behavior:'auto'})}};
window.harumalFlashcardsFlip=()=>{const a=active();if(!a)return;a.revealed=!a.revealed;save();render();focusCard()};
window.harumalFlashcardsGrade=correct=>{
 const a=active();if(!a||!a.revealed||typeof correct!=='boolean')return;
 a.answers.push(correct);a.revealed=false;if(a.answers.length===a.items.length)a.finishedAt=Date.now();
 feedback=correct?L('✓ 기억했어요!','✓ 覚えていた！','✓ You remembered!','✓ 记住了！'):L('↻ 한 번 더 익혀요','↻ もう一度覚えよう','↻ Let’s revisit this one','↻ 再复习一次');
 save();sound(correct);render();window.scrollTo?.({top:0,behavior:'auto'});focusCard();
};
window.harumalFlashcardsRetry=()=>{const a=session();if(a&&a.answers.length===a.items.length)start(a.items.filter((_,i)=>!a.answers[i]),a.scope)};
window.harumalFlashcardsSound=()=>{S.vocabFlashcardSound=!soundEnabled();save();render();document.getElementById('flashcardSound')?.focus({preventScroll:true})};
window.harumalFlashcardsExit=()=>{feedback='';setView('vocab')};
function toolbar(sc){
 const tabs=sc.querySelector('.tqVocabPageTabs');if(!tabs||!tabs.querySelector('button.on')?.getAttribute('onclick')?.includes("'saved'")||sc.querySelector('.hfEntry'))return;
 const count=pool().length,manual=pool('manual').length,a=session(),remaining=(S.vocab?.length||0)-count;
 const box=document.createElement('section');box.className='hfEntry';
 box.innerHTML=`<div><small>FLASHCARDS</small><h2>${L('내 단어, 한 장씩','私の単語を、1枚ずつ','Your words, one card at a time','我的单词，一次一张')}</h2><p>${L('탭해서 뜻 확인 · 좌우로 기억 체크','タップで意味を確認 · 左右にスワイプ','Tap to reveal · Swipe to check your recall','轻点查看词义 · 左右滑动自测')}</p></div><button class="hfPrimary" onclick="harumalFlashcardsStart('all')" ${count?'':'disabled'}>${L('플래시카드 시작','フラッシュカード開始','Start flashcards','开始闪卡')} <span>${count} →</span></button>${manual?`<button class="hfQuiet" onclick="harumalFlashcardsStart('manual')">${L('직접 입력한 단어만','直接入力した単語だけ','Only words I typed','仅手动输入的单词')} · ${manual}</button>`:''}${a?`<button class="hfQuiet" onclick="harumalFlashcardsResume()">${a.finishedAt?L('지난 결과 보기','前回の結果を見る','See last result','查看上次结果'):L('이어서 학습','続きから学習','Resume session','继续学习')} · ${a.answers.length}/${a.items.length}</button>`:''}${!count?`<p>${L('단어를 저장하고 상세 편집에서 뜻을 넣어 주세요.','単語を保存して、詳細編集で意味を入力してください。','Save words and add meanings in Details to begin.','请先收藏单词，并在详情中填写词义。')}</p>`:''}${remaining>0?`<small>${L(`뜻이 없거나 중복된 ${remaining}개는 제외돼요.`, `意味未登録・重複の${remaining}語は対象外です。`,`${remaining} entries without meanings or duplicates are excluded.`,`不包含${remaining}条无词义或重复项。`)}</small>`:''}`;
 tabs.insertAdjacentElement('afterend',box);
}
function renderCards(sc){
 const a=session();sc.className='screen hfScreen';gesture=null;
 const title=L('플래시카드','フラッシュカード','Flashcards','闪卡');
 sc.innerHTML=`<header class="hfHeader"><button class="hfQuiet" onclick="harumalFlashcardsExit()">← ${L('단어장','単語帳','My words','单词本')}</button><button id="flashcardSound" class="hfQuiet" aria-pressed="${soundEnabled()}" onclick="harumalFlashcardsSound()">${soundEnabled()?'♪':'♩'} ${soundEnabled()?L('소리 켜짐','効果音 ON','Sound on','声音开启'):L('소리 꺼짐','効果音 OFF','Sound off','声音关闭')}</button></header><div class="hfHeading"><small>MY WORDS / FLASHCARDS</small><h1>${title}</h1><p>${L('저장한 단어로 가볍게 기억 연습','保存した単語で、気軽に記憶の練習','A little recall practice with your saved words','用收藏的单词，轻松练习回忆')}</p></div>`;
 if(!a)return;
 const n=a.answers.length,total=a.items.length,known=a.answers.filter(Boolean).length;
 if(n===total){
  sc.innerHTML+=`<section class="hfResult" role="status"><span class="hfResultIcon">✦</span><small>${L('학습 완료','学習完了','SESSION COMPLETE','学习完成')}</small><h2>${L('한 장씩, 더 오래 기억해요','1枚ずつ、記憶に残そう','One card closer to remembering','一张张，记得更牢')}</h2><div class="hfScore"><b>${known}<small> / ${total}</small></b><span>${L('알아요','覚えていた','Remembered','记住了')}</span></div><p>${L('직접 체크한 기억 상태예요.','自分で確認した記憶の記録です。','This is your self-assessed recall.','这是你对记忆的自我评价。')}</p>${known<total?`<button class="hfPrimary" onclick="harumalFlashcardsRetry()">↻ ${L('다시 학습할 단어만','もう一度の単語だけ','Practice missed words','复习未记住的词')} · ${total-known}</button>`:''}<button class="hfQuiet" onclick="harumalFlashcardsStart('${a.scope==='manual'?'manual':'all'}')">${L('전체 다시 섞기','すべてシャッフルして再開','Shuffle and start again','重新打乱再来')}</button><button class="hfQuiet" onclick="harumalFlashcardsExit()">${L('단어장으로 돌아가기','単語帳に戻る','Back to my words','返回单词本')}</button></section>`;return;
 }
 const item=a.items[n];
 sc.innerHTML+=`<div class="hfProgress"><span>${n+1} <span>/ ${total}</span></span><small>✓ ${known} &nbsp; ↻ ${n-known}</small></div><progress max="${total}" value="${n}" aria-label="${L('학습 진행','学習の進み具合','Session progress','学习进度')}"></progress><p class="hfFeedback" role="status" aria-live="polite">${feedback||L('먼저 뜻을 떠올려 보세요','まずは意味を思い出してみよう','Recall the meaning first','先回想一下词义')}</p><button id="vocabFlashcard" type="button" class="hfCard ${a.revealed?'isRevealed':''}" aria-pressed="${a.revealed}" aria-describedby="hfHint"><span class="hfCardLabel">${a.revealed?L('뜻 확인','意味を確認','MEANING','词义'):'한국어'}</span><span class="hfCardWord" lang="${a.revealed?H(item.target):'ko'}">${H(a.revealed?item.meaning:item.term)}</span>${a.revealed?`<span class="hfCardTerm" lang="ko">${H(item.term)}</span>`:''}<span class="hfFlipCue">↺ ${a.revealed?L('탭해서 단어 보기','タップで単語に戻る','Tap to see the word','轻点返回单词'):L('탭해서 뜻 보기','タップで意味を見る','Tap to reveal meaning','轻点查看词义')}</span></button><p id="hfHint" class="hfHint">${L('뜻을 확인한 뒤 ← 다시 학습 · 알아요 →','意味を確認したら ← もう一度 · 覚えた →','After revealing: ← Revisit · Know it →','查看词义后 ← 再学一次 · 记住了 →')}</p><div class="hfActions"><button class="hfAgain" onclick="harumalFlashcardsGrade(false)" ${a.revealed?'':'disabled'}>← ${L('다시 학습','もう一度','Revisit','再学一次')}</button><button class="hfKnown" onclick="harumalFlashcardsGrade(true)" ${a.revealed?'':'disabled'}>${L('알아요','覚えた','Know it','记住了')} →</button></div><p class="hfFoot">${L('중간에 나가도 이어서 학습할 수 있어요','途中で閉じても、続きから学習できます','Leave anytime; your place is saved','可随时退出，下次继续')}</p>`;
 bindCard(document.getElementById('vocabFlashcard'));
}
function bindCard(card){
 if(!card)return;
 card.addEventListener('click',(e={})=>{if(suppressClick&&e.detail!==0){suppressClick=false;return}suppressClick=false;window.harumalFlashcardsFlip()});
 card.addEventListener('keydown',e=>{if(e.repeat)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();window.harumalFlashcardsGrade(e.key==='ArrowRight')}});
 card.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;suppressClick=false;gesture={id:e.pointerId,x:e.clientX,y:e.clientY};card.setPointerCapture?.(e.pointerId)});
 card.addEventListener('pointermove',e=>{if(!gesture||e.pointerId!==gesture.id)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)){card.style.transform=`translateX(${Math.max(-100,Math.min(100,dx))}px) rotate(${dx/30}deg)`;card.dataset.direction=dx>0?'right':'left'}});
 card.addEventListener('pointerup',e=>{if(!gesture||e.pointerId!==gesture.id)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;gesture=null;card.style.transform='';delete card.dataset.direction;if(Math.hypot(dx,dy)>12){suppressClick=true;if(Math.abs(dx)>=60&&Math.abs(dx)>Math.abs(dy)*1.4)window.harumalFlashcardsGrade(dx>0)}});
 card.addEventListener('pointercancel',()=>{gesture=null;suppressClick=false;card.style.transform='';delete card.dataset.direction});
}
window.HARUMAL_FLASHCARDS=Object.freeze({pool,session,soundEnabled});
const base=render;render=function(){if(S.view==='vocabFlashcards'){renderShell();return renderCards(document.getElementById('screen'))}const result=base.apply(this,arguments);if(S.view==='vocab')toolbar(document.getElementById('screen'));return result};
})();
