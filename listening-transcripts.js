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
function recordedTurns(q){
 const original=q?.collectionId==='original12-v1';
 const entry=original?window.HARUMAL_ORIGINAL_AUDIO?.entry?.(q):null;
 const segments=original?(entry?.segments||null):window.HARUMAL_LISTENING_AUDIO?.resolve?.(q?.script);
 if(!Array.isArray(segments)||!segments.length)return null;
 const turns=segments.filter(s=>!s.pause).map(s=>({speaker:s.voice||s.gender||'',text:s.text}));
 return turns.length&&turns.every(s=>typeof s.text==='string'&&s.text.trim())?turns:null;
}
function markup(q,{submitted=false,examActive=false}={}){
 if(!submitted||examActive||activeMock()||!q?.script)return'';
 const id=q.bankId||q.id,support=window.HARUMAL_ORIGINAL_SUPPORT?.verified&&window.HARUMAL_ORIGINAL_SUPPORT.byId?.[id],verified=support?.sourceScript===q.script&&support.sourceContentSha256===(q.contentSha256||q.qa?.contentSha256)?support:null,current=lang(),translated=verified?.transcripts?.[current];
 const recorded=recordedTurns(q),ko=verified?.transcripts?.ko||{turns:[],evidence:[]};
 const section=(pack,locale)=>`<div class="listeningTranscriptBody" lang="${locale}">${pack.turns.map((turn,index)=>`<p>${turn.speaker?`<b>${h(turn.speaker)}</b> `:''}${highlighted(turn.text,pack.evidence.filter(s=>s.turnIndex===index).map(s=>s.quote))}</p>`).join('')}</div>`;
 const pending=L('이 언어의 검수된 전체 번역은 준비 중입니다.','この言語の確認済み全文訳は準備中です。','The reviewed full translation in this language is not ready yet.','此语言的完整校对译文尚未准备好。');
 const speakerName=voice=>/^F|female/.test(voice)?L('여성 화자','女性話者','Female speaker','女性说话者'):/^M|male/.test(voice)?L('남성 화자','男性話者','Male speaker','男性说话者'):L('화자','話者','Speaker','说话者');
 const recording=recorded?`<div class="listeningRecordedScript" lang="ko" data-recorded-transcript>${recorded.map((turn,turnIndex)=>`<p><b>${h(speakerName(turn.speaker))}${/^[FM][1-9]$/.test(turn.speaker)?` · ${h(turn.speaker)}`:''}</b><span>${highlighted(turn.text,(ko.evidence||[]).filter(x=>x.turnIndex===turnIndex).map(x=>x.quote))}</span></p>`).join('')}</div>`:`<p data-transcript-missing role="status">${L('이 문항에 연결된 녹음 대본을 확인할 수 없습니다. 오류 신고에 문항 번호를 포함해 주세요.','この問題の録音台本を確認できません。問題番号を添えて報告してください。','The recording transcript could not be verified for this question. Include its ID in a report.','无法核实本题的录音原文，请在报告中附上题目编号。')}</p>`;
 return `<details class="listeningTranscript" open><summary>${L('대본 보기','台本を見る','View transcript','查看听力原文')}</summary><p class="listeningTranscriptLegend">${L('표시된 부분은 정답 판단 단서입니다. 아래 해설과 함께 확인하세요.','ハイライトは正解を判断する手掛かりです。解説と合わせて確認してください。','Highlighted phrases support the answer. Read them together with the explanation.','高亮内容是判断正确答案的线索，请结合解析查看。')}</p>${recording}${current==='ko'?'':translated?section(translated,current):`<p class="muted" data-transcript-pending>${pending}</p>`}${current!=='ko'&&verified?`<details><summary>${L('한국어 원문','韓国語原文','Korean original','韩语原文')}</summary>${section(ko,'ko')}</details>`:''}</details>`;
}
window.HARUMAL_TRANSCRIPTS=Object.freeze({markup,highlighted,activeMock,recordedTurns});
})();
