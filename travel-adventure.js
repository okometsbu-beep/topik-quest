// Scene-led travel. Additive progress inside the existing durable/portable travel root.
(function(){
'use strict';
const KEY='malbitStoryV1',DATA=window.HARUMAL_ADVENTURE_DATA;
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L=(ko,ja,en,zh)=>({ko,ja,en,zh}[S.lang]||en),l=t=>t[S.lang]||t.en;
const assets=window.MALBIT_TRAVEL.packs[0].assets;
let error='',reviewing=null;
function store(){try{const raw=localStorage.getItem(KEY);const s=raw?JSON.parse(raw):{version:1,episodes:{}};if(!s||s.version!==1||!s.episodes||Array.isArray(s)||typeof s.episodes!=='object')return null;return s}catch{return null}}
function mergeImport(raw){const incoming=JSON.parse(raw),existing=store();if(incoming&&incoming.version===1&&!Object.prototype.hasOwnProperty.call(incoming,'adventureV1')&&existing?.adventureV1)incoming.adventureV1=existing.adventureV1;return JSON.stringify(incoming)}
function progress(s){const a=s?.adventureV1;return a&&a.version===1?a:{version:1,activeLevel:1,levels:{}}}
function state(a,level){const p=a.levels?.[level]||{};return{...p,index:Math.max(0,Math.min(4,Number(p.index)||0)),turn:Math.max(0,Math.min(3,Number(p.turn)||0)),selected:Number.isInteger(p.selected)?p.selected:null,result:Number.isInteger(p.result)?p.result:null,answers:p.answers||{},recall:p.recall||{}}}
function current(){const s=store(),a=progress(s),level=a.activeLevel===2?2:1,p=state(a,level);return{s,a,level,p,q:DATA.levels[level][p.index]}}
function update(fn){const s=store();if(!s){error=L('저장된 여행 기록을 읽을 수 없습니다. 기록을 덮어쓰지 않았습니다. 설정에서 백업을 확인해 주세요.','旅の記録を読み取れません。上書きしていません。設定でバックアップをご確認ください。','Travel data could not be read. It was not overwritten. Check your backup in Settings.','无法读取旅行记录，未覆盖原记录。请在设置中检查备份。');render();return false}const a=progress(s);a.levels=a.levels||{};fn(a);s.adventureV1=a;try{localStorage.setItem(KEY,JSON.stringify(s));window.MALBIT_STORAGE_GUARD?.capture('travel-adventure');error='';return true}catch{error=L('저장 공간이 부족합니다. 진행을 저장하지 못했어요.','保存できませんでした。端末の空き容量をご確認ください。','Progress could not be saved. Check available storage.','未能保存进度，请检查存储空间。');render();return false}}
function mutate(fn){return update(a=>{const level=a.activeLevel===2?2:1,p=state(a,level);fn(p,DATA.levels[level][p.index]);a.levels[level]=p})}
function go(view){setView(view);window.scrollTo?.({top:0,left:0,behavior:'auto'})}
function focus(selector){document.querySelector(selector)?.focus({preventScroll:true})}
function button(copy,action,cls='advPrimary',disabled=false){return `<button type="button" class="${cls}" onclick="${action}" ${disabled?'disabled':''}>${copy}</button>`}
function translation(t){return S.lang==='ko'?'':`<details class="advTranslation"><summary>${L('뜻 보기','意味を見る','Show meaning','查看意思')}</summary><p>${h(l(t))}</p></details>`}
const names=()=>({traveler:L('나','私','You','我'),guide:L('직원','係員','Staff','工作人员')});
function head(copy,back="setView('travel')"){return `<header class="advHead">${button('‹ '+L('돌아가기','戻る','Back','返回'),back,'advText')}<span>SEOUL / 01</span></header><h1 tabindex="-1" class="advTitle">${h(copy)}</h1>`}
function hub(sc){
 const {s,a}=current(),old=Object.keys(s?.episodes||{}).length;
 sc.innerHTML=head(L('이야기로 떠나는 서울','物語で旅するソウル','Seoul, one conversation at a time','在故事中游首尔'),"harumalGo('home')")+`
 <p class="advLead">${L('대화를 읽고, 단서를 살펴보고, 내 말로 다음 장면을 열어요.','会話を読み、手がかりを確かめ、自分の言葉で次の場面へ。','Read the dialogue, check the clues, and choose what to say next.','阅读对话，查看线索，用自己的话开启下一幕。')}</p>
 <div class="advCover"><img src="${assets.backgrounds.airport}" alt=""><span>${L('첫 서울 여행','はじめてのソウル旅','Your first Seoul trip','第一次首尔之旅')}</span></div>
 <p class="advRoute">${L('공항 → 열차 → 서울역 → 숙소','空港 → 列車 → ソウル駅 → ホテル','Airport → Train → Seoul Station → Hotel','机场 → 列车 → 首尔站 → 酒店')}</p>
 <h2>${L('나에게 맞는 대화 난도','会話の難しさを選ぶ','Choose your dialogue level','选择对话难度')}</h2>
 <div class="advCourses">${[1,2].map(level=>{const p=state(a,level),done=Object.keys(p.answers).filter(id=>p.answers[id].solved).length,due=Object.keys(p.answers).filter(id=>p.answers[id].solved&&(!p.recall[id]?.nextDueAt||p.recall[id].nextDueAt<=Date.now())).length;return `<article class="advCourse"><small>TOPIK ${level===1?'I':'II'} · 4 ${L('장면','場面','scenes','幕')}</small><h3>${level===1?L('여행의 기본을 읽다','旅の基本を読み取る','Read everyday travel clues','读懂旅行基本信息'):L('말 속의 뜻을 읽다','言葉の意図を読み取る','Read between the lines','理解话中之意')}</h3><p>${level===1?L('시간·물건·길 안내·정중한 부탁','時刻・持ち物・道案内・丁寧なお願い','Times, belongings, directions and requests','时间、物品、路线、礼貌请求'):L('조건 비교·간접 요청·예외·예약 변경','条件の比較・遠回しな依頼・例外・予約変更','Conditions, indirect requests, exceptions and bookings','条件比较、间接请求、例外、预订变更')}</p><p class="advProgress">${done}/4 ${L('장면 해결','場面を解決','scenes resolved','幕已解决')}${done?' · '+due+' '+L('표현 복습할 때','表現が復習の時間','phrases due','个表达到复习时间'):''}</p>${button(p.index===4?L('여행 마무리 보기','旅の振り返り','See your journey','查看旅程总结'):done||p.turn?L('이어서 대화하기','会話を続ける','Continue the conversation','继续对话'):L('대화 시작하기','会話を始める','Start the conversation','开始对话'),`harumalAdventureStart(${level})`)}${done?button(L('여행 표현 떠올리기','旅の表現を思い出す','Recall travel phrases','回想旅行表达'),`harumalAdventureReview(${level})`,'advSecondary'):''}</article>`}).join('')}</div>
 <p class="advNote">${L('학습용 창작 상황입니다. 실제 운행·예약 정보와 다르며 공식 TOPIK 문항이 아닙니다.','学習用の創作場面です。実際の運行・予約情報とは異なり、公式TOPIK問題ではありません。','Original learning scenarios, not current travel information or official TOPIK questions.','内容为原创学习场景，并非实际交通、预订信息或TOPIK官方试题。')}</p>
 ${old?`<details class="advArchive"><summary>${L('이전 여행 기록','これまでの旅の記録','Previous journey records','以往旅行记录')}</summary><p>${L('기존 진도·재화·수집품이 보존되어 있습니다.','これまでの進行・旅ウォン・コレクションは保存されています。','Your previous progress, travel won and collections are preserved.','原有进度、旅行韩元和收集品均已保留。')}</p>${button(L('이전 코스 열기','以前のコースを開く','Open previous course','打开原来的路线'),"harumalAdventureLegacy()",'advSecondary')}</details>`:''}`;
}
function play(sc){
 const {level,p,q}=current();if(!q)return finish(sc,level,p);
 const ready=p.turn===3,answered=p.result!==null,correct=p.result===q.answer;
 sc.innerHTML=head(l(q.title))+`<p class="advKicker">TOPIK ${level===1?'I':'II'} · ${p.index+1}/4 <span>${L('대화 → 단서 → 응답','会話 → 手がかり → 返答','Dialogue → Clue → Reply','对话 → 线索 → 回应')}</span></p>
 <div class="advScene"><img class="advBackground" src="${assets.backgrounds[q.place]}" alt=""><img class="advCharacter" src="${q.place==='airport'?assets.npcs.airportGuide:assets.npcs.stationGuide}" alt=""></div>
 <section class="advDialogue" aria-label="${L('대화','会話','Dialogue','对话')}">${q.dialogue.slice(0,Math.min(3,p.turn+1)).map((d,i)=>`${i===0&&p.turn>0?`<details class="advHistory"><summary>${L('지난 대화 보기','これまでの会話','Dialogue history','查看之前的对话')}</summary>`:''}<div class="advLine ${d.speaker}"><b>${h(names()[d.speaker])} <small>${i+1}/3</small></b><p lang="ko">${h(d.text.ko)}</p>${translation(d.text)}</div>${i===Math.min(p.turn,2)-1?'</details>':''}`).join('')}
 ${!ready?button(p.turn<2?L('다음 대화','次の会話','Next line','下一句'):L('단서 확인하고 응답하기','手がかりを見て答える','Check the clue and reply','查看线索并回答'),"harumalAdventureNextLine()"):''}</section>
 ${ready?`<section class="advClue"><h2>${L('확인할 단서','確認する手がかり','Your clue','需要确认的线索')}</h2><p lang="ko">${h(q.clue.ko)}</p>${translation(q.clue)}</section>
 <section class="advQuestion"><h2 tabindex="-1">${h(l(q.prompt))}</h2><div class="advChoices" role="group" aria-label="${L('응답 고르기','返答を選ぶ','Choose a reply','选择回答')}">${q.choices.map((c,i)=>`<button type="button" class="advChoice ${p.selected===i?'selected':''} ${answered&&i===q.answer?'correct':''} ${answered&&p.result===i&&!correct?'wrong':''}" aria-pressed="${p.selected===i}" onclick="harumalAdventureChoose(${i})" ${answered?'disabled':''}><span>${i+1}</span><span lang="ko">${h(c.ko)}${answered&&S.lang!=='ko'?`<small lang="${h(S.lang)}">${h(l(c))}</small>`:''}</span></button>`).join('')}</div>
 ${!answered?button(L('이렇게 말하기','この返答で話す','Say this','这样回答'),"harumalAdventureSubmit()",'advPrimary',p.selected===null):''}</section>`:''}
 ${answered?`<section class="advFeedback ${correct?'success':'retry'}" tabindex="-1" role="status"><h2>${correct?L('이야기가 이어집니다','物語が進みます','The story moves forward','故事继续了'):L('단서를 다시 연결해 봐요','手がかりをつなぎ直そう','Connect the clues again','再把线索联系起来')}</h2><h3>${L('결정적인 근거','決め手となる根拠','Decisive evidence','关键依据')}</h3><p>${h(l(q.evidence))}</p>${!correct?`<h3>${L('내 응답에서 놓친 점','選んだ返答の落とし穴','What your reply missed','所选回答忽略之处')}</h3><p>${h(l(q.traps[p.result]))}</p>`:''}<details><summary>${L('선택지별 함정','選択肢ごとの落とし穴','Each distractor explained','各选项的陷阱')}</summary>${q.traps.map((t,i)=>t?`<p><b>${i+1}.</b> ${h(l(t))}</p>`:'').join('')}</details><h3>${L('다음에도 쓰는 풀이법','次にも使える考え方','Use this next time','下次也能用的解题方法')}</h3><p>${h(l(q.method))}</p>${button(correct?(p.index===3?L('여행 마무리','旅を振り返る','Finish the journey','总结旅程'):L('다음 장면','次の場面','Next scene','下一幕')):L('다시 응답하기','もう一度答える','Try another reply','重新回答'),correct?'harumalAdventureAdvance()':'harumalAdventureRetry()')}</section>`:''}`;
}
function finish(sc,level,p){sc.innerHTML=head(L('서울에서 해낸 네 번의 대화','ソウルで交わした4つの会話','Four conversations in Seoul','在首尔完成的四段对话'))+`<section class="advFinish"><small>TOPIK ${level===1?'I':'II'} · 4/4</small><h2>${L('이제, 내 말로 떠올려요','今度は自分の言葉で','Now, recall it in your own words','现在用自己的话回想')}</h2><p>${L('선택해서 맞힌 표현을 보지 않고 말하거나 써 보세요.','選んで正解した表現を、見ずに話すか書いてみましょう。','Try saying or writing the expressions without seeing the answers.','试着不看答案说出或写出刚才选对的表达。')}</p>${button(L('여행 표현 떠올리기','旅の表現を思い出す','Recall travel phrases','回想旅行表达'),`harumalAdventureReview(${level})`)}${button(L('여행 목록으로','旅の一覧へ','Back to journeys','返回旅程列表'),"setView('travel')",'advSecondary')}</section><ol class="advRecap">${DATA.levels[level].map(q=>`<li><h3>${h(l(q.title))}</h3><p lang="ko">${h(q.choices[q.answer].ko)}</p><p>${p.answers[q.id]?.attempts.length===1?L('첫 응답으로 해결','最初の返答で解決','Resolved on your first reply','首次回答解决'):L('다시 살펴보고 해결','見直して解決','Resolved after reconsidering','重新思考后解决')}</p></li>`).join('')}</ol>`}
function review(sc){
 const {level,p}=current(),available=DATA.levels[level].filter(q=>p.answers[q.id]?.solved);
 const q=available.find(q=>q.id===(reviewing||p.reviewId))||available.slice().sort((x,y)=>(p.recall[x.id]?.nextDueAt||0)-(p.recall[y.id]?.nextDueAt||0))[0];
 if(!q){hub(sc);return}reviewing=q.id;const r=p.recall[q.id]||{};
 sc.innerHTML=head(L('상황만 보고 떠올리기','場面だけで思い出す','Recall from the situation','只看情境回想'))+`<p class="advLead">${L('소리 내어 말하거나 적은 뒤 예시와 비교하세요. 문법 자동 채점은 하지 않습니다.','声に出すか書いてから例と比べましょう。文法の自動採点はしません。','Say it or write it, then compare with the example. This does not automatically grade grammar.','说出或写下后与示例比较，不进行语法自动评分。')}</p><label class="advRecallPrompt" for="advDraft">${h(l(q.recall.prompt))}</label><textarea id="advDraft" lang="ko" rows="3" oninput="harumalAdventureDraft(this.value)" placeholder="${L('한국어로 써 보세요','韓国語で書いてみましょう','Try writing in Korean','请用韩语写一写')}">${h(r.draft||'')}</textarea>
 ${!r.revealed?button(L('예시와 비교하기','例と比べる','Compare with an example','与示例比较'),"harumalAdventureReveal()"): `<section class="advClue"><h2>${L('표현 예시','表現の例','An example expression','表达示例')}</h2><p lang="ko">${h(q.recall.model)}</p><p>${L('다른 자연스러운 표현도 가능합니다. 같은 뜻을 전달했는지 스스로 확인하세요.','別の自然な表現も可能です。同じ意味を伝えられたか確認しましょう。','Other natural wording is possible. Check whether you conveyed the same meaning.','也可以使用其他自然表达，请确认是否传达了相同意思。')}</p></section><div class="advRecallActions">${button(L('도움이 필요했어요 · 10분 후','助けが必要でした · 10分後','Needed help · in 10 min','需要帮助 · 10分钟后'),"harumalAdventureRate(false)",'advSecondary')}${button(L('스스로 떠올렸어요 · 내일','自分で思い出せた · 明日','Recalled it myself · tomorrow','自己想起来了 · 明天'),"harumalAdventureRate(true)")}</div>`}
 ${r.selfRatedAt?`<p role="status">${L('자가 확인을 기록했어요.','自己確認を記録しました。','Self-assessment recorded.','已记录自我评估。')}</p>`:''}<h2>${L('연습할 표현','練習する表現','Phrases to practice','可练习的表达')}</h2><div class="advReviewList">${available.map(item=>button(h(l(item.title)),`harumalAdventurePickReview('${item.id}')`,'advSecondary')).join('')}</div>`;
}
window.harumalAdventureStart=level=>{if(![1,2].includes(level))return;if(update(a=>{a.activeLevel=level;const p=state(a,level);if(!p.rewardSessionId)p.rewardSessionId=`travel-adventure:course:${level}`;a.levels[level]=p}))go('travelAdventure')};
window.harumalAdventureNextLine=()=>{if(mutate(p=>{p.turn=Math.min(3,p.turn+1)})){render();focus('.advQuestion h2')}};
window.harumalAdventureChoose=i=>{const {p,q}=current();if(!q||p.turn<3||p.result!==null||!Number.isInteger(i)||i<0||i>3)return;if(mutate(p=>{p.selected=i})){render();focus(`.advChoice:nth-child(${i+1})`)}};
window.harumalAdventureSubmit=()=>{const {p,q}=current();if(!q||p.turn<3||p.result!==null||p.selected===null)return;if(mutate((p,q)=>{p.result=p.selected;const r=p.answers[q.id]||{attempts:[],solved:false};r.attempts.push({choice:p.selected,correct:p.selected===q.answer,at:Date.now()});r.solved=r.solved||p.selected===q.answer;p.answers[q.id]=r;if(!p.rewardSessionId)p.rewardSessionId=`travel-adventure:course:${current().level}`} )){const saved=current();window.HARUMAL_REWARDS?.answer({source:'travel-adventure',sessionId:saved.p.rewardSessionId,slot:q.id,question:{...q,level:saved.level},correct:p.selected===q.answer,assisted:(saved.p.answers[q.id]?.attempts.length||0)>1});render();focus('.advFeedback')}};
window.harumalAdventureRetry=()=>{const {p,q}=current();if(!q||p.result===null||p.result===q.answer)return;if(mutate(p=>{p.selected=null;p.result=null})){render();focus('.advQuestion h2')}};
window.harumalAdventureAdvance=()=>{const {p,q}=current();if(!q||p.result!==q.answer)return;if(mutate(p=>{p.index++;p.turn=0;p.selected=null;p.result=null})){render();window.scrollTo?.({top:0,behavior:'auto'});focus('.advTitle')}};
window.harumalAdventureReview=level=>{reviewing=null;if(update(a=>{a.activeLevel=level===2?2:1}))go('travelAdventureReview')};
window.harumalAdventurePickReview=id=>{const {level,p}=current();if(!DATA.levels[level].some(q=>q.id===id&&p.answers[q.id]?.solved))return;reviewing=id;if(mutate(p=>{p.reviewId=id})){render();focus('#advDraft')}};
window.harumalAdventureDraft=value=>{if(reviewing)mutate(p=>{p.recall[reviewing]={...p.recall[reviewing],draft:String(value).slice(0,2000)}})};
window.harumalAdventureReveal=()=>{if(reviewing&&mutate(p=>{p.recall[reviewing]={...p.recall[reviewing],revealed:true}}))render()};
window.harumalAdventureRate=remembered=>{if(!reviewing||!current().p.recall[reviewing]?.revealed)return;const previous=reviewing;if(mutate(p=>{p.reviewId=null;p.recall[previous]={...p.recall[previous],selfRatedAt:Date.now(),selfReportedRecall:!!remembered,nextDueAt:Date.now()+(remembered?86400000:600000),revealed:false,draft:''}})){reviewing=null;render()}};
window.harumalAdventureLegacy=()=>go('travelLegacy');
const base=window.render;
window.render=function(){
 const view=S.view,owned=['travel','travelAdventure','travelAdventureReview'].includes(view);
 document.body.classList.toggle('travel-adventure-active',owned);
 if(view==='travelLegacy'){S.view='travel';try{return base.apply(this,arguments)}finally{S.view=view}}
 if(!owned)return base.apply(this,arguments);
 document.body.classList.remove('travel-active','travel-rpg-active','tq-home-active','tq-shorts-active','tq-game-active','tq-stats-active');
 window.MALBIT_TRAVEL.rpg?.stop?.();try{hideSelection()}catch{}renderShell();
 const sc=document.getElementById('screen');sc.className='screen adventureScreen';
 if(view==='travel')hub(sc);else if(view==='travelAdventureReview')review(sc);else play(sc);
 if(error)sc.insertAdjacentHTML('afterbegin',`<p class="advError" role="alert">${h(error)}</p>`);
};
window.HARUMAL_ADVENTURE=Object.freeze({storageKey:KEY,data:DATA,mergeImport,summary:()=>{const {a}=current();return[1,2].map(level=>({level,solved:Object.values(state(a,level).answers).filter(x=>x.solved).length}))}});
})();
