const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('legacy tutor keeps selected-choice analysis and strategy when authored choice coaching is incomplete',()=>{
 const source=fs.readFileSync('topik1.js','utf8'),coach={reason:'Short evidence',trap:'Short trap',strategy:'Short strategy'};
 const c={window:{MALBIT_LEARNING:{authoredCoach:()=>coach,authoredCoaching:()=>'<div>AUTHORED</div>'}},S:{lang:'en'},T:(ko,ja,en)=>en,E:String,cleanAnswerChoice:String,explanationSections:()=>({reason:'Decisive evidence',trap:'Three distinct distractors',strategy:'Reusable solving method'}),gameSolveTip:()=>{throw Error('Existing strategy must be preserved')}};
 vm.createContext(c);vm.runInContext(source.slice(source.indexOf('function gameTutorMarkup('),source.indexOf('async function fileAudio(')),c);
 const q={choices:['a','b','c','d'],answerIndex:2,choiceExplanationsI18n:{en:['Selected distractor reason','other','correct','last']}};
 for(const selected of [0,2]){const html=c.gameTutorMarkup(q,selected);assert.equal((html.match(/<div>/g)||[]).length,3);assert.ok(html.includes('Decisive evidence'));assert.ok(html.includes('Reusable solving method'));assert.ok(html.includes(selected===2?'Three distinct distractors':'Selected distractor reason'));assert.ok(!html.includes('AUTHORED'));}
 coach.choices={a:'a reason',b:'b reason',c:'c reason',d:'d reason'};
 assert.match(c.gameTutorMarkup(q,2),/AUTHORED/);
 delete coach.choices;q.collectionId='original12-v1';assert.match(c.gameTutorMarkup(q,2),/AUTHORED/);
});
