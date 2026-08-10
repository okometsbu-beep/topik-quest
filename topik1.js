// TOPIK QUEST · TOPIK I engine v2 · full UI localization
(function(){
'use strict';
const L=window.TOPIK1_LISTENING_DATA||[],R=window.TOPIK1_READING_DATA||[],A=[...L,...R];
if(!A.length){console.error('TOPIK I data missing');return}
const LEVEL='topikQuestExamLevel',SESSION='topikQuestTopik1Session',SHORTS_KEY='topikQuestShortsV1',EXT=['mp3','m4a','aac','webm','ogg'];
const SHORTS=[
  {type:'word',term:'미루다',meaning:{ko:'해야 할 일을 나중으로 넘기다',ja:'先延ばしにする',en:'to put off until later',zh:'推迟；拖延'},example:'할 일을 내일로 미루지 마세요.'},
  {type:'idiom',term:'마음에 들다',meaning:{ko:'좋게 생각하거나 만족스럽게 느끼다',ja:'気に入る',en:'to like or be pleased with',zh:'中意；喜欢'},example:'이 가방이 아주 마음에 들어요.'},
  {type:'idiom',term:'눈에 띄다',meaning:{ko:'두드러져 쉽게 보이다',ja:'目立つ',en:'to stand out or catch the eye',zh:'显眼；引人注目'},example:'빨간 우산이 멀리서도 눈에 띄어요.'},
  {type:'grammar',term:'-는 바람에',meaning:{ko:'예상하지 못한 원인으로 나쁜 결과가 생김',ja:'～したせいで',en:'because of an unexpected negative cause',zh:'因为意外原因而导致不好的结果'},example:'버스를 놓치는 바람에 지각했어요.'},
  {type:'grammar',term:'-더라도',meaning:{ko:'어떤 상황을 가정해도 뒤의 내용이 달라지지 않음',ja:'～しても／～であっても',en:'even if or even though',zh:'即使；哪怕'},example:'비가 오더라도 약속은 지킬게요.'},
  {type:'word',term:'꼼꼼하다',meaning:{ko:'작은 부분까지 주의 깊고 빈틈이 없다',ja:'几帳面だ／念入りだ',en:'meticulous and thorough',zh:'仔细；一丝不苟'},example:'그분은 일을 아주 꼼꼼하게 해요.'},
  {type:'word',term:'익숙하다',meaning:{ko:'자주 경험해서 낯설지 않다',ja:'慣れている',en:'to be familiar or accustomed',zh:'熟悉；习惯'},example:'이제 한국 생활에 익숙해졌어요.'},
  {type:'grammar',term:'-(으)ㄹ 뿐만 아니라',meaning:{ko:'앞의 내용에 뒤의 내용을 더함',ja:'～だけでなく',en:'not only ... but also',zh:'不仅……而且……'},example:'이 식당은 맛있을 뿐만 아니라 가격도 싸요.'},
  {type:'idiom',term:'손이 크다',meaning:{ko:'음식이나 물건을 넉넉하게 많이 준비하다',ja:'気前がよく、たくさん用意する',en:'to prepare things very generously',zh:'出手大方；准备得很多'},example:'우리 할머니는 손이 커서 음식을 많이 만드세요.'},
  {type:'grammar',term:'-(으)ㄴ/는 척하다',meaning:{ko:'실제로는 아니지만 그런 것처럼 행동하다',ja:'～ふりをする',en:'to pretend to be or do',zh:'假装……'},example:'알면서도 모르는 척했어요.'},
  {type:'word',term:'아쉽다',meaning:{ko:'원하거나 기대한 만큼 되지 않아 안타깝다',ja:'心残りだ／残念だ',en:'to feel regretful or disappointed',zh:'遗憾；可惜'},example:'시간이 없어서 더 이야기하지 못해 아쉬워요.'},
  {type:'word',term:'챙기다',meaning:{ko:'필요한 것을 빠뜨리지 않고 준비하거나 돌보다',ja:'忘れずに用意する／面倒を見る',en:'to make sure to prepare or take care of',zh:'备齐；照顾'},example:'여권을 꼭 챙기세요.'},
  {type:'idiom',term:'기분이 풀리다',meaning:{ko:'화나거나 불편했던 마음이 좋아지다',ja:'機嫌が直る／気が晴れる',en:'to feel better after being upset',zh:'心情好转；消气'},example:'친구의 사과를 듣고 기분이 풀렸어요.'},
  {type:'grammar',term:'-기 마련이다',meaning:{ko:'일반적으로 당연히 그렇게 되는 경향이 있음',ja:'当然～するものだ',en:'to be bound or naturally expected to',zh:'总会……；理所当然会……'},example:'처음에는 누구나 실수하기 마련이에요.'},
  {type:'word',term:'부담스럽다',meaning:{ko:'책임이나 기대가 무겁게 느껴져 편하지 않다',ja:'負担に感じる',en:'to feel burdensome or pressured',zh:'感到有负担；有压力'},example:'너무 비싼 선물은 조금 부담스러워요.'}
];
let Q=null,timer=null,audio=null,ctx=null;
const E=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const T=(ko,ja,en,zh)=>typeof ml==='function'?ml(ko,ja,en,zh):ko;
const level=()=>{try{return localStorage.getItem(LEVEL)==='1'?1:2}catch(e){return 2}};
window.tqSetLevel=n=>{try{localStorage.setItem(LEVEL,String(n))}catch(e){};render()};
function stopAudio(){try{speechSynthesis.cancel()}catch(e){};if(audio){try{audio.pause();audio.currentTime=0}catch(e){}audio=null}}
function stopTimer(){if(timer){clearInterval(timer);timer=null}}
function open(v){stopAudio();stopTimer();S.view=v;try{save()}catch(e){};render()}
function find(id){return A.find(x=>x.id===Number(id))}
function pool(k){return k==='listening'?L:k==='reading'?R:A}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function clock(s){s=Math.max(0,Math.floor(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function secName(sec){return sec==='listening'?T('듣기','聞き取り','Listening','听力'):T('읽기','読解','Reading','阅读')}
function groupName(g){
  const M={
    '응답':['응답','応答','Response','应答'],'장소':['장소','場所','Place','场所'],'내용':['내용','内容','Content','内容'],'안내':['안내','案内','Notice','通知'],'목적':['목적','目的','Purpose','目的'],'중심':['중심 생각','中心内容','Main idea','中心思想'],'세부':['세부 내용','詳細内容','Detail','细节'],'긴 대화':['긴 대화','長い会話','Long dialogue','长对话'],
    '어휘·문법':['어휘·문법','語彙・文法','Vocabulary & Grammar','词汇·语法'],'표지·안내':['표지·안내','標識・案内','Signs & Notices','标识·通知'],'광고':['광고','広告','Advertisement','广告'],'짧은 글':['짧은 글','短文','Short passage','短文'],'빈칸':['빈칸','空欄補充','Fill in the blank','填空'],'순서':['문장 순서','文の順序','Sentence order','句子顺序'],'중심 내용':['중심 내용','中心内容','Main idea','中心内容'],'긴 글':['긴 글','長文','Long passage','长文']
  };
  const a=M[g];return a?T(...a):g;
}
function instructionText(q){
  if((S?.lang||'ko')==='ko')return q.instruction||'';
  if(q.section==='listening'){
    if(q.group==='응답')return T('', '音声を聞いて、続く言葉として最も適切なものを選んでください。','Listen and choose the most appropriate response.','请听录音，选择最恰当的回答。');
    if(q.group==='장소')return T('', '音声を聞いて、場所として最も適切なものを選んでください。','Listen and choose the most appropriate place.','请听录音，选择最恰当的场所。');
    if(q.group==='내용')return T('', '音声を聞いて、内容と一致するものを選んでください。','Listen and choose the statement that matches the content.','请听录音，选择与内容相符的一项。');
    if(q.group==='목적')return T('', '音声を聞いて、話し手の目的として最も適切なものを選んでください。','Listen and choose the speaker’s purpose.','请听录音，选择说话人的目的。');
    if(q.group==='중심')return T('', '音声を聞いて、中心内容として最も適切なものを選んでください。','Listen and choose the main idea.','请听录音，选择中心内容。');
    return T('', '音声を聞いて、質問に最も適切な答えを選んでください。','Listen and choose the best answer.','请听录音，选择最恰当的答案。');
  }
  if(q.group==='어휘·문법'||q.group==='빈칸')return T('', '空欄に入る最も適切なものを選んでください。','Choose the best answer for the blank.','请选择最适合填入空格的一项。');
  if(q.group==='순서')return T('', '文の順序として最も適切なものを選んでください。','Choose the most appropriate sentence order.','请选择最恰当的句子顺序。');
  return T('', '次の文を読んで、最も適切な答えを選んでください。','Read the passage and choose the best answer.','阅读下面的内容，选择最恰当的答案。');
}
function explainText(q){
  if((S?.lang||'ko')==='ko')return q.explanation||'';
  return T('',`正解は${q.answerIndex+1}番です。設問と選択肢をもう一度確認してください。`,`The correct answer is option ${q.answerIndex+1}. Review the question and choices.`,`正确答案是第${q.answerIndex+1}项。请再次确认题目和选项。`);
}
async function fileAudio(id){const n=String(id).padStart(3,'0');for(const x of EXT){const u=`audio/topik1/q${n}.${x}`;try{const r=await fetch(u,{method:'HEAD',cache:'no-store'});if(r.ok)return u}catch(e){}}return null}
function tts(txt){stopAudio();const lines=String(txt||'').replace(/^(여자|남자|안내|방송|여자\(안내\)|남자\(안내\)|여자\(설명\)|남자\(설명\)):\s*/gm,'').split(/\n+/).map(x=>x.trim()).filter(Boolean);let i=0,token=Date.now();window.__t1tts=token;const next=()=>{if(window.__t1tts!==token||i>=lines.length)return;const u=new SpeechSynthesisUtterance(lines[i++]);u.lang='ko-KR';u.rate=.91;u.pitch=1;try{const vs=speechSynthesis.getVoices().filter(v=>/^ko/i.test(v.lang));if(vs.length)u.voice=vs[(i-1)%vs.length]}catch(e){}u.onend=()=>setTimeout(next,230);u.onerror=()=>setTimeout(next,80);speechSynthesis.speak(u)};next()}
async function play(id){const q=find(id);if(!q)return;if(Q?.mode==='real'&&Q.played?.[id]){toast(T('실전 듣기는 한 번만 재생할 수 있습니다.','実戦の聞き取り音声は1回だけ再生できます。','Listening audio can be played only once in Exam Mode.','实战模式的听力音频只能播放一次。'));return}if(Q?.mode==='real'){Q.played[id]=1;saveQ();render()}stopAudio();const url=await fileAudio(id);if(!url)return tts(q.script);try{const a=new Audio(url+'?v='+Date.now());audio=a;try{const AC=window.AudioContext||window.webkitAudioContext;if(AC){ctx=ctx||new AC();if(ctx.state==='suspended')await ctx.resume();const s=ctx.createMediaElementSource(a),g=ctx.createGain(),c=ctx.createDynamicsCompressor();g.gain.value=1.3;c.threshold.value=-8;c.ratio.value=5;s.connect(g).connect(c).connect(ctx.destination)}}catch(e){}a.onended=()=>audio=null;await a.play()}catch(e){tts(q.script)}}
window.t1Play=play;
function saveQ(){try{localStorage.setItem(SESSION,JSON.stringify(Q))}catch(e){}}
function clearQ(){Q=null;try{localStorage.removeItem(SESSION)}catch(e){}}
function restore(){if(Q)return Q;try{Q=JSON.parse(localStorage.getItem(SESSION)||'null')}catch(e){};return Q}
function seconds(){return Q?.duration?Q.duration-Math.floor((Date.now()-Q.started)/1000):999999}
window.tqStartMode=mode=>{markHomeActivity();if(level()===2){if(mode==='real')return setView('realSetup');if(mode==='game')return setView('game');return startInfinity()}if(mode==='real')return open('t1setup');if(mode==='game')return startPractice('game');return startPractice('inf')};
window.tqHomeContinue=()=>{
  markHomeActivity();
  if(level()===1){
    const session=restore();
    if(session&&!session.result)return open('t1quiz');
    return startPractice('game');
  }
  if(S.real?.active){S.view='real';save();return render()}
  return setView('game');
};
const css=document.createElement('style');
css.textContent=`.t1level{display:grid;grid-template-columns:1fr 1fr;gap:5px;background:#0d192b;border:1px solid #273b5a;border-radius:17px;padding:5px;margin:0 0 10px}.t1level button{border:0;border-radius:13px;padding:10px 5px;background:transparent;color:#8296b4;font-size:11px;font-weight:900}.t1level button.on{background:linear-gradient(135deg,#4e86ff,#8065ff);color:#fff}.t1setup{display:grid;gap:9px}.t1setup button{border:1px solid #2c4264;background:linear-gradient(145deg,#102039,#172b49);color:#fff;border-radius:21px;padding:16px;text-align:left}.t1setup b{font-size:16px}.t1setup small{float:right;color:#87b4ff}.t1setup p{font-size:10px;color:#9db1ce;line-height:1.5;margin:6px 0 0}.t1head{background:#0d1b30;border:1px solid #2b4164;border-radius:19px;padding:12px;margin-bottom:10px}.t1head>div{display:flex;justify-content:space-between;align-items:center}.t1head strong{font-size:21px}.t1bar{height:6px;background:#182941;border-radius:99px;overflow:hidden;margin-top:8px}.t1bar i{display:block;height:100%;background:linear-gradient(90deg,#4d9cff,#8c70ff)}.t1audio{width:100%;border:0;border-radius:15px;padding:13px;background:#152d50;color:#fff;font-weight:900;margin-bottom:11px}.t1nav{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.t1nav button{border:0;border-radius:14px;padding:13px;font-weight:900}.t1nav .p{background:#e9eef6;color:#34445d}.t1nav .n{background:#286cff;color:#fff}.t1hud{display:flex;gap:6px;overflow:auto;margin-bottom:9px}.t1hud span{white-space:nowrap;background:#10213a;border:1px solid #2d4669;border-radius:99px;padding:7px 10px;font-size:10px;color:#c7d7ed}.t1result{background:linear-gradient(150deg,#11233e,#1b3154);border:1px solid #34517d;border-radius:24px;padding:18px}.t1score{font-size:44px;font-weight:950;margin:13px 0}.t1score small{font-size:14px;color:#9fb4d1}.t1split{display:grid;grid-template-columns:1fr 1fr;gap:8px}.t1split div{background:#0d1b30;border-radius:15px;padding:12px}.t1split b{display:block;font-size:20px}.t1wrong{display:flex;flex-wrap:wrap;gap:5px;margin-top:11px}.t1wrong span{padding:5px 7px;border-radius:9px;background:#48212c;color:#ffcad2;font-size:9px}`;
document.head.appendChild(css);
const homeCss=document.createElement('style');
homeCss.textContent=`
body.tq-home-active,body.tq-stats-active,body.tq-shorts-active{background:#f4f6fb;color:#19233a}
body.tq-home-active .app,body.tq-stats-active .app,body.tq-shorts-active .app{max-width:480px;background:#f4f6fb}
body.tq-home-active .top,body.tq-stats-active .top,body.tq-shorts-active .top{display:none}
body.tq-home-active .screen,body.tq-stats-active .screen{max-width:480px;margin:auto;padding:calc(15px + env(safe-area-inset-top)) 15px 26px}
body.tq-home-active .bottom,body.tq-stats-active .bottom{background:rgba(255,255,255,.97);border-top:1px solid #e8eaf2;box-shadow:0 -10px 28px rgba(55,64,99,.07)}
body.tq-home-active .nav,body.tq-stats-active .nav{max-width:480px}
body.tq-home-active .nav button,body.tq-stats-active .nav button{color:#9298a8}
body.tq-home-active .nav button.active,body.tq-stats-active .nav button.active{background:#eef0ff;color:#514cff}
body.tq-shorts-active{padding-bottom:0}
body.tq-shorts-active .bottom{display:none}
body.tq-shorts-active .screen{max-width:480px;min-height:100vh;margin:auto;padding:calc(14px + env(safe-area-inset-top)) 15px calc(18px + env(safe-area-inset-bottom))}
.tqHomeHeader{display:flex;align-items:center;justify-content:space-between;margin:3px 1px 14px}.tqHomeLogo{font-size:23px;font-weight:1000;letter-spacing:-.055em;color:#3434a9}.tqHomeMeta{display:flex;align-items:center;gap:7px}.tqStreak{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #fff;color:#ff643f;border-radius:999px;padding:8px 11px;font-size:11px;font-weight:950;box-shadow:0 7px 20px rgba(44,50,85,.08)}.tqLang{width:38px;height:38px;border:0;border-radius:50%;background:#fff;font-size:20px;box-shadow:0 7px 20px rgba(44,50,85,.1)}
.tqHomeScreen .t1level{background:#fff;border:0;border-radius:18px;padding:4px;margin-bottom:12px;box-shadow:0 7px 20px rgba(44,50,85,.08)}.tqHomeScreen .t1level button{color:#888e9f;border-radius:14px;padding:10px 5px}.tqHomeScreen .t1level button.on{background:linear-gradient(135deg,#514cff,#7659f8);color:#fff;box-shadow:0 8px 18px rgba(86,76,246,.24)}
.tqDailyHero{position:relative;overflow:hidden;min-height:172px;border-radius:25px;background:linear-gradient(135deg,#4d50ee,#8a5ff5);padding:19px;color:#fff;box-shadow:0 17px 34px rgba(80,73,221,.25)}.tqDailyHero:before{content:'';position:absolute;width:185px;height:185px;border-radius:50%;right:-63px;top:-64px;background:rgba(255,255,255,.1)}.tqHeroMascot{position:absolute;right:13px;bottom:9px;width:91px;height:91px;border-radius:31px;background:rgba(255,255,255,.95);display:grid;place-items:center;font-size:57px;transform:rotate(3deg);box-shadow:0 13px 24px rgba(32,22,110,.23)}.tqDailyCopy{position:relative;z-index:2;width:69%}.tqDailyCopy small{font-size:9px;font-weight:900;letter-spacing:.08em;color:#dcdcff}.tqDailyCopy h1{font-size:23px;line-height:1.12;letter-spacing:-.05em;margin:8px 0 4px}.tqDailyCopy p{font-size:10px;color:#e9e9ff;margin:0}.tqWeek{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-top:15px}.tqWeek i{height:7px;border-radius:99px;background:rgba(255,255,255,.22)}.tqWeek i.on{background:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.13)}
.tqShortsLaunch{width:100%;min-height:126px;border:0;border-radius:24px;margin:12px 0;background:linear-gradient(135deg,#ff625b,#ff923b);color:#fff;padding:17px;text-align:left;display:grid;grid-template-columns:60px 1fr auto;gap:13px;align-items:center;box-shadow:0 16px 31px rgba(255,102,74,.24)}.tqShortsPlay{width:58px;height:58px;border-radius:50%;background:#fff;color:#ff6357;display:grid;place-items:center;font-size:24px;box-shadow:0 8px 20px rgba(167,45,36,.22)}.tqShortsLaunch b{display:block;font-size:22px;letter-spacing:-.04em}.tqShortsLaunch small{display:block;font-size:10px;line-height:1.5;margin-top:5px;color:#fff1ed}.tqShortsGo{background:#fff;color:#ff633e;padding:10px 12px;border-radius:14px;font-size:10px;font-weight:950;white-space:nowrap}
.tqCoreGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tqCoreMode{min-height:128px;border:0;border-radius:22px;padding:15px;color:#fff;text-align:left;position:relative;overflow:hidden;box-shadow:0 12px 24px rgba(48,57,100,.14)}.tqCoreMode:after{content:'';position:absolute;width:76px;height:76px;border-radius:26px;right:-17px;bottom:-18px;background:rgba(255,255,255,.14);transform:rotate(22deg)}.tqCoreMode .mi{font-size:29px;display:block;margin-bottom:13px;filter:drop-shadow(0 5px 8px rgba(0,0,0,.14))}.tqCoreMode b{display:block;font-size:16px;letter-spacing:-.035em}.tqCoreMode small{display:block;font-size:9px;line-height:1.45;margin-top:5px;color:rgba(255,255,255,.88)}.tqCoreMode.exam{background:linear-gradient(145deg,#347eff,#419df6)}.tqCoreMode.game{background:linear-gradient(145deg,#f1b934,#ffd76b);color:#6d4800}.tqCoreMode.game small{color:#875c00}.tqCoreMode.inf{background:linear-gradient(145deg,#7653ea,#9b67f5)}.tqCoreMode.speak{background:linear-gradient(145deg,#35b993,#74d7b6);color:#075940}.tqCoreMode.speak small{color:#0f7357}
.tqContinue{width:100%;border:0;text-align:left;cursor:pointer;font:inherit;display:grid;grid-template-columns:48px 1fr auto;gap:11px;align-items:center;background:#fff;border-radius:21px;padding:13px;margin-top:12px;color:#202943;box-shadow:0 9px 25px rgba(47,57,91,.08)}.tqContinueIcon{width:48px;height:48px;border-radius:16px;background:#efedff;display:grid;place-items:center;font-size:25px}.tqContinue b{font-size:13px;display:block}.tqContinue small{font-size:9px;color:#8990a1;display:block;margin-top:4px}.tqContinue strong{color:#5a50ee;font-size:18px}
.shortsTop{display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:9px;margin-bottom:13px}.shortsTop button{width:42px;height:42px;border:0;border-radius:14px;background:#fff;color:#2d3650;font-size:22px;box-shadow:0 7px 20px rgba(44,50,85,.08)}.shortsTop b{font-size:18px}.shortsTop span{font-size:10px;font-weight:950;color:#ff6748;background:#fff;border-radius:999px;padding:8px 10px}.shortsProgress{height:6px;border-radius:99px;background:#e5e7f0;overflow:hidden;margin-bottom:14px}.shortsProgress i{display:block;height:100%;background:linear-gradient(90deg,#ff6557,#ff963d);border-radius:99px}
.shortsCard{background:#fff;border-radius:28px;padding:20px 17px;box-shadow:0 18px 45px rgba(44,50,85,.12)}
.shortsType{display:inline-flex;padding:6px 9px;border-radius:999px;background:#fff0ec;color:#ff6448;font-size:9px;font-weight:950}.shortsWord{font-size:34px;font-weight:1000;letter-spacing:-.05em;margin:17px 0 7px}.shortsInstruction{font-size:11px;color:#7d8496;line-height:1.55;margin-bottom:15px}.shortsChoices{display:grid;gap:8px}.shortsChoice{display:grid;grid-template-columns:29px 1fr;align-items:center;gap:9px;border:1px solid #e5e8f1;background:#f8f9fc;color:#29334b;border-radius:15px;padding:11px;text-align:left;font:inherit}.shortsChoice i{width:29px;height:29px;border-radius:10px;background:#eceef5;display:grid;place-items:center;font-style:normal;font-size:10px;font-weight:950}.shortsChoice.selected{border-color:#6c63f1;background:#f0efff}.shortsChoice.correct{border-color:#3fc38c;background:#eafaf3}.shortsChoice.wrong{border-color:#ff6c72;background:#fff0f1}.shortsFeedback{border-radius:16px;padding:12px;margin-top:12px;background:#eafaf3;color:#176e4b}.shortsFeedback.bad{background:#fff0f1;color:#9b3741}.shortsFeedback p,.shortsFeedback small{display:block;margin:5px 0 0;line-height:1.5}.shortsAction button{width:100%;border:0;border-radius:15px;padding:13px;margin-top:13px;background:linear-gradient(135deg,#ff6557,#ff963d);color:#fff;font-weight:950}.shortsAction button:disabled{opacity:.42}.shortsSwipe{text-align:center;color:#9aa0ae;font-size:9px;margin-top:8px}
.tqStatsHeader{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}.tqStatsHeader h1{font-size:24px;margin:0}.tqStatsHeader button{width:39px;height:39px;border:0;border-radius:50%;background:#fff;font-size:20px;box-shadow:0 7px 20px rgba(44,50,85,.1)}.tqStatsHero{border-radius:25px;padding:20px;background:linear-gradient(145deg,#4f50ef,#8461f6);color:#fff;box-shadow:0 16px 32px rgba(80,73,221,.22)}.tqStatsHero small{font-size:9px;font-weight:950;letter-spacing:.08em}.tqStatsHero strong{display:block;font-size:46px;margin:8px 0}.tqStatsHero p{font-size:10px;color:#e8e8ff;margin:0}.tqStatsGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}.tqStatsGrid div,.tqStatsMode{background:#fff;border-radius:18px;padding:14px;box-shadow:0 8px 22px rgba(44,50,85,.07)}.tqStatsGrid b{display:block;font-size:22px}.tqStatsGrid small,.tqStatsMode small{font-size:9px;color:#8b92a2}.tqStatsMode{display:flex;align-items:center;gap:12px;margin-top:8px}.tqStatsMode i{font-style:normal;font-size:24px}.tqStatsMode b{display:block;font-size:13px;margin-bottom:3px}
body.tq-home-active{background:#061426;color:#f7f9ff}
body.tq-home-active .app{max-width:520px;background:radial-gradient(circle at 88% 4%,#123c69 0,transparent 36%),#071528}
body.tq-home-active .screen{max-width:520px;margin:auto;padding:calc(14px + env(safe-area-inset-top)) 15px 30px}
body.tq-home-active .bottom{background:rgba(5,16,31,.97);border-top:1px solid #132941;box-shadow:0 -12px 30px rgba(0,0,0,.22)}
body.tq-home-active .nav{max-width:520px}
body.tq-home-active .nav button{color:#6f83a1}
body.tq-home-active .nav button.active{background:#102746;color:#77a8ff}
.tqHomeHeader{display:flex;align-items:center;justify-content:space-between;margin:2px 1px 13px}.tqHomeLogo{font-size:21px;font-weight:1000;letter-spacing:-.045em;color:#fff}.tqHomeMeta{display:flex;align-items:center;gap:7px}.tqStreak{display:flex;align-items:center;gap:4px;background:#0d2039;border:1px solid #243c5c;color:#fff;border-radius:999px;padding:8px 11px;font-size:10px;font-weight:950;box-shadow:none}.tqLang{width:38px;height:38px;border:1px solid #243c5c;border-radius:50%;background:#0d2039;font-size:20px;box-shadow:none}
.tqHomeScreen .t1level{background:#0a1d35;border:1px solid #1d3858;border-radius:17px;padding:4px;margin-bottom:12px;box-shadow:none}.tqHomeScreen .t1level button{color:#7890b0;border-radius:13px;padding:9px 5px}.tqHomeScreen .t1level button.on{background:linear-gradient(135deg,#286ad8,#5f7bff);color:#fff;box-shadow:0 8px 18px rgba(46,102,224,.22)}
.tqV9Greeting{margin:3px 2px 11px}.tqV9Greeting small{font-size:9px;font-weight:950;letter-spacing:.13em;color:#6e89af}.tqV9Greeting h1{font-size:24px;letter-spacing:-.055em;margin:5px 0 0}.tqV9Greeting em{font-style:normal;color:#61a1ff}
.tqV9Hero{position:relative;overflow:hidden;min-height:340px;border-radius:27px;border:1px solid #2f5c9b;background:#0b2444;box-shadow:0 22px 48px rgba(0,0,0,.32)}.tqV9HeroImage{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center;filter:saturate(1.06) brightness(.88)}.tqV9HeroShade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(3,13,27,.86) 0,rgba(3,13,27,.34) 55%,rgba(3,13,27,.04) 100%),linear-gradient(0deg,rgba(3,12,25,.88) 0,transparent 55%)}.tqV9HeroContent{position:relative;z-index:2;min-height:340px;padding:18px;display:flex;flex-direction:column;justify-content:space-between}.tqV9HeroTop{display:flex;align-items:flex-start;justify-content:space-between}.tqV9Label{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:950}.tqV9Ring{--p:0deg;position:relative;width:74px;height:74px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#5f9dff var(--p),rgba(120,157,205,.18) 0)}.tqV9Ring:before{content:'';position:absolute;inset:8px;border-radius:50%;background:rgba(5,20,39,.88)}.tqV9Ring b{position:relative;font-size:22px}.tqV9Ring small{font-size:10px;color:#9cb2ce}.tqV9HeroBottom{width:67%;text-shadow:0 2px 12px rgba(0,0,0,.45)}.tqV9HeroBottom h2{font-size:20px;line-height:1.2;letter-spacing:-.04em;margin:0 0 5px}.tqV9HeroBottom p{font-size:10px;color:#cad8ea;margin:0 0 13px}.tqV9Continue{width:100%;border:0;border-radius:15px;padding:13px 14px;background:linear-gradient(135deg,#ff6a5f,#ff4d7d);color:#fff;font-size:12px;font-weight:950;box-shadow:0 12px 24px rgba(255,75,103,.24)}
.tqV9SectionHead{display:flex;align-items:center;justify-content:space-between;margin:19px 2px 9px}.tqV9SectionHead b{font-size:15px}.tqV9SectionHead span{font-size:9px;color:#69809e}.tqV9Modes{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.tqV9Mode{min-height:135px;border:0;border-radius:20px;padding:13px 11px;color:#fff;text-align:left;position:relative;overflow:hidden;box-shadow:0 14px 28px rgba(0,0,0,.19)}.tqV9Mode:after{content:'';position:absolute;width:78px;height:78px;border-radius:50%;right:-31px;top:-26px;background:rgba(255,255,255,.12)}.tqV9Mode i{display:grid;place-items:center;width:39px;height:39px;border-radius:13px;background:rgba(255,255,255,.11);font-style:normal;font-size:20px;border:1px solid rgba(255,255,255,.17)}.tqV9Mode b{display:block;font-size:13px;margin-top:17px;letter-spacing:-.035em}.tqV9Mode small{display:block;font-size:8px;line-height:1.45;color:rgba(255,255,255,.82);margin-top:4px}.tqV9Mode.exam{background:linear-gradient(145deg,#0d56af,#237fd7)}.tqV9Mode.game{background:linear-gradient(145deg,#087b6d,#13a78d)}.tqV9Mode.inf{background:linear-gradient(145deg,#5222a5,#823fc8)}
.tqV9Utility{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.tqV9Utility button{display:grid;grid-template-columns:39px 1fr;align-items:center;gap:10px;border:1px solid #203b5b;background:#0c2039;color:#fff;border-radius:18px;padding:11px;text-align:left}.tqV9Utility i{font-style:normal;font-size:21px}.tqV9Utility b{display:block;font-size:11px}.tqV9Utility small{display:block;font-size:8px;color:#7890af;margin-top:3px}
.tqV9Week{margin-top:12px;border:1px solid #1d3858;background:linear-gradient(145deg,#0a1d35,#0c2340);border-radius:22px;padding:15px}.tqV9WeekTop{display:flex;align-items:flex-start;justify-content:space-between}.tqV9Week h2{font-size:15px;margin:0}.tqV9Week h2 span{color:#62a2ff}.tqV9Week p{font-size:8.5px;color:#7890af;margin:5px 0 0}.tqV9Stats{border:0;border-radius:12px;padding:7px 9px;background:#123661;color:#76acff;font-size:9px;font-weight:950}.tqV9Days{display:grid;grid-template-columns:repeat(7,1fr);gap:7px;margin-top:14px}.tqV9Day{text-align:center}.tqV9Day i{display:grid;place-items:center;width:29px;height:29px;margin:auto;border-radius:50%;background:#102845;color:#58708f;font-style:normal;font-size:10px}.tqV9Day.on i{background:#2e76e0;color:#fff;box-shadow:0 0 0 4px rgba(46,118,224,.12)}.tqV9Day small{display:block;font-size:8px;color:#667d9c;margin-top:5px}
@media(max-width:390px){.tqV9Hero{min-height:315px}.tqV9HeroContent{min-height:315px;padding:15px}.tqV9HeroBottom{width:72%}.tqV9Mode{min-height:127px;padding:11px 9px}.tqV9Mode b{font-size:12px}.tqV9Mode small{font-size:7.5px}.tqV9Day i{width:27px;height:27px}}
`;
document.head.appendChild(homeCss);
let SH={index:0,selected:null,locked:false,total:0,score:0,streak:0,daily:{}};
try{SH={...SH,...JSON.parse(localStorage.getItem(SHORTS_KEY)||'{}')}}catch(e){}
SH.daily=SH.daily&&typeof SH.daily==='object'?SH.daily:{};
function saveShorts(){try{localStorage.setItem(SHORTS_KEY,JSON.stringify(SH))}catch(e){}}
function dayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function markHomeActivity(){const key=dayKey();SH.daily[key]=SH.daily[key]||{total:0,score:0};SH.daily[key].total=Math.min(99,(Number(SH.daily[key].total)||0)+1);saveShorts()}
function shortsStats(){
  const now=new Date(),today=dayKey(now),monday=new Date(now),dow=(now.getDay()+6)%7;
  monday.setHours(0,0,0,0);monday.setDate(now.getDate()-dow);
  const week=Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);const key=dayKey(d);return{key,on:!!Number(SH.daily[key]?.total)}});
  let dayStreak=0,d=new Date(now);if(!Number(SH.daily[today]?.total))d.setDate(d.getDate()-1);
  while(Number(SH.daily[dayKey(d)]?.total)){dayStreak++;d.setDate(d.getDate()-1)}
  const total=Number(SH.total)||0,score=Number(SH.score)||0;
  return {week,weekCount:week.filter(x=>x.on).length,dayStreak,total,score,accuracy:total?Math.round(score/total*100):0};
}
function shortsOptions(index){
  const offsets=[2,5,9],items=offsets.map(x=>SHORTS[(index+x)%SHORTS.length]),correct=(index*3)%4;
  items.splice(correct,0,SHORTS[index]);return {items,correct};
}
function shortType(type){return type==='grammar'?T('문법','文法','Grammar','语法'):type==='idiom'?T('숙어','慣用表現','Expression','惯用语'):T('단어','単語','Word','单词')}
function syncStatsNav(){
  const b=document.getElementById('nav_stats')||document.getElementById('nav_speaking');if(!b)return;
  b.id='nav_stats';b.onclick=()=>setView('stats');b.innerHTML=`<b>▥</b><span>${T('통계','統計','Stats','统计')}</span>`;
}
syncStatsNav();
window.startShorts=()=>open('shorts');
window.pickShorts=i=>{if(SH.locked)return;SH.selected=Number(i);saveShorts();render()};
window.checkShorts=()=>{
  if(SH.locked||SH.selected==null)return;
  const {correct}=shortsOptions(SH.index),ok=SH.selected===correct,today=dayKey();
  SH.locked=true;SH.total=(Number(SH.total)||0)+1;SH.score=(Number(SH.score)||0)+(ok?1:0);SH.streak=ok?(Number(SH.streak)||0)+1:0;
  SH.daily=SH.daily||{};SH.daily[today]=SH.daily[today]||{total:0,score:0};SH.daily[today].total++;if(ok)SH.daily[today].score++;
  saveShorts();render();
};
window.nextShorts=()=>{
  let next=SH.index;while(SHORTS.length>1&&next===SH.index)next=Math.floor(Math.random()*SHORTS.length);
  SH.index=next;SH.selected=null;SH.locked=false;saveShorts();render();
};
function bindShortsSwipe(){
  const card=document.querySelector('.shortsCard');if(!card)return;let startY=0;
  card.addEventListener('touchstart',e=>{startY=e.changedTouches[0]?.clientY||0},{passive:true});
  card.addEventListener('touchend',e=>{const end=e.changedTouches[0]?.clientY||0;if(SH.locked&&startY-end>65)window.nextShorts()},{passive:true});
}
function renderShorts(sc){
  navActive('home');const item=SHORTS[SH.index],set=shortsOptions(SH.index),stats=shortsStats(),answer=item.meaning[S.lang]||item.meaning.ko;
  sc.className='screen tqShortsScreen';
  const choices=set.items.map((x,i)=>{
    let cls='shortsChoice';if(SH.selected===i)cls+=' selected';if(SH.locked&&i===set.correct)cls+=' correct';if(SH.locked&&SH.selected===i&&i!==set.correct)cls+=' wrong';
    return `<button class="${cls}" onclick="pickShorts(${i})" ${SH.locked?'disabled':''}><i>${i+1}</i><span>${E(x.meaning[S.lang]||x.meaning.ko)}</span></button>`;
  }).join('');
  const ok=SH.locked&&SH.selected===set.correct;
  const feedback=SH.locked?`<div class="shortsFeedback ${ok?'good':'bad'}"><b>${ok?T('정답이에요!','正解です！','Correct!','回答正确！'):T('한 번 더 기억해요','もう一度覚えましょう','Remember this one','再记一次')}</b><p>${E(item.term)} = ${E(answer)}</p><small>${T('예문','例文','Example','例句')}: ${E(item.example)}</small></div>`:'';
  sc.innerHTML=`<div class="shortsTop"><button onclick="setView('home')">‹</button><b>${T('쇼츠','ショーツ','Shorts','短题')}</b><span>🔥 ${Number(SH.streak)||0}</span></div><div class="shortsProgress"><i style="width:${Math.max(8,(stats.total%10+1)*10)}%"></i></div><article class="shortsCard"><span class="shortsType">${shortType(item.type)}</span><div class="shortsWord">${E(item.term)}</div><div class="shortsInstruction">${T('내 언어로 가장 알맞은 뜻을 고르세요.','自分の言語で最も適切な意味を選んでください。','Choose the best meaning in your language.','请选择你语言中最恰当的意思。')}</div><div class="shortsChoices">${choices}</div>${feedback}<div class="shortsAction">${SH.locked?`<button onclick="nextShorts()">${T('다음 카드','次のカード','Next card','下一张')} ↑</button>`:`<button onclick="checkShorts()" ${SH.selected==null?'disabled':''}>${T('정답 확인','答えを確認','Check answer','确认答案')}</button>`}<div class="shortsSwipe">${T('정답 확인 후 위로 넘겨 다음 문제','答えを確認したら上にスワイプ','After checking, swipe up for the next card','确认答案后向上滑动')}</div></div></article>`;
  setTimeout(bindShortsSwipe,0);
}
function statsPage(sc){
  navActive('stats');const stats=shortsStats(),vocab=Array.isArray(S.vocab)?S.vocab.length:0;
  let reviews=0;try{reviews=Object.keys(S.realAnswers?.listen||{}).length+Object.keys(S.realAnswers?.read||{}).length}catch(e){}
  sc.className='screen tqStatsScreen';
  sc.innerHTML=`<div class="tqStatsHeader"><h1>${T('학습 통계','学習統計','Learning stats','学习统计')}</h1><button onclick="event.stopPropagation();flagMenu()">${LANGS[S.lang].flag}</button></div><section class="tqStatsHero"><small>${T('쇼츠 정답률','ショーツ正答率','SHORTS ACCURACY','短题正确率')}</small><strong>${stats.accuracy}%</strong><p>${T('짧게 공부한 기록도 꾸준히 쌓여요.','短い学習も続ければ力になります。','Every short session adds up.','每次短学习都会积累。')}</p></section><div class="tqStatsGrid"><div><b>${stats.total}</b><small>${T('푼 문제','解いた問題','Answered','已答题')}</small></div><div><b>${stats.weekCount}/7</b><small>${T('이번 주','今週','This week','本周')}</small></div><div><b>${stats.dayStreak}</b><small>${T('연속 학습일','連続学習日','Day streak','连续天数')}</small></div></div><div class="tqStatsMode"><i>⚡</i><div><b>${T('쇼츠 학습','ショーツ学習','Shorts practice','短题学习')}</b><small>${T(`정답 ${stats.score}개`,`正解 ${stats.score}問`,`${stats.score} correct`,`${stats.score}题正确`)}</small></div></div><div class="tqStatsMode"><i>▣</i><div><b>${T('단어장','単語帳','Vocabulary','单词本')}</b><small>${T(`${vocab}개 저장`,`${vocab}語を保存`,`${vocab} saved`,`${vocab}个已保存`)}</small></div></div><div class="tqStatsMode"><i>↻</i><div><b>${T('실전 답안','実戦答案','Exam answers','实战答题')}</b><small>${T(`${reviews}문항 기록`,`${reviews}問を記録`,`${reviews} recorded`,`${reviews}题记录`)}</small></div></div>`;
}
home=function(sc){
  navActive('home');setProgress(0);syncStatsNav();sc.className='screen tqHomeScreen';
  const lv=level(),stats=shortsStats(),levelNo=Math.max(1,Math.floor(stats.total/10)+1);
  sc.innerHTML=`<div class="tqHomeHeader"><div class="tqHomeLogo">TOPIK QUEST</div><div class="tqHomeMeta"><span class="tqStreak">🔥 ${stats.dayStreak}${T('일','日','d','天')}</span><button class="tqLang" onclick="event.stopPropagation();flagMenu()">${LANGS[S.lang].flag}</button></div></div><div class="t1level"><button class="${lv===1?'on':''}" onclick="tqSetLevel(1)">TOPIK I</button><button class="${lv===2?'on':''}" onclick="tqSetLevel(2)">TOPIK II</button></div><section class="tqDailyHero"><div class="tqDailyCopy"><small>Lv. ${levelNo} · TOPIK QUEST</small><h1>${T('오늘도 한 걸음!','今日も一歩！','One step today!','今天也前进一步！')}</h1><p>${T(`이번 주 목표 ${stats.weekCount}/7일`,`今週の目標 ${stats.weekCount}/7日`,`Weekly goal ${stats.weekCount}/7 days`,`本周目标 ${stats.weekCount}/7天`)}</p><div class="tqWeek">${stats.week.map(x=>`<i class="${x.on?'on':''}"></i>`).join('')}</div></div><div class="tqHeroMascot">🐯</div></section><button class="tqShortsLaunch" onclick="startShorts()"><span class="tqShortsPlay">▶</span><span><b>${T('쇼츠','ショーツ','Shorts','短题')}</b><small>${T('1분 어휘 퀴즈','1分語彙クイズ','1-minute vocab quiz','1分钟词汇测验')}<br>${T('내 언어로 뜻 고르기 · 4지선다','自分の言語で意味を選ぶ・4択','Choose the meaning · 4 choices','用自己的语言选词义 · 四选一')}</small></span><span class="tqShortsGo">${T('바로 시작','今すぐ開始','Start','立即开始')}</span></button><div class="tqCoreGrid"><button class="tqCoreMode exam" onclick="tqStartMode('real')"><span class="mi">📝</span><b>${T('실전 모드','実戦モード','Exam Mode','实战模式')}</b><small>${lv===1?T('듣기 30 · 읽기 40','聞き取り30 · 読解40','Listening 30 · Reading 40','听力30 · 阅读40'):T('TOPIK 모의고사','TOPIK模擬試験','TOPIK mock exam','TOPIK模拟考试')}</small></button><button class="tqCoreMode game" onclick="tqStartMode('game')"><span class="mi">🏆</span><b>${T('게임 모드','ゲームモード','Game Mode','游戏模式')}</b><small>${T('퀘스트로 실력 UP','クエストで実力UP','Level up with quests','通过任务提升实力')}</small></button><button class="tqCoreMode inf" onclick="tqStartMode('infinity')"><span class="mi">♾️</span><b>${T('인피니티 모드','インフィニティ','Infinity Mode','无限模式')}</b><small>${T('끝없이 도전','無限に挑戦','Endless challenge','无限挑战')}</small></button><button class="tqCoreMode speak" onclick="setView('speaking')"><span class="mi">🎙</span><b>${T('말하기 모드','スピーキング','Speaking Mode','口语模式')}</b><small>${T('실시간 인식 · 자동 채점','リアルタイム認識・自動採点','Live recognition · auto score','实时识别 · 自动评分')}</small></button></div><button type="button" class="tqContinue" onclick="setView('stats')"><span class="tqContinueIcon">📚</span><span><b>${T('오늘의 학습 기록','今日の学習記録','Today’s learning','今日学习记录')}</b><small>${T(`쇼츠 ${stats.total}문제 · 정답 ${stats.score}`,`ショーツ ${stats.total}問・正解 ${stats.score}`,`Shorts ${stats.total} · ${stats.score} correct`,`短题 ${stats.total} · 答对 ${stats.score}`)}</small></span><strong>${stats.accuracy}%</strong></button>`;
};
home=function(sc){
  navActive('home');setProgress(0);syncStatsNav();sc.className='screen tqHomeScreen';
  const lv=level(),stats=shortsStats(),daily=Math.min(5,Number(SH.daily?.[dayKey()]?.total)||0),degree=Math.round(daily/5*360),weekGoal=Math.min(5,stats.weekCount),session=lv===1?restore():null;
  const labels=({ko:['월','화','수','목','금','토','일'],ja:['月','火','水','木','金','土','日'],en:['M','T','W','T','F','S','S'],zh:['一','二','三','四','五','六','日']}[S.lang]||['월','화','수','목','금','토','일']);
  const lessonTitle=lv===1
    ?(session&&!session.result?T('TOPIK I 학습 이어풀기','TOPIK I 学習を続ける','Continue TOPIK I','继续 TOPIK I 学习'):T('TOPIK I 10문항 퀘스트','TOPIK I 10問クエスト','TOPIK I 10-question quest','TOPIK I 10题任务'))
    :(S.real?.active?T('TOPIK II 모의고사 이어풀기','TOPIK II 模擬試験を続ける','Continue TOPIK II exam','继续 TOPIK II 模拟考试'):T(`TOPIK II STAGE ${Math.max(1,S.gameUnlock||1)}`,`TOPIK II ステージ ${Math.max(1,S.gameUnlock||1)}`,`TOPIK II Stage ${Math.max(1,S.gameUnlock||1)}`,`TOPIK II 第${Math.max(1,S.gameUnlock||1)}关`));
  const lessonMeta=lv===1?T('약 10분 · 듣기와 읽기','約10分 · 聞き取りと読解','About 10 min · Listening & Reading','约10分钟 · 听力与阅读'):T('약 12분 · 실전 문제','約12分 · 実戦問題','About 12 min · Exam questions','约12分钟 · 实战题目');
  sc.innerHTML=`
    <div class="tqHomeHeader"><div class="tqHomeLogo">TOPIK QUEST</div><div class="tqHomeMeta"><span class="tqStreak">🔥 ${stats.dayStreak?T(`${stats.dayStreak}일 연속`,`${stats.dayStreak}日連続`,`${stats.dayStreak}-day streak`,`${stats.dayStreak}天连续`):T('오늘 시작','今日スタート','Start today','今天开始')}</span><button class="tqLang" onclick="event.stopPropagation();flagMenu()">${LANGS[S.lang].flag}</button></div></div>
    <div class="t1level"><button class="${lv===1?'on':''}" onclick="tqSetLevel(1)">TOPIK I</button><button class="${lv===2?'on':''}" onclick="tqSetLevel(2)">TOPIK II</button></div>
    <div class="tqV9Greeting"><small>DAILY KOREAN MISSION</small><h1>${T('오늘도 한국어 ','今日も韓国語を','One more Korean ','今天也向韩语')}<em>${T('한 걸음!','一歩ずつ！','step!','前进一步！')}</em></h1></div>
    <section class="tqV9Hero">
      <img class="tqV9HeroImage" src="assets/topik-home-hero-v9.jpg" alt="TOPIK QUEST Korean study">
      <div class="tqV9HeroShade"></div>
      <div class="tqV9HeroContent"><div class="tqV9HeroTop"><span class="tqV9Label">▣ ${T('오늘의 학습','今日の学習','Today’s lesson','今日学习')}</span><div class="tqV9Ring" style="--p:${degree}deg"><b>${daily}<small>/5</small></b></div></div><div class="tqV9HeroBottom"><h2>${lessonTitle}</h2><p>${lessonMeta}</p><button class="tqV9Continue" onclick="tqHomeContinue()">${T('이어서 학습','続きから学習','Continue learning','继续学习')} ›</button></div></div>
    </section>
    <div class="tqV9SectionHead"><b>⚡ ${T('빠른 연습','クイック練習','Quick practice','快速练习')}</b><span>${lv===1?'TOPIK I':'TOPIK II'}</span></div>
    <div class="tqV9Modes">
      <button class="tqV9Mode exam" onclick="tqStartMode('real')"><i>🎧</i><b>${T('실전모드','実戦モード','Exam Mode','实战模式')}</b><small>${lv===1?T('듣기 30 · 읽기 40','聞き取り30 · 読解40','Listening 30 · Reading 40','听力30 · 阅读40'):T('실제 시험처럼 집중 연습','本番と同じ集中練習','Practice under exam timing','按照考试节奏练习')}</small></button>
      <button class="tqV9Mode game" onclick="tqStartMode('game')"><i>🎮</i><b>${T('게임모드','ゲームモード','Game Mode','游戏模式')}</b><small>${T('퀘스트로 재미있게 학습','クエストで楽しく学習','Learn through quests','通过任务趣味学习')}</small></button>
      <button class="tqV9Mode inf" onclick="tqStartMode('infinity')"><i>∞</i><b>${T('인피니티','インフィニティ','Infinity','无限模式')}</b><small>${T('무한 문제로 실력 UP','無限問題で実力UP','Endless skill training','无限题目提升实力')}</small></button>
    </div>
    <div class="tqV9Utility"><button onclick="startShorts()"><i>⚡</i><span><b>${T('1분 쇼츠','1分ショーツ','1-minute Shorts','1分钟短题')}</b><small>${T('어휘·문법 빠른 퀴즈','語彙・文法クイズ','Vocab & grammar quiz','词汇语法快测')}</small></span></button><button onclick="setView('speaking')"><i>🎙</i><span><b>${T('말하기 연습','スピーキング','Speaking','口语练习')}</b><small>${T('실시간 인식·자동 채점','リアルタイム認識','Live recognition','实时识别')}</small></span></button></div>
    <section class="tqV9Week"><div class="tqV9WeekTop"><div><h2>${T('주간 목표','週間目標','Weekly goal','每周目标')} <span>${weekGoal}/5${S.lang==='ko'?'일':''}</span></h2><p>${T('매일 꾸준히 학습하고 목표를 달성해요!','毎日続けて目標を達成しよう！','Keep learning and reach your goal!','每天坚持学习并完成目标！')}</p></div><button class="tqV9Stats" onclick="setView('stats')">${T('통계 ›','統計 ›','Stats ›','统计 ›')}</button></div><div class="tqV9Days">${stats.week.map((x,i)=>`<div class="tqV9Day ${x.on?'on':''}"><i>${x.on?'✓':'·'}</i><small>${labels[i]}</small></div>`).join('')}</div></section>`;
};
function renderSetup(sc){navActive('home');sc.innerHTML=`<div class="sectionTitle"><h2>TOPIK I · ${T('실전모드','実戦モード','Exam Mode','实战模式')}</h2><span>70 QUESTIONS</span></div><div class="infoCard"><h3>${T('TOPIK I 모의연습 세트','TOPIK I 模擬練習セット','TOPIK I Mock Practice Set','TOPIK I 模拟练习套题')}</h3><p>${T('독자 제작 문제로 듣기 30문항과 읽기 40문항을 연습합니다.','オリジナル問題で聞き取り30問・読解40問を練習します。','Practice 30 listening and 40 reading questions with original content.','使用原创题目练习30道听力题和40道阅读题。')}</p></div><div class="t1setup"><button onclick="t1Begin('full')"><small>100 MIN</small><b>🎓 ${T('전체 실전','フル模擬試験','Full Mock Exam','完整模拟考试')}</b><p>${T('듣기 30 → 읽기 40, 총 70문항','聞き取り30 → 読解40、全70問','Listening 30 → Reading 40, 70 questions total','听力30 → 阅读40，共70题')}</p></button><button onclick="t1Begin('listening')"><small>40 MIN</small><b>🎧 ${T('듣기만','聞き取りのみ','Listening Only','仅听力')}</b><p>${T('30문항 · 실전에서는 각 문항 1회 재생','30問 · 実戦では各問題1回のみ再生','30 questions · one playback per question in Exam Mode','30题 · 实战模式每题仅播放一次')}</p></button><button onclick="t1Begin('reading')"><small>60 MIN</small><b>📖 ${T('읽기만','読解のみ','Reading Only','仅阅读')}</b><p>${T('40문항','40問','40 questions','40题')}</p></button></div><button class="primary alt" style="margin-top:12px" onclick="setView('home')">${T('홈으로','ホームへ','Back Home','返回首页')}</button>`}
window.t1Begin=k=>{clearQ();const m=k==='listening'?40:k==='reading'?60:100;Q={mode:'real',kind:k,ids:pool(k).map(x=>x.id),i:0,answers:{},played:{},started:Date.now(),duration:m*60};saveQ();open('t1quiz')};
function startPractice(mode){clearQ();const first=mode==='game'?shuffle(A).slice(0,10):[A[Math.floor(Math.random()*A.length)]];Q={mode,kind:'all',ids:first.map(x=>x.id),i:0,answers:{},played:{},score:0,total:0,streak:0,locked:false};saveQ();open('t1quiz')}
function cur(){restore();return Q?find(Q.ids[Q.i]):null}
function choices(q,sel,locked){return q.choices.map((c,i)=>{let z='choice';if(sel===i)z+=' selected';if(locked&&i===q.answerIndex)z+=' correct';if(locked&&sel===i&&i!==q.answerIndex)z+=' wrong';return `<button class="${z}" ${locked?'disabled':''} onclick="t1Pick(${i})"><span class="n">${i+1}</span><span>${E(c)}</span></button>`}).join('')}
window.t1Pick=i=>{restore();if(!Q||Q.locked)return;Q.answers[cur().id]=i;saveQ();render()};
function body(q,locked){const sel=Q.answers[q.id],aud=q.section==='listening'?`<button class="t1audio" onclick="t1Play(${q.id})" ${Q.mode==='real'&&Q.played[q.id]?'disabled':''}>${Q.mode==='real'&&Q.played[q.id]?T('✓ 재생 완료','✓ 再生済み','✓ Played','✓ 已播放'):T('▶ 듣기','▶ 聞く','▶ Play Audio','▶ 播放听力')}</button>`:'';return `<div class="instruction">${E(instructionText(q))}</div>${aud}${q.stem?`<div class="stem">${E(q.stem)}</div>`:''}${q.prompt?`<div class="stem" style="font-size:14px">${E(q.prompt)}</div>`:''}<div class="choices">${choices(q,sel,locked)}</div>${locked?`<div class="resultStrip ${sel===q.answerIndex?'good':'bad'}">${sel===q.answerIndex?T('정답입니다.','正解です。','Correct.','回答正确。'):T(`정답: ${q.answerIndex+1}번`,`正解: ${q.answerIndex+1}番`,`Answer: option ${q.answerIndex+1}`,`正确答案：第${q.answerIndex+1}项`)} · ${E(explainText(q))}</div>`:''}`}
window.t1Next=()=>{restore();if(!Q)return;stopAudio();if(Q.mode==='real'){Q.i++;if(Q.i>=Q.ids.length)return finish();saveQ();return render()}if(!Q.locked){const q=cur(),sel=Q.answers[q.id];if(sel==null)return;const ok=sel===q.answerIndex;Q.locked=true;Q.total++;if(ok){Q.score++;Q.streak++}else Q.streak=0;saveQ();return render()}if(Q.mode==='game'){Q.i++;if(Q.i>=Q.ids.length)return finish();Q.locked=false;saveQ();return render()}const nq=A[Math.floor(Math.random()*A.length)];Q.ids=[nq.id];Q.i=0;Q.answers={};Q.played={};Q.locked=false;saveQ();render()};
window.t1Prev=()=>{restore();if(Q?.mode==='real'&&Q.i>0){stopAudio();Q.i--;saveQ();render()}};
function result(){let lc=0,lt=0,rc=0,rt=0,w=[];for(const id of Q.ids){const q=find(id),ok=Q.answers[id]===q.answerIndex;if(q.section==='listening'){lt++;if(ok)lc++}else{rt++;if(ok)rc++}if(!ok)w.push(id)}const ls=lt?Math.round(lc/lt*100):0,rs=rt?Math.round(rc/rt*100):0;return {lc,lt,rc,rt,ls,rs,total:(lt?ls:0)+(rt?rs:0),wrong:w}}
function finish(){stopAudio();stopTimer();Q.result=Q.mode==='real'?result():{score:Q.score,total:Q.total};saveQ();open('t1result')}
function tick(){stopTimer();if(Q.mode!=='real')return;const f=()=>{const s=seconds(),e=document.getElementById('t1clock');if(e)e.textContent=clock(s);if(s<=0)finish()};f();timer=setInterval(f,1000)}
function renderQuiz(sc){restore();if(!Q)return open('t1setup');const q=cur();if(!q)return open('home');if(Q.mode==='real'&&seconds()<=0)return finish();const sel=Q.answers[q.id],locked=Q.mode!=='real'&&Q.locked;const top=Q.mode==='real'?`<div class="t1head"><div><span><b>TOPIK I · ${secName(q.section)}</b><small style="display:block;color:#91a5c2">${Q.i+1}/${Q.ids.length}</small></span><strong id="t1clock">--:--</strong></div><div class="t1bar"><i style="width:${(Q.i+1)/Q.ids.length*100}%"></i></div></div>`:`<div class="t1hud"><span>${Q.mode==='game'?`⚔️ ${T('게임 10','ゲーム 10','GAME 10','游戏 10')}`:'♾ INFINITY'}</span><span>${T('정답','正解','Correct','答对')} ${Q.score}/${Q.total}</span><span>🔥 ${Q.streak}</span>${Q.mode==='game'?`<span>${Q.i+1}/10</span>`:''}</div>`;sc.innerHTML=`${top}<div class="card"><div class="qmeta"><div class="qno">${q.id}</div><span class="cat">${E(groupName(q.group))}</span></div>${body(q,locked)}${Q.mode==='real'?`<div class="t1nav"><button class="p" onclick="t1Prev()" ${Q.i===0?'disabled':''}>‹ ${T('이전','前へ','Previous','上一题')}</button><button class="n" onclick="t1Next()">${Q.i===Q.ids.length-1?T('제출','提出','Submit','提交'):T('다음','次へ','Next','下一题')} ›</button></div>`:`<button class="attack" style="width:100%;border:0;border-radius:15px;padding:14px;margin-top:12px;font-weight:950" onclick="t1Next()" ${sel==null&&!locked?'disabled':''}>${locked?T('다음 문제 ›','次の問題 ›','Next Question ›','下一题 ›'):T('정답 확인','答えを確認','Check Answer','查看答案')}</button>`}</div><button class="primary alt" style="margin-top:10px" onclick="setView('home')">${T('종료','終了','Exit','退出')}</button>`;tick()}
function gradeText(total){if(total>=140)return T('2급','2級','Level 2','2级');if(total>=80)return T('1급','1級','Level 1','1级');return T('등급 전','級なし','Below Level 1','未达等级')}
function renderResult(sc){restore();if(!Q?.result)return open('home');if(Q.mode!=='real'){const r=Q.result;sc.innerHTML=`<div class="t1result"><h2>${Q.mode==='game'?T('⚔️ 배틀 완료','⚔️ バトル完了','⚔️ Battle Complete','⚔️ 挑战完成'):T('♾ 연습 종료','♾ 練習終了','♾ Practice Complete','♾ 练习结束')}</h2><div class="t1score">${r.score}<small> / ${r.total}</small></div><p>${T('정확도','正答率','Accuracy','正确率')} ${r.total?Math.round(r.score/r.total*100):0}%</p></div><button class="primary" style="margin-top:10px" onclick="setView('home')">${T('홈','ホーム','Home','首页')}</button>`;return}const r=Q.result,full=r.lt&&r.rt,score=full?r.total:(r.lt?r.ls:r.rs),den=full?200:100,grade=full?gradeText(r.total):'';sc.innerHTML=`<div class="t1result"><small>TOPIK I · ${T('연습 결과','練習結果','PRACTICE RESULT','练习结果')}</small><h2>✅ ${T('풀이 완료','解答完了','Completed','答题完成')}</h2><div class="t1score">${score}<small> / ${den}</small></div>${full?`<b style="font-size:18px">${T('연습 판정','練習判定','Practice Level','练习等级')}: ${grade}</b>`:''}<div class="t1split" style="margin-top:12px">${r.lt?`<div><small>${T('듣기','聞き取り','Listening','听力')}</small><b>${r.ls}</b><small>${r.lc}/${r.lt}</small></div>`:''}${r.rt?`<div><small>${T('읽기','読解','Reading','阅读')}</small><b>${r.rs}</b><small>${r.rc}/${r.rt}</small></div>`:''}</div>${r.wrong.length?`<div style="margin-top:12px;font-size:10px;color:#9fb4d1">${T('틀린 문제','間違えた問題','Missed Questions','错题')}</div><div class="t1wrong">${r.wrong.map(x=>`<span>Q${x}</span>`).join('')}</div>`:''}</div><button class="primary" style="margin-top:10px" onclick="setView('home')">${T('홈','ホーム','Home','首页')}</button>`}
const baseRender=render;
render=function(){
  const homeOn=S.view==='home',shortsOn=S.view==='shorts',statsOn=S.view==='stats',light=shortsOn||statsOn;
  document.body.classList.toggle('tq-home-active',homeOn);
  document.body.classList.toggle('tq-shorts-active',shortsOn);
  document.body.classList.toggle('tq-stats-active',statsOn);
  document.documentElement.style.colorScheme=light?'light':'dark';
  const theme=document.querySelector('meta[name="theme-color"]'),scheme=document.querySelector('meta[name="color-scheme"]');
  if(theme)theme.content=light?'#f4f6fb':'#07101d';if(scheme)scheme.content=light?'light':'dark';
  syncStatsNav();
  if(['t1setup','t1quiz','t1result','shorts','stats'].includes(S.view)){
    try{hideSelection()}catch(e){};try{renderShell()}catch(e){}
    const sc=$('screen');sc.className='screen';sc.innerHTML='';
    if(S.view==='shorts')return renderShorts(sc);
    if(S.view==='stats')return statsPage(sc);
    if(S.view==='t1setup')return renderSetup(sc);
    if(S.view==='t1quiz')return renderQuiz(sc);
    return renderResult(sc);
  }
  return baseRender();
};
const baseSetView=setView;
setView=function(v){if(/^t1/.test(S.view||'')&&!/^t1/.test(v||'')){stopAudio();stopTimer()}return baseSetView(v)};
window.TOPIK1_QUESTIONS=A;
setTimeout(()=>render(),0)
})();
