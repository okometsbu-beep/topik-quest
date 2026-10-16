// Boot runs underneath; a healthy intro stays visible until the video ends.
(function(){
  'use strict';
  const panel=document.querySelector('.harumanIntro');
  const video=document.getElementById('harumanIntroVideo');
  if(!panel||!video)return;
  const root=document.documentElement;
  const title=document.getElementById('harumanIntroTitle');
  let closed=false, fading=false, alphaChecked=false, sourceId=0;
  let stallTimer, stageTimer, stageNext, stageDue=0, stageRemaining=0, lastTime=0;
  // Optional sound never owns the video clock or the presentation timers.
  let soundPhase='character', soundSerial=0, soundCurrent=null, videoSoundPlaying=false;
  let titleSoundElapsed=0, titleSoundStarted=0;
  const sounds={};
  const stopSound=()=>{
    soundSerial++;soundCurrent=null;
    for(const item of Object.values(sounds))try{item.media.pause()}catch(_){}
  };
  const soundOffset=()=>soundPhase==='character'?Number(video.currentTime)||0:
    (titleSoundElapsed+(titleSoundStarted?performance.now()-titleSoundStarted:0))/1000;
  const seekSound=(media,offset)=>{
    // Avoid repeated seeks for ordinary frame-sized clock differences.
    if(Math.abs((Number(media.currentTime)||0)-offset)>.05)media.currentTime=Math.max(0,offset);
  };
  const syncSound=()=>{
    if(closed||document.hidden||!['character','title'].includes(soundPhase))return;
    if(soundPhase==='character'&&(!videoSoundPlaying||fading||video.paused||video.ended))return;
    const item=sounds[soundPhase];
    if(!item||item.blocked||item.media.readyState<2)return;
    const media=item.media,offset=soundOffset(),duration=Number(media.duration);
    if(!Number.isFinite(duration)||offset>=duration)return;
    if(soundCurrent?.media===media)return;
    stopSound();
    const serial=++soundSerial;
    soundCurrent={media,serial};
    try{
      seekSound(media,offset);
      media.playbackRate=soundPhase==='character'?Number(video.playbackRate)||1:1;
      const failed=()=>{if(soundCurrent?.serial===serial){item.blocked=true;stopSound()}};
      const pending=media.play();
      if(pending?.then)pending.then(()=>{
        // A late permission/load result must never play over Home or another phase.
        if(closed||document.hidden||soundCurrent?.media!==media)try{media.pause()}catch(_){}
        else if(soundCurrent.serial===serial){
          const current=soundOffset();
          if(current>=Number(media.duration))stopSound();
          else try{seekSound(media,current)}catch(_){stopSound()}
        }
      },failed);
    }catch(_){item.blocked=true;stopSound()}
  };
  const retrySound=()=>{
    if(closed||document.hidden)return;
    for(const item of Object.values(sounds))item.blocked=false;
    syncSound();
  };
  const prepareSound=()=>{
    if(typeof Audio!=='function')return;
    for(const kind of ['character','title'])try{
      const media=new Audio();sounds[kind]={media,blocked:false};media.preload='auto';
      media.addEventListener('canplay',syncSound);
      media.addEventListener('waiting',()=>{if(soundCurrent?.media===media)stopSound()});
      media.addEventListener('error',()=>{sounds[kind].blocked=true;if(soundCurrent?.media===media)stopSound()});
      media.addEventListener('ended',()=>{if(soundCurrent?.media===media)soundCurrent=null});
      media.src='assets/audio/haruman-intro-v3-'+kind+'.mp3';
    }catch(_){}
    // Existing user interaction may unlock sound; no extra control or launch gate.
    document.addEventListener('click',retrySound);
  };
  // Pause both the stage clock and CSS animations while the app is hidden.
  const scheduleStage=(next,delay)=>{
    clearTimeout(stageTimer);stageNext=next;stageRemaining=delay;
    if(document.hidden)return;
    stageDue=performance.now()+delay;
    stageTimer=setTimeout(()=>{stageNext=null;next()},delay);
  };
  // Recovery is based on lack of progress, never elapsed playback duration.
  const watchProgress=()=>{
    clearTimeout(stallTimer);
    if(!closed&&!fading&&!document.hidden)stallTimer=setTimeout(()=>finish(true),15000);
  };
  const dispose=()=>{
    if(closed)return;
    closed=true;clearTimeout(stallTimer);clearTimeout(stageTimer);stageNext=null;
    stopSound();
    for(const item of Object.values(sounds))try{item.media.removeAttribute('src');item.media.load()}catch(_){}
    video.pause();video.removeAttribute('src');video.load();panel.remove();
    root.classList.remove('haruman-intro-active');
    document.removeEventListener('visibilitychange',onVisibility);
    document.removeEventListener('click',retrySound);
  };
  const finish=(immediate=false)=>{
    if(closed||fading)return;
    fading=true;sourceId++;clearTimeout(stallTimer);video.pause();
    soundPhase='whiteout';videoSoundPlaying=false;stopSound();
    if(immediate){dispose();return}
    panel.classList.add('harumanIntroWhiteout');
    // The completed 2.8s video is followed by a 1.5s presentation, never a cutoff.
    scheduleStage(()=>{
      panel.classList.add('harumanIntroShowingTitle');
      soundPhase='title';titleSoundElapsed=0;titleSoundStarted=performance.now();syncSound();
      scheduleStage(()=>{
        panel.classList.add('harumanIntroLeaving');
        scheduleStage(dispose,200);
      },1000);
    },300);
  };
  const onVisibility=()=>{
    if(closed)return;
    panel.classList.toggle('harumanIntroPaused',document.hidden);
    if(document.hidden){
      sourceId++;clearTimeout(stallTimer);video.pause();
      videoSoundPlaying=false;
      if(soundPhase==='title'&&titleSoundStarted){titleSoundElapsed+=performance.now()-titleSoundStarted;titleSoundStarted=0}
      stopSound();
      if(stageNext){stageRemaining=Math.max(0,stageDue-performance.now());clearTimeout(stageTimer)}
    }else if(fading){
      if(soundPhase==='title'){titleSoundStarted=performance.now();syncSound()}
      if(stageNext)scheduleStage(stageNext,stageRemaining);
    }else{watchProgress();play()}
  };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.connection?.saveData){dispose();return}
  root.classList.add('haruman-intro-active');
  document.addEventListener('visibilitychange',onVisibility);
  prepareSound();
  // Keep a readable wordmark if the optional image cannot load.
  const revealTitleImage=()=>{if(title?.naturalWidth)panel.classList.add('harumanIntroTitleReady')};
  title?.addEventListener('load',revealTitleImage);revealTitleImage();
  video.muted=true;video.defaultMuted=true;video.playsInline=true;
  const play=()=>{
    if(document.hidden||closed||fading)return;
    const requestSource=++sourceId;
    const failed=()=>{if(requestSource===sourceId&&!document.hidden)finish(true)};
    try{const p=video.play();if(p?.catch)p.catch(failed)}catch(_){failed()}
  };
  const useMp4=()=>{
    if(closed||fading)return;
    sourceId++;lastTime=0;videoSoundPlaying=false;stopSound();watchProgress();alphaChecked=true;video.style.opacity='0';
    video.src='assets/video/haruman-intro-v3.mp4';play();
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
  video.addEventListener('playing',()=>{videoSoundPlaying=true;syncSound()});
  video.addEventListener('pause',()=>{videoSoundPlaying=false;if(soundPhase==='character')stopSound()});
  video.addEventListener('waiting',()=>{videoSoundPlaying=false;stopSound()});
  video.addEventListener('seeking',()=>{videoSoundPlaying=false;stopSound()});
  video.addEventListener('seeked',syncSound);
  video.addEventListener('ratechange',()=>{stopSound();syncSound()});
  video.addEventListener('timeupdate',()=>{
    if(video.currentTime>lastTime){lastTime=video.currentTime;watchProgress()}
  });
  watchProgress();
  if(video.canPlayType('video/webm; codecs="vp9"')){
    video.src='assets/video/haruman-intro-v3.webm';play();
  }else{useMp4()}
})();
