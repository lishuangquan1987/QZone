import './styles.css';
import { api, ApiError } from './api';
import { state, setBoot, me, applyTheme, setUnread, setMe } from './state';
import { avatarHTML, esc, icon, toast } from './ui';
import { renderLogin } from './views/login';
import { renderHome } from './views/home';
import { renderJournals, renderJournalDetail } from './views/journals';
import { renderAlbums, renderAlbumDetail } from './views/albums';
import { renderGuestbook } from './views/guestbook';
import { renderFriends } from './views/friends';
import { renderVisitors } from './views/visitors';
import { renderMessages } from './views/messages';
import { renderSettings } from './views/settings';
import { renderSearch } from './views/search';
import { renderSpace } from './views/space';
import type { ViewRenderer } from './types';

const app = document.getElementById('app')!;

const ROUTES: { pattern: RegExp; tab: string; render: ViewRenderer }[] = [
  { pattern: /^\/home$/, tab: 'home', render: renderHome },
  { pattern: /^\/journals$/, tab: 'journals', render: renderJournals },
  { pattern: /^\/j\/([\w-]+)$/, tab: 'journals', render: renderJournalDetail },
  { pattern: /^\/albums$/, tab: 'albums', render: renderAlbums },
  { pattern: /^\/a\/([\w-]+)$/, tab: 'albums', render: renderAlbumDetail },
  { pattern: /^\/guestbook$/, tab: 'guestbook', render: renderGuestbook },
  { pattern: /^\/friends$/, tab: 'friends', render: renderFriends },
  { pattern: /^\/visitors$/, tab: 'visitors', render: renderVisitors },
  { pattern: /^\/messages$/, tab: 'messages', render: renderMessages },
  { pattern: /^\/settings$/, tab: 'settings', render: renderSettings },
  {
    pattern: /^\/me$/,
    tab: 'settings',
    render: (outlet, ctx) => renderSettings(outlet, { ...ctx, params: { ...ctx.params, tab: 'profile' } }),
  },
  { pattern: /^\/search$/, tab: '', render: renderSearch },
  { pattern: /^\/u\/(\d+)$/, tab: '', render: renderSpace },
];

