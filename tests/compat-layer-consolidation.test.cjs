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

test('registered after-render patches run once per render in registration order',()=>{
  const source=read('site-patch-core.js');
  const from=source.lastIndexOf("(function(){\n'use strict';\nif(typeof window.tqAfterRender==='function')return;");
  assert.ok(from>0,'after-render block exists');
  const to=source.indexOf('})();',from)+5;
  let rendered=0;
  const c={console,window:null};
  c.window=c;
  c.render=()=>{rendered++};
  vm.createContext(c);
  vm.runInContext(source.slice(from,to),c);
  const order=[];
  const first=()=>order.push('first'),second=()=>order.push('second');
  c.tqAfterRender(first);
  c.tqAfterRender(second);
  c.tqAfterRender(first);
  assert.equal(c.tqInstallAfterRender(),true);
  c.render();
  assert.equal(rendered,1);
  assert.deepEqual(order,['first','second'],'each callback runs once per render, in registration order');
  assert.equal(c.tqInstallAfterRender(),false,'the pipeline is installed only once');
});

test('every layer registers with the pipeline instead of wrapping render when it is available',()=>{
  for(const file of layers){
    const source=read(file);
    assert.match(source,/typeof window\.tqAfterRender==='function'/,`${file} uses the shared after-render stage`);
  }
  const bootstrap=read('site-patch.js');
  assert.ok(bootstrap.indexOf('tqInstallAfterRender')>bootstrap.indexOf('await loadSeries(RUNTIME_FILES)'),'the pipeline is installed after the runtime loads');
  assert.ok(bootstrap.indexOf("if(typeof render==='function')render()")>bootstrap.indexOf('tqInstallAfterRender'),'the pipeline is installed before the first render');
});
