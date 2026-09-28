// Saved-word recall tests. Keep the attempt inside the existing portable S root.
(function(){
'use strict';
const L=(ko,ja,en,zh)=>({ko,ja,en,zh}[S.lang]||en);
const html=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=value=>String(value??'').normalize('NFC').trim().replace(/\s+/g,' ');
function pool(vocab,lang){
 const target=lang==='ko'?'ja':lang,seen=new Set();
 return (Array.isArray(vocab)?vocab:[]).flatMap(v=>{
  const term=normalize(v.text),meaning=String(v.meanings?.[target]||(target==='ja'?v.ja:'')||'').trim();
  if(!term||!meaning||normalize(meaning)===term||seen.has(term))return [];
  seen.add(term);return [{term,meaning,target}];
 });
}
function deck(items){const copy=items.map(x=>({...x}));for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy.slice(0,10)}
function attempt(){const a=S.vocabExam;return a?.version===1&&Array.isArray(a.items)&&a.items.length&&Array.isArray(a.answers)?a:null}
function start(items){if(!items.length)return;S.vocabExam={version:1,items:deck(items),answers:[],draft:'',startedAt:Date.now()};save();setView('vocabTest')}
window.harumalVocabTestStart=()=>start(pool(S.vocab,S.lang));
window.harumalVocabTestResume=()=>{if(attempt())setView('vocabTest')};
window.harumalVocabTestDraft=value=>{const a=attempt();if(!a||a.finishedAt)return;a.draft=String(value).slice(0,240);save()};
window.harumalVocabTestSubmit=event=>{
 event?.preventDefault();if(event?.isComposing)return false;
 const a=attempt();if(!a||a.finishedAt)return false;
 const item=a.items[a.answers.length],answer=normalize(a.draft);if(!item||!answer)return false;
 a.answers.push({text:answer,ok:answer===normalize(item.term)});a.draft='';
 if(a.answers.length===a.items.length)a.finishedAt=Date.now();save();render();return false;
};
window.harumalVocabTestRetry=()=>{const a=attempt();if(a?.finishedAt)start(a.items.filter((_,i)=>!a.answers[i]?.ok))};
function toolbar(sc){
 if(sc.querySelector('.harumalVocabModes'))return;
 const items=pool(S.vocab,S.lang),a=attempt(),remaining=Math.max(0,(S.vocab?.length||0)-items.length);
 const section=document.createElement('section');section.className='harumalVocabModes';
 section.innerHTML=`<div class="harumalVocabTabs"><span aria-current="page">${L('플래시카드','フラッシュカード','Flashcards','闪卡')}</span><button onclick="harumalVocabTestStart()" ${items.length?'':'disabled'}>${L('시험 시작','テスト開始','Start test','开始测试')}</button></div><p>${L('뜻을 보고 저장한 한국어를 직접 입력해요. 최대 10문제, 채점은 마지막에.','意味を見て、保存した韓国語を入力。最大10問、採点は最後に。','Type the saved Korean expression from its meaning. Up to 10 questions; results at the end.','看词义输入收藏的韩语。最多10题，最后统一评分。')}</p>${remaining?`<small>${L(`${remaining}개는 뜻이 없거나 중복되어 제외돼요. 상세 편집에서 뜻을 확인하세요.`,`${remaining}語は意味未登録・重複のため対象外。詳細編集で意味を確認できます。`,`${remaining} entries lack a meaning or are duplicates. Check meanings in Details.`,`${remaining}条因缺少释义或重复而不参与。请在详情中确认释义。`)}</small>`:''}${a?`<button class="harumalTextButton" onclick="harumalVocabTestResume()">${a.finishedAt?L('지난 시험 결과','前回の結果','Last test result','上次测试结果'):L(`시험 이어서 풀기 · ${a.answers.length}/${a.items.length}`,`テストの続き · ${a.answers.length}/${a.items.length}`,`Resume test · ${a.answers.length}/${a.items.length}`,`继续测试 · ${a.answers.length}/${a.items.length}`)} →</button>`:''}`;
 sc.querySelector('.tqVocabTitle,.malbitPageTitle')?.insertAdjacentElement('afterend',section);
}
function renderTest(sc){
 const a=attempt();sc.className='screen harumalVocabTest';
 const header=`<button class="harumalTextButton" onclick="setView('vocab')">← ${L('단어장으로','単語帳へ','Back to words','返回单词本')}</button><header class="harumalPageHead"><small>${L('내 단어 시험','単語テスト','YOUR WORD TEST','单词测试')}</small><h1>${L('기억에서 꺼내보기','思い出して書こう','Recall it yourself','试着回想')}</h1></header>`;
 if(!a){sc.innerHTML=header;return}
 if(a.finishedAt){
  const score=a.answers.filter(x=>x.ok).length;
  sc.innerHTML=header+`<section class="harumalTestResult" role="status"><b>${score} / ${a.items.length}</b><h2>${L('시험 완료','テスト完了','Test complete','测试完成')}</h2><p>${L('저장한 표현과 일치한 답이에요. 동의어나 다른 올바른 표현은 자동 판정하지 않아요.','保存した表現との一致で採点。同義語や別の正しい表現は自動判定しません。','Scored against your saved expressions. Synonyms and other valid wording are not automatically accepted.','按收藏的表达评分。同义词或其他正确表达不会自动判定为正确。')}</p></section><ol class="harumalTestAnswers">${a.items.map((item,i)=>`<li><small>${a.answers[i]?.ok?'✓':L('다시 보기','もう一度','Revisit','再复习')}</small><p lang="${html(item.target)}">${html(item.meaning)}</p><b lang="ko">${html(item.term)}</b>${!a.answers[i]?.ok?`<p>${L('내 답:','自分の答え：','Your answer:','你的答案：')} <span lang="ko">${html(a.answers[i]?.text)}</span></p>`:''}</li>`).join('')}</ol>${score<a.items.length?`<button class="harumalTestPrimary" onclick="harumalVocabTestRetry()">${L('틀린 단어 재시험','間違えた単語を再テスト','Retry missed words','重测错词')}</button>`:''}`;
  return;
 }
 const item=a.items[a.answers.length];
 sc.innerHTML=header+`<div class="harumalTestProgress"><span>${a.answers.length+1} / ${a.items.length}</span><small>${L('중간에 나가도 이어서 풀 수 있어요','途中で閉じても続きから','You can leave and resume','可退出后继续')}</small></div><progress max="${a.items.length}" value="${a.answers.length}" aria-label="${L('시험 진행','テスト進行','Test progress','测试进度')}"></progress><form class="harumalTestCard" onsubmit="return harumalVocabTestSubmit(event)"><label for="vocabTestAnswer">${L('이 뜻의 한국어 표현은?','この意味の韓国語は？','What is the Korean expression?','这个意思的韩语表达是？')}</label><h2 lang="${html(item.target)}">${html(item.meaning)}</h2><input id="vocabTestAnswer" lang="ko" value="${html(a.draft)}" maxlength="240" autocomplete="off" autocapitalize="off" spellcheck="false" oninput="harumalVocabTestDraft(this.value)" onkeydown="if(event.key==='Enter'&amp;&amp;event.isComposing)event.preventDefault()" required placeholder="${L('한국어로 입력','韓国語で入力','Type in Korean','用韩语输入')}"><p>${L('저장한 표현 그대로 입력해요.','保存した表現どおりに入力。','Enter the expression as saved.','请输入收藏的原表达。')}</p><button class="harumalTestPrimary" type="submit">${a.answers.length===a.items.length-1?L('결과 보기','結果を見る','See results','查看结果'):L('다음 문제','次の問題','Next question','下一题')} →</button></form>`;
}
window.HARUMAL_VOCAB_TEST=Object.freeze({normalize,pool});
const base=render;render=function(){if(S.view==='vocabTest'){renderShell();return renderTest(document.getElementById('screen'))}const result=base.apply(this,arguments);if(S.view==='vocab')toolbar(document.getElementById('screen'));return result};
})();
