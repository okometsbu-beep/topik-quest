import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import {createHash} from 'node:crypto';

// Test-only HTTP boundary: service-worker update fetches are not page CDP Fetch
// requests. Keep one registration URL and change only its exact response bytes.
export function createWorkerMigrationHandler({root, upstream, forward = forwardRequest}) {
  const origin = new URL(upstream);
  if (!origin.pathname.endsWith('/')) origin.pathname += '/';
  const workerPath = new URL('sw.js', origin).pathname;
  const releaseBytes = fs.readFileSync(path.join(root, 'sw.js'));
  const releaseVersion = releaseBytes.toString().match(/const VERSION='(\d+)'/)?.[1];
  if (!releaseVersion || Number(releaseVersion) <= 173) throw Error('Expected a release newer than baseline173');
  const workers = {
    '173': fs.readFileSync(path.join(root, 'tests/fixtures/sw-v173.js')),
    [releaseVersion]: releaseBytes
  };
  for (const [version, bytes] of Object.entries(workers)) {
    if (!bytes.toString().includes(`const VERSION='${version}'`)) throw Error(`Unexpected worker fixture version ${version}`);
  }
  let version = '173';
  const observations = [];
  function handler(request, response) {
    const target = new URL(request.url, origin);
    // Proxy only to the selected upstream, even with an absolute request URL.
    target.protocol = origin.protocol; target.host = origin.host;
    if (target.pathname !== workerPath) return forward(request, response, target);
    const bytes = workers[version];
    observations.push({url: request.url, version, method: request.method, sha256: createHash('sha256').update(bytes).digest('hex')});
    response.writeHead(200, {'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store', 'content-length': bytes.length});
    response.end(request.method === 'HEAD' ? undefined : bytes);
  }
  return {handler, observations, release() {version = releaseVersion;}};
}

function forwardRequest(request, response, target) {
  const transport = target.protocol === 'https:' ? https : http;
  const upstream = transport.request(target, {method: request.method, headers: {...request.headers, host: target.host}}, result => {
    response.writeHead(result.statusCode, result.headers);
    result.pipe(response);
  });
  upstream.on('error', error => {
    if (!response.headersSent) response.writeHead(502, {'content-type': 'text/plain'});
    response.end(`Test upstream unavailable: ${error.message}`);
  });
  request.pipe(upstream);
}

export async function startWorkerMigrationServer(options) {
  const fixture = createWorkerMigrationHandler(options);
  const server = http.createServer(fixture.handler);
  await new Promise((resolve, reject) => {server.once('error', reject); server.listen(0, '127.0.0.1', resolve);});
  const base = new URL(options.upstream);
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  base.protocol = 'http:'; base.host = `127.0.0.1:${server.address().port}`;
  return {...fixture, base: base.href, close: () => {server.closeAllConnections(); return new Promise(resolve => server.close(resolve));}};
}
