import './styles.css';
import { DEMO } from './env';
import { api, ApiError } from './api';
import { state, setBoot, me, applyTheme, unread, resetViewAbort } from './state';
import { bgm } from './music';
import { bindThemeToggle, themeToggleHTML } from './theme';
import { avatarHTML, esc, icon, toast } from './ui';
import { renderAuth } from './views/auth';
import { renderHome } from './views/home';
import { renderPosts } from './views/posts';
import { renderPost } from './views/post';
import { renderEditor } from './views/editor';
import { renderAlbums, renderAlbum } from './views/albums';
import { renderGuestbook } from './views/guestbook';
import { renderAbout } from './views/about';
import { renderSpace } from './views/space';
import { renderMessages } from './views/messages';
import { renderVisitors } from './views/visitors';
import { renderSettings } from './views/settings';
import { renderSearch } from './views/search';
import type { ViewRenderer } from './types';

const app = document.getElementById('app')!;

interface RouteDef {
  pattern: RegExp;
  nav: string;
  render: ViewRenderer;
}

const ROUTES: RouteDef[] = [
  { pattern: /^\/home$/, nav: 'home', render: renderHome },
  { pattern: /^\/posts$/, nav: 'posts', render: renderPosts },
  { pattern: /^\/post\/(\d+)$/, nav: 'posts', render: renderPost },
  { pattern: /^\/write$/, nav: '', render: renderEditor },
  { pattern: /^\/edit\/(\d+)$/, nav: '', render: renderEditor },
  { pattern: /^\/albums$/, nav: 'albums', render: renderAlbums },
  { pattern: /^\/album\/(\d+)$/, nav: 'albums', render: renderAlbum },
  { pattern: /^\/guestbook$/, nav: 'guestbook', render: renderGuestbook },
  { pattern: /^\/about$/, nav: 'about', render: renderAbout },
  { pattern: /^\/u\/([^/]+)$/, nav: '', render: renderSpace },
  { pattern: /^\/messages$/, nav: '', render: renderMessages },
  { pattern: /^\/visitors$/, nav: '', render: renderVisitors },
  { pattern: /^\/settings$/, nav: '', render: renderSettings },
  { pattern: /^\/search$/, nav: '', render: renderSearch },
];

let shellMounted = false;
let menuOpen = false;

// 路由切换的顶部进度条：只有真的慢了才显示，避免一闪而过
let barTimer = 0;
function beginRoute(): HTMLElement {
  let bar = document.getElementById('route-bar');
  if (!bar) {
    bar = document.createElement('i');
    bar.id = 'route-bar';
    document.body.appendChild(bar);
  }
  bar.className = '';
  window.clearTimeout(barTimer);
  barTimer = window.setTimeout(() => {
    if (bar && bar.className === '') bar.className = 'on';
  }, 150);
  return bar;
}
function endRoute(bar: HTMLElement): void {
  window.clearTimeout(barTimer);
  if (bar.className !== 'on') {
    bar.className = '';
    return;
  }
  bar.className = 'done';
  barTimer = window.setTimeout(() => {
    if (bar.className === 'done') bar.className = '';
  }, 320);
}

