import { api } from '../api';
import { me } from '../state';
import { avatarHTML, emptyState, esc, icon, timeAgo } from '../ui';
import type { ViewCtx } from '../types';

const TABS = [
  { key: 'in', label: '谁看过我' },
  { key: 'out', label: '我看过谁' },
];

/** 访客记录（仅主人可见）。 */
export async function renderVisitors(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const u = me();
  const tab = ctx.params.tab === 'out' ? 'out' : 'in';

  root.innerHTML = `<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">VISITORS</p>
        <h1>访客</h1>
        <p class="page-sub" id="visit-sub">读取中…</p>
      </div>
      <span class="lock-note">${icon('lock', 13)} 仅自己可见</span>
    </header>
    <nav class="seg">
      ${TABS.map((t) => `<button class="seg-btn ${t.key === tab ? 'active' : ''}" data-tab="${t.key}" aria-pressed="${t.key === tab}">${t.label}</button>`).join('')}
    </nav>
    <div id="visit-list"></div>
  </div>`;

  root.querySelectorAll<HTMLElement>('[data-tab]').forEach((b) => {
    b.addEventListener('click', () => {
      location.hash = `#/visitors?tab=${b.dataset.tab}`;
    });
  });

  const list = root.querySelector<HTMLElement>('#visit-list')!;
  const rowHTML = (v: { author: { uin: string; avatar: string; nickname: string }; module: string; at: string }): string =>
    `<a class="visit-row" href="#/u/${esc(v.author.uin)}">
      ${avatarHTML(v.author.avatar, v.author.nickname, 40, v.author.uin)}
      <div class="visit-main">
        <b>${esc(v.author.nickname)}</b>
        <span>${tab === 'in' ? '看了' : '访问了'} · ${esc(v.module)}</span>
      </div>
      <time>${timeAgo(v.at)}</time>
    </a>`;

  // 游标分页：60 条一页，更早的记录用「加载更多」翻
  let nextBefore: string | null = null;
  let loadingMore = false;
  const moreBtn = (): string =>
    nextBefore
      ? `<div class="load-more"><button class="btn btn-ghost btn-sm" id="visit-more">加载更早的记录</button></div>`
      : '';

  const r = await api.visitors(u.uin, tab);
  root.querySelector('#visit-sub')!.textContent =
    tab === 'in' ? `累计 ${r.total.toLocaleString()} 人次 · 今日 ${r.today} 人` : `你最近访问了 ${r.visitors.length} 个空间`;
  nextBefore = r.hasMore ? (r.nextBefore ?? null) : null;

  list.innerHTML = r.visitors.length
    ? `<div class="card visit-list">${r.visitors.map(rowHTML).join('')}</div>${moreBtn()}`
    : emptyState(
        tab === 'in' ? '还没有人来过' : '还没有访问记录',
        tab === 'in' ? '多和好友互动，访客会多起来的。' : '去别人的主页逛一逛吧。',
        `<a class="btn btn-primary btn-sm" href="#/search">去搜索好友</a>`,
      );

  list.addEventListener('click', async (e) => {
    if (!(e.target as HTMLElement).closest('#visit-more')) return;
    if (loadingMore || !nextBefore) return;
    loadingMore = true;
    const btn = list.querySelector<HTMLButtonElement>('#visit-more');
    if (btn) btn.disabled = true;
    try {
      const more = await api.visitors(u.uin, tab, nextBefore);
      nextBefore = more.hasMore ? (more.nextBefore ?? null) : null;
      btn?.parentElement?.remove();
      list.querySelector('.card.visit-list')?.insertAdjacentHTML('beforeend', more.visitors.map(rowHTML).join(''));
      list.insertAdjacentHTML('beforeend', moreBtn());
    } finally {
      loadingMore = false;
    }
  });
}
