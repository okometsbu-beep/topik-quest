// MALBIT Home visual system · one final owner for the first learning screen.
(function(){
'use strict';
if(document.getElementById('malbitHomeVisualSystem'))return;
const style=document.createElement('style');
style.id='malbitHomeVisualSystem';
style.textContent=`
body.tq-home-active{--home-canvas:#edf3fa;--home-surface:var(--ui-surface);--home-surface-soft:var(--ui-surface-soft);--home-border:var(--ui-border);--home-ink:var(--ui-ink);--home-muted:var(--ui-muted);--home-accent:var(--ui-accent);background:var(--home-canvas);color:var(--home-ink)}
body.tq-home-active .app{max-width:480px;background:var(--home-canvas)}
body.tq-home-active .screen{max-width:480px;padding:calc(var(--ui-space-3) + env(safe-area-inset-top)) var(--ui-page-pad) calc(var(--ui-space-6) + env(safe-area-inset-bottom))}
body.tq-home-active .tqHomeHeader{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:var(--ui-space-2);margin:0 0 var(--ui-space-3)}
body.tq-home-active .tqHomeLogo{min-width:0;color:var(--home-ink);font-size:20px;line-height:1.2}
body.tq-home-active .tqHomeMeta{gap:var(--ui-space-2)}
body.tq-home-active .tqStreak{min-height:var(--ui-touch);border:1px solid var(--home-border);background:var(--home-surface);color:#b34d27;padding:8px 11px;box-shadow:0 5px 14px rgba(35,55,82,.08)}
body.tq-home-active .tqLang{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--home-border);background:var(--home-surface);box-shadow:0 5px 14px rgba(35,55,82,.08)}
body.tq-home-active .tqHomeScreen button{min-height:var(--ui-touch)}
body.tq-home-active .tqHomeScreen>.t1level{min-height:52px;border:1px solid var(--home-border);border-radius:var(--ui-radius-control);background:var(--home-surface);padding:4px;box-shadow:0 6px 16px rgba(35,55,82,.07)}
body.tq-home-active .tqHomeScreen>.t1level button{min-width:0;color:var(--home-muted);font-size:11px}
body.tq-home-active .tqHomeScreen>.t1level button.on{background:linear-gradient(135deg,#5067e8,#7159e9);color:#fff;box-shadow:0 6px 14px rgba(80,103,232,.22)}
body.tq-home-active .tqV9Greeting{margin:0 2px var(--ui-space-3)}
body.tq-home-active .tqV9Greeting small{color:#647991;font-size:10px}
body.tq-home-active .tqV9Greeting h1{color:var(--home-ink);font-size:24px;line-height:1.2}
body.tq-home-active .tqV9Greeting em{color:#3f72d8}
body.tq-home-active .tqV9Hero{min-height:320px;border-color:#9ab2d0;border-radius:var(--ui-radius-card);box-shadow:0 16px 34px rgba(35,55,82,.18)}
body.tq-home-active .tqV9HeroContent{min-height:320px;padding:var(--ui-space-4)}
body.tq-home-active .tqV9Label{font-size:11px}
body.tq-home-active .tqV9Ring{width:70px;height:70px}
body.tq-home-active .tqV9HeroBottom h2,body.tq-home-active .tqV9HeroBottom p{max-width:100%}
body.tq-home-active .tqV9HeroBottom p{font-size:10px;line-height:1.45}
body.tq-home-active .tqV9Continue{min-height:52px;border-radius:var(--ui-radius-control);font-size:13px}
body.tq-home-active .tqV9SectionHead{margin:var(--ui-space-6) 2px var(--ui-space-2)}
body.tq-home-active .tqV9SectionHead b{color:var(--home-ink);font-size:15px}
body.tq-home-active .tqV9SectionHead span{color:var(--home-muted);font-size:10px}
body.tq-home-active .tqV9Modes{grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--ui-space-2)}
body.tq-home-active .tqV9Mode{--mode-accent:#4b68dd;min-width:0;min-height:136px;border:1px solid var(--home-border);border-radius:var(--ui-radius-card);background:var(--home-surface);color:var(--home-ink);padding:12px 9px;box-shadow:0 7px 18px rgba(35,55,82,.08)}
body.tq-home-active .tqV9Mode.game{--mode-accent:#158574}body.tq-home-active .tqV9Mode.inf{--mode-accent:#7650c3}body.tq-home-active .tqV9Mode.travel{--mode-accent:#247d95}
body.tq-home-active .tqV9Mode:after{background:color-mix(in srgb,var(--mode-accent) 12%,transparent)}
body.tq-home-active .tqV9Mode i{width:42px;height:42px;border:1px solid color-mix(in srgb,var(--mode-accent) 22%,#dce4ef);background:color-mix(in srgb,var(--mode-accent) 10%,#fff);color:var(--mode-accent)}
body.tq-home-active .tqV9Mode b{color:var(--home-ink);font-size:12px}
body.tq-home-active .tqV9Mode small{color:var(--home-muted);font-size:10px;line-height:1.45}
body.tq-home-active .tqV9Utility{gap:var(--ui-space-2);margin-top:var(--ui-space-2)}
body.tq-home-active .tqV9Utility button{min-width:0;min-height:104px;border-radius:var(--ui-radius-card);padding:12px 9px;color:var(--home-ink)}
body.tq-home-active .tqV9Utility i{color:#4f65ca}
body.tq-home-active .tqV9Utility b{font-size:12px}
body.tq-home-active .tqV9Utility small{font-size:10px;line-height:1.45}
body.tq-home-active .tqV9Week{border:1px solid var(--home-border);border-radius:var(--ui-radius-card);background:var(--home-surface);color:var(--home-ink);box-shadow:0 7px 18px rgba(35,55,82,.08)}
body.tq-home-active .tqV9Week p{color:var(--home-muted);font-size:10px;line-height:1.45}
body.tq-home-active .tqV9Stats{min-width:var(--ui-touch);min-height:var(--ui-touch);background:#e7eefb;color:#315da9;font-size:10px}
body.tq-home-active .tqV9Day small{color:var(--home-muted);font-size:10px}
body.tq-home-active .bottom{background:rgba(255,255,255,.97);border-top-color:var(--home-border);box-shadow:0 -10px 26px rgba(35,55,82,.08)}
body.tq-home-active .nav button{color:#6d7f96}
body.tq-home-active .nav button.active{background:#e5edfb;color:#315da9}
/* Fixed compatibility bridge for the earlier Home overrides. */
body.tq-home-active .tqHomeScreen>.t1level{margin:0 0 14px!important}
body.tq-home-active .tqV9Utility button{border:1px solid var(--home-border)!important;background:var(--home-surface)!important;box-shadow:0 7px 18px rgba(35,55,82,.08)!important}
body.tq-home-active .tqV9Utility b{color:var(--home-ink)!important}
body.tq-home-active .tqV9Utility small{color:var(--home-muted)!important}
@media(max-width:380px){body.tq-home-active{--ui-page-pad:12px}body.tq-home-active .tqHomeLogo{font-size:18px}body.tq-home-active .tqStreak{padding:7px 9px;font-size:10px}body.tq-home-active .tqHomeScreen>.t1level.v35ThreeLevels button{font-size:10px!important}body.tq-home-active .tqV9Hero,body.tq-home-active .tqV9HeroContent{min-height:300px}body.tq-home-active .tqV9Mode{min-height:140px;padding:11px 7px}body.tq-home-active .tqV9Utility button{min-height:110px;padding:11px 7px}}
`;
document.head.appendChild(style);
})();
