const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c={window:{}};vm.createContext(c);
const packs=fs.readdirSync('data').filter(x=>/^grammar-course-.+\.js$/.test(x)).sort();
for(const f of ['data/beginner-grammar-v1.js',...packs.map(x=>'data/'+x),'data/grammar-course.js','grammar-course-engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const D=c.window.HARUMAL_GRAMMAR_COURSE,E=c.window.HARUMAL_GRAMMAR_ENGINE,langs=['ko','ja','en','zh'];
const local=(v,label)=>{for(const lang of langs)assert.ok(typeof v?.[lang]==='string'&&v[lang].trim(),label+'.'+lang)};
test('course preserves all legacy64 identities and counts only loaded authored lessons',()=>{const legacy=c.window.MALBIT_BEGINNER_GRAMMAR_V1;for(const old of legacy.lessons){const row=D.lessons.find(x=>x.id===old.id);assert.ok(row,old.id);assert.ok(row.activities.some(x=>x.id===old.id+':original-drill'),old.id+' original activity retained')}assert.equal(new Set(D.lessons.map(x=>x.id)).size,D.lessons.length);assert.equal(D.coverage.total,D.lessons.length);assert.equal(D.coverage.extended,D.lessons.filter(x=>x.activities.some(a=>a.phase==='transfer')&&x.activities.some(a=>a.phase==='review')).length)});
test('authored lessons have complete localized instruction and distinct contextual transfer/review',()=>{
 for(const lesson of D.lessons.filter(x=>!x.legacy)){
  for(const field of ['title','goal','meaning','use','register','contrast'])local(lesson[field],lesson.id+'.'+field);
  assert.ok(lesson.examples.length>=1,lesson.id+' example');assert.ok(lesson.workedExamples.length>=1,lesson.id+' worked form');
  for(const x of lesson.examples){assert.ok(/[가-힣]/.test(x.korean));local(x.meaning,lesson.id+' example meaning')}
  for(const x of lesson.workedExamples){assert.ok(x.source&&x.result);local(x.explanation,lesson.id+' worked explanation')}
  for(const phase of ['practice','transfer','review'])assert.ok(lesson.activities.some(a=>a.phase===phase),lesson.id+' '+phase);
  const practice=lesson.activities.filter(a=>a.phase==='practice');for(const a of lesson.activities.filter(a=>a.phase!=='practice'))assert.ok(!practice.some(b=>a.contextKorean&&a.contextKorean===b.contextKorean),lesson.id+' new context '+a.id);
 }
});
test('every authored activity grades its declared answer and has specific localized feedback',()=>{
 const ids=new Set();for(const lesson of D.lessons)for(const a of lesson.activities){assert.ok(!ids.has(a.id),'duplicate '+a.id);ids.add(a.id);assert.ok(E.validActivity(a),a.id);local(a.prompt,a.id+' prompt');local(a.explanation,a.id+' explanation');const answer=a.type==='text'?a.accepted[0]:a.answer;assert.equal(E.grade(a,answer),true,a.id+' key');
  if(a.type==='choice'){assert.ok(a.options.length>=2,a.id);assert.equal(new Set(a.options.map(x=>x.id)).size,a.options.length);assert.equal(new Set(a.options.map(x=>JSON.stringify(x.text))).size,a.options.length);for(const o of a.options){local(o.feedback,a.id+' option '+o.id);assert.equal(E.grade(a,o.id),o.id===a.answer,a.id+' distractor');assert.doesNotMatch(o.feedback.en,/This expression conveys the target meaning in this context\./,a.id+' generic feedback')}}
 }
});
test('prerequisites resolve and do not form a cycle; course is free browsing',()=>{const byId=new Map(D.lessons.map(x=>[x.id,x])),done=new Set();function visit(id,path=[]){assert.ok(!path.includes(id),'prerequisite cycle '+[...path,id].join(' > '));if(done.has(id))return;const l=byId.get(id);assert.ok(l,'missing prerequisite '+id);for(const p of l.prerequisites||[])visit(p,[...path,id]);done.add(id)}for(const l of D.lessons){assert.ok(D.stages.some(s=>s.id===l.stage),l.id+' stage');visit(l.id)} });
test('every reviewed pack ships in ordered runtime and offline shell, with all legacy supplements retained',()=>{const loader=fs.readFileSync('site-patch.js','utf8'),worker=fs.readFileSync('sw.js','utf8');for(const pack of packs){assert.ok(loader.includes("'data/"+pack+"'"),'runtime '+pack);assert.ok(loader.indexOf("'data/"+pack+"'")<loader.indexOf("'data/grammar-course.js'"),'pack before registry '+pack);assert.ok(worker.includes("'./data/"+pack+"'"),'offline '+pack)}assert.equal(D.lessons.length,208);assert.equal(D.lessons.reduce((sum,l)=>sum+l.activities.length,0),772);for(const l of D.lessons){assert.ok(l.activities.some(a=>a.phase==='transfer'),l.id+' transfer');assert.ok(l.activities.some(a=>a.phase==='review'),l.id+' review')}for(const l of D.lessons.filter(l=>l.legacy))assert.ok(l.activities.some(a=>a.id===l.id+':original-drill'),l.id+' stable original drill')});
