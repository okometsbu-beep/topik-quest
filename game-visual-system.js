// MALBIT Game Mode visual system · one final owner for expedition geometry and surfaces.
(function(){
'use strict';
if(document.getElementById('malbitGameVisualSystem'))return;
const style=document.createElement('style');
style.id='malbitGameVisualSystem';
style.textContent=`
body.tq-game-active{--game-canvas:#f2f5fa;--game-surface:var(--ui-surface);--game-surface-soft:var(--ui-surface-soft);--game-border:var(--ui-border);--game-ink:var(--ui-ink);--game-muted:var(--ui-muted);--game-accent:var(--ui-accent);--game-accent-soft:#e8ecff;--game-success:#13745e;--game-success-soft:#e4f6ef;--game-warning:#9a5d13;--game-warning-soft:#fff4dc;background:var(--game-canvas);color:var(--game-ink)}
body.tq-game-active .app{max-width:480px;background:var(--game-canvas)}
body.tq-game-active .screen{max-width:480px;padding:calc(var(--ui-space-3) + env(safe-area-inset-top)) var(--ui-page-pad) calc(var(--ui-space-6) + env(safe-area-inset-bottom))}
body.tq-game-active .tqGameNav{grid-template-columns:var(--ui-touch) minmax(0,1fr) var(--ui-touch);gap:var(--ui-space-2);margin-bottom:var(--ui-space-3)}
body.tq-game-active .tqGameNav>button,body.tq-game-active .t1TrailTop>button{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--game-border);border-radius:var(--ui-radius-control);background:var(--game-surface);color:var(--game-ink);box-shadow:0 5px 14px rgba(34,54,82,.08)}
body.tq-game-active .tqGameNav h1{justify-self:center;color:var(--game-ink);font-size:20px;text-align:center}
body.tq-game-active .tqGameNavActions{justify-self:end;width:var(--ui-touch)}
body.tq-game-active .tqGameNavActions .tqGameLevel{display:none}
body.tq-game-active .tqGameNavActions .t1ModeLang{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--game-border);border-radius:var(--ui-radius-control);background:var(--game-surface)}
body.tq-game-active .tqGameArena{border-color:#b8cbe0;background:var(--game-surface-soft);box-shadow:0 16px 34px rgba(35,55,82,.16)}
body.tq-game-active .tqGameMission{border-color:#3d6388;background:linear-gradient(145deg,#214568,#173653);box-shadow:0 14px 26px rgba(30,55,84,.2)}
body.tq-game-active .tqGameMission small{font-size:var(--ui-font-caption);color:#a9ceff}
body.tq-game-active .tqGameMission h2{color:#fff}
body.tq-game-active .tqGameStart{min-height:48px;background:linear-gradient(135deg,#506bf0,#765bea);box-shadow:0 10px 24px rgba(76,88,220,.28)}
body.tq-game-active .t1GameMetaRow,body.tq-game-active .tqGameWorldNav{color:var(--game-ink)}
body.tq-game-active .t1GameMetaRow>b,body.tq-game-active .tqGameWorldNav>b{font-size:12px}
body.tq-game-active .t1GameGear{min-width:0;min-height:116px;border:1px solid var(--game-border);border-radius:18px;background:var(--game-surface);color:var(--game-ink);padding:12px 8px;box-shadow:0 7px 18px rgba(37,57,84,.08)}
body.tq-game-active .t1GameGear i{width:38px;height:38px;border-radius:12px;background:var(--game-accent-soft);color:#394fc9;font-size:18px}
body.tq-game-active .t1GameGear b{margin-top:8px;color:var(--game-ink);font-size:11px;line-height:1.35}
body.tq-game-active .t1GameGear small{margin-top:4px;color:var(--game-muted);font-size:10px;line-height:1.4}
body.tq-game-active .t1RarityLegend{gap:6px}
body.tq-game-active .t1RarityLegend span{min-height:28px;border-color:var(--game-border);background:var(--game-surface);color:var(--game-muted);font-size:10px}
body.tq-game-active .t1RunRule{border-color:#efc9d1;background:#fff2f4;color:#843b4d;font-size:10px;line-height:1.55}
body.tq-game-active .tqGameWorldNav{border-bottom-color:#b9c7d8}
body.tq-game-active .tqGameStage{min-width:var(--ui-touch);min-height:var(--ui-touch);border-color:#c9d5e3;background:#e5ebf3;color:#607188;box-shadow:inset 0 1px 0 rgba(255,255,255,.75)}
body.tq-game-active .tqGameStage.on{border-color:#5367df;background:#6174ee;color:#fff;box-shadow:0 0 0 3px rgba(83,103,223,.13)}
body.tq-game-active .tqGameStage.clear{border-color:#77bea6;background:var(--game-success-soft);color:var(--game-success)}
body.tq-game-active .tqGameStage:disabled{opacity:.72}
body.tq-game-active .tqGameStage small{font-size:10px}
body.tq-game-active .tqGameTts{border-color:var(--game-border);background:var(--game-surface-soft);color:var(--game-muted);font-size:10px}
body.tq-game-active .t1TrailScreen{color:var(--game-ink)}
body.tq-game-active .t1TrailTop{grid-template-columns:var(--ui-touch) minmax(0,1fr) auto;gap:var(--ui-space-2);margin-bottom:var(--ui-space-3)}
body.tq-game-active .t1TrailTop h1{color:var(--game-ink);font-size:17px}
body.tq-game-active .t1TrailTop small{color:var(--game-muted);font-size:10px}
body.tq-game-active .t1TrailStats{gap:5px;max-width:214px}
body.tq-game-active .t1TrailStats span,body.tq-game-active #screen .t1hud>span{min-height:var(--ui-touch);border:1px solid var(--game-border);border-radius:var(--ui-radius-control);background:var(--game-surface);color:var(--game-ink);font-size:10px;box-shadow:0 4px 12px rgba(35,55,82,.07)}
body.tq-game-active .t1TrailStats .t1ModeLang{width:var(--ui-touch);height:var(--ui-touch);border:1px solid var(--game-border);background:var(--game-surface);font-size:19px}
body.tq-game-active .t1TrailBoard{border-color:#b8cadc;background:var(--game-surface-soft);box-shadow:0 16px 34px rgba(35,55,82,.16)}
body.tq-game-active .t1TrailScene{border-bottom-color:#9fb5cd}
body.tq-game-active .t1TrailRoute{background:#dfe9f2}
body.tq-game-active .t1TrailGrid{border:1px solid #a9bfd1;filter:brightness(1.14) saturate(.9) contrast(.94);box-shadow:inset 0 0 28px rgba(56,93,122,.18)}
body.tq-game-active .t1TrailNode{border-color:#7aa3bf;background:#e9f2f8;color:#244d68;box-shadow:0 5px 12px rgba(31,66,91,.24),inset 0 0 0 2px rgba(255,255,255,.66)}
body.tq-game-active .t1TrailNode.unknown{border-color:#7aa3bf;background:#e9f2f8;color:#244d68}
body.tq-game-active .t1TrailNode.passed{border-color:#54a98c;background:#e2f6ee;color:#126f58}
body.tq-game-active .t1TrailNode.current{border-color:#e3aa35;background:#fff0bd;color:#68420a;box-shadow:0 0 0 5px rgba(236,176,47,.2),0 8px 18px rgba(55,74,92,.24)}
body.tq-game-active .t1TrailNode.path-choice{border-color:#557dd8;background:#e6edff;color:#244caa}
body.tq-game-active .t1TrailNode.boss{border-color:#ca7093;background:#ffe6ef;color:#8c3156}
body.tq-game-active .t1RunSlot{min-width:0;min-height:62px;border-color:#b9c9da;background:var(--game-surface);color:var(--game-ink);padding:8px;box-shadow:0 5px 14px rgba(35,55,82,.07)}
body.tq-game-active .t1RunSlot i{width:34px;height:34px;background:var(--game-accent-soft);font-size:14px}
body.tq-game-active .t1RunSlot b{color:var(--game-ink);font-size:10px}
body.tq-game-active .t1RunSlot small{color:var(--game-muted);font-size:10px}
body.tq-game-active .t1DiceButton{min-height:64px;background:linear-gradient(135deg,#ff9e35,#ff744f);box-shadow:0 10px 23px rgba(224,105,47,.25)}
body.tq-game-active .malbitBattleScreen>.card{border-color:var(--game-border);box-shadow:0 14px 32px rgba(35,55,82,.14)}
body.tq-game-active .t1GameBattle{border-color:#b9cde0;background:linear-gradient(145deg,#e8f1f8,#dbe8f3);color:var(--game-ink);box-shadow:none}
body.tq-game-active .t1BattleCopy b{color:var(--game-ink)}
body.tq-game-active .t1BattleCopy small{color:var(--game-muted);font-size:10px}
/* Legacy cascade bridge: v24/v33 use important declarations; keep this list fixed and tested. */
body.tq-game-active .t1TrailRoute{height:774px!important}
body.tq-game-active .t1TrailGrid{height:720px!important;background:linear-gradient(rgba(235,244,249,.12),rgba(219,234,243,.18)),url('assets/art/malbit-stage-map.webp') center/100% 100% no-repeat!important}
body.tq-game-active .t1TrailNode{width:34px!important;height:34px!important;border-width:2px!important;background:#e9f2f8!important;color:#244d68!important}
body.tq-game-active .t1TrailNode.unknown{background:#e9f2f8!important}
body.tq-game-active .t1TrailNode.passed{background:#e2f6ee!important}
body.tq-game-active .t1TrailNode.current{background:#fff0bd!important}
body.tq-game-active .t1TrailNode.path-choice{background:#e6edff!important}
body.tq-game-active .t1TrailNode.path-choice{width:var(--ui-touch)!important;height:var(--ui-touch)!important}
body.tq-game-active .t1TrailNode.boss{background:#ffe6ef!important}
body.tq-game-active .t1TrailStats span{padding:7px 8px!important}
@media(max-width:380px){body.tq-game-active{--ui-page-pad:12px}body.tq-game-active .t1GameLoadout{gap:6px}body.tq-game-active .t1GameGear{min-height:112px;padding:10px 6px}body.tq-game-active .t1TrailTop{grid-template-columns:var(--ui-touch) minmax(54px,1fr) auto}body.tq-game-active .t1TrailTop h1{font-size:15px}body.tq-game-active .t1TrailStats{max-width:195px;gap:3px}body.tq-game-active .t1TrailStats span{padding:6px!important}body.tq-game-active .t1RunLoadout{grid-template-columns:1fr}body.tq-game-active .t1RunSlot{min-height:58px}}
`;
document.head.appendChild(style);
})();
