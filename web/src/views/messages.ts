import { api, type NotificationView } from '../api';
import { setUnread } from '../state';
import { avatarHTML, esc, icon, timeAgo, toast } from '../ui';
import type { ViewCtx } from '../types';

const KIND: Record<string, { icon: string; label: string; cls: string }> = {
  like: { icon: 'heart', label: '赞', cls: 'k-like' },
  comment: { icon: 'message', label: '评论', cls: 'k-comment' },
  guestbook: { icon: 'mail', label: '留言', cls: 'k-guest' },
  visit: { icon: 'eye', label: '访客', cls: 'k-visit' },
  system: { icon: 'bell', label: '系统', cls: 'k-system' },
};

function hrefOf(n: NotificationView): string {
  if (n.target.startsWith('post:')) return `#/post/${n.target.split(':')[1]}`;
  if (n.target.startsWith('album:')) return `#/album/${n.target.split(':')[1]}`;
  if (n.target === 'guestbook') return '#/guestbook';
  if (n.target === 'profile') return `#/u/${esc(n.from.uin)}`;
  return '#/home';
}

/** 消息中心。 */
export async function renderMessages(root: HTMLElement, _ctx: ViewCtx): Promise<void> {
  root.innerHTML = `<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">INBOX</p>
        <h1>消息</h1>
        <p class="page-sub" id="msg-sub">加载中…</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="read-all">${icon('check', 14)} 全部已读</button>
    </header>
    <div id="msg-list"></div>
  </div>`;

  const list = root.querySelector<HTMLElement>('#msg-list')!;
  const sub = root.querySelector<HTMLElement>('#msg-sub')!;

  // 游标分页：80 条一页，更早的消息用「加载更多」翻
  let nextBefore: string | null = null;
  let loadingMore = false;

  const moreBtn = (): string =>
    nextBefore
      ? `<div class="load-more"><button class="btn btn-ghost btn-sm" id="msg-more">加载更早的消息</button></div>`
      : '';

  const rowHTML = (n: NotificationView): string => {
    const k = KIND[n.kind] ?? KIND.system;
    return `<a class="msg-row ${n.read ? '' : 'unread'}" href="${hrefOf(n)}">
      <span class="msg-icon ${k.cls}">${icon(k.icon, 16)}</span>
      <div class="msg-body">
        <div class="msg-line">
          ${avatarHTML(n.from.avatar, n.from.nickname, 20, n.from.uin)}
          <b>${esc(n.from.nickname)}</b>
          <span>${esc(n.text)}</span>
        </div>
        <time>${timeAgo(n.at)} · ${k.label}</time>
      </div>
      ${n.read ? '' : '<i class="msg-dot"></i>'}
    </a>`;
  };

  const rowsHTML = (rows: NotificationView[]): string =>
    `<div class="card msg-list">${rows.map(rowHTML).join('')}</div>`;

  const load = async () => {
    const r = await api.notifications();
    sub.textContent = r.unread ? `${r.unread} 条未读` : '全部已读';
    setUnread(r.unread);
    nextBefore = r.hasMore ? (r.nextBefore ?? null) : null;
    list.innerHTML = r.notifications.length
      ? rowsHTML(r.notifications) + moreBtn()
      : `<div class="card empty"><div class="empty-mark">${icon('bell', 22)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞、评论或留言时会出现在这里。</p></div>`;
  };
  await load();

  list.addEventListener('click', async (e) => {
    if (!(e.target as HTMLElement).closest('#msg-more')) return;
    if (loadingMore || !nextBefore) return;
    loadingMore = true;
    const btn = list.querySelector<HTMLButtonElement>('#msg-more');
    const wrap = list.querySelector('.card.msg-list');
    if (btn) btn.disabled = true;
    try {
      const r = await api.notifications(nextBefore);
      nextBefore = r.hasMore ? (r.nextBefore ?? null) : null;
      btn?.parentElement?.remove();
      wrap?.insertAdjacentHTML('beforeend', r.notifications.map(rowHTML).join(''));
      list.insertAdjacentHTML('beforeend', moreBtn());
    } finally {
      loadingMore = false;
    }
  });

  root.querySelector('#read-all')!.addEventListener('click', async () => {
    try {
      const r = await api.readNotifications([]);
      setUnread(r.unread);
      toast('已全部标为已读', 'ok');
      await load();
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });
}
