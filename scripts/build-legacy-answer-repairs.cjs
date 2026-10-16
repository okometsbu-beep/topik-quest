// Reviewed, additive corrections only. Original packed rows and progress IDs never change.
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
const sorted=value=>Array.isArray(value)?value.map(sorted):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,sorted(value[key])])):value;
const contentHash=item=>digest(JSON.stringify(sorted(Object.fromEntries(Object.entries(item).filter(([key])=>key!=='qa')))));
function readRows(root='.') {const c={window:{}};vm.createContext(c);for(let p=1;p<=4;p++)vm.runInContext(fs.readFileSync(`${root}/data/question-bank-v1-part${p}.js`,'utf8'),c);return JSON.parse(JSON.stringify(c.window.MALBIT_QUESTION_BANK_PARTS.flat()));}
function build(input,rows){
  assert.equal(input.schemaVersion,1);assert.equal(input.contentKind,'legacy_answer_repairs');
  const bySource=new Map(rows.map(row=>[row[0],row])),byId={},coaches={},seen=new Set();let pending=0;
  for(const item of input.items){
    assert.ok(!seen.has(item.id),`${item.id}: duplicate repair`);seen.add(item.id);
    const row=bySource.get(item.id),patch=item.patch;assert.ok(row&&['l','r'].includes(row[3]),`${item.id}: original MCQ missing`);
    assert.equal(digest(JSON.stringify(row)),item.sourceRowSha256,`${item.id}: stale packed row`);
    assert.equal(digest(row[9]),item.sourceScriptSha256,`${item.id}: stale script`);
    assert.equal(digest(row[8]),item.sourcePassageSha256,`${item.id}: stale passage`);
    assert.equal(contentHash(item),item.qa?.contentSha256,`${item.id}: stale review hash`);
    assert.deepEqual(Object.keys(patch).sort(),['answerIndex','coach','options']);
    assert.equal(patch.answerIndex,row[12],`${item.id}: answer index changed`);
    assert.ok(Array.isArray(patch.options)&&patch.options.length===4&&new Set(patch.options).size===4&&patch.options.every(text=>typeof text==='string'&&text.trim()),`${item.id}: invalid options`);
    for(const lang of ['ko','ja','en','zh']){const c=patch.coach?.[lang];assert.ok(c&&['reason','trap','strategy'].every(key=>typeof c[key]==='string'&&c[key].trim()),`${item.id}: missing ${lang} coaching`);assert.deepEqual(Object.keys(c.choices||{}).sort(),[...patch.options].sort(),`${item.id}: ${lang} choice keys`);assert.ok(Object.values(c.choices).every(text=>typeof text==='string'&&text.trim()));}
    if(item.qa.status!=='approved'){pending++;continue;}
    assert.equal(item.qa.independentCorrectnessReview,true,`${item.id}: independent correctness review missing`);
    assert.equal(item.qa.independentTranslationReview,true,`${item.id}: independent translation review missing`);
    assert.ok(typeof item.qa.reviewer==='string'&&item.qa.reviewer.trim(),`${item.id}: reviewer missing`);
    assert.ok(typeof item.qa.report==='string'&&item.qa.report.trim(),`${item.id}: review report missing`);
    const coachKey=digest(JSON.stringify(sorted(patch.coach)));coaches[coachKey]=structuredClone(patch.coach);
    byId[item.id]={sourceRow:structuredClone(row),sourceRowSha256:item.sourceRowSha256,patch:{options:[...patch.options],answerIndex:patch.answerIndex,coachKey},reviewStatus:'approved',contentSha256:item.qa.contentSha256};
  }
  return {version:1,verified:true,activationAllowed:Object.keys(byId).length>0,authoredCount:seen.size,approvedCount:Object.keys(byId).length,pendingCount:pending,coaches,byId};
}
if(require.main===module){const input=JSON.parse(fs.readFileSync('content/legacy-answer-repairs-v1.json','utf8')),result=build(input,readRows());fs.writeFileSync('data/legacy-answer-repairs-v1.js','// Generated additive corrections. Pending reviews are intentionally not shipped.\nwindow.HARUMAL_LEGACY_ANSWER_REPAIRS='+JSON.stringify(result)+';\n');console.log(`Legacy answer repairs: ${result.approvedCount} approved, ${result.pendingCount} withheld pending independent review`);}
module.exports={build,readRows,contentHash};
