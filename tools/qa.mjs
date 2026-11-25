// 使用 Playwright 登录后按路由整页截图，用于视觉验收。
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.APP_URL || 'http://127.0.0.1:8080';
const OUT = process.env.OUT_DIR || path.join(__dirname, '..', '.qa');
const routes = process.argv.slice(2);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text());
  });

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(OUT, 'login.png'), fullPage: true });

  await page.fill('input[name=uin]', '294388344');
  await page.fill('input[name=password]', 'qzone123');
  await page.click('#login-submit');
  await page.waitForSelector('.hero', { timeout: 15000 });
  await page.waitForTimeout(1200);

  for (const r of routes.length ? routes : ['#/home']) {
    const hash = r.startsWith('#') ? r : '#' + r;
    await page.evaluate((h) => { location.hash = h; }, hash);
    await page.waitForTimeout(1500);
    const slug = hash.replace(/[#/?=&]+/g, '-').replace(/^-|-$/g, '') || 'root';
    const file = path.join(OUT, slug + '.png');
    await page.screenshot({ path: file, fullPage: true });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log('saved', file, 'height=' + h);
  }

  if (errors.length) console.log('PAGE_ERRORS:\n' + errors.join('\n'));
  await browser.close();
})().catch((e) => {
  console.error('FAILED', e.message);
  process.exit(1);
});
