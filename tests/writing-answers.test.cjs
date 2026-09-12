const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('legacy-core.js','utf8');
function setup(){
 const elements={};const c={S:{lang:'ko',writing:{},writingHistory:{}},ml:(ko)=>ko,esc:s=>String(s).replaceAll('<','&lt;'),save:()=>{},$:id=>elements[id]};
 vm.createContext(c);vm.runInContext(fs.readFileSync('writing-answers.js','utf8'),c);
 vm.runInContext(source.slice(source.indexOf('function writingPair('),source.indexOf('function renderWriting(')),c);
 vm.runInContext(source.slice(source.indexOf('function bindWrite('),source.indexOf('function gameBack(')),c);
 vm.runInContext(source.slice(source.indexOf('function writingEstimate('),source.indexOf('function finishReal(')),c);
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
