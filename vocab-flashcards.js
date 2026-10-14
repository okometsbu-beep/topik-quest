// Saved vocabulary flashcards. Session snapshots never modify words or SRS scheduling.
(function(){
'use strict';
const L=(ko,ja,en,zh)=>({ko,ja,en,zh}[S.lang]||en);
const H=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let feedback='',audioContext=null,gesture=null,suppressClick=false,motionTimer=null,motionVersion=0,leaving=false;
let viewportLocked=false,entryScrollY=0,suspendedScrollY=null;
function sizeViewport(){
 const v=window.visualViewport,root=document.documentElement;
 root?.style?.setProperty('--hf-height',`${v?.height||window.innerHeight||844}px`);
 root?.style?.setProperty('--hf-top',`${v?.offsetTop||0}px`);
}
function lockViewport(lock){
 if(lock===viewportLocked)return;viewportLocked=lock;
 const root=document.documentElement,body=document.body;
 if(lock){entryScrollY=window.scrollY||0;root?.classList?.add('hfActive');body?.classList?.add('hfActive');sizeViewport();window.addEventListener?.('resize',sizeViewport);window.visualViewport?.addEventListener('resize',sizeViewport);window.visualViewport?.addEventListener('scroll',sizeViewport)}
 else{root?.classList?.remove('hfActive');body?.classList?.remove('hfActive');root?.style?.removeProperty('--hf-height');root?.style?.removeProperty('--hf-top');window.removeEventListener?.('resize',sizeViewport);window.visualViewport?.removeEventListener('resize',sizeViewport);window.visualViewport?.removeEventListener('scroll',sizeViewport);return entryScrollY}
}
window.harumalFlashcardsDetails=()=>{
 const a=active();if(!a||leaving)return;
 const old=document.querySelector?.('.hfDetails');if(old)return;
 const item=a.items[a.answers.length],dialog=document.createElement('dialog');dialog.className='hfDetails';
 dialog.setAttribute('aria-label',L('카드 전체 보기','カード全文','Full card text','查看完整内容'));
 dialog.innerHTML=`<button type="button" class="hfQuiet hfDetailClose">${L('닫기','閉じる','Close','关闭')}</button><div class="hfDetailBody" tabindex="0"><h2 lang="ko">${H(item.term)}</h2>${a.revealed?`<p lang="${H(item.target)}">${H(item.meaning)}</p>`:''}</div>`;
 document.getElementById('screen').appendChild(dialog);
 dialog.querySelector('.hfDetailClose').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{dialog.remove();document.querySelector('.hfDetailsButton')?.focus({preventScroll:true})});
 dialog.showModal();dialog.querySelector('.hfDetailClose').focus({preventScroll:true});
};
const reducedMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
function cancelMotion(){motionVersion++;if(motionTimer!==null)window.clearTimeout?.(motionTimer);motionTimer=null;gesture=null;leaving=false}
function swipeDecision(dx,dy,velocity,width,revealed){return revealed&&Math.abs(dx)>Math.abs(dy)*1.35&&(Math.abs(dx)>=Math.max(64,Math.min(100,width*.27))||(Math.abs(dx)>28&&Math.abs(velocity)>.65&&Math.sign(dx)===Math.sign(velocity)))}
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
window.harumalFlashcardsFlip=()=>{
 const a=active();if(!a||leaving)return;a.revealed=!a.revealed;save();
 const card=document.getElementById('vocabFlashcard'),back=card?.querySelector?.('.hfBack');
 if(!card?.classList||!back){render();focusCard();return}
 if(a.revealed&&!back.dataset.filled){back.innerHTML=backFace(a.items[a.answers.length],a.answers.length);back.dataset.filled='true'}
 card.classList.toggle('isRevealed',a.revealed);card.setAttribute('aria-pressed',String(a.revealed));
 card.querySelector('.hfFront')?.setAttribute('aria-hidden',String(a.revealed));back.setAttribute('aria-hidden',String(!a.revealed));
 document.querySelectorAll('.hfAgain,.hfKnown').forEach(el=>el.disabled=!a.revealed);
 const hint=document.getElementById('hfHint');if(hint)hint.textContent=a.revealed?L('왼쪽은 다시 학습, 오른쪽은 알아요','左はもう一度、右は覚えた','Left to revisit · Right if you know it','向左再学 · 向右记住了'):L('탭해서 뒤집고, 좌우로 넘겨요','タップで裏返して、左右にスワイプ','Tap to flip, then swipe left or right','轻点翻面，再左右滑动');
 focusCard();
};
window.harumalFlashcardsGrade=correct=>{
 const a=active();if(!a||!a.revealed||leaving||typeof correct!=='boolean')return;
 leaving=true;gesture=null;const token=++motionVersion,card=document.getElementById('vocabFlashcard');
 a.answers.push(correct);a.revealed=false;if(a.answers.length===a.items.length)a.finishedAt=Date.now();
 feedback=correct?L('✓ 기억했어요!','✓ 覚えていた！','✓ You remembered!','✓ 记住了！'):L('↻ 한 번 더 익혀요','↻ もう一度覚えよう','↻ Let’s revisit this one','↻ 再复习一次');
 save();sound(correct);
 const finish=()=>{if(token!==motionVersion)return;motionTimer=null;leaving=false;if(S.view==='vocabFlashcards'&&session()===a){render();if(a.finishedAt)window.scrollTo?.({top:0,behavior:'auto'});focusCard()}};
 if(!card?.classList||reducedMotion()){finish();return}
 const direction=correct?1:-1,travel=Math.max(window.innerWidth||390,card.getBoundingClientRect().width)*1.35;
 card.classList.remove('isDragging','isReturning');card.classList.add('isLeaving');card.dataset.direction=correct?'right':'left';card.style.setProperty('--hf-stamp','1');
 card.style.transform=`translate3d(${direction*travel}px,-45px,0) rotate(${direction*29}deg) rotateY(${direction*-12}deg)`;
 document.querySelectorAll('.hfUnderCard').forEach((el,i)=>{el.style.setProperty('--hf-depth-ink',el.classList.contains('hfUnder1')?'1':'.58');el.style.transition='transform 400ms cubic-bezier(.2,.8,.25,1)';el.style.transform=el.classList.contains('hfUnder1')?'translate3d(0,0,0) rotate(0deg) scale(1)':'translate3d(0,11px,0) rotate(3deg) scale(.965)'});
 document.querySelectorAll('.hfActions button').forEach(el=>el.disabled=true);
 motionTimer=window.setTimeout(finish,420);
};
window.harumalFlashcardsRetry=()=>{const a=session();if(a&&a.answers.length===a.items.length)start(a.items.filter((_,i)=>!a.answers[i]),a.scope)};
window.harumalFlashcardsExit=()=>{feedback='';setView('vocab')};
function toolbar(sc){
 const tabs=sc.querySelector('.tqVocabPageTabs');if(!tabs||!tabs.querySelector('button.on')?.getAttribute('onclick')?.includes("'saved'")||sc.querySelector('.hfEntry'))return;
 const count=pool().length,manual=pool('manual').length,a=session(),remaining=(S.vocab?.length||0)-count;
 const box=document.createElement('section');box.className='hfEntry';
 box.innerHTML=`<div><small>FLASHCARDS</small><h2>${L('내 단어, 한 장씩','私の単語を、1枚ずつ','Your words, one card at a time','我的单词，一次一张')}</h2><p>${L('탭해서 뜻 확인 · 좌우로 기억 체크','タップで意味を確認 · 左右にスワイプ','Tap to reveal · Swipe to check your recall','轻点查看词义 · 左右滑动自测')}</p></div><button class="hfPrimary" onclick="harumalFlashcardsStart('all')" ${count?'':'disabled'}>${L('플래시카드 시작','フラッシュカード開始','Start flashcards','开始闪卡')} <span>${count} →</span></button>${manual?`<button class="hfQuiet" onclick="harumalFlashcardsStart('manual')">${L('직접 입력한 단어만','直接入力した単語だけ','Only words I typed','仅手动输入的单词')} · ${manual}</button>`:''}${a?`<button class="hfQuiet" onclick="harumalFlashcardsResume()">${a.finishedAt?L('지난 결과 보기','前回の結果を見る','See last result','查看上次结果'):L('이어서 학습','続きから学習','Resume session','继续学习')} · ${a.answers.length}/${a.items.length}</button>`:''}${!count?`<p>${L('단어를 저장하고 상세 편집에서 뜻을 넣어 주세요.','単語を保存して、詳細編集で意味を入力してください。','Save words and add meanings in Details to begin.','请先收藏单词，并在详情中填写词义。')}</p>`:''}${remaining>0?`<small>${L(`뜻이 없거나 중복된 ${remaining}개는 제외돼요.`, `意味未登録・重複の${remaining}語は対象外です。`,`${remaining} entries without meanings or duplicates are excluded.`,`不包含${remaining}条无词义或重复项。`)}</small>`:''}`;
 tabs.insertAdjacentElement('afterend',box);
}
function renderCards(sc){
 cancelMotion();lockViewport(true);const a=session();sc.className='screen hfScreen';
 const title=L('플래시카드','フラッシュカード','Flashcards','闪卡');
 sc.innerHTML=`<header class="hfHeader"><button class="hfIconButton" aria-label="${L('단어장으로','単語帳に戻る','Back to words','返回单词本')}" onclick="harumalFlashcardsExit()">‹</button><div><small>MY WORDS</small><h1>${title}</h1></div><span class="hfHeaderSpacer" aria-hidden="true"></span></header>`;
 if(!a)return;
 const n=a.answers.length,total=a.items.length,known=a.answers.filter(Boolean).length;
 if(n===total){sc.classList?.add('hfComplete');
  sc.innerHTML+=`<section class="hfResult" role="status"><span class="hfResultIcon">✦</span><small>${L('학습 완료','学習完了','SESSION COMPLETE','学习完成')}</small><h2>${L('한 장씩, 더 오래 기억해요','1枚ずつ、記憶に残そう','One card closer to remembering','一张张，记得更牢')}</h2><div class="hfScore"><b>${known}<small> / ${total}</small></b><span>${L('알아요','覚えていた','Remembered','记住了')}</span></div><p>${L('직접 체크한 기억 상태예요.','自分で確認した記憶の記録です。','This is your self-assessed recall.','这是你对记忆的自我评价。')}</p>${known<total?`<button class="hfPrimary" onclick="harumalFlashcardsRetry()">↻ ${L('다시 학습할 단어만','もう一度の単語だけ','Practice missed words','复习未记住的词')} · ${total-known}</button>`:''}<button class="hfQuiet" onclick="harumalFlashcardsStart('${a.scope==='manual'?'manual':'all'}')">${L('전체 다시 섞기','すべてシャッフルして再開','Shuffle and start again','重新打乱再来')}</button><button class="hfQuiet" onclick="harumalFlashcardsExit()">${L('단어장으로 돌아가기','単語帳に戻る','Back to my words','返回单词本')}</button></section>`;return;
 }
 const item=a.items[n];
 sc.innerHTML+=`<div class="hfProgress"><span>${String(n+1).padStart(2,'0')} <span>/ ${String(total).padStart(2,'0')}</span></span><small><b>✓ ${known}</b><span>↻ ${n-known}</span></small></div><progress max="${total}" value="${n}" aria-label="${L('학습 진행','学習の進み具合','Session progress','学习进度')}"></progress><div class="hfDeckStage"><div class="hfDeck">${a.items.slice(n+1,n+3).map((x,i)=>`<div class="hfUnderCard hfUnder${i+1}" aria-hidden="true">${frontFace(x,n+i+1)}</div>`).reverse().join('')}<button id="vocabFlashcard" type="button" class="hfCard ${a.revealed?'isRevealed':''}" aria-pressed="${a.revealed}" aria-describedby="hfHint"><span class="hfFlipper"><span class="hfFace hfFront" aria-hidden="${a.revealed}">${frontFace(item,n)}</span><span class="hfFace hfBack" aria-hidden="${!a.revealed}" data-filled="${a.revealed?'true':''}">${a.revealed?backFace(item,n):''}</span></span><span class="hfStamp hfStampKnown" aria-hidden="true">${L('알아요','覚えた','GOT IT','记住了')}</span><span class="hfStamp hfStampAgain" aria-hidden="true">${L('한 번 더','もう一度','AGAIN','再学一次')}</span></button></div></div><p id="hfHint" class="hfHint">${a.revealed?L('왼쪽은 다시 학습, 오른쪽은 알아요','左はもう一度、右は覚えた','Left to revisit · Right if you know it','向左再学 · 向右记住了'):L('탭해서 뒤집고, 좌우로 넘겨요','タップで裏返して、左右にスワイプ','Tap to flip, then swipe left or right','轻点翻面，再左右滑动')}</p><button type="button" class="hfDetailsButton" onclick="harumalFlashcardsDetails()">${L('전체 보기','全文を見る','Read full text','查看全文')}</button><div class="hfActions"><button class="hfAgain" onclick="harumalFlashcardsGrade(false)" ${a.revealed?'':'disabled'}><i aria-hidden="true">↶</i><span>${L('다시 학습','もう一度','Revisit','再学一次')}</span></button><button class="hfFlipButton" onclick="harumalFlashcardsFlip()"><i aria-hidden="true">↺</i><span>${L('뒤집기','裏返す','Flip','翻面')}</span></button><button class="hfKnown" onclick="harumalFlashcardsGrade(true)" ${a.revealed?'':'disabled'}><i aria-hidden="true">✓</i><span>${L('알아요','覚えた','Know it','记住了')}</span></button></div><p class="hfFeedback" role="status" aria-live="polite">${feedback}</p>`;
 bindCard(document.getElementById('vocabFlashcard'));
}
function frontFace(item,index){return `<span class="hfCardCorner"><b>한</b><small>${String(index+1).padStart(2,'0')}</small></span><span class="hfCardCentre"><span class="hfCardLabel">KOREAN</span><span class="hfTermScroll"><span class="hfCardWord ${item.term.length>18?'hfLongTerm':''}" lang="ko">${H(item.term)}</span></span><span class="hfCardRule">✦</span><span class="hfCardPrompt">${L('뜻을 떠올려 보세요','意味を思い出してみよう','What does it mean?','想想它的意思')}</span></span><span class="hfCardFooter"><span>하루말</span><span>MY VOCABULARY</span></span>`}
function backFace(item,index){return `<span class="hfCardCorner"><b>뜻</b><small>${String(index+1).padStart(2,'0')}</small></span><span class="hfCardCentre"><span class="hfCardLabel">${L('의미','意味','MEANING','词义')}</span><span class="hfMeaningScroll" aria-label="${L('단어 뜻','単語の意味','Word meaning','单词释义')}"><span class="hfCardWord" lang="${H(item.target)}">${H(item.meaning)}</span></span><span class="hfCardRule">✦</span><span class="hfCardTerm" lang="ko">${H(item.term)}</span></span><span class="hfCardFooter"><span>하루말</span><span>${L('기억에 남겨요','記憶に残そう','MAKE IT YOURS','记在心里')}</span></span>`}
function resetDrag(card){
 card.classList?.remove('isDragging');card.classList?.add('isReturning');card.style.transform='';card.style.setProperty?.('--hf-stamp','0');delete card.dataset.direction;
 document.querySelectorAll?.('.hfUnderCard').forEach(el=>{el.style.transition='';el.style.transform='';el.style.removeProperty?.('--hf-depth-ink')});
}
function bindCard(card){
 if(!card)return;
 card.addEventListener('click',(e={})=>{if(leaving)return;if(suppressClick&&e.detail!==0){suppressClick=false;return}suppressClick=false;window.harumalFlashcardsFlip()});
 card.addEventListener('keydown',e=>{if(e.repeat)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();window.harumalFlashcardsGrade(e.key==='ArrowRight')}});
 card.addEventListener('pointerdown',e=>{
  if(leaving||!e.isPrimary||e.button!==0)return;suppressClick=false;
  gesture={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastAt:e.timeStamp||0,vx:0,drag:false,vertical:false};
  card.classList?.remove('isReturning');card.setPointerCapture?.(e.pointerId);
 });
 card.addEventListener('pointermove',e=>{
  const g=gesture;if(!g||e.pointerId!==g.id||g.vertical)return;
  const dx=e.clientX-g.x,dy=e.clientY-g.y,dt=(e.timeStamp||0)-g.lastAt;
  if(dt>0){g.vx=(e.clientX-g.lastX)/dt;g.lastX=e.clientX;g.lastAt=e.timeStamp}
  if(!g.drag&&Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){g.vertical=true;return}
  if(!g.drag&&(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)))return;
  g.drag=true;const width=card.getBoundingClientRect?.().width||300,p=Math.min(1,Math.abs(dx)/(width*.35));
  card.classList?.add('isDragging');card.style.transform=`translate3d(${dx}px,${dy*.28}px,0) rotate(${Math.max(-17,Math.min(17,dx/16))}deg)`;
  card.style.setProperty?.('--hf-stamp',String(active()?.revealed?p:0));card.dataset.direction=dx>0?'right':'left';
  const next=document.querySelector?.('.hfUnder1');if(next){next.style.setProperty('--hf-depth-ink',String(.58+.42*p));next.style.transition='none';next.style.transform=`translate3d(0,${12*(1-p)}px,0) rotate(${3*(1-p)}deg) scale(${.965+.035*p})`}
 });
 card.addEventListener('pointerup',e=>{
  const g=gesture;if(!g||e.pointerId!==g.id)return;gesture=null;
  const dx=e.clientX-g.x,dy=e.clientY-g.y;const recent=(e.timeStamp||0)-g.lastAt<100?g.vx:0;
  if(Math.hypot(dx,dy)>8){suppressClick=true;if(!g.vertical&&swipeDecision(dx,dy,recent,card.getBoundingClientRect?.().width||300,active()?.revealed)){window.harumalFlashcardsGrade(dx>0);return}}
  resetDrag(card);
 });
 card.addEventListener('pointercancel',()=>{gesture=null;suppressClick=true;resetDrag(card)});
 card.addEventListener('lostpointercapture',()=>{if(gesture){gesture=null;resetDrag(card)}});
}
// Release before later render owners (writing/travel) can bypass our render wrapper.
const baseSetView=window.setView;
window.setView=function(view){
 const restoreY=view!=='vocabFlashcards'?lockViewport(false):undefined;
 if(view!=='vocabFlashcards')cancelMotion();
 const result=baseSetView.apply(this,arguments);
 if(restoreY!==undefined)window.scrollTo?.({top:restoreY,behavior:'instant'});
 return result;
};
window.addEventListener?.('pagehide',()=>{cancelMotion();const y=lockViewport(false);if(y!==undefined)suspendedScrollY=y});
window.addEventListener?.('pageshow',event=>{if(event.persisted&&S.view==='vocabFlashcards'){render();if(suspendedScrollY!==null)entryScrollY=suspendedScrollY}suspendedScrollY=null});
window.HARUMAL_FLASHCARDS=Object.freeze({pool,session,soundEnabled,swipeDecision});
const base=render;render=function(){if(S.view==='vocabFlashcards'){renderShell();return renderCards(document.getElementById('screen'))}cancelMotion();const restoreY=lockViewport(false),result=base.apply(this,arguments);if(S.view==='vocab')toolbar(document.getElementById('screen'));if(restoreY!==undefined)window.scrollTo?.({top:restoreY,behavior:'instant'});return result};
})();
