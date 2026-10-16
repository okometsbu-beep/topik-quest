const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const read=file=>fs.readFileSync(file,'utf8');
function part(file,start,end){const source=read(file),a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a,`${file}: ${start}`);return source.slice(a,b)}
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=value=>value.replace(/<[^>]*>/g,'');
const permutations=values=>values.length?values.flatMap((v,i)=>permutations(values.filter((_,j)=>i!==j)).map(rest=>[v,...rest])):[[]];
const orders=permutations([0,1,2,3]);
const catalogContext={window:{}};vm.runInNewContext(read('data/neutral-choice-visuals-v1.js'),catalogContext);
const catalog=catalogContext.window.HARUMAL_NEUTRAL_VISUALS;

function bank(){
  const c={window:{},console,localStorage:{getItem:()=>null,setItem(){}}};vm.createContext(c);
  for(const file of fs.readdirSync('data').filter(file=>/^(?:question-bank-v1|original-exams-v1)-part\d+\.js$/.test(file)).sort())vm.runInContext(read(`data/${file}`),c);
  for(const file of ['data/question-bank-practice-v1.js','data/original-support-v1.js','question-bank-engine.js'])vm.runInContext(read(file),c);
  return c.window.MALBIT_BANK;
}
const api=bank(),visualItems=api.items.filter(q=>q.collectionId==='original12-v1'&&q.visual?.kind==='options'&&q.reviewReady&&q.visualReady);

function boot(lang='en'){
  const nodes={sheetBody:{innerHTML:''},tqReviewDeep:{innerHTML:''}},classes=new Set(),storage=new Map();
  nodes.overlay={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)}};
  const c={console,S:{lang,infinity:{feedback:null},realAnswers:{listen:{},read:{}}},Q:{mode:'random'},MALBIT_BANK:api,esc:escape,E:escape,
    document:{getElementById:id=>nodes[id]||null},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},
    tr:x=>x,fmt:x=>x,gameLimit:()=>60,instructionRW:()=>'',randomTypeName:x=>x,audioControls:()=>'',choiceTapHint:()=>'',
    enhance(){},render(){},closeSheet(){classes.delete('open')},toast(){},translateCached:async()=>'',game1BossSkill:()=>({}),game1Hash:()=>1};
  c.window=c;c.ml=c.T=(ko,ja,en,zh)=>({ko,ja,en,zh}[c.S.lang]||en);
  c.HARUMAL_NEUTRAL_VISUALS=JSON.parse(JSON.stringify(catalog));
  c.HARUMAL_LISTENING_PLAYER={cancel(){},refresh(){},markup:()=>'<button>Play</button>'};
  vm.createContext(c);
  vm.runInContext(part('learning-features.js','const I18N=','// ----- Persistent wrong-answer review -----'),c);
  c.MALBIT_LEARNING={visualChoice:c.visualChoice,visualOnlyChoices:c.visualOnlyChoices,choiceContent:c.choiceContent,questionVisual:c.questionVisual};
  vm.runInContext(part('topik1.js','function game1ChoiceRows(','window.t1Pick='),c);
  for(const name of ['renderMCQ','renderInfMCQ'])vm.runInContext(read('legacy-core.js').split('\n').find(line=>line.startsWith(`function ${name}(`)),c);
  vm.runInContext(part('learning-features.js','// ----- Persistent wrong-answer review -----',"if(typeof renderInfMCQ==='function'){"),c);
  return {c,nodes,storage};
}

