const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('legacy-core.js','utf8');
function setup(){
 const elements={};const c={S:{lang:'ko',writing:{},writingHistory:{}},ml:(ko)=>ko,tr:key=>key,esc:s=>String(s).replaceAll('<','&lt;'),save:()=>{},$:id=>elements[id]};
 vm.createContext(c);vm.runInContext(fs.readFileSync('writing-answers.js','utf8'),c);
 vm.runInContext(source.slice(source.indexOf('function writingPair('),source.indexOf('function renderWriting(')),c);
 vm.runInContext(source.slice(source.indexOf('function renderWriting('),source.indexOf('function bindMCQ(')),c);
 vm.runInContext(source.slice(source.indexOf('function bindWrite('),source.indexOf('function gameBack(')),c);
 vm.runInContext(source.slice(source.indexOf('function writingEstimate('),source.indexOf('function finishReal(')),c);
 vm.runInContext(source.slice(source.indexOf('function infinityCurrentQuestion('),source.indexOf('function nextInfinity(')),c);
 return {c,w:c.MALBIT_WRITING,elements};
}
test('old labelled answers split; unlabelled originals survive without guessed newline boundaries',()=>{
 const {w}=setup();for(const old of ['㉠ 첫째 답 / ㉡ 둘째 답','ㄱ: 첫째 답\nㄴ: 둘째 답']){const v=w.normalize(old);assert.equal(v.answers.giyeok,'첫째 답');assert.equal(v.answers.nieun,'둘째 답');assert.equal(v.legacyText,old);assert.equal(JSON.stringify(w.normalize(v)),JSON.stringify(v));}
 const old='기존 답안\n두 번째 줄';const v=w.normalize(old);assert.equal(v.answers.giyeok,old);assert.equal(v.answers.nieun,'');assert.equal(v.needsReview,true);assert.equal(v.legacyText,old);
});
test('two inputs save independently, survive serialization and preserve unrelated learner data',()=>{
 const {c,w,elements}=setup();c.S.writing={51:'예전 원문',53:'긴 글 보존'};c.S.vocab=[{text:'보존'}];
 for(const key of w.keys){elements['writeBox-'+key]={value:''};elements['count-'+key]={textContent:''};}
 c.bindWrite(51,'inf');elements['writeBox-nieun'].value='두번째 답안';elements['writeBox-nieun'].oninput();assert.equal(c.S.writing[51].answers.giyeok,'예전 원문');
 elements['writeBox-giyeok'].value='첫번째 수정';elements['writeBox-giyeok'].oninput();const saved=JSON.parse(JSON.stringify(c.S));assert.equal(saved.writing[51].answers.nieun,'두번째 답안');assert.equal(saved.writing[51].legacyText,'예전 원문');assert.equal(saved.writing[53],'긴 글 보존');assert.equal(saved.vocab[0].text,'보존');
 const markup=c.writingFields({id:51});assert.equal((markup.match(/<textarea/g)||[]).length,2);assert.match(markup,/for="writeBox-giyeok"/);assert.match(markup,/for="writeBox-nieun"/);
});
test('one full blank cannot satisfy the other; model comparison and review retain field identity',()=>{
 const {c,w}=setup();let value={answers:{giyeok:'충분히 긴 답안입니다',nieun:''}};assert.equal(w.ready(51,value,3),false);value.answers.nieun='새 답안';assert.equal(w.ready(51,value,3),true);assert.equal(w.ready(53,'가'.repeat(80),80),true);
 const q={id:51,bankId:'test-writing-51',stem:'연습',model:'㉠ 충분히 긴 답안입니다 / ㉡ 다른 답안'};c.S.writing[51]=value;c.rememberWriting(q,'random');value.answers.nieun='나중 수정';assert.equal(c.S.writingHistory[q.bankId].answers.nieun,'새 답안');assert.equal(c.S.writingHistory[q.bankId].assessment.giyeok.status,'model-match');assert.equal(c.S.writingHistory[q.bankId].assessment.nieun.status,'compare');assert.match(c.writingReviewMarkup(),/새 답안/);assert.doesNotMatch(c.writingReviewMarkup(),/나중 수정/);
});
test('short-writing estimate scores each blank separately and preserves the 20-point ceiling',()=>{
 const {c}=setup();assert.equal(c.writingEstimate(),0);c.S.writing[51]={answers:{giyeok:'공부하고 있기 때문입니다.',nieun:''}};assert.equal(c.writingEstimate(),5);c.S.writing[51].answers.nieun='공부하고 있기 때문입니다.';c.S.writing[52]=c.S.writing[51];assert.equal(c.writingEstimate(),20);
});
test('PBT targets and approximate length do not change short-practice readiness',()=>{
 const {w}=setup();
 assert.deepEqual({...w.pbtTarget(53)},{min:200,max:300});
 assert.deepEqual({...w.pbtTarget('54')},{min:600,max:700});
 assert.equal(w.pbtTarget(51),null);
 assert.ok(Object.isFrozen(w.pbtTarget(54)));
 assert.equal(w.pbtLength('가 나\r\n다.\n'),5);
 assert.equal(w.pbtLength('가'),1,'decomposed Hangul is normalized before counting');
 assert.equal(w.pbtLength('가😀'),2,'count Unicode characters, not UTF-16 code units');
 for(const [id,minimum] of [[53,80],[54,120]]){
  assert.equal(w.ready(id,'가'.repeat(minimum),minimum),true);
  assert.equal(w.ready(id,'가'.repeat(minimum-1)+' ',minimum),false,'spaces do not unlock the practice gate');
 }
});
test('long-writing estimate uses the displayed 200–300 and 600–700 target boundaries',()=>{
 const {c}=setup();
 for(const [id,boundaries] of [[53,[[199,10],[200,16],[300,16],[301,10]]],[54,[[599,17],[600,24],[700,24],[701,17],[750,17]]]]){
  for(const [length,expected] of boundaries){c.S.writing={[id]:'가'.repeat(length)};assert.equal(c.writingEstimate(),expected,`${id}: ${length} characters`);}
 }
 c.S.writing={53:'가 나 '.repeat(50)};assert.equal(c.writingEstimate(),16,'spaces agree with the displayed approximate count');
 c.S.writing={54:'가'.repeat(599)+'\r\n'};assert.equal(c.writingEstimate(),17,'line breaks do not add length');
 c.S.writing={53:' '.repeat(200)+'\n',54:' '.repeat(600)+'\n\n'};assert.equal(c.writingEstimate(),0,'blank whitespace cannot earn length or paragraph credit');
 assert.match(source,/Writing is a study-only estimate/);
 assert.match(source,/It is not official scoring/);
});
test('full-writing render and live counter share target ranges and save original text unchanged',()=>{
 const {c,w,elements}=setup();
 for(const id of [53,54]){
  const target=w.pbtTarget(id),value='가 나\r\n다.';
  c.S.writing[id]=value;
  const markup=c.renderWriting({id,stem:'연습',min:1,max:999},true);
  assert.match(markup,new RegExp(`id="charCount">5 / ${target.min}~${target.max}`));
  assert.match(markup,/공백 포함·줄바꿈 제외/);
  assert.match(markup,/원고지 칸 수와 다를 수/);
  elements.writeBox={value};elements.charCount={textContent:''};
  c.bindWrite(id,'real');elements.writeBox.oninput();
  assert.equal(elements.charCount.textContent,`5 / ${target.min}~${target.max}`);
  assert.equal(c.S.writing[id],value,'count normalization never rewrites the learner answer');
 }
});
test('random bank question reconstruction keeps PBT targets separate from practice minimums',()=>{
 const {c,w}=setup();
 c.window={MALBIT_BANK:{present:bankId=>({bankId,passage:'자료',prompt:'쓰기',group:'연습'})}};
 for(const id of [53,54]){
  c.S.infinity={current:{type:'write',id,bankId:`test-${id}`,choiceOrder:[]}};
  const q=c.infinityCurrentQuestion();
  assert.equal(q.min,w.pbtTarget(id).min);
  assert.equal(q.max,w.pbtTarget(id).max);
  assert.equal(q.stem,'자료\n\n쓰기');
 }
 c.S.infinity={current:{type:'read',id:1,bankId:'read-1',choiceOrder:[0,1,2,3]}};
 assert.equal(c.infinityCurrentQuestion().min,undefined);
 assert.equal(c.infinityCurrentQuestion().max,undefined);
});
