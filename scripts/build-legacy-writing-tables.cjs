const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const c={window:{}};vm.createContext(c);for(let p=1;p<=4;p++)vm.runInContext(fs.readFileSync(`data/question-bank-v1-part${p}.js`,'utf8'),c);
const rows=new Map(JSON.parse(JSON.stringify(c.window.MALBIT_QUESTION_BANK_PARTS.flat())).map(q=>[q[0],q]));
const spec=JSON.parse(fs.readFileSync('content/legacy-writing-table-spec-v1.json','utf8')),byId={};
assert.equal(spec.items.length,12);
for(const item of spec.items){const q=rows.get(item.id);assert.match(item.id,/^M(0[1-9]|1[0-2])-II-W-53$/);assert.equal(q[3],'w');assert.equal(q[4],53);const d=JSON.parse(q[8]);assert.deepEqual(d,item.sourceData);
 const expected={kind:'table',caption:`${d.title} · ${d.survey_agency} · 연습용 자료`,columns:['항목','내용'],rows:[[d.year_1,`${d.value_1}${d.unit}`],[d.year_2,`${d.value_2}${d.unit}`],['주요 이용층 변화',d.rank_change],...d.reasons.map((r,i)=>[`변화 원인 ${i+1}`,r])]};assert.deepEqual(item.visual,expected);assert.equal(d.reasons.length,2);
 byId[item.id]={sourceRow:q,sourceRowSha256:crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex'),visual:{...expected,sourceFormat:'legacy-json'}};
}
const data={version:1,verified:true,verificationScope:'source-to-table values, units, all stated causes and agency preserved; not a new model-answer approval',byId};
fs.writeFileSync('data/legacy-writing-tables-v1.js','// Generated exact structured-data presentation; original bank rows remain unchanged.\nwindow.HARUMAL_LEGACY_WRITING_TABLES='+JSON.stringify(data)+';\n');
console.log('Legacy writing tables: all 12 source rows and complete table values verified');
