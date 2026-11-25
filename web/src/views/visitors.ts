import { api } from '../api';
import { me } from '../state';
import { avatarHTML, emptyState, esc, icon, timeAgo } from '../ui';
import type { ViewCtx } from '../types';

const TABS = [
  { key: 'in', label: '谁看过我' },
  { key: 'out', label: '我看过谁' },
  { key: 'blocked', label: '被挡访客' },
];

/** 访客：谁看过我 / 我看过谁 / 被挡访客。 */
export async function renderVisitors(outlet: HTMLElement, ctx: ViewCtx): Promise<void> {
  const u = me();
  const tab = ctx.params.tab || 'in';

  outlet.innerHTML = `
    <section class="card module-head">
      <div>
        <h2 class="module-title">${icon('eye', 18)} 访客</h2>
        <p class="module-sub" id="visit-sub">正在读取足迹…</p>
      </div>
      <span class="head-note">${icon('lock', 13)} 仅自己可见</span>
    </section>
    <nav class="module-tabs">
      ${TABS.map(
        (t) => `<button class="module-tab ${t.key === tab ? 'active' : ''}" data-vtab="${t.key}">${t.label}</button>`,
      ).join('')}
    </nav>
    <div id="visitor-list"></div>`;

  const list = outlet.querySelector<HTMLElement>('#visitor-list')!;
  const sub = outlet.querySelector('#visit-sub')!;

  outlet.querySelectorAll<HTMLElement>('[data-vtab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      location.hash = `#/visitors?tab=${btn.dataset.vtab}`;
    });
  });

  if (tab === 'blocked') {
    sub.textContent = '被挡访客需要黄钻权限';
    list.innerHTML = emptyState('暂无被挡访客', '开通黄钻后可查看被权限挡住的访客记录。');
    return;
  }

  const r = await api.visitors(u.uin, tab === 'out' ? 'out' : 'in');
  sub.textContent =
    tab === 'in'
      ? `累计 ${r.total.toLocaleString()} 人次 · 今日 ${r.today} 人`
      : `你最近访问了 ${r.visitors.length} 个空间`;

  list.innerHTML = r.visitors.length
    ? `<div class="card visitor-table">${r.visitors
        .map(
          (v) => `<div class="visitor-row">
            ${avatarHTML(v.author.avatar, v.author.nickname, 40, v.author.uin, v.author.level)}
            <div class="visitor-main">
              <a class="visitor-name" href="#/u/${esc(v.author.uin)}">${esc(v.author.nickname)}</a>
              <span class="visitor-mod">${tab === 'in' ? '看了' : '访问了'} · ${esc(v.module)}</span>
            </div>
            <time class="visitor-time">${timeAgo(v.at)}</time>
          </div>`,
        )
        .join('')}</div>`
    : emptyState(
        tab === 'in' ? '还没有人来过' : '还没有访问记录',
        tab === 'in' ? '多和好友互动，访客会多起来的。' : '去好友的空间逛一逛吧。',
        `<a class="btn btn-primary btn-sm" href="#/friends">去看看好友</a>`,
      );
}