function parseHash(): { path: string; query: URLSearchParams } {
  const raw = location.hash.replace(/^#/, '') || '/home';
  const [p, q = ''] = raw.split('?');
  return { path: p.startsWith('/') ? p : `/${p}`, query: new URLSearchParams(q) };
}

function matchRoute(path: string) {
  for (const r of ROUTES) {
    const m = path.match(r.pattern);
    if (m) return { def: r, id: m[1] ?? '' };
  }
  return null;
}

async function boot(): Promise<boolean> {
  try {
    // session 已经带回 user / unread / themes，不必再发一次 bootstrap
    const s = await api.session();
    if (!s.authenticated || !s.user) return false;
    setBoot({ me: s.user, themes: s.themes ?? [], unread: s.unread ?? 0 });
    applyTheme(s.user.theme);
    return true;
  } catch {
    return false;
  }
}

function showAuth(): void {
  shellMounted = false;
  (state as { boot: unknown }).boot = null;
  document.body.classList.remove('signed-in');
  bgm.unmount();
  renderAuth(app, async () => {
    if (await boot()) mountShell();
  });
}

function navLink(href: string, key: string, label: string): string {
  return `<a class="nav-link" data-nav="${key}" href="${href}">${label}</a>`;
}

function mountShell(): void {
  const u = me();
  document.body.classList.add('signed-in');

  app.innerHTML = `
  <header class="site-head">
    <div class="head-inner">
      <a class="brand" href="#/home">
        <span class="brand-mark">${icon('pen', 15)}</span>
        <span class="brand-text">${esc(u.nickname)}<i>的空间</i></span>
      </a>

      <nav class="head-nav">
        ${navLink('#/home', 'home', '首页')}
        ${navLink('#/posts', 'posts', '文章')}
        ${navLink('#/albums', 'albums', '相册')}
        ${navLink('#/guestbook', 'guestbook', '留言板')}
        ${navLink('#/about', 'about', '关于')}
      </nav>

      <form class="head-search" id="head-search">
        <span class="hs-icon">${icon('search', 15)}</span>
        <input name="q" placeholder="搜索文章、好友" autocomplete="off">
      </form>

      <div class="head-actions">
        <a class="btn btn-primary btn-sm write-btn" href="#/write">${icon('pen', 14)}<span>写文章</span></a>
        ${themeToggleHTML('theme-toggle', 17)}
        <a class="icon-btn badge-host" href="#/messages" title="消息">
          ${icon('bell', 18)}<i class="badge" data-unread ${unread() ? '' : 'hidden'}>${unread()}</i>
        </a>
        <div class="user-chip" id="user-chip">
          ${avatarHTML(u.avatar, u.nickname, 32)}
          <div class="user-menu" id="user-menu" hidden>
            <div class="menu-head">
              <b>${esc(u.nickname)}</b>
              <span>@${esc(u.uin)}</span>
            </div>
            <a href="#/u/${esc(u.uin)}">${icon('grid', 14)} 我的主页</a>
            <a href="#/visitors">${icon('eye', 14)} 访客记录</a>
            <a href="#/settings">${icon('settings', 14)} 空间设置</a>
            <button id="logout-btn">${icon('logout', 14)} 退出登录</button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main id="view" class="view"></main>

  <nav class="mobile-tabs" aria-label="主导航">
    <a class="mtab" data-nav="home" href="#/home">${icon('pen', 19)}<span>首页</span></a>
    <a class="mtab" data-nav="posts" href="#/posts">${icon('book', 19)}<span>文章</span></a>
    <a class="mtab" data-nav="albums" href="#/albums">${icon('image', 19)}<span>相册</span></a>
    <a class="mtab" data-nav="guestbook" href="#/guestbook">${icon('mail', 19)}<span>留言</span></a>
    <a class="mtab" data-nav="about" href="#/about">${icon('grid', 19)}<span>关于</span></a>
  </nav>

  <footer class="site-foot">
    <span>${esc(u.nickname)} · 个人空间</span>
    <span class="foot-sep">·</span>
    <span>Go + ent + SQLite · TypeScript</span>
  </footer>`;

  const search = document.getElementById('head-search') as HTMLFormElement;
  search.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = String(new FormData(search).get('q') ?? '').trim();
    if (q) location.hash = `#/search?q=${encodeURIComponent(q)}`;
  });

  bindThemeToggle(document, 'theme-toggle');

  const chip = document.getElementById('user-chip')!;
  chip.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a,button')) return;
    menuOpen = !menuOpen;
    (document.getElementById('user-menu') as HTMLElement).hidden = !menuOpen;
  });
  document.addEventListener('click', (e) => {
    if (!chip.contains(e.target as Node) && menuOpen) {
      menuOpen = false;
      (document.getElementById('user-menu') as HTMLElement).hidden = true;
    }
  });

  document.getElementById('logout-btn')!.addEventListener('click', async () => {
    await api.logout();
    toast('已退出登录');
    showAuth();
  });

  shellMounted = true;
  bgm.setTrack(u.bgmUrl, u.bgmTitle);
  bgm.mount();
  void renderRoute();
}

// 快速连点导航时，先发起的渲染可能后完成。用序号丢弃过期结果，
// 否则旧页面会把新页面覆盖掉。
let routeSeq = 0;

async function renderRoute(): Promise<void> {
  if (!shellMounted) return;
  const view = document.getElementById('view');
  if (!view) return;
  const seq = ++routeSeq;
  const { path, query } = parseHash();
  const hit = matchRoute(path);
  // 写作页会给 body 加 writer-mode（锁滚动），换路由时先复位
  if (!path.startsWith('/write') && !path.startsWith('/edit/')) {
    document.body.classList.remove('writer-mode');
  }

  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((el) => {
    el.classList.toggle('active', el.dataset.nav === hit?.def.nav);
  });

  resetViewAbort();
  const bar = beginRoute();
  try {
    if (!hit) {
      view.innerHTML = `<div class="page narrow"><div class="card empty">
        <h2 class="empty-title">页面不存在</h2>
        <p class="empty-desc">这条链接可能已经失效。</p>
        <a class="btn btn-primary" href="#/home">回到首页</a>
      </div></div>`;
      return;
    }

    const params: Record<string, string> = { ...Object.fromEntries(query) };
    if (hit.id) {
      params.id = hit.id;
      if (hit.def.pattern.source.includes('[^/]')) params.uin = hit.id;
    }

    window.scrollTo({ top: 0 });
    const ctx = { params, reload: renderRoute };
    await hit.def.render(view, ctx);
    if (seq !== routeSeq) return;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return;
    view.innerHTML = `<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">加载失败</h2>
      <p class="empty-desc">${esc((err as Error).message)}</p>
      <button class="btn btn-primary" id="retry">重试</button>
    </div></div>`;
    view.querySelector('#retry')?.addEventListener('click', () => void renderRoute());
  } finally {
    endRoute(bar);
  }
}

window.addEventListener('hashchange', () => void renderRoute());
window.addEventListener('qz:expired', () => showAuth());

(async function start() {
  if (DEMO) void import('./demo').then((m) => m.demoNotice());
  if (await boot()) mountShell();
  else showAuth();
})();

// 设置页更新个人档后同步背景音乐
window.addEventListener('qz:profile', (e) => {
  const detail = (e as CustomEvent<{ bgmUrl: string; bgmTitle: string }>).detail;
  if (detail) bgm.setTrack(detail.bgmUrl, detail.bgmTitle);
});
