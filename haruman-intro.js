// Boot runs underneath; a healthy intro stays visible until the video ends.
(function(){
  'use strict';
  const panel=document.querySelector('.harumanIntro');
  const video=document.getElementById('harumanIntroVideo');
  if(!panel||!video)return;
  const root=document.documentElement;
  let closed=false, fading=false, alphaChecked=false, sourceId=0;
  let stallTimer, fadeTimer, lastTime=0;
  // Recovery is based on lack of progress, never elapsed playback duration.
  const watchProgress=()=>{
    clearTimeout(stallTimer);
    if(!closed&&!fading&&!document.hidden)stallTimer=setTimeout(()=>finish(true),15000);
  };
  const dispose=()=>{
    if(closed)return;
    closed=true;clearTimeout(stallTimer);clearTimeout(fadeTimer);
    video.pause();video.removeAttribute('src');video.load();panel.remove();
    root.classList.remove('haruman-intro-active');
    document.removeEventListener('visibilitychange',onVisibility);
  };
  const finish=(immediate=false)=>{
    if(closed||fading)return;
    fading=true;clearTimeout(stallTimer);video.pause();
    panel.style.pointerEvents='none';
    if(immediate){dispose();return}
    panel.classList.add('harumanIntroLeaving');fadeTimer=setTimeout(dispose,220);
  };
  const onVisibility=()=>{
    if(closed||fading)return;
    if(document.hidden){sourceId++;clearTimeout(stallTimer);video.pause()}
    else{watchProgress();play()}
  };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.connection?.saveData){dispose();return}
  root.classList.add('haruman-intro-active');
  document.addEventListener('visibilitychange',onVisibility);
  video.muted=true;video.defaultMuted=true;video.playsInline=true;
  const play=()=>{
    if(document.hidden||closed||fading)return;
    const requestSource=++sourceId;
    const failed=()=>{if(requestSource===sourceId&&!document.hidden)finish(true)};
    try{const p=video.play();if(p?.catch)p.catch(failed)}catch(_){failed()}
  };
  const useMp4=()=>{
    if(closed||fading)return;
    sourceId++;lastTime=0;watchProgress();alphaChecked=true;video.style.opacity='0';
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
  video.addEventListener('timeupdate',()=>{
    if(video.currentTime>lastTime){lastTime=video.currentTime;watchProgress()}
  });
  watchProgress();
  if(video.canPlayType('video/webm; codecs="vp9"')){
    video.src='assets/video/haruman-intro-v1.webm';play();
  }else{useMp4()}
})();
