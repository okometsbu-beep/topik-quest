const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const D=require('../data/growth-learning.js'),E=require('../growth-learning-engine.js'),I=require('../data/growth-learning-locales.js');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8'),clone=value=>JSON.parse(JSON.stringify(value));
const escaped=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const recipe=id=>D.recipes.find(r=>r.id===id),langs=['ko','ja','en','zh'];
function answer(q){if(q.kind==='text')return q.accepted[0];if(q.rows)return Object.fromEntries(q.rows.map(row=>[row.id,row.answer]));if(q.cards)return Object.fromEntries(q.cards.map(card=>[card.id,card.answer]));return clone(q.answer);}
let serial=0;
function prepared(id,phase='learn',stage='task',branch){const r=recipe(id);let s=E.createSession(r,`localization-${++serial}`,1),now=1;
 const step=(type,extra={})=>{s=E.transition(s,{type,...extra},r,++now).session;};
 const solve=p=>{if(r[p].kind==='listen')step('heard');step('draft',{value:answer(r[p])});step('submit');};
 step('begin');if(phase==='transfer'){solve('learn');step('continue');}
 const q=r[phase];step('help',{id:'hint'});for(const t of q.tokens||[])step('help',{id:t.id});
 if(q.kind==='listen')step('help',{id:'transcript'});
 if(branch)step('draft',{value:{first:branch}});
 if(stage==='wrong'){step('draft',{value:q.kind==='text'?'틀린 문장':q.rows?Object.fromEntries(q.rows.map(row=>[row.id,row.choices.find(c=>c.id!==row.answer).id])):q.cards?Object.fromEntries(q.cards.map(c=>[c.id,c.answer==='yes'?'no':'yes'])):q.kind==='evidence'?{claim:q.claims.find(c=>c.id!==q.answer.claim).id,evidence:q.evidence.find(e=>e.id!==q.answer.evidence).id}:q.kind==='dialogue'?{first:Object.keys(q.branches).find(key=>key!==q.answer.first),second:'recover'}:q.kind==='order'?[...q.answer].reverse():q.kind==='insert'?'0':q.choices.find(c=>c.id!==q.answer).id});step('submit');assert.equal(s.records[phase].feedback,'wrong',q.id);}
 if(stage==='complete')solve(phase);
 const state=E.empty();state.sessions[s.id]=s;state.currentId=s.id;state.section=r.section;state.visible=true;return state;
}
function harness({lang='ko',seed,storage=new Map(),ledger=new Map(),locales=true,localeOverride,failSave=false,tts}={}){
 if(seed!==undefined)storage.set('harumalGrowthLearningV1',typeof seed==='string'?seed:JSON.stringify(seed));
 const nodes=[],events={};const body={children:[],style:{overflow:''},appendChild(node){this.children.push(node);nodes.push(node);}};
 const document={body,readyState:'complete',activeElement:{focus(){}},createElement(){return{hidden:false,dataset:{},attrs:{},listeners:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(type,fn){this.listeners[type]=fn;},contains(){return true;},querySelector(){return null;},querySelectorAll(){return[];},innerHTML:''};}};
 const history={state:null,pushState(s){this.state=s;},replaceState(s){this.state=s;},back(){this.state=null;}};
 function grant(p,kind,xp,coins){const id=`${kind}:${p.sessionId}:${p.slot||p.stageId}`;if(ledger.has(id))return{duplicate:true,event:ledger.get(id),persisted:true};const event={id,kind,xp,coins,...p};ledger.set(id,event);return{awarded:true,event,persisted:true};}
 const c={console,Date,Math,document,history,location:{href:'https://example.test/'},S:{lang},crypto:{randomUUID:()=>`locale-tab-${++serial}`},localStorage:{getItem:key=>storage.get(key)||null,setItem(key,value){if(failSave)throw new Error('quota');storage.set(key,String(value));}},addEventListener(type,fn){(events[type]??=[]).push(fn);},HARUMAL_REWARDS:{newSession:()=>`locale-session-${++serial}`,answer:p=>grant(p,'answer',10,2),stage:p=>grant(p,'stage',p.phase==='learn'?20:30,p.phase==='learn'?4:6)},MALBIT_TTS:{cancel(){},play:tts||(()=>Promise.resolve({}))}};
 c.window=c;c.setLang=function(lang){c.S.lang=lang;return 'preserved-return';};vm.createContext(c);
 for(const file of ['data/growth-learning.js',...(locales?['data/growth-learning-locales.js']:[]),'growth-learning-engine.js'])vm.runInContext(read(file),c);
 if(localeOverride)c.HARUMAL_GROWTH_I18N=localeOverride;
 vm.runInContext(read('growth-learning.js'),c);
 return{c,nodes,storage,ledger,html:()=>nodes[0]?.innerHTML||'',state:()=>clone(c.HARUMAL_GROWTH.getState()),click(action,extra={}){const button={dataset:{growthAction:action,...extra},disabled:false};nodes[0].listeners.click({target:{closest:()=>button}});}};
}
function visible(h,id,field,lang){assert.ok(h.html().includes(escaped(I.get(id,field,lang))),`${id}.${field} in ${lang}`);}
function expectedFields(){const keys=[];
 for(const r of D.recipes){for(const field of ['title','goal','rule','transferScope'])if(r[field])keys.push(`${r.id}.${field}`);
  for(const p of ['learn','transfer']){const q=r[p];for(const field of ['prompt','hint','retry','explain'])keys.push(`${q.id}.${field}`);
   if(['pair','order','dialogue'].includes(q.kind))keys.push(`${q.id}.text`);
   for(const t of q.tokens||[])keys.push(`${q.id}.tokens.${t.id}`);
   for(const branch of Object.keys(q.branches||{}))keys.push(`${q.id}.branches.${branch}.prompt`);
   if(q.kind==='table')for(const row of q.rows)keys.push(`${q.id}.rows.${row.id}.text`);
   if(q.kind==='pair')for(const row of q.rows)keys.push(`${q.id}.rows.${row.id}.context`);
  }
 }
 for(const d of ['easy','medium','hard','very_hard'])keys.push(`meta.difficulty.${d}`);
 for(const label of ['meaning','words','expression'])keys.push(`meta.label.${label}`);
 for(const r of D.recipes)keys.push(`meta.types.${r.type}`);
 return keys;
}

