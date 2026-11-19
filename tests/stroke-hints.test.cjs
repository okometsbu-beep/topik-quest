// Every letter the handwriting pad offers has a stroke-order hint in all four interface languages;
// whole syllables keep an honest "not available yet" message instead of a guessed order.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
function boot(lang){
  const c={console,document:{addEventListener(){},querySelectorAll:()=>[],querySelector:()=>null,documentElement:{classList:{contains:()=>false}},body:{classList:{add(){},remove(){},toggle(){}},appendChild(){}},getElementById:()=>null,createElement:()=>({style:{},classList:{add(){},remove(){}},addEventListener(){},appendChild(){},setAttribute(){}}),head:{appendChild(){}}},localStorage:{getItem:()=>null,setItem(){}},S:{view:'home',lang},navigator:{}};
  c.window=c;c.requestAnimationFrame=fn=>fn();
  vm.createContext(c);
  vm.runInContext(read('app-polish-v35.js'),c);
  return c.MALBIT_V35_INTERNALS;
}
const LETTERS=['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ','ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','ㅐ','ㅒ','ㅔ','ㅖ','ㅘ','ㅙ','ㅚ','ㅝ','ㅞ','ㅟ','ㅢ','ㄲ','ㄸ','ㅃ','ㅆ','ㅉ'];

test('all forty practice letters have a stroke hint',()=>{
  const api=boot('ko');
  assert.equal(api.setSizes.letters,40,'the pad still offers forty letters');
  for(const letter of LETTERS){
    const hint=api.traceHint(letter);
    assert.match(hint,/①/,`${letter} has a numbered stroke hint`);
    assert.doesNotMatch(hint,/아직 없어요/,`${letter} is not falling back`);
  }
});

test('the hint is written in the interface language, not always Korean',()=>{
  const ja=boot('ja').traceHint('ㄹ'),en=boot('en').traceHint('ㄹ'),zh=boot('zh').traceHint('ㄹ');
  assert.match(ja,/縦/);
  assert.match(en,/vertical/);
  assert.match(zh,/竖/);
  assert.notEqual(new Set([ja,en,zh]).size,1,'each language is distinct');
});

test('whole syllables keep the honest not-yet message',()=>{
  const api=boot('en');
  const hint=api.traceHint('가');
  assert.match(hint,/not available yet/);
  assert.doesNotMatch(hint,/①/);
});

test('variable letters tell the learner the textbook decides the order',()=>{
  const source=read('app-polish-v35.js');
  assert.match(source,/획순 안내 방향은 교재에 따라 다를 수 있어요/);
  assert.match(source,/A textbook may order the strokes differently/);
  assert.match(source,/筆順の向きは教材によって異なる場合があります/);
  assert.match(source,/笔顺方向可能因教材而异/);
});