function safe(html,q,label){
  for(const key of Object.keys(q.visualOptions.byOption))assert.ok(!html.includes(key),`${label}: leaked ${key}`);
  assert.doesNotMatch(html,/(?:장면|그래프)\s*[가나다라]/u,`${label}: stable label`);
  assert.doesNotMatch(html,/\b(?:title|aria-label|data-choice)="(?:장면|그래프)/u);
}
function matchingImages(html,q){
  const sources=[...html.matchAll(/class="tqOptionVisual" src="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(sources,Array.from(q.choices,choice=>catalog.bySource[q.visualOptions.byOption[choice].src].src));
  for(const [i,choice] of q.choices.entries())assert.ok(html.includes(`alt="Option ${i+1}: ${escape(q.visualOptions.byOption[choice].alt)}"`));
}

test('every approved original visual uses neutral choices in both engines for all 24 orders and four locales',()=>{
  assert.ok(visualItems.some(q=>q.level===1)&&visualItems.some(q=>q.level===2));
  const snapshot=JSON.stringify(visualItems);
  for(const lang of ['ko','ja','en','zh']){
    const {c}=boot(lang);
    for(const item of visualItems)for(const order of orders){
      const q=api.present(item.id,order),before=JSON.stringify(q);
      assert.equal(q.choices[q.answerIndex],item.options[item.answerIndex]);
      assert.equal(q.contentSha256,item.contentSha256);
      for(const mode of ['real','random','game']){
        c.Q={mode};const html=c.choices(q,q.answerIndex,false);safe(html,q,`${item.id} TOPIK I/shared ${mode}`);
        assert.equal((html.match(/class="tqOptionVisual"/g)||[]).length,q.choices.length);
        assert.doesNotMatch(html,/\bcorrect\b|\bwrong\b/);
        assert.deepEqual([...html.matchAll(/onclick="t1Pick\((\d+)\)"/g)].map(x=>Number(x[1])),[0,1,2,3]);
        if(lang==='en')matchingImages(html,q);
      }
      c.S.realAnswers.listen[q.id]={selected:q.answerIndex};
      for(const real of [false,true]){
        const html=c.renderMCQ(q,'listen',real);safe(html,q,`${item.id} TOPIK II ${real?'mock':'practice'}`);
        assert.doesNotMatch(html,/\bcorrect\b|\bwrong\b/);if(lang==='en')matchingImages(html,q);
      }
      const infinity=c.renderInfMCQ(q,'listen');safe(infinity,q,`${item.id} TOPIK II random/infinity`);
      if(lang==='en')matchingImages(infinity,q);
      const review=c.reviewQuestionMarkup(c.originalQuestionParts(q,'listen'));safe(review,q,`${item.id} review markup`);
      assert.equal(JSON.stringify(q),before,'presentation must not mutate the displayed question');
    }
  }
  assert.equal(JSON.stringify(visualItems),snapshot,'source keys, hashes, answers, visuals and coaching remain intact');
});

test('review entry, first tap, submit, close and retry keep safe selectable labels and saved bindings',async()=>{
  for(const item of visualItems){
    const {c,nodes}=boot(),order=[3,1,0,2],q=api.present(item.id,order),key=`${item.level}:listen:${item.id}`;
    c.MALBIT_REVIEW.items()[key]={key,level:item.level,type:'listen',id:item.id,choiceOrder:order,wrongCount:1,active:true};
    c.openReviewRetry(key);safe(nodes.sheetBody.innerHTML,q,'review entry');matchingImages(nodes.sheetBody.innerHTML,q);
    assert.doesNotMatch(nodes.sheetBody.innerHTML,/tqReviewScript|tqAuthoredCoaching|resultStrip/);
    assert.match(nodes.sheetBody.innerHTML,/tqTranslationToggle" disabled/);
    c.reviewSelect(q.answerIndex);safe(nodes.sheetBody.innerHTML,q,'review selected but not submitted');
    assert.doesNotMatch(nodes.sheetBody.innerHTML,/resultStrip/);
    c.reviewSelect(q.answerIndex);await Promise.resolve();
    assert.match(nodes.sheetBody.innerHTML,/resultStrip good/);
    assert.equal(c.MALBIT_REVIEW.items()[key].active,false);
    assert.deepEqual(Array.from(c.MALBIT_REVIEW.items()[key].choiceOrder),order);
    assert.ok(nodes.tqReviewDeep.innerHTML.includes(q.choices[q.answerIndex]),'submitted coaching retains the stable answer name');
    c.closeReviewRetry();c.openReviewRetry(key);safe(nodes.sheetBody.innerHTML,q,'new retry resets disclosure');
    assert.doesNotMatch(nodes.sheetBody.innerHTML,/resultStrip|tqAuthoredCoaching/);
  }
});

test('missing, unsafe and pending images never fall back to internal choice labels',()=>{
  for(const lang of ['ko','ja','en','zh']){
    const {c}=boot(lang),base=api.present(visualItems[0].id,[2,0,3,1]);
    for(const mode of ['no-alt','label-alt','unsafe','missing','pending']){
      const q=JSON.parse(JSON.stringify(base));
      for(const choice of q.choices){const image=q.visualOptions.byOption[choice];
        if(mode==='no-alt')delete image.alt;
        if(mode==='label-alt')image.alt=`${choice}: ${image.alt}`;
        if(mode==='unsafe')image.src='https://untrusted.invalid/image.svg';
        if(mode==='missing')delete q.visualOptions.byOption[choice];
      }
      if(mode==='pending')q.visualPending=true;
      const html=c.choices(q,null,false);safe(html,base,mode);
      if(['no-alt','label-alt'].includes(mode))assert.equal((html.match(/class="tqOptionVisual"/g)||[]).length,4);
      else {assert.doesNotMatch(html,/<img/);assert.ok(plain(html).trim());}
    }
  }
});

test('legacy meaningful text, escaped descriptions and no-helper fallback stay safe',()=>{
  const {c}=boot(),q={choices:['<학교>','도서관'],answerIndex:1,visualOptions:{kind:'options',byOption:{'<학교>':{src:'assets/legacy-original/a.svg',alt:'<scene>"'},'도서관':{src:'assets/legacy-original/b.svg',alt:'Library'}}}};
  assert.match(c.choiceContent(q,'<학교>',0),/alt="&lt;scene&gt;&quot;"/);
  assert.match(c.choiceContent(q,'<학교>',0),/>&lt;학교&gt;$/);
  assert.equal(c.choiceContent({choices:['① 원문']},'① 원문',0),'원문');
  c.MALBIT_LEARNING=undefined;const visual=api.present(visualItems[0].id,[1,3,0,2]);
  for(const html of [c.choices(visual,null,false),c.renderMCQ(visual,'listen',true),c.renderInfMCQ(visual,'listen')]){
    safe(html,visual,'helper unavailable');assert.deepEqual([...html.matchAll(/class="n">(\d+)</g)].map(x=>Number(x[1])),[1,2,3,4]);
  }
});

test('missing, malformed or unrelated neutral catalog mappings fail closed',()=>{
  for(const mutate of [
    c=>delete c.HARUMAL_NEUTRAL_VISUALS,
    (c,src)=>delete c.HARUMAL_NEUTRAL_VISUALS.bySource[src],
    (c,src)=>c.HARUMAL_NEUTRAL_VISUALS.bySource[src].src='https://untrusted.invalid/a.svg',
    (c,src)=>c.HARUMAL_NEUTRAL_VISUALS.bySource[src].src='assets/original-neutral/../a.svg',
    (c,src)=>c.HARUMAL_NEUTRAL_VISUALS.bySource[src].src='assets/original/unrelated.svg',
    (c,src)=>c.HARUMAL_NEUTRAL_VISUALS.bySource[src].sourceSha256='invalid',
    (c,src)=>c.HARUMAL_NEUTRAL_VISUALS.bySource[src].sha256='g'.repeat(64),
    (c,src)=>{c.HARUMAL_NEUTRAL_VISUALS.bySource[src].src=src;c.HARUMAL_NEUTRAL_VISUALS.bySource[src].sha256='0'.repeat(64)}
  ]){
    const {c}=boot(),q=api.present(visualItems[0].id),choice=q.choices[0],src=q.visualOptions.byOption[choice].src;mutate(c,src);
    const html=c.choiceContent(q,choice,0);safe(html,q,'catalog fallback');assert.doesNotMatch(html,/<img/);assert.equal(html,'Option 1 · Image unavailable');
  }
});

test('catalogued SVG bytes and hashes are label-free and only exact internal label nodes were removed',()=>{
  const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
  const label=/^(?:장면|그래프)\s*[가나다라]$/u;
  const elementText=value=>value.replace(/<[^>]*>/g,'').replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).trim();
  let derivatives=0,identities=0;
  for(const item of visualItems)for(const [key,visual] of Object.entries(item.visual.byOption)){
    const entry=catalog.bySource[visual.src];assert.ok(entry,`${item.id}: missing mapping for ${key}`);
    const original=read(visual.src),display=read(entry.src);
    assert.equal(hash(original),entry.sourceSha256);assert.equal(hash(display),entry.sha256);
    assert.doesNotMatch(elementText(display),/(?:장면|그래프)\s*[가나다라](?=$|[^\p{L}\p{N}])/u);
    const exact=original.replace(/<(text|title|desc)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,element=>label.test(elementText(element))?'':element);
    assert.equal(display,exact,`${visual.src}: changed meaningful or unrelated SVG bytes`);
    if(entry.src===visual.src){identities++;assert.equal(entry.sha256,entry.sourceSha256)}else{derivatives++;assert.match(entry.src,/^assets\/original-neutral\//)}
  }
  assert.ok(derivatives>0&&identities>0,'exercise both derivative and already-neutral source mappings');
});

test('neutral SVG builder removes exact label nodes but rejects mixed semantic labels and executable markup',async()=>{
  const {neutralizeSvg}=await import('../scripts/build-neutral-choice-visuals.mjs');
  const keep='<text x="10" y="20">의류 45%</text><path d="M 1 2 L 3 4"/>',source=`<svg><title>장면 나</title><text><tspan>그래프 라</tspan></text><desc>&#xC7A5;&#xBA74; 가</desc>${keep}</svg>`;
  const result=neutralizeSvg(source);assert.equal(result.output,`<svg>${keep}</svg>`);assert.equal(result.removed.length,3);
  assert.equal(neutralizeSvg(`<svg>${keep}</svg>`).output,`<svg>${keep}</svg>`);
  for(const unsafe of ['<svg><text>장면 가: 여자가 책을 읽는다.</text></svg>','<svg><script>alert(1)</script></svg>','<svg><image href="https://example.com/a.svg"/></svg>'])assert.throws(()=>neutralizeSvg(unsafe));
});

test('boss reordering and duplicate distractors use visible positions without losing image bindings',()=>{
  const {c}=boot(),q=api.present(visualItems[0].id,[2,0,3,1]);
  c.Q={mode:'game',node:'boss',bossSkillActive:true,bossSkillSeed:7};c.game1BossSkill=()=>({shuffle:true,decoys:2});
  c.game1Hash=value=>String(value).split('').reduce((sum,char)=>sum*31+char.charCodeAt(0),0)>>>0;
  const rows=c.game1ChoiceRows(q),html=c.choices(q,null,false);safe(html,q,'boss');
  assert.equal(rows.length,6);assert.equal((html.match(/class="tqOptionVisual"/g)||[]).length,6);
  assert.deepEqual([...html.matchAll(/class="n">(\d+)</g)].map(x=>Number(x[1])),[1,2,3,4,5,6]);
  for(const [i,row] of rows.entries())assert.ok(html.includes(`alt="Option ${i+1}: ${escape(q.visualOptions.byOption[row.text].alt)}"`));
});

test('all pre-answer visualChoice callers use the combined safe presentation API',()=>{
  for(const file of ['topik1.js','legacy-core.js']){assert.doesNotMatch(read(file),/\.visualChoice\?\./);assert.match(read(file),/\.choiceContent\?\./);}
  assert.match(read('learning-features.js'),/MALBIT_LEARNING=\{visualChoice,visualOnlyChoices,choiceContent,/);
  assert.doesNotMatch(read('learning-features.js'),/\$\{visualChoice\([^}]+\}\$\{esc\(/);
});
