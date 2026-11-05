const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function runtime(seed={}){
  const values=new Map(Object.entries(seed));const awards=[];const screen={innerHTML:'',className:''};
  const c={S:{view:'home',lang:'en'},document:{head:{appendChild(){}},createElement:()=>({}),getElementById:id=>id==='screen'?screen:null},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},render(){},setTimeout(){},requestAnimationFrame(){},setView(v){c.S.view=v;c.render()},HARUMAL_REWARDS:{answer:r=>awards.push(r),newSession:()=> 'grammar:new'}};c.window=c;vm.createContext(c);
  for(const f of ['data/beginner-grammar-v1.js','beginner-grammar.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),c);
  c.malbitOpenGrammar();c.malbitGrammarLesson('sentence-order');return {c,values,awards,screen,progress:()=>JSON.parse(values.get('malbitBeginnerV1')||'{}').grammarV1};
}
test('translated ready-made chips: incomplete is unscored, undo/reset and correct work',()=>{
 const {c,awards,screen,progress}=runtime();assert.match(screen.innerHTML,/I study Korean/);assert.match(screen.innerHTML,/I \(topic\)/);assert.match(screen.innerHTML,/Type instead \(optional\)/);
 c.malbitGrammarChip(0);assert.equal(c.malbitGrammarSubmit(),false);assert.equal(awards.length,0);assert.equal(progress().attempts['sentence-order'],undefined);assert.match(screen.innerHTML,/Not finished yet/);
 c.malbitGrammarChipUndo();assert.equal(c.MALBIT_BEGINNER_GRAMMAR_INTERNALS.currentDraft(),'');c.malbitGrammarChip(2);c.malbitGrammarChipReset();assert.equal(c.MALBIT_BEGINNER_GRAMMAR_INTERNALS.currentDraft(),'');
 [0,1,2].forEach(c.malbitGrammarChip);assert.equal(c.malbitGrammarSubmit(),true);assert.equal(awards[0].slot,'sentence-order');assert.equal(awards[0].sessionId,'grammar:lesson:sentence-order');assert.equal(progress().quizCorrect['sentence-order'],true);
});
test('wrong order persists review and assistance through reload, reset, fresh practice, then clears on correct',()=>{
 const first=runtime({'malbitBeginnerV1':JSON.stringify({hangul:{done:7},grammarV1:{completed:['copula'],quizCorrect:{copula:true},writingDone:{copula:true}}})});
 [2,0,1].forEach(first.c.malbitGrammarChip);assert.equal(first.c.malbitGrammarSubmit(),false);assert.match(first.screen.innerHTML,/All chunks are present/);assert.equal(first.c.MALBIT_BEGINNER_GRAMMAR_REVIEW.list()[0].id,'sentence-order');
 const next=runtime(Object.fromEntries(first.values));assert.equal(next.c.MALBIT_BEGINNER_GRAMMAR_INTERNALS.currentDraft(),'공부해요 저는 한국어를');next.c.malbitGrammarChipReset();assert.equal(next.c.MALBIT_BEGINNER_GRAMMAR_REVIEW.list().length,1);next.c.malbitGrammarRetry();[0,1,2].forEach(next.c.malbitGrammarChip);assert.equal(next.c.malbitGrammarSubmit(),true);assert.equal(next.awards[0].assisted,true);assert.equal(next.c.MALBIT_BEGINNER_GRAMMAR_REVIEW.list().length,0);assert.equal(JSON.parse(next.values.get('malbitBeginnerV1')).hangul.done,7);assert.ok(next.progress().completed.includes('copula'));assert.equal(next.c.MALBIT_BEGINNER_GRAMMAR_INTERNALS.lessonCount,64);
});
test('arbitrary optional text receives no false verb-order diagnosis; blank is not wrong',()=>{
 const {c,screen,awards}=runtime();c.malbitGrammarDraft('');assert.equal(c.malbitGrammarSubmit(null,true),false);assert.equal(awards.length,0);c.malbitGrammarDraft('hello');c.malbitGrammarSubmit(null,true);assert.match(screen.innerHTML,/Your text differs from the model/);assert.doesNotMatch(screen.innerHTML,/All chunks are present/);
});
test('metadata labels localized in four languages while Korean forms are preserved',()=>{
 const {c,screen}=runtime();const api=c.MALBIT_BEGINNER_GRAMMAR_INTERNALS;
 for(const [lang,expected] of [['ko','명사'],['ja','名詞'],['en','noun'],['zh','名词']]){c.S.lang=lang;assert.equal(api.metadataLabel('명사 + 이에요/예요'),expected+' + 이에요/예요');assert.equal(api.metadataLabel('이에요'),'이에요');c.malbitGrammarLesson('sentence-order');assert.match(screen.innerHTML,/저는/);assert.doesNotMatch(screen.innerHTML,/저 \/ 한국어 \/ 공부하다/)}
});
test('Next crosses chapter boundary and review opens a known lesson only',()=>{
 const {c,screen}=runtime();c.malbitGrammarLesson('question-words');c.malbitGrammarRelative(1);assert.match(screen.innerHTML,/Topic and contrast/);c.malbitGrammarRelative(-1);assert.match(screen.innerHTML,/Question words/);assert.equal(c.MALBIT_BEGINNER_GRAMMAR_REVIEW.open('missing'),false);assert.equal(c.MALBIT_BEGINNER_GRAMMAR_REVIEW.open('sentence-order'),true);
});
test('malformed review storage is safely ignored without deleting unrelated records',()=>{
 const {c}=runtime({malbitBeginnerV1:JSON.stringify({grammarV1:{reviewPending:['unknown','sentence-order']}})});assert.equal(c.MALBIT_BEGINNER_GRAMMAR_REVIEW.list().length,1);
 const second=runtime({malbitBeginnerV1:JSON.stringify({grammarV1:{reviewPending:{bad:true}}})});assert.equal(second.c.MALBIT_BEGINNER_GRAMMAR_REVIEW.list().length,0);
});
