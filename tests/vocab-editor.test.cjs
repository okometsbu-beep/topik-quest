const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'vocab-editor.js'), 'utf8');

function runtime(){
  const head={appendChild(){}};
  const context={console,S:{lang:'ja',view:'vocab',vocab:[]},document:{head,createElement(){return{textContent:''}},getElementById(){return null},querySelectorAll(){return[]}},confirm:()=>true,save(){},renderShell(){},navActive(){},setProgress(){},hideSelection(){},translateCached:async()=>'',toast(){},esc:value=>String(value),Intl,Date,JSON};
  context.window=context;context.render=function(){};context.addEventListener=function(){};vm.createContext(context);vm.runInContext(source,context);return context;
}

test('vocabulary detail editor is last in the ordered runtime and reachable from every saved card',()=>{
  const bootstrap=fs.readFileSync(path.join(root,'site-patch.js'),'utf8'),polish=fs.readFileSync(path.join(root,'product-polish.js'),'utf8'),features=fs.readFileSync(path.join(root,'learning-features.js'),'utf8');
  assert.ok(bootstrap.indexOf("'app-polish-v35.js'")<bootstrap.indexOf("'vocab-editor.js'"));
  assert.match(polish,/malbitOpenVocabEditor\(\$\{index\}\)/);
  assert.match(features,/malbitOpenVocabEditor\(\$\{i\}\)/);
  for(const handler of['malbitOpenVocabEditor','malbitSaveVocabEditor','malbitVocabAutoTranslate','malbitVocabAutoDraft','malbitVocabExampleAdd'])assert.match(source,new RegExp(`window\\.${handler}`));
});

test('legacy vocabulary entries gain editable fields without losing review data',()=>{
  const api=runtime().MALBIT_VOCAB_EDITOR_INTERNALS,legacy={text:'꾸준하다',ja:'こつこつ続ける',example:'매일 꾸준히 공부해요.',source:'TOPIK II',dueAt:12345,interval:3,repetitions:2};
  const normalized=api.normalizeEntry(legacy);assert.equal(normalized.meanings.ja,'こつこつ続ける');assert.equal(normalized.examples[0].ko,'매일 꾸준히 공부해요.');
  normalized.definitionKo='한결같이 계속하는 태도';normalized.etymologies.ja='固有語';normalized.note='매일 복습';const saved=api.savedEntry(legacy,normalized,'ja',999);
  assert.equal(saved.source,'TOPIK II');assert.equal(saved.dueAt,12345);assert.equal(saved.interval,3);assert.equal(saved.repetitions,2);assert.equal(saved.updatedAt,999);assert.equal(saved.example,'매일 꾸준히 공부해요.');assert.equal(saved.note,'매일 복습');
});

test('automatic enrichment fills empty fields but never overwrites manual corrections',()=>{
  const api=runtime().MALBIT_VOCAB_EDITOR_INTERNALS,entry=api.normalizeEntry({text:'약속',meanings:{ja:'自分で直した意味'},definitionKo:'직접 쓴 설명',examples:[{ko:'직접 쓴 예문',translations:{ja:'手書き例文'}}]});
  const result=api.mergeEnrichment(entry,{meaning:'約束',definitionKo:'만나기로 정한 일',partOfSpeech:'word',examples:[{ko:'친구와 약속이 있어요.',translation:'友達と約束があります。'}],etymology:'漢字語'},'ja',false);
  assert.equal(result.meanings.ja,'自分で直した意味');assert.equal(result.definitionKo,'직접 쓴 설명');assert.equal(result.examples[0].ko,'직접 쓴 예문');assert.equal(result.examples[1].ko,'친구와 약속이 있어요.');assert.equal(result.etymologies.ja,'漢字語');
});

test('static client exposes an AI adapter boundary without provider keys or direct model endpoints',()=>{
  assert.match(source,/MALBIT_AI_ADAPTER/);assert.match(source,/enrichVocabulary/);assert.match(source,/translateVocabulary/);
  assert.doesNotMatch(source,/api\.openai\.com|generativelanguage\.googleapis\.com|sk-[A-Za-z0-9]/);
});