test('all 22 tasks have explicit four-language instruction coverage, keyed by stable IDs',()=>{
 const expected=expectedFields();assert.equal(D.recipes.length,11);assert.equal(expected.length,162);assert.deepEqual(Object.keys(I.entries).sort(),expected.sort());assert.deepEqual(I.languages,langs);
 for(const key of expected)for(const lang of langs){assert.equal(typeof I.entries[key][lang],'string',`${key}:${lang}`);assert.ok(I.entries[key][lang].trim(),`${key}:${lang}`);if(lang!=='ko')assert.notEqual(I.entries[key][lang],I.entries[key].ko,`${key}:${lang} must be translated`);}
 assert.ok(Object.isFrozen(I)&&Object.isFrozen(I.entries));
});

test('canonical Korean learning material, options, IDs, accepted answers and grades stay unchanged',()=>{
 const retained=D.recipes.flatMap(r=>['learn','transfer'].map(p=>{const q=r[p];return{id:q.id,kind:q.kind,difficulty:q.difficulty,text:q.text,audio:q.audio,choices:q.choices,rows:q.rows,cards:q.cards,groups:q.groups,claims:q.claims,evidence:q.evidence,parts:q.parts,insert:q.insert,sentences:q.sentences,caption:q.caption,headers:q.headers,table:q.table,first:q.first,branches:q.branches,answer:q.answer,accepted:q.accepted};}));
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(retained)).digest('hex'),'89ed05c73423f8909d750b783897f9967eb7bd50d79ab569ea6d84849461a2b9');
 const before=JSON.stringify(D);for(const lang of langs)for(const r of D.recipes)for(const p of ['learn','transfer']){assert.equal(E.grade(r[p],answer(r[p])),true);const h=harness({lang,seed:prepared(r.id,p)});assert.equal(JSON.stringify(h.c.HARUMAL_GROWTH_DATA),before);}
 assert.equal(JSON.stringify(D),before);
});

