const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const EDITABLE='input,textarea,[contenteditable="true"],[contenteditable=""]';
const CONTROL='input,textarea,select,button,a,[contenteditable="true"],[role="button"]';
function runtime(){
 const listeners={};const c={document:{addEventListener:(type,fn)=>listeners[type]=fn},setTimeout,clearTimeout};c.window=c;
 vm.runInNewContext(fs.readFileSync(require.resolve('../app-touch.js'),'utf8'),c);
 return (type,target)=>{const event=new Event(type,{cancelable:true,bubbles:true});Object.defineProperty(event,'target',{value:target});listeners[type](event);return event.defaultPrevented};
}
function element({zone=false,control=false,editable=false}={}){
 return{nodeType:1,closest:selector=>{
  if(selector===EDITABLE)return editable?{}:null;
  if(selector===CONTROL)return control?{}:null;
  if(selector==='.selectable,.vocab-zone')return zone?{}:null;
  return null;
 }};
}
test('native cancelable selection/menu/copy events remain unprevented on learning text and inline text nodes',()=>{
 const prevented=runtime();for(const type of ['selectstart','contextmenu','copy'])for(const zone of ['.selectable','.vocab-zone']){
  assert.ok(zone);
  const span=element({zone:true});assert.equal(prevented(type,span),false,`${type} on learning text`);
  assert.equal(prevented(type,{nodeType:3,parentElement:span}),false,`${type} on inline text node`);
 }
});
test('text fields keep long-press selection, copy, cut and paste',()=>{
 const prevented=runtime();
 const field=element({editable:true});
 for(const type of ['contextmenu','selectstart','copy','cut','paste'])assert.equal(prevented(type,field),false,`${type} in a text field`);
 assert.equal(prevented('paste',{nodeType:3,parentElement:field}),false,'paste in a text node inside a field');
});
test('non-editing UI keeps the touch-callout protection and learning text does not gain cut or paste',()=>{
 const prevented=runtime();for(const type of ['contextmenu','selectstart','copy','cut','paste']){
  assert.equal(prevented(type,element()),true,`${type} on a plain UI area`);
  assert.equal(prevented(type,element({zone:true,control:true})),true,`${type} on a control inside learning text`);
 }
 for(const type of ['cut','paste'])assert.equal(prevented(type,element({zone:true})),true,`${type} on learning text`);
});
test('no forced blur timer or stationary-hold release is installed',()=>{
 const source=fs.readFileSync(require.resolve('../app-touch.js'),'utf8');
 assert.doesNotMatch(source,/\.blur\(/);
 assert.doesNotMatch(source,/400\)/);
 assert.doesNotMatch(source,/touchstart/);
 assert.doesNotMatch(source,/touchmove/);
});
