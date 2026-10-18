// Native modal: focus containment, Escape and backdrop isolation without a new dependency.
(function(){
'use strict';
const L=(ko,ja,en,zh)=>({ko,ja,en,zh}[(typeof S!=='undefined'?S:window.S)?.lang]||ko);
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mood(correct,total){const rate=total?correct/total:0;return total&&correct===total?'lesson-complete':rate>=.8?'answer-correct':rate>=.5?'progress-proud':'answer-retry'}
let dialog,previous,bodyOverflow,htmlOverflow,callbacks,closing=false;
function close(action='close'){
 if(!dialog?.open||closing)return;closing=true;dialog.close();document.body.style.overflow=bodyOverflow;document.documentElement.style.overflow=htmlOverflow;const restore=previous;callbacks?.[action]?.();
 if(restore?.isConnected)restore.focus?.();else document.querySelector('#screen button')?.focus();closing=false;
}
function show(data,actions={}){
 if(dialog?.open)return;previous=document.activeElement;callbacks=actions;
 if(!dialog){dialog=document.createElement('dialog');dialog.id='harumalPracticeResult';dialog.className='hqResult';dialog.setAttribute('aria-labelledby','hqResultTitle');document.body.appendChild(dialog);
  dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
  dialog.addEventListener('click',e=>{const b=e.target.closest('[data-result-action]');if(b)close(b.dataset.resultAction)});
  dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const focus=[...dialog.querySelectorAll('button,[href],select,textarea,input,[tabindex="0"]')].filter(el=>!el.disabled&&!el.hidden),first=focus[0],last=focus.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
 }
 const total=Math.max(0,Number(data.graded)||0),correct=Math.min(total,Math.max(0,Number(data.correct)||0)),writing=Math.max(0,Number(data.writing)||0),percent=total?Math.round(correct/total*100):null,pose=mood(correct,total),seconds=Math.max(0,Math.round(Number(data.seconds)||0));
 const message=percent===100?L('모두 맞혔어요!','全問正解！','You got every one!','全部答对了！'):percent>=80?L('아주 잘했어요!','よくできました！','Great work!','做得很棒！'):percent>=50?L('차근차근 실력이 쌓여요','少しずつ力がついています','Your skills are growing','你在稳步进步'):total?L('괜찮아요, 함께 다시 해봐요','大丈夫、一緒にもう一度','Let’s try again together','没关系，一起再试试'):L('오늘도 연습했어요','今日も練習しました','You made time to practice','今天也坚持练习了');
 dialog.innerHTML=`<button type="button" class="hqResultClose" data-result-action="close" aria-label="${L('닫기','閉じる','Close','关闭')}">×</button><p class="hqResultEyebrow">TOPIK ${Number(data.level)===1?'I':'II'} · ${L('연습 결과','練習結果','Practice results','练习结果')}</p>${window.HARUMAN?.markup(pose,'hero')||''}<h2 id="hqResultTitle">${message}</h2>${total?`<p class="hqResultScore"><strong>${percent}<small>%</small></strong><span>${L(`${total}문항 중 ${correct}문항 정답`,`${total}問中${correct}問正解`,`${correct} of ${total} correct`,`${total}题中答对${correct}题`)}</span></p>`:''}<dl class="hqResultFacts">${writing?`<div><dt>${L('쓰기 연습','作文練習','Writing prompts','写作练习')}</dt><dd>${writing}</dd></div>`:''}<div><dt>${L('풀이 시간','解答時間','Time spent','答题用时')}</dt><dd>${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}</dd></div></dl><div class="hqResultActions"><button type="button" class="primary" data-result-action="restart">${L('다시 풀기','もう一度解く','Practice again','再练一次')}</button><button type="button" class="hqResultSecondary" data-result-action="close">${L('닫기','閉じる','Close','关闭')}</button></div>`;
 bodyOverflow=document.body.style.overflow;htmlOverflow=document.documentElement.style.overflow;document.body.style.overflow='hidden';document.documentElement.style.overflow='hidden';dialog.showModal();dialog.querySelector('[data-result-action="restart"]').focus();
}
window.HARUMAL_RESULTS=Object.freeze({show,close,mood});
})();
