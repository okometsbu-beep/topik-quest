const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function boot(saved){
 const screen={innerHTML:'',className:'',querySelector:()=>null};let stored;
 const c={S:saved||{lang:'ja',view:'home',vocab:[{text:'학교',ja:'学校',dueAt:123,interval:3},{text:'사과',meanings:{ja:'りんご'}}]},document:{getElementById:()=>screen,createElement:()=>({})},render(){},renderShell(){},save(){stored=JSON.stringify(c.S)},setView(v){c.S.view=v;c.render()}};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(__dirname,'../vocab-test.js'),'utf8'),c);return{c,screen,saved:()=>JSON.parse(stored)};
}
test('word tests exclude missing/duplicate meanings without translating or exposing terms',()=>{
 const{c,screen}=boot();const api=c.HARUMAL_VOCAB_TEST;
 assert.equal(api.pool([{text:'학교',ja:'学校'},{text:'학교',ja:'学校'},{text:'나'},{text:'가',ja:'가'}],'ko').length,1);
 assert.equal(api.pool([{text:'학교',ja:'学校'}],'en').length,0);
 c.harumalVocabTestStart();assert.equal(c.S.view,'vocabTest');assert.equal(c.S.vocabExam.items.length,2);
 assert.ok(!screen.innerHTML.includes('>학교<')&&!screen.innerHTML.includes('>사과<'));
});
test('interrupted typed test persists, grades only on submit, and retries only missed words',()=>{
 const first=boot();first.c.harumalVocabTestStart();const words=JSON.stringify(first.c.S.vocab);
 first.c.harumalVocabTestDraft('draft');const{c,screen}=boot(first.saved());
 assert.equal(c.S.vocabExam.draft,'draft');c.harumalVocabTestDraft(c.S.vocabExam.items[0].term.normalize('NFD')+'  ');c.harumalVocabTestSubmit();
 assert.equal(c.S.vocabExam.answers[0].ok,true);assert.ok(!screen.innerHTML.includes('testResult'));
 c.harumalVocabTestDraft('틀린 답');c.harumalVocabTestSubmit();const missed=c.S.vocabExam.items[1].term;
 assert.ok(c.S.vocabExam.finishedAt);assert.match(screen.innerHTML,/1 \/ 2/);
 c.harumalVocabTestSubmit();assert.equal(c.S.vocabExam.answers.length,2);
 c.harumalVocabTestRetry();assert.equal(c.S.vocabExam.items.length,1);assert.equal(c.S.vocabExam.items[0].term,missed);
 assert.equal(JSON.stringify(c.S.vocab),words,'test never alters flashcard scheduling or terms');
});
test('exam safely escapes user-owned vocabulary in prompts and results',()=>{
 const{c,screen}=boot({lang:'en',view:'home',vocab:[{text:'<svg onload=alert(1)>',meanings:{en:'<img src=x onerror=alert(1)>'}}]});
 c.harumalVocabTestStart();assert.ok(!screen.innerHTML.includes('<img src=x'));assert.match(screen.innerHTML,/&lt;img/);
 c.harumalVocabTestDraft('"<script>');c.harumalVocabTestSubmit();assert.ok(!screen.innerHTML.includes('<script>'));assert.match(screen.innerHTML,/&lt;svg/);
});
test('native clipboard suppression does not cancel ordinary taps or app vocabulary holds',()=>{
 const listeners={},cleared=[];let callback,blurred=false;
 const c={document:{addEventListener:(type,fn)=>listeners[type]=fn},setTimeout:fn=>(callback=fn,1),clearTimeout:id=>cleared.push(id),getSelection:()=>({removeAllRanges(){}})};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(__dirname,'../app-touch.js'),'utf8'),c);
 for(const type of ['contextmenu','selectstart','copy','cut','paste']){let prevented=false;listeners[type]({preventDefault(){prevented=true}});assert.equal(prevented,true)}
 const field={blur(){blurred=true}};listeners.touchstart({target:{closest:()=>field},touches:[{clientX:1,clientY:1}]});listeners.touchend();assert.equal(blurred,false);assert.ok(cleared.includes(1));
 listeners.touchstart({target:{closest:()=>field},touches:[{clientX:1,clientY:1}]});callback();assert.equal(blurred,true);
 blurred=false;listeners.touchstart({target:{closest:()=>null},touches:[{clientX:1,clientY:1}]});assert.equal(blurred,false);
});