function currentPath(): string {
  const raw = location.hash.replace(/^#/, '');
  if (!raw) return '/home';
  return raw.startsWith('/') ? raw.split('?')[0] : `/${raw.split('?')[0]}`;
}

function currentQuery(): URLSearchParams {
  const raw = location.hash.replace(/^#/, '');
  const i = raw.indexOf('?');
  return new URLSearchParams(i >= 0 ? raw.slice(i + 1) : '');
}

function matchRoute(path: string) {
  for (const r of ROUTES) {
    const m = path.match(r.pattern);
    if (m) {
      const params: Record<string, string> = {};
      if (m[1]) params.id = m[1];
      if (r.tab === '') {
        if (/^\/u\//.test(path)) params.uin = m[1];
      }
      return { route: r, params };
    }
  }
  return null;
}

/* ---------------- 登录 ---------------- */

let shellMounted = false;

async function boot(): Promise<boolean> {
  try {
    const s = await api.session();
    if (!s.authenticated || !s.user) return false;
    const b = await api.bootstrap();
    setBoot(b);
    applyTheme(b.me.theme);
    return true;
  } catch {
    return false;
  }
}

function showLogin(): void {
  shellMounted = false;
  (state as { boot: unknown }).boot = null;
  document.body.classList.remove('logged-in');
  renderLogin(app, async () => {
    if (await boot()) mountShell();
  });
}

/* ---------------- 主框架 ---------------- */

function navItems(): { key: string; label: string; href: string; icon: string }[] {
  return [
    { key: 'home', label: '说说', href: '#/home', icon: 'feed' },
    { key: 'journals', label: '日志', href: '#/journals', icon: 'book' },
    { key: 'albums', label: '相册', href: '#/albums', icon: 'image' },
    { key: 'guestbook', label: '留言板', href: '#/guestbook', icon: 'mail' },
    { key: 'friends', label: '好友', href: '#/friends', icon: 'users' },
    { key: 'visitors', label: '访客', href: '#/visitors', icon: 'eye' },
    { key: 'messages', label: '消息', href: '#/messages', icon: 'bell' },
  ];
}

function mountShell(): void {
  const u = me();
  const unread = state.boot?.unread ?? 0;
  document.body.classList.add('logged-in');

  app.innerHTML = `
  <header class="topbar">
    <div class="topbar-inner">
      <a class="logo" href="#/home">
        <span class="logo-mark">${icon('star', 18)}</span>
        <span class="logo-text">QQ空间</span>
      </a>
      <nav class="topnav">
        <a href="#/home" data-tab="home">主页</a>
        <a href="#/journals" data-tab="journals">日志</a>
        <a href="#/albums" data-tab="albums">相册</a>
        <a href="#/guestbook" data-tab="guestbook">留言板</a>
        <a href="#/friends" data-tab="friends">好友</a>
        <a href="#/me" data-tab="settings">个人档</a>
      </nav>
      <form class="top-search" id="global-search">
        <span class="search-ico">${icon('search', 15)}</span>
        <input name="q" placeholder="搜索说说、日志、好友" autocomplete="off">
      </form>
      <div class="top-actions">
        <a class="top-icon" href="#/messages" title="消息">
          ${icon('bell', 18)}<i class="badge" data-unread-badge ${unread ? '' : 'hidden'}>${unread > 99 ? '99+' : unread}</i>
        </a>
        <a class="top-icon" href="#/settings" title="装扮">${icon('gear', 18)}</a>
        <div class="user-chip" id="user-chip">
          ${avatarHTML(u.avatar, u.nickname, 30)}
          <span class="user-chip-name">${esc(u.nickname)}</span>
          <div class="user-menu" hidden>
            <a href="#/me">个人档</a>
            <a href="#/settings">空间装扮</a>
            <a href="#/u/${esc(u.uin)}">我的空间</a>
            <button id="logout-btn">${icon('logout', 14)} 退出登录</button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <section class="hero" id="hero">
    <div class="hero-cover" style="background-image:url('${esc(u.cover)}')"></div>
    <div class="hero-inner">
      <div class="hero-avatar">${avatarHTML(u.avatar, u.nickname, 84)}</div>
      <div class="hero-info">
        <h1 class="hero-name">${esc(u.nickname)}
          <span class="hero-level">Lv.${u.level}</span>
          ${u.vip ? `<span class="hero-vip">${icon('star', 11)}黄钻 ${u.vip}</span>` : ''}
        </h1>
        <p class="hero-sign">${esc(u.signature || '这个人很懒，什么都没留下')}</p>
        <div class="hero-tags">
          <span>${icon('pin', 12)} ${esc(u.city)}</span>
          <span>${esc(u.constellation)}</span>
          <span>${u.gender === 2 ? '女' : u.gender === 1 ? '男' : ''}</span>
          ${u.tags.slice(0, 3).map((t) => `<em class="hero-tag">${esc(t)}</em>`).join('')}
        </div>
      </div>
      <div class="hero-stats">
        <div><b>${u.posts}</b><span>说说</span></div>
        <div><b>${u.photos}</b><span>照片</span></div>
        <div><b>${u.journals}</b><span>日志</span></div>
        <div><b>${u.visitCount.toLocaleString()}</b><span>访客</span></div>
      </div>
    </div>
  </section>

  <div class="layout">
    <aside class="col-left">
      <div class="side-card">
        <div class="side-title">我的应用</div>
        <nav class="side-nav">
          ${navItems()
            .map(
              (n) => `<a href="${n.href}" data-side="${n.key}">
                ${icon(n.icon, 16)}<span>${n.label}</span>
                ${n.key === 'messages' ? `<i class="badge badge-inline" data-unread-badge ${unread ? '' : 'hidden'}>${unread}</i>` : ''}
              </a>`,
            )
            .join('')}
        </nav>
      </div>
      <div class="side-card">
        <div class="side-title">音乐盒</div>
        <div class="music">
          <div class="music-disc">${icon('music', 18)}</div>
          <div class="music-meta">
            <p class="music-name">${esc(u.bgMusic || '还没有设置背景音乐')}</p>
            <p class="music-sub">空间背景音乐</p>
          </div>
        </div>
      </div>
      <div class="side-card">
        <div class="side-title">花藤</div>
        <div class="garden">
          <p class="garden-sun">${icon('sun', 15)} 阳光值 <b id="sun-value">${u.sunValue}</b></p>
          <p class="garden-sub">连续签到 ${u.signStreak} 天</p>
          <button class="btn btn-primary btn-block btn-sm" id="signin-btn">今日签到</button>
        </div>
      </div>
    </aside>

    <main class="col-main" id="outlet"></main>

    <aside class="col-right" id="rail"></aside>
  </div>

  <footer class="footer">
    <span>QQ空间复刻版 · Go + TypeScript</span>
    <span class="footer-dot">·</span>
    <span>数据存储在本地 data/db.json</span>
  </footer>`;

  bindShell();
  renderRail();
  shellMounted = true;
  void renderRoute();
}

function bindShell(): void {
  document.getElementById('global-search')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (new FormData(e.target as HTMLFormElement).get('q') as string).trim();
    if (q) location.hash = `#/search?q=${encodeURIComponent(q)}`;
  });

  const chip = document.getElementById('user-chip')!;
  const menu = chip.querySelector<HTMLElement>('.user-menu')!;
  chip.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.user-menu')) return;
    menu.hidden = !menu.hidden;
  });
  document.addEventListener('click', (e) => {
    if (!chip.contains(e.target as Node)) menu.hidden = true;
  });

  document.getElementById('logout-btn')!.addEventListener('click', async () => {
    await api.logout();
    toast('已退出登录');
    showLogin();
  });

  document.getElementById('signin-btn')!.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    btn.disabled = true;
    try {
      const r = await api.signIn();
      toast(r.already ? '今天已经签过到啦' : `签到成功，连续 ${r.streak} 天`, 'ok');
      const sun = document.getElementById('sun-value');
      if (sun) sun.textContent = String(r.sunValue);
      btn.textContent = '已签到';
    } catch (err) {
      toast((err as Error).message, 'err');
      btn.disabled = false;
    }
  });
}