test('every task renders prompts, rules, hints, retry feedback and explanations in each selected language',()=>{
 for(const lang of langs)for(const r of D.recipes)for(const phase of ['learn','transfer']){
  const q=r[phase],h=harness({lang,seed:prepared(r.id,phase)});assert.equal(h.nodes[0].attrs.lang,lang==='zh'?'zh-CN':lang);assert.equal(h.nodes[0].dataset.lang,lang);
  visible(h,r.id,'title',lang);visible(h,r.id,'rule',lang);for(const f of ['prompt','hint'])visible(h,q.id,f,lang);
  for(const t of q.tokens||[])visible(h,q.id,`tokens.${t.id}`,lang);
  if(['pair','order','dialogue'].includes(q.kind))visible(h,q.id,'text',lang);
  if(q.kind==='table')for(const row of q.rows)visible(h,q.id,`rows.${row.id}.text`,lang);
  if(q.kind==='pair')for(const row of q.rows){visible(h,q.id,`rows.${row.id}.context`,lang);assert.ok(h.html().includes(escaped(row.text.split('→')[1].trim())));}
  if(q.kind==='text'){for(const label of ['meaning','words','expression'])visible(h,'meta','label.'+label,lang);for(const line of q.text.split('\n'))assert.ok(h.html().includes(escaped(line.slice(line.indexOf(':')+1).trim())));}
  const wrong=harness({lang,seed:prepared(r.id,phase,'wrong')});visible(wrong,q.id,'retry',lang);
  const complete=harness({lang,seed:prepared(r.id,phase,'complete')});visible(complete,q.id,'explain',lang);if(phase==='transfer'&&r.transferScope)visible(complete,r.id,'transferScope',lang);
 }
});

test('dialogue instructions change language while replies and all response choices remain Korean',()=>{
 for(const lang of langs)for(const phase of ['learn','transfer']){const q=recipe('travel')[phase];for(const [id,branch] of Object.entries(q.branches)){const h=harness({lang,seed:prepared('travel',phase,'task',id)});visible(h,q.id,`branches.${id}.prompt`,lang);for(const text of [branch.reply,...q.first.map(c=>c.text),...branch.choices.map(c=>c.text)])assert.ok(h.html().includes(escaped(text)),`${q.id}:${lang}:${text}`);}}
});

test('lesson hub and orientation localize titles, goals, type names and difficulty',()=>{
 for(const lang of langs){const h=harness({lang});h.c.HARUMAL_GROWTH.open();for(const r of D.recipes){visible(h,r.id,'title',lang);visible(h,r.id,'goal',lang);visible(h,'meta','types.'+r.type,lang);visible(h,'meta','difficulty.'+r.learn.difficulty,lang);}for(const r of D.recipes){h.c.HARUMAL_GROWTH.open(r.id);visible(h,r.id,'title',lang);visible(h,r.id,'goal',lang);}}
});

test('meaning help distinguishes completion from application and scope limits remain explicit in all languages',()=>{
 for(const lang of langs){const h=harness({lang,seed:prepared('meaning')});visible(h,'GL-MEAN-L','tokens.isoo',lang);visible(h,'GL-MEAN-L','tokens.man',lang);const done=harness({lang,seed:prepared('meaning','transfer','complete')});visible(done,'meaning','transferScope',lang);}
 assert.match(I.get('GL-MEAN-L','tokens.isoo','en'),/completed.*course.*Merely applying/s);
 assert.match(I.get('meaning','transferScope','en'),/does not show.*이수자/);
 assert.match(I.get('GL-INFER-L','explain','en'),/does not prove.*actually rained/);
 assert.match(I.get('GL-WRITE-T','explain','en'),/does not assess semantic mastery/);
 assert.match(I.get('GL-TRAVEL-T','explain','en'),/does not assess actual pronunciation/);
});

test('switching language and reloading preserve attempts, assistance, reward events and progress',()=>{
 const h=harness({lang:'en'});h.c.HARUMAL_GROWTH.open('meaning');h.click('begin');h.click('help',{help:'isoo'});h.click('select',{value:'junho'});h.click('submit');h.click('retry');h.click('select',{value:'minji'});h.click('submit');assert.equal(h.ledger.size,2);
 const initial=h.state(),events=clone([...h.ledger.entries()]),stored=h.storage.get('harumalGrowthLearningV1');
 for(const lang of ['ja','zh','ko','en']){assert.equal(h.c.setLang(lang),'preserved-return');h.c.HARUMAL_GROWTH.refreshLanguage();assert.deepEqual(h.state(),initial);assert.deepEqual(clone([...h.ledger.entries()]),events);assert.equal(h.storage.get('harumalGrowthLearningV1'),stored);visible(h,'GL-MEAN-L','explain',lang);assert.equal(h.c.HARUMAL_GROWTH.getLessonText('GL-MEAN-L','tokens.isoo'),I.get('GL-MEAN-L','tokens.isoo',lang));}
 for(const lang of ['ja','zh','en']){const reloaded=harness({lang,storage:h.storage,ledger:h.ledger});assert.deepEqual(reloaded.state().sessions,initial.sessions);assert.deepEqual(clone([...h.ledger.entries()]),events);visible(reloaded,'GL-MEAN-L','explain',lang);}
 h.click('continue');h.click('select',{value:'sora'});h.click('submit');assert.equal(h.ledger.size,4);const finished=h.state().sessions,finishedEvents=clone([...h.ledger.entries()]);
 for(const lang of langs){h.c.setLang(lang);visible(h,'GL-MEAN-T','explain',lang);assert.deepEqual(h.state().sessions,finished);const reloaded=harness({lang,storage:h.storage,ledger:h.ledger});assert.deepEqual(reloaded.state().sessions,finished);assert.deepEqual(clone([...h.ledger.entries()]),finishedEvents);}
});

