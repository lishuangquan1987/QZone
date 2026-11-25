// 无头 Edge 截图工具：登录后按路由截图，用于验收渲染效果。
// 用法: node shot.mjs <outPrefix> <hash1> [hash2...]
const PORT = process.env.CDP_PORT || '9333';
const BASE = process.env.APP_URL || 'http://127.0.0.1:8080';

const [prefix = 'shot', ...routes] = process.argv.slice(2);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function newTarget(url) {
  const res = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  if (!res.ok) throw new Error('创建标签页失败: ' + res.status + ' ' + (await res.text()));
  return res.json();
}

function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    } else if (msg.method) {
      listeners.forEach((fn) => fn(msg));
    }
  });
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });
  return {
    ready,
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const myId = ++id;
        pending.set(myId, { resolve, reject });
        ws.send(JSON.stringify({ id: myId, method, params }));
      });
    },
    on(fn) {
      listeners.push(fn);
    },
    close() {
      ws.close();
    },
  };
}

async function main() {
  const target = await newTarget('about:blank');
  const c = cdp(target.webSocketDebuggerUrl);
  await c.ready;
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  await c.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const loaded = () => new Promise((resolve) => {
    const t = setTimeout(resolve, 4000);
    c.on((m) => {
      if (m.method === 'Page.loadEventFired') {
        clearTimeout(t);
        resolve();
      }
    });
  });

  const nav = async (url) => {
    const p = loaded();
    await c.send('Page.navigate', { url });
    await p;
    await sleep(900);
  };

  await nav(BASE + '/');
  // 登录
  await c.send('Runtime.evaluate', {
    expression: `(async () => {
      const u = document.querySelector('input[name=uin]');
      const p = document.querySelector('input[name=password]');
      if (!u) return 'no-form';
      u.value = '294388344'; p.value = 'qzone123';
      document.querySelector('#login-form').dispatchEvent(new Event('submit', {cancelable:true, bubbles:true}));
      return 'submitted';
    })()`,
    awaitPromise: true,
  });
  await sleep(2200);

  const list = routes.length ? routes : ['/home'];
  for (const r of list) {
    const hash = r.startsWith('#') ? r : '#' + r;
    await c.send('Runtime.evaluate', { expression: `location.hash = ${JSON.stringify(hash)}` });
    await sleep(1400);
    const metrics = await c.send('Runtime.evaluate', {
      expression: `JSON.stringify({h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth, title: document.title})`,
      returnByValue: true,
    });
    const info = JSON.parse(metrics.result.value);
    const height = Math.min(Math.max(info.h, 900), 3400);
    await c.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(500);
    const shot = await c.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const name = `${prefix}-${hash.replace(/[#/?=&]/g, '_')}.png`;
    const fs = await import('node:fs');
    fs.writeFileSync(name, Buffer.from(shot.data, 'base64'));
    console.log('saved', name, `${info.w}x${height}`, 'title=' + info.title);
  }

  c.close();
}

main().catch((e) => {
  console.error('FAILED', e.message);
  process.exit(1);
});
