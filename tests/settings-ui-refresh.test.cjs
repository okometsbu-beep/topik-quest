const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const hub=read('learning-hub.js'),skin=read('harumal-ui.css'),css=read('learning-hub.css');
function declaration(source,name,next){return source.slice(source.indexOf('function '+name+'('),source.indexOf('\n'+next,source.indexOf('function '+name+'(')))}
function controls(lang){
 const c={S:{lang},window:{HARUMAL_UI:{}},h:value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))};
 c.L=(ko,ja,en,zh)=>({ko,ja,en,zh}[c.S.lang]||en);vm.createContext(c);
 vm.runInContext(declaration(read('harumal-ui.js'),'languageFlag','const icon'),c);
 c.window.HARUMAL_UI.languageFlag=c.languageFlag;
 vm.runInContext(declaration(hub,'gear','function languagePicker'),c);
 vm.runInContext(declaration(hub,'languagePicker','function chrome'),c);
 return c;
}
test('settings use four vector flags with localized names and exactly one selected language',()=>{
 const names={ko:['한국어','일본어','영어','중국어'],ja:['韓国語','日本語','英語','中国語'],en:['Korean','Japanese','English','Chinese'],zh:['韩语','日语','英语','中文']};
 for(const lang of Object.keys(names)){
  const markup=controls(lang).languagePicker(),buttons=[...markup.matchAll(/<button\b([^>]+)>([\s\S]*?)<\/button>/g)];
  assert.equal(buttons.length,4);
  assert.match(markup,/role="group" aria-labelledby="hubLanguageLabel"/);
  buttons.forEach(([_,attrs,inside],index)=>{
   const id=['ko','ja','en','zh'][index];
   assert.ok(attrs.includes(`data-hub-language="${id}"`));
   assert.ok(attrs.includes(`aria-label="${names[lang][index]}"`));
   assert.ok(attrs.includes(`aria-pressed="${id===lang}"`));
   assert.ok(attrs.includes(`onclick="malbitSetLanguage('${id}')"`));
   assert.match(inside,/<svg[^>]*viewBox="0 0 36 24"[^>]*aria-hidden="true"[^>]*focusable="false"/);
   assert.ok(!inside.includes(names[lang][index]),'language name is accessible rather than visible text');
  });
  assert.equal((markup.match(/aria-pressed="true"/g)||[]).length,1);
  assert.doesNotMatch(markup,/<select|<option/);
 }
 assert.match(read('harumal-ui.js'),/Object\.freeze\(\{activeTab,languageFlag\}\)/);
});
test('settings gear has eight balanced teeth, a centered hole and fixed square layout',()=>{
 const svg=controls('ko').gear();
 assert.match(svg,/width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"/);
 assert.match(svg,/<circle cx="12" cy="12" r="3.25"/);
 assert.match(svg,/stroke-linejoin="round"/);
 const points=svg.match(/points="([^"]+)"/)[1].split(' ').map(pair=>pair.split(',').map(Number));
 assert.equal(points.length,32);
 for(const [x,y] of points){
  assert.ok(points.some(([a,b])=>Math.abs(a-(24-y))<.015&&Math.abs(b-x)<.015),'each tooth has a quarter-turn counterpart');
  assert.ok(x>1&&x<23&&y>1&&y<23,'outline fits inside the drawing box');
 }
 assert.match(css,/\.harumalSettingsTrigger>svg\{[^}]*width:24px;height:24px;[^}]*flex:0 0 24px;aspect-ratio:1/);
 assert.match(css,/\.harumalSettingsTrigger\{[^}]*width:44px;height:44px;min-width:44px;flex:none/);
});
test('flag choices remain touch-sized and show selection beyond color',()=>{
 assert.match(css,/\.hubLanguageOptions\{[^}]*repeat\(4,minmax\(44px,1fr\)\)/);
 assert.match(css,/\.hubLanguageOption\{[^}]*min-width:44px;min-height:48px/);
 assert.match(css,/\.hubLanguageOption\[aria-pressed="true"\] \.hubLanguageCheck\{visibility:visible\}/);
 assert.match(css,/\.hubLanguageOption\[aria-pressed="true"\]\{[^}]*background:var\(--ui-accent-soft\)/);
 assert.match(hub,/focusKey/,'settings rerender preserves active control');
});
test('shared settings and learner surfaces use theme tokens without recoloring answer states',()=>{
 for(const selector of ['.t1head','.t1result','.progress i','.t1bar i','.malbitDataButtons label','.v33BeginnerTabs','.v33ReadingWord','.bgResume>span'])assert.ok(skin.includes(selector),selector+' has a shared theme rule');
 assert.match(skin,/\.choice:not\(\.correct\):not\(\.wrong\)\{background:var\(--ui-surface\);color:var\(--ui-ink\);border-color:var\(--ui-border\)/);
 assert.match(skin,/\.choice\.selected:not\(\.correct\):not\(\.wrong\)\{background:var\(--ui-accent-soft\)/);
 assert.match(skin,/\.malbitSupport button\.danger\{background:var\(--ui-error-soft\);color:var\(--ui-error\)/);
 assert.match(skin,/\.bgLessonHero\.complete\{background:var\(--ui-success-soft\);color:var\(--ui-success\)/);
 assert.doesNotMatch(skin,/#f2f6ff/,'old fixed navy header ink is removed');
});
test('mobile browser regressions operate visible flags and preserve settings/learning state',()=>{
 for(const file of ['scripts/three-tab-redesign-checks.mjs','scripts/writing-usability-checks.mjs']){
  const script=read(file);assert.match(script,/data-hub-language/);assert.match(script,/aria-pressed/);assert.doesNotMatch(script,/select\[onchange="malbitSetLanguage/);
 }
 assert.match(read('scripts/three-tab-redesign-checks.mjs'),/gear\.svgWidth,24/);
 assert.match(read('scripts/writing-usability-checks.mjs'),/language selection preserves attempts, drafts and guided pointer/);
});
