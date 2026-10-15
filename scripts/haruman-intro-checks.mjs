import assert from 'node:assert/strict';

export function assertIntroTimeline(result,{baseline=false}={}){
  assert.ok(Number.isFinite(result.ended),'video must end naturally before removal');
  assert.ok(Number.isFinite(result.removed),'intro must be removed');
  assert.ok(result.removed>=result.ended+150,'fade follows the final frame');
  if(baseline)return;
  for(const stage of ['whiteout','title','leaving'])assert.ok(Number.isFinite(result[stage]),stage+' must occur');
  assert.ok(result.mediaDuration>2.7&&result.mediaDuration<3,'the complete video remains 2.8 seconds');
  assert.ok(result.mediaEndedAt>=result.mediaDuration-.05,'the final video frame is reached');
  assert.ok(result.whiteout>=result.ended,'whiteout follows natural completion');
  assert.ok(result.title>=result.whiteout+280&&result.title<=result.whiteout+500,'whiteout takes about 300ms');
  assert.ok(result.leaving>=result.title+980&&result.leaving<=result.title+1250,'title includes 1000ms entrance and hold');
  assert.ok(result.removed>=result.leaving+180&&result.removed<=result.leaving+450,'exit takes about 200ms');
  assert.ok(result.removed>=result.title+1150,'title remains readable before home');
  // Bound the post-video flow, not loading/playback time; slow playback must still finish.
  assert.ok(result.removed>=result.ended+1450&&result.removed<=result.ended+1900,'post-video flow stays near 1500ms');
}

export async function verifyIntro({evaluate,send,setViewport,shot,ready,sleep,baseline=false}){
  const watch=await send('Page.addScriptToEvaluateOnNewDocument',{source:`
    window.__introCompletion={started:performance.now(),ended:null,mediaDuration:null,mediaEndedAt:null,whiteout:null,title:null,leaving:null,removed:null};
    document.addEventListener('ended',e=>{
      if(e.target.id==='harumanIntroVideo')Object.assign(window.__introCompletion,{ended:performance.now(),mediaDuration:e.target.duration,mediaEndedAt:e.target.currentTime});
    },true);
    new MutationObserver(records=>{
      const panel=document.querySelector('.harumanIntro'),result=window.__introCompletion;
      if(panel?.classList.contains('harumanIntroWhiteout')&&result.whiteout===null)result.whiteout=performance.now();
      if(panel?.classList.contains('harumanIntroShowingTitle')&&result.title===null)result.title=performance.now();
      if(panel?.classList.contains('harumanIntroLeaving')&&result.leaving===null)result.leaving=performance.now();
      if(records.some(r=>[...r.removedNodes].some(n=>n.classList?.contains('harumanIntro'))))
        window.__introCompletion.removed=performance.now();
    }).observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
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
    assertIntroTimeline(result,{baseline});
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
      if(!baseline)assert.equal(await evaluate(`getComputedStyle(document.querySelector('.harumanIntroTitle')).visibility`),'hidden');
      await shot(`intro-${width}-${theme}-playing.png`);
      if(!baseline){
        await wait(`document.querySelector('.harumanIntroWhiteout')&&!document.querySelector('.harumanIntroShowingTitle')`,'whiteout');
        await shot(`intro-${width}-${theme}-whiteout.png`);
        await wait(`document.querySelector('.harumanIntroShowingTitle')&&Number(getComputedStyle(document.querySelector('.harumanIntroTitle')).opacity)>.99`,'title reveal');
        const title=await evaluate(`(()=>{const p=document.querySelector('.harumanIntro'),i=document.getElementById('harumanIntroTitle'),r=i.getBoundingClientRect();return{loaded:i.complete&&i.naturalWidth===1448,src:i.getAttribute('src'),white:getComputedStyle(p,':before').backgroundColor,covered:getComputedStyle(p,':before').opacity,inside:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,center:Math.abs((r.left+r.right)/2-innerWidth/2),overflow:document.documentElement.scrollWidth>innerWidth+1}})()`);
        assert.equal(title.loaded,true);assert.equal(title.src,'assets/branding/harumal-title-v1.png');
        assert.equal(title.white,'rgb(255, 255, 255)');assert.equal(title.covered,'1');
        assert.equal(title.inside,true);assert.ok(title.center<1);assert.equal(title.overflow,false);
        await shot(`intro-${width}-${theme}-title.png`);
      }
      await finish();
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
