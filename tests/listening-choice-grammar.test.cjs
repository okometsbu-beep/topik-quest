const { test }=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('48 reviewed listening distractors retain one supported choice and their original answer keys', async()=>{
 const {listeningChoiceRepairs,repairListeningChoices}=await import('../scripts/lib/listening-choice-repairs.mjs');
 assert.equal(listeningChoiceRepairs.repairs.length,20);
 const c=vm.createContext({window:{}});
 for(let n=1;n<=4;n++) vm.runInContext(fs.readFileSync(`data/question-bank-v1-part${n}.js`,'utf8'),c);
 const rows=c.window.MALBIT_QUESTION_BANK_PARTS.flat(),ids=new Set();
 for(const p of listeningChoiceRepairs.repairs) for(const t of p.items){
   ids.add(t.id);const r=rows.find(r=>r[0]===t.id);
   assert.ok(r[9].includes(p.source_evidence),'explicit source contradiction is retained');
   assert.equal(r[12],t.answer_index); assert.equal(r[11][r[12]],t.answer_text);
   assert.equal(r[11][t.option_index],p.corrected);
   assert.equal(r[9],t.source_script,'choice repair does not rewrite narration');
   const expected=[...t.original_options]; expected[t.option_index]=p.corrected;
   for(const particle of listeningChoiceRepairs.particle_repairs.filter(x=>x.id===t.id)) expected[particle.option_index]=particle.corrected;
   assert.deepEqual(Array.from(r[11]),expected,'all other choices and their order remain unchanged');
   assert.equal(r[11].filter(o=>r[9].includes(o)).length,1,'exact supported choice; semantic opposites independently reviewed');
   const item={id:r[0],section:'listening',options:Array.from(r[11]),answer:r[12]+1,audio_script:r[9]};
   assert.deepEqual(repairListeningChoices(item),item.options,'repair idempotent');
 }
 assert.equal(ids.size,48);
 assert.equal(listeningChoiceRepairs.particle_repairs.length,26);
 for(const t of listeningChoiceRepairs.particle_repairs){const r=rows.find(r=>r[0]===t.id);assert.equal(r[11][t.option_index],t.corrected);}
});
