// The compatibility layers no longer stack wrappers on window.render or watch document.body on their
// own. One pipeline and one body observer in site-patch-core.js serve every registered patch.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const layers=['app-polish-v22.js','app-polish-v24.js','app-polish-v33.js','app-polish-v34.js','app-polish-v35.js','review-visual-system.js','random-practice-visual-system.js'];

test('only site-patch-core.js observes document.body',()=>{
  const files=fs.readdirSync(root).filter(name=>name.endsWith('.js'));
  const owners=[];
  for(const file of files){
    const source=read(file);
    if(/MutationObserver[^\n]*observe\(document\.body/.test(source)||/\.observe\(document\.body/.test(source))owners.push(file);
  }
  assert.deepEqual(owners,['site-patch-core.js']);
  for(const file of layers)assert.doesNotMatch(read(file),/new MutationObserver\([^)]*\)\.observe\(document\.body/);
});

test('no compatibility layer writes a hardcoded version badge',()=>{
  for(const file of layers){
    const source=read(file);
    assert.doesNotMatch(source,/patchVersion/,`${file} still hardcodes the version badge`);
    assert.doesNotMatch(source,/badge\.textContent='v3\d'/,`${file} still writes a v3x badge`);
  }
});

test('each compatibility layer still wraps render at most once',()=>{
  for(const file of layers){
    const source=read(file);
    assert.equal((source.match(/window\.render=function|\brender=function/g)||[]).length,1,`${file} installs a single wrapper`);
  }
});
