const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=JSON.parse(fs.readFileSync('content/original-exams-v1.json','utf8'));
function boot(lang='ko'){const c={S:{lang},console};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('data/original-support-v1.js','utf8'),c);vm.runInContext(fs.readFileSync('listening-transcripts.js','utf8'),c);return c}
const question=source.items.find(q=>q.id==='O01-I-L-01');
test('listening script and answer cues never render before submission or during an active full mock',()=>{
 const c=boot(),api=c.HARUMAL_TRANSCRIPTS;assert.equal(api.markup(question),'');assert.equal(api.markup(question,{submitted:false}),'');assert.equal(api.markup(question,{submitted:true,examActive:true}),'');c.S.real={active:true};assert.equal(api.markup(question,{submitted:true}),'');
});
test('submitted transcript follows all four locales and highlights only reviewed exact quotes',()=>{
 for(const [lang,word]of [['ko','창문'],['ja','窓'],['en','window'],['zh','窗户']]){const c=boot(lang),html=c.HARUMAL_TRANSCRIPTS.markup(question,{submitted:true});assert.match(html,new RegExp('lang="'+lang+'"'));assert.match(html,new RegExp(word));assert.match(html,/<mark>/);assert.doesNotMatch(html,/data-transcript-pending|undefined|\[object Object\]/);assert.match(html,/<details class="listeningTranscript"><summary>/)}
});
test('stale or missing support uses an honest pending notice, never wrong-language translation or cues',()=>{
 const c=boot('en'),q={...question,script:question.script+' 변경'};const html=c.HARUMAL_TRANSCRIPTS.markup(q,{submitted:true});assert.match(html,/data-transcript-pending/);assert.doesNotMatch(html,/<mark>|lang="ja"/);assert.match(html,/Korean original/);assert.match(html,/변경/);
});
test('transcript and highlight markup escapes all authored text and merges overlapping quotes',()=>{
 const c=boot(),html=c.HARUMAL_TRANSCRIPTS.highlighted('<script>학교</script>',['학교','학교</script>']);assert.doesNotMatch(html,/<script>/);assert.equal((html.match(/<mark>/g)||[]).length,1);assert.match(html,/&lt;script&gt;/);
});
test('support builder rejects stale approvals and mismatched original-script binding',async()=>{
 const {buildSupport}=await import('../scripts/build-original-support.mjs');const read=f=>JSON.parse(fs.readFileSync('content/'+f,'utf8'));const packs={coaching:read('original-localization-support.json'),japanese:read('original-listening-support.json'),locales:read('original-listening-locale-support.json')};const valid=buildSupport(source,packs);assert.ok(valid.byId[question.id].transcripts.en);const changed=structuredClone(packs);changed.locales.items.find(q=>q.id===question.id&&q.locale==='en').script+=' changed';const next=buildSupport(source,changed);assert.equal(next.byId[question.id].transcripts.en,undefined);assert.ok(next.rejectedOrUnmatched>valid.rejectedOrUnmatched);
});
test('owners guard retry translation and full-exam dialogue until submission',()=>{
 const t1=fs.readFileSync('topik1.js','utf8'),lf=fs.readFileSync('learning-features.js','utf8');assert.match(t1,/Q\?\.mode!=='real'\|\|!Q.result/);assert.match(lf,/item.type==='listen'&&!locked\?'disabled'/);assert.match(lf,/type==='listen'&&!reviewAttempt.locked/);
});

test('a saved unfinished TOPIK I mock also blocks transcript access from review routes',()=>{const c=boot();c.localStorage={getItem:()=>JSON.stringify({mode:'real',ids:[question.id],result:null})};assert.equal(c.HARUMAL_TRANSCRIPTS.markup(question,{submitted:true}),'');c.localStorage.getItem=()=>JSON.stringify({mode:'real',result:{total:10}});assert.match(c.HARUMAL_TRANSCRIPTS.markup(question,{submitted:true}),/listeningTranscript/)});

test('same-script support cannot highlight a changed question or missing core binding',()=>{const c=boot('en');for(const q of [{...question,contentSha256:'0'.repeat(64)},{...question,qa:undefined}]){const html=c.HARUMAL_TRANSCRIPTS.markup(q,{submitted:true});assert.match(html,/data-transcript-pending/);assert.doesNotMatch(html,/<mark>/)}});
test('support approval is bound to the full question and answer, not only its shared dialogue',async()=>{const {buildSupport}=await import('../scripts/build-original-support.mjs');const read=f=>JSON.parse(fs.readFileSync('content/'+f,'utf8'));const packs={coaching:read('original-localization-support.json'),japanese:read('original-listening-support.json'),locales:read('original-listening-locale-support.json')};const changed=structuredClone(source);changed.items.find(q=>q.id===question.id).prompt+=' changed';const result=buildSupport(changed,packs);assert.equal(result.byId[question.id],undefined);assert.ok(result.rejectedOrUnmatched>=4)});
