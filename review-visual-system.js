// MALBIT Review visual system · one final owner for queue, retry, translation, and coaching surfaces.
(function(){
'use strict';
if(document.getElementById('malbitReviewVisualSystem'))return;
const style=document.createElement('style');
style.id='malbitReviewVisualSystem';
style.textContent=`
body.tq-review-active{--review-canvas:#edf3fa;--review-surface:var(--ui-surface);--review-surface-soft:var(--ui-surface-soft);--review-border:var(--ui-border);--review-ink:var(--ui-ink);--review-muted:var(--ui-muted);--review-accent:var(--ui-accent);--review-accent-soft:#e8edff;--review-success:#176f58;--review-success-soft:#e7f7f0;--review-error:#963c50;--review-error-soft:#fff0f3;background:var(--review-canvas);color:var(--review-ink)}
body.tq-review-active .app{max-width:480px;background:var(--review-canvas)}
body.tq-review-active .tqReviewScreen,body.tq-review-active .tqReviewScreen *{box-sizing:border-box;min-width:0}
body.tq-review-active .tqReviewScreen{max-width:480px;margin:auto;padding:calc(var(--ui-space-3) + env(safe-area-inset-top)) var(--ui-page-pad) calc(92px + env(safe-area-inset-bottom));background:var(--review-canvas);color:var(--review-ink)}
body.tq-review-active .tqReviewScreen button:not(:disabled),body.tq-review-active .tqReviewRetrySheet button:not(:disabled){min-height:var(--ui-touch)}
body.tq-review-active .tqReviewHero{grid-template-columns:minmax(0,1fr) 74px;gap:var(--ui-space-3);border:1px solid #879bea;border-radius:var(--ui-radius-card);padding:var(--ui-space-4);background:linear-gradient(145deg,#5268e8,#725ce2);box-shadow:0 14px 30px rgba(66,78,171,.2)}
body.tq-review-active .tqReviewHero small{color:#e7eaff;font-size:10px;line-height:1.35}
body.tq-review-active .tqReviewHero h1{margin:6px 0;color:#fff;font-size:20px;line-height:1.25}
body.tq-review-active .tqReviewHero p{margin:0;color:#f0f2ff;font-size:10px;line-height:1.5}
body.tq-review-active .tqReviewHero>strong{width:72px;height:72px;border-radius:var(--ui-radius-control);background:rgba(255,255,255,.18);font-size:27px}
body.tq-review-active .tqReviewHero>strong small{font-size:10px}
body.tq-review-active .tqReviewStats{grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--ui-space-2);margin:var(--ui-space-3) 0}
body.tq-review-active .tqReviewStats>div{min-height:76px;border:1px solid var(--review-border);border-radius:var(--ui-radius-control);padding:11px 8px;background:var(--review-surface);color:var(--review-ink);box-shadow:0 5px 14px rgba(35,55,82,.07);text-align:center}
body.tq-review-active .tqReviewStats b{font-size:19px}
body.tq-review-active .tqReviewStats small{color:var(--review-muted);font-size:10px;line-height:1.35}
body.tq-review-active .tqReviewFilters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--ui-space-2);margin-bottom:var(--ui-space-4)}
body.tq-review-active .tqReviewFilters button{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:5px;border:1px solid var(--review-border);border-radius:var(--ui-radius-control);background:var(--review-surface);color:#50637b;padding:8px 10px;font-size:10px;font-weight:900;box-shadow:0 4px 12px rgba(35,55,82,.05)}
body.tq-review-active .tqReviewFilters button b{display:grid;place-items:center;min-width:23px;height:23px;border-radius:8px;background:var(--review-surface-soft);color:#60728b;font-size:10px}
body.tq-review-active .tqReviewFilters button.on{border-color:#7184e7;background:var(--review-accent-soft);color:#3048a6;box-shadow:0 0 0 2px rgba(82,104,232,.1)}
body.tq-review-active .tqReviewFilters button.on b{background:#5268e8;color:#fff}
body.tq-review-active .sectionTitle{margin:0 2px var(--ui-space-2)}
body.tq-review-active .sectionTitle h2{color:var(--review-ink);font-size:15px}
body.tq-review-active .sectionTitle span{color:var(--review-muted);font-size:10px}
body.tq-review-active .tqReviewQueue{gap:var(--ui-space-2)}
body.tq-review-active .tqReviewItem{display:grid;grid-template-columns:50px minmax(0,1fr);gap:var(--ui-space-2);border:1px solid var(--review-border);border-radius:var(--ui-radius-card);padding:var(--ui-space-3);background:var(--review-surface);color:var(--review-ink);box-shadow:0 6px 17px rgba(35,55,82,.07)}
body.tq-review-active .tqReviewBadge{grid-row:1/2;width:50px;height:50px;border-radius:var(--ui-radius-control);background:var(--review-accent-soft);color:#3e57c2;font-size:18px}
body.tq-review-active .tqReviewBadge small{color:#5267c7;font-size:10px;line-height:1.2}
body.tq-review-active .tqReviewItem>div:nth-child(2){align-self:center;overflow-wrap:anywhere}
body.tq-review-active .tqReviewItem b{color:var(--review-ink);font-size:12px}
body.tq-review-active .tqReviewItem p{max-width:none;margin:4px 0;color:var(--review-muted);font-size:10px;line-height:1.45}
body.tq-review-active .tqReviewItem>div>small{color:#8b5566;font-size:10px;line-height:1.35}
body.tq-review-active .tqReviewItem>button{grid-column:1/-1;width:100%;border:0;border-radius:var(--ui-radius-control);background:#5268e8;color:#fff;padding:10px 12px;font-size:11px;font-weight:900}
body.tq-review-active .tqReviewEmpty{border:1px dashed #b9c7d9;border-radius:var(--ui-radius-card);padding:var(--ui-space-6) var(--ui-space-4);background:var(--review-surface);color:var(--review-ink)}
body.tq-review-active .tqReviewEmpty h3{font-size:14px}
body.tq-review-active .tqReviewEmpty p{color:var(--review-muted);font-size:10px;line-height:1.5}
body.tq-review-active .tqClearMastered{min-height:var(--ui-touch);color:#61738a;font-size:10px}
body.tq-review-active .overlay{justify-content:center}
body.tq-review-active .sheet{width:min(480px,100%);background:#f8fbff;color:var(--review-ink)}
body.tq-review-active .tqReviewRetrySheet,body.tq-review-active .tqReviewRetrySheet *{box-sizing:border-box;min-width:0}
body.tq-review-active .tqReviewRetrySheet .reward{border:1px solid #8298ed;border-radius:var(--ui-radius-card);background:linear-gradient(145deg,#5268e8,#725ce2);padding:var(--ui-space-4)}
body.tq-review-active .tqReviewRetrySheet .reward b{font-size:16px;line-height:1.35}
body.tq-review-active .tqReviewRetrySheet .reward small{font-size:10px;line-height:1.4}
body.tq-review-active .tqReviewQuestion{max-width:100%;margin:var(--ui-space-3) 0;border:1px solid var(--review-border);border-radius:var(--ui-radius-control);padding:var(--ui-space-3);background:var(--review-surface);color:var(--review-ink);overflow:hidden}
body.tq-review-active .tqReviewQuestion.translated{border-color:#b8cbea;background:#eef4fb}
body.tq-review-active .tqReviewQuestion>small{color:var(--review-muted);font-size:10px;line-height:1.5}
body.tq-review-active .tqReviewQuestion>p{color:var(--review-ink);font-size:14px;line-height:1.65;overflow-wrap:anywhere}
body.tq-review-active .tqReviewScript{border-left-color:#7187df;border-radius:0 10px 10px 0;background:var(--review-surface-soft);color:#344a65;padding:9px 10px;font-size:11px;line-height:1.6;overflow-wrap:anywhere}
body.tq-review-active .tqReviewQuestion ol{padding-left:22px}
body.tq-review-active .tqReviewQuestion li{color:#3f526b;font-size:11px;line-height:1.5;overflow-wrap:anywhere}
body.tq-review-active .tqTranslationToggle{width:100%;min-height:48px;border:1px solid #bdcce0;border-radius:var(--ui-radius-control);background:#e9eff8;color:#315171;padding:10px 12px;font-size:11px;font-weight:900}
body.tq-review-active .tqReviewChoices{display:grid;gap:var(--ui-space-2);margin-top:var(--ui-space-3)}
body.tq-review-active .tqReviewChoices .choice{display:grid;grid-template-columns:32px minmax(0,1fr);align-items:center;gap:10px;min-height:52px;border:1px solid var(--review-border);border-radius:var(--ui-radius-control);background:var(--review-surface);color:#26374f;padding:9px 11px;font-size:13px;line-height:1.5;opacity:1}
body.tq-review-active .tqReviewChoices .choice .n{width:32px;height:32px;border-radius:10px;background:var(--review-surface-soft);color:#566a84;font-size:10px}
body.tq-review-active .tqReviewChoices .choice.selected{border-color:#657ce5;background:#eef2ff;color:#273e91}
body.tq-review-active .tqReviewChoices .choice.correct{border-color:#76bda6;background:var(--review-success-soft);color:var(--review-success)}
body.tq-review-active .tqReviewChoices .choice.wrong{border-color:#db9baa;background:var(--review-error-soft);color:var(--review-error)}
body.tq-review-active .tqReviewRetrySheet .doubleTapHint{border-color:#b9c9dc;background:var(--review-surface-soft);color:var(--review-muted);font-size:10px;line-height:1.5}
body.tq-review-active .tqReviewRetrySheet .resultStrip{border:1px solid #82c4ae;border-radius:var(--ui-radius-control);background:var(--review-success-soft);color:var(--review-success);font-size:11px;line-height:1.5}
body.tq-review-active .tqReviewRetrySheet .resultStrip.bad{border-color:#dfa5b2;background:var(--review-error-soft);color:var(--review-error)}
body.tq-review-active .tqReviewDeep{max-width:100%;margin-top:var(--ui-space-3);border:1px solid #c7d5e6;border-radius:var(--ui-radius-control);padding:var(--ui-space-3);background:#f4f7fb;color:var(--review-ink);overflow:hidden}
body.tq-review-active .tqReviewDeep .tqInlineTitle b{font-size:13px}
body.tq-review-active .tqReviewDeep .tqInlineAnswer{background:#e7edf8}
body.tq-review-active .tqReviewDeep .tqInlineAnswer small,body.tq-review-active .tqReviewDeep h4{color:#60738b;font-size:10px}
body.tq-review-active .tqReviewDeep p{color:#2d4159;font-size:12px;line-height:1.7;white-space:pre-line;overflow-wrap:anywhere}
body.tq-review-active .tqReviewDeep blockquote{border-left-color:#7890df;background:#eaf0f8;color:#3f536c;font-size:10px;line-height:1.6;overflow-wrap:anywhere}
body.tq-review-active .tqReviewChoiceAnalysis{gap:var(--ui-space-2)}
body.tq-review-active .tqReviewChoiceAnalysis li{border:1px solid var(--review-border);border-radius:var(--ui-radius-control);background:var(--review-surface);padding:10px}
body.tq-review-active .tqReviewChoiceAnalysis li.right{border-color:#83c8ae;background:var(--review-success-soft)}
body.tq-review-active .tqReviewChoiceAnalysis b{font-size:11px}
body.tq-review-active .tqReviewChoiceAnalysis span{color:#53667d;font-size:10px;line-height:1.55}
body.tq-review-active .tqReviewRetrySheet>.closeBtn{min-height:48px;border:1px solid var(--review-border);border-radius:var(--ui-radius-control);background:#e8eef7;color:#344c68;font-size:11px}
/* Fixed compatibility bridge for the v33 theme declarations. */
body.tq-review-active .tqReviewScreen{background:var(--review-canvas)!important;color:var(--review-ink)!important}
body.tq-review-active .tqReviewStats>div,body.tq-review-active .tqReviewItem,body.tq-review-active .tqReviewEmpty{border-color:var(--review-border)!important;background:var(--review-surface)!important;color:var(--review-ink)!important;box-shadow:0 6px 17px rgba(35,55,82,.07)!important}
body.tq-review-active .tqReviewStats small,body.tq-review-active .tqReviewItem p,body.tq-review-active .tqReviewEmpty p{color:var(--review-muted)!important}
body.tq-review-active .tqReviewBadge{background:var(--review-accent-soft)!important}
body.tq-review-active .tqReviewScreen .sectionTitle h2{color:var(--review-ink)!important}
body.tq-review-active .tqReviewQuestion{border-color:var(--review-border)!important;background:var(--review-surface)!important;color:var(--review-ink)!important}
body.tq-review-active .tqReviewQuestion.translated{border-color:#b8cbea!important;background:#eef4fb!important}
body.tq-review-active .tqReviewQuestion>small,body.tq-review-active .tqReviewQuestion li{color:#3f526b!important}
body.tq-review-active .tqReviewScript{background:var(--review-surface-soft)!important;color:#344a65!important}
body.tq-review-active .tqTranslationToggle{border-color:#bdcce0!important;background:#e9eff8!important;color:#315171!important}
body.tq-review-active .tqReviewDeep{border-color:#c7d5e6!important;background:#f4f7fb!important;color:var(--review-ink)!important}
body.tq-review-active .tqReviewDeep h4,body.tq-review-active .tqReviewDeep p{color:#2d4159!important}
body.tq-review-active .tqReviewDeep blockquote{background:#eaf0f8!important;color:#3f536c!important}
body.tq-review-active .tqReviewChoiceAnalysis li{border-color:var(--review-border)!important;background:var(--review-surface)!important}
body.tq-review-active .tqReviewChoiceAnalysis li.right{border-color:#83c8ae!important;background:var(--review-success-soft)!important}
body.tq-review-active .tqReviewChoiceAnalysis span{color:#53667d!important}
@media(max-width:380px){body.tq-review-active{--ui-page-pad:12px}body.tq-review-active .tqReviewHero{grid-template-columns:minmax(0,1fr) 62px;padding:var(--ui-space-3)}body.tq-review-active .tqReviewHero>strong{width:62px;height:62px}body.tq-review-active .tqReviewFilters{gap:5px}body.tq-review-active .tqReviewFilters button{padding:7px 6px}body.tq-review-active .sheet{padding-left:12px;padding-right:12px}}
`;
document.head.appendChild(style);

function sync(){
  const active=typeof S!=='undefined'&&S?.view==='review';
  document.body.classList.toggle('tq-review-active',active);
  const sheet=document.getElementById('sheetBody');if(sheet)sheet.classList.toggle('tqReviewRetrySheet',active&&!!sheet.querySelector('.tqReviewQuestion'));
}
if(typeof window.render==='function'){
  const baseRender=window.render;
  window.render=function(){const out=baseRender.apply(this,arguments);sync();requestAnimationFrame(sync);return out};
}
new MutationObserver(sync).observe(document.body,{childList:true,subtree:true});
sync();
})();
