const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {readRows,contentHash}=require('./build-legacy-answer-repairs.cjs');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
function readSources(root='.') {const c={window:{}};vm.runInNewContext(fs.readFileSync(`${root}/data/question-bank-practice-v1.js`,'utf8'),c);return new Map([...readRows(root).map(row=>[row[0],row]),...JSON.parse(JSON.stringify(c.window.MALBIT_QUESTION_BANK_EXPANSION)).map(q=>[q.id,q])]);}
function build(input,sources,readFile=src=>fs.readFileSync(src)){
 assert.equal(input.schemaVersion,1);const byId={},seen=new Set(),assets=new Set();let pending=0;
 for(const entry of input.items){assert.ok(!seen.has(entry.id));seen.add(entry.id);const source=sources.get(entry.id),row=Array.isArray(source),expected=row?entry.sourceRow:entry.sourceAuthored;assert.ok(source,`${entry.id}: missing original`);assert.deepEqual(expected,source,`${entry.id}: original source changed`);assert.equal(hash(JSON.stringify(source)),row?entry.sourceRowSha256:entry.sourceAuthoredSha256);
  const options=row?source[11]:source.options,answerIndex=row?source[12]:source.answerIndex,visual=entry.visual;assert.equal(entry.expectedAnswer,options[answerIndex]);assert.ok(['options','image'].includes(visual.kind));
  if(visual.kind==='options')assert.deepEqual(Object.keys(visual.byOption).sort(),[...options].sort());
  const images=visual.kind==='options'?Object.values(visual.byOption):[visual];assert.deepEqual(Object.keys(entry.assetHashes).sort(),images.map(image=>image.src).sort());
  for(const image of images){assert.match(image.src,/^assets\/legacy-original\/[A-Za-z0-9_-]+\.svg$/);assert.ok(typeof image.alt==='string'&&image.alt.trim());const bytes=readFile(image.src);assert.equal(hash(bytes),entry.assetHashes[image.src],`${entry.id}: image hash mismatch`);const svg=bytes.toString('utf8');assert.match(svg,/<svg[\s>]/);assert.doesNotMatch(svg,/<(?:script|foreignObject|iframe)\b|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/|data:|javascript:)/i);assets.add(image.src);}
  if(entry.qa?.status!=='approved'){pending++;continue;}
  assert.equal(entry.qa.contentSha256,contentHash(entry),`${entry.id}: stale visual review`);assert.ok(entry.qa.reviewer&&entry.qa.report,`${entry.id}: independent reviewer missing`);
  byId[entry.id]={sourceRow:row?structuredClone(source):undefined,sourceAuthored:row?undefined:structuredClone(source),reviewStatus:'approved',contentSha256:entry.qa.contentSha256,visual:{...structuredClone(visual),optional:visual.kind==='image'&&!(row?source[16]:source.visual)}};
 }
 return {version:1,verified:true,authoredCount:seen.size,approvedCount:Object.keys(byId).length,pendingCount:pending,assetCount:assets.size,byId};
}
if(require.main===module){const data=build(JSON.parse(fs.readFileSync('content/legacy-question-visuals-v1.json','utf8')),readSources());fs.writeFileSync('data/legacy-question-visuals-v1.js','// Generated source- and asset-bound visual overlays; unapproved visuals are withheld.\nwindow.HARUMAL_LEGACY_QUESTION_VISUALS='+JSON.stringify(data)+';\n');console.log(`Legacy visuals: ${data.approvedCount} approved, ${data.pendingCount} pending, ${data.assetCount} verified SVG files`);}
module.exports={build,readSources};
