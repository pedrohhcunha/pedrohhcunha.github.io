// Gera assets/og.jpg (1200×630) e o apple-touch-icon a partir de tools/og.html e do favicon.
// node tools/render.cjs   (Playwright do plugin epicora-brand ou do PLAYWRIGHT_PATH)
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/Phhcp/.claude/plugins/marketplaces/epicora-brand/plugins/epicora-brand/node_modules/playwright');
const raiz = path.resolve(__dirname, '..');
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + path.join(raiz, 'tools/og.html'));
  await p.waitForSelector('body[data-pronto]');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(raiz, 'assets/og.jpg'), type: 'jpeg', quality: 88 });
  const i = await b.newPage({ viewport: { width: 180, height: 180 } });
  const svg = require('fs').readFileSync(path.join(raiz, 'favicon.svg'), 'utf8').replace('<svg ', '<svg width="180" height="180" ');
  await i.setContent(`<body style="margin:0;background:#08080a">${svg}</body>`);
  await i.waitForTimeout(200);
  await i.screenshot({ path: path.join(raiz, 'assets/img/apple-touch-icon.png') });
  await b.close();
  console.log('ok: og.jpg e apple-touch-icon.png');
})();
