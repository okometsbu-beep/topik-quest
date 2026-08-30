// MALBIT Random Practice visual system · one final owner for TOPIK I/II practice surfaces.
(function(){
'use strict';
if(document.getElementById('malbitRandomPracticeVisualSystem'))return;
const style=document.createElement('style');
style.id='malbitRandomPracticeVisualSystem';
style.textContent=`
body.tq-random-practice-active{--random-canvas:var(--ui-canvas);--random-surface:var(--ui-surface);--random-surface-raised:var(--ui-surface-raised);--random-surface-soft:var(--ui-surface-soft);--random-border:var(--ui-border);--random-ink:var(--ui-ink);--random-muted:var(--ui-muted);--random-accent:var(--ui-accent);--random-accent-soft:var(--ui-accent-soft);--random-success:var(--ui-success);--random-success-soft:var(--ui-success-soft);--random-error:var(--ui-error);--random-error-soft:var(--ui-error-soft);--random-selected-ink:#dbe6ff;--random-shadow:var(--ui-shadow);--random-shadow-strong:var(--ui-shadow-strong);padding-bottom:0;background:var(--random-canvas);color:var(--random-ink)}
html[data-theme="light"] body.tq-random-practice-active{--random-selected-ink:#273e91}
body.tq-random-practice-active .app{max-width:480px;background:var(--random-canvas)}
body.tq-random-practice-active .top,body.tq-random-practice-active .bottom{display:none}
body.tq-random-practice-active .screen{max-width:480px;min-height:100vh;margin:auto;padding:calc(var(--ui-space-3) + env(safe-area-inset-top)) var(--ui-page-pad) calc(var(--ui-space-6) + env(safe-area-inset-bottom))}
body.tq-random-practice-active .tqRandomPracticeScreen,body.tq-random-practice-active .tqRandomPracticeScreen *{box-sizing:border-box;min-width:0}
body.tq-random-practice-active .tqRandomPracticeScreen button:not(:disabled){min-height:var(--ui-touch)}
body.tq-random-practice-active .randomPracticeTop,body.tq-random-practice-active .t1RandomTop{display:grid;grid-template-columns:var(--ui-touch) minmax(0,1fr);align-items:center;gap:var(--ui-space-2);margin:0 0 var(--ui-space-3)}
body.tq-random-practice-active .randomPracticeTop>button,body.tq-random-practice-active .t1RandomTop>button{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface);color:var(--random-ink);font-size:23px;box-shadow:0 5px 14px var(--random-shadow)}
body.tq-random-practice-active .randomPracticeTop b{color:var(--random-ink);font-size:17px;line-height:1.25}
body.tq-random-practice-active .randomPracticeTop small{margin-top:3px;color:var(--random-muted);font-size:10px;line-height:1.45;overflow-wrap:anywhere}
body.tq-random-practice-active .t1RandomTop .t1hud{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:0;overflow:visible}
body.tq-random-practice-active .t1RandomTop .t1hud span,body.tq-random-practice-active .hud span{display:flex;align-items:center;justify-content:center;min-height:var(--ui-touch);border:1px solid var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface);color:var(--random-muted);padding:7px 8px;font-size:10px;line-height:1.25;text-align:center;white-space:normal;box-shadow:0 4px 12px var(--random-shadow)}
body.tq-random-practice-active .infinityBar{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:var(--ui-space-2)}
body.tq-random-practice-active .infinityBar div{min-height:58px;border:1px solid var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface);color:var(--random-ink);padding:8px 4px;box-shadow:0 4px 12px var(--random-shadow)}
body.tq-random-practice-active .infinityBar b{font-size:15px}
body.tq-random-practice-active .infinityBar small{color:var(--random-muted);font-size:10px;line-height:1.2}
body.tq-random-practice-active .hud{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-bottom:var(--ui-space-2);overflow:visible}
body.tq-random-practice-active .hud span:last-child{font-variant-numeric:tabular-nums}
body.tq-random-practice-active .countdown{height:7px;margin:0 0 var(--ui-space-3);background:var(--random-surface-soft)}
body.tq-random-practice-active .countdown i{background:linear-gradient(90deg,#5268e8,#7b64e8)}
body.tq-random-practice-active .card{width:100%;max-width:100%;border:1px solid var(--random-border);border-radius:var(--ui-radius-card);background:var(--random-surface);color:var(--random-ink);padding:var(--ui-space-4);box-shadow:0 12px 28px var(--random-shadow-strong);overflow:hidden}
body.tq-random-practice-active .instruction{margin:0 0 var(--ui-space-3);border:1px solid var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface-soft);color:var(--random-muted);padding:10px 11px;font-size:11px;line-height:1.55}
body.tq-random-practice-active .qmeta{gap:var(--ui-space-2);margin-bottom:var(--ui-space-3)}
body.tq-random-practice-active .qno{width:auto;min-width:var(--ui-touch);height:var(--ui-touch);max-width:150px;border-radius:var(--ui-radius-control);background:var(--random-accent-soft);color:var(--random-accent);padding:0 9px;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
body.tq-random-practice-active .cat{display:inline-flex;align-items:center;min-height:32px;border:1px solid var(--random-border);border-radius:999px;background:var(--random-surface-soft);color:var(--random-muted);padding:6px 9px;font-size:10px}
body.tq-random-practice-active .stem{max-width:100%;margin:0 0 var(--ui-space-4);color:var(--random-ink);font-size:16px;line-height:1.65;overflow-wrap:anywhere;word-break:keep-all}
body.tq-random-practice-active .choices{display:grid;gap:var(--ui-space-2)}
body.tq-random-practice-active .choice{display:grid;grid-template-columns:32px minmax(0,1fr);align-items:center;gap:10px;min-height:52px;border:1px solid var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface-raised);color:var(--random-ink);padding:9px 11px;font-size:13px;line-height:1.5;box-shadow:0 3px 9px var(--random-shadow)}
body.tq-random-practice-active .choice .n{width:32px;height:32px;flex-basis:32px;border-radius:10px;background:var(--random-surface-soft);color:var(--random-muted);font-size:10px}
body.tq-random-practice-active .choice.selected{border-color:#657ce5;background:var(--random-accent-soft);color:var(--random-selected-ink);box-shadow:0 0 0 2px rgba(82,104,232,.18)}
body.tq-random-practice-active .choice.selected .n{background:#5268e8;color:#fff}
body.tq-random-practice-active .choice.correct{border-color:color-mix(in srgb,var(--random-success) 60%,var(--random-border));background:var(--random-success-soft);color:var(--random-success)}
body.tq-random-practice-active .choice.correct .n{background:#238a6c;color:#fff}
body.tq-random-practice-active .choice.wrong{border-color:color-mix(in srgb,var(--random-error) 58%,var(--random-border));background:var(--random-error-soft);color:var(--random-error)}
body.tq-random-practice-active .choice.wrong .n{background:#b65369;color:#fff}
body.tq-random-practice-active .doubleTapHint{margin-top:var(--ui-space-3);border-color:#b9c9dc;background:var(--random-surface-soft);color:var(--random-muted);font-size:10px;line-height:1.5}
body.tq-random-practice-active .resultStrip{margin-top:var(--ui-space-3);border:1px solid color-mix(in srgb,var(--random-success) 58%,var(--random-border));border-radius:var(--ui-radius-control);background:var(--random-success-soft);color:var(--random-success);padding:var(--ui-space-3);font-size:12px;line-height:1.5}
body.tq-random-practice-active .resultStrip.bad{border-color:color-mix(in srgb,var(--random-error) 58%,var(--random-border));background:var(--random-error-soft);color:var(--random-error)}
body.tq-random-practice-active .t1TutorCoach{gap:var(--ui-space-2);margin-top:var(--ui-space-3)}
body.tq-random-practice-active .t1TutorCoach>div{border-top-color:color-mix(in srgb,currentColor 24%,transparent);padding-top:var(--ui-space-2)}
body.tq-random-practice-active .t1TutorCoach small{font-size:10px;line-height:1.35}
body.tq-random-practice-active .t1TutorCoach p{font-size:12px;line-height:1.65}
body.tq-random-practice-active .malbitQuestionTranslation{margin-top:var(--ui-space-3);border-color:var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface-raised);color:var(--random-ink);padding:var(--ui-space-3)}
body.tq-random-practice-active .malbitQuestionTranslation small{color:var(--random-muted);font-size:10px;line-height:1.4}
body.tq-random-practice-active .malbitQuestionTranslation p{color:var(--random-ink);font-size:12px;line-height:1.7}
body.tq-random-practice-active .malbitExplanationToggle{min-height:48px;margin-top:var(--ui-space-2);border-color:var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface-soft);color:var(--random-ink);font-size:11px;box-shadow:none}
body.tq-random-practice-active .malbitExplanationBody,body.tq-random-practice-active .tqInlineExplanation{border-color:var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface-raised);color:var(--random-ink)}
body.tq-random-practice-active .tqInlineAnswer{background:var(--random-surface-soft)}
body.tq-random-practice-active .tqInlineAnswer small,body.tq-random-practice-active .tqInlineExplanation h4{font-size:10px}
body.tq-random-practice-active .tqInlineExplanation p,body.tq-random-practice-active .malbitExplanationBody{font-size:12px;line-height:1.7;white-space:pre-line;overflow-wrap:anywhere}
body.tq-random-practice-active .attack,body.tq-random-practice-active .randomWriteAction,body.tq-random-practice-active .card>.primary,body.tq-random-practice-active .card>.closeBtn{min-height:50px;border-radius:var(--ui-radius-control);font-size:13px}
body.tq-random-practice-active .card>.closeBtn{border:1px solid var(--random-border);background:var(--random-surface-soft);color:var(--random-ink)}
body.tq-random-practice-active .primary.alt,body.tq-random-practice-active .dangerBtn{min-height:var(--ui-touch);border:1px solid color-mix(in srgb,var(--random-error) 45%,var(--random-border));border-radius:var(--ui-radius-control);background:var(--random-error-soft);color:var(--random-error);box-shadow:none;font-size:11px}
body.tq-random-practice-active .write{border-color:var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface-raised);color:var(--random-ink);font-size:14px}
body.tq-random-practice-active .counter{color:var(--random-muted);font-size:10px}
body.tq-random-practice-active .answerBox{border:1px solid var(--random-border);background:var(--random-surface-soft);color:var(--random-ink)}
/* Fixed compatibility bridge for older random-feedback declarations. */
body.tq-random-practice-active .malbitQuestionTranslation small{font-size:10px!important}
body.tq-random-practice-active .malbitQuestionTranslation p{color:var(--random-ink)!important;font-size:12px!important;line-height:1.7!important}
body.tq-random-practice-active .malbitRandomExplanation>.tqInlineExplanation,body.tq-random-practice-active .malbitExplanationBody{margin-top:var(--ui-space-2)!important}
body.tq-random-practice-active .tqInlineExplanation p{color:var(--random-ink)!important;font-size:12px!important;line-height:1.7!important}
@media(max-width:380px){body.tq-random-practice-active{--ui-page-pad:12px}body.tq-random-practice-active .card{padding:var(--ui-space-3)}body.tq-random-practice-active .randomPracticeTop b{font-size:15px}body.tq-random-practice-active .infinityBar{gap:4px}body.tq-random-practice-active .infinityBar div{padding:8px 2px}body.tq-random-practice-active .stem{font-size:15px}body.tq-random-practice-active .choice{padding:9px}}
`;
document.head.appendChild(style);

function storedSession(){try{return JSON.parse(localStorage.getItem('topikQuestTopik1Session')||'null')}catch(error){return null}}
function sync(){
  const view=typeof S!=='undefined'?S?.view:'';
  const random=view==='infinity'||(view==='t1quiz'&&storedSession()?.mode==='random');
  document.body.classList.toggle('tq-random-practice-active',random);
  const screen=document.getElementById('screen');if(screen)screen.classList.toggle('tqRandomPracticeScreen',random);
}
if(typeof window.render==='function'){
  const baseRender=window.render;
  window.render=function(){const out=baseRender.apply(this,arguments);sync();requestAnimationFrame(sync);return out};
}
new MutationObserver(sync).observe(document.body,{childList:true,subtree:true});
sync();
})();
