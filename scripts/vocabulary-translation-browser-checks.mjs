import assert from 'node:assert/strict';

// Browser UI contract only: synthetic storage, fake Turnstile, fake fetch.
// This is never evidence of actual Turnstile verification or model accuracy.
export async function verifyVocabularyTranslation({evaluate,tap,shot,setViewport,send,ready,sleep}){
 assert.equal(await evaluate(`['localhost','127.0.0.1','[::1]'].includes(location.hostname)`),true);
 const before=await evaluate(`({storage:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])),state:JSON.stringify(S),theme:document.documentElement.dataset.theme})`);
 const wait=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await sleep(30)}throw Error('Translation browser QA timed out: '+expression)};
 const fill=async(selector,text)=>{await tap(selector);await evaluate(`document.querySelector(${JSON.stringify(selector)}).select()`);await send('Input.insertText',{text})};
 const status=()=>evaluate(`({posts:__translationQA.posts.length,widgets:__translationQA.widgets,dialogs:document.querySelectorAll('dialog[open]').length,meaning:document.querySelector('#vocabEditMeaning')?.value,notice:document.querySelector('.malbitVocabAiPanel aside')?.textContent,saved:S.vocab[0]})`);
 const consent=async()=>{
  await wait(`!!document.querySelector('dialog[open]')`);
  const before=await status();await tap('dialog[open] button',0);
  assert.equal((await status()).posts,before.posts,'approve starts verification, not inference');
  assert.equal((await status()).widgets,before.widgets+1);
  await evaluate(`__translationQA.proof.callback('mock-token-not-real')`);
  await wait(`__translationQA.posts.length===${before.posts+1}`);
 };
 const finish=async meaning=>{await evaluate(`__translationQA.finish(${JSON.stringify(meaning)})`);await wait(`!document.querySelector('.malbitVocabAiPanel button:disabled')`)};
 let failed;
 try{
  await setViewport(390,844);
  await evaluate(`(()=>{
   window.__translationQA={fetch:window.fetch,turnstile:window.turnstile,config:window.MALBIT_TRANSLATION_CONFIG,adapter:window.MALBIT_AI_ADAPTER,posts:[],widgets:0,proof:null,pending:null};
   window.MALBIT_AI_ADAPTER=undefined;
   window.turnstile={render(node,options){__translationQA.widgets++;__translationQA.proof=options;node.textContent='MOCK verification (no external service)';return 1},remove(){}};
   window.fetch=(url,options)=>{if(String(url)!=='https://translation-ui-test.invalid/v1/vocabulary')throw Error('Unexpected fetch in isolated translation QA');const body=JSON.parse(options.body);__translationQA.posts.push(body);return new Promise(resolve=>__translationQA.pending=resolve)};
   __translationQA.finish=meaning=>{const input=__translationQA.posts.at(-1);__translationQA.pending({ok:true,json:async()=>({version:1,provider:'cloudflare',reviewRequired:true,result:{term:input.term,target:input.target,kind:input.kind,meaning,explanation:'文脈を確認するための模擬応答です。',senses:[],example:{ko:'배를 타고 섬으로 갔어요.',translation:'船で島へ行きました。'},uncertain:false}})})};
   window.MALBIT_TRANSLATION_CONFIG={enabled:true,endpoint:'https://translation-ui-test.invalid/v1/vocabulary',turnstileSitekey:'mock-ui-only'};
   S.transCache={};S.vocab=[{text:'배',context:'합성 원문: 잘 익은 배를 깎았어요.',example:'합성 원문: 잘 익은 배를 깎았어요.',meanings:{ja:'直接入力した意味',en:'Keep my English'},meaningSources:{ja:'user'},note:'Synthetic QA note',dueAt:123,repetitions:7}];setLang('ja');setView('vocab');
  })()`);
  const original=await evaluate('JSON.stringify(S.vocab[0])');
  // Cancel before approval: no script, widget, post, or saved-entry mutation.
  await tap('.malbitVocabRecheck');await wait(`!!document.querySelector('dialog[open]')`);
  assert.deepEqual(await evaluate(`({posts:__translationQA.posts.length,widgets:__translationQA.widgets,scripts:document.querySelectorAll('script[src*="challenges.cloudflare.com"]').length})`),{posts:0,widgets:0,scripts:0});
  assert.match(await evaluate(`document.querySelector('dialog pre').textContent`),/합성 원문/);
  await shot('translation-mock-consent-390.png');await tap('dialog[open] button',1);
  await wait(`!document.querySelector('dialog[open]')`);assert.equal(await evaluate('JSON.stringify(S.vocab[0])'),original);
  assert.equal((await status()).meaning,'直接入力した意味');
  // Cancel during verification; even a late proof callback cannot send.
  await tap('.malbitVocabAiPanel button',0);await wait(`!!document.querySelector('dialog[open]')`);await tap('dialog[open] button',0);await tap('dialog[open] button',1);
  await evaluate(`__translationQA.proof.callback('late-mock-token')`);await sleep(30);assert.equal((await status()).posts,0);
  // Start a request and edit context before its controlled response completes.
  await tap('.malbitVocabAiPanel button',0);await consent();
  await fill('[data-example-ko]','합성 수정 문장: 배를 타고 섬으로 갔어요.');
  await finish('以前の文脈の翻訳');assert.equal((await status()).meaning,'直接入力した意味');assert.match((await status()).notice,/入力が変更/);
  assert.equal(await evaluate('JSON.stringify(S.vocab[0])'),original);
  // A new request previews and sends the edited sentence, then stays a draft.
  await tap('.malbitVocabAiPanel button',0);await wait(`!!document.querySelector('dialog[open]')`);
  assert.match(await evaluate(`document.querySelector('dialog pre').textContent`),/합성 수정 문장/);await consent();
  assert.equal(await evaluate(`__translationQA.posts.at(-1).context`),'합성 수정 문장: 배를 타고 섬으로 갔어요.');
  await finish('船');assert.equal((await status()).meaning,'船');assert.equal(await evaluate('JSON.stringify(S.vocab[0])'),original);
  await shot('translation-mock-reviewed-draft-390.png');await tap('.malbitVocabEditorTop .save');
  const saved=await evaluate('S.vocab[0]');assert.equal(saved.meanings.ja,'船');assert.equal(saved.meanings.en,'Keep my English');assert.equal(saved.context,'합성 원문: 잘 익은 배를 깎았어요.');assert.equal(saved.translationContext,'합성 수정 문장: 배를 타고 섬으로 갔어요.');assert.equal(saved.dueAt,123);assert.equal(saved.repetitions,7);assert.equal(saved.note,'Synthetic QA note');
  await tap('.malbitVocabDetailLink:not(.malbitVocabRecheck)');assert.equal((await status()).meaning,'船');assert.equal(await evaluate(`document.querySelector('[data-example-ko]').value`),saved.translationContext);
  await tap('.malbitVocabEditorTop>button',0);
  // Saved recheck bypasses the current cache, but cancel still preserves it.
  const posts=(await status()).posts,cache=await evaluate('JSON.stringify(S.transCache)');
  await tap('.malbitVocabRecheck');await wait(`!!document.querySelector('dialog[open]')`);await tap('dialog[open] button',1);await wait(`!document.querySelector('dialog[open]')`);
  assert.equal((await status()).posts,posts);assert.equal(await evaluate('JSON.stringify(S.transCache)'),cache);assert.equal((await status()).saved.meanings.ja,'船');
  await setViewport(320,844);await shot('translation-mock-reopened-320.png');
  console.log('Translation MOCK browser QA passed: consent, cancel before/during proof, edited context, late-response rejection, draft preservation, save/reopen, forced cache recheck. Actual model/Turnstile calls: 0.');
 }catch(error){failed=error;throw error}finally{
  try{await evaluate(`(()=>{const qa=window.__translationQA;if(qa){window.fetch=qa.fetch;window.turnstile=qa.turnstile;window.MALBIT_TRANSLATION_CONFIG=qa.config;window.MALBIT_AI_ADAPTER=qa.adapter;delete window.__translationQA}document.querySelectorAll('dialog').forEach(d=>{d.close();d.remove()});const saved=${JSON.stringify(before.storage)};for(const k of Object.keys(localStorage))if(!Object.hasOwn(saved,k))localStorage.removeItem(k);for(const[k,v]of Object.entries(saved))localStorage.setItem(k,v);S=JSON.parse(${JSON.stringify(before.state)});document.documentElement.dataset.theme=${JSON.stringify(before.theme)}})()`);await send('Page.reload',{ignoreCache:true});await ready()}catch(error){if(!failed)throw error}
 }
}
