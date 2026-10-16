import fs from 'node:fs';
import crypto from 'node:crypto';
import {reviewHash} from './build-original-exams.mjs';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
export const supportHash=q=>hash(JSON.stringify(canonical(Object.fromEntries(Object.entries(q).filter(([k])=>k!=='qa')))));
const valid=q=>q.qa?.status==='approved'&&q.qa.contentSha256===supportHash(q)&&Object.values(q.qa.checks||{}).length>0&&Object.values(q.qa.checks).every(x=>x===true||String(x).startsWith('not_applicable'));
const ensure=(ok,msg)=>{if(!ok)throw Error(msg)};
export function buildSupport(core,packs){
 const items=new Map(core.items.map(q=>[q.id,q])),byId={};let rejected=0;
 const entry=id=>byId[id]||(byId[id]={sourceContentSha256:reviewHash(items.get(id)),coach:{},rubric:{},transcripts:{}});
 for(const p of packs.coaching.items){const q=items.get(p.id);if(!q||!valid(p)||p.sourceContentSha256!==reviewHash(q)){rejected++;continue}
  for(const lang of ['en','zh']){const c=p.coach?.[lang];if(!c||!['reason','trap','strategy'].every(k=>typeof c[k]==='string'&&c[k].trim())||(q.section!=='writing'&&!q.options.every(o=>typeof c.choices?.[o]==='string'&&c.choices[o].trim())))continue;entry(q.id).coach[lang]=c;if(p.rubric?.[lang])entry(q.id).rubric[lang]=p.rubric[lang]}
 }
 const add=(p,lang)=>{const q=items.get(p.id);if(!q||!valid(p)||p.sourceScriptSha256!==hash(q.script||'')||p.qa?.approvedSourceContentSha256!==reviewHash(q)){rejected++;return}
  const turns=p.transcriptTurns,ja=lang==='ja';ensure(Array.isArray(turns)&&turns.length,`${p.id}: missing transcript turns`);
  ensure(turns.map(t=>`${t.speakerKo}: ${t.textKo}`).join('\n')===q.script,`${p.id}: transcript differs from approved Korean script`);
  const mapped=turns.map(t=>({speakerKo:t.speakerKo,textKo:t.textKo,speaker:ja?t.speakerJa:t.speaker,text:ja?t.textJa:t.text}));
  ensure(mapped.every(t=>typeof t.speaker==='string'&&typeof t.text==='string'&&t.text.trim()),`${p.id}: incomplete ${lang} translation`);
  const script=ja?p.scriptJa:p.script;ensure(mapped.map(t=>`${t.speaker}: ${t.text}`).join('\n')===script,`${p.id}: translated script does not match turns`);
  const evidence=(p.evidenceSpans||[]).map(s=>({...s,quote:ja?s.quoteJa:s.quote}));
  ensure(evidence.length&&evidence.every(s=>Number.isInteger(s.turnIndex)&&mapped[s.turnIndex]?.textKo.includes(s.quoteKo)&&s.quoteKo&&mapped[s.turnIndex].text.includes(s.quote)&&s.quote&&s.role==='answer_cue'),`${p.id}: invalid exact evidence quote`);
  const e=entry(q.id);e.sourceScript=q.script;e.transcripts[lang]={script,turns:mapped,evidence};
  if(lang==='ja')e.transcripts.ko={script:q.script,turns:mapped.map(t=>({speaker:t.speakerKo,text:t.textKo})),evidence:evidence.map(s=>({turnIndex:s.turnIndex,quote:s.quoteKo,role:s.role}))};
 };
 for(const p of packs.japanese.items)add(p,'ja');for(const p of packs.locales.items)if(['en','zh'].includes(p.locale))add(p,p.locale);
 const complete=core.items.filter(q=>{const e=byId[q.id];return ['en','zh'].every(l=>e?.coach[l])&&(q.section!=='writing'||['en','zh'].every(l=>e?.rubric[l]))&&(q.section!=='listening'||['ko','ja','en','zh'].every(l=>e?.transcripts[l]))}).length;
 return {version:1,verified:true,totalCore:core.items.length,fourLanguageReady:complete,rejectedOrUnmatched:rejected,byId};
}
if(process.argv[1]?.endsWith('build-original-support.mjs')){
 const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
 const result=buildSupport(read('content/original-exams-v1.json'),{coaching:read('content/original-localization-support.json'),japanese:read('content/original-listening-support.json'),locales:read('content/original-listening-locale-support.json')});
 for(const entry of Object.values(result.byId))for(const transcript of Object.values(entry.transcripts)){delete transcript.script;transcript.turns=transcript.turns.map(({speaker,text})=>({speaker,text}));transcript.evidence=transcript.evidence.map(({turnIndex,quote,role})=>({turnIndex,quote,role}))}
 const output='// Generated from independently reviewed, source-hash-bound support packs.\nwindow.HARUMAL_ORIGINAL_SUPPORT='+JSON.stringify(result)+';\n';
 fs.writeFileSync('data/original-support-v1.js',output);fs.writeFileSync('data/original-support-manifest.json',JSON.stringify({version:1,coreSourceSha256:hash(fs.readFileSync('content/original-exams-v1.json')),totalCore:result.totalCore,fourLanguageReady:result.fourLanguageReady,rejectedOrUnmatched:result.rejectedOrUnmatched,outputSha256:hash(output)},null,2)+'\n');console.log(`Original support: ${result.fourLanguageReady}/${result.totalCore} four-language ready; ${result.rejectedOrUnmatched} unmatched or pending support entries`);
}
