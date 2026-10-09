// Vocabulary meanings are authored-first; machine output is an editable draft.
(function(){
'use strict';
const norm=value=>String(value??'').normalize('NFC').trim().replace(/\s+/g,' ');
// Preserve source context; an explicit editor override (including empty) wins.
const contextOf=entry=>String(Object.prototype.hasOwnProperty.call(entry,'translationContext')?(entry.translationContext??''):(entry.context||entry.examples?.[0]?.ko||entry.example||''));
const CACHE_VERSION='v2-gemma-4-26b-a4b-it-prompt1';
const fingerprint=(entry,target)=>JSON.stringify([entry.text,entry.context,entry.translationContext,entry.example,entry.examples?.map(example=>example.ko),entry.type,entry.partOfSpeech,entry.updatedAt,entry.manual,entry.meaningSources?.[target]]);
const errorText=/MYMEMORY WARNING|QUERY LENGTH LIMIT|YOU USED ALL AVAILABLE|INVALID LANGUAGE PAIR|PLEASE SELECT TWO DISTINCT LANGUAGES|TOO MANY REQUESTS|DAILY LIMIT|QUOTA EXCEEDED/i;
function valid(value,source,target){return !(target==='en'&&!/[A-Za-z]/.test(value))&& !(target==='ja'&&!/[ぁ-ゖァ-ヺ一-龯]/.test(value))&&!(target==='zh'&&!/[一-龯]/.test(value))&&typeof value==='string'&&!!norm(value)&&norm(value)!==norm(source)&&!errorText.test(value)&&!/<(?:html|body|script)\b/i.test(value)}
function authored(entry,target){
 const rows=[1,2].flatMap(level=>window.MALBIT_SHORTS_DECKS?.[level]||[]).filter(row=>norm(row.term)===norm(entry.text)&&row.meaning?.[target]);
 const context=norm(contextOf(entry));
 const exact=context&&rows.find(row=>norm(row.example)===context);if(exact)return exact;if(context)return null;
 const meanings=new Set(rows.map(row=>norm(row.meaning[target])));
 // Homographs with distinct senses require the matching example, not the first row.
 return meanings.size===1?rows[0]:null;
}
// Public connection values only. Keep inference disabled until live consent,
// Turnstile and language-quality checks are complete; the Worker has its own gate.
window.MALBIT_TRANSLATION_CONFIG=window.MALBIT_TRANSLATION_CONFIG||{
 enabled:false,
 endpoint:'https://harumal-vocabulary.okometsbu.workers.dev/v1/vocabulary',
 turnstileSitekey:'0x4AAAAAAFR8zumesIyXF9zt'
};
const localized=(ko,ja,en,zh)=>[ko,ja,en,zh][({ko:0,ja:1,en:2,zh:3})[S.lang]??0];
function publicEntry(entry){
 const term=String(entry.text||''),context=contextOf(entry);if(!term)return false;
 const roots=[window.MALBIT_BANK?.items,window.MALBIT_SHORTS_DECKS,window.MALBIT_VOCAB_GRAMMAR?.records,window.TOPIK1_LISTENING_DATA,window.TOPIK1_READING_DATA,window.MALBIT_BEGINNER_GRAMMAR_V1,window.HARUMAL_GROWTH_DATA];
 const seen=new Set();let budget=50000;
 function contains(value){if(--budget<0)return false;if(typeof value==='string')return value.includes(term)&&(!context||value.includes(context));if(!value||typeof value!=='object'||seen.has(value))return false;seen.add(value);return Object.values(value).some(contains);}
 return roots.some(contains);
}
let turnstileLoad;
function loadTurnstile(){
 if(window.turnstile)return Promise.resolve(window.turnstile);
 if(turnstileLoad)return turnstileLoad;
 turnstileLoad=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;const timer=setTimeout(()=>{script.remove();reject(Error('Verification load timed out'))},10000);script.onload=()=>{clearTimeout(timer);window.turnstile?resolve(window.turnstile):reject(Error('Verification unavailable'))};script.onerror=()=>{clearTimeout(timer);script.remove();reject(Error('Verification unavailable'))};document.head.appendChild(script)}).catch(error=>{turnstileLoad=null;throw error});return turnstileLoad;
}
function translationApproval(action,input,isPublic){
 const cfg=window.MALBIT_TRANSLATION_CONFIG;if(!cfg.turnstileSitekey)return Promise.reject(Error('Verification not configured'));
 return new Promise((resolve,reject)=>{
  const previous=document.activeElement,dialog=document.createElement('dialog'),title=document.createElement('h2'),notice=document.createElement('p'),preview=document.createElement('pre'),status=document.createElement('p'),widget=document.createElement('div'),confirm=document.createElement('button'),cancel=document.createElement('button');
  dialog.style.cssText='max-width:440px;width:calc(100% - 32px);max-height:85dvh;overflow:auto;border:0;border-radius:20px;padding:20px;background:var(--card,#fff);color:var(--text,#172333);box-shadow:0 16px 60px #0006';
  title.textContent=localized('번역할 내용 확인','翻訳内容の確認','Review translation input','确认翻译内容');title.id='vocabCloudTitle';dialog.setAttribute('aria-labelledby',title.id);
  notice.textContent=localized('아래 선택 표현과 원문 문장만 Cloudflare AI로 보냅니다. 개인정보가 있으면 취소해 주세요. 결과는 확인이 필요한 번역 제안입니다.','選択表現と原文の一文だけをCloudflare AIに送ります。個人情報があればキャンセルしてください。結果は要確認の翻訳案です。','Only the selected expression and source sentence below go to Cloudflare AI. Cancel if they contain personal information. The result is a draft to review.','仅将以下选中表达与原文句子发送给Cloudflare AI。如含个人信息请取消。结果为待核对的翻译建议。');
  preview.textContent=input.term+(input.context?'\n\n'+input.context:'');preview.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;padding:12px;background:#8881;border-radius:12px';
  status.textContent=isPublic?'':localized('공개 학습 원문과 일치하는지 확인하지 못했어요. 보낼 내용을 직접 확인해 주세요.','公開学習文との一致を確認できません。送信内容を確認してください。','This text could not be matched to the public lessons. Please check it before sending.','未能与公开学习原文匹配，请先核对发送内容。');
  confirm.textContent=localized('이 내용으로 번역','この内容で翻訳','Translate this text','翻译这些内容');cancel.textContent=localized('취소','キャンセル','Cancel','取消');for(const button of [confirm,cancel])button.style.cssText='min-height:44px;padding:10px 16px;margin:8px 6px 0 0;border-radius:12px';
  let settled=false,widgetId,timeout;
  function finish(error,token){if(settled)return;settled=true;clearTimeout(timeout);if(widgetId!==undefined)try{window.turnstile?.remove(widgetId)}catch(_){}dialog.close();dialog.remove();previous?.focus?.();error?reject(error):resolve(token);}
  cancel.onclick=()=>finish(Error('Translation cancelled'));dialog.addEventListener('cancel',event=>{event.preventDefault();finish(Error('Translation cancelled'))});dialog.addEventListener('close',()=>{if(!settled)finish(Error('Translation cancelled'))});
  confirm.onclick=async()=>{confirm.disabled=true;status.textContent=localized('보안 확인 중…','確認中…','Verifying…','正在验证…');try{const api=await loadTurnstile();if(settled)return;timeout=setTimeout(()=>finish(Error('Verification timed out')),90000);widgetId=api.render(widget,{sitekey:cfg.turnstileSitekey,action,callback:token=>finish(null,token),'error-callback':()=>finish(Error('Verification failed')),'expired-callback':()=>finish(Error('Verification expired'))});}catch(error){finish(error)}};
  dialog.append(title,notice,preview,status,widget,confirm,cancel);document.body.appendChild(dialog);dialog.showModal();cancel.focus();
 });
}

