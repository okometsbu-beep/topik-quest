// MALBIT Shorts visual system · one final owner for question, answer, and coaching cards.
(function(){
'use strict';
if(document.getElementById('malbitShortsVisualSystem'))return;
const style=document.createElement('style');
style.id='malbitShortsVisualSystem';
style.textContent=`
body.tq-shorts-active{--shorts-canvas:var(--ui-canvas);--shorts-surface:var(--ui-surface);--shorts-surface-raised:var(--ui-surface-raised);--shorts-surface-soft:var(--ui-surface-soft);--shorts-border:var(--ui-border);--shorts-ink:var(--ui-ink);--shorts-muted:var(--ui-muted);--shorts-accent:#ff9b82;--shorts-accent-soft:#422923;--shorts-success:var(--ui-success);--shorts-success-soft:var(--ui-success-soft);--shorts-error:var(--ui-error);--shorts-error-soft:var(--ui-error-soft);--shorts-accent-blue:#a9c2ff;--shorts-selected-soft:var(--ui-accent-soft);--shorts-selected-ink:#dbe6ff;--shorts-shadow:var(--ui-shadow);--shorts-shadow-strong:var(--ui-shadow-strong);background:var(--shorts-canvas);color:var(--shorts-ink)}
html[data-theme="light"] body.tq-shorts-active{--shorts-accent:#e65f48;--shorts-accent-soft:#fff0eb;--shorts-accent-blue:#395daf;--shorts-selected-soft:#eef2ff;--shorts-selected-ink:#273e91}
body.tq-shorts-active .app{max-width:480px;background:var(--shorts-canvas)}
body.tq-shorts-active .screen{max-width:480px;min-height:100vh;padding:calc(var(--ui-space-3) + env(safe-area-inset-top)) var(--ui-page-pad) calc(var(--ui-space-6) + env(safe-area-inset-bottom))}
body.tq-shorts-active .tqShortsScreen,body.tq-shorts-active .tqShortsScreen *{box-sizing:border-box;min-width:0}
body.tq-shorts-active .tqShortsScreen button{min-height:var(--ui-touch)}
body.tq-shorts-active .shortsTop{display:grid;grid-template-columns:var(--ui-touch) minmax(0,1fr) auto;align-items:center;gap:var(--ui-space-2);margin:0 0 var(--ui-space-3)}
body.tq-shorts-active .shortsTop>button,body.tq-shorts-active .shortsTopActions button{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--shorts-border);border-radius:var(--ui-radius-control);background:var(--shorts-surface);color:var(--shorts-ink);box-shadow:0 5px 14px var(--shorts-shadow)}
body.tq-shorts-active .shortsTop>b{overflow-wrap:anywhere;color:var(--shorts-ink);font-size:17px;line-height:1.2;text-align:left}
body.tq-shorts-active .shortsTopActions{display:grid;grid-template-columns:auto var(--ui-touch);align-items:center;gap:6px}
body.tq-shorts-active .shortsTopActions span{display:flex;align-items:center;justify-content:center;min-height:var(--ui-touch);border:1px solid var(--shorts-border);border-radius:var(--ui-radius-control);background:var(--shorts-surface);color:var(--shorts-accent);padding:7px 9px;font-size:10px;box-shadow:0 5px 14px var(--shorts-shadow)}
body.tq-shorts-active .shortsTopActions .t1ModeLang{font-size:19px}
body.tq-shorts-active .shortsProgress{height:7px;margin:0 0 var(--ui-space-3);border-radius:99px;background:var(--shorts-surface-soft)}
body.tq-shorts-active .shortsProgress i{background:linear-gradient(90deg,#e45c49,#f39a3d);box-shadow:none}
body.tq-shorts-active .shortsCard{width:100%;max-width:100%;border:1px solid var(--shorts-border);border-radius:var(--ui-radius-card);background:var(--shorts-surface);color:var(--shorts-ink);padding:var(--ui-space-4);box-shadow:0 12px 28px var(--shorts-shadow-strong)}
body.tq-shorts-active .shortsType,body.tq-shorts-active .shortsLevel{display:inline-flex;align-items:center;min-height:28px;border-radius:999px;padding:5px 9px;font-size:10px;line-height:1.2}
body.tq-shorts-active .shortsType{border-color:color-mix(in srgb,var(--shorts-accent) 44%,var(--shorts-border));background:var(--shorts-accent-soft);color:var(--shorts-accent)}
body.tq-shorts-active .shortsLevel{border-color:color-mix(in srgb,var(--shorts-accent-blue) 42%,var(--shorts-border));background:var(--shorts-selected-soft);color:var(--shorts-accent-blue)}
body.tq-shorts-active .shortsWord{max-width:100%;margin:var(--ui-space-4) 0 var(--ui-space-2);overflow-wrap:anywhere;color:var(--shorts-ink);font-size:32px;line-height:1.28;letter-spacing:-.04em}
body.tq-shorts-active .shortsWord.bank{font-size:20px;line-height:1.55;letter-spacing:-.025em}
body.tq-shorts-active .shortsInstruction{margin:0 0 var(--ui-space-4);color:var(--shorts-muted);font-size:11px;line-height:1.6}
body.tq-shorts-active .shortsChoices{display:grid;gap:var(--ui-space-2)}
body.tq-shorts-active .shortsChoice{grid-template-columns:32px minmax(0,1fr);min-height:52px;gap:10px;border:1px solid var(--shorts-border);border-radius:var(--ui-radius-control);background:var(--shorts-surface-raised);color:var(--shorts-ink);padding:9px 11px;font-size:13px;line-height:1.45;box-shadow:0 3px 9px var(--shorts-shadow)}
body.tq-shorts-active .shortsChoice i{width:32px;height:32px;border-radius:10px;background:var(--shorts-surface-soft);color:var(--shorts-muted);font-size:10px}
body.tq-shorts-active .shortsChoice.selected{border-color:#657ce5;background:var(--shorts-selected-soft);color:var(--shorts-selected-ink);box-shadow:0 0 0 2px rgba(82,104,232,.18)}
body.tq-shorts-active .shortsChoice.selected i{background:#5268e8;color:#fff}
body.tq-shorts-active .shortsChoice.correct{border-color:color-mix(in srgb,var(--shorts-success) 60%,var(--shorts-border));background:var(--shorts-success-soft);color:var(--shorts-success)}
body.tq-shorts-active .shortsChoice.correct i{background:#238a6c;color:#fff}
body.tq-shorts-active .shortsChoice.wrong{border-color:color-mix(in srgb,var(--shorts-error) 58%,var(--shorts-border));background:var(--shorts-error-soft);color:var(--shorts-error)}
body.tq-shorts-active .shortsChoice.wrong i{background:#b65369;color:#fff}
body.tq-shorts-active .shortsFeedback{max-width:100%;margin-top:var(--ui-space-3);border:1px solid color-mix(in srgb,var(--shorts-success) 58%,var(--shorts-border));border-radius:var(--ui-radius-control);background:var(--shorts-success-soft);color:var(--shorts-success);padding:var(--ui-space-3)}
body.tq-shorts-active .shortsFeedback.bad{border-color:color-mix(in srgb,var(--shorts-error) 58%,var(--shorts-border));background:var(--shorts-error-soft);color:var(--shorts-error)}
body.tq-shorts-active .shortsFeedback>b{font-size:13px;line-height:1.4}
body.tq-shorts-active .shortsFeedback p{margin:6px 0 0;font-size:14px;line-height:1.55;overflow-wrap:anywhere}
body.tq-shorts-active .shortsFeedback small{display:block;margin:8px 0 0;color:var(--shorts-ink);font-size:11px;line-height:1.72;white-space:pre-line;overflow-wrap:anywhere}
body.tq-shorts-active .tqShortsScreen .doubleTapHint{margin-top:var(--ui-space-3);border-color:#b9c9dc;background:var(--shorts-surface-soft);color:var(--shorts-muted);font-size:10px;line-height:1.5}
body.tq-shorts-active .shortsAction button{min-height:50px;margin-top:var(--ui-space-3);border-radius:var(--ui-radius-control);background:linear-gradient(135deg,#e95e4b,#ee9139);font-size:13px;box-shadow:0 8px 18px rgba(218,92,58,.2)}
body.tq-shorts-active .shortsAction button.shortsSkip{border:1px solid var(--shorts-border);background:var(--shorts-surface-soft);color:var(--shorts-ink);box-shadow:none}
body.tq-shorts-active .shortsSwipe{margin-top:var(--ui-space-2);color:var(--shorts-muted);font-size:10px;line-height:1.5}
body.tq-shorts-active .malbitShortTools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--ui-space-2);margin:0 0 var(--ui-space-3)}
body.tq-shorts-active .malbitShortTools button{min-height:var(--ui-touch);border:1px solid var(--shorts-border);border-radius:var(--ui-radius-control);background:var(--shorts-surface-soft);color:var(--shorts-ink);padding:8px 10px;font-size:10px}
body.tq-shorts-active .malbitExampleTranslation{margin-top:var(--ui-space-2);border-top-color:var(--shorts-border);padding-top:var(--ui-space-2);color:var(--shorts-muted);font-size:10px;line-height:1.6}
body.tq-shorts-active .malbitShortDaily{margin-top:var(--ui-space-3);color:var(--shorts-muted);font-size:10px}
body.tq-shorts-active .malbitShortProposal{position:static;display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:var(--ui-space-2);align-items:center;margin:var(--ui-space-3) 0 0;border:1px solid var(--shorts-border);border-radius:var(--ui-radius-control);background:var(--shorts-surface-raised);color:var(--shorts-ink);padding:var(--ui-space-3)}
body.tq-shorts-active .malbitShortProposal small,body.tq-shorts-active .malbitShortProposal b{display:block}
body.tq-shorts-active .malbitShortProposal small{color:var(--shorts-muted);font-size:10px;line-height:1.35}
body.tq-shorts-active .malbitShortProposal b{margin-top:3px;font-size:14px;overflow-wrap:anywhere}
body.tq-shorts-active .malbitShortProposal>button{min-width:var(--ui-touch);min-height:var(--ui-touch);border:0;border-radius:var(--ui-radius-control);background:#416fd4;color:#fff;padding:8px 10px;font-size:10px}
body.tq-shorts-active .malbitShortProposal>button.dismiss{position:static;width:var(--ui-touch);height:var(--ui-touch);padding:0;background:#6d7f96}
/* Fixed compatibility bridge for product-growth's older important proposal copy. */
body.tq-shorts-active .malbitShortProposal p{margin:4px 0 0!important;color:var(--shorts-muted)!important;font-size:10px!important;line-height:1.5;overflow-wrap:anywhere}
@media(max-width:380px){body.tq-shorts-active{--ui-page-pad:12px}body.tq-shorts-active .shortsTop{gap:6px}body.tq-shorts-active .shortsTop>b{font-size:15px}body.tq-shorts-active .shortsTopActions{gap:4px}body.tq-shorts-active .shortsTopActions span{padding:6px;font-size:10px}body.tq-shorts-active .shortsCard{padding:var(--ui-space-3)}body.tq-shorts-active .shortsWord{font-size:28px}body.tq-shorts-active .shortsWord.bank{font-size:18px}body.tq-shorts-active .malbitShortProposal{grid-template-columns:minmax(0,1fr) var(--ui-touch)}body.tq-shorts-active .malbitShortProposal>div{grid-column:1/-1}body.tq-shorts-active .malbitShortProposal>button:not(.dismiss){width:100%}}
`;
document.head.appendChild(style);
})();
