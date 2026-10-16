const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
test('neutral display artifacts remove only exact internal labels and preserve every approved original SVG',async()=>{
 const {deriveNeutralChoiceVisuals,neutralizeSvg,buildNeutralChoiceVisuals}=await import('../scripts/build-neutral-choice-visuals.mjs');
 const {data}=deriveNeutralChoiceVisuals(root),c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data/neutral-choice-visuals-v1.js'),'utf8'),c);
 assert.deepEqual(deriveNeutralChoiceVisuals(root,{source:JSON.parse(fs.readFileSync(path.join(root,'content/original-exams-v1.json'),'utf8'))}).data,data,'incoming preview validates before import writes');assert.ok(fs.readFileSync(path.join(root,'scripts/import-original-content.mjs'),'utf8').indexOf('deriveNeutralChoiceVisuals(dir,{source})')<fs.readFileSync(path.join(root,'scripts/import-original-content.mjs'),'utf8').indexOf('for(const [file,bytes]'));assert.deepEqual(JSON.parse(JSON.stringify(c.window.HARUMAL_NEUTRAL_VISUALS)),data);assert.deepEqual(buildNeutralChoiceVisuals(root,{check:true}),data);assert.ok(data.derivedCount>0);
 for(const [src,item]of Object.entries(data.bySource)){
  const original=fs.readFileSync(path.join(root,src),'utf8'),display=fs.readFileSync(path.join(root,item.src),'utf8'),expected=neutralizeSvg(original);
  assert.equal(hash(original),item.sourceSha256);assert.equal(hash(display),item.sha256);assert.equal(display,expected.output);assert.equal(item.removedInternalLabels,expected.removed.length);
  for(const element of display.match(/<(?:text|title|desc)\b[^>]*>[\s\S]*?<\/(?:text|title|desc)\s*>/gi)||[])assert.doesNotMatch(element.replace(/<[^>]*>/g,''),/(?:장면|그래프)\s*[가나다라](?=$|[^\p{L}\p{N}])/u);
  assert.equal(item.src===src,expected.removed.length===0);
 }
});
test('display transformation refuses mixed semantic labels and unsafe SVG rather than silently changing question graphics',async()=>{
 const {neutralizeSvg}=await import('../scripts/build-neutral-choice-visuals.mjs');
 const header='<svg xmlns="http://www.w3.org/2000/svg">',body='<path d="M 1 2 L 3 4"/><text>월별 판매량</text><text>30</text>';
 assert.equal(neutralizeSvg(header+'<text x="1">장면 가</text>'+body+'</svg>').output,header+body+'</svg>');
 assert.equal(neutralizeSvg(header+'<title>그래프 라</title>'+body+'</svg>').output,header+body+'</svg>');
 assert.throws(()=>neutralizeSvg(header+'<text>장면 가: 실제 설명</text>'+body+'</svg>'),/explicit review/);
 for(const markup of ['<script/>','<foreignObject/>','<image href="https://example.com/a.svg"/>','<path onload="alert(1)"/>'])assert.throws(()=>neutralizeSvg(header+markup+'</svg>'),/Unsafe SVG/);
});
