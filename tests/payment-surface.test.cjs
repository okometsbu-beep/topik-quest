const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const productionFiles = [
  'index.html',
  'product-polish.js',
  'product-growth.js',
  'app-polish-v22.js',
  'app-polish-v24.js',
  'app-polish-v33.js',
  'app-polish-v34.js',
  'app-polish-v35.js',
  'beginner-grammar.js'
];
const forbidden = [
  /MALBIT PLUS/i,
  /malbitOpenPlans/,
  /malbitStartCheckout/,
  /MALBIT_BILLING_ADAPTER/,
  /MALBIT_ENTITLEMENTS/,
  /malbitPlusCard/,
  /malbitPlanGrid/,
  /paywall_view/,
  /checkout_start/
];

test('production UI has no real-money payment or upsell surface', () => {
  for (const file of productionFiles) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    for (const pattern of forbidden) {
      assert.doesNotMatch(source, pattern, `${file} exposes ${pattern}`);
    }
  }
});
