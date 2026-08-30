// MALBIT Game Mode visual system · one final owner for expedition geometry and surfaces.
(function(){
'use strict';
if(document.getElementById('malbitGameVisualSystem'))return;
const style=document.createElement('style');
style.id='malbitGameVisualSystem';
style.textContent=`
body.tq-game-active{--game-canvas:var(--ui-canvas);--game-surface:var(--ui-surface);--game-surface-raised:var(--ui-surface-raised);--game-surface-soft:var(--ui-surface-soft);--game-border:var(--ui-border);--game-ink:var(--ui-ink);--game-muted:var(--ui-muted);--game-accent:var(--ui-accent);--game-accent-soft:var(--ui-accent-soft);--game-success:var(--ui-success);--game-success-soft:var(--ui-success-soft);--game-warning:var(--ui-warning);--game-warning-soft:var(--ui-warning-soft);--game-error:var(--ui-error);--game-error-soft:var(--ui-error-soft);--game-stage:#263f5d;--game-stage-text:#b4c6dc;--game-node:#466f94;--game-node-text:#f4f8ff;--game-node-passed:#236b57;--game-node-passed-text:#d9fff0;--game-node-current:#7b5b19;--game-node-current-text:#fff0bd;--game-node-choice:#31558d;--game-node-choice-text:#dce7ff;--game-node-boss:#71344e;--game-node-boss-text:#ffdcea;--game-map-wash-a:rgba(25,49,78,.08);--game-map-wash-b:rgba(9,25,43,.16);--game-map-filter:brightness(.92) saturate(.94) contrast(1.02);--game-shadow:var(--ui-shadow);--game-shadow-strong:var(--ui-shadow-strong);background:var(--game-canvas);color:var(--game-ink)}
html[data-theme="light"] body.tq-game-active{--game-stage:#e5ebf3;--game-stage-text:#607188;--game-node:#e9f2f8;--game-node-text:#244d68;--game-node-passed:#e2f6ee;--game-node-passed-text:#126f58;--game-node-current:#fff0bd;--game-node-current-text:#68420a;--game-node-choice:#e6edff;--game-node-choice-text:#244caa;--game-node-boss:#ffe6ef;--game-node-boss-text:#8c3156;--game-map-wash-a:rgba(235,244,249,.12);--game-map-wash-b:rgba(219,234,243,.18);--game-map-filter:brightness(1.14) saturate(.9) contrast(.94)}
body.tq-game-active .app{max-width:480px;background:var(--game-canvas)}
body.tq-game-active .screen{max-width:480px;padding:calc(var(--ui-space-3) + env(safe-area-inset-top)) var(--ui-page-pad) calc(var(--ui-space-6) + env(safe-area-inset-bottom))}
body.tq-game-active .tqGameNav{grid-template-columns:var(--ui-touch) minmax(0,1fr) var(--ui-touch);gap:var(--ui-space-2);margin-bottom:var(--ui-space-3)}
body.tq-game-active .tqGameNav>button,body.tq-game-active .t1TrailTop>button{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--game-border);border-radius:var(--ui-radius-control);background:var(--game-surface);color:var(--game-ink);box-shadow:0 5px 14px var(--game-shadow)}
body.tq-game-active .tqGameNav h1{justify-self:center;color:var(--game-ink);font-size:20px;text-align:center}
body.tq-game-active .tqGameNavActions{justify-self:end;width:var(--ui-touch)}
body.tq-game-active .tqGameNavActions .tqGameLevel{display:none}
body.tq-game-active .tqGameNavActions .t1ModeLang{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--game-border);border-radius:var(--ui-radius-control);background:var(--game-surface)}
body.tq-game-active .tqGameArena{border-color:var(--game-border);background:var(--game-surface-soft);box-shadow:0 16px 34px var(--game-shadow-strong)}
body.tq-game-active .tqGameMission{border-color:#3d6388;background:linear-gradient(145deg,#214568,#173653);box-shadow:0 14px 26px rgba(30,55,84,.2)}
body.tq-game-active .tqGameMission small{font-size:var(--ui-font-caption);color:#a9ceff}
body.tq-game-active .tqGameMission h2{color:#fff}
body.tq-game-active .tqGameStart{min-height:48px;background:linear-gradient(135deg,#506bf0,#765bea);box-shadow:0 10px 24px rgba(76,88,220,.28)}
body.tq-game-active .t1GameMetaRow,body.tq-game-active .tqGameWorldNav{color:var(--game-ink)}
body.tq-game-active .t1GameMetaRow>b,body.tq-game-active .tqGameWorldNav>b{font-size:12px}
body.tq-game-active .t1GameGear{min-width:0;min-height:116px;border:1px solid var(--game-border);border-radius:18px;background:var(--game-surface);color:var(--game-ink);padding:12px 8px;box-shadow:0 7px 18px var(--game-shadow)}
body.tq-game-active .t1GameGear i{width:38px;height:38px;border-radius:12px;background:var(--game-accent-soft);color:var(--game-accent);font-size:18px}
body.tq-game-active .t1GameGear b{margin-top:8px;color:var(--game-ink);font-size:11px;line-height:1.35}
body.tq-game-active .t1GameGear small{margin-top:4px;color:var(--game-muted);font-size:10px;line-height:1.4}
body.tq-game-active .t1RarityLegend{gap:6px}
body.tq-game-active .t1RarityLegend span{min-height:28px;border-color:var(--game-border);background:var(--game-surface);color:var(--game-muted);font-size:10px}
body.tq-game-active .t1RunRule{border-color:color-mix(in srgb,var(--game-error) 46%,var(--game-border));background:var(--game-error-soft);color:var(--game-error);font-size:10px;line-height:1.55}
body.tq-game-active .tqGameWorldNav{border-bottom-color:var(--game-border)}
body.tq-game-active .tqGameStage{min-width:var(--ui-touch);min-height:var(--ui-touch);border-color:var(--game-border);background:var(--game-stage);color:var(--game-stage-text);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--game-ink) 12%,transparent)}
body.tq-game-active .tqGameStage.on{border-color:#5367df;background:#6174ee;color:#fff;box-shadow:0 0 0 3px rgba(83,103,223,.13)}
body.tq-game-active .tqGameStage.clear{border-color:color-mix(in srgb,var(--game-success) 62%,var(--game-border));background:var(--game-success-soft);color:var(--game-success)}
body.tq-game-active .tqGameStage:disabled{opacity:.72}
body.tq-game-active .tqGameStage small{font-size:10px}
body.tq-game-active .tqGameTts{border-color:var(--game-border);background:var(--game-surface-soft);color:var(--game-muted);font-size:10px}
body.tq-game-active .t1TrailScreen{color:var(--game-ink)}
body.tq-game-active .t1TrailScreen button:not(.t1TrailNode){min-height:var(--ui-touch)}
body.tq-game-active .t1TrailTop{grid-template-columns:var(--ui-touch) minmax(0,1fr) auto;gap:var(--ui-space-2);margin-bottom:var(--ui-space-3)}
body.tq-game-active .t1TrailTop h1{color:var(--game-ink);font-size:17px}
body.tq-game-active .t1TrailTop small{color:var(--game-muted);font-size:10px}
body.tq-game-active .t1TrailStats{gap:5px;max-width:214px}
body.tq-game-active .t1TrailStats span,body.tq-game-active #screen .t1hud>span{min-height:var(--ui-touch);border:1px solid var(--game-border);border-radius:var(--ui-radius-control);background:var(--game-surface);color:var(--game-ink);font-size:10px;box-shadow:0 4px 12px var(--game-shadow)}
body.tq-game-active .t1TrailStats .t1ModeLang{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--game-border);background:var(--game-surface);font-size:19px}
body.tq-game-active .t1TrailBoard{border-color:var(--game-border);background:var(--game-surface-soft);box-shadow:0 16px 34px var(--game-shadow-strong)}
body.tq-game-active .t1TrailScene{border-bottom-color:#9fb5cd}
body.tq-game-active .t1TrailSceneCopy small{color:#b9dcff;text-shadow:0 1px 4px rgba(0,0,0,.72)}
body.tq-game-active .t1TrailSceneCopy b{color:#fff;text-shadow:0 2px 7px rgba(0,0,0,.86)}
body.tq-game-active .t1TrailSceneCopy p{color:#e5effa;text-shadow:0 1px 4px rgba(0,0,0,.78)}
body.tq-game-active .t1TrailRoute{background:var(--game-surface-raised)}
body.tq-game-active .malbitMapTools{border-color:var(--game-border);background:color-mix(in srgb,var(--game-surface-raised) 96%,transparent);color:var(--game-muted);box-shadow:0 5px 14px var(--game-shadow)}
body.tq-game-active .malbitMapTools button{background:#365e91;color:#fff}
body.tq-game-active .t1TrailGrid{border:1px solid var(--game-border);filter:var(--game-map-filter);box-shadow:inset 0 0 28px var(--game-shadow-strong)}
body.tq-game-active .t1TrailNode{border-color:color-mix(in srgb,var(--game-node) 70%,var(--game-border));background:var(--game-node);color:var(--game-node-text);box-shadow:0 5px 12px var(--game-shadow-strong),inset 0 0 0 2px color-mix(in srgb,var(--game-ink) 16%,transparent)}
body.tq-game-active .t1TrailNode.unknown{border-color:color-mix(in srgb,var(--game-node) 70%,var(--game-border));background:var(--game-node);color:var(--game-node-text)}
body.tq-game-active .t1TrailNode.passed{border-color:color-mix(in srgb,var(--game-success) 62%,var(--game-border));background:var(--game-node-passed);color:var(--game-node-passed-text)}
body.tq-game-active .t1TrailNode.current{border-color:#e3aa35;background:var(--game-node-current);color:var(--game-node-current-text);box-shadow:0 0 0 5px rgba(236,176,47,.2),0 8px 18px var(--game-shadow-strong)}
body.tq-game-active .t1TrailNode.path-choice{border-color:#557dd8;background:var(--game-node-choice);color:var(--game-node-choice-text)}
body.tq-game-active .t1TrailNode.boss{border-color:#ca7093;background:var(--game-node-boss);color:var(--game-node-boss-text)}
body.tq-game-active .t1RunSlot{min-width:0;min-height:62px;border-color:var(--game-border);background:var(--game-surface);color:var(--game-ink);padding:8px;box-shadow:0 5px 14px var(--game-shadow)}
body.tq-game-active .t1RunSlot i{width:34px;height:34px;background:var(--game-accent-soft);font-size:14px}
body.tq-game-active .t1RunSlot b{color:var(--game-ink);font-size:10px}
body.tq-game-active .t1RunSlot small{color:var(--game-muted);font-size:10px}
body.tq-game-active .t1DiceButton{min-height:64px;background:linear-gradient(135deg,#ff9e35,#ff744f);box-shadow:0 10px 23px rgba(224,105,47,.25)}
body.tq-game-active .malbitBattleScreen>.card{border-color:var(--game-border);background:var(--game-surface);color:var(--game-ink);box-shadow:0 14px 32px var(--game-shadow-strong)}
body.tq-game-active .t1GameBattle{border-color:var(--game-border);background:linear-gradient(145deg,var(--game-surface-raised),var(--game-surface-soft));color:var(--game-ink);box-shadow:none}
body.tq-game-active .t1BattleCopy b{color:var(--game-ink)}
body.tq-game-active .t1BattleCopy small{color:var(--game-muted);font-size:10px}
/* Legacy cascade bridge: v24/v33 use important declarations; keep this list fixed and tested. */
body.tq-game-active .t1TrailRoute{height:774px!important}
body.tq-game-active .t1TrailGrid{height:720px!important;background:linear-gradient(var(--game-map-wash-a),var(--game-map-wash-b)),url('assets/art/malbit-stage-map.webp') center/100% 100% no-repeat!important}
body.tq-game-active .t1TrailNode{width:34px!important;height:34px!important;border-width:2px!important;background:var(--game-node)!important;color:var(--game-node-text)!important}
body.tq-game-active .t1TrailNode.unknown{background:var(--game-node)!important}
body.tq-game-active .t1TrailNode.passed{background:var(--game-node-passed)!important}
body.tq-game-active .t1TrailNode.current{background:var(--game-node-current)!important}
body.tq-game-active .t1TrailNode.path-choice{background:var(--game-node-choice)!important}
body.tq-game-active .t1TrailNode.path-choice{width:var(--ui-touch)!important;height:var(--ui-touch)!important}
body.tq-game-active .t1TrailNode.boss{background:var(--game-node-boss)!important}
body.tq-game-active .t1TrailStats span{padding:7px 8px!important}
@media(max-width:380px){body.tq-game-active{--ui-page-pad:12px}body.tq-game-active .t1GameLoadout{gap:6px}body.tq-game-active .t1GameGear{min-height:112px;padding:10px 6px}body.tq-game-active .t1TrailTop{grid-template-columns:var(--ui-touch) minmax(54px,1fr) auto}body.tq-game-active .t1TrailTop h1{font-size:15px}body.tq-game-active .t1TrailStats{max-width:195px;gap:3px}body.tq-game-active .t1TrailStats span{padding:6px!important}body.tq-game-active .t1RunLoadout{grid-template-columns:1fr}body.tq-game-active .t1RunSlot{min-height:58px}}
`;
document.head.appendChild(style);
})();
