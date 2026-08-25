const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('autonomous loop keeps durable memory and a bounded prompt in the repository', () => {
  const required = [
    'loop/CONFIG.md',
    'loop/PROMPT.md',
    'docs/DESIGN.md',
    'docs/STATUS.md',
    'docs/feedback/INBOX.md',
    '.github/ISSUE_TEMPLATE/ai-directive.yml'
  ];

  required.forEach((file) => assert.equal(fs.existsSync(path.join(root, file)), true, file));

  const prompt = read('loop/PROMPT.md');
  ['## 1. 합격 기준', '## 2. 먼저 읽을 문서', '## 3. 규칙과 근거',
    '## 4. 한 바퀴 도는 순서', '## 5. 커밋 순서 규칙'].forEach((heading) => {
    assert.match(prompt, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
  assert.match(prompt, /정확히 하나/);
  assert.match(prompt, /왜:/);
  assert.match(prompt, /화면을 보기 \*\*전에\*\*/);
  assert.match(prompt, /PAUSE/);
});

test('autonomous loop quarantines every payment surface until an explicit decision', () => {
  const prompt = read('loop/PROMPT.md');
  const design = read('docs/DESIGN.md');
  const status = read('docs/STATUS.md');

  assert.match(prompt, /결제 기능과 결제 표면을 만들지 않는다/);
  assert.match(prompt, /가격·구매\/구독 버튼·상품 카드·유료 잠금·Premium\/Plus·업셀/);
  assert.match(design, /사용자의 명시적 승인 전에는 어떤 결제 관련 UI도 추가하지 않는다/);
  assert.match(status, /결제 버튼·가격·상품 카드·유료 잠금·Premium·Plus·구독·업셀/);
  assert.doesNotMatch(design, /2,900엔|구매 전환율은 핵심/);
});

test('autonomous deployment boundary stays static and secret-free', () => {
  const config = read('loop/CONFIG.md');
  assert.match(config, /00:00.*06:00.*12:00.*18:00/s);
  assert.match(config, /GitHub Pages/);
  assert.match(config, /App Store and Google Play[\s\S]*outside the loop/);
  assert.match(config, /do not add an OpenAI API key/i);
});
