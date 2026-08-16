const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function classList() {
  const values = new Set();
  return { add: value => values.add(value), remove: value => values.delete(value), contains: value => values.has(value) };
}
function element() {
  return {
    style: {}, dataset: {}, textContent: '', innerHTML: '', disabled: false,
    classList: classList(), parentNode: { insertBefore() {} },
    setAttribute() {}, appendChild() {}, insertBefore() {}, addEventListener() {},
    querySelector() { return null; }, querySelectorAll() { return []; }
  };
}

test('v34 listening preference is saved without requiring a rerender', () => {
  const storage = new Map();
  const buttons = [element(), element(), element()];
  const grid = element();
  grid.querySelectorAll = selector => selector === 'button' ? buttons : [];
  const document = {
    head: element(), body: element(), documentElement: element(),
    createElement: element, getElementById() { return null; },
    querySelector(selector) { return selector === '.malbitListeningGrid' ? grid : null; },
    querySelectorAll() { return []; }
  };
  const context = {
    console, document, localStorage: {
      getItem: key => storage.has(key) ? storage.get(key) : null,
      setItem: (key, value) => storage.set(key, String(value))
    },
    S: { view: 'more', lang: 'ko' }, setTimeout, clearTimeout,
    requestAnimationFrame: callback => callback(), devicePixelRatio: 1
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app-polish-v34.js', 'utf8'), context);

  assert.equal(typeof buttons[1].onclick, 'function', 'exclude button receives a real click handler');
  buttons[1].onclick({ preventDefault() {}, stopPropagation() {} });
  assert.equal(JSON.parse(storage.get('malbitProductPrefsV1')).listeningMode, 'off');
  assert.equal(buttons[1].classList.contains('on'), true, 'clicked choice receives selected styling');
  buttons[0].onclick({ preventDefault() {}, stopPropagation() {} });
  assert.equal(JSON.parse(storage.get('malbitProductPrefsV1')).listeningMode, 'on');
  assert.equal(typeof context.malbitBeginnerWritingClear, 'function');
  assert.equal(typeof context.malbitBeginnerWritingDone, 'function');
});
