// The browser never calls a third-party machine-translation API. Reviewed local text is used when it
// exists, and every other case shows an honest "being prepared" note instead of a machine guess.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('no runtime file calls the retired free translation API',()=>{
  const files=[...fs.readdirSync(root).filter(name=>name.endsWith('.js')),...fs.readdirSync(path.join(root,'data')).filter(name=>name.endsWith('.js')).map(name=>'data/'+name),'index.html','sw.js'];
  for(const file of files){
    const source=read(file);
    assert.doesNotMatch(source,/api\.mymemory\.translated\.net|mymemory\.translated\.net/i,`${file} still references the retired translation API`);
  }
});

function runtime(){
  const source=read('legacy-core.js');
  const from=source.indexOf('const TRANSLATION_PENDING=');
  const to=source.indexOf('\n}',source.indexOf('async function translateCached('))+2;
  assert.ok(from>0&&to>from,'translateCached block extraction boundaries');
  let fetched=0;
  const c={S:{transCache:{}},save(){},fetch:async()=>{fetched++;throw Error('the network must not be used')},console};
  c.window=c;
  vm.createContext(c);
  vm.runInContext(source.slice(from,to),c);
  return {c,fetched:()=>fetched};
}

test('an unknown text returns a localized preparation note and never touches the network',async()=>{
  const {c,fetched}=runtime();
  for(const [src,target,expected] of [['ko','ja',/準備中/],['ko','en',/being prepared/],['ko','zh',/准备中/],['ja','ko',/준비 중/]]){
    const value=await c.translateCached('detail_'+target,'설명입니다.','ko'===src?'ko':src,target);
    assert.match(value,expected);
  }
  assert.equal(fetched(),0);
  assert.deepEqual(c.S.transCache,{},'a preparation note is not cached as if it were a translation');
});

test('already reviewed text is reused and source-language text is returned unchanged',async()=>{
  const {c,fetched}=runtime();
  c.S.transCache.ko_ja_detail='검수된 일본어 번역';
  assert.equal(await c.translateCached('detail','한국어','ko','ja'),'검수된 일본어 번역');
  assert.equal(await c.translateCached('detail','한국어','ko','ko'),'한국어');
  c.S.transCache.ko_en_quota='MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY';
  assert.match(await c.translateCached('quota','한국어','ko','en'),/being prepared/);
  assert.equal(fetched(),0);
});
