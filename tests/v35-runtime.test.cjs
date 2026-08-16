const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function element() {
  const classes = new Set();
  return {
    tagName: 'DIV', children: [], style: { setProperty() {} }, dataset: {}, textContent: '', innerHTML: '', firstElementChild: null,
    classList: { add(value) { classes.add(value); }, remove(value) { classes.delete(value); }, contains(value) { return classes.has(value); } },
    setAttribute() {}, appendChild() {}, insertBefore() {}, remove() {}, addEventListener() {},
    querySelector() { return null; }, querySelectorAll() { return []; }
  };
}

test('v35 exposes four writing sets and recognizes a closely traced mask', () => {
  const level = element(), topikOne = element(), topikTwo = element(), oldLaunch = element(), header = element(), back = element(), title = element(), duplicateFlag = element(), writingTab = element(), writingHolder = element();
  topikOne.tagName = topikTwo.tagName = back.tagName = duplicateFlag.tagName = 'BUTTON';
  level.children = [topikOne, topikTwo]; level.firstElementChild = topikOne;
  level.insertBefore = (node, before) => { const at = level.children.indexOf(before); level.children.splice(at < 0 ? 0 : at, 0, node); level.firstElementChild = level.children[0]; };
  level.querySelector = selector => selector === '.v35BeginnerLevel' ? level.children.find(node => node.classList.contains('v35BeginnerLevel')) || null : null;
  oldLaunch.remove = () => { oldLaunch.removed = true; };
  header.children = [back, title, duplicateFlag]; duplicateFlag.remove = () => { header.children = header.children.filter(node => node !== duplicateFlag); };
  writingTab.classList.add('on');
  let screen = 'home', openedView = null;
  const document = {
    head: element(), body: element(), documentElement: element(),
    createElement: element, getElementById() { return null; },
    querySelector(selector) {
      if (selector === '.tqHomeScreen>.t1level' && screen === 'home') return level;
      if (selector === '.v33BeginnerTop' && screen === 'beginner') return header;
      if (selector === '.v34WritingTab' && screen === 'beginner') return writingTab;
      if (selector === '.v34WritingHolder' && screen === 'beginner') return writingHolder;
      return null;
    },
    querySelectorAll(selector) { return selector === '.v33BeginnerLaunch' ? [oldLaunch] : []; }
  };
  const storage = new Map();
  const context = {
    console, document, navigator: {}, setTimeout, clearTimeout,
    localStorage: {
      getItem: key => storage.has(key) ? storage.get(key) : null,
      setItem: (key, value) => storage.set(key, String(value))
    },
    S: { view: 'home', lang: 'ko' },
    setView(view) { openedView = view; },
    render() {}
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app-polish-v35.js', 'utf8'), context);

  const api = context.MALBIT_V35_INTERNALS;
  assert.equal(oldLaunch.removed, true, 'the separate beginner card is removed');
  assert.equal(level.classList.contains('v35ThreeLevels'), true);
  assert.equal(level.children.length, 3, 'beginner joins TOPIK I and II in one selector');
  level.children[0].onclick({ preventDefault() {} });
  assert.equal(openedView, 'beginner');

  screen = 'beginner'; context.S.view = 'beginner'; context.render();
  assert.equal(header.children.length, 2, 'only the global language button remains');
  assert.equal(header.classList.contains('v35SingleLanguage'), true);
  assert.match(writingHolder.innerHTML, /malbitWritingCategory\('words'\)/);
  assert.match(writingHolder.innerHTML, /malbitHangulCanvasV35/);

  assert.deepEqual({ ...api.setSizes }, { letters: 24, words: 10, vocab: 10, sentences: 5 });
  assert.deepEqual([...api.hangulUnits('오늘 날씨가 좋아요.')], ['오', '늘', '날', '씨', '가', '좋', '아', '요']);

  const width = 32, height = 32, target = new Uint8Array(width * height);
  for (let y = 5; y < 27; y++) for (let x = 8; x < 13; x++) target[y * width + x] = 1;
  for (let y = 14; y < 19; y++) for (let x = 8; x < 27; x++) target[y * width + x] = 1;
  const exact = api.scoreMasks(target.slice(), target, width, height, 2);
  assert.equal(exact.matched, true);
  assert.equal(exact.score, 1);

  const wrong = new Uint8Array(width * height);
  for (let y = 4; y < 28; y++) for (let x = 26; x < 30; x++) wrong[y * width + x] = 1;
  assert.equal(api.scoreMasks(wrong, target, width, height, 2).matched, false);
});
