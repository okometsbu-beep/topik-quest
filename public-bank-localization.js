/* Reviewed legacy translations: separate after-answer surface, Original by default. */
(function () {
  'use strict';
  const LOCALES = ['en', 'vi', 'uz', 'mn', 'zh-Hans', 'zh-Hant'];
  const LABELS = ['English', 'Tiếng Việt', 'Oʻzbekcha', 'Монгол', '简体中文', '繁體中文'];
  const MODULES = ['legacy-l1-s08-reading', 'legacy-l1-s09-reading', 'legacy-l1-s10-reading'];
  const SOURCE_FIELDS = ['level','section','itemType','instruction','prompt','passage','script','options','answerIndex','acceptedAnswer','model','targetSkills','dialogueContext','visual','visualRequirement'];
  const INDEX_SHA256 = /*PUBLIC_INDEX_SHA_BEGIN*/"67203a9a0c67e5e8e2f538d5abbd9dd1914760f9daaa6231dbab59604096d143"/*PUBLIC_INDEX_SHA_END*/;
  const active = new Map(), cache = new Map();
  let counter = 0;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const exact = (x, keys) => x && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).sort().join('|') === keys.slice().sort().join('|');
  const hex = x => typeof x === 'string' && /^[a-f0-9]{64}$/.test(x);
  const canonical = x => Array.isArray(x) ? x.map(canonical) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map(k => [k, canonical(x[k])])) : x;
  async function hash(text) { if (!window.crypto?.subtle) throw Error('Digest unavailable'); return Array.from(new Uint8Array(await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))), b => b.toString(16).padStart(2,'0')).join(''); }
  function context(q) {
    const value = Object.fromEntries(SOURCE_FIELDS.map(k => [k,q[k] ?? null]));
    value.rubric = q.rubric ? Object.fromEntries(Object.entries(q.rubric).filter(([k]) => !['ja',...LOCALES,'zh'].includes(k))) : null;
    value.coachKo = q.coach?.ko || null; return value;
  }
  function moduleFor(id) { const m = /^M(08|09|10)-I-R-(\d+)$/.exec(String(id)); return m && Number(m[2]) >= 31 && Number(m[2]) <= 70 ? `legacy-l1-s${m[1]}-reading` : null; }
  function blocked() { return !!(window.HARUMAL_TRANSCRIPTS?.activeMock?.()); }
  function originalFields(item) {
    const q = window.MALBIT_BANK.present(item, item.options.map((_,i) => i));
    const f = {instruction:item.instruction,passage:item.passage,prompt:item.prompt,'runtime.explanation':q.explanationI18n?.ko || ''};
    item.options.forEach((v,i) => { f[`option.${i}`] = v; f[`runtime.choice.${i}`] = q.choiceExplanationsI18n?.ko?.[i] || ''; });
    return f;
  }
  function markup(q, state) {
    const id = q?.bankId || q?.id, moduleId = moduleFor(id);
    if (q?.bankId != null && q?.id != null && String(q.bankId) !== String(q.id)) return '';
    if (state?.presentation !== 'standard-four') return '';
    if (!moduleId || typeof state?.isCurrent !== 'function' || state.isCurrent(state.attemptToken) !== true || state?.submitted !== true || state?.examActive !== false || blocked()) return '';
    const item = window.MALBIT_BANK?.byId?.(id), order = q.choiceOrder;
    if (!item || item.collectionId !== 'legacy-original-v1' || !Array.isArray(item.options) || item.options.length !== 4 || item.options.some(v => typeof v !== 'string') || new Set(item.options).size !== 4 || !Number.isInteger(item.answerIndex) || item.answerIndex < 0 || item.answerIndex > 3 || !Array.isArray(order) || order.length !== 4 || new Set(order).size !== 4 || order.some(i => !Number.isInteger(i) || i < 0 || i > 3) || !Array.isArray(q.choices) || q.choices.length !== 4 || q.choices.some((v,i) => typeof v !== 'string' || v !== item.options[order[i]]) || q.answerIndex !== order.indexOf(item.answerIndex)) return '';
    const token = `reviewed-${++counter}`;
    while(active.size>=128)active.delete(active.keys().next().value);
    active.set(token, {id,moduleId,order:[...order],attemptToken:state.attemptToken,valid:state.isCurrent});
    // Each panel starts Original. No global language/progress storage mutation.
    return `<details class="tqReviewedTranslation" data-reviewed-panel="${token}"><summary>검토된 번역 · Reviewed translation</summary><label>해설 언어 <select data-reviewed-locale aria-label="Reviewed explanation language"><option value="original">원문 · Original</option>${LOCALES.map((l,i) => `<option value="${l}">${LABELS[i]}</option>`).join('')}</select></label><p data-reviewed-status aria-live="polite">원문 · Original — 기존 설명은 그대로 유지됩니다.</p><div data-reviewed-content></div></details>`;
  }
  async function fetchBytes(url, max) {
    const response = await fetch(url, {credentials:'same-origin'}); if (!response.ok) throw Error('Unavailable');
    if (!response.body?.getReader) throw Error('Bounded reader unavailable');
    const reader=response.body.getReader(), chunks=[];let total=0;
    try { for (;;) { const {done,value}=await reader.read(); if(done)break;total+=value.byteLength;if(total>max)throw Error('Oversized');chunks.push(value); } }
    finally { await reader.cancel().catch(()=>{}); }
    const bytes=new Uint8Array(total);let offset=0;for(const value of chunks){bytes.set(value,offset);offset+=value.length;}return bytes;
  }
  async function shard(moduleId,locale) {
    const key=moduleId+'|'+locale;if(cache.has(key))return cache.get(key);
    const promise=(async()=>{
      const ib=await fetchBytes('data/bank-locales/v1/index.json',65536),it=new TextDecoder('utf-8',{fatal:true}).decode(ib);if(!hex(INDEX_SHA256)||await hash(it)!==INDEX_SHA256)throw Error('Index digest');const index=JSON.parse(it);
      if(!exact(index,['version','shards'])||index.version!==1||!Array.isArray(index.shards)||index.shards.length>18)throw Error('Index schema');
      const seen=new Set();for(const s of index.shards){
        if(!exact(s,['moduleId','locale','url','bytes','sha256'])||!MODULES.includes(s.moduleId)||!LOCALES.includes(s.locale)||!hex(s.sha256)||!Number.isSafeInteger(s.bytes)||s.bytes<1||s.bytes>2*1024*1024||s.url!==`data/bank-locales/v1/${s.moduleId}/${s.locale}.${s.sha256}.json`||seen.has(s.moduleId+'|'+s.locale))throw Error('Shard descriptor');seen.add(s.moduleId+'|'+s.locale);
      }
      const descriptor=index.shards.find(s=>s.moduleId===moduleId&&s.locale===locale);if(!descriptor)throw Error('Unavailable');
      const bytes=await fetchBytes(descriptor.url,descriptor.bytes),text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
      if(bytes.length!==descriptor.bytes||await hash(text)!==descriptor.sha256)throw Error('Shard digest');
      const value=JSON.parse(text);if(!exact(value,['version','moduleId','locale','items'])||value.version!==1||value.moduleId!==moduleId||value.locale!==locale||!Array.isArray(value.items)||value.items.length>40)throw Error('Shard schema');
      const ids=new Set();for(const row of value.items){
        if(!exact(row,['questionId','binding','fields'])||moduleFor(row.questionId)!==moduleId||ids.has(row.questionId)||!exact(row.binding,['sourceContextSHA256','canonicalOptions','answerIndex'])||!hex(row.binding.sourceContextSHA256)||!Array.isArray(row.binding.canonicalOptions)||row.binding.canonicalOptions.length!==4||row.binding.canonicalOptions.some(x=>typeof x!=='string')||!Number.isInteger(row.binding.answerIndex)||row.binding.answerIndex<0||row.binding.answerIndex>3||!Array.isArray(row.fields))throw Error('Question binding');ids.add(row.questionId);
        const fields=new Set();for(const f of row.fields){if(!exact(f,['field','sourceSHA256','text'])||!hex(f.sourceSHA256)||typeof f.text!=='string'||!f.text.trim()||f.text.length>100000||! /^(instruction|passage|prompt|option\.[0-3]|runtime\.explanation|runtime\.choice\.[0-3])$/.test(f.field)||fields.has(f.field)||f.field===`runtime.choice.${row.binding.answerIndex}`)throw Error('Field schema');fields.add(f.field);}
      }
      return value;
    })();cache.set(key,promise);promise.catch(()=>cache.delete(key));return promise;
  }
  function current(panel,entry,seq) { return panel.isConnected && panel.dataset.reviewedRequest===String(seq) && active.get(panel.dataset.reviewedPanel)===entry && !blocked() && (typeof entry.valid!=='function'||entry.valid(entry.attemptToken)===true); }
  function paragraph(parent,text){const p=document.createElement('p');p.textContent=text;parent.appendChild(p);}
  function section(parent,label,rows,fallback){const s=document.createElement('section'),h=document.createElement('h4');h.textContent=label+(fallback?' · 원문 / Original':'');s.appendChild(h);for(const row of rows)paragraph(s,row);parent.appendChild(s);}
  async function render(panel,locale) {
    const entry=active.get(panel.dataset.reviewedPanel);if(!entry)return;
    const seq=Number(panel.dataset.reviewedRequest||0)+1;panel.dataset.reviewedRequest=String(seq);
    const output=panel.querySelector('[data-reviewed-content]'),status=panel.querySelector('[data-reviewed-status]');output.replaceChildren();
    if(locale==='original'){status.textContent='원문 · Original — 기존 설명은 그대로 유지됩니다.';return;}
    if(!LOCALES.includes(locale)||!current(panel,entry,seq))return;
    status.textContent='검토된 번역을 확인하는 중…';
    try{
      const item=window.MALBIT_BANK.byId(entry.id),source=originalFields(item),value=await shard(entry.moduleId,locale),row=value.items.find(x=>x.questionId===entry.id);
      if(!row||JSON.stringify(row.binding.canonicalOptions)!==JSON.stringify(item.options)||row.binding.answerIndex!==item.answerIndex||await hash(JSON.stringify(canonical(context(item))))!==row.binding.sourceContextSHA256)throw Error('Stale source');
      const fields=new Map();for(const f of row.fields){if(await hash('ko\0'+String(source[f.field]??''))!==f.sourceSHA256)throw Error('Stale field');fields.set(f.field,f.text);}
      if(!current(panel,entry,seq))return;
      let fallback=0;
      const originalOrder=[0,1,2,3],group=['instruction','passage','prompt',...originalOrder.map(i=>'option.'+i)].filter(k=>String(source[k]||'').trim());
      const notices={en:'Reference panel: all option numbers in the translations below refer to the ORIGINAL order shown here, not the shuffled question above.',vi:'Bảng tham khảo: mọi số thứ tự đáp án trong bản dịch bên dưới đều theo thứ tự GỐC hiển thị ở đây, không phải thứ tự đã xáo trộn của câu hỏi phía trên.',uz:'Maʼlumot paneli: quyidagi tarjimalardagi barcha variant raqamlari yuqoridagi aralashtirilgan savolga emas, shu yerdagi ASL tartibga tegishli.',mn:'Лавлах хэсэг: доорх орчуулгын бүх сонголтын дугаар нь дээрх холилдсон асуултын дарааллыг бус, энд харуулсан ЭХ дарааллыг заана.','zh-Hans':'参考面板：下方译文中的所有选项编号均指此处显示的原始顺序，并非上方题目打乱后的顺序。','zh-Hant':'參考面板：下方譯文中的所有選項編號均指此處顯示的原始順序，並非上方題目打亂後的順序。'};
      paragraph(output,'원본 보기 순서 · ORIGINAL OPTION ORDER');paragraph(output,notices[locale]);
      const badge=i=>`Original ${i+1} → Question ${entry.order.indexOf(i)+1}`;
      const complete=group.every(k=>fields.has(k));if(!complete)fallback++;
      section(output,'문제 번역',group.map(k=>(k.startsWith('option.')?`${badge(Number(k.slice(7)))}: `:'')+(complete?fields.get(k):source[k])),!complete);
      const reason='runtime.explanation',explanationComplete=complete&&fields.has(reason)&&entry.order.filter(i=>i!==item.answerIndex).every(i=>fields.has('runtime.choice.'+i));section(output,'해설',[explanationComplete?fields.get(reason):source[reason]],!explanationComplete);if(!explanationComplete)fallback++;
      for(const i of originalOrder){if(i===item.answerIndex)continue;const k='runtime.choice.'+i;section(output,`${badge(i)}: ${item.options[i]}`,[explanationComplete?fields.get(k):source[k]],!explanationComplete);}
      status.textContent=fallback?'일부 항목은 원문입니다. · Some sections remain Original.':'선택한 항목의 검토된 번역 · Reviewed translations for these sections.';
    }catch(_){if(current(panel,entry,seq)){output.replaceChildren();status.textContent='번역을 사용할 수 없어 기존 원문 설명을 유지합니다. · Original fallback.';}}
  }
  if(typeof document!=='undefined'){
    document.addEventListener('change',event=>{const select=event.target.closest?.('[data-reviewed-locale]'),panel=select?.closest('[data-reviewed-panel]');if(!panel)return;const locale=select.value;if(locale!=='original'&&!LOCALES.includes(locale))return;render(panel,locale);});
    document.addEventListener('toggle',event=>{const panel=event.target;if(!panel.matches?.('[data-reviewed-panel]')||!panel.open)return;/* No automatic preference inference or pre-answer fetch. */},true);
  }
  window.HARUMAL_BANK_REVIEWED=Object.freeze({markup});
})();
