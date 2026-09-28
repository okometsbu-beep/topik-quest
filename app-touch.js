// Suppress native selection/callouts while preserving app-owned vocabulary holds and typing.
(function(){
'use strict';
for(const type of ['contextmenu','selectstart','copy','cut','paste'])document.addEventListener(type,e=>e.preventDefault(),{capture:true});
let timer=null,start=null;
const cancel=()=>{clearTimeout(timer);timer=null;start=null};
document.addEventListener('touchstart',e=>{
 cancel();const field=e.target.closest?.('input:not([type]),input[type="text"],input[type="search"],textarea,[contenteditable="true"]');
 if(!field||e.touches.length!==1)return;
 start={x:e.touches[0].clientX,y:e.touches[0].clientY};
 // iOS input callouts can ignore user-select. End only a stationary long hold, not a tap.
 timer=setTimeout(()=>{field.blur();window.getSelection()?.removeAllRanges();cancel()},400);
},{passive:true});
document.addEventListener('touchmove',e=>{if(start&&e.touches[0]&&Math.hypot(e.touches[0].clientX-start.x,e.touches[0].clientY-start.y)>8)cancel()},{passive:true});
for(const type of ['touchend','touchcancel'])document.addEventListener(type,cancel,{passive:true});
})();
