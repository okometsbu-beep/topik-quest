// Haruman is a presentation companion, never a grading or progress authority.
(function(){
'use strict';
const emotions=Object.freeze(['welcome','thinking','correct','retry','celebrate','encourage','journey','rest']);
const poses=Object.freeze(['home-study','shorts-quiz','travel-journey','vocab-reading','review-thinking','lesson-welcome','progress-proud','answer-correct','answer-retry','lesson-complete','review-empty','audio-listening']);
const aliases=Object.freeze({welcome:'lesson-welcome',thinking:'review-thinking',correct:'answer-correct',retry:'answer-retry',celebrate:'lesson-complete',encourage:'progress-proud',journey:'travel-journey',rest:'review-empty'});
function markup(emotion,size='small'){
 if(!emotions.includes(emotion)&&!poses.includes(emotion))emotion='welcome';
 const pose=aliases[emotion]||emotion,width=pose==='home-study'?480:320;
 size=['small','hero','mark'].includes(size)?size:'small';
 return `<span class="harumanStage harumanStage--${size}" data-haruman="${emotion}" data-haruman-pose="${pose}" aria-hidden="true"><img src="assets/art/haruman/${pose}-v2.webp" width="${width}" height="320" alt="" draggable="false" decoding="async"></span>`;
}
function mount(target,emotion,size='small'){
 if(!target||target.querySelector('[data-haruman]'))return;
 target.insertAdjacentHTML('afterbegin',markup(emotion,size));
}
function decorate(sc,view){
 if(!sc)return;
 if(view==='home'){
  const art=sc.querySelector('.harumalLessonArt');
  if(art){art.classList.add('harumanHomeArt');if(!art.querySelector('[data-haruman]'))art.innerHTML=markup('home-study','hero')}
  mount(sc.querySelector('.harumalShortsLaunch'),'shorts-quiz');
  mount(sc.querySelector('.tqTravelFeature'),'travel-journey');
 }else if(view==='learn')mount(sc.querySelector('.harumalPageHead'),'lesson-welcome');
 else if(view==='more'||view==='stats')mount(sc.querySelector('.harumalPageHead'),'progress-proud');
 else if(view==='vocab')mount(sc.querySelector('.tqVocabTitle'),'vocab-reading');
 else if(view==='travel')mount(sc.querySelector('.advLead'),'journey');
 else if(view==='travelAdventureReview')mount(sc.querySelector('.advLead'),'thinking');
 else if(view==='beginner'){
  const hero=sc.querySelector('.v33BeginnerHero');
  if(hero&&!hero.querySelector('[data-haruman]')){
   const letter=hero.querySelector(':scope>span');
   if(letter)letter.remove();
   mount(hero,'lesson-welcome');
  }
  mount(sc.querySelector('.bgLessonHero'),'audio-listening');
 }else if(view==='beginnerGrammar')mount(sc.querySelector('.bgLessonHero'),'audio-listening');
 if(['speaking','vocabTest','vocabEditor','realSetup','t1setup','travelRecall'].includes(view)){
  mount(sc.querySelector('.harumalPageHead,.malbitPageTitle,.sectionTitle,.speakHead'),view==='speaking'?'audio-listening':view==='vocabEditor'?'vocab-reading':'review-thinking','mark');
 }
 if(view==='review'){
  mount(sc.querySelector('.tqReviewHero>div'),'thinking');
  mount(sc.querySelector('.tqReviewEmpty'),'review-empty','hero');
 }
 for(const node of sc.querySelectorAll('.shortsFeedback,.resultStrip,.advFeedback')){
  const retry=node.classList.contains('bad')||node.classList.contains('retry');
  mount(node,retry?'retry':'correct','mark');
 }
 mount(sc.querySelector('.advFinish'),'celebrate','hero');
}
window.HARUMAN=Object.freeze({emotions,poses,markup,decorate});
})();
