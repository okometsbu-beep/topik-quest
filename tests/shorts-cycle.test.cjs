const test=require('node:test');
const assert=require('node:assert/strict');
const cycle=require('../shorts-cycle.js');

const item=(bankId,term,answer='정답',choices=[answer,'오답1','오답2','오답3'])=>({bankId,term,type:'reading',choices});

test('schema 2 numeric progress migrates to stable IDs without losing progress',()=>{
  const deck=[item('A','가'),item('B','나'),item('C','다')];
  const state={index:1,total:12,score:9,streak:3,recent:[0,2],orderId:'B',choiceOrder:[2,0,3,1]};
  cycle.migrate(state,deck,1);
  assert.equal(state.cardId,'B');
  assert.deepEqual(state.recentIds,['A','C']);
  assert.deepEqual(state.recentFamilies,[cycle.identity(deck[0],1).family,cycle.identity(deck[2],1).family]);
  assert.equal(state.total,12);
  assert.deepEqual(state.choiceOrder,[2,0,3,1]);
  cycle.migrate(state,[item('NEW','새 문제'),...deck],1);
  assert.equal(state.cardId,'B');
  assert.equal(state.index,2,'bank expansion must not move the learner to another saved card');
});

test('an explicit reviewed Shorts ID stays stable when display copy changes',()=>{
  const before={id:'S04-I-W-TIME-01',term:'벌써',type:'word'};
  const after={...before,term:'벌써 다 했어요.'};
  assert.equal(cycle.identity(before,1).id,'S04-I-W-TIME-01');
  assert.equal(cycle.identity(after,1).id,'S04-I-W-TIME-01');
});

test('exact duplicate rows consume one semantic family, not separate cycle slots',()=>{
  const deck=[item('A1','회의 전에 귀가'),item('A2','회의 전에 귀가'),item('B','예약 시간'),item('C','표 사기')];
  const state={index:0,cardId:'A1',familyId:cycle.identity(deck[0],1).family,recentIds:['A1'],recentFamilies:[cycle.identity(deck[0],1).family],cycleFamilies:[cycle.identity(deck[0],1).family]};
  cycle.pick(state,deck,1,()=>0);
  assert.equal(state.cardId,'B');
  cycle.pick(state,deck,1,()=>0);
  assert.equal(state.cardId,'C');
  assert.equal(state.cycle,0);
  assert.equal(state.isReview,false);
});

test('newly added semantic family is shown before an already seen family',()=>{
  const deck=[item('A','가'),item('B','나'),item('C','새 문제')];
  const state={index:1,cardId:'B',familyId:cycle.identity(deck[1],1).family,recentIds:['A','B'],recentFamilies:[cycle.identity(deck[0],1).family,cycle.identity(deck[1],1).family],cycleFamilies:[cycle.identity(deck[0],1).family,cycle.identity(deck[1],1).family]};
  cycle.pick(state,deck,1,()=>0);
  assert.equal(state.cardId,'C');
  assert.equal(state.cycle,0);
});

test('exhaustion starts a marked review cycle without immediately repeating current family',()=>{
  const deck=[item('A','가'),item('B','나')];
  const state={index:1,cardId:'B',familyId:cycle.identity(deck[1],1).family,recentIds:['A','B'],recentFamilies:[cycle.identity(deck[0],1).family,cycle.identity(deck[1],1).family],cycleFamilies:deck.map(row=>cycle.identity(row,1).family)};
  cycle.pick(state,deck,1,()=>0);
  assert.equal(state.cardId,'A');
  assert.equal(state.cycle,1);
  assert.equal(state.isReview,true);
});

test('one-family fallback rotates duplicate IDs and marks the repeat as review',()=>{
  const deck=[item('A1','같은 뜻'),item('A2','같은 뜻')];
  const family=cycle.identity(deck[0],1).family;
  const state={index:0,cardId:'A1',familyId:family,recentIds:['A1'],recentFamilies:[family],cycleFamilies:[family]};
  cycle.pick(state,deck,1,()=>0);
  assert.equal(state.cardId,'A2');
  assert.equal(state.isReview,true);
});