test('missing locale assets or fields never silently substitute Korean for non-Korean guidance',()=>{
 for(const lang of ['ja','en','zh']){assert.equal(I.get('missing','prompt',lang),I.missing[lang]);const h=harness({lang,seed:prepared('meaning'),locales:false});assert.ok(h.html().includes(escaped(I.missing[lang])));for(const text of [recipe('meaning').title,recipe('meaning').learn.prompt,recipe('meaning').learn.tokens[0].text])assert.ok(!h.html().includes(escaped(text)));assert.ok(h.html().includes('교육 이수자만 입장 가능'));}
 assert.equal(I.get('meaning','title','unsupported'),I.get('meaning','title','en'));
});

test('every translated rendering path escapes markup, including help, grammar contexts and branch prompts',()=>{
 const seen=new Set(),payload='<img src=x onerror="alert(1)"> & \'unsafe\'';const malicious={get(id,field){seen.add(`${id}.${field}`);return payload;}};
 const check=h=>{assert.ok(h.html().includes(escaped(payload)));assert.ok(!h.html().includes(payload));assert.ok(!h.html().includes('<img src=x'));};
 const hub=harness({lang:'en',localeOverride:malicious});hub.c.HARUMAL_GROWTH.open();check(hub);
 for(const r of D.recipes){hub.c.HARUMAL_GROWTH.open(r.id);check(hub);for(const phase of ['learn','transfer']){for(const stage of ['task','wrong','complete'])check(harness({lang:'en',seed:prepared(r.id,phase,stage),localeOverride:malicious}));for(const branch of Object.keys(r[phase].branches||{}))check(harness({lang:'en',seed:prepared(r.id,phase,'task',branch),localeOverride:malicious}));}}
 const required=expectedFields().filter(key=>key!=='meta.difficulty.very_hard');assert.deepEqual([...seen].sort(),required.sort());
});

test('locale data is ordered before UI, cached offline and has no translation-service dependency',()=>{
 const loader=read('site-patch.js');assert.ok(loader.indexOf("'data/growth-learning.js'")<loader.indexOf("'data/growth-learning-locales.js'"));assert.ok(loader.indexOf("'data/growth-learning-locales.js'")<loader.indexOf("'growth-learning.js'"));assert.ok(read('sw.js').includes("'./data/growth-learning-locales.js'"));assert.doesNotMatch(read('data/growth-learning-locales.js'),/fetch\(|XMLHttpRequest|https?:\/\//);
});


test('existing storage and audio warnings switch to the newly selected language',async()=>{
 const corrupt=harness({lang:'ko',seed:'{broken'});corrupt.c.HARUMAL_GROWTH.open('meaning');assert.match(corrupt.html(),/저장 기록을 읽을 수 없어/);corrupt.c.setLang('ja');assert.match(corrupt.html(),/保存記録を読み込めない/);assert.doesNotMatch(corrupt.html(),/저장 기록을 읽을 수 없어/);assert.match(corrupt.c.HARUMAL_GROWTH.status().storageWarning,/保存記録/);assert.equal(corrupt.storage.get('harumalGrowthLearningV1'),'{broken');
 const quota=harness({lang:'ko',failSave:true});quota.c.HARUMAL_GROWTH.open('meaning');assert.match(quota.html(),/기기에 저장하지 못했어요/);quota.c.setLang('en');assert.match(quota.html(),/Could not save on this device/);assert.doesNotMatch(quota.html(),/기기에 저장하지 못했어요/);
 const audio=harness({lang:'ko',tts:()=>Promise.resolve({unavailable:true})});audio.c.HARUMAL_GROWTH.open('listening');audio.click('begin');audio.click('listen');await new Promise(setImmediate);assert.match(audio.html(),/음성 재생이 어려워요/);const before=audio.state();audio.c.setLang('zh');assert.match(audio.html(),/无法播放语音/);assert.doesNotMatch(audio.html(),/음성 재생이 어려워요/);assert.deepEqual(audio.state(),before);
});
