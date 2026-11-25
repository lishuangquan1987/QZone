// 端到端验收：登录、背景音乐播放、写文章（含真实上传）、建相册并上传照片。
const { chromium } = require('playwright');
const path = require('node:path');

const BASE = process.env.APP_URL || 'http://127.0.0.1:8080';
const OUT = 'E:/Project2026/QZone/.qa';
const IMG = 'E:/Project2026/QZone/data/uploads/seed/p-lake.svg';

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()));

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.fill('input[name=uin]', '294388344');
  await page.fill('input[name=password]', 'qzone123');
  await page.click('#auth-submit');
  await page.waitForSelector('.hero', { timeout: 15000 });
  await page.waitForTimeout(600);

  // 背景音乐：真实 <audio> 播放
  const track = await page.evaluate(() => {
    const a = window.bgm && window.bgm.audio;
    return a ? { src: a.src.split('/').pop(), loop: a.loop, paused: a.paused, vol: a.volume } : null;
  });
  console.log('BGM initial:', JSON.stringify(track));
  await page.hover('.bgm');
  await page.waitForTimeout(400);
  await page.click('.bgm-toggle');
  await page.waitForTimeout(900);
  const playing = await page.evaluate(() => window.bgm.isPlaying());
  const current = await page.evaluate(() => window.bgm.audio && window.bgm.audio.currentTime);
  console.log('BGM playing:', playing, 'currentTime:', Number(current).toFixed(2));

  // 写文章 + 插图
  await page.goto(BASE + '/#/write');
  await page.waitForSelector('#title');
  await page.fill('#title', '端到端测试：一篇带插图的文章');
  await page.fill('#content', '## 小标题\n\n这是通过浏览器真实写入的正文，下面插一张图。\n\n- 列表一\n- 列表二\n');
  await page.setInputFiles('#img-input', IMG);
  await page.waitForTimeout(1200);
  const inserted = await page.inputValue('#content');
  console.log('图片已插入正文:', inserted.includes('!['));
  await page.click('#save-btn');
  await page.waitForSelector('.article-body', { timeout: 15000 });
  const url = page.url();
  console.log('发布后跳转:', url.split('#')[1]);
  const bodyImg = await page.locator('.article-body img').count();
  console.log('正文图片数量:', bodyImg);

  // 相册：新建 + 上传
  await page.goto(BASE + '/#/albums');
  await page.click('#new-album');
  await page.fill('#a-name', '端到端相册');
  await page.fill('#a-desc', '测试上传');
  await page.click('.modal-ok');
  await page.waitForTimeout(900);
  const albumLink = page.locator('.album-card', { hasText: '端到端相册' }).first();
  await albumLink.click();
  await page.waitForSelector('#photo-file', { state: 'attached' });
  await page.locator('#photo-file').setInputFiles(IMG, { force: true });
  await page.waitForTimeout(1500);
  const photos = await page.locator('.photo').count();
  console.log('相册照片数量:', photos);

  await page.goto(BASE + '/#/albums');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, 'albums2.png'), fullPage: true });

  // 文章页（含评论）
  await page.goto(BASE + '/#/post/1');
  await page.waitForSelector('.comments');
  await page.waitForTimeout(500);
  const comments = await page.locator('.comment').count();
  console.log('文章评论数:', comments);

  // 设置 / 消息 / 访客 / 关于
  for (const [hash, name] of [
    ['#/settings', 'settings2'],
    ['#/settings?tab=music', 'settings-music'],
    ['#/messages', 'messages2'],
    ['#/visitors', 'visitors2'],
    ['#/about', 'about2'],
    ['#/guestbook', 'guestbook2'],
  ]) {
    await page.goto(BASE + '/' + hash);
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
  }

  // 退出后的登录页
  await page.evaluate(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  });
  await page.goto(BASE + '/');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, 'auth2.png'), fullPage: false });

  if (errors.length) console.log('PAGE_ERRORS:\n' + errors.slice(0, 10).join('\n'));
  else console.log('PAGE_ERRORS: none');
  await browser.close();
})().catch((e) => {
  console.error('FAILED', e.message);
  process.exit(1);
});
