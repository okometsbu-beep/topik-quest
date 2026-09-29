import assert from 'node:assert/strict';

export async function verifyIntro({evaluate,send,setViewport,shot,ready,sleep,baseline=false}){
  const watch=await send('Page.addScriptToEvaluateOnNewDocument',{source:`
    window.__introCompletion={started:performance.now(),ended:null,removed:null};
    document.addEventListener('ended',e=>{
      if(e.target.id==='harumanIntroVideo')window.__introCompletion.ended=performance.now();
    },true);
    new MutationObserver(records=>{
      if(records.some(r=>[...r.removedNodes].some(n=>n.classList?.contains('harumanIntro'))))
        window.__introCompletion.removed=performance.now();
    }).observe(document,{subtree:true,childList:true});
  `});
  const wait=async(predicate,label)=>{
    for(let i=0;i<200;i++){try{if(await evaluate(predicate))return}catch(_){}await sleep(100)}
    throw Error('Intro timed out: '+label);
  };
  const reload=async()=>{
    const origin=await evaluate('performance.timeOrigin');
    // Historical baseline alone had a recent-launch bypass.
    if(baseline)await evaluate(`sessionStorage.removeItem('harumalIntroSeenV1')`);
    await send('Page.reload',{ignoreCache:true});
    await wait(`performance.timeOrigin!==${origin}&&!!window.__introCompletion`,'new document');
  };
  const finish=async()=>{
    await wait(`window.__introCompletion?.removed!==null`,'removal');
    const result=await evaluate('window.__introCompletion');
    assert.ok(result.ended!==null,'video must end naturally before removal');
    assert.ok(result.removed>=result.ended+150,'fade follows the final frame');
    await ready();return result;
  };
  try{
    for(const theme of ['light','dark'])for(const width of [320,375,390,430]){
      await evaluate(`malbitSetTheme('${theme}')`);await setViewport(width,844);await reload();
      await wait(`document.getElementById('harumanIntroVideo')?.currentTime>.4`,'visible playback');
      const layout=await evaluate(`(()=>{const p=document.querySelector('.harumanIntro'),v=document.getElementById('harumanIntroVideo'),r=v.getBoundingClientRect();return{buttons:p.querySelectorAll('button').length,leaving:p.classList.contains('harumanIntroLeaving'),opacity:getComputedStyle(v).opacity,fit:getComputedStyle(v).objectFit,overflow:document.documentElement.scrollWidth>innerWidth+1,inside:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,center:Math.abs((r.left+r.right)/2-innerWidth/2)}})()`);
      if(!baseline)assert.equal(layout.buttons,0,'no skip control');
      assert.equal(layout.leaving,false);assert.equal(layout.opacity,'1');assert.equal(layout.fit,'contain');
      assert.equal(layout.overflow,false);assert.equal(layout.inside,true);assert.ok(layout.center<1);
      await shot(`intro-${width}-${theme}-playing.png`);await finish();
      await shot(`intro-${width}-${theme}-home.png`);
    }
    if(!baseline){
      // Delay the real play call, then decode/play at 0.25x to cross both old deadlines.
      const slow=await send('Page.addScriptToEvaluateOnNewDocument',{source:`
        const play=HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play=function(){
          if(this.id==='harumanIntroVideo'&&!this.__introDelayed){this.__introDelayed=true;return new Promise(resolve=>setTimeout(resolve,1200)).then(()=>play.call(this))}
          return play.call(this);
        };
        document.addEventListener('loadedmetadata',e=>{if(e.target.id==='harumanIntroVideo')e.target.playbackRate=.25},true);
      `});
      try{
        await reload();
        await wait(`document.getElementById('harumanIntroVideo')?.currentTime>1`,'slow playback past old deadline');
        assert.ok(await evaluate('performance.now()>4000'));
        await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:350}]});
        await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
        await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
        await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
        assert.ok(await evaluate(`!!document.querySelector('.harumanIntro:not(.harumanIntroLeaving)')`));
        await shot('intro-delayed-slow-no-skip.png');
        const result=await finish();assert.ok(result.ended>10000);
        console.log('Intro delayed start + slow real playback + no-skip passed',JSON.stringify(result));
      }finally{await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:slow.identifier})}
    }
    console.log('Intro mobile layout/playback passed: four widths, light/dark, baseline='+baseline);
  }finally{await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:watch.identifier})}
}
