const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=file=>fs.readFileSync(require('node:path').join(__dirname,'..',file),'utf8');
test('actual saved-card reveal keeps legacy Japanese-only meanings through repeated opening',async()=>{
 const entry={text:'학교',ja:'学校',show:false,dueAt:321,repetitions:7};
 const c={S:{lang:'ja',vocab:[entry],transCache:{}},revealVocab(){},save(){},render(){},toast(){},text:s=>s,fetch(){throw Error('Existing learner meaning must not request translation')}};c.window=c;vm.createContext(c);vm.runInContext(read('vocabulary-translation.js'),c);
 const src=read('learning-features.js'),from=src.indexOf("if(typeof revealVocab==='function'){"),to=src.indexOf('\nfunction renderLearningVocabPage',from);assert.ok(from>0&&to>from);vm.runInContext(src.slice(from,to),c);
 await c.revealVocab(0);assert.equal(entry.ja,'学校');assert.equal(entry.meanings.ja||entry.ja,'学校');await c.revealVocab(0);await c.revealVocab(0);assert.equal(entry.ja,'学校');assert.equal(entry.dueAt,321);assert.equal(entry.repetitions,7);
});
test('opening and saving a long selected phrase does not silently truncate its headword',()=>{
 const c={S:{lang:'ja',view:'vocab',vocab:[]},document:{head:{appendChild(){}},createElement:()=>({textContent:''}),getElementById:()=>null,querySelectorAll:()=>[]},render(){},addEventListener(){},console,Intl,Date,JSON};c.window=c;vm.createContext(c);vm.runInContext(read('vocab-editor.js'),c);
 const entry={text:'한국어 문장 전체를 선택한 긴 표현입니다. '.repeat(6),ja:'保存済みの訳',context:'주변 문맥',dueAt:99};assert.ok(entry.text.length>80&&entry.text.length<500);
 const api=c.MALBIT_VOCAB_EDITOR_INTERNALS,normalized=api.normalizeEntry(entry);assert.equal(normalized.text,entry.text.trim());const saved=api.savedEntry(entry,normalized,'ja',123);assert.equal(saved.text,entry.text.trim());assert.equal(saved.context,entry.context);assert.equal(saved.dueAt,99);
});