function interactiveRuntime(entry){
 const c=runtime(),fields={vocabEditTerm:{value:entry.text},vocabEditType:{value:'word'},vocabEditDefinitionKo:{value:''},vocabEditNote:{value:entry.note||''},vocabEditMeaning:{value:entry.meanings?.ja||''},vocabEditEtymology:{value:''}},example={value:entry.examples?.[0]?.ko||entry.example||''};
 c.document.getElementById=id=>fields[id]||null;c.document.querySelectorAll=()=>[{querySelector:selector=>selector==='[data-example-ko]'?example:{value:''}}];c.S.vocab=[entry];c.malbitOpenVocabEditor(0);return{c,fields,example};
}
test('edited example overrides translation context without destroying source or saved manual meaning',async()=>{
 const original={text:'배',context:'배를 먹어요.',example:'배를 먹어요.',meanings:{ja:'私の意味',en:'my meaning'},meaningSources:{ja:'user'},note:'keep',dueAt:123,repetitions:7};const {c,example}=interactiveRuntime(original);let request,options;
 c.MALBIT_VOCAB_TRANSLATION={resolve:async(e,t,o)=>{request=e;options=o;return{value:'船',source:'machine'}},valid:()=>true};example.value='배를 타요.';await c.malbitVocabAutoTranslate({forceRefresh:true});
 assert.equal(request.context,original.context);assert.equal(request.example,'배를 타요.');assert.equal(request.translationContext,'배를 타요.');assert.equal(options.forceRefresh,true);assert.equal(c.S.vocab[0].meanings.ja,'私の意味');assert.equal(c.S.vocab[0].dueAt,123);
 c.malbitCloseVocabEditor();assert.equal(c.S.vocab[0],original);assert.equal(original.meanings.en,'my meaning');
});
test('late editor responses cannot replace meaning after example, type, language or screen changes',async()=>{
 for(const change of [x=>x.example.value='배를 타요.',x=>x.fields.vocabEditType.value='grammar',x=>x.c.malbitVocabEditorTarget('en'),x=>x.c.malbitCloseVocabEditor()]){
 const x=interactiveRuntime({text:'배',example:'배를 먹어요.',meanings:{ja:'手入力'}});let finish;x.c.MALBIT_VOCAB_TRANSLATION={resolve:()=>new Promise(r=>finish=r),valid:()=>true};const pending=x.c.malbitVocabAutoTranslate();change(x);finish({value:'古い翻訳',source:'machine'});await pending;
 if(x.c.S.view==='vocabEditor'){x.c.malbitSaveVocabEditor();assert.notEqual(x.c.S.vocab[0].meanings.ja,'古い翻訳')}else assert.equal(x.c.S.vocab[0].meanings.ja,'手入力');
 }
});
test('Recheck meaning explicitly requests fresh cache evaluation',async()=>{
 const x=interactiveRuntime({text:'배',example:'배를 먹어요.',meanings:{ja:'手入力'}});let options;x.c.MALBIT_VOCAB_TRANSLATION={resolve:async(e,t,o)=>{options=o;return{value:'梨',source:'authored'}},valid:()=>true};await x.c.malbitVocabRecheck(0);assert.equal(options.forceRefresh,true);assert.equal(x.c.S.vocab[0].meanings.ja,'手入力');
});
test('edited context survives explicit save and reopen while source context stays intact',async()=>{
 const x=interactiveRuntime({text:'배',context:'배를 먹어요.',example:'배를 먹어요.',meanings:{ja:'手入力'},dueAt:123});x.example.value='배를 타요.';x.c.malbitSaveVocabEditor();assert.equal(x.c.S.vocab[0].translationContext,'배를 타요.');assert.equal(x.c.S.vocab[0].context,'배를 먹어요.');assert.equal(x.c.S.vocab[0].dueAt,123);
 x.c.malbitOpenVocabEditor(0);let request;x.c.MALBIT_VOCAB_TRANSLATION={resolve:async e=>{request=e;return{value:'船',source:'machine'}},valid:()=>true};await x.c.malbitVocabAutoTranslate();assert.equal(request.translationContext,'배를 타요.');
});
test('removing or reordering primary example updates explicit context including empty',async()=>{
 for(const remove of [false,true]){
 const x=interactiveRuntime({text:'배',context:'원래 문맥',examples:[{ko:'배를 먹어요.',translations:{}},{ko:'배를 타요.',translations:{}}],meanings:{ja:'手入力'}});
 let rows=['배를 먹어요.','배를 타요.'];x.c.document.querySelectorAll=()=>rows.map(ko=>({querySelector:s=>({value:s==='[data-example-ko]'?ko:''})}));
 if(remove){x.c.malbitVocabExampleRemove(1);rows=['배를 먹어요.'];x.c.malbitVocabExampleRemove(0);rows=[]}else{x.c.malbitVocabExampleMove(1,-1);rows.reverse()}
 let request;x.c.MALBIT_VOCAB_TRANSLATION={resolve:async e=>{request=e;return{value:'船',source:'machine'}},valid:()=>true};await x.c.malbitVocabAutoTranslate();assert.equal(request.translationContext,remove?'':'배를 타요.');assert.equal(request.context,'원래 문맥');
 }
});
