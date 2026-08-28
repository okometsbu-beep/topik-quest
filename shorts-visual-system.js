// MALBIT Shorts visual system · one final owner for question, answer, and coaching cards.
(function(){
'use strict';
if(document.getElementById('malbitShortsVisualSystem'))return;
const style=document.createElement('style');
style.id='malbitShortsVisualSystem';
style.textContent=`
body.tq-shorts-active{--shorts-canvas:#edf3fa;--shorts-surface:var(--ui-surface);--shorts-surface-soft:var(--ui-surface-soft);--shorts-border:var(--ui-border);--shorts-ink:var(--ui-ink);--shorts-muted:var(--ui-muted);--shorts-accent:#e65f48;--shorts-accent-soft:#fff0eb;--shorts-success:#176f58;--shorts-success-soft:#e8f7f1;--shorts-error:#963c50;--shorts-error-soft:#fff0f3;background:var(--shorts-canvas);color:var(--shorts-ink)}
body.tq-shorts-active .app{max-width:480px;background:var(--shorts-canvas)}
body.tq-shorts-active .screen{max-width:480px;min-height:100vh;padding:calc(var(--ui-space-3) + env(safe-area-inset-top)) var(--ui-page-pad) calc(var(--ui-space-6) + env(safe-area-inset-bottom))}
body.tq-shorts-active .tqShortsScreen,body.tq-shorts-active .tqShortsScreen *{box-sizing:border-box;min-width:0}
body.tq-shorts-active .tqShortsScreen button{min-height:var(--ui-touch)}
body.tq-shorts-active .shortsTop{display:grid;grid-template-columns:var(--ui-touch) minmax(0,1fr) auto;align-items:center;gap:var(--ui-space-2);margin:0 0 var(--ui-space-3)}
body.tq-shorts-active .shortsTop>button,body.tq-shorts-active .shortsTopActions button{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--shorts-border);border-radius:var(--ui-radius-control);background:var(--shorts-surface);color:var(--shorts-ink);box-shadow:0 5px 14px rgba(35,55,82,.08)}
body.tq-shorts-active .shortsTop>b{overflow-wrap:anywhere;color:var(--shorts-ink);font-size:17px;line-height:1.2;text-align:left}
body.tq-shorts-active .shortsTopActions{display:grid;grid-template-columns:auto var(--ui-touch);align-items:center;gap:6px}
body.tq-shorts-active .shortsTopActions span{display:flex;align-items:center;justify-content:center;min-height:var(--ui-touch);border:1px solid var(--shorts-border);border-radius:var(--ui-radius-control);background:var(--shorts-surface);color:#a64b27;padding:7px 9px;font-size:10px;box-shadow:0 5px 14px rgba(35,55,82,.08)}
body.tq-shorts-active .shortsTopActions .t1ModeLang{font-size:19px}
body.tq-shorts-active .shortsProgress{height:7px;margin:0 0 var(--ui-space-3);border-radius:99px;background:#d9e2ee}
body.tq-shorts-active .shortsProgress i{background:linear-gradient(90deg,#e45c49,#f39a3d);box-shadow:none}
body.tq-shorts-active .shortsCard{width:100%;max-width:100%;border:1px solid var(--shorts-border);border-radius:var(--ui-radius-card);background:var(--shorts-surface);color:var(--shorts-ink);padding:var(--ui-space-4);box-shadow:0 12px 28px rgba(35,55,82,.12)}
body.tq-shorts-active .shortsType,body.tq-shorts-active .shortsLevel{display:inline-flex;align-items:center;min-height:28px;border-radius:999px;padding:5px 9px;font-size:10px;line-height:1.2}
body.tq-shorts-active .shortsType{border-color:#f2c9bf;background:var(--shorts-accent-soft);color:#a94634}
body.tq-shorts-active .shortsLevel{border-color:#cfdaf3;background:#edf2ff;color:#395daf}
body.tq-shorts-active .shortsWord{max-width:100%;margin:var(--ui-space-4) 0 var(--ui-space-2);overflow-wrap:anywhere;color:var(--shorts-ink);font-size:32px;line-height:1.28;letter-spacing:-.04em}
body.tq-shorts-active .shortsWord.bank{font-size:20px;line-height:1.55;letter-spacing:-.025em}
body.tq-shorts-active .shortsInstruction{margin:0 0 var(--ui-space-4);color:var(--shorts-muted);font-size:11px;line-height:1.6}
body.tq-shorts-active .shortsChoices{display:grid;gap:var(--ui-space-2)}
body.tq-shorts-active .shortsChoice{grid-template-columns:32px minmax(0,1fr);min-height:52px;gap:10px;border:1px solid var(--shorts-border);border-radius:var(--ui-radius-control);background:var(--shorts-surface);color:#26374f;padding:9px 11px;font-size:13px;line-height:1.45;box-shadow:0 3px 9px rgba(35,55,82,.05)}
body.tq-shorts-active .shortsChoice i{width:32px;height:32px;border-radius:10px;background:var(--shorts-surface-soft);color:#566a84;font-size:10px}
body.tq-shorts-active .shortsChoice.selected{border-color:#657ce5;background:#eef2ff;color:#273e91;box-shadow:0 0 0 2px rgba(82,104,232,.12)}
body.tq-shorts-active .shortsChoice.selected i{background:#5268e8;color:#fff}
body.tq-shorts-active .shortsChoice.correct{border-color:#76bda6;background:var(--shorts-success-soft);color:var(--shorts-success)}
body.tq-shorts-active .shortsChoice.correct i{background:#238a6c;color:#fff}
body.tq-shorts-active .shortsChoice.wrong{border-color:#db9baa;background:var(--shorts-error-soft);color:var(--shorts-error)}
body.tq-shorts-active .shortsChoice.wrong i{background:#b65369;color:#fff}
body.tq-shorts-active .shortsFeedback{max-width:100%;margin-top:var(--ui-space-3);border:1px solid #8ccab6;border-radius:var(--ui-radius-control);background:var(--shorts-success-soft);color:var(--shorts-success);padding:var(--ui-space-3)}
body.tq-shorts-active .shortsFeedback.bad{border-color:#e0a8b4;background:var(--shorts-error-soft);color:var(--shorts-error)}
body.tq-shorts-active .shortsFeedback>b{font-size:13px;line-height:1.4}
body.tq-shorts-active .shortsFeedback p{margin:6px 0 0;font-size:14px;line-height:1.55;overflow-wrap:anywhere}
body.tq-shorts-active .shortsFeedback small{display:block;margin:8px 0 0;color:#3f536a;font-size:11px;line-height:1.72;white-space:pre-line;overflow-wrap:anywhere}
body.tq-shorts-active .tqShortsScreen .doubleTapHint{margin-top:var(--ui-space-3);border-color:#b9c9dc;background:var(--shorts-surface-soft);color:var(--shorts-muted);font-size:10px;line-height:1.5}
body.tq-shorts-active .shortsAction button{min-height:50px;margin-top:var(--ui-space-3);border-radius:var(--ui-radius-control);background:linear-gradient(135deg,#e95e4b,#ee9139);font-size:13px;box-shadow:0 8px 18px rgba(218,92,58,.2)}
body.tq-shorts-active .shortsAction button.shortsSkip{border:1px solid var(--shorts-border);background:var(--shorts-surface-soft);color:#3c526d;box-shadow:none}
body.tq-shorts-active .shortsSwipe{margin-top:var(--ui-space-2);color:var(--shorts-muted);font-size:10px;line-height:1.5}
body.tq-shorts-active .malbitShortTools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--ui-space-2);margin:0 0 var(--ui-space-3)}
body.tq-shorts-active .malbitShortTools button{min-height:var(--ui-touch);border:1px solid var(--shorts-border);border-radius:var(--ui-radius-control);background:var(--shorts-surface-soft);color:#344b69;padding:8px 10px;font-size:10px}
body.tq-shorts-active .malbitExampleTranslation{margin-top:var(--ui-space-2);border-top-color:#cfd9e5;padding-top:var(--ui-space-2);color:#4a5e77;font-size:10px;line-height:1.6}
body.tq-shorts-active .malbitShortDaily{margin-top:var(--ui-space-3);color:var(--shorts-muted);font-size:10px}
body.tq-shorts-active .malbitShortProposal{position:static;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:var(--ui-space-2);align-items:center;margin:var(--ui-space-3) 0 0;border:1px solid #c9d7e9;border-radius:var(--ui-radius-control);background:#f2f6fc;color:var(--shorts-ink);padding:var(--ui-space-3)}
body.tq-shorts-active .malbitShortProposal small,body.tq-shorts-active .malbitShortProposal b{display:block}
body.tq-shorts-active .malbitShortProposal small{color:#5e7390;font-size:10px;line-height:1.35}
body.tq-shorts-active .malbitShortProposal b{margin-top:3px;font-size:14px;overflow-wrap:anywhere}
body.tq-shorts-active .malbitShortProposal>button{min-width:var(--ui-touch);min-height:var(--ui-touch);border:0;border-radius:var(--ui-radius-control);background:#416fd4;color:#fff;padding:8px 10px;font-size:10px}
body.tq-shorts-active .malbitShortProposal>button.dismiss{position:static;width:var(--ui-touch);height:var(--ui-touch);padding:0;background:#6d7f96}
/* Fixed compatibility bridge for product-growth's older important proposal copy. */
body.tq-shorts-active .malbitShortProposal p{margin:4px 0 0!important;color:var(--shorts-muted)!important;font-size:10px!important;line-height:1.5;overflow-wrap:anywhere}
@media(max-width:380px){body.tq-shorts-active{--ui-page-pad:12px}body.tq-shorts-active .shortsTop{gap:6px}body.tq-shorts-active .shortsTop>b{font-size:15px}body.tq-shorts-active .shortsTopActions{gap:4px}body.tq-shorts-active .shortsTopActions span{padding:6px;font-size:10px}body.tq-shorts-active .shortsCard{padding:var(--ui-space-3)}body.tq-shorts-active .shortsWord{font-size:28px}body.tq-shorts-active .shortsWord.bank{font-size:18px}body.tq-shorts-active .malbitShortProposal{grid-template-columns:minmax(0,1fr) var(--ui-touch)}body.tq-shorts-active .malbitShortProposal>div{grid-column:1/-1}body.tq-shorts-active .malbitShortProposal>button:not(.dismiss){width:100%}}
`;
document.head.appendChild(style);
})();
