/* Preserve the original 64 lesson identities; only authored packs add assessed activities. */
(function(){
'use strict';
const T=(ko,ja,en,zh)=>({ko,ja,en,zh});
const stageById={"sentence-order":"1","sentence-omission":"1","copula":"1","not-copula":"1","question-words":"1","topic":"1","subject":"1","object":"1","destination-time":"1","action-place":"1","addition-limit":"2","and-particles":"2","possessive":"2","direction-tool":"2","recipient":"2","range":"2","comparison":"2","dictionary-stem":"1","present-haeyo":"1","formal-present":"2","past":"2","future-plan":"2","progressive":"2","negation":"2","inability":"2","ability":"2","want":"2","request":"2","permission":"3","prohibition":"3","obligation":"3","polite-command":"2","do-not":"2","suggestion":"2","intention":"3","and-sequence":"3","cause-sequence":"3","contrast":"3","reason-nikka":"3","condition":"3","simultaneous":"3","before-after":"3","purpose-motion":"3","try-experience":"3","sentence-adverbs":"3","verb-present-modifier":"3","verb-past-modifier":"3","verb-future-modifier":"3","adjective-modifier":"3","noun-modifier":"3","nominalization":"3","batchim-eu":"1","rieul-selection":"2","vowel-contraction":"1","honorific-si":"2","numbers-counters":"2","bieup-irregular":"3","digeut-irregular":"3","reu-irregular":"3","siot-irregular":"3","hieut-irregular":"3","eu-irregular":"3","rieul-drop":"3","hada-doeda":"3"};
const stages=[
{id:'1',title:T('1 문장 첫걸음','1 文の第一歩','1 First sentences','1 句子入门')},
{id:'2',title:T('2 일상에서 말하기','2 日常で話す','2 Everyday interaction','2 日常表达')},
{id:'3',title:T('3 연결과 경험','3 つなぐ・経験','3 Connections and experience','3 衔接与经历')},
{id:'4',title:T('4 전달과 변화','4 伝える・変化','4 Reporting and events','4 转述与变化')},
{id:'5',title:T('5 근거와 관점','5 根拠と視点','5 Evidence and perspective','5 依据与视角')},
{id:'6',title:T('6 가정과 평가','6 仮定と評価','6 Hypothesis and evaluation','6 假设与评价')},
{id:'7',title:T('7 논리와 글쓰기','7 論理と文章','7 Arguments and writing','7 逻辑与写作')},
{id:'8',title:T('8 뉘앙스와 격식','8 ニュアンスと文体','8 Nuance and register','8 语感与语体')}
];
const legacy=window.MALBIT_BEGINNER_GRAMMAR_V1?.lessons||[];
const lessons=legacy.map(x=>({...x,stage:stageById[x.id]||'1',legacy:true,prerequisites:[],meaning:x.goal,contrast:x.trap,activities:[{id:x.id+':original-drill',type:'text',phase:'practice',prompt:x.drill.task,contextKorean:x.drill.source,accepted:[...x.drill.accepted],explanation:x.drill.coach}]}));
const byId=new Map(lessons.map(x=>[x.id,x]));
for(const key of Object.keys(window).filter(k=>k.startsWith('HARUMAL_GRAMMAR_PACK_')).sort()){
 const pack=window[key];if(!Array.isArray(pack))throw Error('Invalid grammar pack '+key);
 for(const authored of pack){
  const previous=byId.get(authored.id);
  const item={...previous,...authored,stage:String(authored.stage||previous?.stage||'1'),prerequisites:authored.prerequisites||previous?.prerequisites||[]};
  if(previous&&authored.supplement===true){const activities=new Map(previous.activities.map(a=>[a.id,a]));for(const a of authored.activities||[])activities.set(a.id,a);item.activities=[...activities.values()]}
  if(!previous)lessons.push(item);else lessons[lessons.findIndex(x=>x.id===item.id)]=item;
  byId.set(item.id,item);
 }
}
lessons.sort((a,b)=>Number(a.stage)-Number(b.stage));
const complete=lessons.filter(x=>x.activities?.some(a=>a.phase==='transfer')&&x.activities?.some(a=>a.phase==='review')).length;
window.HARUMAL_GRAMMAR_COURSE=Object.freeze({version:1,stages:stages.filter(s=>lessons.some(x=>x.stage===s.id)),lessons,coverage:{total:lessons.length,extended:complete,legacy:legacy.length,description:T(
`현재 ${lessons.length}개 항목을 배울 수 있어요. 그중 ${complete}개는 새 상황 연습과 별도 복습 문항을 갖췄어요. 기존 기초 과정의 기록은 유지됩니다. 이 단계는 앱의 학습 순서이며 공식 등급 인증이 아닙니다.`,
`現在${lessons.length}項目を学べます。そのうち${complete}項目には別の場面の練習と復習問題があります。従来の基礎課程の記録は保持されます。この段階はアプリの学習順で、公式級の認定ではありません。`,
`${lessons.length} points are available; ${complete} include separate transfer and review items. Existing foundation progress is preserved. These stages are a learning sequence, not official proficiency certification.`,
`目前可学习${lessons.length}个项目，其中${complete}个配有新情境练习和独立复习题。保留原有基础课程记录。这些阶段是学习顺序，并非官方等级认证。`)}});
})();
