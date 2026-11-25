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

  const load = async () => {
    const r = await api.notifications();
    sub.textContent = r.unread ? `${r.unread} 条未读` : '全部已读';
    setUnread(r.unread);
    list.innerHTML = r.notifications.length
      ? `<div class="card msg-list">${r.notifications
          .map((n) => {
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
          })
          .join('')}</div>`
      : `<div class="card empty"><div class="empty-mark">${icon('bell', 22)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞、评论或留言时会出现在这里。</p></div>`;
  };
  await load();

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
