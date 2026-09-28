import assert from 'node:assert/strict';
export async function verifyHaruman({evaluate,tap,shot,setViewport,sleep}){
 const fit=async(label)=>{
  for(let i=0;i<30;i++){if(await evaluate(`[...document.querySelectorAll('[data-haruman] img')].every(i=>i.complete&&i.naturalWidth===320)`))break;await sleep(50)}
  const r=await evaluate(`(()=>{const stages=[...document.querySelectorAll('#screen [data-haruman]')];return {count:stages.length,overflow:document.documentElement.scrollWidth-innerWidth,stages:stages.map(s=>{const r=s.getBoundingClientRect(),i=s.querySelector('img');return{fits:r.left>=0&&r.right<=innerWidth,bg:getComputedStyle(s).backgroundColor,loaded:i.complete&&i.naturalWidth===320}})}})()`);
  assert.ok(r.count>0,label+' missing mascot');assert.ok(r.overflow<=1,label+' overflow');for(const s of r.stages){assert.ok(s.fits&&s.loaded,label+' clipping/image');assert.equal(s.bg,'rgba(0, 0, 0, 0)',label+' transparent mascot stage')}
 };
 for(const theme of ['light','dark']){
  await evaluate(`malbitSetTheme('${theme}')`);
  for(const width of [320,375,390,430]){
   await setViewport(width,844);await tap('#nav_home');await fit('home '+theme+width);await shot(`haruman-home-${width}-${theme}.png`);
   for(const view of ['learn','review','more']){await tap('#nav_'+view);await fit(view+theme+width);if(width===390)await shot(`haruman-${view}-${theme}.png`)}
  }
 }
 // Renders and navigation must not manufacture progress or save a mascot record.
 assert.equal(await evaluate(`Object.keys(localStorage).some(k=>/haruman/i.test(k))`),false);
 await tap('#nav_home');await setViewport(390,844);
}
