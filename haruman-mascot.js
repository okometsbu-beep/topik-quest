// Haruman is a presentation companion, never a grading or progress authority.
(function(){
'use strict';
const emotions=Object.freeze(['welcome','thinking','correct','retry','celebrate','encourage','journey','rest']);
function markup(emotion,size='small'){
 if(!emotions.includes(emotion))emotion='welcome';
 size=['small','hero','mark'].includes(size)?size:'small';
 return `<span class="harumanStage harumanStage--${size}" data-haruman="${emotion}" aria-hidden="true"><img src="assets/art/haruman/${emotion}-v1.webp" width="320" height="320" alt="" draggable="false" decoding="async"></span>`;
}
function mount(target,emotion,size='small'){
 if(!target||target.querySelector('[data-haruman]'))return;
 target.insertAdjacentHTML('afterbegin',markup(emotion,size));
}
function decorate(sc,view){
 if(!sc)return;
 if(view==='home'){
  const art=sc.querySelector('.harumalLessonArt');
  if(art){art.classList.add('harumanHomeArt');if(!art.querySelector('[data-haruman]'))art.innerHTML=markup('welcome','small')}
 }else if(view==='learn')mount(sc.querySelector('.harumalPageHead'),'encourage');
 else if(view==='more')mount(sc.querySelector('.harumalPageHead'),'rest');
 else if(view==='travel')mount(sc.querySelector('.advLead'),'journey');
 else if(view==='travelAdventureReview')mount(sc.querySelector('.advLead'),'thinking');
 else if(view==='beginner')mount(sc.querySelector('.bgLessonHero,.v33BeginnerHero'),'encourage');
 if(view==='review')mount(sc.querySelector('.tqReviewHero>div'),'thinking');
 for(const node of sc.querySelectorAll('.shortsFeedback,.resultStrip,.advFeedback')){
  const retry=node.classList.contains('bad')||node.classList.contains('retry');
  mount(node,retry?'retry':'correct','mark');
 }
 mount(sc.querySelector('.advFinish'),'celebrate','hero');
}
window.HARUMAN=Object.freeze({emotions,markup,decorate});
})();
