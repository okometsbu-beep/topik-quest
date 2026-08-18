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
