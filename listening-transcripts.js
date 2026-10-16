// Source-bound listening review; never exposes dialogue or cues before submission.
(function(){
'use strict';
const h=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state=()=>typeof S!=='undefined'?S:window.S;
const lang=()=>['ko','ja','en','zh'].includes(state()?.lang)?state().lang:'ko';
const L=(ko,ja,en,zh)=>({ko,ja,en,zh}[lang()]);
function activeMock(){if(state()?.real?.active)return true;try{const q=JSON.parse(localStorage.getItem('topikQuestTopik1Session')||'null');return q?.mode==='real'&&!q.result}catch{return false}}
function highlighted(text,quotes){
 const ranges=[];for(const quote of quotes){if(!quote)continue;let start=0,index;while((index=text.indexOf(quote,start))>=0){ranges.push([index,index+quote.length]);start=index+quote.length}}
 ranges.sort((a,b)=>a[0]-b[0]);const merged=[];for(const r of ranges){const last=merged.at(-1);if(last&&r[0]<=last[1])last[1]=Math.max(last[1],r[1]);else merged.push([...r])}
 let cursor=0,out='';for(const [a,b]of merged){out+=h(text.slice(cursor,a))+`<mark>${h(text.slice(a,b))}</mark>`;cursor=b}return out+h(text.slice(cursor));
}
function markup(q,{submitted=false,examActive=false}={}){
 if(!submitted||examActive||activeMock()||!q?.script)return'';
 const id=q.bankId||q.id,support=window.HARUMAL_ORIGINAL_SUPPORT?.verified&&window.HARUMAL_ORIGINAL_SUPPORT.byId?.[id],verified=support?.sourceScript===q.script&&support.sourceContentSha256===(q.contentSha256||q.qa?.contentSha256)?support:null,current=lang(),translated=verified?.transcripts?.[current];
 const ko=verified?.transcripts?.ko||{turns:q.script.split('\n').map(line=>({speaker:'',text:line})),evidence:[]};
 const section=(pack,locale)=>`<div class="listeningTranscriptBody" lang="${locale}">${pack.turns.map((turn,index)=>`<p>${turn.speaker?`<b>${h(turn.speaker)}</b> `:''}${highlighted(turn.text,pack.evidence.filter(s=>s.turnIndex===index).map(s=>s.quote))}</p>`).join('')}</div>`;
 const pending=L('이 언어의 검수된 전체 번역은 준비 중입니다.','この言語の確認済み全文訳は準備中です。','The reviewed full translation in this language is not ready yet.','此语言的完整校对译文尚未准备好。');
 return `<details class="listeningTranscript"><summary>${L('대본 보기','台本を見る','View transcript','查看听力原文')}</summary><p class="listeningTranscriptLegend">${L('표시된 부분은 정답 판단 단서입니다. 아래 해설과 함께 확인하세요.','ハイライトは正解を判断する手掛かりです。解説と合わせて確認してください。','Highlighted phrases support the answer. Read them together with the explanation.','高亮内容是判断正确答案的线索，请结合解析查看。')}</p>${current==='ko'?section(ko,'ko'):translated?section(translated,current):`<p class="muted" data-transcript-pending>${pending}</p>`}${current!=='ko'?`<details><summary>${L('한국어 원문','韓国語原文','Korean original','韩语原文')}</summary>${section(ko,'ko')}</details>`:''}</details>`;
}
window.HARUMAL_TRANSCRIPTS=Object.freeze({markup,highlighted,activeMock});
})();
