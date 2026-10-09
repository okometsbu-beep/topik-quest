const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function runtime(){
 const listeners={};const c={document:{addEventListener:(type,fn)=>listeners[type]=fn},setTimeout,clearTimeout};c.window=c;
 vm.runInNewContext(fs.readFileSync(require.resolve('../app-touch.js'),'utf8'),c);
 return (type,target)=>{const event=new Event(type,{cancelable:true,bubbles:true});Object.defineProperty(event,'target',{value:target});listeners[type](event);return event.defaultPrevented};
}
function element(zone,control=false){return{nodeType:1,closest:selector=>selector==='.selectable,.vocab-zone'?zone?{}:null:control?{}:null}}
test('native cancelable selection/menu/copy events remain unprevented on learning text and inline text nodes',()=>{
 const prevented=runtime();for(const type of ['selectstart','contextmenu','copy'])for(const zone of ['selectable','vocab-zone']){
  const span=element(zone);assert.equal(prevented(type,span),false,`${type} on ${zone}`);
  assert.equal(prevented(type,{nodeType:3,parentElement:span}),false,`${type} on inline text node`);
 }
});
test('selection exception does not enable UI controls or cut/paste in learning text',()=>{
 const prevented=runtime();for(const type of ['selectstart','contextmenu','copy','cut','paste']){
  assert.equal(prevented(type,element(false)),true);
  assert.equal(prevented(type,element(true,true)),true);
 }
 for(const type of ['cut','paste'])assert.equal(prevented(type,element(true)),true);
});
