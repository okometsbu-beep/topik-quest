const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const releaseVersion = fs.readFileSync(path.join(root, 'sw.js'), 'utf8').match(/const VERSION='(\d+)'/)[1];
const helper = import('../scripts/lib/worker-migration-server.mjs');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

async function fixture(upstream = 'http://127.0.0.1:4186/') {
  const {createWorkerMigrationHandler} = await helper;
  const forwarded = [];
  const migration = createWorkerMigrationHandler({root, upstream, forward(request, response, target) {forwarded.push({url: target.href, method: request.method, headers: request.headers});}});
  function request(url, method = 'GET', headers = {}) {
    const result = {};
    migration.handler({url, method, headers}, {writeHead(status, headers) {Object.assign(result, {status, headers});}, end(body) {result.body = body;}});
    return result;
  }
  return {...migration, forwarded, request};
}

test('one worker URL serves exact historical bytes before exact release bytes, including update queries', async () => {
  const f = await fixture();
  const old = fs.readFileSync(path.join(root, 'tests/fixtures/sw-v173.js'));
  const current = fs.readFileSync(path.join(root, 'sw.js'));
  for (const url of ['/sw.js?v='+releaseVersion, '/sw.js', '/sw.js?update=1']) {
    const response = f.request(url);
    assert.equal(response.status, 200);
    assert.deepEqual(response.body, old);
    assert.equal(response.headers['cache-control'], 'no-store');
    assert.equal(response.headers['content-length'], old.length);
    assert.match(response.headers['content-type'], /javascript/);
  }
  f.release();
  assert.deepEqual(f.request('/sw.js?v='+releaseVersion).body, current);
  assert.deepEqual(f.observations.map(x => x.version), ['173', '173', '173', releaseVersion]);
  assert.deepEqual(f.observations.map(x => x.sha256), [hash(old), hash(old), hash(old), hash(current)]);
  assert.equal(f.forwarded.length, 0);
});

test('non-worker routes, image bytes and media range headers are delegated without interception', async () => {
  const f = await fixture('https://example.test/topik-quest/');
  for (const url of ['/topik-quest/', '/topik-quest/index.html', '/topik-quest/assets/question-image-preview/a.webp', '/topik-quest/not-sw.js?v='+releaseVersion]) f.request(url);
  f.request('/topik-quest/assets/audio/a.mp3', 'GET', {range: 'bytes=0-15'});
  assert.equal(f.forwarded.length, 5);
  assert.equal(f.forwarded[2].url, 'https://example.test/topik-quest/assets/question-image-preview/a.webp');
  assert.equal(f.forwarded[4].headers.range, 'bytes=0-15');
  assert.equal(f.observations.length, 0);
  assert.equal(f.request('/topik-quest/sw.js?v='+releaseVersion).status, 200);
  f.request('https://untrusted.test/asset.js');
  assert.equal(f.forwarded.at(-1).url, 'https://example.test/asset.js');
});

test('HEAD preserves worker headers without a body or switching the phase', async () => {
  const f = await fixture();
  assert.equal(f.request('/sw.js', 'HEAD').body, undefined);
  assert.equal(f.observations[0].version, '173');
  assert.equal(f.request('/sw.js').body.length, f.request('/sw.js', 'HEAD').headers['content-length']);
});

test('browser migration keeps real worker update, cache, sentinel and full image/route gates', () => {
  const source = fs.readFileSync(path.join(root, 'scripts/check-question-image-release.mjs'), 'utf8');
  assert.match(source, /startWorkerMigrationServer\(\{root,upstream\}\)/);
  assert.doesNotMatch(source, /Fetch\.(enable|fulfillRequest|continueRequest)|caches\.(open|delete)\(/);
  assert.match(source, /await reg\.update\(\)/);
  assert.match(source, /keys\.includes\('malbit-v\$\{releaseVersion\}'\)&&!keys\.includes\('malbit-v173'\)/);
  assert.match(source, /harumalImageReleaseBrowserSentinel/);
  assert.match(source, /assert\.equal\(audit\.length,160\)/);
  assert.match(source, /assert\.equal\(aliasResult\.length,20\)/);
  assert.match(source, /HARUMAL_PRACTICE\.startRandom/);
  assert.match(source, /openReviewRetry/);
  assert.match(source, /await navigate\('Page.reload'\)/);
});
