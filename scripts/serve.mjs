#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const mime = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'], ['.svg', 'image/svg+xml'],
  ['.mp4', 'video/mp4'], ['.webm', 'video/webm'], ['.webp', 'image/webp'], ['.mp3', 'audio/mpeg'], ['.m4a', 'audio/mp4'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8']
]);

const server = http.createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host || host}`).pathname);
    let target = path.resolve(root, `.${pathname}`);
    if (!target.startsWith(`${root}${path.sep}`) && target !== root) throw new Error('path outside root');
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    const size = fs.statSync(target).size;
    const headers = {
      'content-type': mime.get(path.extname(target)) || 'application/octet-stream',
      'cache-control': 'no-store',
      'accept-ranges': 'bytes',
      'content-length': size
    };
    // Chrome needs byte ranges to seek MP3/MP4 media to the video clock.
    // Ignoring Range makes native audio seek back to zero in browser CI.
    let start = 0, end = size - 1, status = 200;
    if (request.headers.range) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (range && (range[1] || range[2])) {
        start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
        end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      }
      if (!range || (!range[1] && !range[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) {
        response.writeHead(416, { 'content-range': `bytes */${size}`, 'content-length': 0 });
        response.end();
        return;
      }
      status = 206;
      headers['content-range'] = `bytes ${start}-${end}/${size}`;
      headers['content-length'] = end - start + 1;
    }
    response.writeHead(status, headers);
    if (request.method === 'HEAD' || size === 0) response.end();
    else fs.createReadStream(target, { start, end }).pipe(response);
  } catch (error) {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
  }
});

server.listen(port, host, () => console.log(`MALBIT dev server: http://${host}:${server.address().port}`));