// No endpoint is guessed. Deployment code must supply the verified URL, public-text
// site key before any cloud request is possible. Default UI requires review/approval.
async function cloud(entry,target,options={}){
 const cfg=window.MALBIT_TRANSLATION_CONFIG;
 if(!cfg?.enabled||!cfg.endpoint)throw new Error('Translation not configured; review needed');
 const endpoint=new URL(cfg.endpoint);if(endpoint.protocol!=='https:'||endpoint.username||endpoint.password||endpoint.search||endpoint.hash||endpoint.pathname!=='/v1/vocabulary')throw new Error('Invalid translation endpoint');
 const source=String(entry.text??''),context=contextOf(entry);
 if(!source.trim()||source.length>500||context.length>700||!['ja','en','zh'].includes(target)||/[<>\u0000-\u0008]|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|https?:\/\/|(?:\+?82[- ]?)?01[016789][- ]?\d{3,4}[- ]?\d{4}/i.test(source+' '+context))throw new Error('Invalid translation input');
 const kind=entry.type==='grammar'||entry.partOfSpeech==='grammar'?'grammar':/\s/.test(source)?'expression':'word';
 const isPublic=(cfg.verifyPublicEntry||publicEntry)(entry)===true;
 const input={version:1,term:source,context,target,kind,publicLearningText:isPublic,learningTextApproved:true};
 const key='vocab_cloud_'+CACHE_VERSION+'_'+JSON.stringify([source,context,target,kind]);S.transCache=S.transCache||{};
 const usable=result=>result&&result.term===source&&result.target===target&&result.kind===kind&&result.uncertain===false&&valid(result.meaning,source,target)&&valid(result.explanation,source,target)&&Array.isArray(result.senses)&&result.senses.length<=3&&result.senses.every(x=>valid(x,source,target))&&result.example&&/[가-힣]/.test(result.example.ko||'')&&valid(result.example.translation,result.example.ko,target);
 if(!options.forceRefresh&&usable(S.transCache[key]))return S.transCache[key];
 const token=await (cfg.getTurnstileToken||translationApproval)('vocabulary',input,isPublic);if(!token)throw new Error('Verification required');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{
  const response=await fetch(endpoint.href,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal,body:JSON.stringify({...input,turnstileToken:token})});
  if(!response.ok)throw new Error('Translation unavailable; review needed');
  const data=await response.json();if(data?.version!==1||data?.provider!=='cloudflare'||data?.reviewRequired!==true||!usable(data.result))throw new Error('Unusable translation; review needed');
  S.transCache[key]=data.result;save();return data.result;
 }finally{clearTimeout(timer);}
}
async function machine(source,target,src='ko'){
 if(src===target)return source;
 if(src!=='ko')throw new Error('Only Korean learning text is supported');
 return (await cloud({text:source,type:'expression'},target)).meaning;
}
async function resolve(entry,target,options={}){
 if(!['ja','en','zh'].includes(target))throw Error('Unsupported target language');
 const grammar=window.MALBIT_VOCAB_GRAMMAR?.lookup(entry.text);if(grammar)return{value:grammar.meaning[target],source:'grammar',row:grammar};
 const row=authored(entry,target);if(row)return{value:row.meaning[target],source:'authored',row};
 const details=await cloud(entry,target,options);return{value:details.meaning,source:'machine',details};
}
function label(entry,target,lang){
 const source=entry.meaningSources?.[target];
 const words=source==='grammar'?['문법 설명 · 문맥과 함께 확인','文法説明・文脈も確認','Grammar explanation · check context','语法说明 · 请结合上下文']:source==='authored'?['학습 예문의 뜻','学習例文での意味','Meaning in the study example','学习例句中的释义']:source==='machine'?['번역 제안 · 확인 필요','翻訳案・要確認','Translation suggestion · check first','翻译建议 · 请核对']:source==='user'?['직접 입력한 뜻','自分で入力した意味','Your meaning','自行输入的释义']:['저장된 뜻 · 출처 미확인','保存済み・出典未確認','Saved meaning · source unknown','已存释义 · 来源未确认'];
 return words[({ko:0,ja:1,en:2,zh:3})[lang]??0];
}
function knownFailedAuto(entry,target,value){
 if(entry.updatedAt||entry.manual||entry.meaningSources?.[target]==='user')return false;
 return (!valid(value,entry.text,target))&&Object.entries(S.transCache||{}).some(([key,cached])=>new RegExp('^ko_'+target+'_vocab_(?:v[0-9]+_)?'+target+'_').test(key)&&key.replace(new RegExp('^ko_'+target+'_vocab_(?:v[0-9]+_)?'+target+'_'),'')===entry.text&&cached===value);
}
async function reveal(entry,target){
 entry.meanings=entry.meanings||{};
 const existing=entry.meanings[target]||(target==='ja'?entry.ja:'');
 if(existing&&!knownFailedAuto(entry,target,existing)){if(!entry.meanings[target])entry.meanings[target]=existing;return existing;}
 // Preserve only positively identified failed auto-output before retrying.
 if(existing){entry.translationRecovery=entry.translationRecovery||{};entry.translationRecovery[target]=existing;}
 const before=entry.meanings[target],beforeFingerprint=fingerprint(entry,target);const result=await resolve(entry,target);if(entry.meanings[target]!==before||fingerprint(entry,target)!==beforeFingerprint)return entry.meanings[target];entry.meanings[target]=result.value;if(result.row?.example&&!entry.example)entry.example=result.row.example;
 if(result.details)entry.translationDetails={...(entry.translationDetails||{}),[target]:result.details};
 entry.meaningSources={...(entry.meaningSources||{}),[target]:result.source};
 if(target==='ja')entry.ja=result.value;return result.value;
}
window.MALBIT_VOCAB_TRANSLATION={authored,valid,contextOf,fingerprint,cacheVersion:CACHE_VERSION,publicEntry,cloud,machine,resolve,reveal,label,knownFailedAuto};
})();
