const test=require('node:test'),assert=require('node:assert/strict');
test('theme QA composites transparent and translucent surfaces instead of treating their RGB as opaque',async()=>{
 const {effectiveBackground}=await import('../scripts/theme-color-checks.mjs');
 const node=(backgroundColor,parentElement=null)=>({backgroundColor,parentElement}),styleOf=x=>x;
 const light=node('rgb(240, 244, 248)'),dark=node('rgb(30, 40, 50)');
 assert.deepEqual(effectiveBackground(node('rgba(0, 0, 0, 0)',light),styleOf),[240,244,248]);
 assert.deepEqual(effectiveBackground(node('rgba(255, 255, 255, 0)',dark),styleOf),[30,40,50]);
 assert.deepEqual(effectiveBackground(node('rgba(0, 0, 0, 0.5)',light),styleOf),[120,122,124]);
 assert.deepEqual(effectiveBackground(node('rgb(0, 0, 0)',light),styleOf),[0,0,0]);
 assert.deepEqual(effectiveBackground(node('rgba(0, 0, 0, 0)'),styleOf),[255,255,255]);
 assert.throws(()=>effectiveBackground(node('unsupported'),styleOf),/Unsupported computed background/);
});
