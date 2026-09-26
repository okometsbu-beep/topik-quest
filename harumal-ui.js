// HARUMAL navigation and learning hub. Existing learning engines and storage own all progress.
(function(){
'use strict';
const labels={ko:['오늘','학습','여행','복습','내 기록'],ja:['今日','学ぶ','旅','復習','マイ'],en:['Today','Learn','Travel','Review','My'],zh:['今天','学习','旅行','复习','我的']};
const tabs=['home','learn','travel','review','more'];
const paths=['M3 10 12 3l9 7v11H3z M9 21v-8h6v8','M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3z M12 6v16','m12 3 8 18-8-4-8 4z','M4 9a8 8 0 1 1 0 7 M4 3v6h6','M16 7a4 4 0 1 1-8 0 4 4 0 1 1 8 0 M4 21v-3a8 8 0 0 1 16 0v3'];
const L=(ko,ja,en,zh)=>({ko,ja,en,zh}[S.lang]||en);
const icon=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[i]}"/></svg>`;
function activeTab(view){return view==='home'?'home':view==='travel'?'travel':view==='review'?'review':['more','stats','vocab'].includes(view)?'more':'learn'}
window.HARUMAL_UI=Object.freeze({activeTab});
window.harumalGo=function(view){if(!tabs.includes(view))return;if(view==='travel')tqStartMode('travel');else setView(view)};
window.harumalCourse=function(path){if(path==='beginner'){tqSetLearningPath('beginner');setView('beginner')}else if(path==='topik1'||path==='topik2'){tqSetLevel(path==='topik2'?2:1);setView('home')}};
function card(symbol,title,copy,action,extra=''){return `<button class="harumalCourse ${extra}" onclick="${action}"><i aria-hidden="true">${symbol}</i><span><b>${title}</b><small>${copy}</small></span><em aria-hidden="true">↗</em></button>`}
function learn(sc){
 sc.className='screen harumalLearn';
 sc.innerHTML=`<header class="harumalPageHead"><small>HARUMAL / ${L('학습','学ぶ','LEARN','学习')}</small><h1>${L('내 말이 되는 한국어','自分の言葉になる韓国語','Make Korean your own','让韩语成为你的语言')}</h1><p>${L('지금 필요한 한 걸음부터 시작해요.','今の自分に合う、一歩から。','Start with the step that fits you.','从适合你的一步开始。')}</p></header>
 <h2>${L('나의 학습 코스','学習コース','Your learning path','学习课程')}</h2>
 ${card('가',L('한글부터 차근차근','ハングルから、一歩ずつ','Begin with Hangul','从韩文字母开始'),L('소리 · 글자 · 쓰기 · 기초 문법','音・文字・手書き・基礎文法','Sounds · letters · writing · grammar','发音 · 字母 · 手写 · 基础语法'),"harumalCourse('beginner')",'harumalBeginner')}
 ${card('I','TOPIK I',L('입문 다음, 듣기와 읽기','入門の次は、聴解と読解','Next, listening and reading','入门之后，听力与阅读'),"harumalCourse('topik1')")}
 ${card('II','TOPIK II',L('듣기 · 읽기 · 쓰기 유형별 연습','聴解・読解・作文を練習','Listening · reading · writing','听力 · 阅读 · 写作'),"harumalCourse('topik2')")}
 <h2>${L('오늘은 이렇게 연습해요','今日の練習を選ぶ','Choose your practice','选择今天的练习')}</h2><div class="harumalPracticeGrid">
 ${card('♪',L('소리 내어 말하기','声に出して話す','Speak out loud','开口说韩语'),L('듣고 따라 말하기','聞いて、まねして話す','Listen and repeat','听一听，跟着说'),"setView('speaking')")}
 ${card('↗',L('짧은 퀴즈','ミニクイズ','Quick quiz','短题练习'),L('어휘와 문법 한 문제','語彙・文法を1問','Vocabulary & grammar','一道词汇或语法题'),"tqStartMode('shorts')")}
 ${card('◎',L('랜덤 실전','ランダム実戦','Random practice','随机实战'),L('선택한 TOPIK 레벨로','選択中のTOPIKレベル','Your selected TOPIK level','当前TOPIK等级'),"tqStartMode('random')")}
 ${card('▤',L('모의고사','模擬試験','Mock exam','模拟考试'),L('전체 또는 영역별','全体・分野別','Full or by section','全套或分项'),"tqStartMode('real')")}</div>
 <h2>${L('이야기 속에서 연습','物語の中で練習','Learn through stories','在故事中练习')}</h2>
 ${card('✦',L('워드라이트 원정','ワードライト遠征','Wordlight Expedition','词光远征'),L('기존 원정과 기록 이어가기','これまでの冒険を続ける','Continue your expedition','继续你的冒险'),"tqStartMode('game')")}`;
}
function personal(sc){
 if(sc.querySelector('.harumalPersonal'))return;
 const vocab=Array.isArray(S.vocab)?S.vocab.length:0;
 sc.insertAdjacentHTML('afterbegin',`<section class="harumalPersonal"><header class="harumalPageHead"><small>HARUMAL / ${L('내 기록','マイ','MY LEARNING','我的学习')}</small><h1>${L('쌓여가는 나의 한국어','少しずつ、私の韓国語に。','Your Korean, growing daily','一点一滴，积累韩语')}</h1><p>${L('학습 기록은 이 기기에 저장돼요.','学習記録はこの端末に保存されます。','Your progress is stored on this device.','学习记录保存在此设备上。')}</p></header><div class="harumalPracticeGrid">${card('▤',L('내 단어장','単語帳','Vocabulary','单词本'),L(`${vocab}개 저장`,`${vocab}語を保存`,`${vocab} saved`,`${vocab}个已保存`),"setView('vocab')")}${card('↗',L('학습 기록','学習記録','Learning record','学习记录'),L('실제 연습 기록 보기','練習の記録を見る','See your practice history','查看练习记录'),"setView('stats')")}</div></section>`);
}
function shell(){
 document.body.classList.add('harumal');document.body.classList.toggle('harumal-hub',['home','learn','more','vocab','stats','review'].includes(S.view));
 const nav=document.querySelector('.nav');if(!nav)return;
 const selected=activeTab(S.view),names=labels[S.lang]||labels.en;
 const key=`${S.lang}:${selected}`;
 if(nav.dataset.harumal!==key){nav.innerHTML=tabs.map((id,i)=>`<button type="button" id="nav_${id}" class="${id===selected?'active':''}" ${id===selected?'aria-current="page"':''} onclick="harumalGo('${id}')">${icon(i)}<span>${names[i]}</span></button>`).join('');nav.dataset.harumal=key}
 nav.querySelectorAll('button').forEach((button,i)=>{const label=button.querySelector('span');if(label)label.textContent=names[i];const active=button.id==='nav_'+selected;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')});
 for(const language of document.querySelectorAll('.tqLang,#flagBtn'))language.textContent=({ko:'한국어',ja:'日本語',en:'English',zh:'中文'}[S.lang]||'English')+' ⌄';
 const badge=document.querySelector('.top .brand');if(badge)badge.textContent='하';
 const title=document.querySelector('.top .title b');if(title)title.textContent='하루말 · HARUMAL';
 document.title=`하루말 · ${names[tabs.indexOf(selected)]}`;
 const subtitle=document.querySelector('.top .title small');if(subtitle)subtitle.textContent=names[tabs.indexOf(selected)]+' · '+L('하루 한마디','今日のひと言','One phrase today','每天一句');
 const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=document.documentElement.dataset.theme==='dark'?'#102523':'#f7f8f4';
}
const originalShell=renderShell;renderShell=function(){const result=originalShell.apply(this,arguments);shell();return result};
const base=render;
render=function(){const result=base.apply(this,arguments);const sc=document.getElementById('screen');if(S.view==='learn')learn(sc);if(S.view==='more')personal(sc);shell();requestAnimationFrame(shell);return result};
shell();
})();
