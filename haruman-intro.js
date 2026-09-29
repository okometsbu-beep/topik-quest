// Optional decoration: app boot never waits for media or storage.
(function(){
  'use strict';
  const panel=document.querySelector('.harumanIntro');
  const video=document.getElementById('harumanIntroVideo');
  if(!panel||!video)return;
  const root=document.documentElement, key='harumalIntroSeenV1';
  let closed=false, fading=false, alphaChecked=false;
  const timers=[];
  const later=(fn,ms)=>{const id=setTimeout(fn,ms);timers.push(id);return id};
  const dispose=()=>{
    if(closed)return;
    closed=true;timers.forEach(clearTimeout);
    video.pause();video.removeAttribute('src');video.load();panel.remove();
    root.classList.remove('haruman-intro-active');
    document.removeEventListener('visibilitychange',onVisibility);
  };
  const finish=(immediate=false)=>{
    if(closed||fading)return;
    fading=true;timers.forEach(clearTimeout);video.pause();
    panel.style.pointerEvents='none';
    if(immediate){dispose();return}
    panel.classList.add('harumanIntroLeaving');later(dispose,220);
  };
  const onVisibility=()=>{if(document.hidden)finish(true)};
  window.HARUMAN_INTRO={finish};
  let recent=false;
  try{const last=Number(sessionStorage.getItem(key));recent=last>0&&Date.now()-last<60000;sessionStorage.setItem(key,String(Date.now()))}catch(_){}
  if(recent||matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.connection?.saveData){dispose();return}
  root.classList.add('haruman-intro-active');
  panel.addEventListener('click',()=>finish());
  panel.addEventListener('keydown',event=>{if(event.key==='Escape')finish()});
  document.addEventListener('visibilitychange',onVisibility);
  video.muted=true;video.defaultMuted=true;video.playsInline=true;
  const play=()=>{try{const p=video.play();if(p?.catch)p.catch(()=>finish(true))}catch(_){finish(true)}};
  const useMp4=()=>{
    if(closed||fading)return;
    alphaChecked=true;video.style.opacity='0';
    video.src='assets/video/haruman-intro-v1.mp4';play();
  };
  // canPlayType alone cannot establish that the decoder preserves alpha.
  video.addEventListener('loadeddata',()=>{
    if(closed||fading)return;
    if(!alphaChecked){
      alphaChecked=true;
      try{
        const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
        const ctx=canvas.getContext('2d',{willReadFrequently:true});
        ctx.drawImage(video,0,0,1,1,0,0,1,1);
        if(ctx.getImageData(0,0,1,1).data[3]>16){useMp4();return}
      }catch(_){useMp4();return}
    }
    video.style.opacity='1';
  });
  video.addEventListener('error',()=>finish(true));
  video.addEventListener('ended',()=>finish());
  const loadTimer=later(()=>finish(true),800);
  video.addEventListener('playing',()=>clearTimeout(loadTimer),{once:true});
  // Covers stalled playback and autoplay implementations that never settle.
  later(()=>finish(),3380);
  if(video.canPlayType('video/webm; codecs="vp9"')){
    video.src='assets/video/haruman-intro-v1.webm';play();
  }else{useMp4()}
})();
