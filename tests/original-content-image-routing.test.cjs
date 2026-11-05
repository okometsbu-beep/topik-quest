const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function boot(){
 const c={window:{},console,localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},esc:String,cleanChoice:String,text:ko=>ko};
 vm.createContext(c);
 for(const f of [...Array.from({length:4},(_,i)=>`data/question-bank-v1-part${i+1}.js`),...Array.from({length:4},(_,i)=>`data/original-exams-v1-part${i+1}.js`),'question-bank-engine.js','data/neutral-choice-visuals-v1.js','data/question-visual-polish-v1.js','data/question-image-release-v1.js','question-image-release.js'])vm.runInContext(read(f),c);
 const renderer=read('learning-features.js');vm.runInContext(renderer.slice(renderer.indexOf('function localVisualSource('),renderer.indexOf('function listeningExplanation(')),c);
 return c;
}
test('original-content browser fixture renders exact shuffled reviewed images and retains label-free fallback',()=>{
 const c=boot(),q=c.window.MALBIT_BANK.present('O05-II-L-01',[2,0,3,1]),letters=['c','b','d','a'];
 const sourcePaths=q.choices.map(choice=>q.visualOptions.byOption[choice].src);
 assert.deepEqual(Array.from(sourcePaths),letters.map(key=>`assets/original/O05-II-L-01-${key}.svg`));
 const before=JSON.stringify(q),render=()=>Array.from(q.choices,(choice,i)=>c.choiceContent(q,choice,i));
 const verify=expected=>{
  const html=render();
  assert.deepEqual(html.map(value=>value.match(/src="([^"]+)"/)[1]),expected);
  assert.doesNotMatch(html.join('').replace(/<[^>]*>/g,'')+html.map(value=>value.match(/alt="([^"]*)"/)[1]).join(' '),/(?:장면|그래프)\s*[가나다라]/u);
 };
 verify(letters.map(key=>`assets/question-image-preview/O05-II-L-01-${key}-v1.webp`));
 c.window.HARUMAL_QUESTION_IMAGE_RELEASE=null;
 verify(letters.map(key=>`assets/question-polish/original-neutral-O05-II-L-01-${key}.svg`));
 vm.runInContext(read('question-image-release.js'),c);
 // Even an approved replacement cannot bypass the neutral-source safety gate.
 delete c.window.HARUMAL_NEUTRAL_VISUALS.bySource[sourcePaths[0]];
 const html=render();assert.doesNotMatch(html[0],/<img/);assert.match(html[0],/그림 준비 중/);
 assert.equal(JSON.stringify(q),before,'display routing must not mutate the question or grading');
});
