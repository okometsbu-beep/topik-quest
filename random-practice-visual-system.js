// MALBIT Random Practice visual system · one final owner for TOPIK I/II practice surfaces.
(function(){
'use strict';
if(document.getElementById('malbitRandomPracticeVisualSystem'))return;
const style=document.createElement('style');
style.id='malbitRandomPracticeVisualSystem';
style.textContent=`
body.tq-random-practice-active{--random-canvas:#edf3fa;--random-surface:var(--ui-surface);--random-surface-soft:var(--ui-surface-soft);--random-border:var(--ui-border);--random-ink:var(--ui-ink);--random-muted:var(--ui-muted);--random-accent:var(--ui-accent);--random-accent-soft:#e9eeff;--random-success:#176f58;--random-success-soft:#e7f7f0;--random-error:#963c50;--random-error-soft:#fff0f3;padding-bottom:0;background:var(--random-canvas);color:var(--random-ink)}
body.tq-random-practice-active .app{max-width:480px;background:var(--random-canvas)}
body.tq-random-practice-active .top,body.tq-random-practice-active .bottom{display:none}
body.tq-random-practice-active .screen{max-width:480px;min-height:100vh;margin:auto;padding:calc(var(--ui-space-3) + env(safe-area-inset-top)) var(--ui-page-pad) calc(var(--ui-space-6) + env(safe-area-inset-bottom))}
body.tq-random-practice-active .tqRandomPracticeScreen,body.tq-random-practice-active .tqRandomPracticeScreen *{box-sizing:border-box;min-width:0}
body.tq-random-practice-active .tqRandomPracticeScreen button:not(:disabled){min-height:var(--ui-touch)}
body.tq-random-practice-active .randomPracticeTop,body.tq-random-practice-active .t1RandomTop{display:grid;grid-template-columns:var(--ui-touch) minmax(0,1fr);align-items:center;gap:var(--ui-space-2);margin:0 0 var(--ui-space-3)}
body.tq-random-practice-active .randomPracticeTop>button,body.tq-random-practice-active .t1RandomTop>button{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface);color:var(--random-ink);font-size:23px;box-shadow:0 5px 14px rgba(35,55,82,.08)}
body.tq-random-practice-active .randomPracticeTop b{color:var(--random-ink);font-size:17px;line-height:1.25}
body.tq-random-practice-active .randomPracticeTop small{margin-top:3px;color:var(--random-muted);font-size:10px;line-height:1.45;overflow-wrap:anywhere}
body.tq-random-practice-active .t1RandomTop .t1hud{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:0;overflow:visible}
body.tq-random-practice-active .t1RandomTop .t1hud span,body.tq-random-practice-active .hud span{display:flex;align-items:center;justify-content:center;min-height:var(--ui-touch);border:1px solid var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface);color:#405570;padding:7px 8px;font-size:10px;line-height:1.25;text-align:center;white-space:normal;box-shadow:0 4px 12px rgba(35,55,82,.06)}
body.tq-random-practice-active .infinityBar{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:var(--ui-space-2)}
body.tq-random-practice-active .infinityBar div{min-height:58px;border:1px solid var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface);color:var(--random-ink);padding:8px 4px;box-shadow:0 4px 12px rgba(35,55,82,.06)}
body.tq-random-practice-active .infinityBar b{font-size:15px}
body.tq-random-practice-active .infinityBar small{color:var(--random-muted);font-size:10px;line-height:1.2}
body.tq-random-practice-active .hud{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-bottom:var(--ui-space-2);overflow:visible}
body.tq-random-practice-active .hud span:last-child{font-variant-numeric:tabular-nums}
body.tq-random-practice-active .countdown{height:7px;margin:0 0 var(--ui-space-3);background:#d9e2ee}
body.tq-random-practice-active .countdown i{background:linear-gradient(90deg,#5268e8,#7b64e8)}
body.tq-random-practice-active .card{width:100%;max-width:100%;border:1px solid var(--random-border);border-radius:var(--ui-radius-card);background:var(--random-surface);color:var(--random-ink);padding:var(--ui-space-4);box-shadow:0 12px 28px rgba(35,55,82,.12);overflow:hidden}
body.tq-random-practice-active .instruction{margin:0 0 var(--ui-space-3);border:1px solid #cdd9ea;border-radius:var(--ui-radius-control);background:var(--random-surface-soft);color:#405672;padding:10px 11px;font-size:11px;line-height:1.55}
body.tq-random-practice-active .qmeta{gap:var(--ui-space-2);margin-bottom:var(--ui-space-3)}
body.tq-random-practice-active .qno{width:auto;min-width:var(--ui-touch);height:var(--ui-touch);max-width:150px;border-radius:var(--ui-radius-control);background:var(--random-accent-soft);color:#3c58c8;padding:0 9px;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
body.tq-random-practice-active .cat{display:inline-flex;align-items:center;min-height:32px;border:1px solid #cdd9ea;border-radius:999px;background:var(--random-surface-soft);color:#53677f;padding:6px 9px;font-size:10px}
body.tq-random-practice-active .stem{max-width:100%;margin:0 0 var(--ui-space-4);color:var(--random-ink);font-size:16px;line-height:1.65;overflow-wrap:anywhere;word-break:keep-all}
body.tq-random-practice-active .choices{display:grid;gap:var(--ui-space-2)}
body.tq-random-practice-active .choice{display:grid;grid-template-columns:32px minmax(0,1fr);align-items:center;gap:10px;min-height:52px;border:1px solid var(--random-border);border-radius:var(--ui-radius-control);background:var(--random-surface);color:#26374f;padding:9px 11px;font-size:13px;line-height:1.5;box-shadow:0 3px 9px rgba(35,55,82,.05)}
body.tq-random-practice-active .choice .n{width:32px;height:32px;flex-basis:32px;border-radius:10px;background:var(--random-surface-soft);color:#566a84;font-size:10px}
body.tq-random-practice-active .choice.selected{border-color:#657ce5;background:#eef2ff;color:#273e91;box-shadow:0 0 0 2px rgba(82,104,232,.12)}
body.tq-random-practice-active .choice.selected .n{background:#5268e8;color:#fff}
body.tq-random-practice-active .choice.correct{border-color:#76bda6;background:var(--random-success-soft);color:var(--random-success)}
body.tq-random-practice-active .choice.correct .n{background:#238a6c;color:#fff}
body.tq-random-practice-active .choice.wrong{border-color:#db9baa;background:var(--random-error-soft);color:var(--random-error)}
body.tq-random-practice-active .choice.wrong .n{background:#b65369;color:#fff}
body.tq-random-practice-active .doubleTapHint{margin-top:var(--ui-space-3);border-color:#b9c9dc;background:var(--random-surface-soft);color:var(--random-muted);font-size:10px;line-height:1.5}
body.tq-random-practice-active .resultStrip{margin-top:var(--ui-space-3);border:1px solid #82c4ae;border-radius:var(--ui-radius-control);background:var(--random-success-soft);color:var(--random-success);padding:var(--ui-space-3);font-size:12px;line-height:1.5}
body.tq-random-practice-active .resultStrip.bad{border-color:#dfa5b2;background:var(--random-error-soft);color:var(--random-error)}
body.tq-random-practice-active .t1TutorCoach{gap:var(--ui-space-2);margin-top:var(--ui-space-3)}
body.tq-random-practice-active .t1TutorCoach>div{border-top-color:color-mix(in srgb,currentColor 24%,transparent);padding-top:var(--ui-space-2)}
body.tq-random-practice-active .t1TutorCoach small{font-size:10px;line-height:1.35}
body.tq-random-practice-active .t1TutorCoach p{font-size:12px;line-height:1.65}
body.tq-random-practice-active .malbitQuestionTranslation{margin-top:var(--ui-space-3);border-color:#cbd9ea;border-radius:var(--ui-radius-control);background:#f1f6fc;color:var(--random-ink);padding:var(--ui-space-3)}
body.tq-random-practice-active .malbitQuestionTranslation small{color:var(--random-muted);font-size:10px;line-height:1.4}
body.tq-random-practice-active .malbitQuestionTranslation p{color:#334960;font-size:12px;line-height:1.7}
body.tq-random-practice-active .malbitExplanationToggle{min-height:48px;margin-top:var(--ui-space-2);border-color:#b9c9dc;border-radius:var(--ui-radius-control);background:#e9eff9;color:#304c71;font-size:11px;box-shadow:none}
body.tq-random-practice-active .malbitExplanationBody,body.tq-random-practice-active .tqInlineExplanation{border-color:#cbd9ea;border-radius:var(--ui-radius-control);background:#f5f8fc;color:var(--random-ink)}
body.tq-random-practice-active .tqInlineAnswer{background:#e8effa}
body.tq-random-practice-active .tqInlineAnswer small,body.tq-random-practice-active .tqInlineExplanation h4{font-size:10px}
body.tq-random-practice-active .tqInlineExplanation p,body.tq-random-practice-active .malbitExplanationBody{font-size:12px;line-height:1.7;white-space:pre-line;overflow-wrap:anywhere}
body.tq-random-practice-active .attack,body.tq-random-practice-active .randomWriteAction,body.tq-random-practice-active .card>.primary,body.tq-random-practice-active .card>.closeBtn{min-height:50px;border-radius:var(--ui-radius-control);font-size:13px}
body.tq-random-practice-active .card>.closeBtn{border:1px solid var(--random-border);background:var(--random-surface-soft);color:#405570}
body.tq-random-practice-active .primary.alt,body.tq-random-practice-active .dangerBtn{min-height:var(--ui-touch);border:1px solid #d7b5bd;border-radius:var(--ui-radius-control);background:#fff4f5;color:#893e50;box-shadow:none;font-size:11px}
body.tq-random-practice-active .write{border-color:var(--random-border);border-radius:var(--ui-radius-control);background:#fff;color:var(--random-ink);font-size:14px}
body.tq-random-practice-active .counter{color:var(--random-muted);font-size:10px}
body.tq-random-practice-active .answerBox{border:1px solid #cbd9ea;background:#edf3fb;color:var(--random-ink)}
/* Fixed compatibility bridge for older random-feedback declarations. */
body.tq-random-practice-active .malbitQuestionTranslation small{font-size:10px!important}
body.tq-random-practice-active .malbitQuestionTranslation p{color:#334960!important;font-size:12px!important;line-height:1.7!important}
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
sync();
})();