/** 右侧栏：个人档 / 今日访客 / 好友。 */
async function renderRail(): Promise<void> {
  const rail = document.getElementById('rail');
  if (!rail) return;
  const u = me();
  rail.innerHTML = `
    <div class="side-card profile-card">
      <div class="side-title">个人档</div>
      <div class="profile-rows">
        <div class="profile-row"><span>昵称</span><b>${esc(u.nickname)}</b></div>
        <div class="profile-row"><span>QQ</span><b>${esc(u.uin)}</b></div>
        <div class="profile-row"><span>等级</span><b>Lv.${u.level}</b></div>
        <div class="profile-row"><span>黄钻</span><b>${u.vip ? `Lv.${u.vip}` : '未开通'}</b></div>
        <div class="profile-row"><span>城市</span><b>${esc(u.city)}</b></div>
        <div class="profile-row"><span>星座</span><b>${esc(u.constellation)}</b></div>
      </div>
      <div class="profile-tags">${u.tags.map((t) => `<em>${esc(t)}</em>`).join('')}</div>
      <a class="btn btn-ghost btn-block btn-sm" href="#/settings">编辑个人档</a>
    </div>

    <div class="side-card">
      <div class="side-title">今日访客 <span class="side-extra" id="today-visit">—</span></div>
      <div class="mini-visitors" id="mini-visitors"><div class="mini-placeholder">加载中…</div></div>
      <a class="side-more" href="#/visitors">全部访客 ${icon('chevron', 12)}</a>
    </div>

    <div class="side-card">
      <div class="side-title">好友 <span class="side-extra">${state.boot?.friends.length ?? 0}</span></div>
      <div class="mini-friends">
        ${(state.boot?.friends ?? [])
          .slice(0, 9)
          .map(
            (f) => `<a class="mini-friend" href="#/u/${esc(f.uin)}" title="${esc(f.nickname)}">
              ${avatarHTML(f.avatar, f.nickname, 38)}<span>${esc(f.nickname)}</span>
            </a>`,
          )
          .join('')}
      </div>
      <a class="side-more" href="#/friends">全部好友 ${icon('chevron', 12)}</a>
    </div>

    <div class="side-card quote-card">
      <p class="quote-text">“${esc(u.signature || '生活明朗，万物可爱')}”</p>
      <p class="quote-by">— ${esc(u.nickname)}</p>
    </div>`;

  try {
    const v = await api.visitors(u.uin);
    const today = document.getElementById('today-visit');
    if (today) today.textContent = `${v.today} 人`;
    const box = document.getElementById('mini-visitors');
    if (box) {
      box.innerHTML = v.visitors.length
        ? v.visitors
            .slice(0, 6)
            .map(
              (x) => `<a class="mini-visitor" href="#/u/${esc(x.author.uin)}" title="${esc(x.module)}">
                ${avatarHTML(x.author.avatar, x.author.nickname, 34)}<span>${esc(x.author.nickname)}</span>
              </a>`,
            )
            .join('')
        : `<div class="mini-placeholder">还没有访客，去踩踩好友的空间吧</div>`;
    }
  } catch {
    /* 访客信息失败不阻塞页面 */
  }
}

