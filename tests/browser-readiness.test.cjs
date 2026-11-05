const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const helper = import('../scripts/lib/browser-readiness.mjs');

async function fixture(states, options = {}) {
  const {createBrowserReadiness} = await helper;
  let index = 0, navigating = false, evaluations = 0;
  const outgoing = {readyState: 'complete'};
  const document = {readyState: 'loading'};
  const api = {ready: false};
  const calls = [];
  const send = async (method, params) => {
    calls.push({method, params});
    if (method === 'Page.getFrameTree') return {frameTree: {frame: {id: 'main', loaderId: navigating ? states[index].loader : 'old'}}};
    navigating = true;
    return options.navigationResult || {};
  };
  const run = async expression => {
    if (expression.startsWith('document.__harumalQANavigation =')) return vm.runInNewContext(expression, {document: outgoing});
    evaluations++;
    const state = states[index];
    if (state.error) throw Error('Execution context was destroyed');
    document.readyState = state.complete ? 'complete' : 'loading';
    api.ready = !!state.api;
    return vm.runInNewContext(expression, {document: state.stale ? outgoing : document, api});
  };
  return {harness: createBrowserReadiness({send, run, predicate: 'api.ready', attempts: states.length, pause: async () => {index = Math.min(index + 1, states.length - 1);}, ...options}), calls, evaluations: () => evaluations};
}

test('reload waits for changed loader, fresh context, complete document and actual APIs', async () => {
  const f = await fixture([
    {loader: 'old', complete: true, api: true},
    {loader: 'new', stale: true, complete: true, api: true},
    {loader: 'new', complete: false, api: true},
    {loader: 'new', complete: true, api: false},
    {loader: 'new', complete: true, api: true},
  ]);
  await f.harness.navigate('Page.reload', {ignoreCache: false});
  assert.equal(f.evaluations(), 4, 'the old loader must not evaluate readiness');
  assert.deepEqual(f.calls.find(c => c.method === 'Page.reload').params, {ignoreCache: false});
});

test('unchanged loader cannot make a reload pass on outgoing globals', async () => {
  const f = await fixture([{loader: 'old', complete: true, api: true}]);
  await assert.rejects(f.harness.navigate('Page.reload'), /boot timeout after document navigation/);
  assert.equal(f.evaluations(), 0);
});

test('fresh loader cannot make a stale execution context pass', async () => {
  const f = await fixture([{loader: 'new', stale: true, complete: true, api: true}]);
  await assert.rejects(f.harness.navigate('Page.reload'), /boot timeout/);
});

test('navigation tolerates transient context destruction, not missing runtime APIs', async () => {
  const f = await fixture([{loader: 'new', error: true}, {loader: 'new', complete: true, api: true}]);
  await f.harness.navigate('Page.navigate', {url: 'http://example.test'});
  const missing = await fixture([{loader: 'new', complete: true, api: false}]);
  await assert.rejects(missing.harness.navigate('Page.reload'), /boot timeout/);
});

test('navigation error fails without accepting any readiness result', async () => {
  const f = await fixture([{loader: 'new', complete: true, api: true}], {navigationResult: {errorText: 'net::ERR_FAILED'}});
  await assert.rejects(f.harness.navigate('Page.navigate'), /navigation failed: net::ERR_FAILED/);
  assert.equal(f.evaluations(), 0);
});

test('readiness spanning a second navigation is rejected', async () => {
  const {createBrowserReadiness} = await helper;
  let reads = 0;
  const harness = createBrowserReadiness({send: async () => ({frameTree: {frame: {id: 'main', loaderId: ++reads}}}), run: async () => true, predicate: 'true', attempts: 1, pause: async () => {}});
  await assert.rejects(harness.ready(), /boot timeout/);
});