/* ---------------- 路由渲染 ---------------- */

async function renderRoute(): Promise<void> {
  if (!shellMounted) return;
  const outlet = document.getElementById('outlet');
  if (!outlet) return;
  const path = currentPath();
  const hit = matchRoute(path);
  const params = { ...(hit?.params ?? {}), ...Object.fromEntries(currentQuery()) };

  // 访问他人空间时隐藏自己的封面横幅，避免身份重复
  const hero = document.getElementById('hero');
  if (hero) hero.hidden = path.startsWith('/u/');

  document.querySelectorAll<HTMLElement>('[data-tab]').forEach((el) => {
    el.classList.toggle('active', el.dataset.tab === hit?.route.tab);
  });
  document.querySelectorAll<HTMLElement>('[data-side]').forEach((el) => {
    el.classList.toggle('active', el.dataset.side === hit?.route.tab);
  });

  if (!hit) {
    outlet.innerHTML = `<div class="card notfound"><h2>页面走丢了</h2>
      <p>这条路径不存在，或者内容已经被删除。</p><a class="btn btn-primary" href="#/home">回到主页</a></div>`;
    return;
  }

  window.scrollTo({ top: 0 });
  const ctx = { params, reload: renderRoute, refreshRail: () => void renderRail() };
  try {
    await hit.route.render(outlet, ctx);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return;
    outlet.innerHTML = `<div class="card notfound"><h2>加载失败</h2>
      <p>${esc((err as Error).message)}</p><button class="btn btn-primary" id="retry">重试</button></div>`;
    outlet.querySelector('#retry')?.addEventListener('click', () => void renderRoute());
  }
}

/* ---------------- 启动 ---------------- */

window.addEventListener('hashchange', () => void renderRoute());
window.addEventListener('qz:expired', () => showLogin());

(async function start() {
  if (await boot()) {
    mountShell();
  } else {
    showLogin();
  }
})();

// 暴露给调试
(window as unknown as { qz: unknown }).qz = { state, setUnread, setMe };
